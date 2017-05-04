
const express = require("express"),
  getParaServiceInstance = require("./ParaService"),
  getGenericRepoIns = require("../../mongodb/GenericRepository"),
  uuid = require("uuid"),
  getUniqueIdServiceInstance = require("../../util/UniqueIdService");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../../config/" + nodeEnv)),
  dbService = getGenericRepoIns(config),
  uuidService = getUniqueIdServiceInstance(uuid),
  paraServiceIns = getParaServiceInstance(dbService, uuidService),
  router = express.Router(),
  paraCommentRoute = router.route("/:id/comments");

paraCommentRoute
  .post(paraServiceIns.createComments.bind(paraServiceIns));

module.exports = router;
