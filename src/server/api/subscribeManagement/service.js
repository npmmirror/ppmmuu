/**
 * Created by chaoningx on 2017/9/22.
 */

'use strict';

const logger = require('../../common/log')('error');
const utils = require('../../common/utils');
const i18n = require('i18next');

const SubscribeInfo = require('./subscribeInfo');
const SubscribeLog = require('./subscribeLog');
const GroupInfo = require('../group/groupInfo');

const subscribeInfo = new SubscribeInfo();
const groupInfo = new GroupInfo();
const subscribeLog = new SubscribeLog();

const service = {};

const basePagination = function basePagination(query, page, pageSize, cb) {
  subscribeInfo.pagination(query, page, pageSize, (err, docs) => {
    if (err) {
      logger.error(err.message);
      return cb && cb(i18n.t('databaseError'));
    }

    return cb && cb(null, docs);
  }, '-createdTime');
};

service.listSubscribeInfo = function listSubscribeInfo(req, cb) {
  const info = req.query;
  const keyword = info.keyword || '';
  const status = info.status || '';
  const page = info.page || 1;
  const pageSize = info.pageSize || 20;
  const query = {};

  if (status) {
    if (SubscribeInfo.STATUS.indexOf(status) === -1) {
      return cb && cb(i18n.t('shelfStatusNotCorrect'));
    }
    if (status === SubscribeInfo.STATUS.USING) {
      query.expiredTime = { $gte: new Date() };
      query.startTime = { $lt: new Date() };
    } else if (status === SubscribeInfo.STATUS.EXPIRED) {
      query.expiredTime = { $lt: new Date() };
    } else if (status === SubscribeInfo.STATUS.UNUSED) {
      query.startTime = { $gte: new Date() };
    }
  }

  if (keyword) {
    query.companyName = { $regex: keyword, $options: 'i' };
  }

  basePagination(query, page, pageSize, cb);
};

// 增加
service.createSubscribeInfo = function createSubscribeInfo(req, cb) {
  const userInfo = req.ex.userInfo;
  const info = req.body;

  info.creator = { _id: userInfo._id, name: userInfo.name };
  const t = new Date();
  info.createdTime = t;
  info.lastModifyTime = t;
  info.downloadSeconds = info.downloadSeconds * 60 * 60;
  info.remainDownloadSeconds = info.downloadSeconds;
  info.periodOfUse *= 1;
  const startTime = new Date(info.startTime);
  info.expiredTime = startTime.setMonth(startTime.getMonth() + info.periodOfUse);


  subscribeInfo.collection.findOne({ _id: info._id }, (err, doc) => {
    if (err) {
      logger.error(err.message);
      return cb && cb(err);
    }
    if (doc) {
      return cb && cb(i18n.t('subscribeInfoHasExists'));
    }
    subscribeInfo.insertOne(info, (err) => {
      if (err) {
        logger.error(err.message);
        return cb && cb(err);
      }

      const log = {
        companyId: info._id,
        operationType: SubscribeLog.OPERATION_TYPE.ADD,
        oldSubscribeInfo: {},
        newSubscribeInfo: info,
        creator: info.creator,
      };
      subscribeLog.insertOne(log, (err) => {
        if (err) {
          logger.error(err.message);
          return cb && cb(err);
        }

        return cb && cb(null, 'ok');
      });
    });
  });
};


// 获取详情
service.getSubscribeInfo = function getSubscribeInfo(info, cb) {
  const _id = info._id;
  if (!_id) {
    return cb & cb(i18n.t('subscribeInfoShortId'));
  }

  subscribeInfo.collection.findOne({ _id }, (err, doc) => {
    if (err) {
      logger.error(err.message);
      return cb && cb(i18n.t('databaseError'));
    }

    if (!doc) {
      return cb && cb(i18n.t('subscribeInfoNotFind'));
    }

    return cb && cb(null, doc);
  });
};

// 修改
service.updateSubscribeInfo = function updateSubscribeInfo(req, cb) {
  const info = req.body;
  const userInfo = req.ex.userInfo;
  const _id = info._id;
  info.lastModifyTime = new Date();
  info.periodOfUse *= 1;
  const startTime = new Date(info.startTime);
  info.expiredTime = startTime.setMonth(startTime.getMonth() + info.periodOfUse);
  info.lastEditor = { _id: userInfo._id, name: userInfo.name };
  const struct = {
    _id: { type: 'string', validation: 'require' },
  };

  const err = utils.validation(info, struct);
  if (err) {
    return cb && cb(err);
  }

  subscribeInfo.collection.findOne({ _id }, (err, doc) => {
    if (err) {
      logger.error(err.message);
      return cb && cb(i18n.t('databaseError'));
    }
    if (!doc) {
      return cb && cb(i18n.t('subscribeInfoNotFind'));
    }
    info.downloadSeconds = info.downloadSeconds * 60 * 60;
    info.remainDownloadSeconds = info.downloadSeconds - doc.usedDownloadSeconds;
    subscribeInfo.updateOne({ _id }, info, (err) => {
      if (err) {
        return cb && cb(err);
      }

      const log = {
        companyId: info._id,
        operationType: SubscribeLog.OPERATION_TYPE.UPDATE,
        oldSubscribeInfo: doc,
        newSubscribeInfo: info,
        creator: {
          _id: userInfo._id,
          name: userInfo.name,
        },
      };

      subscribeLog.insertOne(log, (err) => {
        if (err) {
          logger.error(err.message);
          return cb && cb(err);
        }

        return cb && cb(null, 'ok');
      });
    });
  });
};

// 删除
service.deleteSubscribeInfo = function deleteSubscribeInfo(req, cb) {
  const userInfo = req.ex.userInfo;
  let _ids = req.body._ids || '';

  if (!_ids) {
    return cb && cb(i18n.t('subscribeInfoShortIds'));
  }

  _ids = _ids.split(',');
  subscribeInfo.collection.find({ _id: { $in: _ids } }).toArray((err, docs) => {
    if (err) {
      logger.error(err.message);
      return cb && cb(i18n.t('databaseError'));
    }

    if (!docs) {
      return cb && cb(null, 'ok');
    }

    subscribeInfo.collection.removeMany({ _id: { $in: _ids } }, (err) => {
      if (err) {
        logger.error(err.message);
        return cb && cb(i18n.t('databaseError'));
      }

      const logs = [];
      docs.forEach((item) => {
        const log = {
          companyId: item._id,
          operationType: SubscribeLog.OPERATION_TYPE.DELETE,
          oldSubscribeInfo: item,
          newSubscribeInfo: {},
          creator: {
            _id: userInfo._id,
            name: userInfo.name,
          },
        };
        logs.push(log);
      });

      subscribeLog.insertMany(logs, (err) => {
        if (err) {
          logger.error(err.message);
          return cb && cb(i18n.t('databaseError'));
        }
        return cb && cb(null, 'ok');
      });
    });
  });
};


service.searchCompany = function searchCompany(info, cb) {
  const keyword = info.keyword || '';
  const limit = info.limit || 10;
  const query = { type: GroupInfo.TYPE.COMPANY, parentId: '' };
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }
  groupInfo.collection.find(query, { fields: { name: 1, logo: 1 } }).limit(limit).toArray((err, docs) => {
    if (err) {
      return cb && cb(err);
    }

    return cb && cb(null, docs);
  });
};

module.exports = service;
