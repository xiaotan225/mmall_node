var express = require('express');
var router = express.Router();
var usersModels = require('../models/users')

var { Email } = require('../util/config')
/* GET users listing. */

/* 判断字符串为空 */
let emptyStr =  function(str) {
  let reg = /(^\s+)|(\s+)/g
  if(reg.test(str) || str === ''){
    return true
  }else{
    return false
  }
}
/* 登录 */
router.post('/login', function (req, res, next) {
  let { userName, userPwd } = req.body
  console.log('asdf')
  usersModels.findOne({ userName: userName }, function (err, doc) {
    if (doc) {
      let isFreeze = doc.isFreeze
      console.log(doc)
      if (isFreeze) {
        res.send({
          code: -2,
          msg: '账号已冻结'
        })
        return
      }
      if (doc.userName == userName && doc.userPwd == userPwd) {
        req.session.userName = doc.userName
        req.session.isAdmin = doc.isAdmin
        res.send({
          code: 1,
          msg: '登录成功'
        })
      } else {

        res.send({
          code: 0,
          msg: '账号或密码错误'
        })
      }
    } else {
      res.send({
        code: -1,
        msg: '登录失败或者账号不存在',
      })
    }
  })
});

/* 是否管理员 */
router.post('/isAdmin', function (req, res, next) {
  let isAdmin = req.session.isAdmin
  if (isAdmin) {
    res.send({
      code: 0,
      msg: '管理员登陆'
    })
  } else {
    res.send({
      code: -1,
      msg: '普通用户登陆'
    })
  }
})
var moment = require('moment')
require('moment/locale/zh-cn')
/* 用户注册 */
router.post('/register', function (req, res, next) {
  let { userName, userPwd, mail, verifyCode } = req.body
 
  if(emptyStr(userName)){
    res.send({
      code:-5,
      msg:'用户名不能有空'
    })
    return
  }
  if (verifyCode !== req.session.verifyCode || mail !== req.session.mail) {
    res.send({
      msg: '验证码错误',
      code: -4
    })
    return
  }
  if ((Email.time - req.session.time) / 1000 > 60) {
    res.send({
      msg: '验证码已失效',
      code: -3
    })
    return
  }


  usersModels.find(function (err, doc) {
    if (doc) {
      for (let i = 0; i < doc.length; i++) {
        if (doc[i].userName == userName) {
          res.send({
            code: -1,
            msg: '用户名已存在'
          })
          return
        } else if (doc[i].mail == mail) {
          res.send({
            code: -2,
            msg: '邮箱已存在'
          })
          return
        }
      }
      let date = moment().format('LLL');
      var data = new usersModels({
        "userName": userName,
        "userPwd": userPwd,
        "mail": mail,
        "isAdmin": false,
        "date": date,
        "isFreeze": false,
        "orderList": Array,
        "cartList": [

        ],
        "addressList": [

        ]
      })
      data.save(function (err, doc) {
        if (doc) {
          res.send({
            code: 1,
            msg: '注册成功'
          })
        } else {
          res.send({
            code: 0,
            msg: '注册失败'
          })
        }
      })
    } else {
      res.send({
        code: -0,
        msg: '注册失败'
      })

    }
  })
})



/* 邮箱验证码 */
router.post('/verify', function (req, res, next) {
  let { mail } = req.body;
  let verifyCode = Email.verifyCode
  let time = Email.time
  req.session.time = time;
  req.session.verifyCode = verifyCode;
  req.session.mail = mail;
  let verifOptons = {
    from: '"mmall 2646397614@qq.com', // sender address
    to: mail, // list of receivers
    subject: "mmall 邮箱验证码", // Subject line
    text: `验证码为：${verifyCode}
打死也不要告诉别人，请在一分钟内使用。
          `, // plain text body
  }

  Email.transporter.sendMail(verifOptons, (err) => {
    if (err) {
      console.log(err )
      res.send({
        code: -1,
        msg: '验证码发送失败'
      })
    } else {
      res.send({
        code: 1,
        msg: '验证码发送成功',
        code111: req.session.verifyCode
      })
    }
  })
})

/* 检测用户名是否存在 */
router.post('/isUserName', function (req, res, next) {
  let { userName } = req.body
  if(emptyStr(userName)){
    res.send({
      code:-5,
      msg:'用户名不能有空'
    })
    
    return
  }
  usersModels.findOne({ userName: userName }, function (err, doc) {
    if (doc) {
      res.send({
        code: 0,
        msg: '用户名称已存在'
      })
    } else {
      res.send({
        code: 1,
        msg: '用户名称可以使用'
      })
    }
  })
})


/* 检测邮箱是否存在 */
router.post('/isMail', function (req, res, next) {
  let { mail } = req.body
  var regMail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  var result = regMail.exec(mail)
  if (result) {
    usersModels.findOne({ mail: mail }, function (err, doc) {
      if (doc) {
        res.send({
          code: -1,
          msg: '邮箱已存在'
        })
      } else {
        res.send({
          code: 1,
          msg: '邮箱可以使用'
        })
      }
    })

    return
  } else {
    res.send({
      code: 0,
      msg: '请输入正确邮箱',

    })
  }

})


/* 修改密码 */
router.post('/updateUserPwd', function (req, res, next) {
  let { mail, verifyCode, newPwd } = req.body;
  if (verifyCode !== req.session.verifyCode || mail !== req.session.mail) {
    res.send({
      msg: '验证码错误',
      code: -1
    })
    return
  }

  if ((Email.time - req.session.time) / 1000 > 60) {
    res.send({
      msg: '验证码已失效',
      code: -3
    })
    return
  }

  usersModels.update({ mail: mail }, { $set: { userPwd: newPwd } }, function (err, doc) {
    if (doc) {
      res.send({
        msg: '修改密码成功',
        code: 1
      })
    } else {
      res.send({
        msg: '修改密码失败',
        code: -1
      })
    }
  })
})


/* 获取用户信息(前台) */
router.post('/getUser', function (req, res, next) {
  let userName = req.session.userName
  if (userName) {
    usersModels.findOne({ userName: userName }, function (err, doc) {
      if (doc) {
        res.send({
          msg: '获取用户信息成功',
          code: 1,
          result: {
            userName: userName,
            mail: doc.mail,
            addressList: doc.addressList
          }
        })
      } else {
        res.send({
          msg: '未注册账号',
          code: -2,
        })
      }
    })

  } else {
    res.send({
      msg: '获取用户信息失败',
      code: -1
    })
  }







})

/* 退出用户账号 */
router.post('/logout', function (req, res, next) {
  req.session.userName = ''
  res.send({
    code: 1,
    msg: '退出成功'
  })
})


/* 修改密码 */
router.post('/amend', function (req, res, next) {
  let { userName, rawPassword, newPassword } = req.body;
  console.log(newPassword)
  usersModels.findOne({ 'userName': userName }, function (err, doc) {
    if (doc) {
      console.log(doc.userPwd, rawPassword)
      if (doc.userPwd == rawPassword) {
        // if(!newPasswords){
        //   res.send({
        //     code:-3,
        //     msg:'请输入新密码'
        //   })
        // }
        doc.userPwd = newPassword
        doc.save(function () {
          res.send({
            code: 1,
            msg: '修改密码成功'
          })
        })
      } else {
        res.send({
          code: -2,
          msg: '修改密码失败'
        })
      }
    } else {
      res.send({
        code: -1,
        msg: '修改密码失败'
      })
    }
  })

})



/* 管理员操作 */
/* 获取用户信息(后台) */
router.post('/getUsers', function (req, res, next) {
  let userName = req.session.userName
  let isAdmin = req.session.isAdmin
  if (!isAdmin) {
    res.send({
      code: -3,
      msg: '没有权限'
    })
    return
  }
  if (userName) {
    usersModels.find(function (err, doc) {
      if (doc) {
        let resultArray = []
        doc.forEach(item => {
          resultArray.push({
            date: item.date,
            name: item.userName,
            mail: item.mail,
            isAdmin: item.isAdmin,
            isFreeze: item.isFreeze

          })
        })

        res.send({
          msg: '获取用户信息成功',
          code: 0,
          result: resultArray
        })
      } else {
        res.send({
          msg: '获取失败',
          code: -1
        })
      }
    })
  } else {
    res.send({
      code: -2,
      msg: '没有登陆'
    })
  }


})

/* 账号是否冻结 */
router.post('/isFreeze', function (req, res, next) {
  let isAdmin = req.session.isAdmin
  if (!isAdmin) {
    res.send({
      code: -3,
      msg: '没有权限'
    })
    return
  }
  let { userName, isFreeze } = req.body
  usersModels.findOne({ 'userName': userName }, function (err, doc) {
    if (doc) {
      doc.isFreeze = isFreeze
      doc.save(function (err, doc) {
        if (doc) {
          res.send({
            code: 0,
            msg: '修改冻结成功'
          })
        } else {
          res.send({
            code: -2,
            msg: '修改冻结失败'
          })
        }
      })
    } else {
      res.send({
        code: -1,
        msg: '没有找到账号'
      })
    }
  })
})
/* 账号是否管理员 */
router.post('/setAdmin', function (req, res, next) {
  let { userName, isAdmin } = req.body
  if (!req.session.isAdmin) {
    res.send({
      code: -3,
      msg: '没有权限'
    })
    return
  }
  usersModels.findOne({ 'userName': userName }, function (err, doc) {
    if (doc) {
      doc.isAdmin = isAdmin
      doc.save(function (err, doc) {
        if (doc) {
          res.send({
            code: 0,
            msg: '修改管理员成功'
          })
        } else {
          res.send({
            code: -2,
            msg: '修改管理员失败'
          })
        }
      })
    } else {
      res.send({
        code: -1,
        msg: '没有找到账号'
      })
    }
  })
})

/* 删除用户 */
router.post('/userDelete', function (req, res, next) {
  let isAdmin = req.session.isAdmin
  if (!isAdmin) {
    res.send({
      code: -3,
      msg: '没有权限'
    })
    return
  }
  let { userName } = req.body
  usersModels.remove({ userName: userName }, function (err) {
    if(err){
      res.send({
        code: -1,
        msg: '删除失败'
      })
    }else{
      res.send({
        code: 0,
        msg: '删除成功'
      })
    }
  })
})
module.exports = router;
