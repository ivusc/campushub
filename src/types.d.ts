import "express-session";
import mongoose from "mongoose";

interface IUser {
  userId: mongoose.Types.ObjectId;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

declare module "express-session" {
  interface SessionData {
    user: IUser | null;
  }
}