import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import connectDB from './lib/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = process.cwd(); // project root

app.use(express.json());

// static (prod)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(ROOT, 'frontend/dist')));
}

app.use('/', router);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server on port: ${PORT}`));
})();