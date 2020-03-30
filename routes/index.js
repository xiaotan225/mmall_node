var express = require('express');
var router = express.Router();
var moment = require('moment')
require('moment/locale/zh-cn')
/* GET home page. */
router.get('/', function (req, res, next) {
  let title = moment().format('MMMM Do YYYY, h:mm: a');;
  res.render('index', { title: title });
});

router.get('/jsonp', function (req, res, next) {
  let callback = req.query.callback
  let data = {
    name: 'zhangs',
    age: 18
  }
  data = JSON.stringify(data)
  let call = callback + '(' + data + ')'
  console.log(call)
  res.send(call)

})



router.get('/test', function (req, res, next) {
  let data = [
    {
      label: "肉类",
      children: [
        {
          label: "猪肉",
          children: [
            {
              label: "五花肉"
            },
            {
              label: "小肉"
            }
          ]
        },
        {
          label: "鸡肉",
          children: [
            {
              label: "鸡腿"
            },
            {
              label: "机车"
            }
          ]
        }
      ]
    },
    {
      label: "蔬菜",
      children: [
        {
          label: "也是累",
          children: [
            {
              label: "大白菜"
            },
            {
              label: "小白菜"
            }
          ]
        },
        {
          label: "根基类",
          children: [
            {
              label: "萝卜"
            },
            {
              label: "土豆"
            }
          ]
        }
      ]
    }
  ]
  res.send(data)
})


module.exports = router;
