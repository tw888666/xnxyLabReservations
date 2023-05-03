const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  // 先取出集合记录总数
  // 等待所有
  return await db.collection('seatInfo').get()
}