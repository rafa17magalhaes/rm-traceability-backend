import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTimestampsToEntities1739911015539 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // resources
    await queryRunner.addColumns('resources', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      }),
    ]);

    // companies
    await queryRunner.addColumns('companies', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      }),
    ]);

    // users
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      }),
    ]);

    // active_tokens
    await queryRunner.addColumns('active_tokens', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // resources
    const resourcesTable = await queryRunner.getTable('resources');
    if (resourcesTable) {
      if (resourcesTable.findColumnByName('created_at')) {
        await queryRunner.dropColumn('resources', 'created_at');
      }
      if (resourcesTable.findColumnByName('updated_at')) {
        await queryRunner.dropColumn('resources', 'updated_at');
      }
    }

    // companies
    const companiesTable = await queryRunner.getTable('companies');
    if (companiesTable) {
      if (companiesTable.findColumnByName('created_at')) {
        await queryRunner.dropColumn('companies', 'created_at');
      }
      if (companiesTable.findColumnByName('updated_at')) {
        await queryRunner.dropColumn('companies', 'updated_at');
      }
    }

    // users
    const usersTable = await queryRunner.getTable('users');
    if (usersTable) {
      if (usersTable.findColumnByName('created_at')) {
        await queryRunner.dropColumn('users', 'created_at');
      }
      if (usersTable.findColumnByName('updated_at')) {
        await queryRunner.dropColumn('users', 'updated_at');
      }
    }

    // active_tokens
    const activeTokensTable = await queryRunner.getTable('active_tokens');
    if (activeTokensTable) {
      if (activeTokensTable.findColumnByName('created_at')) {
        await queryRunner.dropColumn('active_tokens', 'created_at');
      }
      if (activeTokensTable.findColumnByName('updated_at')) {
        await queryRunner.dropColumn('active_tokens', 'updated_at');
      }
    }
  }
}
