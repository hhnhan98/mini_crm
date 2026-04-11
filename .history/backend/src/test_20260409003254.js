await prisma.account.create({
  data: {
    email: "test@gmail.com",
    password: "123456",
    name: "Test",
    role: "ADMIN",
  },
});
