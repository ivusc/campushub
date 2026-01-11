import mongoose from "mongoose";
import Post from "../models/Post.js";
import { type Request, type Response } from "express";
import path from "path";
import fs from 'fs/promises';
import { fileURLToPath } from "url";

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
  let filePath = '';
  if (req.file) {
    filePath = `/uploads/${req.file.filename}`;
  }

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
      fileLinks: filePath ? [filePath] : []
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
  let filePath = '';
  if (req.file) {
    console.log('deleting file')
    if (post.fileLinks.length > 0 && post.fileLinks[0]){
      await deleteFile(post.fileLinks[0])
    }
    filePath = `/uploads/${req.file.filename}`;
  } else {
    filePath = post.fileLinks[0] || '';
  }

  try {
    await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.session.user!.userId },
      { 
        title, 
        content, 
        tags, 
        isPublic: isPublic === 'true',
        fileLinks: filePath ? [filePath] : []
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

async function deleteFile(relativePath: string){
  try{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const absolutePath = path.join(__dirname,'../../public', relativePath);

    await fs.unlink(absolutePath);
    console.log(`Successfully deleted: ${absolutePath}`);
  } catch (err:any) {
    console.warn(`File deletion skipped: ${err.message}`);
  }
}
