import * as authService from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const user = await authService.register({ email, password, name });

    res.status(201).json({
      message: "Register success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  console.log("🔥 LOGIN HIT");

  return res.json({
    message: "OK controller reached",
  });
};
