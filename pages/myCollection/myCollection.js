const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelList:[],
    showDelete:false, //是否点击取消收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    if (getApp().globalData.loginInfo == null) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        wx.hideLoading()
      })
    }
    self.nextRun()
  },

  nextRun: function (e) {
    let self = this
    getRequest.getRequest('mini/member/collect/lists', {
      api_token: getApp().globalData.api_token
    }).then(res => {
      let newArr = []
      for (let i = 0; i < res.data.data.length; i++) {
        let mer = res.data.data[i].merchant
        let labels = []
        for (let x = 0; x < mer.tags.length; x++) {
          labels.push(mer.tags[x].name)
        }
        newArr.push({
          hotel_id: res.data.data[i].id,
          img: mer.pic,
          hotel_name: mer.name,
          price: parseFloat(mer.lowest_price).toFixed(2),
          tel: mer.tel,
          addr: mer.address,
          score: self.calculationScore(mer.avg_score),
          label: labels
        })
      }
      self.setData({
        hotelList: newArr
      })
    })
  },

  //计算评分
  calculationScore: function (num) {
    let self = this
    let newNum = parseInt(num / 2) - 1
    return parseFloat(num / 2).toFixed(1) + '分 ' + getApp().globalData.scores[newNum]
  },

  //点击查询酒店详情
  toDetail: function (e) {
    wx.navigateTo({
      url: '../hotelDetail/hotelDetail?hotel_id=' + e.currentTarget.dataset.hotelid
    })
  },

  //点击删除
  deleteClick: function (e) {
    let self = this
    self.setData({
      showDelete:true
    })
  },

  //取消按钮点击或者点击遮挡层
  noShowDelete: function (e) {
    let self = this
    self.setData({
      showDelete: false
    })
  },

  //确认删除
  deleteC: function (e) {
    let self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //收藏
    getRequest.getRequest('mini/member/collect/save', {
      api_token: getApp().globalData.api_token,
      id: self.data.hotelId
    }).then(res => {
      if (res.data.status == 0) {
        let hotel = self.data.hotel
        hotel.collection = !hotel.collection
        self.setData({
          hotel: hotel
        })
      }
      wx.hideToast()
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
    // console.log(app.globalData.loginInfo.openid);
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

          },
          'fail': function (res) {

          },
          'complete': function (res) {

          }
        });
      }

    });

  }
})