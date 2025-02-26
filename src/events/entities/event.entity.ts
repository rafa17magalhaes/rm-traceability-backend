import { Company } from 'src/companies/entities/company.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code_id' })
  codeId: string;

  @Column()
  valueCode: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ name: 'status_id', nullable: false })
  statusId: string;

  @Column({ name: 'resource_id', nullable: true })
  resourceId: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'urlcode', nullable: true })
  urlCode: string;

  @Column({ nullable: true })
  observation: string;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @ManyToOne(() => Status, { nullable: true })
  @JoinColumn({ name: 'status_id' })
  status?: Status;

  @ManyToOne(() => Resource, { nullable: true })
  @JoinColumn({ name: 'resource_id' })
  resource?: Resource;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
