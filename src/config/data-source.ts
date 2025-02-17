import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import ormconfig from './ormconfig';

config();

export default new DataSource(ormconfig);
