import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import { SystemRole } from "@prisma/client";

export const register = async ({ email, password, name }) => {
  const existingUser = await prisma.account.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_ROUNDS) || 10
  );

  const user = await prisma.account.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: SystemRole.MEMBER,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
