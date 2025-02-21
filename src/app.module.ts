import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { StatusModule } from './status/status.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './events/events.module';
import { CodeModule } from './codes/codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')!, 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // ⚠️ **Atenção:** Não usar `synchronize: true` em produção
      }),
    }),
    CompaniesModule,
    StatusModule,
    UsersModule,
    ResourcesModule,
    EventModule,
    CodeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
