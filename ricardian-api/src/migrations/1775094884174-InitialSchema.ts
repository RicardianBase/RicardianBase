import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1775094884174 implements MigrationInterface {
    name = 'InitialSchema1775094884174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contract_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(50) NOT NULL, "title" character varying(100) NOT NULL, "description" text NOT NULL, "default_config" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6d8a703e631597c81f92c1b652b" UNIQUE ("slug"), CONSTRAINT "PK_59af2fd9eadd293fe10fdb2c702" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."milestones_status_enum" AS ENUM('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid')`);
        await queryRunner.query(`CREATE TABLE "milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract_id" uuid NOT NULL, "sequence" smallint NOT NULL, "title" character varying(255) NOT NULL, "description" text, "amount" numeric(18,2) NOT NULL, "status" "public"."milestones_status_enum" NOT NULL DEFAULT 'pending', "due_date" date, "submitted_at" TIMESTAMP WITH TIME ZONE, "approved_at" TIMESTAMP WITH TIME ZONE, "paid_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0bdbfe399c777a6a8520ff902d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a69d4dd7ebd053588465c21963" ON "milestones" ("contract_id", "sequence") `);
        await queryRunner.query(`CREATE TYPE "public"."contracts_status_enum" AS ENUM('draft', 'active', 'in_review', 'completed', 'disputed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "template_id" uuid, "client_id" uuid NOT NULL, "contractor_id" uuid, "contractor_wallet" character varying(255), "status" "public"."contracts_status_enum" NOT NULL DEFAULT 'draft', "total_amount" numeric(18,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USDC', "progress" smallint NOT NULL DEFAULT '0', "start_date" date, "end_date" date, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78fd0b9f9cbfc7869ca4d9f5e3" ON "contracts" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3653640e4f62aa511fe43b6f8" ON "contracts" ("contractor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9945462ca96b2c7d0a97e012cd" ON "contracts" ("client_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('company_admin', 'contractor', 'platform_admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying(100), "email" character varying(255), "avatar_url" character varying(500), "role" "public"."users_role_enum" NOT NULL DEFAULT 'contractor', "notification_prefs" jsonb NOT NULL DEFAULT '{"email":true,"milestones":true,"payments":true,"disputes":true,"digest":true}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_addresses_provider_enum" AS ENUM('phantom', 'metamask')`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_addresses_chain_enum" AS ENUM('solana', 'ethereum')`);
        await queryRunner.query(`CREATE TABLE "wallet_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "address" character varying(255) NOT NULL, "provider" "public"."wallet_addresses_provider_enum" NOT NULL, "chain" "public"."wallet_addresses_chain_enum" NOT NULL, "is_primary" boolean NOT NULL DEFAULT true, "nonce" character varying(64), "nonce_expires_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_966565d38248dc8680e14b139d2" UNIQUE ("address"), CONSTRAINT "PK_08524168056d4ecffd439c80170" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d52507da26d88286d452e26f7f" ON "wallet_addresses" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_966565d38248dc8680e14b139d" ON "wallet_addresses" ("address") `);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('escrow_fund', 'milestone_release', 'deposit', 'withdrawal', 'refund')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_direction_enum" AS ENUM('in', 'out')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'confirmed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "contract_id" uuid, "milestone_id" uuid, "type" "public"."transactions_type_enum" NOT NULL, "direction" "public"."transactions_direction_enum" NOT NULL, "amount" numeric(18,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USDC', "description" character varying(500), "tx_hash" character varying(255), "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e9acc6efa76de013e8c1553ed2" ON "transactions" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."disputes_status_enum" AS ENUM('under_review', 'evidence_required', 'resolved', 'escalated')`);
        await queryRunner.query(`CREATE TABLE "disputes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract_id" uuid NOT NULL, "milestone_id" uuid, "initiated_by" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" "public"."disputes_status_enum" NOT NULL DEFAULT 'under_review', "amount_locked" numeric(18,2), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3c97580d01c1a4b0b345c42a107" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "contract_id" uuid, "action" character varying(100) NOT NULL, "description" text NOT NULL, "metadata" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1fa31efc2a0bc0b517b9f7225d" ON "activity_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_d54f841fa5478e4734590d4403" ON "activity_logs" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "milestones" ADD CONSTRAINT "FK_f262bea126e4e4b4cd5dd36da03" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_9d4a1a68440f793e1c488fb9aec" FOREIGN KEY ("template_id") REFERENCES "contract_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_9945462ca96b2c7d0a97e012cdc" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_e3653640e4f62aa511fe43b6f84" FOREIGN KEY ("contractor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_addresses" ADD CONSTRAINT "FK_d52507da26d88286d452e26f7f8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`ALTER TABLE "wallet_addresses" DROP CONSTRAINT "FK_d52507da26d88286d452e26f7f8"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_e3653640e4f62aa511fe43b6f84"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_9945462ca96b2c7d0a97e012cdc"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_9d4a1a68440f793e1c488fb9aec"`);
        await queryRunner.query(`ALTER TABLE "milestones" DROP CONSTRAINT "FK_f262bea126e4e4b4cd5dd36da03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d54f841fa5478e4734590d4403"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fa31efc2a0bc0b517b9f7225d"`);
        await queryRunner.query(`DROP TABLE "activity_logs"`);
        await queryRunner.query(`DROP TABLE "disputes"`);
        await queryRunner.query(`DROP TYPE "public"."disputes_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9acc6efa76de013e8c1553ed2"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_direction_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_966565d38248dc8680e14b139d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d52507da26d88286d452e26f7f"`);
        await queryRunner.query(`DROP TABLE "wallet_addresses"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_addresses_chain_enum"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_addresses_provider_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9945462ca96b2c7d0a97e012cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3653640e4f62aa511fe43b6f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78fd0b9f9cbfc7869ca4d9f5e3"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TYPE "public"."contracts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a69d4dd7ebd053588465c21963"`);
        await queryRunner.query(`DROP TABLE "milestones"`);
        await queryRunner.query(`DROP TYPE "public"."milestones_status_enum"`);
        await queryRunner.query(`DROP TABLE "contract_templates"`);
    }

}
