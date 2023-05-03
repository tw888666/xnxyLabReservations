// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db=cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
      // 获取 seatList 数据（labs 集合中的数据）
      console.log(event.floor,typeof event.floor)
  const labsRes = await db.collection('labs').where({
      floor:event.floor
  }).get();
  const seatList = labsRes.data;

  // 获取 seatList 中所有 _id
  const seatIds = seatList.map(seat => seat._id);

  // 一次性查询所有相关的 reservations 记录
  const res = await db.collection('reservations').where({
    lab_id: _.in(seatIds)
  }).get();

  // 将 reservations 记录映射到 seatList
  const seatStatusMap = res.data.reduce((accumulator, reservation) => {
    accumulator[reservation.lab_id] = reservation.status;
    return accumulator;
  }, {});

  // 将 status 添加到 seatList 的每个元素
  const seatListWithStatus = seatList.map(seat => {
    const status = seatStatusMap[seat._id] || 0;
    return {
      ...seat,
      status
    };
  });
  // 将 seatListWithStatus 返回给小程序
  return {
    seatList: seatListWithStatus
  };
}