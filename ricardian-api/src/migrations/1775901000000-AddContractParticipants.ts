import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractParticipants1775901000000
  implements MigrationInterface
{
  name = 'AddContractParticipants1775901000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "contract_participants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "contract_id" uuid NOT NULL,
        "user_id" uuid,
        "role" character varying(32) NOT NULL,
        "wallet_address" character varying(255),
        "username" character varying(30),
        "payout_split" numeric(5,2),
        "position" smallint NOT NULL DEFAULT '0',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contract_participants_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_contract_participants_contract" ON "contract_participants" ("contract_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_contract_participants_user" ON "contract_participants" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_contract_participants_role" ON "contract_participants" ("role") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_contract_participants_position" ON "contract_participants" ("contract_id", "position") `,
    );
    await queryRunner.query(`
      ALTER TABLE "contract_participants"
      ADD CONSTRAINT "FK_contract_participants_contract"
      FOREIGN KEY ("contract_id") REFERENCES "contracts"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "contract_participants"
      ADD CONSTRAINT "FK_contract_participants_user"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      INSERT INTO "contract_participants" (
        "contract_id",
        "user_id",
        "role",
        "username",
        "position"
      )
      SELECT
        c.id,
        c.client_id,
        'client',
        u.username,
        0
      FROM "contracts" c
      LEFT JOIN "users" u ON u.id = c.client_id
    `);
    await queryRunner.query(`
      INSERT INTO "contract_participants" (
        "contract_id",
        "user_id",
        "role",
        "wallet_address",
        "username",
        "payout_split",
        "position"
      )
      SELECT
        c.id,
        c.contractor_id,
        'contractor',
        c.contractor_wallet,
        u.username,
        CASE
          WHEN c.contractor_id IS NOT NULL OR c.contractor_wallet IS NOT NULL
            THEN 100.00
          ELSE NULL
        END,
        1
      FROM "contracts" c
      LEFT JOIN "users" u ON u.id = c.contractor_id
      WHERE c.contractor_id IS NOT NULL OR c.contractor_wallet IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_participants" DROP CONSTRAINT "FK_contract_participants_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_participants" DROP CONSTRAINT "FK_contract_participants_contract"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_contract_participants_position"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_contract_participants_role"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_contract_participants_user"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_contract_participants_contract"`,
    );
    await queryRunner.query(`DROP TABLE "contract_participants"`);
  }
}
