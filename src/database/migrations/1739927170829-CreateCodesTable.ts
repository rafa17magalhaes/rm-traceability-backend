import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCodesTable1739927170829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'codes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'value',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'current_state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'current_observation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'resource_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'block',
            type: 'boolean',
            default: false,
          },
          {
            name: 'invoice',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'driver_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'access_key',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'event_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'qr_code_url',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('codes');
  }
}
