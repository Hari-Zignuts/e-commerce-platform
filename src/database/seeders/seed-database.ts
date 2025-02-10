import { hash } from 'bcrypt';
import dataSource from '../data-source'; // ✅ Correct import
import { Role } from '../../modules/roles/role.entity';
import { User } from '../../modules/users/user.entity';

const seedDatabase = async () => {
  await dataSource.initialize(); // ✅ Initialize the database connection

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
    const hashedPassword = await hash('Admin@123', 10); // Hash password
    await userRepository.insert({
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: adminRole,
    });
  }

  console.log('✅ Database seeding completed!');
  await dataSource.destroy(); // ✅ Close connection after seeding
};

seedDatabase().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
