import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

async function saveUser() {
  const testUser = new User({
    username: 'test1',
    email: 'test@test.com',
    password: 'test-password'
  })

  await testUser.save();
}

async function savePost() {
  const testPost = new Post({
    author: new mongoose.Types.ObjectId(),
    title: 'Test post',
    content: 'This is a test post',
  })

  await testPost.save();
}

export { saveUser, savePost }
