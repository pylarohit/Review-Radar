import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      user: true
    }
  });
  console.log("ALL PRODUCTS IN DB:");
  products.forEach(p => {
    console.log(`Product ID: ${p.id}`);
    console.log(`Name: ${p.name}`);
    console.log(`userId (Product): ${p.userId}`);
    console.log(`userId (User ID): ${p.user?.id}`);
    console.log(`---`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
