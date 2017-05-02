let protectedPostService;

class PostService {

  constructor(dbService) {
    this._dbService = dbService;
  }
  createPost(req, res, next) {

    const collection = "posts",
      document = req.body;

    this._dbService
      .insert({collection, document})
      .then(success => {
        console.log("Post Created", success.result);
        res.send("Post Created");
      })
      .catch(err => {
        console.log("createPost()//Error while creating post...", err);
        next(err);
      });
  }

}

function getPostServiceInstance(dbService) {
  protectedPostService = protectedPostService || new PostService(dbService);
  return protectedPostService;
}

module.exports = getPostServiceInstance;
