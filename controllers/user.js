const UserModel = require("../models/user");
const CategoryModel = require('../models/category');
const md5 = require("md5");
const fs = require("fs");
const User = {
    /**
     * 创建用户
     */
    save:(req,res,next)=>{
      let user=new UserModel({
          username:req.body.username,
          password:req.body.password,
      });
      console.log(user);
      user.save();
      res.json({'成功':1});
    },
    /**
     * 登录
     */
    login: (req, res, next) => {
        // res.json(
        //     {"MD5":md5("123456")}
        // )
        res.render('login');
    },
    doLogin: (req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;
        console.log(md5(password));
        UserModel.findOne({username: username}).then(doc => {
            if (doc) {
                let user = doc;
                if (user.password == md5(password)) {
                    req.session.loginUser = user;
                    res.redirect('/');
                } else {
                    req.flash('error', '密码错误！')
                    res.redirect('/users/login');
                }
            } else {
                req.flash('error', '用户不存在！')
                res.redirect('/users/login');
            }
        })
    },
    /**
     * 登出
     */
    logout: (req, res, next) => {
        req.session.destroy(err => {
            res.redirect('/users/login');
        })
    },
    /**
     * 个人中心
     */
    personal: (req, res, next) => {
        let user = req.session.loginUser;
        CategoryModel.find().then(doc => {
            res.render('personal',{
                categoryList:doc,
                user: user
            });
        });
    },
    /**
     *
     * 更新信息
     */
    update: (req, res, next) => {
        console.log('------------');
        let user = req.session.loginUser;
        user.nickname = req.body.nickname;
        user.signature = req.body.signature;
        user.position = req.body.position;
        user.other = req.body.other;
        let imgData = req.body.imgdata;
        let suffix = req.body.suffix;

        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");

        //保存编码到缓冲区
        var dataBuffer = new Buffer(base64Data, 'base64');

        if (base64Data) {
            //将缓冲区写入到文件中
            let filename = Date.now()+suffix;
            fs.writeFile("../public/uploads/" + filename, dataBuffer, function (err) {
                if (err) {
                    res.json({
                        'status': 0,
                        'msg': '修改失败！'
                    })
                } else {
                    user.avatar = filename;
                    UserModel.update({_id: user._id}, user).then(doc => {
                        res.json({
                            'status': 1,
                            'msg': '修改成功！'
                        })
                    }).catch(err => {
                        res.json({
                            'status': 0,
                            'msg': '修改失败！'
                        })
                    });
                }
            });
        } else {
            UserModel.update({_id: user._id}, user).then(doc => {
                res.json({
                    'status': 1,
                    'msg': '修改成功！'
                })
            }).catch(err => {
                res.json({
                    'status': 0,
                    'msg': '修改失败！'
                })
            });
        }
    },
    /**
     * 修改密码
     */
    updatePassword: () => {

    }
}
module.exports = User;