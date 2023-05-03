// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const floors = 9;
  const labsPerFloor = 15;

  // 生成实验室数据
  const labsData = [];

  for (let floor = 1; floor <= floors; floor++) {
    for (let labNumber = 1; labNumber <= labsPerFloor; labNumber++) {
      labsData.push({
        floor: floor.toString(),
        lab_number: labNumber,
      });
    }
  }
  try {
    // 批量插入数据
    const result = await Promise.all(
      labsData.map((lab) => db.collection('labs').add({ data: lab }))
    );
    return { success: true, insertedCount: result.length };
  } catch (error) {
    console.error('Error in batch insert:', error);
    return { success: false, error: error.message };
  }
}