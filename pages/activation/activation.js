const getRequest = require('../../utils/getRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    userTel:'',
    userCard:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.showLoading({
      title:'加载中',
      mark:true
    })
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        wx.hideLoading()
        self.nextRun()
      })
    } else {
      self.nextRun()
      wx.hideLoading()
    }
  },

  nextRun: function () {
    let self = this
    getRequest.getRequest('mini/member/show', {
      api_token: getApp().globalData.api_token,
    }).then(res => {
      self.setData({
        userName: res.data.data.name,
        userTel: res.data.data.phone,
        userCard: res.data.data.idcard
      })
      getApp().globalData.loginInfo.member.name = res.data.data.name
      getApp().globalData.loginInfo.member.phone = res.data.data.phone
      getApp().globalData.loginInfo.member.idcard = res.data.data.idcard
    })
  },

  //姓名输入框
  nameBlur: function (e) {
    let self = this
    self.setData({
      userName: e.detail.value
    })
  },
  
  //身份证输入框
  cardBlur: function (e) {
    let self = this
    self.setData({
      userCard: e.detail.value
    })
  },
  
  //获取手机号
  getPhoneNumber(e){
    let self = this
    if (e.detail.errMsg.substring(15, e.detail.errMsg.length) == 'ok') {
      getRequest.getRequest('mini/decrypt', {
        api_token: getApp().globalData.api_token,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }).then(res => {
        self.setData({
          userTel: res.data.data.purePhoneNumber
        })
      })
    }
  },

  //激活
  getActivation: function (e) {
    let self = this
    if (self.data.userName != '' && self.data.userName.length > 1 && self.data.userTel != ''){
      getRequest.getRequest('mini/member/update', {
        api_token: getApp().globalData.api_token,
        phone: self.data.userTel,
        name: self.data.userName,
        idcrad: self.data.userCard
      }).then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
        getApp().globalData.loginInfo.member.name = res.data.data.name
        getApp().globalData.loginInfo.member.phone = res.data.data.phone
        getApp().globalData.loginInfo.member.idcard = res.data.data.idcard
        setTimeout(() => {
          wx.reLaunch({
            url: '../my/index'
          })
        }, 2000)
      })
    }else {
      wx.showModal({
        title: '错误',
        showCancel: false,
        content: '您的资料有误，请检查输入',
        success: function (res) {

        }
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})