const app = getApp();
const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel: {},
    people: {},
    orderInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: '订单详情-已完成'
    })
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.nextRun(options)
        wx.hideLoading()
      })
    }else{
      self.nextRun(options)
    }
  },

  nextRun: function (options) {
    let self = this
    getRequest.getRequest('mini/order/room/show', {
      api_token: getApp().globalData.api_token,
      id: options.orderId,
    }).then(res => {
      let weeks = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
      let room = []
      for (let i = 0; i < res.data.data.houses.length; i++) {
        room.push({
          roomName: res.data.data.name,
          roomNo: res.data.data.houses[i].house_no,
          starTime: res.data.data.houses[i].check_in_at,
          endTime: res.data.data.houses[i].check_out_at,
          star_week: weeks[new Date(res.data.data.houses[i].check_in_at).getDay()],
          end_week: weeks[new Date(res.data.data.houses[i].check_out_at).getDay()],
          integral: res.data.data.houses[i].integral
        })
      }
      let hotel = {
        name: res.data.data.merchant.name,
        addr: res.data.data.merchant.address,
        money: res.data.data.pay_amount,
        dou: app.globalData.loginInfo.member.integral,
        room: room,
        tel: res.data.data.merchant.tel,
        integral: res.data.data.integral,
      }
      let people = {
        name: res.data.data.use_name,
        tel: res.data.data.use_phone,
        arrvieTime: '18:00'
      }
      let orderInfo = {
        orderNo: res.data.data.no,
        orderDate: res.data.data.created_at
      }
      self.setData({
        hotel: hotel,
        people: people,
        orderInfo: orderInfo,
      })
      wx.hideLoading()
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
  bindPay: function () {
    console.log(app.globalData.loginInfo.openid);
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
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          },
          'complete': function (res) {
            console.log(res);
          }
        });
      }

    });

  }
})