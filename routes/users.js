const express = require('express');
const router = express.Router();
const user = require("../controllers/user")
const auth = require("../middleware/auth");


//登录页
router.get('/login', user.login);

//提交登录
router.post('/login', user.doLogin);

//登出
router.get('/logout', user.logout);

//个人中心
router.get('/personal', auth, user.personal);

//个人中心信息保存
router.post('/personal', auth, user.update);

//创建用户
router.post('/save',user.save);

module.exports = router;
