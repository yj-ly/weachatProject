const getRequest = require('../../utils/getRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel_name:'', //搜索酒店名
    hotel_name_show:'请输入酒店名称/关键字', //显示用的酒店名(搜索页面跳转来的酒店名)
    hotelList:[], //酒店列表
    hrBoolean:1, //排序方式选择
<<<<<<< HEAD
=======
    hrBoolean_child:0, //价格星级方式下级排序方式选择
    showPrice: false, //价格星级方式下级显示
    showPrice_text:'价格星级', //价格星级文字
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    page:0,
    pageSize:5,
    canDown: true, //是否可以下拉
    showLoading: false, //显示上拉加载中
    showNull: false, //显示上拉加载无数据
<<<<<<< HEAD
    logoShow:true, //第一次进入
=======
    logoShow: true, //第一次进入
    nowTime: '', //当前日期
    startTime: '', //入住时间
    stText: '', //入住时间显示
    endTime: '', //离开时间
    etText: '', //离开时间显示
    hrCss:'screen_hr_1', //排序方式的hr样式
    screen_icon:1, //显示方式选择，1：上下，2：左右
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  },
  /* 分享(暂不实现，路径目前有问题) */
  // onShareAppMessage: function (res) {
  //   return {
  //     title: '住店分时',
  //     path: 'page/hotelList/hotelList'
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        if (getApp().globalData.searchInputVale != '') {
          self.setData({
            page: 0,
            hotel_name: getApp().globalData.searchInputVale,
            hotel_name_show: getApp().globalData.searchInputVale,
            hotelList: []
          })
        } else {
          self.setData({
            page: 0,
            hotel_name: '',
            hotel_name_show: '请输入酒店名称/关键字',
            hotelList: []
          })
        }
        self.searchList(1)
      })
    }
  },

<<<<<<< HEAD
  //前往搜索页面
  toSearch: function(e){
    let self = this
    wx.navigateTo({
      url: '../search/search'
    })
  },

  //排序方式变化
  click_screen: function (e){
    let self = this
    if (e.target.id.substring(3, 4) == 1){
      this.setData({
        page:0,
        hrBoolean: 1,
        // hotelList:[]
      })
    } else {
      this.setData({
        page: 0,
        hrBoolean: 2,
        // hotelList:[]
      })
      console.log('进入离我最近')
      //判断是否授权获取地理位置
      wx.getSetting({
        success:(res) => {
<<<<<<< HEAD
          if (res.authSetting['scope.userLocation']) {
=======
=======
  //程序内的公共时间没有被设置，这里开始初始化
  aginLoad: function () {
    let self = this
    let date = new Date()
    let newYear = date.getFullYear()
    let oldMon = date.getMonth() + 1 //当前月份
    let newMon = date.getMonth() + 2 //离开范围最多一个月内，newMon为一月后的月份
    let newDay = date.getDate()
    if (newMon > 12) { //如果一个月的时间跨度超过12个月，则换算
      newMon = newMon - 12
      newYear = newYear + 1
    }
    if (oldMon < 10) { //10月以前的月份前面加0
      oldMon = '0' + oldMon
    }
    if (newMon < 10) { //10月以前的月份前面加0
      newMon = '0' + newMon
    }
    if (newDay < 10) { //10号以前的月份前面加0
      newDay = '0' + newDay
    }
    let time = newYear + '-' + oldMon + '-' + newDay //当前时间
    let now = date.getTime() //当前时间的时间戳
    let nextDay = now + 86400000 //当前时间后一天的时间
    let newDate = new Date(nextDay)
    let tomYear = newDate.getFullYear() //明天的年份
    let tomMon = newDate.getMonth() + 1 //明天的月份数
    let tomDate = newDate.getDate() //明天的日期
    if (tomMon < 10) { //10月以前的月份前面加0
      tomMon = '0' + tomMon
    }
    if (tomDate < 10) { //10号以前的月份前面加0
      tomDate = '0' + tomDate
    }
    let time2 = tomYear + '-' + tomMon + '-' + tomDate
    this.setData({
      nowTime: time, //当前时间
      startTime: time, //默认入住时间为当前时间，放入入住时间
      endTime: time2, //默认离开时间，放入离开时间
      stText: time.substring(5, 10), //当前时间的显示，只显示月份和日期
      etText: time2.substring(5, 10), //离开时间的显示，只显示月份和日期
    })
    getApp().globalData.starTime = time //把入住时间设置到公共参数
    getApp().globalData.endTime = time2 //把离开时间设置到公共参数
  },

  //排序方式变化
  click_screen: function (e) {
    let self = this
    if (e.target.id.substring(3, 4) == 1) {
      this.setData({
        page: 0,
        hrBoolean: 1,
        hotelList: [],
        hrCss: 'screen_hr_1',
        showPrice: false,
        showPrice_text: '价格星级'
      })
      self.searchList(1)
    } else if (e.target.id.substring(3, 4) == 2) {
      this.setData({
        page: 0,
        hrBoolean: 2,
        hotelList: [],
        hrCss: 'screen_hr_2',
        showPrice: false,
        showPrice_text: '价格星级'
      })
      //判断是否授权获取地理位置
      wx.getSetting({
        success: (res) => {
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
          if (!res.authSetting['scope.userLocation']) {
>>>>>>> 5a86af1827f6764d3201aea645b3ac7524bfa692
            wx.openSetting({
              success: (resS) => {
                var latitude, longitude
                /*获取用户当前经纬度*/
                wx.getLocation({
                  type: 'wgs84',
                  success: function (ress) {
                    latitude = ress.latitude
                    console.log(latitude)
                    longitude = ress.longitude
                    getRequest.getRequest('mini/weixin/location', {
                      api_token: getApp().globalData.api_token,
                      latitude: latitude,
                      longitude: longitude
                    })
                  },
                })
              }
            })
          }
        }
      })
<<<<<<< HEAD
    }
    self.searchList(1)
=======
      self.searchList(1)
    } else if (e.target.id.substring(3, 4) == 3) {
      this.setData({
        page: 0,
        hrCss: 'screen_hr_3',
        showPrice: true
      })
    } else if (e.target.id.substring(3, 4) == 4) {
      this.setData({
        page: 0,
        hrBoolean: 4,
        hotelList: [],
        hrCss: 'screen_hr_3',
        showPrice: false,
        showPrice_text: '价格从高到低'
      })
      self.searchList(1)
    } else if (e.target.id.substring(3, 4) == 5) {
      this.setData({
        page: 0,
        hrBoolean: 5,
        hotelList: [],
        hrCss: 'screen_hr_3',
        showPrice: false,
        showPrice_text: '价格从低到高'
      })
      self.searchList(1)
    } else if (e.target.id.substring(3, 4) == 6) {
      this.setData({
        page: 0,
        hrBoolean: 6,
        hotelList: [],
        hrCss: 'screen_hr_3',
        showPrice: false,
        showPrice_text: '星级从高到低'
      })
      self.searchList(1)
    } else if (e.target.id.substring(3, 4) == 7) {
      this.setData({
        page: 0,
        hrBoolean: 7,
        hotelList: [],
        hrCss: 'screen_hr_3',
        showPrice: false,
        showPrice_text: '星级从低到高'
      })
      self.searchList(1)
    }
  },

  //前往搜索页面
  toSearch: function(e){
    let self = this
    wx.navigateTo({
      url: '../search/search'
    })
  },

  //前往地区选择页面
  toRegion: function (e) {
    let self = this
    wx.navigateTo({
      url: '../region/region'
    })
  },

  //显示方式变化
  changeShow: function () {
    let self = this
    if (self.data.screen_icon == 1){
      self.setData({
        screen_icon:2
      })
    } else {
      self.setData({
        screen_icon: 1
      })
    }
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  },

  //input框变化调用方法
  inputChange: function (value) {
    let self = this
    this.setData({
      hotel_name: value.detail.value
    })
  },

  //查询酒店列表
  searchList: function (num){
    let self = this
    self.setData({
      showLoading: true,
      canDown: true,
    })
    let sort = 0
    //智能排序
    if (self.data.hrBoolean == 1) {
      sort = 0
    } else if (self.data.hrBoolean == 2) {
      sort = 1
<<<<<<< HEAD
=======
    } else if (self.data.hrBoolean == 4) {
      sort = 5
    } else if (self.data.hrBoolean == 5) {
      sort = 4
    } else if (self.data.hrBoolean == 6) {
      sort = 3
    } else if (self.data.hrBoolean == 7) {
      sort = 2
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    }
    getRequest.getRequest('mini/merchant/lists', {
      api_token: getApp().globalData.api_token,
      page: self.data.page,
      size: self.data.pageSize,
      key: self.data.hotel_name,
      sort: sort
    }).then(res => {
      let arr = []
      if (num != undefined) {
        if (num == 1) {
          arr = []
        } else {
          arr = self.data.hotelList
        }
      } else {
        arr = self.data.hotelList
      }
<<<<<<< HEAD
      console.log(res.data.data, '进入')
=======
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
      if (res.data.data.length > 0) {
        for (let i = 0; i < res.data.data.length; i++) {
          let newArr = {
            hotel_id: res.data.data[i].id,
            img: res.data.data[i].pic,
            hotel_name: res.data.data[i].name,
            price: res.data.data[i].lowest_price,
            tel: res.data.data[i].tel,
            addr: res.data.data[i].address,
          }
<<<<<<< HEAD
          if (res.data.data[i].distance != undefined && res.data.data[i].distance != null && res.data.data[i].distance != ''){
            if (res.data.data[i].distance > 0){
              newArr.distance = res.data.data[i].distance <= 1000 ? parseInt(res.data.data[i].distance) + 'm' : parseFloat(res.data.data[i].distance / 1000).toFixed(2) + 'km'
            }
          }
          arr.push(newArr)
        }
        // setTimeout(() => {
          self.setData({
            hotelList: arr,
            showLoading: false,
            showNull: false,
            logoShow: false
          })
          wx.hideToast()
          wx.hideLoading()
        // },3000)
=======
          let labels = []
          for (let x = 0; x < res.data.data[i].tags.length; x++){
            labels.push(res.data.data[i].tags[x].name)
          }
          newArr.label = labels
          if (res.data.data[i].distance != undefined && res.data.data[i].distance != null && res.data.data[i].distance != '') {
            if (res.data.data[i].distance > 0) {
              newArr.distance = res.data.data[i].distance <= 1000 ? parseInt(res.data.data[i].distance) + 'm' : parseFloat(res.data.data[i].distance / 1000).toFixed(2) + 'km'
            }
          }
          newArr.score = self.calculationScore(res.data.data[i].avg_score)
          arr.push(newArr)
        }
        self.setData({
          hotelList: arr,
          showLoading: false,
          showNull: false,
          logoShow: false
        })
        wx.hideToast()
        wx.hideLoading()
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      } else {
        self.setData({
          hotelList: arr,
          page: self.data.page - 1,
          canDown: false,
          showLoading: false,
          showNull: true
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideToast()
        wx.hideLoading()
      }
    })
  },
<<<<<<< HEAD
=======
  
  //计算评分
  calculationScore: function (num) {
    let self = this
    let newNum = parseInt(num/2) - 1
    return parseFloat(num/2).toFixed(1) + '分 ' + getApp().globalData.scores[newNum]
  },
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7

  //点击查询酒店详情
  toDetail: function (e) {
    wx.navigateTo({
      url: '../hotelDetail/hotelDetail?hotel_id=' + e.currentTarget.dataset.hotelid
    })
  },

  //重置搜索
  searchReset: function (e) {
    let self = this
    self.setData({
      page: 0,
      hotel_name: '',
      hotel_name_show: '请输入酒店名称/关键字',
      logoShow: true,
      hotelList: []
    })
    self.searchList(1)
  },

<<<<<<< HEAD
=======
  //打开日历控件
  toCalendar : function (e) {
    let self = this
    wx.navigateTo({
      url: '../calendar/calendar?startTime=' + self.data.startTime + '&endTime=' + self.data.endTime
    })
  },

>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this
    console.log('触发下拉刷新')
    wx.showNavigationBarLoading()
    self.setData({
      page: 0,
      canDown: true,
      logoShow: true,
      hotel_name: '',
      hotel_name_show: '请输入酒店名称/关键字',
    })
    self.searchList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this
    console.log('触发上拉加载')
    self.setData({
      page:self.data.page + 1,
      showLoading: true,
      showNull: false,
    })
    if (self.data.canDown) {
      self.searchList(2)
    }else {
      self.setData({
        showLoading: true,
        showNull: false,
      })
      setTimeout(() => {
        self.setData({
          showLoading: false,
          showNull: true
        })
      }, 1000)
      // self.setData({
      //   showNull: true,
      //   showLoading: false
      // })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
    if (getApp().globalData.loginInfo != null) {
      if (getApp().globalData.searchInputVale != '') {
        self.setData({
          page: 0,
          hotel_name: getApp().globalData.searchInputVale,
          hotel_name_show: getApp().globalData.searchInputVale,
        })
      } else {
        self.setData({
          page: 0,
          hotel_name: '',
          hotel_name_show: '请输入酒店名称/关键字',
        })
      }
      self.setData({
        page: 0,
      })
<<<<<<< HEAD
=======
      if (getApp().globalData.chooseStartTime != null && getApp().globalData.chooseStartTime != '') {
        this.setData({
          startTime: getApp().globalData.chooseStartTime,
          stText: getApp().globalData.chooseStartTime.substring(5, 10),
          endTime: getApp().globalData.chooseEndTime,
          etText: getApp().globalData.chooseEndTime.substring(5, 10)
        });
      }else{
        self.aginLoad()
      }
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
      self.searchList(1)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
})