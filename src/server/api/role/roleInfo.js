/**
 * Created by steven on 17/5/5.
 */

'use strict';

const DB = require('../../common/db');
const config = require('../../config');

/**
 * @swagger
 * definitions:
 *   RoleInfo:
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *       permissions:
 *         type: Array
 */
class RoleInfo extends DB {
  constructor() {
    super(config.dbInstance.umpDB, 'RoleInfo');

    this.doc = {
      _id: '',
      name: '',
      creator: '',
      allowedPermissions: [], // PermissionInfo path
      deniedPermissions: [], // PermissionInfo path
      createdTime: new Date(),
      modifyTime: new Date(),
      description: '',
      detail: {},
    };

    this.updateDoc = { name: 1, allowedPermissions: 1, deniedPermissions: 1, description: 1, detail: 1, modifyTime: 1 };
  }
}

module.exports = RoleInfo;
