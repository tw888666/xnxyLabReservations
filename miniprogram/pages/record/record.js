// pages/record/record.js
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

Page({
//找user_id
    /**
     * 页面的初始数据
     */
    data: {
        location:'',
        reservation:null,
        message:'',
        flag:true
    },
    async handleScan(){
        wx.scanCode({
            success:res=>{
                let jsonData = JSON.parse(res.result)
                console.log(jsonData)
                let {floor,lab_number} = jsonData   
                this.scanCode(floor,lab_number)
            }
        })
        this.setData({
            flag:!this.data.flag
        })
    },

    async scanCode(floor,lab_number){
        const msg = ['','你已开始使用该实验室','核销成功']
        let location = floor+(lab_number < 10 ? '0'+lab_number:lab_number)
        let that = this
        if(location===this.data.location){
            const status = this.data.reservation === null ? 0:this.data.reservation.status
            if(status===1||status===2){
                Dialog.confirm({
                    message: '确认核销二维码吗？',
                  })
                    .then(() => {
                      // on confirm
                      console.log(this.data.reservation.lab_id)
                         wx.cloud.callFunction({
                          name:'updateSeatAndGetRecord',
                          data:{
                              status:status,
                              lab_id:this.data.reservation.lab_id
                          },
                          success:res=>{
                            Toast.success(msg[status]);
                            that.setData({
                                reservation:res.result,
                                message:status==2? '您当前未预约实验室':this.data.message,
                                location:status==2?'':this.data.location
                            })
                            console.log(res)
                          },
                          fail:res=>{
                              console.log(res)
                              Toast.fail('核销失败')
                          }
                      })
                    })
                    .catch(() => {
                      // on cancel
                    });
            }
        } else{
            //显示座位状态
            let lab_id
            let status
            const db=wx.cloud.database()
            await db.collection('labs').where({
                floor:floor,
                lab_number:lab_number
            }).get().then(res=>{
                // console.log(res.data[0])
                lab_id = res.data[0]._id
            })
            await db.collection("reservations").where({
                lab_id:lab_id
            }).get().then(res=>{
                status =  res.data[0].status
                 console.log(res)
            })
            switch(status){
                case 0:
                    Toast('实验室空闲，如需使用请预约')
                    break
                    case 1:
                        Toast('实验室已被预约')
                        break
                        case 2:
                            Toast('实验室使用中')
                            break
                            default:
                                Toast('数据异常')
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.cloud.callFunction({
            name:'getRecord',
            complete:res=>{
                console.log(res)
                if(res.result ===null){
                    this.setData({
                        message:'您当前未预约实验室'
                    })
                } else{
                    console.log(res)
                    this.setData({
                         location:res.result.location,
                         reservation:res.result.reservation,
                         message:'您预约的实验室为：'
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})