import express from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware/authMiddleware.js";

// services
import { UserService } from "../services/UserService.js";

const router = express.Router();

//  Get all users
router.get("/", async (req, res) => {
  const user = new UserService();
  res.send(await user.getAllUsers());
});

// Login
router.post("/login", async (req, res) => {
  const userService = new UserService(req.body);

  try {
    const foundedUser = await userService.login();
    const token = jwt.sign(
      {
        id: foundedUser.dataValues.id,
        username: foundedUser.dataValues.username,
      },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    res
      .cookie("access-token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Inicio de sesión exitoso", user: foundedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener perfil del usuario autenticado
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userService = new UserService({ id: req.user.id });
    const user = await userService.getUserProfile();

    if (!(user instanceof Error)) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: user.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  const userService = new UserService(req.body);
  const success = await userService.createUser();

  if (!(success instanceof Error)) {
    res.status(200).json({ message: success });
  } else {
    const errorResponse = {
      error: success.message,
      code: success.name || "UNKNOWN_ERROR",
    };
    res.status(400).json(errorResponse);
  }
});

// Delete user by id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const body = { id: id };
  const user = new UserService(body);

  const result = await user.deleteUser();
  if (!(result instanceof Error)) {
    res.send({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Modify user
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const userService = new UserService({ id, ...req.body });

  try {
    const result = await userService.modifyUser();

    if (!(result instanceof Error)) {
      res.status(200).json({ message: result });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
