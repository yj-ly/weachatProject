const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInputVale:'',
    historyList:[],
    hotList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (getApp().globalData.loginInfo == null) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.nextRun()
        wx.hideLoading()
      })
    }else{
      self.nextRun()
    }
  },

  nextRun:function() {
    let self = this
    let newArr1 = []
    let newArr2 = []
    if (getApp().globalData.loginInfo.member != null) {
      //搜索记录
      if (getApp().globalData.loginInfo.member.my_searches != undefined && getApp().globalData.loginInfo.member.my_searches != null && getApp().globalData.loginInfo.member.my_searches.length > 0) {
        for (let i = 0; i < getApp().globalData.loginInfo.member.my_searches.length; i++) {
          newArr1.push({
            name: getApp().globalData.loginInfo.member.my_searches[i].name
          })
        }
      }
      //热门搜索
      if (getApp().globalData.loginInfo.member.searches != undefined && getApp().globalData.loginInfo.member.searches != null && getApp().globalData.loginInfo.member.searches.length > 0) {
        for (let i = 0; i < getApp().globalData.loginInfo.member.searches.length; i++) {
          newArr2.push({
            name: getApp().globalData.loginInfo.member.searches[i].name
          })
        }
      }
      self.setData({
        historyList: newArr1,
        hotList: newArr2
      })
    }
  },

  inputBlur: function(e){
    let self = this
    self.setData({
      searchInputVale:e.detail.value
    })
  },

  //历史记录/热门搜索按钮
  buttonClick: function(e){
    let self = this
    getApp().globalData.searchInputVale = e.currentTarget.dataset.hotel.name
    wx.switchTab({
      url: '../hotelList/hotelList'
    })
  },

  //搜索按钮点击事件
  searchClick: function(e){
    let self = this
    getApp().globalData.searchInputVale = self.data.searchInputVale
    if (self.data.searchInputVale != '') {
      let haveSearch = false
      let haveIndex = -1
      for (let i = 0; i < self.data.historyList.length; i++) {
        if (self.data.historyList[i].name == self.data.searchInputVale) {
          haveSearch = true
          haveIndex = i
          break
        } else {

        }
      }
      if (haveSearch) {
        let newArr = self.data.historyList
        newArr.splice(haveIndex, 1)
        newArr.unshift({
          name: self.data.searchInputVale
        })
        getApp().globalData.loginInfo.member.my_searches = newArr
      } else {
        let newArr = self.data.historyList
        newArr.splice(self.data.historyList.length - 1, 1)
        newArr.unshift({
          name: self.data.searchInputVale
        })
        getApp().globalData.loginInfo.member.my_searches = newArr
      }
    }
    wx.switchTab({
      url: '../hotelList/hotelList'
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
})