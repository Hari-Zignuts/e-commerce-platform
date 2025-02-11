import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/role.entity';
import { User } from '../../modules/users/user.entity';

export const seedDatabase = async (dataSource: DataSource) => {
  console.log('🚀 Starting database seeding...');

  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  // ✅ Insert roles if they don't exist
  const roleUser = await roleRepository.findOne({ where: { name: 'user' } });
  const roleAdmin = await roleRepository.findOne({ where: { name: 'admin' } });

  if (!roleUser) {
    await roleRepository.insert({ name: 'user' });
  }

  if (!roleAdmin) {
    await roleRepository.insert({ name: 'admin' });
  }

  // Fetch roles again after insertion
  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });

  // ✅ Insert an admin user if not exists
  const adminUser = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    if (!adminRole) {
      console.error('❌ Admin role not found! Seeding failed.');
      process.exit(1);
    }
    const hashedPassword = await hash(
      process.env.USER_PASSWORD || 'admin123',
      10,
    );
    await userRepository.insert({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: 'admin@example.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: adminRole,
    });
  }

  console.log('✅ Database seeding completed!');
};
