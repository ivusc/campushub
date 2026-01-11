# CampusHub

CampusHub is a beginner-friendly full-stack web application built to learn server-side web development using **EJS, Express, TypeScript, MongoDB, and Mongoose**. The project focuses on core backend concepts such as authentication, authorization, session management, database interactions, and basic file system operations.

---

## 📌 Features

* User registration and login
* Secure password hashing
* Session-based authentication
* Authorization (users can only manage their own content)
* Create, read, update, and delete posts
* Public and private posts
* Server-side rendering with EJS
* MongoDB persistence using Mongoose
* File system usage (e.g. logging or text file storage)

---

## 🛠 Tech Stack

* **Node.js** – JavaScript runtime
* **Express** – Web framework
* **TypeScript** – Type-safe JavaScript
* **EJS** – Server-side templating
* **MongoDB** – NoSQL database
* **Mongoose** – ODM for MongoDB
* **express-session** – Session management
* **bcrypt** – Password hashing

---

## 📂 Project Structure

```
src/
│
├── app.ts
├── server.ts
│
├── models/
│   ├── User.ts
│   └── Post.ts
│
├── routes/
│   ├── auth.routes.ts
│   └── post.routes.ts
│
├── controllers/
│   ├── auth.controller.ts
│   └── post.controller.ts
│
├── middleware/
│   ├── requireAuth.ts
│   └── attachUser.ts
│
├── views/
│   ├── partials/
│   ├── auth/
│   ├── posts/
│   └── home.ejs
│
├── public/
├── uploads/
└── logs/
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB (local or MongoDB Atlas)
* npm

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd campushub
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file

   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open your browser and visit:

   ```
   http://localhost:3000
   ```

---

## 🔐 Authentication & Authorization

* Passwords are hashed using `bcrypt`
* Sessions are managed using `express-session`
* Protected routes require authentication
* Users can only edit or delete their own posts

---

## 🗄 Database Models

### User

* username
* email
* passwordHash
* role
* createdAt

### Post

* title
* content
* author
* isPublic
* createdAt

---

## 📁 File System Usage

The application demonstrates Node.js file system usage through features such as:

* Logging user actions to files
* Saving uploaded or generated text files

---

## 🎓 Learning Outcomes

By completing this project, you will gain hands-on experience with:

* Server-side rendering
* Express middleware and routing
* TypeScript in a Node.js environment
* MongoDB and Mongoose
* Session-based authentication
* Role-based authorization
* File system operations in Node.js

---

## 📖 Future Improvements

* Admin roles
* Pagination
* Search functionality
* Image uploads
* CSRF protection

---

## 📄 License

This project is for educational purposes only.
