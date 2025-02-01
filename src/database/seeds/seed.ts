// src/database/seeds/seed.ts
import { createConnection, Connection, Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import ormconfig from 'src/config/ormconfig';

export async function seed(): Promise<void> {
  console.log('Iniciando seed...');
  const connection: Connection = await createConnection(ormconfig);
  console.log('Conexão estabelecida.');

  try {
    // Obtém os repositórios para Company e User
    const companyRepo: Repository<Company> = connection.getRepository(Company);
    const userRepo: Repository<User> = connection.getRepository(User);

    // Verifica se já existe a empresa "Smart Invisible"
    let existingCompany = await companyRepo.findOne({ where: { name: 'Smart Invisible' } });
    if (!existingCompany) {
      // Cria uma nova empresa
      existingCompany = companyRepo.create({
        code: 'SMART123', // Adicione um código apropriado
        document: '000000000', // Exemplo: CNPJ, CPF, etc.
        name: 'Smart Invisible',
        trade: 'Smart Invisible Trade',
        // Adicione outros campos conforme necessário
      });
      await companyRepo.save(existingCompany);
      console.log('Empresa "Smart Invisible" criada.');
    } else {
      console.log('Empresa "Smart Invisible" já existe.');
    }

    // Verifica se já existe o usuário "Rafael"
    const existingUser = await userRepo.findOne({ where: { email: 'admin@padrao.com' } });
    if (!existingUser) {
      // Cria um usuário admin associado à empresa
      const newUser = userRepo.create({
        name: 'Rafael',
        email: 'admin@padrao.com',
        phone: '11999999999',
        password: '123456', // Senha em texto plano; será hashada pelo hook
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
    // Fecha a conexão com o banco de dados
    await connection.close();
    console.log('Conexão fechada.');
  }
}
