/**
 * Created by chaoningx on 2017/2/27.
 */

'use strict';

const crypto = require('crypto');
const os = require('os');

const utils = {};

utils.isEmptyObject = function isEmptyObject(obj) {
  if (obj === null || typeof obj === 'undefined') return true;

  if (obj.length && obj.length > 0) return false;
  if (obj.length === 0) return true;

  for (const key in obj) {
    if (!hasOwnProperty.call(obj, key)) return false;
  }

  return true;
};

utils.merge = function merge(source, target) {
  if (utils.isEmptyObject(target)) { return source; }
  if (utils.isEmptyObject(source)) {
    if (typeof source === 'string') {
      return '';
    }

    return {};
  }

  const s = Object.assign({}, source);

  for (const k in s) {
    if (target[k]) {
      s[k] = target[k];
    }
  }

  return s;
};

utils.cipher = function cipher(str, password) {
  const cipher = crypto.createCipher('aes-256-cbc', password);
  let crypted = cipher.update(str, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

utils.decipher = function decipher(str, password) {
  const decipher = crypto.createDecipher('aes-256-cbc', password);
  let dec = decipher.update(Buffer.from(str, 'hex'), 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

utils.trim = function trim(obj) {
  if (typeof obj === 'string') {
    return obj.trim();
  }
  let rs = {};

  if (obj instanceof Array) {
    rs = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      if (typeof obj[i] === 'string') {
        rs.push(obj[i].trim());
      } else {
        rs.push(obj[i]);
      }
    }

    return rs;
  }

  for (const t in obj) {
    if (typeof obj[t] === 'string') {
      rs[t] = obj[t].trim();
    } else {
      rs[t] = obj[t];
    }
  }
  return rs;
};

utils.tpl = function tpl(str, data) {
  for (const item in data) {
    str = str.replace(new RegExp(`\{\\$${item}\}`, 'gmi'), data[item]);
  }
  str = str.replace(/\{\$(.*?)\}/ig, '');
  return str;
};

utils.analysisNetworkInterfaces = function analysisNetworkInterfaces() {
  const nf = os.networkInterfaces();
  const ips = [];
  for (const k in nf) {
    const n = nf[k];
    for (let i = 0, len = n.length; i < len; i++) {
      if (n[i].address && /^[0-9.]{1,20}$/.exec(n[i].address)) {
        ips.push(n[i].address);
      }
    }
  }

  return ips;
};

utils.checkEmail = function checkEmail(email) {
  if ((email.length > 128) || (email.length < 6)) {
    return false;
  }
  return !!email.match(/^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/);
};

utils.checkPhone = function checkPhone(phone) {
  if (phone.length !== 11) {
    return false;
  }
  if (/^1[34578]\d{9}$/.test(phone) === false) {
    return false;
  }
  return true;
};

/**
 * 2-20位有效字符
 * @param name
 * @returns {boolean}
 */
utils.checkVipName = function checkVipName(name) {
  return /^[0-9a-zA-Z_\u4e00-\u9fa5]{2,20}$/.test(name);
};

utils.checkPassword = function checkPassword(password) {
  return /^[0-9a-zA-Z_]{6,20}$/.test(password);
};

utils.formatSortOrFieldsParams = function formatSortOrFieldsParams(sortString, isSort) {
  const sorts = {};
  let arr = [];
  if (sortString.indexOf(',') !== -1) {
    arr = sortString.split(',');
  } else {
    arr.push(sortString);
  }

  const flags = {
    sorts: [-1, 1],
    fields: [0, 1],
  };

  const flag = isSort ? flags.sorts : flags.fields;

  for (let i = 0, len = arr.length; i < len; i++) {
    sorts[arr[i].trim()] = /^-/.test(arr[i]) ? flag[0] : flag[1];
  }

  return sorts;
};

utils.clone = function clone(origin) {
  return JSON.parse(JSON.stringify(origin));
};

module.exports = utils;
