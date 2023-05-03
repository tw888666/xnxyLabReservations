// pages/home/home.js
import Dialog from '@vant/weapp/dialog/dialog';
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reservationsList:[],
        labsList: [],
        floors:[],
        maxFloor:9,
        availableSeatsList:{},
        //封楼
        flag:false
    },

    handleReservation(event){
        const floor = event.currentTarget.dataset.floor
        wx.navigateTo({
          url: '/pages/seat/seat?floor='+floor,
        //   success: (result) => {console.log(result)},
        })
    },
    generateFloorsArray: function (maxFloor) {
        const floors = [];
        for (let i = 1; i <= maxFloor; i++) {
          floors.push(i);
        }
        return floors;
      },

     calculateAvailableSeats: function  (floor,labsList,reservationsList) {
        // 获取当前楼层的实验室列表
        const labsOnFloor = labsList.filter((lab) => lab.floor == floor)
        const maxLabNumber = Math.max(...labsOnFloor.map((lab) => lab.lab_number));
        const reservationsOnFloor = reservationsList.filter(
          (reservation) => labsOnFloor.some((lab) => lab._id === reservation.lab_id && reservation.user_id!=null)
        );
        const availableSeats = maxLabNumber - reservationsOnFloor.length;
        return availableSeats;
      },
      
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.cloud.callFunction({
            name:"getAvailableLabs",
            complete:res=>{
                console.log(res)
                console.log(res.result)
                console.log(res.result[0])
                this.setData({
                    availableSeatsList:res.result
                })
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.showLoading({
            title: '加载中',
          })
    },
    async calculateAvailableSeatsList(){
        const labsList = app.globalData.labsList
        const res = await wx.cloud.callFunction({
            name:"getReservationsList"
        })
        const reservationsList = res.result.data
        // console.log(reservationsList)
        const {maxFloor} = this.data
        const floors = this.generateFloorsArray(maxFloor);
        const availableSeatsList = Array.from({ length: maxFloor }, (_, floor) =>
             this.calculateAvailableSeats(floor + 1,labsList,reservationsList)
        );
        this.setData({ labsList, reservationsList,floors,availableSeatsList });
        wx.hideLoading()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        wx.cloud.callFunction({
            name:'adminOperation',
            success:res=>{
                // console.log(res)
                this.setData({
                     flag:res.result
                })
                if(res.result){
                    Dialog.alert({
                        message:'实验室封楼'
                    })
                    return
                } else{
                    // wx.showLoading({
                    //     title: '加载中',
                    //   })
                      //this.calculateAvailableSeatsList()
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