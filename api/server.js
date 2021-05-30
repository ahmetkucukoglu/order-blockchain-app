import express from 'express'
import dotenv from 'dotenv'
import router from './route.js'

dotenv.config()

const app = express()
const port = 1453

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router);

app.listen(port, () => console.log(`API server running on port ${port}`))