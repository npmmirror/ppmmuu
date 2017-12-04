const request = require('request');
const fs = require('fs');
const path = require('path');

const api = {};

const composeTemplate = function composeTemplate(version, updateList) {
  return `
{
  "version": "${version}",
  "updateList": [
    ${updateList.join(',\n    ')}
  ]
}
`;
};

api.create = function (version, generatePath, cb) {
  if (!version) {
    return cb && cb('version is null.');
  }

  if (!generatePath) {
    return cb && cb('generatePath is null.');
  }

  if (!fs.existsSync(generatePath)) {
    return cb && cb('generatePath is not exist');
  }

  const pageSize = 20;
  let logs =[];

  const req = function(page, doneFn) {
    request(`http://gitlab.szdev.cn/dev/UMP-FE/issues?private_token=vKXd3Vzzr_dPwKVkpxF8&scope=all&utf8=%E2%9C%93&state=closed&page=${page}&milestone_title=${version}`, (error, response, data) => {
      if (error) {
        return cb && cb(error);
      }

      const issueReg = /<a href="\/dev\/UMP-FE\/issues\/[0-9]*">(.*)<\/a>/g;

      const mt = data.match(issueReg);
      const rs = [];
      let t = null;

      for (let i = 0, len = mt.length; i < len; i++) {
        t = mt[i];
        if (mt[i] && mt[i].match(issueReg)) {
          rs.push(`"${RegExp.$1}"`);
        }
      }

      const l = rs.length;

      if(l < pageSize) {
        logs = logs.concat(rs);
        return doneFn && doneFn();
      }

      if(l === pageSize) {
        if(rs[l - 1] === logs[logs.length - 1]) {
          doneFn && doneFn();
        }else {
          req(page + 1, doneFn);
        }
      }else {
        req(page + 1, doneFn);
      }
    });
  };

  req(1, () => {
    const tpl = composeTemplate(version, logs);

    console.log('version.json:', tpl);

    fs.writeFileSync(path.join(generatePath, 'version.json'), tpl);

    return cb && cb(null, tpl);
  });

};

module.exports = api;

