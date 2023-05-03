// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let flag
    await db.collection('admin').field({
        flag:true,
        _id:false
    })
    .get()
    .then(res=>{
         flag = res.data[0].flag
    })
    console.log(flag)
    return flag
}