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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password",
      });
    }

    const result = await authService.login({ email, password });

    res.json({
      message: "Login success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
