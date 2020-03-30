var express = require('express');
var router = express.Router();
var usersModels = require('../models/users')


/* 添加用户地址 */
router.post('/addSite', function (req, res, next) {
    var { userName, name, value, detailSite, mobile, checked } = req.body
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            let siteList = {
                name: name,
                value: value,
                detailSite: detailSite,
                mobile: mobile,
                checked: checked
            }

            doc.addressList.forEach(item => {
                item.checked = false
            });
            doc.addressList.push(siteList)
            doc.save(function (err, doc) {

                res.send({
                    code: 1,
                    msg: '地址添加成功'
                })

            })
        } else {
            res.send({
                code: -2,
                msg: '地址添加失败'
            })
        }
    })

})


/* 获取用户地址列表 */
router.get('/getSiteList', function (req, res, next) {
    var userName = req.param('userName');
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            res.send({
                code: 1,
                msg: '获取用户地址列表成功',
                result: doc.addressList
            })
        } else {

            res.send({
                code: -1,
                msg: '获取用户地址列表失败'
            })
        }
    })
})


/* 设置用户地址状态 */
router.post('/setSite', function (req, res, next) {
    var { userName, id } = req.body
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            doc.addressList.forEach(item => {
                if (item._id == id) {
                    item.checked = true
                } else {
                    item.checked = false
                }
            })
            doc.save(function (err, doc) {

                res.send({
                    code: 1,
                    msg: '设置用户地址成功'
                })

            })
        } else {

            res.send({
                code: -1,
                msg: '设置用户地址失败'
            })
        }
    })
})


/* 删除地址 */
router.post('/del', function (req, res, next) {
    let { id, userName } = req.body
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if(doc){
            var myarr = []
            doc.addressList.forEach(item=>{
                if(item._id != id){
                    myarr.push(item)
                }
            })
            doc.addressList = myarr
            doc.save(function (err,doc) { 
                if(doc){
                    res.send({
                        code: 1,
                        msg: '删除成功'
                    })
                }else{
                    res.send({
                        code: -2,
                        msg: '删除失败'
                    })
                }
             })
        }else{
            res.send({
                code:'-1',
                msg:'用户查询失败'
            })
        }
    })
})
module.exports = router