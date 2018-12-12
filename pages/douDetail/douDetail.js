const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    douList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.request({
      url: getApp().globalData.conURL + 'mini/user/integrallist',
      data: {
        api_token: getApp().globalData.api_token,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          let newArr = []
          for(let i = 0; i < res.data.data.length; i++){
            //操作来源 0=房间剩余时长兑换 1=抵扣房费 2=酒店是否共享转换
            let origin = ''
            if (res.data.data[i].origin == 0){
              origin = '房间剩余时长兑换'
            } else if (res.data.data[i].origin == 1) {
              origin = '抵扣房费'
            } else if (res.data.data[i].origin == 2) {
              origin = '酒店是否共享转换'
            }
            newArr.push({
              name: origin,
              date: res.data.data[i].created_at.substring(5,10),
              week: res.data.data[i].record_week_day,
              orderNo: res.data.data[i].no,
              addr: res.data.data[i].address,
              direction: res.data.data[i].pay_direction, //0收入，1支出
              price: res.data.data[i].integral,
            })
          }
          console.log(newArr)
          self.setData({
            douList:newArr
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})