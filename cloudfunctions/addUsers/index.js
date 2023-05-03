// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const userRes = await db.collection('users').where({
        user_id: openid
      }).get();
    
      // 如果不存在，则插入新记录
      if (userRes.data.length === 0) {
        await db.collection('users').add({
          data: {
            user_id: wxContext.OPENID
          }
        });
      }
    return wxContext.OPENID
}