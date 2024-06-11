import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String},
    password: {type: String}
})

export const User = mongoose.model('User', userSchema)