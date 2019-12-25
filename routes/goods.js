var express = require('express');
var router = express.Router();
var goodsModels = require('../models/goods')
/* GET home page. */

/* 获取轮播图地址 */
router.get('/getSlideshow', function (req, res, next) {
    goodsModels.findOne(function (err, doc) {
        if (doc) {
            if (doc.slideshow) {
                res.send({
                    code: 1,
                    msg: '获取轮播图图片成功',
                    result: doc.slideshow
                })
            } else {
                res.send({
                    code: -1,
                    msg: '获取轮播图图片失败',

                })
            }
        } else {
            res.send({
                code: 0,
                msg: '获取轮播图图片失败',
            })
        }
    })
});


/* 搜索商品 */
router.get('/searchGooods', function (req, res, next) {
    var searchName = req.param('searchName');
    var searchdb = ''
    switch (searchName) {
        case "手机":
            searchdb = 'mobile'
            break;
        case "数码":
            searchdb = 'digital'
            break;
        default:
            searchdb = 'mei'
            break;
    }
    goodsModels.findOne(function (err, doc) {
        if (doc) {
            if (searchdb !== 'mei') {
                var myarr = []
                doc[searchdb].forEach(element => {
                    myarr.push(element)
                });
                res.send({
                    code: 1,
                    msg: '获取搜索商品' + searchName,
                    result: myarr
                })
            } else {
                res.send({
                    code: -1,
                    msg: '获取搜索商品' + searchName,
                    result: '没有搜索到结果'
                })
            }
        } else {
            res.send({
                code: 0,
                msg: '获取搜索商品失败',

            })
        }
    })
});

/* 商品详情 */
router.get('/details', function (req, res, next) {
    var productID = req.param('productID')
    var searchName = req.param('searchName');
    var searchdb = ''
    switch (searchName) {
        case "手机":
            searchdb = 'mobile'
            break;
        case "数码":
            searchdb = 'digital'
            break;
        default:
            searchdb = 'mei'
            break;
    }
    goodsModels.findOne(function (err, doc) {
        if (doc) {
            if (searchdb !== 'mei') {
                var prod = doc[searchdb].find(item => {
                    if (item.productID == productID) {
                        return item
                    }
                })
                if (prod) {
                    res.send({
                        code:1,
                        msg:'产品详情ID'+productID,
                        result:prod
                    })
                }else{
                    res.send({
                        code:-1,
                        msg:'没有找到详情ID',
                    })
                }
            } else {
                console.log(err)
            }
        }
    })

})


module.exports = router;
