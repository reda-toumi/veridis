const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Formats a post with additional user-specific data and accurate counts
 * @param {Object} post - The post object from Prisma
 * @param {string|null} userId - The current user's ID, if authenticated
 * @returns {Promise<Object>} - The formatted post
 */
async function formatPost(post, userId = null) {
  // Get accurate counts
  const [likeCount, commentCount] = await Promise.all([
    prisma.like.count({ where: { postId: post.id } }),
    prisma.comment.count({ where: { postId: post.id } })
  ]);

  // Check if the current user liked the post
  const liked = userId ? await prisma.like.findFirst({
    where: {
      postId: post.id,
      userId: userId
    }
  }).then(like => !!like) : false;

  return {
    ...post,
    liked,
    _count: {
      likes: likeCount,
      comments: commentCount
    }
  };
}

/**
 * Formats multiple posts with additional user-specific data and accurate counts
 * @param {Array<Object>} posts - Array of post objects from Prisma
 * @param {string|null} userId - The current user's ID, if authenticated
 * @returns {Promise<Array<Object>>} - Array of formatted posts
 */
async function formatPosts(posts, userId = null) {
  return Promise.all(posts.map(post => formatPost(post, userId)));
}

module.exports = {
  formatPost,
  formatPosts
}; 