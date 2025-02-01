// src/users/services/users.service.ts
import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, active } = createUserDto;

    // Exemplo de checagem se já existe usuário com este e-mail
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(`E-mail ${email} já cadastrado.`);
    }

    const user = this.userRepository.create({
      name,
      email,
      active: active !== undefined ? active : true,
      password, // esse "password" será hashado pelo hook @BeforeInsert
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
    return this.userRepository.findOne({ where: { email } });
  }  
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Atualiza campos que vierem no DTO
    Object.assign(user, updateUserDto);

    // Se "password" vier no DTO, o hook do @BeforeUpdate() gerará novo hash
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }
}
