var express = require('express');
var router = express.Router();
var usersModels = require('../models/users')
var http = require('http')
/* 添加购物车 */
router.post('/addCart', function (req, res, next) {
    let { userName, count, title, describe, price, imgSrc, stock } = req.body
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            var cartList = {
                count: count,
                title: title,
                describe: describe,
                price: price,
                imgSrc: imgSrc,
                isOpt: true,
                stock: stock

            }
            var sign = ''
            for (let i = 0; i < doc.cartList.length; i++) {
                if (doc.cartList[i].title === title) {
                    doc.cartList[i].count = parseInt(doc.cartList[i].count) + (parseInt(count))
                    sign = cartList
                }
            }
            if (sign) {
                sign = ''
            } else {
                doc.cartList.push(cartList)

            }

            doc.save(function (err, doc) {
                if (doc) {

                    res.send({
                        code: 1,
                        msg: '添加购物车成功'
                    })
                } else {
                    res.send({
                        code: -2,
                        msg: '添加购物车失败'
                    })
                }
            })
        } else {
            res.send({
                code: -1,
                msg: '添加失败'
            })
        }
    })
})

/* 我的购物车数据 */
router.get('/cartData', function (req, res, next) {
    var userName = req.param('userName')
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            doc.cartList
            res.send({
                code: 1,
                msg: '获取购物车数据成功',
                result: doc.cartList
            })
        } else {
            res.send({
                code: -1,
                msg: '获取购物车数据失败'
            })
        }
    })
})

/* 购物车数量更新 */
router.post('/cartCountUpdate', function (req, res, next) {
    var { userName, count, isOpt, title } = req.body
    usersModels.findOne({ "userName": userName }, function (err, doc) {
        if (doc) {
            doc.cartList.forEach(item => {
                if (item.title === title) {
                    console.log(count > item.stock)
                    if (parseInt(count) > parseInt(item.stock)) {
                        res.send({
                            code: '-2',
                            msg: '没有存货了'
                        })
                    } else {
                        usersModels.update({ "userName": userName, "cartList.title": title }, {
                            "cartList.$.count": count,
                            "cartList.$.isOpt": isOpt,
                        }, function (err, doc) {
                            if (doc) {
                                res.send({
                                    code: '1',
                                    msg: '修改购物车商品数量成功'
                                })
                            } else {
                                res.send({
                                    code: '-1',
                                    msg: '修改购物车商品数量失败'
                                })
                            }
                        })
                    }

                }
            })
        } else {

        }
    })


})


/* 购物车全选和取消 */
router.post('/checkedAll', function (req, res, next) {
    var { userName, isOpt } = req.body
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            doc.cartList.forEach(item => {
                item.isOpt = isOpt
            });
            doc.save(function (err, doc) {
                if (doc) {
                    res.send({
                        code: 1,
                        msg: '购物车选中状态' + isOpt
                    })
                } else {
                    res.send({
                        code: -1,
                        msg: '购物车选中状态失败'
                    })
                }
            })
        } else {
            console.log(err)
        }
    })

})


/* 购物车商品删除 */
router.post('/cartDel', function (req, res, next) {
    var { userName, title } = req.body
    usersModels.update({ 'userName': userName }, { $pull: { 'cartList': { "title": title } } }, function (err, doc) {
        if (doc) {

            res.send({
                code: 1,
                result: '删除成功'
            })

        } else {
            res.send({
                code: -1,
                result: '删除失败'
            })
        }
    })

})


/* 购物车清除 */
router.post('/cartClear', function (req, res, next) {
    var { userName } = req.body
    usersModels.update({ 'userName': userName, }, { $pull: { 'cartList': {} } }, function (err, doc) {
        if (doc) {
            res.send({
                code: 1,
                result: '清除成功'
            })

        } else {
            res.send({
                code: -1,
                result: '清除失败'
            })
        }
    })

})



/* 获取城市地址 */
router.get('/cityList', function (req, res, next) {
    var body = ''
    http.get(url = 'http://39.97.33.178/api/cityList', (response) => {
        response.on('data', (data) => {
            body += data
        }).on('end', (data) => {
            res.send({
                code: 1,
                result: JSON.parse(body)
            })
        }).on('error', (error) => {
            console.log(error)
        })

    })
})


/* 添加订单信息 */
router.post('/addOrder', function (req, res, next) {
    var moment = require('moment')
    require('moment/locale/zh-cn')
    var { userName, goodsData, siteData, total } = req.body
    if (!siteData.name) {
        res.send({
            code: -2,
            msg: '请选择地址'
        })
        return
    }
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {


            var platform = 'mmall';
            var r1 = Math.floor(Math.random() * 10)
            var r2 = Math.floor(Math.random() * 10)
            var styDate = moment().format("YMD");
            var orderId = platform + r1 + styDate + r2
            let createDate = moment().format('llll');
            let goods = goodsData
            let orderOptions = {
                orderId: orderId,
                siteData: siteData,
                goodsList: goods,
                createDate: createDate,
                total: total
            }
            doc.orderList.unshift(orderOptions)
            let cartList = []
            doc.cartList.forEach(item => {
                if (!item.isOpt) {
                    cartList.push(item)
                }
            })

            doc.cartList = cartList
            doc.save(function (err, doc) {

                res.send({
                    code: 1,
                    msg: '订单添加成功'
                })
            })
            cartList = []
        } else {
            console.log(err)
            res.send({
                code: -1,
                msg: '订单添加失败'
            })
        }
    })
})


/* 获取订单数据 */
router.get('/getOrder', function (req, res, next) {
    let userName = req.query.userName
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            res.send({
                code: 1,
                msg: '获取订单数据成功',
                result: doc.orderList
            })
        } else {
            res.send({
                code: -1,
                msg: '查找用户失败'
            })
        }
    })
})



/* 管理员操作 */

/* 获取全部订单数据 */
router.get('/getOrderAll', function (req, res, next) {
    let isAdmin = req.session.isAdmin
    if (!isAdmin) {
        res.send({
            code: -3,
            msg: '没有权限'
        })
        return
    }
    usersModels.find(function (err, doc) {
        let list = []
        doc.forEach((item, index) => {
            item.orderList.forEach(item => {
                list.push({
                    orderCode: item.orderId,
                    name: item.siteData.name,
                    account: doc[index].userName,
                    createTime: doc[index].date
                })
            })
        })
        res.send({
            code: 0,
            result: list
        })
    })
})



/* 获取订单详情 */
router.get('/getOrderDetails', function (req, res, next) {
    let orderId = req.query.orderId
    let isAdmin = req.session.isAdmin
    if (!isAdmin) {
        res.send({
            code: -3,
            msg: '没有权限'
        })
        return
    }
    let orderDetailsData = {

    }
    usersModels.find(function (err, doc) {
        doc.forEach((item, index) => {
            item.orderList.forEach(item => {
                if (item.orderId == orderId) {
                    orderDetailsData.orderCode = item.orderId;
                    orderDetailsData.name = item.siteData.name;
                    orderDetailsData.siteData = item.siteData.value + item.siteData.detailSite;
                    orderDetailsData.account = doc[index].userName;
                    orderDetailsData.cellPhone = item.siteData.mobile;
                    orderDetailsData.createTime = item.createDate;
                    orderDetailsData.goodsList = item.goodsList;
                    orderDetailsData.total = item.total
                }
            })
        })
        res.send({
            code: 0,
            result: orderDetailsData
        })
    })

})


/* 删除订单信息 */
router.post('/cartDelete', function (req, res, next) {
    let { userName, orderCode } = req.body
    let isAdmin = req.session.isAdmin
    if (!isAdmin) {
        res.send({
            code: -3,
            msg: '没有权限'
        })
        return
    }
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            doc.orderList.forEach((item, index) => {
                if (item.orderId == orderCode) {
                    doc.orderList.splice(index, 1)
                }
            })
            doc.save(function (err, doc) {
                if (doc) {
                    res.send({
                        code: 0,
                        msg: '删除成功'
                    })
                } else {
                    res.send({
                        code: -2,
                        msg: '删除失败'
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


module.exports = router;
