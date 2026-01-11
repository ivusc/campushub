import mongoose from "mongoose";
import Post from "../models/Post.js";
import { type Request, type Response } from "express";
import path from "path";
import fs from 'fs/promises';
import { fileURLToPath } from "url";
import { v2 as cloudinary } from 'cloudinary';

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await Post.find({ author: req.session.user!.userId })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send("Error retrieving posts: " + err);
  }
}

export async function createPost(req: Request, res: Response) {
  const { title, content, tags, isPublic } = req.body;
  console.log(title, content, tags, isPublic);

  //FILE
  // let filePath = '';
  // if (req.file) {
  //   filePath = `/uploads/${req.file.filename}`;
  // }
  const imageUrl = req.file ? req.file.path : '';

  //AUTHOR
  const author = req.session.user!.userId;
  if (!author)
    return res
      .status(403)
      .send("Unauthorized request! Please login to continue.");

  //TAGS
  const tagsArray = (tags as string).split(",");

  try {
    const newPost = new Post({
      title,
      content,
      author: new mongoose.Types.ObjectId(req.session.user!.userId),
      isPublic: isPublic === 'true',
      tags: tagsArray,
      fileLinks: imageUrl ? [imageUrl] : []
    });
    await newPost.save();

    res.status(201).redirect('/posts');
  } catch (err) {
    res.status(500).send("Error creating posts: " + err);
  }
}

export async function updatePost(req: Request, res: Response) {
  const { title, content, tags, isPublic } = req.body;
  console.log(title, tags, isPublic);

  const post = await Post.findById(req.params.id);
  if (!post) {
    req.flash('error','Post not found.');
    return res.status(404).redirect(`/posts/edit/${req.params.id}`);
  }

  //FILE
  let imageUrl = '';
  if (req.file) {
    console.log('deleting file')
    if (post.fileLinks.length > 0 && post.fileLinks[0]){
      await deleteFromCloudinary(post.fileLinks[0])
    }
    imageUrl = req.file ? req.file.path : '';
  } else {
    imageUrl = post.fileLinks[0] || '';
  }

  try {
    await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.session.user!.userId },
      { 
        title, 
        content, 
        tags, 
        isPublic: isPublic === 'true',
        fileLinks: imageUrl ? [imageUrl] : []
      },
      { new: true }
    );
    
    req.flash('success','Post updated successfully.');
    res.json(post);
  } catch (err) {
    req.flash('error',`Error updating post: ${err}`);
    res.status(500).send("Error updating post: " + err);
  }
}

export async function deletePost(req: Request, res: Response) {
  console.log(req.params.id, req.session.user!.userId);
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.session.user!.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.session.user!.userId,
    });

    req.flash('info', 'Deleted successfully');
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting post: " + err);
  }
}

//DELETE FROM FS STORAGE
// async function deleteFile(relativePath: string){
//   try{
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     const absolutePath = path.join(__dirname,'../../public', relativePath);

//     await fs.unlink(absolutePath);
//     console.log(`Successfully deleted: ${absolutePath}`);
//   } catch (err:any) {
//     console.warn(`File deletion skipped: ${err.message}`);
//   }
// }

//DELETE FROM CLOUDINARY
const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    // Extract public_id from the URL
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = `campushub_uploads/${fileName?.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deleted:", publicId);
  } catch (err) {
    console.error("Cloudinary deletion failed:", err);
  }
};