// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { UsersService } from '../users/users.service';
// import * as bcrypt from 'bcrypt';

// async function run() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const users = app.get(UsersService);

//   const adminEmail = 'admin@platform.com';
//   const gestorEmail = 'gestor@platform.com';

//   const admin = await users.findByEmail(adminEmail);
//   if (!admin) {
//     const password = await bcrypt.hash('Admin123!', 10);
//     const u = await users.create({ name: 'Admin', email: adminEmail, password, role: 'ADMIN' });
//     console.log('Admin creado:', u.email);
//   }

//   const gestor = await users.findByEmail(gestorEmail);
//   if (!gestor) {
//     const password = await bcrypt.hash('Gestor123!', 10);
//     const u = await users.create({ name: 'Gestor', email: gestorEmail, password, role: 'GESTOR' });
//     console.log('Gestor creado:', u.email);
//   }

//   await app.close();
// }
// run();

// src/seeds/seed-roles.ts
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
});

async function run() {
  await AppDataSource.initialize();

  const adminEmail = 'admin@platform.com';
  const gestorEmail = 'gestor@platform.com';

  // Admin
  let admin = await AppDataSource.manager.findOne(User, { where: { email: adminEmail } });
  if (!admin) {
    const password = await bcrypt.hash('Admin123!', 10);
    admin = AppDataSource.manager.create(User, {
      name: 'Admin',
      email: adminEmail,
      password,
      role: 'ADMIN',
    });
    await AppDataSource.manager.save(admin);
    console.log('Admin creado:', admin.email);
  }

  // Gestor
  let gestor = await AppDataSource.manager.findOne(User, { where: { email: gestorEmail } });
  if (!gestor) {
    const password = await bcrypt.hash('Gestor123!', 10);
    gestor = AppDataSource.manager.create(User, {
      name: 'Gestor',
      email: gestorEmail,
      password,
      role: 'GESTOR',
    });
    await AppDataSource.manager.save(gestor);
    console.log('Gestor creado:', gestor.email);
  }

  await AppDataSource.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
