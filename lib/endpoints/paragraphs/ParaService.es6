const Q = require("q");

let protectedParaService;

class ParaService {

  constructor(dbService, uuidService) {
    this._dbService = dbService;
    this._uuidService = uuidService;
  }

  createComments(req, res, next) {
    const collection = "comments",
      document = req.body,
      paraId = req.params.id;

    document._id = this._uuidService.createUniqueId();
    document.createdDate = new Date();

    Q.all([
      this._dbService.insertOne({collection, document}),
      this.updateParaComments(paraId, document._id)
    ])
      .then(() => {
        res.send({"status": "success"});
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
      .then(() => {
        console.log("createParagraphs()// success -->");
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
        let resultDocs = paraDocs;

        resultDocs = paraDocs.map(para => {
          let paraDtl = para,
            defer = Q.defer();

          if (para.comments.length === 0) {
            defer.resolve(paraDtl);
          }

          this.getComments(para)
            .then(commentDtl => {
              paraDtl.comments = commentDtl;
              defer.resolve(paraDtl);
            });
          return defer.promise;
        });
        return resultDocs;
      })
      .then(resultDocs => Q.all(resultDocs));
  }

  getComments(paraDoc) {

    let {comments} = paraDoc,
      query = {
        "body": {
          "_id": {
            "$in": comments
          }
        },
        "sort": {
          "createdDate": 1
        }
      };

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
