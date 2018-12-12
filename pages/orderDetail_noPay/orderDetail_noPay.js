const data = require('../../utils/data.js');
let dateTimePicker = require('dateTimePicker.js');
const getRequest = require('../../utils/getRequest.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel: {},
    people: {},
    starDate: '', //年月日的开始时间
    maxDate: '', //年月日的最大时间
    starTime: '', //时分秒的开始时间
    maxTime: '23:59', //时分秒的最大时间
    choosePay: [true, false], //选择的支付方式
    orderId: 0,
    cantClick: false, //最高级遮挡层
    syTime:'', //剩余时间
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
    self.setData({
      orderId: options.orderId
    })
    wx.setNavigationBarTitle({
      title: '订单详情-待付款'
    })
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        wx.hideLoading()
        self.nextRun(options)
      })
    } else {
      self.nextRun(options)
    }
  },

  nextRun: function (options) {
    let self = this
    getRequest.getRequest('mini/order/room/show', {
      api_token: getApp().globalData.api_token,
      id: options.orderId,
    }).then(res => {
      let endTime = new Date(res.data.data.created_at.substring(0, 4),
        self.dateResult(parseInt(res.data.data.created_at.substring(5, 7)) - 1),
        res.data.data.created_at.substring(8, 10),
        res.data.data.created_at.substring(11, 13),
        res.data.data.created_at.substring(14, 16),
        res.data.data.created_at.substring(17, 19)).getTime()
      endTime = endTime + 300000
      self.remainingTime(endTime)

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
        room: room
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
        orderInfo: orderInfo
      })
      wx.hideLoading()
    })
  },

  //时间转换
  remainingTime: function (endTime){
    let self = this
    let date = new Date(endTime);
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    self.setData({
      syTime: h + m
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

  //预计到店时间
  bindTimeChange: function (e) {
    this.setData({
      starTime: e.detail.value,
    });
  },

  //支付方式选择
  payChoose: function (e) {
    let self = this
    let index = e.currentTarget.id.slice(1, e.currentTarget.id.length)
    let newArr = self.data.choosePay
    if (index == 0) {
      if (!newArr[0]) {
        newArr[0] = true
        newArr[1] = false
      }
    } else {
      if (!newArr[1]) {
        newArr[1] = true
        newArr[0] = false
      }
    }
    this.setData({
      choosePay: newArr,
    });
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
              id: self.data.orderId,
            }).then(res => {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000,
                mask: true,
                complete: function (e) {
                  setTimeout(() => {
                    // wx.navigateTo({
                    //   url: '../orderDetail_cancel/orderDetail_cancel?orderId=' + self.data.orderId
                    // })
                    wx.switchTab({
                      url: '../orderList/orderList'
                    })
<<<<<<< HEAD
                  }, 2000)
=======
                  }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
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
  //支付
  payFunc(e) {
    let self = this
    getRequest.getFormId(e.detail.formId, 2).then(res => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      self.setData({
        cantClick: true
      })
      let pay_type = 0; //0为微信支付，1为易用豆支付
      if (self.data.choosePay[0]) {
        pay_type = 0
      } else {
        pay_type = 1
      }
      getRequest.getRequest('mini/order/room/pay', {
        api_token: getApp().globalData.api_token,
        id: self.data.orderId,
        pay_type: pay_type
      }).then(res => {
        //pay_type为0即为微信支付，1为易用豆
        if (self.data.choosePay[0]) {
          wx.requestPayment({
            timeStamp: res.data.data.timestamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (ress) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000,
                mask: true,
                complete: function (e) {
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '../orderDetail_dai/orderDetail_dai?orderId=' + self.data.orderId + '&&hotelId=' + res.data.data.hotel_id
                    })
<<<<<<< HEAD
                  }, 2000)
=======
                  }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
                }
              });
            },
            'fail': function (ress) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 1000,
                mask: true,
                complete: function (e) {
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '../orderDetail_noPay/orderDetail_noPay?orderId=' + self.data.orderId + '&&hotelId=' + res.data.data.hotel_id
                    })
<<<<<<< HEAD
                  }, 2000)
=======
                  }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
                }
              });
            }
          })
        } else {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000,
            mask: true,
            complete: function (e) {
              setTimeout(() => {
                wx.navigateTo({
                  url: '../orderDetail_dai/orderDetail_dai?orderId=' + self.data.orderId + '&&hotelId=' + res.data.data.hotel_id
                })
<<<<<<< HEAD
              }, 2000)
=======
              }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
            }
          });
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