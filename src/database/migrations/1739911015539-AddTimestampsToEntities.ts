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
    // Remover colunas em caso de rollback
    await queryRunner.dropColumn('resources', 'created_at');
    await queryRunner.dropColumn('resources', 'updated_at');

    await queryRunner.dropColumn('companies', 'created_at');
    await queryRunner.dropColumn('companies', 'updated_at');

    await queryRunner.dropColumn('users', 'created_at');
    await queryRunner.dropColumn('users', 'updated_at');

    await queryRunner.dropColumn('active_tokens', 'created_at');
    await queryRunner.dropColumn('active_tokens', 'updated_at');
  }
}
