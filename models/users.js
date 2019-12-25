var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
        "userName": String,
        "userPwd": String,
        "mail": String,
        "orderList": [
            
        ],
        "cartList": [
                {
                        "count": String,
                        "title": String,
                        "describe": String,
                        "price": String,
                        "imgSrc": String,
                        "isOpt": Boolean
                }
        ],
        "addressList": [
                {
                        "name": String,
                        "value": String,
                        "detailSite": String,
                        "mobile": String,
                        "checked": Boolean
                }
        ]

});






module.exports = mongoose.model('user', usersSchema)