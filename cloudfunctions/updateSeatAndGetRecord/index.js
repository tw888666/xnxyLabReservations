// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let res
    const { status, lab_id } = event;
    try {
      // 更新座位状态
      if(status === 1){
        res =await db.collection('reservations').where({
            lab_id: lab_id,
          }).update({
            data: {
              status: status+1,
              start_time:getCurrentTime()
            },
          });
    }
    if(status===2){
         res = await db.collection('reservations').where({
            lab_id: lab_id,
          }).update({
            data: {
              status: 0,
              user_id: null,
              end_time:getCurrentTime()
            },
          });
    } 
      // 获取最新的数据
      const recordRes = await db.collection('reservations').where({ lab_id }).get();
      console.log(res)
      return recordRes.data[0];
    } catch (err) {
      console.error(err);
      return { error: '更新座位状态和获取记录失败' };
    }
}

function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }