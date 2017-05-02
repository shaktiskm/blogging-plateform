function mwErrorHandler(err, req, res, next) {

  if (err) {
    if (err.hasOwnProperty("name") && err.name === "ApiError") {
      console.error(`mwErrorHandler()//ApiError ------ ${err}`);
      res.status(err.statusCode).send(err);
    } else if (err instanceof Error) {
      console.error(`mwErrorHandler()//Unhandled Error------ ${err}`);
      res.status(500).send("Internal Server Error");
    }
  }
  next();
}

module.exports = mwErrorHandler;
