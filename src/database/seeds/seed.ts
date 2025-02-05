import { DataSource } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import ormconfig from 'src/config/ormconfig';

export async function seed(): Promise<void> {
  console.log('Iniciando seed...');
  const dataSource = new DataSource(ormconfig);
  await dataSource.initialize();
  console.log('Conexão estabelecida.');

  try {
    const companyRepo = dataSource.getRepository(Company);
    const userRepo = dataSource.getRepository(User);

    let existingCompany = await companyRepo.findOne({ where: { name: 'Smart Invisible' } });
    if (!existingCompany) {
      existingCompany = companyRepo.create({
        code: 'SMART123',
        document: '000000000',
        name: 'Smart Invisible',
        trade: 'Smart Invisible Trade',
      });
      await companyRepo.save(existingCompany);
      console.log('Empresa "Smart Invisible" criada.');
    } else {
      console.log('Empresa "Smart Invisible" já existe.');
    }

    const existingUser = await userRepo.findOne({ where: { email: 'admin@padrao.com' } });
    if (!existingUser) {
      const newUser = userRepo.create({
        name: 'Rafael',
        email: 'admin@padrao.com',
        phone: '11999999999',
        password: '123456',
        company: existingCompany,
      });
      const savedUser = await userRepo.save(newUser);
      console.log('Usuário criado:', savedUser);
    } else {
      console.log('Usuário já existe.');
    }
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexão fechada.');
  }
}

seed().catch((err) => console.error(err));
