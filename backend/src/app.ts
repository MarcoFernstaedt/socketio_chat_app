import express from 'express';
import cookieParser from 'cookie-parser';
import { ENV } from './lib/env';
import path from 'path';
import router from './routes';
import connectDB from './lib/db';

const app = express();
const PORT = ENV.PORT || 3000;
const ROOT = process.cwd(); // project root

app.use(express.json());
app.use(cookieParser())

// static (prod)
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(ROOT, 'frontend/dist')));
}

app.use('/', router);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server on port: ${PORT}`));
})();