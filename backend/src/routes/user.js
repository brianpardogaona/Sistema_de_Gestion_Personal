import express from "express";

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

// Create a new user
router.post("/create", async (req, res) => {
  const userService = new UserService(req.body);
  const success = await userService.createUser();

  if (success == true) {
    res.status(200).json({ message: "Usuario creado correctamente." });
  } else {
    if (success.name == "SequelizeUniqueConstraintError") {
      res
        .status(400)
        .json({ error: "Ya existe un usario con ese nombre de usuario." });
    } else {
      res.status(400).json({ error: "Algo ha ido mal." });
    }
  }
});

// Delete an user by id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const body = { id: id };
  const user = new UserService(body);

  const result = await user.deleteUser();
  if (!(result instanceof Error)) {
      res.send({message: result});
  } else {
    res.status(400).json({error: result.message});
  }
});



export default router;
