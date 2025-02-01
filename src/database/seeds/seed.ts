import { createConnection, Connection, Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import ormconfig from 'src/config/ormconfig';

export async function seed(): Promise<void> {
  console.log('Iniciando seed...');
  const connection: Connection = await createConnection(ormconfig);
  console.log('Conexão estabelecida.');

  try {
    const companyRepo: Repository<Company> = connection.getRepository(Company);
    const userRepo: Repository<User> = connection.getRepository(User);

    let existingCompany = await companyRepo.findOne({ where: { name: 'Smart Invisible' } });
    if (!existingCompany) {
      // Cria uma nova empresa
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
      await userRepo.save(newUser);
      console.log('Usuário criado.');
    } else {
      console.log('Usuário já existe.');
    }
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    await connection.close();
    console.log('Conexão fechada.');
  }
}
