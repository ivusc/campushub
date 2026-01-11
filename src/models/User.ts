import mongoose, { Document, model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { 
    type: String,
    enum: [ 'user', 'admin' ],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now() }
});

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
  rememberMe?: string;
}

export default model('User', userSchema);