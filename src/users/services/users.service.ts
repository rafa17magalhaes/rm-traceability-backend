import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UserRepositoryType } from '../interfaces/user-repository.type';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryType,
  ) {}

  async create(createUserDTO: CreateUserDTO, companyId: string): Promise<User> {
    const { email, name, phone, password, active } = createUserDTO;
    
    // Verifica se já existe um usuário com o mesmo e-mail
    const existingByEmail = await this.userRepository.findOne({ where: { email } });
    if (existingByEmail) {
      throw new ConflictException(`E-mail ${email} já cadastrado.`);
    }

    // Verifica se já existe um usuário com o mesmo nome dentro da mesma empresa
    const existingByName = await this.userRepository.findOne({ where: { name, companyId } });
    if (existingByName) {
      throw new ConflictException(`Nome ${name} já cadastrado para esta empresa.`);
    }
    const user = this.userRepository.create({
      name,
      email,
      phone,
      active: active !== undefined ? active : true,
      password,
      companyId,
    });
    await this.userRepository.save(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async update(id: string, UpdateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, UpdateUserDTO);
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }

  // Método customizado
  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.findActive();
  }
}
