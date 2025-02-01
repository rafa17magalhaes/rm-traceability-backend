import { ConnectionOptions } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { ActiveToken } from 'src/users/entities/active-token.entity';
import { config } from 'dotenv';

config();

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Company, ActiveToken],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
};

export default ormconfig;
