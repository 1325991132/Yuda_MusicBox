//数据库连接
var mongoose = require("mongoose");
const DB_URL = 'mongodb://127.0.0.1:27017/qyd';

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true
}, function (err) {
    if (err) {
        // console.log(err);
        console.log('连接数据库失败')
        return;
    }
    console.log("连接成功")
})
//生成自定义模块
module.exports = mongoose;