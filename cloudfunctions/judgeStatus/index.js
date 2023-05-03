// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let flag
    await db.collection('reservations').where({
        user_id:wxContext.OPENID
    }).count().then(res=>{
        console.log(res.total)
        flag = res.total == 1?true:false
    })
    return flag
}