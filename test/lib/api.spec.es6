const expect = require("chai").expect,
  request = require("superagent"),
  url = "http://localhost:8050/v1/healthcheck";

describe("Testing Express Http Endpoints", () => {

  describe("when GET /v1/healthcheck is called", () => {

    before(() => {
      require("../../dist/api");
    });

    after(() => {
      process.exit(1);
    });

    it("should return statusCode 200 sucessfully", done => {

      request
        .get(url)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it("should return message 'OK' successfully", done => {

      request
        .get(url)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.msg).to.equal("OK");
          done();
        });
    });

  });
});

