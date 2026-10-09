import { z } from 'zod';

const boolean = z.enum(['true', 'false']).transform((value: string) => value === 'true');

// Adds a default to the param only while Next.js builds static output
function buildable(schema: z.ZodType<string>, fallback = 'build-placeholder') {
  return process.env.NEXT_PHASE === 'phase-production-build' ? schema.default(fallback) : schema;
}

const envSchema = z
  .object({
    CI: boolean.default(false),
    CONTACT_EMAIL: buildable(z.email()),
    CRON_SECRET: buildable(z.string().min(32)),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PAYLOAD_SECRET: z.string().min(32),
    PORT: z.coerce.number().int().min(1),
    POSTGRES_DB: z.string().trim().min(1),
    POSTGRES_HOST: z.string().trim().min(1),
    POSTGRES_PASSWORD: z.string().min(12),
    POSTGRES_PORT: z.coerce.number().int().min(1),
    POSTGRES_USER: z.string().trim().min(1),
    PREVIEW_SECRET: buildable(z.string().min(32), 'build-only-preview-secret-placeholder-0'),
    PUBLIC_SERVER_URL: z.url().refine((value) => !value.endsWith('/'), {
      message: 'PUBLIC_SERVER_URL must not end with a slash.',
    }),
    S3_ACCESS_KEY_ID: z.string().trim().min(1).optional(),
    S3_BUCKET: z.string().trim().min(1).optional(),
    S3_REGION: z.string().trim().min(1).optional(),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    SMTP_FROM: buildable(z.email()),
    SMTP_HOST: buildable(z.string().trim().min(1)),
    SMTP_PASS: buildable(z.string().min(12)),
    SMTP_PORT: z.coerce.number().int().min(1).default(1025),
    SMTP_SECURE: boolean.default(true),
    SMTP_USER: buildable(z.string().trim().min(1)),
  })
  .superRefine((value, context) => {
    // Util function to require every var in the array to be set when any one of them are set
    function group(names: (keyof typeof value)[]): void {
      const missing = names.find((name) => !value[name]);
      if (!missing || names.every((name) => !value[name])) return;

      context.addIssue({
        code: 'custom',
        message: `${names.join(', ')} must be set together.`,
        path: [missing],
      });
    }

    group(['SMTP_USER', 'SMTP_PASS']);
    group(['S3_ACCESS_KEY_ID', 'S3_BUCKET', 'S3_REGION', 'S3_SECRET_ACCESS_KEY']);
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', z.flattenError(parsedEnv.error).fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;
