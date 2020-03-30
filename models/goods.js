var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var goodsSchema = new Schema({
    "手机": [
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
    "电脑": [
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
    "数码": [
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
