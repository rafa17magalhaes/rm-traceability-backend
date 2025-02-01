import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Exclude } from 'class-transformer';
import authConfig from 'src/config/auth'; 
import { Company } from 'src/companies/entities/company.entity';
import { ActiveToken } from './active-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: true })
  active: boolean;

  /**
   * Campo transitório que usaremos para gerar o hash
   * (não vai para o banco, então não tem @Column).
   */
  password?: string;

  /**
   * Se precisar de “confirmPassword” em memória, adicione aqui também.
   * Não armazenamos isso em banco.
   */
  // confirmPassword?: string;

  @Exclude()
  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  /**
   * Caso você use tokens relacionados ao usuário:
   */
  @OneToMany(() => ActiveToken, (activeToken) => activeToken.user, {
    cascade: true,
    nullable: true,
  })
  activeTokens?: ActiveToken[];

  /**
   * Relação com Company
   */
  @Column({ name: 'company_id', nullable: true })
  companyId?: string;

  @ManyToOne(() => Company, (company) => company.users, { eager: false })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  public generateToken(): string {
    const { id } = this;
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  }

  public checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (this.password) {
      this.passwordHash = await bcrypt.hash(this.password, 8);
    }
  }
}
