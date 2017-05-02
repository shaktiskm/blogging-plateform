const express = require("express"),
  bodyparser = require("body-parser"),
  methodOverride = require("method-override"),
  checkEnvironmentVariables = require("./util/checkEnvironmentVariables"),
  ApiError = require("./util/apiError"),
  mwAllowCrossDomain = require("./middleware_services/mwAllowCrossDomain"),
  mwErrorHandler = require("./middleware_services/mwErrorHandler"),
  paraRouter = require("./endpoints/paragraphs"),
  postRouter = require("./endpoints/posts");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  urlPrefix = config.urlPrefix,
  app = express(),
  environmentVariables = require("../config/environmentVariables");

// Checks the required enviro// Defines top middleware and routesnment variables
// Logs the missing environment variables and exit the application
if (config.environmentVariableChecker.isEnabled) {
  checkEnvironmentVariables(environmentVariables);
}

// set the relevant config app wise
app.set("port", config.http.port);

app.use(mwAllowCrossDomain);
app.use(bodyparser.json());

app.get(`${urlPrefix}/healthcheck`, (req, res) => {
  res.send({"msg": "OK"});
});

// App routes here
app.use("/posts", postRouter);
app.use("/para", paraRouter);

app.use((req, res, next) => {
  let apiError = new ApiError("NotFound", "Resource doesn't exist", "", 404);

  return next(apiError);
});
app.use(methodOverride);
app.use(mwErrorHandler);

app.listen(app.get("port"), () => {
  console.log(`Server is listening on port --> ${app.get("port")}`);
});

module.exports = app;
