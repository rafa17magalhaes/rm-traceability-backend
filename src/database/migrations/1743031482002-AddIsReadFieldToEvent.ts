import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsReadFieldToEvent1743031482002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'events',
      new TableColumn({
        name: 'is_read',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('events', 'is_read');
  }
}
