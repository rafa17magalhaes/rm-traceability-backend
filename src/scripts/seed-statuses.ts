/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { seedStatuses } from '../database/seeds/status.seed';
import ormconfig from 'src/config/ormconfig';

config();

const dataSource = new DataSource(ormconfig);

dataSource
  .initialize()
  .then(async (ds) => {
    console.log('DataSource inicializado. Executando seed de Status...');
    await seedStatuses(ds);
    console.log('Seed de Status concluído.');
  })
  .catch((error) => {
    console.error('Erro ao inicializar DataSource:', error);
  })
  .finally(() => {
    dataSource.destroy();
  });
