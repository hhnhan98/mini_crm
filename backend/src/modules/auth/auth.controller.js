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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }

    const result = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login success",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};
