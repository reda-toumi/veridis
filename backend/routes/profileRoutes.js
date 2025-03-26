const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");

const prisma = new PrismaClient();
const router = express.Router();

// Search users by username
router.get("/search/:query", authenticateToken, async (req, res) => {
  try {
    const query = req.params.query;
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        username: true,
        avatar: true
      },
      take: 5 // Limit to 5 results
    });

    // Convert avatar to base64 if it exists
    const usersWithAvatarUrl = users.map(user => ({
      ...user,
      avatarUrl: user.avatar ? `data:image/jpeg;base64,${user.avatar.toString('base64')}` : null
    }));

    res.json(usersWithAvatarUrl);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// Get user profile by username
router.get("/:username", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching profile for username:", req.params.username);
    console.log("Authenticated user ID:", req.user.userId);
    console.log("Request headers:", req.headers);

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ error: "Database connection error" });
    }

    
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      console.log("User not found in database:", req.params.username);
      return res.status(404).json({ error: "User not found" });
    }

    // Convert avatar to base64 if it exists
    const userWithAvatarUrl = {
      ...user,
      avatarUrl: user.avatar ? `data:image/jpeg;base64,${user.avatar.toString('base64')}` : null
    };

    console.log("Profile found successfully:", {
      id: user.id,
      username: user.username,
      postCount: user.posts?.length || 0
    });

    res.json(userWithAvatarUrl);
  } catch (error) {
    console.error("Detailed error fetching user profile:", {
      error: error.message,
      stack: error.stack,
      username: req.params.username,
      headers: req.headers,
      prismaError: error.code
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Database constraint violation" });
    }
    
    res.status(500).json({ 
      error: "Failed to fetch user profile",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 