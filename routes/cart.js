var express = require('express');
var router = express.Router();
var usersModels = require('../models/users')
var http = require('http')
/* 添加购物车 */
router.post('/addCart', function (req, res, next) {
    let { userName, count, title, describe, price, imgSrc } = req.body
    usersModels.findOne({ 'userName': userName }, function (err, doc) {
        if (doc) {
            var cartList = {
                count: count,
                title: title,
                describe: describe,
                price: price,
                imgSrc: imgSrc,
                isOpt: true
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
    var { userName, goodsData, siteData } = req.body
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
                createDate: createDate
            }
            doc.orderList.push(orderOptions)
            let  cartList = []
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


module.exports = router;
