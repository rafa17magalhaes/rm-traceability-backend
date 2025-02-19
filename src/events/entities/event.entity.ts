import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'events' })
  export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'code_id' })
    codeId: string;
  
    @Column({ name: 'status_id', nullable: false })
    statusId: string;
  
    @Column({ name: 'resource_id', nullable: true })
    resourceId: string;
  
    @Column({ nullable: true })
    ip: string;
  
    @Column({ name: 'companyid', nullable: true })
    companyId: string;
  
    @CreateDateColumn({ name: 'creation_date' })
    creationDate: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @Column({ name: 'urlcode', nullable: true })
    urlCode: string;
  
    @Column({ nullable: true })
    observation: string;
  
    @Column({ type: 'double precision', nullable: true })
    longitude: number;
  
    @Column({ type: 'double precision', nullable: true })
    latitude: number;
  
    @Column({ name: 'user_id', nullable: true })
    userId: string;
  }
  