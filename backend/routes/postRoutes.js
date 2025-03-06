const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

// Create a new post (Protected Route)
router.post("/posts", authenticateToken, async (req, res) => {
    try {
      const { content } = req.body;
  
      if (!content.trim()) {
        return res.status(400).json({ error: "Post content cannot be empty" });
      }
  
      // Create post in the database
      const newPost = await prisma.post.create({
        data: {
          content,
          userId: req.user.userId, // Attach the logged-in user's ID
        },
      });
  
      // Fetch the newly created post with user info
      const postWithUser = await prisma.post.findUnique({
        where: { id: newPost.id },
        include: {
          user: { select: { id: true, username: true } }, // Ensure user info is included
        },
      });
  
      res.status(201).json(postWithUser);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

// Get all posts (Public Route)
router.get("/posts", async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: { select: { id: true, username: true } }, // Ensure user data is included
        },
        orderBy: { createdAt: "desc" }, // Order by newest first
      });
  
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Get posts for the logged-in user (Protected Route)
router.get("/my-posts", authenticateToken, async (req, res) => {
    try {
      const userPosts = await prisma.post.findMany({
        where: { userId: req.user.userId }, // Fetch posts by user ID
        include: {
          user: { select: { id: true, username: true } }, // Include username
        },
        orderBy: { createdAt: "desc" },
      });
  
      res.json(userPosts);
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
// DELETE a post (Only allow the owner to delete)
router.delete("/posts/:id", authenticateToken, async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.userId; // Get user from token
  
      // Find the post
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // Check if the logged-in user is the owner
      if (post.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to delete this post" });
      }
  
      // Delete post
      await prisma.post.delete({
        where: { id: postId },
      });
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Get posts for a specific user (Protected Route)
router.get("/posts/user/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching posts for user:', userId);

    const userPosts = await prisma.post.findMany({
      where: { userId: userId },
      include: {
        user: { 
          select: { 
            id: true, 
            username: true,
            avatar: true 
          } 
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${userPosts.length} posts for user ${userId}`);
    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;