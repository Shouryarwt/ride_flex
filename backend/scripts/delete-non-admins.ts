import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.model.js';

async function main() {
  await connectDatabase();

  const nonAdminCount = await User.countDocuments({ role: { $ne: 'admin' } });
  console.log(`Found ${nonAdminCount} non-admin user(s).`);

  if (nonAdminCount === 0) {
    console.log('Nothing to delete. Exiting.');
    await mongoose.disconnect();
    return;
  }

  const sample = await User.find({ role: { $ne: 'admin' } }).select('email name role').limit(10).lean();
  console.log('Sample users to be deleted (up to 10):');
  sample.forEach((u) => console.log(`- ${u.email} (${u.name || 'no-name'})`));

  // Proceed with deletion (user confirmed via interactive command)
  const result = await User.deleteMany({ role: { $ne: 'admin' } });
  console.log(`Deleted ${result.deletedCount ?? 0} user(s).`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Error during deletion:', err);
  process.exit(1);
});
