# Web

Run the local application and its dependencies with Docker Compose from this directory (`cd web`
from the repository root):

```bash
docker compose up --build
```

Optionally, install dependencies locally for LSP support in IDEs:

```bash
pnpm install
```

Docker Compose provides a full development configuration, so no `.env` file is required. The application validates its environment at startup. Production deployments must provide the values required by the [`src/env.ts`](src/env.ts) schema.

### Optional S3 media storage

Media uploads use the local `public/media` directory by default. To store media in an AWS S3 bucket instead, set all four of the following environment variables:

```sh
S3_BUCKET=your-bucket-name
S3_REGION=eu-west-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

The S3 principal needs permission to read, write, and delete objects in the bucket. The bucket must permit public reads for the media URLs to be publicly accessible. The application fails at startup when only part of this S3 configuration is set.

For each database schema change, manually create migrations with
`docker compose run --rm app pnpm migrate:create`, review the generated files, then run
`docker compose run --rm app pnpm migrate` before development startup, building, or production
startup. If no migrations exist yet, create the initial migration before running migrations.
The local Docker Compose file provides development services.

See [package.json](package.json) for scripts that can be ran inside the docker service.

Before shipping, run `pnpm check` and `pnpm build`, then check narrow and wide layouts, both locales, theme settings, keyboard navigation, and form validation in a browser.

### Seed

Development startup runs `pnpm seed` before Next.js starts. The seed creates the contact form when
it is missing and updates the existing form on later runs, without deleting any content. Apply
migrations before seeding; the seed expects the current schema to already exist. In
development, it also creates or updates fake posts and projects for the portfolio.

You can also run it directly with `pnpm seed`. Fake content is only included when `NODE_ENV` is set
to `development`.

### Style

The website uses CSS Modules. Keep visual rules beside the component that owns them; do not add page-specific overrides to the layout reset.

#### Responsibilities

- `app/(frontend)/[locale]/layout.module.css`: theme colors, layout tokens, and low-specificity element resets. The existing light, dark, and automatic theme settings share the same semantic color names.
- `styles/shared.module.css`: reusable layout and content primitives (`container`, `prose`, `srOnly`). The container has one fluid maximum width rather than a different width at every breakpoint.
- `components/ui/*.module.css`: reusable controls and their hover, focus, disabled, and validation states.
- Component and block modules: local layout and appearance.
- `app/(frontend)/pages.module.css`: shared archive and article page structure.

#### Tokens

Use `--background`, `--foreground`, `--muted-foreground`, `--border`, and the existing control/status colors instead of introducing a separate page palette.

The frontend body defines:

| Token | Purpose |
| --- | --- |
| `--content-width` | Maximum content width, excluding gutters |
| `--page-gutter` | Responsive inline padding |
| `--section-space` | Responsive spacing between sections |
| `--radius` | Corner radius for controls and media |
| `--site-header-height` | Baseline header height; wrapping navigation can be taller |

For full-width sections, use a maximum width of `calc(var(--content-width) + 2 * var(--page-gutter))` and inline padding of `var(--page-gutter)` so content aligns with `shared.container`.

#### Conventions

- Use semantic class names, logical properties, and mobile-first media queries.
- Keep resets low-specificity with `:where()` so component spacing and typography can override them without `!important`.
- Prefer normal-case, readable text and subtle borders. Avoid decorative grids, outlined headings, and page-specific color inversions.
- Keep interactive states visible for keyboard users. Do not hide navigation links to make the mobile layout fit.
- Keep content visible without animation or JavaScript. Any new motion must respect `prefers-reduced-motion`.
- Keep CMS admin styling separate from public-site styling.
