const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelId: 0,
    score:{
      score:4.7,
      star:3
    },
    stars: [false, false, false, false, false], //评分
    commentList:[], //评论列表
    canMore:true,
    page: 0,
    size: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '全部评论'
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
    self.setData({
      hotelId: options.hotelId
    })
    self.nextRun()
  },

  nextRun: function(e){
    let self = this
    getRequest.getRequest('mini/merchant/show', {
      api_token: getApp().globalData.api_token,
      id: self.data.hotelId,
    }).then(res => {
      let score = {
        score: parseFloat(res.data.data.avg_score/2).toFixed(1),
        star: parseInt(res.data.data.avg_score/2)
      }
      self.setData({
        score: score
      })
      let starArr = [false, false, false, false, false]
      for (let i = 0; i < self.data.score.star; i++) {
        starArr[i] = true
      }
      self.setData({
        stars: starArr
      })
    })
    self.searchList()
  },

  //查询列表
  searchList: function (e) {
    let self = this
    getRequest.getRequest('mini/order/comment/lists', {
      api_token: getApp().globalData.api_token,
      merchant_id: self.data.hotelId,
      page: self.data.page,
      size: self.data.size
    }).then(res => {
      let commentArr = self.data.commentList
      if (res.data.data.length > 0) {
        for (let i = 0; i < res.data.data.length; i++) {
          let pic = []
          for (let x = 0; x < res.data.data[i].atlas.length; x++) {
            pic.push(res.data.data[i].atlas[x].pic)
          }
          let havaThumbsUp = false
          if (res.data.data[i].uplog[0] != undefined){
            if (res.data.data[i].uplog[0].status == 0){
              havaThumbsUp = true
            }
          }
          commentArr.push({
            id: res.data.data[i].id,
            img: res.data.data[i].member.weixins[0].headimgurl,
            name: res.data.data[i].member.name,
            havaThumbsUp: havaThumbsUp,
            thumbsUpNum: res.data.data[i].agree_num,
            time: self.timeCalculator(res.data.data[i].updated_at),
            content: res.data.data[i].comments,
            imgs: pic,
            comment: res.data.data[i].back.comments
          })
        }
        self.setData({
          commentList: commentArr,
          canMore:true
        })
      } else {
        self.setData({
          commentList: commentArr,
          canMore: false
        })
      }
    })
  },

  //查询更多
  more: function (e) {
    let self = this
    self.setData({
      page: self.data.page + 1
    })
    self.searchList()
  },

  //时间计算器(传入的时间距离现在多久)
  timeCalculator: function (time) {
    let self = this
    let now = new Date()
    let nowTime = now.getTime() //现在的时间戳
    let nowYear = now.getFullYear()
    let nowMon = now.getMonth()
    let nowDay = now.getDate()
    let nowTime2 = new Date(nowYear, nowMon, nowDay).getTime() //现在时间的日期时间戳
    let getDate = new Date(time.substring(0, 4), parseInt(time.substring(5, 7)) - 1, time.substring(8, 10),
      time.substring(11, 13), time.substring(14, 16), time.substring(17, 19)) //评论的时间
    let getTime = getDate.getTime() //评论的时间戳
    let comYear = getDate.getFullYear()
    let comMon = getDate.getMonth()
    let comDay = getDate.getDate()
    let getTime2 = new Date(comYear, comMon, comDay).getTime() //评论的日期时间戳
    //自然日分界
    let timeDifference = nowTime2 - getTime2
    if (timeDifference == 0) { //同一天的评论
      let timeDifference2 = nowTime - getTime
      if (timeDifference2 <= 3600000) { //时差小于一小时，显示为N分钟前
        return parseInt(timeDifference2 / 60000) + '分钟前'
      } else if (3600000 < timeDifference2 && timeDifference2 <= 86400000) {
        return parseInt(timeDifference2 / 3600000) + '小时前'
      }
    } else if (timeDifference == 86400000) {
      return '昨天'
    } else if (timeDifference == 172800000) {
      return '前天'
    } else if (timeDifference > 172800000) {
      let mon = parseInt(comMon + 1) < 10 ? '0' + parseInt(comMon + 1) : parseInt(comMon + 1)
      let day = comDay < 10 ? '0' + comDay : comDay
      return comYear + '/' + mon + '/' + day
    }
  },

  //点赞
  zan: function (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let list = self.data.commentList
    //不允许取消
    if (!list[index].havaThumbsUp) {
      wx.showLoading({
        title:'加载中...',
        mask: true
      })
      getRequest.getRequest('mini/order/comment/uplog', {
        api_token: getApp().globalData.api_token,
        comment_id: self.data.commentList[index].id,
      }).then(res => {
        list[index].havaThumbsUp = !list[index].havaThumbsUp
        list[index].thumbsUpNum = list[index].thumbsUpNum + 1
        self.setData({
          commentList: list
        })
        wx.hideToast()
      })
    }
  },

  //预览图片
  watchPhoto: function (e) {
    let self = this
    let img = e.currentTarget.dataset.img
    let imgList = e.currentTarget.dataset.imglist
    wx.previewImage({
      current: img,
      urls: imgList // 需要预览的图片http链接列表
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