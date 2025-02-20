import { DataSource } from 'typeorm';
import { Status } from '../../status/entities/status.entity';

const systemStatuses = [
  {
    name: 'Gerado',
    description: 'Código gerado e aguardando ativação',
    active: true,
    companyId: 'sistema',
  },
  {
    name: 'Ativado',
    description: 'Código ativado e em funcionamento',
    active: true,
    companyId: 'sistema',
  },
  {
    name: 'Impressão',
    description: 'Código em processo de impressão',
    active: true,
    companyId: 'sistema',
  },
  {
    name: 'Manutenção',
    description: 'Código em manutenção',
    active: true,
    companyId: 'sistema',
  },
  {
    name: 'Extraviado',
    description: 'Código extraviado',
    active: true,
    companyId: 'sistema',
  },
  {
    name: 'Avariado',
    description: 'Código com avaria',
    active: true,
    companyId: 'sistema',
  },
];

export async function seedStatuses(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Status);

  for (const data of systemStatuses) {
    // Verifica se já existe um status com o mesmo name
    const existing = await repo.findOne({ where: { name: data.name } });
    if (!existing) {
      const newStatus = repo.create(data);
      await repo.save(newStatus);
      console.log(`Status "${newStatus.name}" criado com sucesso.`);
    } else {
      console.log(`Status "${existing.name}" já existe. Pulando...`);
    }
  }
}
