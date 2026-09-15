# CLAUDE.md

## Project

Laura Reynolds Nutrition: a marketing site for a nutrition coaching practice.
The client writes and publishes blog posts herself in Sanity Studio.

This is a lean brochure site, not an app. Prefer the simplest solution that works.

### Repo layout

Two packages, deployed separately:

- `app/` — the Astro website
- `studio/` — the Sanity Studio

There is no package at the repo root. All `npm` commands run inside one of these.

### Routes

Multi-page, not a single scrolling homepage:

- `/` — hero, how it works, blog teaser
- `/about` — bio and credentials
- `/blog` and `/blog/[slug]`
- `/enquire` and `/enquire/success`
- `/privacy` and `/terms`

## Stack

- Astro with static output. No SSR adapter.
- TypeScript
- Plain CSS with design tokens. No Tailwind, no CSS-in-JS, no UI libraries.
- Sanity for blog content only, read at build time via `@sanity/client`. Post bodies use Portable Text.
- Netlify for hosting, and Netlify Forms for enquiries. Submissions are emailed; there is no database.
- The site ships zero client-side JavaScript. Keep it that way unless there's a real reason not to.

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
- Design tokens live in `:root` in `app/src/styles/global.css`, which is imported once in `Layout.astro`. Never declare `:root` anywhere else.
- Always use tokens (`var(--...)`) for colour, spacing, type and radius. Never hard-code values. If a token is missing, add it to `global.css` and mention it.
- Component-specific styles go in that component's scoped `<style>` block.
- Mobile first, relative units, and no horizontal scrolling at any width.
- Some one-off sizes are still literals (e.g. `0.65rem`, `1.05rem`) because snapping them to the scale would change the design. Tokenise them only as a deliberate design decision, not incidentally.
- Never use `var(--coral)` for text. It is a mid-tone and fails WCAG AA as small
  text on cream or white, and cream text fails on top of it. Text uses
  `--coral-text`; buttons use `--coral-btn` with cream text. `--coral` is for
  large decorative areas only.
- Don't dim text with `opacity` on a coloured band — it silently drops contrast
  below AA. Use an explicit colour and set hierarchy with size and weight.
- Fonts are self-hosted variable woff2 in `app/public/fonts/`, declared in
  `global.css` and preloaded in `Layout.astro`. No third-party font request.

### Motion
- All animation is CSS, zero JS. `.reveal` uses `animation-timeline: view()` for
  scroll reveals; `.enter` is for above-the-fold content, staggered with `--i`.
- `.reveal` must stay inside its `@supports (animation-timeline: view())` guard.
  Without it, browsers lacking support pin the content at `opacity: 0` forever.
- Under `prefers-reduced-motion: reduce`, `.reveal`/`.enter` are hard-reset to
  `opacity: 1`. Visibility must never depend on an animation having run.
- Hover effects go inside `@media (hover: hover)`, or they stick after a tap on
  touch devices.
- Page transitions come from the CSS `@view-transition` rule in `global.css`,
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

## Gotchas

- Tailwind v4 was tried and removed after a Vite error (`No Astro CSS at index 0`). Do not reintroduce it.
- The site is static, so new Sanity posts only appear after a rebuild. A Sanity webhook should trigger a Netlify build hook.
- `app/netlify.toml` has an `ignore` rule that skips builds when nothing in `app/` changed. It checks `INCOMING_HOOK_TITLE` first, because webhook builds have no new commit and would otherwise always be cancelled — silently breaking publishing. Don't simplify that condition away.
- `netlify.toml` lives in `app/`, so Netlify only reads it when the site's base directory is set to `app`.
- Studio and the website deploy separately. Schema changes need a Studio redeploy, not just a site deploy.
- Astro ignores `src/pages` files whose names start with `_`, so a scratch page named `_foo.astro` will never build.

## How to work with me

- I'm learning agentic coding. When you introduce an unfamiliar concept or tool, explain it briefly. I want to understand why, not just what.
- For any change touching more than two files, propose a short plan first and wait for my go-ahead.
- Ask before adding any dependency. Say why it's needed and what the native alternative would be.
- Keep changes small and focused. Don't refactor or reformat code unrelated to the task.
- After making changes, run `npm run build` and `npx astro check`, and fix any errors before saying you're done.
- Don't commit or push unless I ask.
- If something in this file looks wrong or out of date, tell me rather than silently working around it.

## Current status

Keep this section short and update it as work lands.

- Done: all pages built and restyled in the current design (Fraunces/Inter,
  cream canvas with coral accent bands, card hovers, CSS scroll reveals, CSS
  view transitions); design tokens in `global.css`; homepage sections extracted
  to `src/components/`; Sanity wired into `posts.ts` with a hand-rolled Portable
  Text renderer; single no-JS enquiry form; `/privacy` and `/terms` created.
- Verified: zero client JS, no horizontal scroll down to 320px, WCAG AA contrast
  on every page, reveals resolve under reduced motion, `npx astro check` clean.
- Blocked on Laura: the `[CONFIRM: …]` placeholders in `privacy.astro` and
  `terms.astro`, and the `[University name]` / `[Professional body]` placeholders
  in `about.astro`. Also the real photo for `about.astro` (placeholder box) and
  the two `href="#"` social links in `Layout.astro`.
- Next: set `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` in Netlify;
  wire the Sanity webhook to a Netlify build hook; test the form on a deploy
  preview.
- Out of date in this file: the Tailwind gotcha below says Tailwind was removed,
  but `tailwindcss` and `@tailwindcss/vite` are still installed and still wired
  into `astro.config.mjs`. Nothing in `src/` uses them. `react`, `react-dom`,
  `react-is`, `styled-components` and `sanity` are also still in the website's
  dependencies. None of this was touched by the redesign.
