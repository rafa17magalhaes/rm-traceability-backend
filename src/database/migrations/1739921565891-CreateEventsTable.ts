import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEventsTable1739921565891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'events',
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
            name: 'code_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'valueCode',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'status_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'resource_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'companyid',
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
            name: 'urlcode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'double precision',
            isNullable: true,
          },
          {
            name: 'latitude',
            type: 'double precision',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['resource_id'],
        referencedTableName: 'resources',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['status_id'],
        referencedTableName: 'status',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('events');
    if (table) {
      const resourceForeignKey = table.foreignKeys.find(fk =>
        fk.columnNames.includes('resource_id'),
      );
      if (resourceForeignKey) {
        await queryRunner.dropForeignKey('events', resourceForeignKey);
      }
      const statusForeignKey = table.foreignKeys.find(fk =>
        fk.columnNames.includes('status_id'),
      );
      if (statusForeignKey) {
        await queryRunner.dropForeignKey('events', statusForeignKey);
      }
    }
    await queryRunner.dropTable('events');
  }
}
