
const express = require("express"),
  getPostServiceInstance = require("./PostService"),
  getParaServiceInstance = require("../paragraphs/ParaService"),
  getGenericRepoIns = require("../../mongodb/GenericRepository");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../../config/" + nodeEnv)),
  dbService = getGenericRepoIns(config),
  paraServiceIns = getParaServiceInstance(dbService),
  postServiceIns = getPostServiceInstance(dbService, paraServiceIns),
  router = express.Router(),
  rootPostsRoute = router.route("/"),
  readFullBlogRoute = router.route("/:id");

rootPostsRoute
  .post(postServiceIns.createPost.bind(postServiceIns));

rootPostsRoute
  .get(postServiceIns.retrievePostLists.bind(postServiceIns));

readFullBlogRoute
  .get(postServiceIns.retrieveFullPostDetails.bind(postServiceIns));

module.exports = router;
