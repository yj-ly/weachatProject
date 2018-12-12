// pages/orderList/orderList.js
const getRequest = require('../../utils/getRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], //全部
    orderList_1: [], //待确认
    orderList_2: [], //已确认
    orderList_3: [], //已取消
    page:0,
    pageSize:10,
    isDone:false,
    options: ['全部', '待确认', '已确认', '已取消'],
    indicatorDots:false, //swiper是否显示指示点
    autoplay: false, //是否自动切换
    duration: 500, //滑动动画时长
    current:0, //当前滑块的index
    showLoading:false,
    showNull:false,
    animationData:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '订单'
    })
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.searchList(1)
      })
    } 
  },

  //选项卡选择
  optionClick: function (e){
    let self = this
    let index = e.currentTarget.dataset.optindex
    if (index != self.data.current) {
<<<<<<< HEAD
      // wx.showLoading({
      //   title: '加载中',
      //   mask: true,
      // })
      // setTimeout(() => {
        // wx.hideLoading()
      self.setData({
        current: index
      })
      // }, 500)
=======
      self.setData({
        current: index
      })
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    }

    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'linear',
    })

    if (index == 0) {
      animation.left('66rpx').width('60rpx').step()
    } else if (index == 1) {
      animation.left('235rpx').width('94rpx').step()
    } else if (index == 2) {
      animation.left('423rpx').width('94rpx').step()
    } else if (index == 3) {
      animation.left('611rpx').width('94rpx').step()
    }

    this.setData({
      animationData: animation.export()
    })
  },

  //查询订单
  searchList: function (num) {
    let self = this
    getRequest.getRequest('mini/order/room/lists', {
      api_token: getApp().globalData.api_token,
      page: self.data.page,
      size: self.data.pageSize,
    }).then(res => {
      let arr = []
      let arr1 = []
      let arr2 = []
      let arr3 = []
      if (num != undefined){
        if (num == 1) { //下拉刷新
          let arr = []
          let arr1 = []
          let arr2 = []
          let arr3 = []
          console.log('下拉刷新');
        } else {
          console.log('上拉加载');
          let arr = self.data.orderList
          let arr1 = self.data.orderList_1
          let arr2 = self.data.orderList_2
          let arr3 = self.data.orderList_3
        }
      } else {
        console.log('进入else');
        let arr = self.data.orderList
        let arr1 = self.data.orderList_1
        let arr2 = self.data.orderList_2
        let arr3 = self.data.orderList_3
      }
      if (res.data.data.length > 0) {
        if(num != 1){
          let arr = self.data.orderList
          let arr1 = self.data.orderList_1
          let arr2 = self.data.orderList_2
          let arr3 = self.data.orderList_3
        }
        for (let i = 0; i < res.data.data.length; i++) {
          let orderType = 0
          let order_type = ''
          let resData = res.data.data[i]
          /* order_status：0=已完成，1=已确认，2=入住中，3=已取消，6=平台拒绝 ，9=待确认 */
          /* pay_status：0=成功 1=失败 2=支付中 3=部分退款 4=全部退款 9=待支付' */
          if (resData.order_status == 9 || resData.order_status == 4) {
            orderType = 0
          } else if (resData.order_status == 0 || resData.order_status == 1 || resData.order_status == 2) {
            orderType = 1
          } else if (resData.order_status == 3 || resData.order_status == 6) {
            orderType = 2
          }
          let newArr = {
            orderId: res.data.data[i].id,
            hotelId: res.data.data[i].merchant.id,
            img: res.data.data[i].merchant.pic,
            name: res.data.data[i].merchant.name,
            price: res.data.data[i].pay_amount,
            addr: res.data.data[i].merchant.address,
            orderNo: res.data.data[i].no,
            startTime: res.data.data[i].arrival_date.replace('-', '.').replace('-', '.'),
            endTime: res.data.data[i].departure_date.replace('-', '.').replace('-', '.'),
            num: res.data.data[i].quantity,
            night: res.data.data[i].night,
            orderType: orderType,
            createTime: res.data.data[i].created_at.substring(0, 10),
            order_status: resData.order_status,
<<<<<<< HEAD
            pay_status: res.data.data[i].pay_status
=======
            pay_status: res.data.data[i].pay_status,
            is_commented: res.data.data[i].is_commented
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
          }
          arr.push(newArr) //将当前订单放入“orderList”数组
          // arr = arr.concat(newArr);
          if (orderType == 0) {//将当前“待确认”订单放入“orderList_1”数组
            arr1.push(newArr)
          } else if (orderType == 1) {//将当前“已确认”订单放入“orderList_2”数组
            arr2.push(newArr)
          } else if (orderType == 2) {//将当前“已取消”订单放入“orderList_3”数组
            arr3.push(newArr)
          }
        }
        self.setData({
          orderList: arr,
          orderList_1: arr1,
          orderList_2: arr2,
          orderList_3: arr3,
          isDone: true
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      } else {
        self.setData({
          isDone: false,
          showLoading: false,
          showNull: true
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  //订单点击事件
  clickOrder: function (e){
    let self = this
    let pay_status = e.currentTarget.dataset.pay_status
    let orderType = e.currentTarget.dataset.type
    let orderStatus = e.currentTarget.dataset.order_status
    let orderId = e.currentTarget.dataset.orderid
    let hotelId = e.currentTarget.dataset.hotelid
<<<<<<< HEAD
    // console.log(orderType)
    // console.log(orderStatus)
=======
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    /* orderType: 0=待确认 1=已确认 2=已取消 */
    /* order_status：0=已完成，1=已确认，2=入住中，3=已取消，9=待确认 */
    /* pay_status：0=成功 1=失败 2=支付中 3=部分退款 4=全部退款 9=待支付' */

    if (orderType == 0) { //待确认分类
      if (pay_status == 0) {
        wx.navigateTo({ //带商户确认订单
          url: '../orderDetail_dai/orderDetail_dai?orderId=' + orderId + '&&hotelId=' + hotelId
        })
      } else {
        wx.navigateTo({ //带支付订单
          url: '../orderDetail_noPay/orderDetail_noPay?orderId=' + orderId + '&&hotelId=' + hotelId
        })
      }
    } else if (orderType == 1){ //已确认分类
      if (orderStatus == 0) { //已完成订单
        wx.navigateTo({
          url: '../orderDetail_done/orderDetail_done?orderId=' + orderId + '&&hotelId=' + hotelId
        })
      } else if (orderStatus == 1) { //待住中订单
        wx.navigateTo({
          url: '../orderDetail_noLive/orderDetail_noLive?orderId=' + orderId + '&&hotelId=' + hotelId
        })
      } else if (orderStatus == 2) { //入住中订单
        wx.navigateTo({
          url: '../orderDetail_inLive/orderDetail_inLive?orderId=' + orderId + '&&hotelId=' + hotelId
        })
      }
    } else if (orderType == 2) { //已取消分类
      wx.navigateTo({
        url: '../orderDetail_cancel/orderDetail_cancel?orderId=' + orderId + '&&hotelId=' + hotelId
      })
    }
  },

<<<<<<< HEAD
=======
  //评论
  toEvaluate: function (e) {
    let self = this
    wx.navigateTo({
      url: '../comment/comment?orderNo=' + e.currentTarget.dataset.orderno + '&hotelId=' + e.currentTarget.dataset.hotelid
    })
  },

>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this
    self.setData({
      page: 0,
    })
    wx.showNavigationBarLoading()
    self.searchList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    if (self.data.isDone) {
      self.setData({
        page: self.data.page + 1,
        showLoading:true,
        showNull:false
      })
      self.searchList(2)
    } else {
      self.setData({
        showLoading: true,
        showNull: false,
      })
      setTimeout(() => {
        self.setData({
          showLoading: false,
          showNull: true
        })
      },1000)
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
    let self = this
    self.setData({
      // orderList: [],
      // orderList_1: [],
      // orderList_2: [],
      // orderList_3: [],
      page:0
    })
    if (getApp().globalData.loginInfo != null) {
      self.searchList(1)
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  initData: function () {
    let self = this;
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
      });
    } else {
      data.getMemberInfo(res => {
        this.setData({
          memberInfo: res,
        });
      })
    }
    // data.getUserInfo(res => {
    //     this.setData({
    //         userInfo: app.globalData.userInfo,
    //     });
    // });
    // data.getHousesForbook(function (res) {
    //     // console.log(res);
    // })
  }
  , bindPay: function () {
    console.log(app.globalData.loginInfo.openid);
    data.miniPay(38, app.globalData.loginInfo.openid, res => {
      if (res.data.code === 0) {
        let json = JSON.parse(res.data.data)
        wx.requestPayment({
          'timeStamp': json.timeStamp,
          'nonceStr': json.nonceStr,
          'package': json.package,
          'signType': json.signType,
          'paySign': json.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          },
          'complete': function (res) {
            console.log(res);
          }
        });
      }

    });

  }
})