const ApiError = require("../../util/apiError"),
  Q = require("q");

let protectedPostService;

class PostService {

  constructor(dbService, paraService) {
    this._dbService = dbService;
    this._paraService = paraService;
  }
  createPost(req, res, next) {

    const collection = "posts",
      document = {
        "_id": "",
        "title": "",
        "paragraphs": []
      };

    let postPayload = req.body,
      {text} = postPayload,
      paraArray = text.split("\n\n");

    document._id = postPayload.id;
    document.title = postPayload.title;

    this._paraService.createParagraphs(postPayload.id, paraArray)
      .then(paraIds => {
        document.paragraphs = paraIds;
        return this._dbService
          .insertOne({collection, document});
      })
      .then(wc => {
        let result = {
          "id": document._id,
          "status": "success"
        };

        console.log("createPost()//Post Created successfully...", wc.result);
        res.send(result);
      })
      .catch(err => {
        console.log("createPost()//Error while creating post...", err);
        next(err);
      });
  }

  retrieveFullPostDetails(req, res, next) {

    let collection = "posts",
      id = req.params.id,
      query = {
        "body": {
          "_id": id
        }
      };

    this._dbService
      .read({collection, query})
      .then(docArr => {
        let {paragraphs} = docArr[0],
          queryPara = {
            "body": {
              "_id": {
                "$in": paragraphs
              }
            }
          };

        this._paraService.retrieveParaDetails(queryPara)
          .then(data => {
            console.log("calculated full post details ---> ", data);
            res.send(data);
          })
          .catch(err => {
            next(err);
          });
      });
  }

  retrievePostLists(req, res, next) {

    let {mode, page} = req.query,
      collection = "posts",
      query = {
        "body": {},
        "limit": 5,
        "skip": 5 * (page - 1)
      };

    if (mode !== "list") {
      let apiErr = new ApiError("BadRequest", "", "Request is not accepted by Server", 400);

      return next(apiErr);
    }

    this._dbService
      .read({collection, query})
      .then(postDetails => {

        let postDocs = postDetails;

        postDocs = postDetails.map(post => {
          let {paragraphs} = post,
            defer = Q.defer(),
            postDtl = post,
            queryPara = {
              "body": {
                "_id": {
                  "$in": paragraphs
                }
              },
              "fields": {
                "comments": 0
              }
            };

          this._paraService.retrieveParaDetails(queryPara, false)
            .then(result => {
              postDtl.paragraphs = [];
              postDtl.paragraphs = result;
              defer.resolve(postDtl);
            });
          return defer.promise;
        });
        return postDocs;
      })
      .then(postDocs => {
        console.log("postdocs promise-------------", postDocs);

        Q.all(postDocs)
          .then(result => {
            console.log("retrievePostLists()//success ---->", result);
            res.send(result);
          });
      })
      .catch(err => {
        console.log("retrievePostLists()//Error while computing ---->", err);
      });
  }

}

function getPostServiceInstance(dbService, paraService) {
  protectedPostService = protectedPostService || new PostService(dbService, paraService);
  return protectedPostService;
}

module.exports = getPostServiceInstance;
