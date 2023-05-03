// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const MAX_LIMIT = 100 // 一次查询最多返回的记录数量
  const countResult = await db.collection('labs').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)

  // 批量获取 labsList 中的所有文档
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('labs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  const labsList = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data)
    }
  }).data

  // 遍历 labsList，获取每个文档的 _id，然后将其添加到 reservations 集合中
  const initTasks = labsList.map(async (lab) => {
    await db.collection('reservations').add({
      data: {
        lab_id: lab._id,
        status: 0
      }
    })
  })

  // 等待所有任务完成
  await Promise.all(initTasks)

  return {
    message: 'Data initialized successfully',
    data: []
  }
}
