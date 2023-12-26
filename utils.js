const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

const logger = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get("authorization");

//   if (authorization && authorization.startsWith("bearer ")) {
//     req.token = authorization.substring(7);
//   } else {
//     res.status(401).send("unauthorized");
//   }

//   console.log("extracted token: ", req.token);

//   next();
// };

const userExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("bearer ")) {
    // extract token
    req.token = authorization.substring(7);

    // extract user
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken) {
      res.status(401).send("token invalid");
    }

    req.user = await User.findById(decodedToken.id).populate("lists");
  } else {
    res.status(401).send("unauthorized");
  }

  // console.log("extracted user: ", req.user);

  next();
};

const errorHandler = async (error, req, res, next) => {
  logger(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

module.exports = { logger, userExtractor, errorHandler };
