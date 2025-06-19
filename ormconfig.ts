import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'kitnet_db',

  synchronize: false,
  logging: process.env.NODE_ENV === 'development',

  // Entities explícitas (evita problemas de path)
  entities: ['src/entities/*.entity.{ts,js}', 'dist/entities/*.entity.{ts,js}'],

  migrations: ['src/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations_history',
});

// APENAS UM EXPORT (importante!)
export default AppDataSource;
