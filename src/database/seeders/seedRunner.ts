import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { seedDatabase } from './seed-database';

async function runSeeder() {
  console.log('🚀 Running database seeder...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  await seedDatabase(dataSource);

  console.log('✅ Seeding completed!');
  await app.close();
}

runSeeder().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
