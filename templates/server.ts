// Entry point
import dotenv from 'dotenv';
import app from './src/app.ts';
import ConnectDB from './src/config/db.ts';
dotenv.config();

const PORT = process.env.PORT || 3000;

ConnectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('Failed to connect to the database and Start Server:', error);
  process.exit(1);
});
