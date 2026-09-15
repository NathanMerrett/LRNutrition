# CLAUDE.md

## Project

Laura Reynolds Nutrition: a marketing site for a nutrition coaching practice.
It has a single scrolling homepage (hero, about / what I offer, how it works, blog teaser, enquire) plus `/blog` and `/blog/[slug]`.
The client writes and publishes blog posts herself in Sanity Studio.

This is a lean brochure site, not an app. Prefer the simplest solution that works.

## Stack

- Astro with static output. No SSR adapter.
- TypeScript
- Plain CSS with design tokens. No Tailwind, no CSS-in-JS, no UI libraries.
- Sanity for blog content only. Post bodies use Portable Text.
- Netlify for hosting, and Netlify Forms for enquiries. Submissions are emailed; there is no database.
- GitHub Actions deploys Sanity Studio to `*.sanity.studio`.

## Commands

- `npm run dev`: local dev server
- `npm run build`: production build. Must pass before any task is done.
- `npm run preview`: preview the built site
- `npx astro check`: type-check `.astro` and `.ts` files
- Studio: `<fill in, e.g. cd studio && npm run dev>`

## Conventions

### Styling
- Design tokens live in `:root` in `src/styles/global.css`, which is imported once in `Layout.astro`.
- Always use tokens (`var(--...)`) for colour, spacing, type and radius. Never hard-code values. If a token is missing, add it to `global.css` and mention it.
- Component-specific styles go in that component's scoped `<style>` block.
- Mobile first, relative units, and no horizontal scrolling at any width.

### Components
- Use `.astro` components by default. Don't add React, Vue or Svelte islands unless asked.
- Prefer native HTML (`<dialog>`, `<details>`, `<form>`) plus minimal vanilla JS in `<script>` tags.
- Each homepage section is one component in `src/components/`.
- Designs come from Figma Make exports, which use React, shadcn and Tailwind. When adapting one, convert it to Astro, strip out React, shadcn and Tailwind, and restyle it with tokens. Never install those packages.
- Use semantic HTML and accessible markup throughout: landmarks, heading order, alt text, labels, and visible focus states.

### Blog data
- All blog data access goes through `src/data/posts.ts` (`getPosts()`, `getLatestPosts(n)`, `getPost(slug)`, `formatDate()`).
- Pages and components never import the Sanity client directly. `posts.ts` is the single integration point, so keep it that way.
- The Sanity schema is in `schemaTypes/post.ts`, with fields `title`, `slug`, `summary`, `mainImage`, `publishedAt`, `readingTime` and `body`.
- Author, categories and SEO fields are deliberately deferred. Don't add them unless asked.

## Enquiry form (Netlify Forms)

- The form must exist in the built static HTML so Netlify can detect it at deploy. Never render it only via client-side JS.
- Required attributes: `name="enquiry"`, `method="POST"`, `data-netlify="true"`, and `netlify-honeypot="bot-field"` with a hidden `bot-field` input.
- If submitting with `fetch`, include `<input type="hidden" name="form-name" value="enquiry">` and POST URL-encoded data to `/`.
- Every input needs a proper `<label>`. Use the correct input `type` (`email`, `tel`) and mark required fields.
- Show a clear success state and a clear error state.
- Keep fields minimal: name, email, and a message, plus optionally what they're interested in. Don't add fields asking for health details. Link to the privacy policy near the submit button.
- Forms do not submit on `npm run dev`. Test them on a Netlify deploy preview.

## Environment variables

- The Sanity project ID and dataset are safe to expose. Check `.env.example` for the exact names.
- Any Sanity token must NOT use the `PUBLIC_` prefix and must never reach client-side code.
- Never commit `.env`. Update `.env.example` whenever you add a variable.

## Gotchas

- Tailwind v4 was tried and removed after a Vite error (`No Astro CSS at index 0`). Do not reintroduce it.
- The site is static, so new Sanity posts only appear after a rebuild. A Sanity webhook should trigger a Netlify build hook.
- Studio and the website deploy separately. Schema changes need a Studio redeploy, not just a site deploy.

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

- Done: `Hero.astro`, `Process.astro`, and the Sanity post schema.
- Next: confirm the project ID in `sanity.cli.ts` and test the Studio deploy workflow; wire Sanity into `posts.ts`; build the enquire section.