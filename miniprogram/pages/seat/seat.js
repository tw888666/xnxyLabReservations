// pages/index/index.js
//改一下navi
import Dialog from '@vant/weapp/dialog/dialog'
//座位要排序
Page({

    /**
     * 页面的初始数据
     */
    data: {
        seatList:[],
       imagePath:['/images/可选.png','/images/有约.png','/images/使用中.png'],
       floor:1
    },
    handleSeat(e){
        let lab_id = e.currentTarget.dataset.id
        let status = e.currentTarget.dataset.status
        this.clickSeat(lab_id,status)       
    },
    reservationSeat(lab_id,status){
        let hasSeat =null
        let that = this
        wx.cloud.callFunction({
            name:"judgeStatus",
            success:res=>{
                //console.log(res.result)
                hasSeat = res.result
                //
                if(hasSeat===true){
                    Dialog.alert({
                        message:'你已预约座位，请勿重复预约'
                    })
                } else{
                    console.log(typeof hasSeat,hasSeat)
                    wx.showModal({
                        title: '确认',
                        content: '确定要预订此教室吗？',
                        success: async (res) => {
                          if (res.confirm) {
                            // 更新数据库中指定 ID 的记录的 status 字段的值为 1
                            try {
                                const updatedSeatList = this.data.seatList.map(seat => {
                                    if (seat._id === lab_id) {
                                      return {
                                        ...seat,
                                        status: 1 // 假设状态 1 表示座位已被预订
                                      };
                                    }
                                    return seat;
                                  });
                                wx.cloud.callFunction({
                                    name:'updateSeat',
                                    data:{
                                        lab_id:lab_id,
                                        status:status
                                    },
                                    success:res=>{
                                        console.log('success',res)
                                        that.setData({
                                             seatList:updatedSeatList
                                        })
                                    }
                                })
                              // 更新成功，弹出提示框
                              wx.showToast({
                                title: '预订成功',
                                icon: 'success'
                              })
                            } catch (err) {
                              // 更新失败，弹出提示框
                              wx.showToast({
                                title: '更新失败',
                                icon: 'none'
                              })
                              console.log(err)
                            }
                          }
                        }
                      })
                }
            }
        })
        // if(hasSeat===true){
        //     Dialog.alert({
        //         message:'你已预约座位，请勿重复预约'
        //     })
        // } else{
        //     console.log(typeof hasSeat,hasSeat)
        //     wx.showModal({
        //         title: '确认',
        //         content: '确定要预订此教室吗？',
        //         success: async (res) => {
        //           if (res.confirm) {
        //             // 更新数据库中指定 ID 的记录的 status 字段的值为 1
        //             try {
        //                 const updatedSeatList = this.data.seatList.map(seat => {
        //                     if (seat._id === lab_id) {
        //                       return {
        //                         ...seat,
        //                         status: 1 // 假设状态 1 表示座位已被预订
        //                       };
        //                     }
        //                     return seat;
        //                   });
        //                 wx.cloud.callFunction({
        //                     name:'updateSeat',
        //                     data:{
        //                         lab_id:lab_id,
        //                         status:status
        //                     },
        //                     success:res=>{
        //                         console.log('success',res)
        //                         that.setData({
        //                              seatList:updatedSeatList
        //                         })
        //                     }
        //                 })
        //               // 更新成功，弹出提示框
        //               wx.showToast({
        //                 title: '预订成功',
        //                 icon: 'success'
        //               })
        //             } catch (err) {
        //               // 更新失败，弹出提示框
        //               wx.showToast({
        //                 title: '更新失败',
        //                 icon: 'none'
        //               })
        //               console.log(err)
        //             }
        //           }
        //         }
        //       })
        // }
    },
    clickSeat(lab_id,status){
        switch (status) {
            case 0:
                this.reservationSeat(lab_id,status)
              break
            case 1:
              Dialog.alert({
                  message:'座位已被预约'
              })
              break
            case 2:
              Dialog.alert({
                  message:'座位已被使用'
              })
              break
            default:
              // 如果 status 字段的值不是 0、1、2 中的任何一个，抛出错误提示
              wx.showToast({
                title: '无效的状态',
                icon: 'none'
              })
              break
          }
    },
    /**
     * 生命周期函数--监听页面加载
     */
   async onLoad(options) {
    this.floor = options.floor
    const db = wx.cloud.database()
    await db.collection('labs').where({
        floor:options.floor
    }).get().then(res=>{
        // console.log(res)
        this.setData({
            seatList:res.data,
            floor:options.floor
        })
        //console.log(this.floor,typeof this.floor)
    })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        //座位列表添加状态
        await wx.cloud.callFunction({
            name: 'getSeatListWithStatus',
            data:{
                floor:this.floor
            },
            success: res => {
              this.setData({
                seatList: res.result.seatList,
              });
            },
            fail: err => {
              console.error('获取带有状态的座位列表失败：', err);
            }
          });
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