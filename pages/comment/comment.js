const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelId:0,
    orderNo:0,
    hotel:{},
    stars: [true, true, true, true, true], //评分
    labels: [{
      id: 0,
      name: '服务态度很棒!',
      choose: false
    }, {
      id: 1,
      name: '干净卫生',
      choose: false
      }, {
        id: 2,
        name: '很有耐心速度很快',
        choose: false
    }, {
      id: 3,
      name: '交通便利',
      choose: false
    }], //标签
    textareaValue:'',
    count:9,
    photos:[], //相片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '评论',
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
      orderNo: options.orderNo,
      hotelId: options.hotelId
    })
    self.nextRun()
  },

  nextRun: function () {
    let self = this
    let newArr = {}
    getRequest.getRequest('mini/order/comment/order', {
      api_token: getApp().globalData.api_token,
      order_no: self.data.orderNo,
    }).then(res => {
      console.log()
      newArr = {
        hotel_id: res.data.data.merchant.id,
        img: res.data.data.merchant.pic,
        hotel_name: res.data.data.merchant.name,
        price: res.data.data.order.total_amount,
        tel: res.data.data.merchant.tel,
        no: res.data.data.order.no,
        collection: res.data.data.merchant.collects_count == 1 ? true : false
      }
      let labels = []
      for (let x = 0; x < res.data.data.merchant.tags.length; x++) {
        labels.push(res.data.data.merchant.tags[x].name)
      }
      newArr.label = labels
      self.setData({
        hotel: newArr
      })
    })
  },

  //收藏
  collection: function (e) {
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

  //评分点击
  starsClick: function (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let newArr = [false,false,false,false,false]
    for (let i = 0; i <= index; i++){
      newArr[i] = true
    }
    self.setData({
      stars: newArr
    })
  },

  //标签选择
  labelsClick: function (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let labels = self.data.labels
    labels[index].choose = !labels[index].choose
    self.setData({
      labels: labels
    })
  },

  //评论内容变化
  textUpState: function (e) {
    let self = this
    self.setData({
      textareaValue: e.detail.value
    })
  },

  //增加相片
  addPhoto: function (e) {
    let self = this
    wx.chooseImage({
      count: self.data.count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        if (self.data.photos.length == 0) {
          self.setData({
            count: self.data.count - tempFilePaths.length
          })
          let newArr = self.data.photos
          for (let i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: getApp().globalData.conURL + 'common/oss/put', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
              name: 'file',
              success: function (res) {
                newArr.push(JSON.parse(res.data).data.info.url)
                self.setData({
                  photos: newArr,
                })
              }
            })
          }
        } else {
          let newArr = self.data.photos
          for (let i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: getApp().globalData.conURL + 'common/oss/put', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
              name: 'file',
              success: function (res) {
                newArr.push(JSON.parse(res.data).data.info.url)
                self.setData({
                  photos: newArr,
                  count: self.data.count - 1
                })
              }
            })
          }
        }
      }
    })
  },

  //减少图片
  reducePhotos: function (e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let newArr = self.data.photos
    newArr.splice(index,1)
    self.setData({
      photos: newArr
    })
  },

  //提交评论
  submit: function (e) {
    let self = this
    //处理评分
    let stars = 5
    for (let i = 0; i < self.data.stars.length; i++){
      if (!self.data.stars[i]){
        stars = stars - 1
      }
    }
    //处理图片
    let phos = ''
    for (let i = 0; i < self.data.photos.length; i++) {
      if (i != self.data.photos.length - 1) {
        phos += self.data.photos[i] + '@'
      }else {
        phos += self.data.photos[i]
      }
    }
    getRequest.getRequest('mini/order/comment/create', {
      api_token: getApp().globalData.api_token,
      order_no: self.data.orderNo,
      score: stars,
      comments: self.data.textareaValue,
      pic: phos
    }).then(res => {
      if (res.data.status == 0){
        wx.redirectTo({
          url: '../comment_success/comment_success?orderNo=' + self.data.orderNo + '&hotelId=' + self.data.hotelId
        })
      }
    })
  },

  //预览图片
  watchPhoto: function (e) {
    let self = this
    let img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img] // 需要预览的图片http链接列表
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