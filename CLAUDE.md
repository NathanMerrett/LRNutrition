# CLAUDE.md

## Project

Laura Reynolds Nutrition: a marketing site for a nutrition coaching practice.
The client writes and publishes blog posts herself in Sanity Studio.

This is a lean brochure site, not an app.

### Repo layout

Two packages, deployed separately:

- `app/` — the Astro website
- `studio/` — the Sanity Studio

There is no package at the repo root. All `npm` commands run inside one of these.

### Routes

Multi-page, not a single scrolling homepage:

- `/` — hero, how it works, services teaser, blog teaser
- `/about` — bio and credentials
- `/services` — services, prices and the introductory offer. Data lives in `app/src/data/services.ts`, shared with the homepage teaser
- `/blog` and `/blog/[slug]`
- `/enquire` and `/enquire/success`
- `/privacy` and `/terms`

## Stack

- Astro with static output.
- TypeScript
- Sanity for blog content only.
- Netlify for hosting, and Netlify Forms for enquiries. Submissions are emailed; there is no database.

## Commands

Website (`cd app` first):

- `npm run dev`: local dev server
- `npm run build`: production build. Must pass before any task is done.
- `npm run preview`: preview the built site
- `npx astro check`: type-check `.astro` and `.ts` files.
  Needs `@astrojs/check` and `typescript` as devDependencies — not installed yet.

Studio (`cd studio` first):

- `npm run dev`: local Studio
- `npm run deploy`: publish the Studio to `*.sanity.studio`. Currently manual.

## Conventions

### Styling
- `DESIGN.md` (repo root) is the source of truth for the visual design. Don't introduce colours, fonts or sizes it doesn't define; propose an addition instead.
- Global CSS lives in `app/src/styles/`. `global.css` is only the entry point (imported once in `Layout.astro`); it declares the cascade layers and imports, in order:
  - `tokens.css`: all design tokens. The only `:root` in the project; never declare `:root` anywhere else.
  - `fonts.css`: `@font-face` declarations.
  - `base.css`: reset, element defaults (headings, links, focus), `.visually-hidden`.
  - `components.css`: shared classes (`.container`, `.section`, `.btn-*`, `.card`, `.band`, `.page-hero`, `.cta-band`, `.eyebrow`, `.lede`, `.badge`, `.prose`).
  - `motion.css`: `.reveal`, `.enter`, view transitions, reduced motion.
- Layer order is `tokens, reset, base, components, motion, utilities`. A component's scoped `<style>` is unlayered, so it always beats the global layers without specificity tricks.
- Always use tokens (`var(--...)`) for colour, spacing, type and radius. Never hard-code values. If a token is missing, add it to `tokens.css` and mention it.
- Font sizes come only from the six-step scale: `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-small`, `--text-label`. Weights only 400/500/600. Sentence case, no `text-transform: uppercase`.
- Component-specific styles go in that component's scoped `<style>` block. If two pages need the same styles, move them to `components.css`.
- Mobile first, relative units, and no horizontal scrolling at any width.
- Contrast rules (WCAG AA):
  - The palette is coral (`--color-brand`), its blush tint (`--color-accent`) and espresso (`--color-primary` / `--color-text`). There is no green or terracotta.
  - Coral is a fill only. As text, or as a thin line that carries meaning, it is 2.3:1 on the background.
  - A `.band` is coral, or blush with `.band-soft`. Text inside is always `--color-text`; muted text fails on both. Use the normal `.btn-primary` / `.btn-secondary` inside bands.
  - `--color-border` (1.3:1) is for dividers only. Form inputs use `--color-text-muted` for their border so they stay findable.
- Don't dim text with `opacity` on a coloured band — it silently drops contrast
  below AA. Use an explicit colour and set hierarchy with size and weight.
- Fonts are self-hosted variable woff2 in `app/public/fonts/` (Fraunces for headings, DM Sans for everything else), declared in
  `fonts.css` and preloaded in `Layout.astro`. No third-party font request.

### Motion
- All animation is CSS, zero JS. `.reveal` uses `animation-timeline: view()` for
  scroll reveals; `.enter` is for above-the-fold content, staggered with `--i`.
- `.reveal` must stay inside its `@supports (animation-timeline: view())` guard.
  Without it, browsers lacking support pin the content at `opacity: 0` forever.
- Under `prefers-reduced-motion: reduce`, `.reveal`/`.enter` are hard-reset to
  `opacity: 1`. Visibility must never depend on an animation having run.
- Hover effects go inside `@media (hover: hover)`, or they stick after a tap on
  touch devices.
- Page transitions come from the CSS `@view-transition` rule in `motion.css`,
  not Astro's `<ClientRouter />` — that one ships a JS router.

### Components
- Use `.astro` components by default. Don't add React, Vue or Svelte islands unless asked.
- Prefer native HTML (`<dialog>`, `<details>`, `<form>`) plus minimal vanilla JS in `<script>` tags.
- Each homepage section is one component in `src/components/`.
- Designs come from Figma Make exports, which use React, shadcn and Tailwind. When adapting one, convert it to Astro, strip out React, shadcn and Tailwind, and restyle it with tokens. Never install those packages.
- Use semantic HTML and accessible markup throughout: landmarks, heading order, alt text, labels, and visible focus states.

### Blog data
- All blog data access goes through `app/src/data/posts.ts` (`getPosts()`, `getLatestPosts(n)`, `getPost(slug)`, `formatDate()`, `imageUrl()`).
- Pages and components never import the Sanity client directly. `posts.ts` is the single integration point, so keep it that way.
- The Sanity schema is in `studio/schemaTypes/post.ts`, with fields `title`, `slug`, `summary`, `mainImage`, `publishedAt`, `readingTime` and `body`.
- Author, categories and SEO fields are deliberately deferred. Don't add them unless asked.
- `useCdn` is deliberately `false`. The CDN can serve stale data just after a publish, which is exactly when a webhook-triggered build runs.

### Portable Text
- Rendered by `app/src/components/PortableText.astro`, hand-written rather than using `astro-portabletext`.
- It splits into `PortableTextBlock.astro` (headings, paragraphs, quotes, images), `PortableTextList.astro` (nested lists) and `PortableTextSpan.astro` (marks and links).
- Gotcha: a dynamic tag name (`<Tag>`) only works when the variable is in a component's **frontmatter**. Computing one inside a template callback emits malformed markup like `<p="true">`. That's why block rendering is its own component.
- Gotcha: Portable Text has no list elements. It emits a flat run of blocks carrying `listItem` and `level`, which must be regrouped — rendering one `<ul>` per item is the classic bug.
- Body headings start at `<h2>`; the post title is the `<h1>`. An `h1` in the body is demoted.

## Enquiry form (Netlify Forms)

- There is exactly **one** enquiry form, on `/enquire`. It posts normally and redirects to `/enquire/success` — no JS, no modal. "Get Started" buttons are plain links to `/enquire`.
- Don't reintroduce a second copy of the form. Two forms sharing `name="enquiry"` have to be kept field-for-field identical or submissions lose data.
- The form must exist in the built static HTML so Netlify can detect it at deploy. Never render it only via client-side JS.
- Required attributes: `name="enquiry"`, `method="POST"`, `data-netlify="true"`, and `netlify-honeypot="bot-field"` with a hidden `bot-field` input.
- Avoid submitting with `fetch`. `fetch` only rejects on network failure, so a 404 or 500 resolves normally and a naive handler reports success for a lost enquiry. If you ever do need it, check `res.ok` explicitly.
- Every input needs a proper `<label>`. Use the correct input `type` (`email`, `tel`) and mark required fields.
- Show a clear success state and a clear error state.
- Keep fields minimal: name, email, and a message, plus optionally what they're interested in. Don't add fields asking for health details. Link to the privacy policy near the submit button.
- Forms do not submit on `npm run dev`. Test them on a Netlify deploy preview.

## Environment variables

- The Sanity project ID and dataset are safe to expose. Check `app/.env.example` and `studio/.env.example` for the exact names.
- The two packages use different names for the same values: the site reads `PUBLIC_SANITY_*`, the Studio reads `SANITY_STUDIO_*`. Both must point at the same project and dataset.
- `app/.env` is only used locally. The same variables must also be set in the Netlify site config or production builds fail.
- Any Sanity token must NOT use the `PUBLIC_` prefix and must never reach client-side code.
- Never commit `.env`. Update `.env.example` whenever you add a variable.

## How to work with me

- For any change touching more than two files, propose a short plan first and wait for my go-ahead.
- Ask before adding any dependency. Say why it's needed and what the native alternative would be.
- Keep changes small and focused. Don't refactor or reformat code unrelated to the task.
- After making changes, inform me to run `npm run build` and `npx astro check`, and fix any errors before saying you're done.
- Don't commit or push unless I ask.
- If something in this file looks wrong or out of date, tell me rather than silently working around it.