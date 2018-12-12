const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: {}, //城市列表
    rightList: [], //右侧子母列表
    toView:'#', //滚动索引
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '选择城市'
    })
    if (getApp().globalData.loginInfo == null) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        wx.hideLoading()
      })
      self.nextRun()
    } else {
      self.nextRun()
    }
  },

  nextRun: function (e) {
    let self = this
    let newArr = {}
    let HotCiTyList = [{
      id: 1,
      name: '重庆'
    }, {
      id: 2,
      name: '成都'
    }, {
      id: 3,
      name: '北京'
    }, {
      id: 4,
      name: '呼和浩特'
    }]
    let initialsCiTyList = [{
      id:1,
      name:'A',
      lists: [{
        id: 1,
        name: '阿拉善盟'
      }, {
        id: 2,
        name: '鞍山'
      }]
    }, {
      id: 2,
      name: 'B',
      lists: [{
        id: 1,
        name: '巴拉巴拉小魔仙'
      }, {
        id: 2,
        name: '巴比伦'
      }, {
        id: 3,
        name: '巴比伦2'
      }, {
        id: 4,
        name: '巴比伦3'
      }, {
        id: 5,
        name: '巴比伦4'
      }, {
        id: 6,
        name: '巴比伦5'
      }, {
        id: 7,
        name: '巴比伦6'
      }, {
        id: 8,
        name: '巴比伦7'
      }, {
        id: 9,
        name: '巴比伦8'
      }, {
        id: 10,
        name: '巴比伦9'
      }, {
        id: 11,
        name: '巴比伦10'
      }, {
        id: 12,
        name: '巴比伦11'
      }]
    }]
    let rightList = []
    for (let i = 0; i < initialsCiTyList.length; i++){
      rightList.push({
        id: initialsCiTyList[i].id,
        name: initialsCiTyList[i].name
      })
    }
    rightList.unshift({
      id: '#',
      name: '#'
    })
    newArr.currentLocation = '重庆' //当前定位城市
    newArr.HotCiTyList = HotCiTyList //热门城市
    newArr.initialsCiTyList = initialsCiTyList //首字母分类城市
    // let test = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    self.setData({
      cityList: newArr,
      rightList: rightList
    })
  },

  findView: function (e) {
    let self = this
    let index = 'view_' + e.currentTarget.dataset.id
    if (index != 'view_#') {
      self.setData({
        toView: index
      })
    } else {
      self.setData({
        scrollTop: 0
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
})