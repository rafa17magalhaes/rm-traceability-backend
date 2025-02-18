import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Resource } from '../../resources/entities/resource.entity';

  @Entity({ name: 'status' })
  export class Status {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    description: string;
  
    @Column({ default: true })
    active: boolean;
  
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Resource, { nullable: true })
    @JoinColumn({ name: 'resourceId' })
    resource?: Resource;
  }
  