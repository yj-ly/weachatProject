const data = require('../../utils/data.js');
const app = getApp();
const getRequest = require('../../utils/getRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
<<<<<<< HEAD
    dou:0,
=======
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    userTel:'',
    is_member:1,
    is_activate:1,
    card_list:[],
    last_hotelName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '我'
    })
    if (app.globalData.loginInfo != null) {
      self.setData({
        userInfo: app.globalData.loginInfo,
        hasUserInfo: true
      })
      if (app.globalData.loginInfo.last_hotel != undefined) {
        self.setData({
          last_hotelName: app.globalData.loginInfo.last_hotel.name
        })
      }
    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.setData({
          userInfo: app.globalData.loginInfo,
          hasUserInfo: true
        })
      })
    }
    wx.hideLoading()

    wx.getSetting({
      success:(res) => {
        if (!res.authSetting['scope.userInfo']){
<<<<<<< HEAD
          if (getApp().globalData.loginInfo.name != null && getApp().globalData.loginInfo.phone != null) {
            if (getApp().globalData.userInfo == undefined || getApp().globalData.userInfo == null) {
              if (getApp().globalData.loginInfo) {
                self.setData({
                  userInfo: app.globalData.loginInfo,
                  hasUserInfo: true
                })
              }
            } else {
              if (getApp().globalData.userInfo) {
                self.setData({
                  userInfo: app.globalData.loginInfo,
                  hasUserInfo: true
                })
=======
          if (getApp().globalData.loginInfo != null) {
            if (getApp().globalData.loginInfo.name != null && getApp().globalData.loginInfo.phone != null) {
              if (getApp().globalData.userInfo == undefined || getApp().globalData.userInfo == null) {
                if (getApp().globalData.loginInfo) {
                  self.setData({
                    userInfo: app.globalData.loginInfo,
                    hasUserInfo: true
                  })
                }
              } else {
                if (getApp().globalData.userInfo) {
                  self.setData({
                    userInfo: app.globalData.loginInfo,
                    hasUserInfo: true
                  })
                }
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
              }
            }
          }
        } else {
          self.setData({
            userInfo: app.globalData.loginInfo,
            hasUserInfo: true
          })
        }
      }
    })
  },

  //查看易用豆明细
  douDetail: function (e) {
    let self = this
    if (self.data.is_member == 1) {
      wx.addCard({
        cardList: [{
          cardId: self.data.card_list.cardId,
          cardExt: self.data.card_list.cardExt
        }],
        success: function (ress) {
          console.log('卡券添加成功')
          // console.log(res) // 卡券添加成功
        },
        fail: function (res) {
          console.log('用户取消添加')
          // console.log(res) // 用户取消添加
        }
      })
    } else if (self.data.is_member == 0){
      wx.openCard({
        cardList: [
          {
            cardId: self.data.card_list[0].cardid,
            code: self.data.card_list[0].weixin_code
          }
        ],
        success: function (res) {
        }
      })
    }
  },

  //会员卡完善
  toActivation: function (e) {
    let self = this
    wx.showLoading({
      title: '正在跳转...',
      mask: true,
    });
    wx.navigateTo({
      url: '../activation/activation'
    })
  },

  //登录
  getLogin: function (e) {
    let self = this
    e.detail.userInfo.api_token = app.globalData.api_token
    //创建一个dialog
    wx.showLoading({
      title: '正在登录...',
      mask: true,
    });
    getRequest.getRequest('mini/weixin/update', e.detail.userInfo).then(res => {
      app.globalData.userInfo = res.data.data
      self.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.hideLoading()
    })
  },

  //前往分时规则
  toRules: () => {
    let self = this
    wx.navigateTo({
      url:'../rules/rules'
    })
  },

  //前往在线客服
  toContactUs:() => {
    let self = this
    console.log(1)
    wx.navigateTo({
      url: '../contactUs/contactUs'
    })
  },
  //前往优惠券
  toContactDiscount: () => {
    let self = this
    wx.navigateTo({
      url: '../discount/discount'
  
    })
  },

<<<<<<< HEAD
=======
  //前往收藏
  toCollection: () => {
    let self = this
    wx.navigateTo({
      url: '../myCollection/myCollection'
    })
  },

  //敬请期待
  comingSoon: () => {
    let self = this
    wx.showModal({
      content:'敬请期待',
      showCancel:false
    })
  },

>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
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
})