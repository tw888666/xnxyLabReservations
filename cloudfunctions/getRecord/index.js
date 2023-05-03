// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const result = await db.collection('reservations').where({
        user_id:wxContext.OPENID
    }).get()
    console.log(result.data)
    if(result.data.length === 0) return null
    const reservation = result.data[0]
     console.log(reservation)
    const lab_result = await db.collection('labs').where({
        _id:reservation.lab_id
    }).get()
    const lab_res = lab_result.data[0]
    let {floor,lab_number} = lab_res
    lab_number = lab_number<10 ? '0'+lab_number:lab_number
    const location = floor+lab_number
    console.log(location)
    return {reservation,location}
}