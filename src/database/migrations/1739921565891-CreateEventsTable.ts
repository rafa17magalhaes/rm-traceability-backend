import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

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
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'valueCode',
            type: 'varchar',
            isNullable: false,
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
            name: 'company_id',
            type: 'uuid',
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
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Foreign key para resource_id
    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['resource_id'],
        referencedTableName: 'resources',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para status_id
    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['status_id'],
        referencedTableName: 'status',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para company_id
    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para user_id
    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('events');
    if (table) {
      const userForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey('events', userForeignKey);
      }
      const companyForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('company_id'),
      );
      if (companyForeignKey) {
        await queryRunner.dropForeignKey('events', companyForeignKey);
      }
      const resourceForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('resource_id'),
      );
      if (resourceForeignKey) {
        await queryRunner.dropForeignKey('events', resourceForeignKey);
      }
      const statusForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('status_id'),
      );
      if (statusForeignKey) {
        await queryRunner.dropForeignKey('events', statusForeignKey);
      }
    }
    await queryRunner.dropTable('events');
  }
}
