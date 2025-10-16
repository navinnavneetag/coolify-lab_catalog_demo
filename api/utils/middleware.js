const firstMiddleware = (req, res, next) => {
  console.log("I am in the first middlware");
  console.log("---");
  console.log("Method: ", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

const cleanEmptyArrays = (req, res, next) => {
  if (req.body) {
    const cleanBody = {};
    
    Object.keys(req.body).forEach(key => {
      if (Array.isArray(req.body[key]) && req.body[key].length > 0) {
        cleanBody[key] = req.body[key];
      }
    });

    req.body = cleanBody;
  }
  console.log(req.body);
  next();
}; 

const middleware = { errorHandlerMiddleware, firstMiddleware, cleanEmptyArrays };

export default middleware;

