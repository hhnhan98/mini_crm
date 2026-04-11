import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log(prisma);
async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@gmail.com",
      password: "123456",
      name: "Test User",
    },
  });

  console.log(user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
