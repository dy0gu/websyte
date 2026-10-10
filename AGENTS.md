# AGENTS

Prefer the Docker based environment defined in each section of the project over tools installed on the host.

Always determine the execution environment before running project-specific commands (tests, builds, migrations, scripts, etc.).

Follow this priority order:

1. **Inside a container** (`cat /.dockerenv` succeeds):
   - Run commands directly using the project's scripts, e.g `pnpm seed:dev`
   - Do not use Docker Compose.

2. **Outside a container**:
   - Run commands through the appropriate Docker Compose service, e.g `docker compose run web pnpm seed:dev`
   - Never execute project-specific commands directly on the host.

3. **Sandbox restrictions**:
   - If Docker commands are blocked by sandbox restrictions, request permission to execute them outside the sandbox.
   - Do not fall back to running commands directly on the host.

## Web

Instructions related to the web directory:

<!-- BEGIN:nextjs-agent-rules -->

### This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

### Packages

When installing new dependencies, write the pinned version in the package.json file, e.g "1.5.0" and not "^1.5.0" or "~1.5.0".

### Using Payload CMS

To help with development of the Payload CMS side of the project, see the skill at `.agents/skills/payload/`. Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Infra

Instructions related to the infrastructure directory:

Nothing here for now!
