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

// Modify user
router.patch("/", authenticateToken, async (req, res) => {
  const id = req.user.id; 
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

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access-token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.json({ message: "Sesión cerrada" });
});

// Get profile of authenticated user
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

  try {
    const newUser = await userService.createUser();

    if (newUser instanceof Error) {
      return res.status(400).json({ error: newUser.message });
    }

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    res
      .cookie("access-token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Registro exitoso", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Change password
router.patch("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const userService = new UserService(req.body);
    const result = await userService.changePassword(req.user.id);

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Delete account of an authenticated user (password is required)
router.delete("/", authenticateToken, async (req, res) => {
  const userService = new UserService({
    id: req.user.id,
    password: req.body.password,
  });

  try {
    const result = await userService.deleteUserWithPassword();

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    res.clearCookie("access-token").json({ message: result });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Validate token
router.get("/validate-token", (req, res) => {
  const token = req.cookies["access-token"];

  if (!token) {
    return res.status(401).json({ message: "No hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
    return res.status(200).json({ message: "Token válido", user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
});


export default router;
