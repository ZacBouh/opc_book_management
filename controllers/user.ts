import { User } from "../models/user"
import bcrypt from "bcrypt"
import {Response} from 'express'

export function createUser(email : string, password : string, res :  Response) {
    
        bcrypt.hash(password, 10, (err, hash) => {
           if (err) return res.status(400).json(err)
           const newUser = new User({email, password : hash})
           newUser.save()
           .then(()=> res.status(201).json({message: 'user created'}))
           .catch(err => res.status(400).json(err))
       })
    
}

export function getUsers(){
    return User.find()
}