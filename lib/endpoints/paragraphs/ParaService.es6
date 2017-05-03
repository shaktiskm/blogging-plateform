const Q = require("q");

let protectedParaService;

class ParaService {

  constructor(dbService, uuidService) {
    this._dbService = dbService;
    this._uuidService = uuidService;
  }
  createPara(req, res, next) {

    const collection = "paragraphs",
      document = req.body;

    this._dbService
      .insertOne({collection, document})
      .then(success => {
        console.log("Para Created", success.result);
        res.send({"msg": "success"});
      })
      .catch(err => {
        console.log("createPara()//Error while creating para...", err);
        next(err);
      });
  }

  createComments(req, res, next) {
    const collection = "comments",
      document = req.body,
      paraId = req.params.id;

    document._id = this._uuidService.createUniqueId();

    Q.all([
      this._dbService.insertOne({collection, document}),
      this.updateParaComments(paraId, document._id)
    ])
      .then(success => {
        console.log("Comment Created", success.result);
        res.send({"msg": "success"});
      })
      .catch(err => {
        console.log("createComments()//Error while creating comments...", err);
        next(err);
      });

  }

  updateParaComments(paraId, commentId) {
    const collection = "paragraphs",
      query = {
        "_id": paraId
      },
      document = {
        "$push": {
          "comments": commentId
        }
      };

    return this._dbService
      .update({collection, query, document});
  }

  createParagraphs(postId, paraArray) {

    console.log("in createParagraphs");

    let collection = "paragraphs",
      documents = [],
      paraIds = [];

    for (let text of paraArray) {
      let document = {
        "_id": "",
        "postID": postId,
        "content": text,
        "comments": []
      };

      document._id = this._uuidService.createUniqueId();
      paraIds.push(document._id);
      documents.push(document);
    }

    return this._dbService
      .insert({collection, documents})
      .then(success => {
        console.log("createParagraphs()// success -->", success.result);
        return paraIds;
      });
  }

  retrieveParaDetails(query, isFull = true) {
    let collection = "paragraphs";

    return this._dbService
      .read({collection, query})
      .then(paraDocs => {

        if (!isFull) {
          return paraDocs;
        }
        console.log("paradocs------>", paraDocs);

        let resultDocs = paraDocs;

        console.log("inside arr----------");
        resultDocs = paraDocs.map(para => {
          let paraDtl = para,
            defer = Q.defer();

          if (para.comments.length === 0) {
            defer.resolve(paraDtl);
          }

          this.getComments(para)
            .then(commentDtl => {
              paraDtl.comments = [];
              paraDtl.comments = commentDtl;
              defer.resolve(paraDtl);
            });
          return defer.promise;
        });


        return resultDocs;
      })
      .then(resultDocs => {
        console.log("retrieveParaDetails()//proise--------------", resultDocs);
        return Q.all(resultDocs)
          .then(res => {
            console.log("retrieveParaDetails()//--------------", res);
            return res;
          });
      });
  }

  getComments(paraDoc) {

    let {comments} = paraDoc,
      query = {
        "body": {
          "_id": {
            "$in": comments
          }
        }
      };

    console.log("comments-----------", comments);

    return this.retrieveComments(query);
  }

  retrieveComments(query) {
    let collection = "comments";

    return this._dbService
      .read({collection, query});
  }

}

function getParaServiceInstance(dbService, uuidService) {
  protectedParaService = protectedParaService || new ParaService(dbService, uuidService);
  return protectedParaService;
}

module.exports = getParaServiceInstance;
