const app = getApp();
const getRequest = require('../../utils/getRequest.js');

Page({
  data: {
    last_hotel:null,
    animationData: {},
    canGo:false
  },
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '欢迎入住'
    })
    wx.login({//login流程
      success: function (res) {//登录成功
        if (res.code) {
          var code = res.code;
          var latitude, longitude
          getRequest.getRequest('mini/login', { code: code }).then(res => {
            app.globalData.loginInfo = res.data.data
            app.globalData.api_token = res.data.data.api_token
            self.setData({
              last_hotel: res.data.data.last_hotel,
              canGo:true
            })
            app.globalData.last_hotel = res.data.data.last_hotel
            /*获取用户当前经纬度*/
            wx.getLocation({
              type: 'wgs84',
              success: function (ress) {
                latitude = ress.latitude
                longitude = ress.longitude
                getRequest.getRequest('mini/weixin/location', {
                  api_token: app.globalData.api_token,
                  latitude: latitude,
                  longitude: longitude
                })
              },
            })
            setTimeout(() => {
              if (self.data.last_hotel == null || self.data.last_hotel == '') {
                wx.switchTab({
                  url: '../hotelList/hotelList'
                })
              } else {
                wx.redirectTo({
                  url: '../hotelDetail/hotelDetail?hotel_id=' + self.data.last_hotel.id
                  // url: '../hotelDetail/hotelDetail?hotel_id=' + 5
                })
              }
            }, 1000)
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  //数据加载完成后，点击任何位置可以离开首页
  goNext: function () {
    let self = this
    if (self.data.last_hotel == null || self.data.last_hotel == '') {
      wx.switchTab({
        url: '../hotelList/hotelList'
      })
    } else {
      wx.redirectTo({
        url: '../hotelDetail/hotelDetail?hotel_id=' + self.data.last_hotel.id
      })
    }
  }
})
