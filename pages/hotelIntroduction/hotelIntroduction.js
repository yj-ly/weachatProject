const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '重庆分时入住酒店'
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
    let newArr = {}
    newArr.name = '重庆分时入住酒店'
    newArr.tel = '023-0256 8888'
    newArr.payType = [{
      id:1,
      money:true
    }, {
      id: 2,
      wx: true
    }, {
      id: 3,
      dou: true
    }]
    newArr.addr = '重庆市南岸区万达写字楼2栋17楼第三季度静安寺科技'
    newArr.introduce = '海澜大酒店是一家商务、会议型豪华酒店，是江阴市首家五星级酒店。酒店座落在苏南工业重镇新桥镇海澜工业园内，北枕长江，南靠太湖，毗邻张家港市中心，宁太（沿江）高速横亘其侧，交通极其便利。酒店按欧式风格设计装修，环境优美，格调高雅。客房舒适、豪华，餐饮风味独特，各类康乐休闲设施一应俱全，设施先进的商务中心随时为您提供周到、快捷的服务。而气势恢宏、功能齐全的国际会展中心更将使您的商务活动取得意想不到的成功！当暮色降临时，海澜工业园内华光闪烁，幢幢欧式建筑风姿绰约，柔和的光晕洋溢在铜栏杆、古廊柱、大理石上，仿佛一首幽远的歌从上世纪初一直吟唱到今，让您沉醉在一派浓郁的欧陆风情之中……'
    self.setData({
      hotelData: newArr
    })
  },

  nextRun: function (obj) {
    let self = this
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