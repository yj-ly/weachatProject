<<<<<<< HEAD
=======
const getRequest = require('../../utils/getRequest.js');
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '分时规则'
    })
    if (getApp().globalData.loginInfo == null) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        wx.hideLoading()
      })
    }
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
  bindPay: function () {
    // console.log(app.globalData.loginInfo.openid);
    data.miniPay(40, app.globalData.loginInfo.openid, res => {
      if (res.data.code === 0) {
        let json = JSON.parse(res.data.data)
        wx.requestPayment({
          'timeStamp': json.timeStamp,
          'nonceStr': json.nonceStr,
          'package': json.package,
          'signType': json.signType,
          'paySign': json.paySign,
          'success': function (res) {

          },
          'fail': function (res) {

          },
          'complete': function (res) {

          }
        });
      }

    });

  }
})