import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      products: true
    }
  });
  console.log("ALL USERS IN DB:");
  users.forEach(u => {
    console.log(`User ID: ${u.id}`);
    console.log(`Name: ${u.name}`);
    console.log(`Email: ${u.email}`);
    console.log(`Products:`, u.products.map(p => p.name));
    console.log(`---`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
