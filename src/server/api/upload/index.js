'use strict';

const express = require('express');

const router = express.Router();

const result = require('../../common/result');
const upload = require('../../common/multer').upload;

/**
 * @permissionName: 上传图片
 * @permissionPath: /upload/
 * @apiName: upload
 * @apiFuncType: post
 * @apiFuncUrl: /upload
 * @swagger
 * /upload/:
 *   post:
 *     description: upload image
 *     tags:
 *       - v1
 *       - Upload
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: UploadResult
 */
router.post('/', upload.single('image'), (req, res) => {
  res.status(200).json(result.json('', req.file));
});

module.exports = router;
