// pages/my/my.js
import Dialog from '@vant/weapp/dialog/dialog';
const app=getApp()
//用户授权不成功
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag:true,
         avatarUrl:null
        //  labsList:[]
    },
    AddLab(){
        wx.cloud.callFunction({
    name: 'addSeatInfo',
  })
  .then((res) => {
    console.log('插入成功：', res);
  })
  .catch((err) => {
    console.error('插入失败：', err);
  });
    },
    DelLab(){
        wx.cloud.callFunction({
            name:'removeCollection',
            data:{
                name:'labs'
            },
            complete:res=>{
                console.log(res)
            }
        })
    },
    AddReservations(){
        wx.cloud.callFunction({
            name:'addReservations',
            complete:res=>{
                console.log(res)
            }
        })
    },
    DelReservations(){
        wx.cloud.callFunction({
            name:'removeCollection',
            data:{
                name:'reservations'
            },
            complete:res=>{
                console.log(res)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        wx.cloud.callFunction({
            name:'addUsers',
            success:res=>{
                console.log(res)
            }
        })
        try {
            const [labsResult] = await Promise.all([
              wx.cloud.callFunction({ name: "getLabList" }),
            ]);
            app.globalData.labsList = labsResult.result.data;   
            this.setData({
              labsList: app.globalData.labsList,
            });
          } catch (error) {
            console.error("Error fetching data:", error);
          }
    },
    onChooseAvatar(e){
        console.log(e)
        this.setData({
            avatarUrl:e.detail.avatarUrl,
            flag:false
        })
        //const { avatarUrl } = e.detail  //获取的是头像的路径（可能也有可能是用户在相册选选择的图片）
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: async function () {
      },
      

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
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