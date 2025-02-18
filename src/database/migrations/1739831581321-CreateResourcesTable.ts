import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateResourcesTable1739831581321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resources',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'company_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
          },
        ],
        uniques: [
          {
            columnNames: ['name', 'company_id'],
            name: 'UQ_resources_name_company_id',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('resources');
  }
}
