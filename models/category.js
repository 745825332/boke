const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 分类模型
 */
const CategorySchema = new Schema({
    name: String,
    path: String,
    sort: {
        type: Number,
        default: 100
    },
    pid:{
        type:Schema.Types.ObjectId
    },
    template:{
        type:String,
        default:''
    },
    is_nav:{
        type:Number,
        default:0
    },
    is_sys:{
        type:Number,
        default:0
    },
    create_at:{
        type:Date,
        default:Date.now,
    },
    update_at:{
        type:Date,
        default:Date.now
    },
    delete_at:{
        type:Date,
        default:null
    }
})

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;