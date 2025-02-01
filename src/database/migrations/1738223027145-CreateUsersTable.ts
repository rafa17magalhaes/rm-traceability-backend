// src/database/migrations/1738221309782-CreateUsersTable.ts

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1738223027145 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
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
                        name: 'email',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'active',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'password_hash',
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
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FK_Users_Company',
                        referencedTableName: 'companies',
                        referencedColumnNames: ['id'],
                        columnNames: ['company_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
            true, // se a tabela já existe, não será recriada
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
