import config from '@payload-config';
import { sql } from '@payloadcms/db-postgres';
import { getPayload } from 'payload';

const migrationTable = 'payload_migrations';

export async function reset(): Promise<void> {
  const payload = await getPayload({ config: config });
  const result = await payload.db.drizzle.execute<{ tablename: string }>(sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> ${migrationTable}
  `);
  const tables = result.rows.map(
    ({ tablename }) => `"public"."${tablename.replaceAll('"', '""')}"`,
  );

  if (tables.length > 0) {
    await payload.db.drizzle.execute(
      sql.raw(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`),
    );
  }
}
