import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.model.js';

const [, , email, mobile, password, name = 'Ride Flex Administrator'] = process.argv;

if (!email || !mobile || !password) {
  console.error('Usage: npm run create-admin -- <email> <10-digit-mobile> <password> [name]');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

if (!/^[0-9]{10}$/.test(mobile)) {
  console.error('Mobile number must be exactly 10 digits');
  process.exit(1);
}

await mongoose.connect(uri);

const passwordHash = await bcrypt.hash(password, 12);
const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { mobile }] }).select('+password');

if (existing) {
  existing.name = name;
  existing.email = email.toLowerCase();
  existing.mobile = mobile;
  existing.password = passwordHash;
  existing.role = 'admin';
  existing.isVerified = true;
  await existing.save();
  console.log(`Admin account updated: ${existing.email}`);
} else {
  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    mobile,
    password: passwordHash,
    role: 'admin',
    isVerified: true,
  });
  console.log(`Admin account created: ${admin.email}`);
}

await mongoose.disconnect();
