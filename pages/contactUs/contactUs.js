Page({

  /**
   * 页面的初始数据
   */
  data: {
    QAList: [{
      question: '我的易用豆可以转给别人使用吗?',
      answer: '易用豆不可转让，仅限本人使用',
    }, {
      question: '我可以用自己的账号为他人预订吗?',
      answer: '可以'
    }, {
      question: '订单提交后需要多久时间确认?可以取消吗?取消的话扣费吗?',
      answer: '在您提交订单后,公众号推出模板消息回复,如遇特殊情况会延时,30分钟内未收到消息,请致电客服,入住时间之前取消的话,不扣费。'
    }, {
      question: '预定酒店可以增加房间或续住吗?中途想换房间怎么办?',
      answer: '不能,只有重新下单,具体费用请和酒店协商。'
    }, {
      question: '网上的价格比实际到店办理入住的价格便宜吗?',
      answer: '是的。'
    }, {
      question: '评价订单后有没易用豆奖励?',
      answer: '订单在消费3天内评价可获得积分。有效评价规则：30字以上+2张图片,可获2个易用豆。若匿名评价,则没有易用豆。'
    }, {
      question: '怎样开发票?',
      answer: '如需开具发票,请入住完酒店之后联系酒店客服,提供订单号,购买方名称,发票金额。'
    }],
    choose: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '在线客服'
    })
  },

  clickQA: function (e) {
    let self = this
    let chooseIndex = e.currentTarget.dataset.index
    if (chooseIndex == self.data.choose) {
      self.setData({
        choose: -1
      })
    } else {
      self.setData({
        choose: chooseIndex
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