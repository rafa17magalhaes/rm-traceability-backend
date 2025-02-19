import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
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
  
    @CreateDateColumn({ name: 'created_at', default: () => 'NOW()' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', default: () => 'NOW()' })
    updatedAt: Date;
  
    @Column({ name: 'resource_id', nullable: true })
    resourceId: string;
  
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
  }
  