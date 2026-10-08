import { z } from 'zod';

const boolean = z.enum(['true', 'false']).transform((value: string) => value === 'true');

const envSchema = z
  .object({
    CI: boolean.default(false),
    CONTACT_EMAIL: z.email(),
    CRON_SECRET: z.string().min(32),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PAYLOAD_SECRET: z.string().min(32),
    PORT: z.coerce.number().int().min(1),
    POSTGRES_DB: z.string().trim().min(1),
    POSTGRES_HOST: z.string().trim().min(1),
    POSTGRES_PASSWORD: z.string().min(12),
    POSTGRES_PORT: z.coerce.number().int().min(1),
    POSTGRES_USER: z.string().trim().min(1),
    PREVIEW_SECRET: z.string().min(32),
    PUBLIC_SERVER_URL: z.url(),
    SMTP_FROM: z.email(),
    SMTP_HOST: z.string().trim().min(1),
    SMTP_PASS: z.string().min(12),
    SMTP_PORT: z.coerce.number().int().min(1),
    SMTP_SECURE: boolean.default(true),
    SMTP_USER: z.string().trim().min(1),
  })
  .superRefine((value, context) => {
    if (Boolean(value.SMTP_USER) !== Boolean(value.SMTP_PASS)) {
      context.addIssue({
        code: 'custom',
        message: 'SMTP_USER and SMTP_PASS must be set together.',
        path: value.SMTP_USER ? ['SMTP_PASS'] : ['SMTP_USER'],
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;
