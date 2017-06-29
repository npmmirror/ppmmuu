/**
 * Created by steven on 17/5/5.
 */
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const mongodb = require('mongodb');
const redis = require('redis');

let config = {};

config.dbInstance = {};

const configPath = path.join(__dirname, './config_master.js');

config.mongodb = {
  umpURL: 'mongodb://10.0.15.62:27017/ump_v1',
};

config.redis_host = "10.0.15.105";
config.redis_port = 6379;
config.redis_opts = { auth_pass: "steven" };
config.KEY = 'secret';
config.cookieExpires = 1000 * 60 * 60 * 24 * 7;  //cookie有效期七天
config.redisExpires = 1 * 60 * 60 * 12;          //redis有效期12小时
config.port = process.env.NODE_ENV === 'development' ? 8080 : 8080;

let init = function() {
  let redisClient = redis.createClient(config.redis_port, config.redis_host, config.redis_opts);

  redisClient.on("error", function(err) {
    console.log("Redis Error: " + err);
  });

  redisClient.on("ready", function() {
    console.log("Redis Connect Success!");
  });

  config.redisClient = redisClient;
};

let readConfig = function(p) {
  const sandbox = {
    path: path,
    config: config,
    __dirname: __dirname,
    console: console,
    process: process
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(p), sandbox);
};

if(fs.existsSync(configPath)) {
  //读取生产环境config_master.js文件
  readConfig(configPath);
  init();
}else {
  if (process.env.NODE_ENV === 'development') { //本地开发环境
    readConfig(path.join(__dirname, './config_master.js'));
    config.host = "localhost:" + config.port;
    config.domain = 'http://' + config.host;
    init();
  }else {
    throw new Error('******** config_master.js file is not exist ********');
  }
};

module.exports = config;
