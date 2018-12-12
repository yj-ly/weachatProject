const getRequest = require('../../utils/getRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,
    list: [], //优惠券列表
    page: 1,
    size: 5,
    showLoading: false, //显示上拉加载中
    showNull: false, //显示上拉加载无数据
    canUp: false //是否可以上拉
  },
  //切换状态
  changeStatus: function(e) {
    let self = this;
    self.setData({
      status: e.target.dataset.index,
      page: 1,
      size: 5
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    self.getList();
    // console.log(e.target.dataset.index);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    self.getList();
    // wx.setEnableDebug({
    //   enableDebug: true
    // })

  },
  //获取优惠券列表
  getList: function() {
    let self = this;
    getRequest.getRequest('mini/member/coupons', {
      api_token: getApp().globalData.api_token,
      status: self.data.status,
      page: self.data.page,
      size: self.data.size
    }).then(res => {
      if (res.data.status == 0) {
        self.setData({
          list: res.data.data.data
        })
        if (res.data.data.data >= 4) {
          self.setData({
            canUp: true
          })
        }
        wx.hideLoading();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let self = this;
    wx.showNavigationBarLoading();
    // console.log('触发下拉加载');
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true,
    // });
    self.setData({
      page: 1,
      size: 5
    })
    self.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    if (self.canUp) {
      let newList = [];
      newList = self.data.list;
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      self.setData({
        page: self.data.page + 1,
        showLoading: true,
      })
      console.log(self.data.showLoading);
      getRequest.getRequest('mini/member/coupons', {
        api_token: getApp().globalData.api_token,
        status: self.data.status,
        page: self.data.page,
        size: self.data.size
      }).then(res => {
        if (res.data.status == 0) {
          self.setData({
            showLoading: false,
          })
          if (res.data.data.data.length == 0) {
            self.setData({
              page: self.data.page - 1,
              showNull: true
            })
            // console.log('下拉刷新的数据是空的');
          }
          newList = newList.concat(res.data.data.data);
          self.setData({
            list: newList
          })
          console.log(self.data.list);
          wx.hideLoading();

        }

      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})