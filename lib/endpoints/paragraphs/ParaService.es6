let protectedParaService;

class ParaService {

  constructor(dbService) {
    this._dbService = dbService;
  }
  createPara(req, res, next) {

    const collection = "paragraphs",
      document = req.body;

    this._dbService
      .insert({collection, document})
      .then(success => {
        console.log("Para Created", success.result);
        res.send("Para Created");
      })
      .catch(err => {
        console.log("createPara()//Error while creating para...", err);
        next(err);
      });
  }

}

function getParaServiceInstance(dbService) {
  protectedParaService = protectedParaService || new ParaService(dbService);
  return protectedParaService;
}

module.exports = getParaServiceInstance;
