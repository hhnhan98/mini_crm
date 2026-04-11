import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// console.log(prisma);

async function main() {
  const account = await prisma.account.create({
    data: {
      email: "test@gmail.com",
      password: "123456",
      name: "Test Account",
    },
  });

  console.log(account);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
