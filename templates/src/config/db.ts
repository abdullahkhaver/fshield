import mongoose from 'mongoose';

export default async function ConnectDB() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI is required in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { autoIndex: false });
  console.log('Database Connected Successfully!');
  process.exit(0);
}
