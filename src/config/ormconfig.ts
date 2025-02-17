import { DataSourceOptions } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { ActiveToken } from 'src/users/entities/active-token.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { config } from 'dotenv';

config();

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Company, ActiveToken, Resource],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,  // Em produção, mantenha como false para usar migrations
  logging: false,
};

export default ormconfig;
