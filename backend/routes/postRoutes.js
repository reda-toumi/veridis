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
          userId: req.user.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          likes: true,
        },
      });

      // Format the response
      const formattedPost = {
        ...newPost,
        liked: false,
        _count: {
          likes: 0
        }
      };
  
      res.status(201).json(formattedPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// Get all posts (Public Route)
router.get("/posts", async (req, res) => {
    try {
      const userId = req.headers.authorization ? req.user?.userId : null;
      
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          likes: {
            select: {
              userId: true
            }
          },
          dislikes: {
            select: {
              userId: true
            }
          },
          _count: {
            select: {
              likes: true,
              dislikes: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
      });

      // Format posts with like/dislike status and count
      const formattedPosts = posts.map(post => ({
        ...post,
        liked: userId ? post.likes.some(like => like.userId === userId) : false,
        disliked: userId ? post.dislikes.some(dislike => dislike.userId === userId) : false,
        _count: {
          likes: post.likes.length,
          dislikes: post.dislikes.length
        },
        likedBy: post.likes.map(like => like.userId),
        dislikedBy: post.dislikes.map(dislike => dislike.userId),
        // Remove the arrays from the response
        likes: undefined,
        dislikes: undefined
      }));

      res.json(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// Get posts for the logged-in user (Protected Route)
router.get("/my-posts", authenticateToken, async (req, res) => {
    try {
      const userPosts = await prisma.post.findMany({
        where: { userId: req.user.userId },
        include: {
          user: { select: { id: true, username: true } },
          likes: true
        },
        orderBy: { createdAt: "desc" },
      });

      // Add liked status for the current user
      const postsWithLikeStatus = userPosts.map(post => ({
        ...post,
        liked: post.likes.some(like => like.userId === req.user.userId),
        _count: {
          likes: post.likes.length
        }
      }));

      res.json(postsWithLikeStatus);
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
// DELETE a post (Only allow the owner to delete)
router.delete("/posts/:id", authenticateToken, async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.userId;
  
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      if (post.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to delete this post" });
      }
  
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
      const targetUserId = req.params.userId;
      const currentUserId = req.user.userId;

      const posts = await prisma.post.findMany({
        where: {
          userId: targetUserId
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          likes: {
            select: {
              userId: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
      });

      // Format posts with like status and count
      const formattedPosts = posts.map(post => ({
        ...post,
        liked: post.likes.some(like => like.userId === currentUserId),
        _count: {
          likes: post.likes.length
        },
        likedBy: post.likes.map(like => like.userId),
        // Remove the likes array from the response
        likes: undefined
      }));

      res.json(formattedPosts);
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// Toggle like on a post (Protected Route)
router.post("/posts/:id/like", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true
      }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user has already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId
      }
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      res.json({ 
        liked: false,
        _count: {
          likes: post.likes.length - 1
        }
      });
    } else {
      // Like: Create new like
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      res.json({ 
        liked: true,
        _count: {
          likes: post.likes.length + 1
        }
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to update like status" });
  }
});

// Toggle dislike on a post (Protected Route)
router.post("/posts/:id/dislike", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        dislikes: true,
        likes: {
          where: {
            userId: userId
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Remove like if exists
    if (post.likes.length > 0) {
      await prisma.like.deleteMany({
        where: {
          postId: postId,
          userId: userId
        }
      });
    }

    // Check if user has already disliked the post
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        postId: postId,
        userId: userId
      }
    });

    if (existingDislike) {
      // Remove dislike
      await prisma.dislike.delete({
        where: { id: existingDislike.id }
      });
      res.json({ 
        disliked: false,
        _count: {
          dislikes: post.dislikes.length - 1
        }
      });
    } else {
      // Add dislike
      await prisma.dislike.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      res.json({ 
        disliked: true,
        _count: {
          dislikes: post.dislikes.length + 1
        }
      });
    }
  } catch (error) {
    console.error("Error toggling dislike:", error);
    res.status(500).json({ error: "Failed to update dislike status" });
  }
});

module.exports = router;