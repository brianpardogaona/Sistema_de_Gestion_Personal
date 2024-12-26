import express from "express";
import jwt from "jsonwebtoken";

// services
import { UserService } from "../services/UserService.js";

const router = express.Router();

//  Get all users
router.get("/", async (req, res) => {
  const user = new UserService();
  res.send(await user.getAllUsers());
});

// Get user by id
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const body = { id: userId };

  const user = new UserService(body);

  const foundUser = await user.getUser();
  if (!(foundUser instanceof Error)) {
    res.send(foundUser);
  } else {
    res
      .status(400)
      .json({ error: "No se ha encontrado el usuario o no existe." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const user = new UserService(req.body);

  try {
    const foundedUser = await user.login();
    const token = jwt.sign(
      {
        id: foundedUser.dataValues.id,
        username: foundedUser.dataValues.username,
      },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res
      .cookie('acces-token', token, {
        httpOnly: true,
        sameSite: 'lax'
      })
      .send({foundedUser, token});
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  const user = new UserService(req.body);
  user.modifyUser();
});

export default router;
