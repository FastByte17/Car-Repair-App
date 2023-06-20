import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { connect } from './utils/db.js';

const app = express()
const port = process.env.PORT || 3000;
dotenv.config({ path: '.env' })

connect()
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})