import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies["access-token"];
  if (!token) {
    return res.status(401).json({ error: "No autorizado, token requerido" });
  }

  jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    req.user = user;
    next();
  });
};
