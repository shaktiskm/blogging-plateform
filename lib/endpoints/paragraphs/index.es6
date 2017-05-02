
const express = require("express"),
  getParaServiceInstance = require("./ParaService"),
  getGenericRepoIns = require("../../mongodb/GenericRepository");

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../../config/" + nodeEnv)),
  dbService = getGenericRepoIns(config),
  paraServiceIns = getParaServiceInstance(dbService),
  router = express.Router(),
  rootParaRoute = router.route("/");

rootParaRoute
  .post(paraServiceIns.createPara.bind(paraServiceIns));

module.exports = router;
