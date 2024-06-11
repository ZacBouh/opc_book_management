import express from 'express'
import mongoose from 'mongoose'
import { createUser, getUsers } from './controllers/user'

const app = express()
const port = 3000

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6").then( () =>  console.log('successfull connection to db')).catch((er)=> console.log('error connecting to db', er))

app.use(express.json())
// app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
    res.send('Hello it works')
})

app.post('/api/auth/signup', (req, res)=> {

    console.log(`sign up request received with ${req.body?.email} and ${req.body?.password}`)
    createUser(req.body.email, req.body.password, res)

})

app.post('/api/auth/login', (req,res) => {
    
})

app.get('/api/auth/users', (req, res) => {
    console.log('request for users')
    const getRequest = getUsers()
    getRequest
    .then((users)=> res.status(201).json(users))
    .catch( error => res.status(400).json(error) )
})

app.listen(port, () => console.log(`listening on port ${port} is ok
`) ) 