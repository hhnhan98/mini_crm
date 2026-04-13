import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";

export const register = async ({ email, password, name }) => {
  const existingUser = await prisma.account.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.account.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "MEMBER",
    },
  });

  return user;
};
