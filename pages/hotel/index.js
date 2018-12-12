// pages/hotel/index.js
var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    memberInfo: {},
    addr:'重庆',
    hotel_name:'',
    hotelConfig: { name: '金阳酒店' },
    hotelData: { msg: '加载中' },
    startTime: '', //入住时间
    stText:'', //入住时间显示
    endTime: '', //离开时间
    maxTime:'',
    etText:'', //离开时间显示
    toDays:1, //共计N晚
  },
  testPickerS: function (e) {
    let newDate = e.detail.value.substring(5, e.detail.value.length)
    this.setData({
      startTime: e.detail.value,
      stText: newDate
    });
    getApp().globalData.starTime = e.detail.value //把入住时间设置到公共参数
  },
  testPickerE: function (e) {
    let self = this
    let newDate = e.detail.value.substring(5, e.detail.value.length)
    this.setData({
      endTime: e.detail.value,
      etText: newDate
    });
    getApp().globalData.endTime = e.detail.value //把离开时间设置到公共参数
    //计算相差天数
    let dateSpan,iDays;
    let sDate1 = Date.parse(self.data.startTime);
    let sDate2 = Date.parse(self.data.endTime);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    this.setData({
      toDays: iDays,
    });
    getApp().globalData.toDays = iDays //把时间差设置到公共参数
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let date = new Date()
    let newYear = date.getFullYear()
    let oldMon = date.getMonth() + 1 //当前月份
    let newMon = date.getMonth() + 4 //离开范围最多三个月内，newMon为三月后的月份
    let newDay = date.getDate()
    if (newMon > 12){ //如果三个月的时间跨度超过12个月，则换算
      newMon = newMon - 12
      newYear = newYear + 1
    }
    if (oldMon < 10){ //10月以前的月份前面加0
      oldMon = '0' + oldMon
    }
    if (newMon < 10) { //10月以前的月份前面加0
      newMon = '0' + newMon
    }
    if (newDay < 10) { //10号以前的月份前面加0
      newDay = '0' + newDay
    }
    let time = newYear + '-' + oldMon + '-' + newDay //当前时间
    let now = date.getTime() //当前时间的时间戳
    let nextDay = now + 86400000 //当前时间后一天的时间
    let newDate = new Date(nextDay)
    let tomYear = newDate.getFullYear() //明天的年份
    let tomMon = newDate.getMonth() + 1 //明天的月份数
    let tomDate = newDate.getDate() //明天的日期
    if (tomMon < 10) { //10月以前的月份前面加0
      tomMon = '0' + tomMon
    }
    if (tomDate < 10) { //10号以前的月份前面加0
      tomDate = '0' + tomDate
    }
    let time2 = tomYear + '-' + tomMon + '-' + tomDate
    this.setData({
      startTime: time, //默认入住时间为当前时间，放入入住时间
      endTime: time2, //默认离开时间，放入离开时间
      stText: time.substring(5, 10), //当前时间的显示，只显示月份和日期
      etText: time2.substring(5, 10), //离开时间的显示，只显示月份和日期
      maxTime: newYear + '-' + newMon + '-' + newDay //预定最多三个月内
    })
    getApp().globalData.starTime = time //把入住时间设置到公共参数
    getApp().globalData.endTime = time2 //把离开时间设置到公共参数
    getApp().globalData.maxTime = newYear + '-' + newMon + '-' + newDay //把最大月份设置到公共参数

    //获取当前经纬度
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     var latitude = res.latitude //纬度
    //     var longitude = res.longitude //经度
    //     self.getCityName(latitude, longitude)
    //   }
    // })
  },
  //获取城市名称
  // getCityName: function (latitude, longitude) {
  //   /**
  //    *将经纬度传入后端，获取城市信息 
  //    */
  //   console.log('latitude:' + latitude)
  //   console.log('longitude:' + longitude)
  // },

  //input框变化调用方法
  inputChange:function(value){
    let self = this
    this.setData({
      hotel_name: value.detail.value
    })
  },

  //点击搜索
  submit: function () {
    let self = this
    wx.navigateTo({
      url: '../hotelList/hotelList?hotel_name=' + self.data.hotel_name
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
   initData: function () {
    let self = this;
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
      });
    } else {
      data.getMemberInfo(res => {
        this.setData({
          memberInfo: res,
        });
      })
    }
    // data.getUserInfo(res => {
    //     this.setData({
    //         userInfo: app.globalData.userInfo,
    //     });
    // });
    // data.getHousesForbook(function (res) {
    //     // console.log(res);
    // })
  }
  , bindPay: function () {
    console.log(app.globalData.loginInfo.openid);
    data.miniPay(38, app.globalData.loginInfo.openid, res => {
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