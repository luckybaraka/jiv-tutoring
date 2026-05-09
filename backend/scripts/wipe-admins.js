/**
 * One-shot maintenance script: wipes the `admins` collection so the next
 * backend boot reseeds a fresh super-admin from ADMIN_DEFAULT_EMAIL /
 * ADMIN_DEFAULT_PASSWORD.
 *
 * Usage:
 *   node scripts/wipe-admins.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/infrastructure/database/admin.model');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing from environment.');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    const before = await Admin.countDocuments({});
    const result = await Admin.deleteMany({});
    console.log(`Deleted ${result.deletedCount} admin record(s) (was ${before}).`);
    console.log('Restart the backend to trigger reseed of the default super-admin.');
  } catch (err) {
    console.error('Failed to wipe admins:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
