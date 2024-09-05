import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as envConfig } from 'dotenv';

envConfig();

export const config = {
  type: 'postgres',
  url: process.env.DATABASE_URL || '',
  // host: process.env.DATABASE_HOST || 'localhost',
  // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  // username: process.env.DATABASE_USER || 'postgres',
  // password: process.env.DATABASE_PASSWORD || 'postgres',
  // database: process.env.DATABASE_NAME || 'timemanagementsystem',
  synchronize: false, // Set to false in production environments
  logging: true, // Enable logging if needed,
  autoLoadEntities: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
