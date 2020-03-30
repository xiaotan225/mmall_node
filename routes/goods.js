var express = require('express');
var router = express.Router();
var goodsModels = require('../models/goods')
var request = require("request")
var http = require('https')

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

var searchdb = ''
// var dataLocation = 'http://www.happymmall.com/product/list.do'
var dataLocation = 'http://www.happymmall.com/product/'




function search(searchName) {
    switch (searchName) {
        case '手机':
            searchdb = '手机'
            break;
        case "数码":
            searchdb = '数码'
            break;
        case "电脑":
            searchdb = '电脑'
            break;

        /*       case "办公配件":
                 searchdb = 'peijian'
                 break;
             case "电视":
                 searchdb = 'dianyi'
                 break;
             case "空调":
                 searchdb = 'kongtiao'
                 break;
             case "洗衣机":
                 searchdb = 'xiyiji'
                 break;
             case "厨卫家电":
                 searchdb = 'jiadian'
                 break;
             case "小家电":
                 searchdb = 'xiaojiadian'
                 break;
             case "家居":
                 searchdb = 'jiaju'
                 break;
             case "家具":
                 searchdb = 'jiaju'
                 break;
             case "家装":
                 searchdb = 'jiazhuang'
                 break;
             case "个护化妆":
                 searchdb = 'huazhuang'
                 break;
             case "清洁":
                 searchdb = 'qingjie'
                 break;
             case "纸品":
                 searchdb = 'zhipin'
                 break;
             case "玩具":
                 searchdb = 'wanju'
                 break;
             case "童装童鞋":
                 searchdb = 'tongxie'
                 break;
             case "鞋靴":
                 searchdb = 'xiexue'
                 break;
             case "箱包":
                 searchdb = 'xiangbao'
                 break;
             case "珠宝":
                 searchdb = 'baozhu'
                 break;
             case "运动户外":
                 searchdb = 'huwai'
                 break;
             case "足球":
                 searchdb = 'zuqou'
                 break;
             case "汽车生活":
                 searchdb = 'qic'
                 break;
             case "图书":
                 searchdb = 'tushu'
                 break;
             case "音像":
                 searchdb = 'yingxiang'
                 break;
             case "电子书":
                 searchdb = 'shu'
                 break;
                  */
        default:
            searchdb = 'mei'
            break;
    }
}

function dataFormat(body,res,find) {
    let data = JSON.parse(body)
    let dataList;
    let resultDataList = []
    if (!data.status === 0) {
        res.send({
            code: -1,
            msg: '获取搜索商品' + find,
            result: '没有搜索到结果'
        })
        return
    }
    if(data.data.list){
        dataList = data.data.list
    }
    if (!dataList.length) {
        res.send({
            code: 1,
            msg: "数据列表为空",
        })
        return
    }
    dataList.forEach(item => {
        resultDataList.push({
            describe: item.subtitle,
            imgSrc: item.imageHost + item.mainImage,
            price: item.price,
            productID: item.id,
            title: item.name

        })
    });

    res.send({
        code: 1,
        msg: '获取搜索商品' + find,
        result: resultDataList
    })
}

/* 搜索商品 */
router.get('/searchGooods', function (req, res, next) {
    let searchName = req.param('searchName');

    let url = dataLocation + 'list.do?pageNum=1&pageSize=10&orderBy=default&keyword=' + encodeURIComponent(searchName)
    request(url, function (error, response, body) {
        if (!error) {
            dataFormat(body,res,searchName)
        } else {
            res.send('{error:404}');
        }
    });








    /* 自己服务器查找（原因是自己不会做商品分类就把他干掉了） */
    /* search(searchName)
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
    }) */
});
/* 分类编号查找 */
router.get("/categoryId", function (req, res, next) {
    let categoryId = req.query.categoryId
    let url = dataLocation + 'list.do?pageNum=1&pageSize=10&orderBy=default&categoryId=' + categoryId
    request(url, function (error, response, body) {
        if (!error) {
            dataFormat(body,res,categoryId)
        } else {
            res.send('{error:404}');
        }
    })
})
/* 商品详情 */
router.get('/details', function (req, res, next) {
    var productID = req.param('productID')
  /*   var searchName = req.param('searchName');
    search(searchName) */
    let url = dataLocation + 'detail.do?productId=' + productID
    request(url, function (error, response, body) {
        if (!error) {
            let data = JSON.parse(body)
            if (!data.status === 0) {
                res.send({
                    code: -1,
                    msg: '获取详情商品' + find,
                    result: '没有结果'
                })
                return
            }
            let imgs = data.data.subImages.split(',');
            let fullImgs =  imgs.map(item => {
                return data.data.imageHost+item
            });

            let resultData = {
                childImgSrc:fullImgs,
                detailsImgSrc:data.data.detail,
                title:data.data.name,
                price:data.data.price,
                stock:data.data.stock,
                describe:data.data.subtitle
            }
            res.send({
                code: 1,
                msg: '产品详情ID' + productID,
                result: resultData
            })
        } else {
            res.send('{error:404}');
        }
    })
    

   /*  goodsModels.findOne(function (err, doc) {
        if (doc) {
            if (searchdb !== 'mei') {
                var prod = doc[searchdb].find(item => {
                    if (item.productID == productID) {
                        return item
                    }
                })
                if (prod) {
                    res.send({
                        code: 1,
                        msg: '产品详情ID' + productID,
                        result: prod
                    })
                } else {
                    res.send({
                        code: -1,
                        msg: '没有找到详情ID',
                    })
                }
            } else {
                console.log(err)
            }
        }
    }) */

})


module.exports = router;
