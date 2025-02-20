import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { ActiveToken } from 'src/users/entities/active-token.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { Status } from 'src/status/entities/status.entity';

config();

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Company,
    ActiveToken,
    Resource,
    Status,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,  // Em produção, mantenha como false para usar migrations
  logging: false,
};

export default ormconfig;
