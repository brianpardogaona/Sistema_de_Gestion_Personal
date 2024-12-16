export class Validation {
  static username(username) {
    if (typeof username != "string")
      throw new CustomError(
        "El nombre de usuario debe ser un string",
        "UsernameMustBeAString"
      );
    if (username.length < 4)
      throw new CustomError(
        "El nombre de usuario debe tener 4 carácteres mínimo",
        "StringNotLongerEnough"
      );
    if (!/^[a-zA-Z0-9._\-]+$/.test(username))
      throw new CustomError(
        "El nombre de usuario solo puede contener (letras, números, puntos y guiones)",
        "FormatIsNotCorrect"
      );
    if (!/^[a-zA-Z]$/.test(username[0]))
      throw new CustomError(
        "El primer caracter debe ser una letra",
        "FirstCharMustBeALetter"
      );
  }

  static name(name) {
    if (!/^[a-zA-z\- ]$/) {
      throw new CustomError(
        "El nombre/apellido no tiene un formato correcto",
        "NameOrLastNameFormatIsNotCorrect"
      );
    }
  }

  static password(password) {
    if (password.length < 8)
      throw new CustomError(
        "La contraseña debe tener, al menos, 8 carácteres",
        "PasswordNotLongerEnough"
      );
  }
}

class CustomError {
  constructor(errorDescription, code) {
    const error = new Error(errorDescription);
    error.name = code;
    return error;
  }
}
