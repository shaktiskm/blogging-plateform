
const express = require("express"),
  getParaServiceInstance = require("./PostService"),
  getGenericRepoIns = require("../../mongodb/GenericRepository");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../../config/" + nodeEnv)),
  dbService = getGenericRepoIns(config),
  postServiceIns = getParaServiceInstance(dbService),
  router = express.Router(),
  rootPostRoute = router.route("/");

rootPostRoute
  .post(postServiceIns.createPost.bind(postServiceIns));

module.exports = router;
