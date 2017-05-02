"use strict";

// eslint disable no-var

var environmentVariables = require("./environmentVariables"),
  config = {
    "http": {
      "protocol": "http",
      "domain": "127.0.0.1",
      "port": 8050
    },
    "appName": "blogging-plateform",
    "mongoDb": {
      "connectionString": environmentVariables.MONGO_CONNECTION_STRING,
      "operationTimeout": 4000,
      "connectionOptions": {
        "server": {
          "poolSize": 5,
          "socketOptions": {
            "autoReconnect": true,
            "keepAlive": 0
          },
          "reconnectTries": 30,
          "reconnectInterval": 1000
        }
      },
      "promiseTimeout": 4500
    },
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/v1"
  };

module.exports = config;

// eslint enable no-var
