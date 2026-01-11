import { Router, type Request, type Response, type NextFunction } from "express";
import { requireAuth } from "../middleware/middleware.js";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post-controller.js";
import Post from "../models/Post.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Middleware for logging
function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
}
router.use(logger);

//API ROUTES
router.get('/api/posts', getPosts);
router.post('/api/posts', requireAuth, upload.single('postImage'), createPost);
router.put('/api/posts/:id', requireAuth, upload.single('postImage'), updatePost);
router.delete('/api/posts/:id', requireAuth, deletePost);

//PAGE ROUTES
router.get("/posts", requireAuth, async (req, res) => {
  console.log("Session on load:", req.session);
  console.log("res.locals: ", res.locals);

  try{
    const posts = await Post.find({})
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.render('posts/index', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error.'});
  }
});

router.get('/posts/create', requireAuth, (req, res) => {
  res.render('posts/create');
})

router.get('/posts/:id', requireAuth, async (req, res) => {
  try{
    const post = await Post.findById(req.params.id).populate('author','username');

    if (!post) return res.status(404).render('error', { message: 'Page not found.'});
    
    res.render('posts/post', {
      title: post.title,
      post,
      currentUserId: req.session.user!.userId
    });
  } catch(err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error.'});
  }
})

router.get('/posts/edit/:id', requireAuth, async (req, res) => {
  try{
    const post = await Post.findById(req.params.id).populate('author','username');

    if (!post) return res.status(404).render('error', { message: 'Page not found.'});
    
    // console.log(post)
    res.render('posts/edit', {
      title: post.title,
      post,
      currentUserId: req.session.user?.userId
    });
  } catch(err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error.'});
  }
})



export default router;