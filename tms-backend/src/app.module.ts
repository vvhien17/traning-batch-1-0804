import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ActivityModule } from './activity/activity.module';
import { CategoryModule } from './category/category.module';
import { config as envConfig } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { GoalModule } from './goal/goal.module';
import { GoalOnActivityModule } from './goal-on-activity/goal-on-activity.module';
import { DashboardModule } from './dashboard/dashboard.module';

envConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || '',
      // host:
      //   process.env.DATABASE_HOST ||
      //   'postgres@aws-0-ap-southeast-1.pooler.supabase.com',
      // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      // username: process.env.DATABASE_USER || 'postgres',
      // password: process.env.DATABASE_PASSWORD || 'Tmspostgres',
      // database: process.env.DATABASE_NAME || 'postgres',
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false, // Set to false in production environments
      logging: true, // Enable logging if needed,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,

      // entities: ['src/**/*.entity{.ts,.js}'],
      // migrations: ['migrations/*{.ts,.js}'],
    }),
    UserModule,
    ActivityModule,
    CategoryModule,
    AuthModule,
    GoalModule,
    GoalOnActivityModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
