import mongoose, { model, Schema, Document } from "mongoose";


const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  fileLinks: { type: [String] },
  tags: { type: [String] },
  createdAt: { type: Date, default: Date.now() }
})

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  isPublic?: boolean;
  fileLinks?: string[];
  tags?: string[];
  createdAt?: Date;
}

export default model('Post', postSchema);