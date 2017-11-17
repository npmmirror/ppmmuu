/**
 * Created by chaoningxie on 2016/12/10.
 */
const fs = require('fs');
const utils = require('../../common/utils');
const clientConnect = require('socket.io-client');
const socketStreamClient = require('socket.io-stream');
const crypto = require('crypto');
const TransferTask = require('./transferTask');

const config = require('../../config');

class FileClient {
  constructor(options) {
    this.settings = Object.assign({
      host: 'localhost',
      port: 8090,
      key: config.KEY,
      userId: 'chaoningx@gmail.com',
      isCrypto: true,
      filePath: '/Users/chaoningxie/Downloads/ubuntu-16.04-server-amd64.iso',
      concurrency: 5
    }, options);

    this.transferTaskInstance = null;
    this.isConnect = false;
    this.passedLength = 0;
    this.socket = null;
  }

  transfer() {
    let me = this;

    me.connectState();
    me.showProcess(me.settings.filePath);

    const socket = clientConnect('http://' + me.settings.host + ':' + me.settings.port + '/file', {
      extraHeaders: {
        'ump-ticket': utils.cipher(me.settings.userId + '-' + (me.settings.isCrypto ? 1 : 0), me.settings.key)
      }
    });

    this.socket = socket;

    socket.on('connect', function() {
      let task = new TransferTask({ filePath: me.settings.filePath });
      task.socketId = socket.id;
      socket.emit('headerPackage', task.headerPackage);
      me.transferTaskInstance = task;
      utils.console('socket connect, socket id blow ', me.getSocketId());
      me.isConnect = true;
    });

    socket.on('transfer_start', function() {
      me.sendPartOfFilePackage();
    });

    socket.on('transfer_package_success', function(data) {
      me.transferTaskInstance.setSuccessPackage(data._id);
    });

    socket.on('transfer_package_error', function(data) {
      me.transferTaskInstance.setFailPackage(data._id, data.error);
    });

    socket.on('transfer_package_finish', function(data) {
      me.sendPartOfFilePackage();
    });

    socket.on('invalid_request', function(msg) {
      utils.console('invalid_request socket id: ' + me.getSocketId(), msg);
    });

    socket.on('complete', function() {
      utils.console('file transfer complete');
    });

    socket.on('error', function(err) {
      utils.console('error socket id: ' + me.getSocketId(), err);
      process.exit();
    });

    socket.on('disconnect', function(msg) {
      utils.console('disconnect with server' + me.getSocketId(), msg);
      process.exit();
    });
  }

  connectState() {
    let me = this;
    let fn = function(count) {
      utils.processWrite('正在连接服务器('+ me.settings.host + ':' + me.settings.port +')...' + count);
      if(!me.isConnect) {
        setTimeout(function() {
          fn(count+1);
        }, 1000);
      }
    };

    fn(1);
  }

  getSocketId() {
    return this.transferTaskInstance ? this.transferTaskInstance.socketId : '';
  }

  showProcess(filePath) {
    let me = this;
    let stat = fs.statSync(filePath);
    let totalSize = stat.size;
    let lastSize = 0;
    let startTime = Date.now();
    let interval = 5000;

    let show = function() {
      let percent = Math.ceil((me.passedLength / totalSize) * 100);
      let averageSpeed = (me.passedLength - lastSize) / interval * 1000;

      lastSize = me.passedLength;
      utils.processWrite('已完成' + utils.formatSize(me.passedLength) + ', ' + percent + '%, 平均速度：' + utils.formatSize(averageSpeed) + '/s');

      if(me.passedLength >= totalSize) {
        console.log('共用时：' + (Date.now() - startTime) / 1000 + '秒');
      }else {
        setTimeout(function() {
          show();
        }, interval);
      }
    };

    show();
  }

  sendPartOfFilePackage() {
    let hasTask = true;
    let me = this;

    let createTask = function(index) {
      if(!hasTask) { return false; }
      let pkg = me.transferTaskInstance.getPackage();

      if(pkg === 'done') {
        hasTask = false;
        utils.console('transfer complete');
      }else if(pkg) {
        if(index < me.settings.concurrency) {
          setImmediate(createTask, index + 1);
        }
        let stream = socketStreamClient.createStream();
        socketStreamClient(me.socket).emit('fileStream', stream, pkg.packageInfo);

        pkg.stream.on('data', function(chunk) {
          me.passedLength += chunk.length;
        });
        if(me.settings.isCrypto) {
          const cipher = crypto.createCipher('aes192', me.settings.key);
          pkg.stream.pipe(cipher).pipe(stream);
        }else {
          pkg.stream.pipe(stream);
        }
      }else {
        hasTask = false;
        // utils.console('all the task is running');
      }
    };

    createTask(0);
  }
};

let fc = new FileClient({
  host: '10.0.16.101',
  port: 8080,
  filePath: '/Users/chaoningx/Downloads/Microsoft_Office_2016_15.24.0_160709_Installer.pkg',
  concurrency: 5, //并发
  userId: 'chaoningx'
});

fc.transfer();

module.exports = FileClient;
