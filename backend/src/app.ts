import express from 'express'
import dotenv from 'dotenv';
import router from  './routes/'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})