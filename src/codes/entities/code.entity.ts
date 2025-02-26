import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'codes' })
export class Code {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  value: string;

  @Column({ name: 'current_state', nullable: true })
  currentState: string;

  @Column({ name: 'status_id', nullable: true })
  statusId: string;

  @Column({ name: 'current_observation', nullable: true })
  currentObservation: string;

  @Column({ name: 'resource_id', nullable: true })
  resourceId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ default: false })
  block: boolean;

  @Column({ nullable: true })
  invoice: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @Column({ name: 'driver_name', nullable: true })
  driverName: string;

  @Column({ name: 'access_key', nullable: true })
  accessKey: string;

  @Column({ name: 'event_id', nullable: true })
  eventId: string;

  @Column({ name: 'qr_code_url', nullable: true })
  qrCodeUrl: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'NOW()' })
  updatedAt: Date;

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
