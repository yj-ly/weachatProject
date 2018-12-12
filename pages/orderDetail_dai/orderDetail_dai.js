const app = getApp();
const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel: {},
    people: {},
    orderInfo:{},
    order_id: 0,
    refundData: {}, //支付记录
    latitude:0,
    longitude:0,
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
      title: '订单详情-待确认'
    })
    self.setData({
      order_id: options.orderId
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
      let room = {
        roomName: res.data.data.name,
        num: res.data.data.quantity,
        starTime: res.data.data.arrival_date,
        endTime: res.data.data.departure_date,
        star_week: weeks[new Date(res.data.data.arrival_date).getDay()],
        end_week: weeks[new Date(res.data.data.departure_date).getDay()],
      }
      let hotel = {
        name: res.data.data.merchant.name,
        addr: res.data.data.merchant.address,
        money: res.data.data.pay_amount,
        dou: app.globalData.loginInfo.member.integral,
        room: room,
        tel: res.data.data.merchant.tel
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
      let refundArr = []
      if (res.data.data.payments != undefined && res.data.data.payments.length > 0) {
        for (let i = 0; i < res.data.data.payments.length; i++) {
          refundArr.push(res.data.data.payments[i])
        }
      }
      self.setData({
        hotel: hotel,
        people: people,
        refundData: refundArr,
        orderInfo: orderInfo,
        latitude: res.data.data.merchant.latitude,
        longitude: res.data.data.merchant.longitude,
      })
      wx.hideLoading()
    })
  },

  //打开地图
  openMap: function (e) {
    let self = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (res) {
        console.log(res)
        var latitude = parseFloat(self.data.latitude)
        var longitude = parseFloat(self.data.longitude)
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  
  //月份、日期、小时、分钟如果小于10则在前面加个0
  dateResult: function (num) {
    if (num < 10) {
      return num = '0' + num
    } else {
      return num
    }
  },
  //拨打电话
  toCall: function (e) {
    let self = this
    wx.makePhoneCall({
      phoneNumber: self.data.hotel.tel
    })
  },
  //取消支付
  noPay: function (e) {
    let self = this
    getRequest.getFormId(e.detail.formId, 3).then(res => {
      wx.showModal({
        content: '是否确认取消订单',
        success: function (res) {
          if (res.confirm) {
            getRequest.getRequest('mini/order/room/cancel', {
              api_token: getApp().globalData.api_token,
              id: self.data.order_id,
            }).then(res => {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000,
                mask: true,
                complete: function (e) {
                  getRequest.getRequest('mini/order/room/refund', {
                    api_token: getApp().globalData.api_token,
                    id: self.data.order_id,
                  }).then(res => {
                    setTimeout(() => {
                      // wx.navigateTo({
                      //   url: '../orderDetail_cancel/orderDetail_cancel?orderId=' + self.data.order_id
                      // })
                      wx.switchTab({
                        url: '../orderList/orderList'
                      })
<<<<<<< HEAD
                    }, 2000)
=======
                    }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
                  })
                }
              });
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
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
    wx.switchTab({
      url: '../orderList/orderList'
    })
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