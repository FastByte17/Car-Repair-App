import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import auth from './routes/auth.js';
import user from './routes/user.js';

const app = express()
const port = process.env.PORT || 3000;
dotenv.config({ path: '.env' })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/", auth)
app.use("/api/v1/user", user)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})