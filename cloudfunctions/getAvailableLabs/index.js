// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const $=db.command.aggregate
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    // const startTime = event.startTime;
    // const endTime = event.endTime;
  
    // 查询指定时间范围内的预订记录
    const reservedLabsRes = await db.collection('reservations').where({
      //start_time: { $lt: endTime },
      //end_time: { $gt: startTime },
      status: _.in([1,2])
    }).get();
  
    const reservedLabs = reservedLabsRes.data;
    console.log(reservedLabs,'labs')
    const reservedLabIds = reservedLabs.map((reservation) => reservation.lab_id);
    console.log(reservedLabIds,'id')
    // 查询各楼层总共的实验室座位数量
    // const totalLabsRes = await db.collection('labs').aggregate()
    //   .group({
    //     _id: '$floor',
    //     totalLabs:$.sum(1)
    //   })
    //   .end();
  
    // 如果没有预订记录，则设置 reservedLabIds 为一个不可能存在的值，以便查询所有可用座位
    if (reservedLabIds.length === 0) {
      reservedLabIds.push("non_existent_id");
    }
  
  // 查询未被预订的实验室座位
  //>100
  let availableLabs = [];
  let skip = 0;

  while (true) {
      const batch = await db.collection('labs').where({
          lab_id: _.nin(reservedLabIds)
      }).skip(skip).get();

      if (batch.data.length === 0) {
          break;
      }
      availableLabs = availableLabs.concat(batch.data);
      skip += 100;
  }
  console.log(availableLabs)
  // 计算各楼层未被预订的实验室座位数量

  const floorCounts = {};

  availableLabs.forEach((lab) => {
      if (floorCounts[lab.floor]) {
          floorCounts[lab.floor]++;
      } else {
          floorCounts[lab.floor] = 1;
      }
      if(lab.floor == 1){console.log(lab)}
  });

  const availableLabsCountByFloor = Object.entries(floorCounts).map(([floor, count]) => {
      return { _id: floor, availableLabsCount: count };
  });

//   return {
//       totalLabsByFloor: totalLabsRes.list,
//       availableLabsCountByFloor
//   };
return availableLabsCountByFloor
  };