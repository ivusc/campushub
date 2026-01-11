import { Router } from "express";
import Post from "../models/Post.js";
import { requireAuth } from "../middleware/middleware.js";

const router = Router();

//PAGE ROUTES
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .limit(6)
      .populate("author", "username");

    if (!posts) return res.status(404).send("Posts not found.");

    res.render("index", {
      posts,
    });
  } catch (err) {
    res.status(500).send("Server error.");
  }
});

router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.session.user!.userId })
        .sort({ createdAt: -1 });

    res.render('dashboard', { 
        title: 'My Dashboard', 
        posts: userPosts 
    });
  } catch (error) {
      console.error(error);
      res.status(500).render('error', { message: 'Could not load dashboard' });
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/privacy", (req, res) => {
  res.render('info/privacy', { title: 'CampusHub - Privacy Policy' });
});

router.get("/terms", (req, res) => {
  res.render('info/terms', { title: 'CampusHub - Terms of Service' });
});

router.get("/contact", (req, res) => {
  res.render('info/contact', { title: 'CampusHub - Contact Us' });
});

router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Contact Form Submission: ${name} (${email}) - ${message}`);
    //TODO: Add nodemailer.
    
    res.render('info/contact', { 
      title: 'Contact Us', 
      success: 'Thank you! Your message has been received.' 
    });
});


export default router;
