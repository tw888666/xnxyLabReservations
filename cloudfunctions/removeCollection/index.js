// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const collectionName = event.name // 替换为你需要删除记录的 Collection 名称
    console.log(event.name)
    const MAX_LIMIT = 100 // 一次最多删除的记录数量
  
    // 获取 Collection 的记录数量
    const countResult = await db.collection(collectionName).count()
    const total = countResult.total
  
    // 计算需要执行多少次批量删除操作
    const batchTimes = Math.ceil(total / MAX_LIMIT)
  
    // 开始批量删除
    for (let i = 0; i < batchTimes; i++) {
      const res = await db.collection(collectionName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      const ids = res.data.map(record => record._id)
      await Promise.all(ids.map(id => db.collection(collectionName).doc(id).remove()))
    }
  
    return {
      message: 'All records deleted successfully',
      data: []
    }
  }