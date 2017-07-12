/**
 * Created by steven on 17/5/5.
 */

'use strict';

const DB = require('../../common/db');
const config = require('../../config');
const i18n = require('i18next');
const utils = require('../../common/utils');

/**
 * @swagger
 * definitions:
 *   UserInfo:
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *       displayName:
 *         type: string
 *       password:
 *         type: string
 *       createdTime:
 *         type: string
 *       company:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *           name:
 *             type: string
 *       department:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *           name:
 *             type: string
 *       team:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *           name:
 *             type: string
 *       verifyType:
 *         type: string
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       employeeId:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: string
 *       photo:
 *         type: string
 *       status:
 *         type: string
 *       Detail:
 *         type: object
 */
class UserInfo extends DB {
  constructor() {
    super(config.dbInstance.umpDB, 'UserInfo');

    this.struct = {
      _id: { type: 'string', default: '', validation: utils.checkEmail, unique: true, allowUpdate: true },
      name: { type: 'string', default: '', validation: 'require', allowUpdate: true, unique: true },
      displayName: { type: 'string', default: '', allowUpdate: true, unique: true },
      password: { type: 'string', default: '', validation: utils.checkPassword, allowUpdate: true },
      title: { type: 'string', default: '', allowUpdate: true },
      verifyType: { type: 'string', default: UserInfo.VERIFY_TYPE.PASSWORD, allowUpdate: true },
      company: { type: 'object', default: { _id: '', name: '' }, allowUpdate: true },
      department: { type: 'object', default: { _id: '', name: '' }, allowUpdate: true },
      team: { type: 'object', default: { _id: '', name: '' }, allowUpdate: true },
      createdTime: { type: 'date', default() { return new Date(); }, allowUpdate: true },
      description: { type: 'string', default: '', allowUpdate: true },
      employeeId: { type: 'string', default: '', allowUpdate: true },
      email: { type: 'string', default: '', validation: utils.checkEmail, unique: true, allowUpdate: true },
      phone: { type: 'string', default: '', validation: utils.checkPhone, unique: true, allowUpdate: true },
      photo: { type: 'string', default: '', allowUpdate: true },
      status: { type: 'string', default: UserInfo.STATUS.NORMAL, allowUpdate: true },
      detail: { type: 'object', default: {}, allowUpdate: true },
    };
  }

  getUserInfo(_id, fields, cb) {
    fields = utils.formatSortOrFieldsParams(fields);
    this.collection.findOne({ _id }, { fields }, (err, doc) => {
      if (err) {
        return cb && cb(i18n.t('databaseError'));
      }
      if (!doc) {
        return cb && cb(i18n.t('userNotFind'));
      }
      return cb && cb(null, doc);
    });
  }
}

UserInfo.STATUS = {
  NORMAL: '0',
  UNACTIVE: '1',
  DELETE: '2',
};

UserInfo.VERIFY_TYPE = {
  PASSWORD: '0', // 密码验证
  AD: '1', // 域验证，域验证会根据组织里的验证信息去验证
};

module.exports = UserInfo;
