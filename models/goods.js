var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var goodsSchema = new Schema({
    "mobile": [
        {
            "productID":String,
            "title": String,
            "describe": String,
            "stock": Number,
            "price": Number,
            "imgSrc": String,
            "childImgSrc": [
                { "src": String },
                { "src": String },
                { "src": String },
                { "src": String }
            ],
            "detailsImgSrc": [
                { "src": String },
                { "src": String },
                { "src": String },

            ]
        }
    ],
    "digital": [
        {
            "title": String,
            "describe": String,
            "stock": Number,
            "price": Number,
            "imgSrc": String
        }
    ],
    "slideshow": [
        {
            "imgSrc": String
        },
        {
            "imgSrc": String
        },
        {
            "imgSrc": String
        }
    ]

});


module.exports = mongoose.model('goods', goodsSchema)
