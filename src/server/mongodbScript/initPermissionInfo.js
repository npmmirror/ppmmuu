/**
 * Created by steven on 2017/9/7.
 */

'use strict';

const uuid = require('uuid');
const PermissionInfo = require('../api/role/permissionInfo');

const permissionInfo = new PermissionInfo();

const permissionNames = ["auditPass","listAudit","listAuditRule","createAuditRule","updateAuditRule","removeAuditRule","添加配置项","更新配置项","配置项列表","删除配置项","添加配置组","更新配置组","配置组列表","删除配置组","列举小组","添加小组","删除分组","获取分组的详细信息","更新组信息","引擎列表","添加引擎","获取引擎的详细信息","更新引擎信息","删除引擎","更新引擎配置信息","列举引擎进程","列举进程命令","执行进程action操作","安装监控","组列表","组的详情","添加组","删除组","组成员列表","查看成员详情","添加组成员","删除组成员","组成员调整部门","禁用或启用组用户","修改组成员信息","获取公司或部门或小组或成员权限","获取公司或部门或小组或成员生效权限","更新公司或部门或小组或成员的权限","修改公司或部门或组的属性","搜索公司成员","绑定快传账户","上传升级包","安装升级包","列举安装包内的目录及文件","读取文件内容","安装版本详细信息","初始化编辑器","列举出项目下的资源","创建项目下的目录","添加视频片断到项目中","删除资源","更新目录或资源信息","创建新的项目","删除项目","列举出当前用户的项目","下载任务","下载合并任务","创建转码模板","更新转码模板","下载任务列表","转码模板列表","下载任务详情","下载任务重启","下载任务停止","下载任务删除","删除转码模板","创建编目任务信息","更新编目任务信息","列举编目任务","获取编目任务详细信息","列举所在部门的编目任务","列举我的编目任务","派发任务","认领任务","退回任务","提交任务","删除任务","恢复任务","获取编目详细信息","列举编目信息","创建编目信息","更新编目信息","创建文件信息","更新文件信息","获取文件列表","获取文件详细信息","生成入库XML文件","添加入库模板","获取入库模板详细信息","获取入库模板信息以及根据文件选择出需要的转码模板Id","列举入库模板信息","删除入库模板","更新入库模板","媒体库搜索","媒体库搜索默认页","媒体库搜索手机版首页","角色列表","角色详情","增加角色","编辑角色","编辑角色中增加权限","编辑角色中删除权限","删除角色","权限列表","分配角色给用户或组织","删除用户或组织的角色","启用或禁用权限","搜索拥有特定角色的用户,组织,部门,小组","角色中搜索用户或组织","权限组列表","创建上架任务","获取任务详情","待认领列表","认领上架任务","派发上架任务","删除上架任务","部门任务全部列表","我的任务列表","保存上架任务","提交上架任务","退回上架任务","上架管理列表","上架","下架","下架再编辑","部门任务中搜索用户","编辑任务中的订阅类型列表","存储区列表","存储区详情","增加存储区","编辑存储区","启动或挂起存储区","删除存储区","存储路径列表","存储路径详情","增加存储路径","编辑存储路径","启动或挂起存储路径","删除存储路径","存储策略列表","存储策略详情","增加策略","编辑存储策略","启动或挂起策略","删除存储策略","增加订阅公司","修改订阅公司","获取订阅公司详情","订阅管理列表","删除订阅公司","订阅管理中搜索用户","增加订阅类型","修改订阅类型","获取订阅类型详情","订阅类型列表","删除订阅类型","addTemplateGroup","listTemplateGroup","removeTemplateGroup","getTemplateGroup","updateTemplateGroup","下载模板列表","创建下载模板","删除下载模板","更新下载模板信息","获取下载模板详细信息","下载模板中搜索用户或组织","更新下载模板分组使用人信息","转码模板获取水印图","list","listChildTask","restart","stop","同步AD账户","任务-审核任务列表","任务-审核任务通过或拒绝","user_restartJob","列举部门列表","所有权限"]
const permissionPaths = ["/audit/pass","/audit/list","/audit/listAuditRule","/audit/createAuditRule","/audit/updateAuditRule","/audit/removeAuditRule","/configuration/add","/configuration/update","/configuration/list","/configuration/delete","/configuration/addGroup","/configuration/updateGroup","/configuration/listGroup","/configuration/deleteGroup","/engine/listGroup","/engine/addGroup","/engine/removeGroup","/engine/getGroup","/engine/updateGroup","/engine/listEngine","/engine/addEngine","/engine/getEngine","/engine/updateEngine","/engine/removeEngine","/engine/updateEngineConfiguration","/engine/listProcess","/engine/listAction","/engine/emitAction","/engine/installMonitor","/group/list","/group/getDetail","/group/add","/group/delete","/group/listUser","/group/userDetail","/group/addUser","/group/deleteGroupUser","/group/justifyUserGroup","/group/enableUser","/group/updateUser","/group/getOwnerPermission","/group/getOwnerEffectivePermission","/group/updateOwnerPermission","/group/updateGroupInfo","/group/searchUser","/group/bindMediaExpressUser","/help/uploadPackage","/help/installPackage","/help/listPackage","/help/readFile","/help/detail","/ivideo/init","/ivideo/listItem","/ivideo/createDirectory","/ivideo/createItem","/ivideo/removeItem","/ivideo/updateItem","/ivideo/createProject","/ivideo/removeProject","/ivideo/listProject","/job/download","/job/multiDownload","/job/createTemplate","/job/updateTemplate","/job/list","/job/listTemplate","/job/query","/job/restart","/job/stop","/job/delete","/job/deleteTemplate","/library/createCatalogTask","/library/updateCatalogTask","/library/listCatalogTask","/library/getCatalogTask","/library/listDepartmentCatalogTask","/library/listMyCatalogTask","/library/assignCatalogTask","/library/applyCatalogTask","/library/sendBackCatalogTask","/library/submitCatalogTask","/library/deleteCatalogTask","/library/resumeCatalogTask","/library/getCatalog","/library/listCatalog","/library/createCatalog","/library/updateCatalog","/library/createFile","/library/updateFile","/library/listFile","/library/getFile","/library/generateXML","/library/addTemplate","/library/getTemplateInfo","/library/getTemplateResult","/library/listTemplate","/library/removeTemplate","/library/updateTemplate","/media/esSearch","/media/getEsMediaList","/media/defaultMedia","/role/list","/role/getDetail","/role/add","/role/update","/role/updateRoleAddPermission","/role/updateRoleDeletePermission","/role/delete","/role/listPermission","/role/assignRole","/role/deleteOwnerRole","/role/enablePermission","/role/getRoleOwners","/role/search/userOrGroup","/role/listPermissionGroup","/shelves/createShelfTask","/shelves/getShelfDetail","/shelves/listDepartmentPrepareShelfTask","/shelves/claimShelfTask","/shelves/assignShelfTask","/shelves/deleteShelfTask","/shelves/listDepartmentShelfTask","/shelves/listMyselfShelfTask","/shelves/saveShelf","/shelves/submitShelf","/shelves/sendBackShelf","/shelves/listLineShelfTask","/shelves/onlineShelfTask","/shelves/offlineShelfTask","/shelves/editShelfTaskAgain","/shelves/searchUser","/shelves/listSubscribeType","/storage/listBucket","/storage/getBucketDetail","/storage/addBucket","/storage/updateBucket","/storage/enableBucket","/storage/deleteBucket","/storage/listPath","/storage/getPathDetail","/storage/addPath","/storage/updatePath","/storage/enablePath","/storage/deletePath","/storage/listTactics","/storage/getTacticsDetail","/storage/addTactics","/storage/updateTactics","/storage/enableTactics","/storage/deleteTactics","/subscribeManagement/create","/subscribeManagement/update","/subscribeManagement/getSubscribeInfo","/subscribeManagement/list","/subscribeManagement/delete","/subscribeManagement/searchCompany","/subscribeManagement/createSubscribeType","/subscribeManagement/updateSubscribeType","/subscribeManagement/getSubscribeType","/subscribeManagement/listSubscribeType","/subscribeManagement/deleteSubscribeType","/template/addGroup","/template/listGroup","/template/removeGroup","/template/getGroup","/template/updateGroup","/template/list","/template/createDownloadTemplate","/template/remove","/template/update","/template/getDetail","/template/search/userOrGroup","/template/updateGroupUser","/template/getWatermark","/transcode/list","/transcode/listChildTask","/transcode/restart","/transcode/stop","/user/adAccountSync","/user/listAuditJob","/user/passOrRejectAudit","/user/restartJob","/user/listUserByDepartment","all"]
const permissionGroups = ["auditDownload","auditDownload","auditEmpower","auditEmpower","auditEmpower","auditEmpower","configuration","configuration","configuration","configuration","configuration","configuration","configuration","configuration","engine","engine","engine","engine","engine","engine","engine","engine","engine","engine","engine","engine","engine","engine","engine","account","account","account","account","account","account","account","account","account","account","account","account","account","account","account","account","account","managementAbout","managementAbout","managementAbout","managementAbout","managementAbout","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","movieEditor","transcodeTemplate","transcodeTemplate","download","transcodeTemplate","download","download","download","download","transcodeTemplate","library","library","library","library","departmentTask","personalTask","departmentTask","library","personalTask","personalTask","library","departmentTask","library","library","library","library","library","library","library","library","libraryTemplate","libraryTemplate","libraryTemplate","libraryTemplate","libraryTemplate","libraryTemplate","libraryTemplate","mediaCenter","mediaCenter","mediaCenter","role","role","role","role","role","role","role","permission","role","role","permissionGroup","role","role","role","departmentShelf","departmentShelf","departmentShelf","departmentShelf","departmentShelf","departmentShelf","departmentShelf","myShelf","myShelf","myShelf","myShelf","lineShelf","lineShelf","lineShelf","lineShelf","departmentShelf","myShelf","bucket","bucket","bucket","bucket","bucket","bucket","storagePath","storagePath","storagePath","storagePath","storagePath","storagePath","storageTactics","storageTactics","storageTactics","storageTactics","storageTactics","storageTactics","subscribeInfo","subscribeInfo","subscribeInfo","subscribeInfo","subscribeInfo","subscribeInfo","subscribeType","subscribeType","subscribeType","subscribeType","subscribeType","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","downloadTemplate","transcodeTemplate","transcode","transcode","transcode","transcode","account","auditTask","auditTask","downloadTask","account","root"]

const nLength = permissionNames.length;
const pLength = permissionPaths.length;
const mLength = permissionGroups.length;
if (nLength && nLength === pLength && nLength === mLength) {
  /* eslint-disable consistent-return */

  permissionInfo.collection.removeMany({}, (err) => {
    if (err) {
      throw new Error(`权限表初始化有问题:${err.message}`);
    }
    const info = [];
    for (let i = 0; i < permissionPaths.length; i++) {
      info.push({
        _id: uuid.v1(),
        name: permissionNames[i],
        path: permissionPaths[i],
        createdTime: new Date(),
        modifyTime: new Date(),
        groupIndex: permissionGroups[i],
        status: '0',
      });
    }
    if (info.length) {
      permissionInfo.collection.insert(info, {
        w: 1,
      }, (err) => {
        if (err) {
          throw new Error(`权限表初始化有问题:${err.message}`);
        }
        return true;
      });
    }
  });
  /* eslint-enable consistent-return */
} else {
  throw new Error('api接口权限注释有问题');
}
