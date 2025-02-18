import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateStatusTable1739919203585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'status',
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
            name: 'resourceId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        uniques: [
          {
            columnNames: ['name', 'company_id'],
            name: 'UQ_status_name_company_id',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'status',
      new TableForeignKey({
        columnNames: ['resourceId'],
        referencedTableName: 'resources',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('status');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes('resourceId'));
      if (foreignKey) {
        await queryRunner.dropForeignKey('status', foreignKey);
      }
      await queryRunner.dropTable('status');
    }
  }
}
