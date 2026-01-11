import { Router } from "express";
import bcrypt from 'bcrypt';
import type { IUser } from "../models/User.js";
import User from "../models/User.js";

const router = Router();

//PAGE ROUTES
router.get('/register', (req , res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/register', async (req, res) => {
  const { username, email, password } : IUser = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) res.render('register', { error: 'Username already taken.'})

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    req.flash('success', 'Registered successfully.');
    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Error registering user: ' + error)
  }
})

router.post('/login', async (req, res) => {
  const { username, password, rememberMe } : IUser = req.body;
  console.log(rememberMe);
  
  try{
    const user = await User.findOne({ username });

    if (!user) return res.status(404).render('login', { error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password) ;
    if (!isMatch) return res.status(401).render('login', { error: 'Wrong username or password.' });


    if (rememberMe === 'true') {
      req.session.cookie.maxAge = 5 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    }
    
    req.session.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.render('login', { error: 'Login failed to persist' });
      }
      console.log("Session before save:", req.session);
      req.flash('success', 'Logged in successfully.');
      res.redirect('/posts')
    }); 
  } catch (error) {
    res.status(500).send('Error logging in: ' + error)
  }

})

router.post('/logout', async (req, res) => {
  
  req.session.user = null; 
  req.flash('success', 'Logged out successfully');
  console.log("Session after logging out: ", req.session);

  // 3. Save and redirect
  req.session.save(() => {
    res.redirect('/login');
  });
})

export default router;