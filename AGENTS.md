# AGENTS

Prefer the Docker based environment defined in each section of the project over tools installed on the host.

Run project specific commands through the appopriate docker services.

If you get blocked because of your sandbox ask the user to allow you to proceed outside the sandbox.

When running linters or formatters, always run with the fix flag, considering only safe fixes are applied. This is so we only get stopping errors when we have unsafe or non-automatable fixes.

## Web

Instructions related to the web directory:

<!-- BEGIN:nextjs-agent-rules -->

### This is NOT the Next.js you know

This version of Next.js is not the same you were trained on - APIs, conventions, and file structure may all differ from your training data. When making or suggesting changes always ensure you did the appropriate research regarding the latest Next.js best practices. Heed deprecation notices whenever they are mentioned.

<!-- END:nextjs-agent-rules -->

### Packages

When installing new dependencies, write the pinned version in the package.json file, e.g "1.5.0" and not "^1.5.0" or "~1.5.0".

### Using Payload CMS

To help with development of the Payload CMS side of the project, see the skill at `.agents/skills/payload/`. Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Infra

Instructions related to the infrastructure directory:

Nothing here for now!
