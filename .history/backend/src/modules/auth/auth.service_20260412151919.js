import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
      role: SystemRole.USER, // ✅ FIX
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

// ✅ LOGIN SERVICE (đúng)
export const login = async ({ email, password }) => {
  const user = await prisma.account.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};
