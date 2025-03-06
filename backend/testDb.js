const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDb() {
  try {
    const users = await prisma.user.findMany(); // Fetch all users
    console.log("✅ Connected to DB! Users:", users);
  } catch (error) {
    console.error("❌ Database connection error:", error);
  } finally {
    await prisma.$disconnect(); // Always disconnect Prisma
  }
}

testDb();
