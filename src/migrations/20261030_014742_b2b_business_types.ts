import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_b2b_requests_business_type" ADD VALUE 'government' BEFORE 'gym';
  ALTER TYPE "public"."enum_b2b_requests_business_type" ADD VALUE 'social' BEFORE 'gym';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "b2b_requests" ALTER COLUMN "business_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_b2b_requests_business_type";
  CREATE TYPE "public"."enum_b2b_requests_business_type" AS ENUM('gym', 'physio', 'clinic', 'salon', 'hotel', 'corporate', 'other');
  ALTER TABLE "b2b_requests" ALTER COLUMN "business_type" SET DATA TYPE "public"."enum_b2b_requests_business_type" USING "business_type"::"public"."enum_b2b_requests_business_type";`)
}
