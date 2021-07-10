class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    console.log({ message });
    this.statusCode = statusCode;
  }
}

class CustomPropertyError extends CustomError {
  constructor(message, property, statusCode) {
    super(message);
    this.message = { [property]: message };
    this.statusCode = statusCode;
  }
}

const isOperationalError = (error) => {
  let isOperatoinalError = false;
  if (error instanceof CustomError) {
    isOperationalError = true;
  }
  return isOperatoinalError;
};

module.exports = { CustomError, CustomPropertyError, isOperationalError };
