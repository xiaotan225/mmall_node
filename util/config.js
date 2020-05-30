var mongoose = require('mongoose')
const nodemailer = require("nodemailer");

var Mongoose = {
    url: 'mongodb://127.0.0.1:27017/mmall',
    connect() {
        mongoose.connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
            if (err) {
                console.log('数据库连接失败')
                return
            }
            console.log('数据库连接成功')
        })
    }
}


var Email = {
    get transporter() {
        return nodemailer.createTransport({
            host: "smtp.qq.com", //qq smtp服务器地址
         
            port: 465, //qq邮件服务所占用的端口
            auth: {
                user: "2646397614@qq.com",//开启SMTP的邮箱，有用发送邮件
                pass: "mbwqmqntfqapdjaf"//授权码
            }
        })
    },
    get verifyCode(){
        return Math.random().toString().slice(2,6)
    },
    get time(){
        return Date.now()
    }
}


module.exports = {
    Mongoose,
    Email
}