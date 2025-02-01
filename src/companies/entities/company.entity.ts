import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  document: string;

  @Column()
  name: string; // Razão social

  @Column()
  trade: string; // Nome fantasia

  @Column({ name: 'municipal_registration', nullable: true })
  municipalRegistration?: string;

  @Column({ name: 'state_registration', nullable: true })
  stateRegistration?: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'zip_code', nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @OneToMany(() => User, (users) => users.company)
  users: User[];
}
