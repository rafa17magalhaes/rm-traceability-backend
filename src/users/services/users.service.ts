import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async create(CreateUserDTO: CreateUserDTO): Promise<User> {
    const { email, name, password, active } = CreateUserDTO;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(`E-mail ${email} já cadastrado.`);
    }
    const user = this.userRepository.create({
      name,
      email,
      active: active !== undefined ? active : true,
      password,
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
