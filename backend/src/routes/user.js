import express from "express";

// services
import { UserService } from "../services/userService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello world!! ");
});

router.post("/create", async (req, res) => {
  const userService = new UserService(req.body);
  const success = await userService.createUser();

  if (success == true) {
    res.status(200).json({ message: "Usuario creado correctamente." });
  } else {
    if (success.name == "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Ya existe un usario con ese nombre de usuario." });
    } else {
      res.status(400).json({ error: "Algo ha ido mal." });
    }
  }
  
});



export default router;
