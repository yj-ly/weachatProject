const getRequest = require('../../utils/getRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotel_id:1,
    hotel_name:'',
    hotel_tel:'',
    hotel_addr:'',
    hotel_img:'',
<<<<<<< HEAD
    imgUrls:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
=======
    hotel_star:false,
    comments_count:0, //总评论数
    options:[],
    imgUrls:[],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiper_current:0,
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    func: [],
    nowTime:'', //当前日期
    startTime: '', //入住时间
    stText: '', //入住时间显示
    endTime: '', //离开时间
    etText: '', //离开时间显示
    startWeek: '', //入住时间星期
    endWeek: '', //离开时间星期
    toDays: 1, //共计N晚
<<<<<<< HEAD
    roomList:[],
=======
    roomList:[], //显示出来的房型列表
    roomList2:[], //隐藏起来的酒店列表
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    roomDetail: {},
    money:0,
    clickDetailed:false,
    rdClick:false,
    latitude:0,
    longitude:0,
    last_hotel: null,
<<<<<<< HEAD
=======
    showNum:5, //默认显示的房型数量
    showMoreBoo:false, //是否显示全部
    seeList:[], //查看过的头像列表
    commentList:[], //评论列表
    nearbyHotel:[], //附近的酒店
    comPage:0, //评论分页页码
    comSize:4, //评论分页长度
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
<<<<<<< HEAD
      last_hotel: getApp().globalData.last_hotel
=======
      last_hotel: getApp().globalData.last_hotel,
      options: options
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
<<<<<<< HEAD
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.nextRun(options)
        wx.hideLoading()
      })
    }else{
      self.nextRun(options)
      wx.hideLoading()
    }
=======
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  },

  nextRun: function (options) {
    let self = this
    self.aginLoad()
    let hi = options.hotel_id
    this.setData({
      hotel_id: hi
    })
<<<<<<< HEAD
=======

    //房型列表
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    getRequest.getRequest('mini/merchant/show', {
      api_token: getApp().globalData.api_token,
      id: self.data.hotel_id
    }).then(res => {
      wx.setNavigationBarTitle({
        title: res.data.data.name
      })
      let arr = []
<<<<<<< HEAD
=======
      let arr2 = []
      if (res.data.data.rooms.length <= self.data.showNum || res.data.data.rooms.length == 0){
        let showMoreBoo = true
        self.setData({
          showMoreBoo: showMoreBoo
        })
      }
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
      for (let i = 0; i < res.data.data.rooms.length; i++) {
        let con = ''
        if (res.data.data.rooms[i].specs != undefined && res.data.data.rooms[i].specs.length > 0) {
          for (let y = 0; y < res.data.data.rooms[i].specs.length; y++) {
            if (res.data.data.rooms[i].specs[y].content == null) {
              con += res.data.data.rooms[i].specs[y].name + '/'
            } else {
              con += res.data.data.rooms[i].specs[y].name
              con += '(' + res.data.data.rooms[i].specs[y].content + ')/'
            }
          }
        }
        con = con.substring(0, con.length - 1)
        let newArr = {
          id: res.data.data.rooms[i].id,
          name: res.data.data.rooms[i].name,
          content: con,
          num: res.data.data.rooms[i].valid_stock,
          price: parseFloat(res.data.data.rooms[i].member_price),
          strike_price: parseFloat(res.data.data.rooms[i].strike_price),
          roomDetail: res.data.data.rooms[i],
          moneyList: res.data.data.rooms[i].prices,
<<<<<<< HEAD
          is_sharetime: res.data.data.rooms[i].is_sharetime
        }
        arr.push(newArr)
=======
          is_sharetime: res.data.data.rooms[i].is_sharetime,
        }
        if (i < self.data.showNum) {
          arr.push(newArr)
        }else{
          arr2.push(newArr)
        }
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
      }
      let newFunc = []
      if (res.data.data.specs != undefined && res.data.data.specs.length > 0) {
        for (let x = 0; x < res.data.data.specs.length; x++) {
          newFunc.push(res.data.data.specs[x].name)
        }
      }
      if (res.data.data.atlas.length < 1) {
        self.setData({
          hotel_img: res.data.data.pic
        })
      }
<<<<<<< HEAD
      self.setData({
        roomList: arr,
        hotel_name: res.data.data.name,
        hotel_tel: res.data.data.tel,
        hotel_addr: res.data.data.address,
        imgUrls: res.data.data.atlas,
        func: newFunc,
        latitude: res.data.data.latitude,
        longitude: res.data.data.longitude
=======
      let is_collect = false
      if (res.data.data.collects_count == 0){
        is_collect = false
      } else {
        is_collect = true
      }
      self.setData({
        roomList: arr,
        roomList2: arr2,
        hotel_name: res.data.data.name,
        hotel_tel: res.data.data.tel,
        hotel_addr: res.data.data.address,
        hotel_score: self.calculationScore(res.data.data.avg_score),
        imgUrls: res.data.data.atlas,
        func: newFunc,
        latitude: res.data.data.latitude,
        longitude: res.data.data.longitude,
        hotel_star: is_collect,
        comments_count: res.data.data.comments_count
      })
    })

    //评论列表
    getRequest.getRequest('mini/order/comment/lists', {
      api_token: getApp().globalData.api_token,
      merchant_id: self.data.hotel_id,
      page: self.data.comPage,
      size: self.data.comSize
    }).then(res => {
      let commentArr = []
      for (let i = 0; i < res.data.data.length; i++) {
        let pic = []
        for (let x = 0; x < res.data.data[i].atlas.length; x++){
          pic.push({
            id: res.data.data[i].atlas[x].id,
            url: res.data.data[i].atlas[x].pic
          })
        }
        commentArr.push({
          id: res.data.data[i].id,
          img: res.data.data[i].member.weixins[0].headimgurl,
          name: res.data.data[i].member.name,
          havaThumbsUp: false,
          thumbsUpNum: res.data.data[i].agree_num,
          time: self.timeCalculator(res.data.data[i].updated_at),
          content: res.data.data[i].comments,
          imgs: pic
        })
      }
      self.setData({
        commentList: commentArr
      })
    })

    //附近的酒店
    getRequest.getRequest('mini/merchant/distancelist', {
      api_token: getApp().globalData.api_token,
      page:0,
      size:4,
      id:self.data.hotel_id
    }).then(res => {
      let nearbyHotelArr = []
      for (let h = 0; h < res.data.data.length; h++) {
        nearbyHotelArr.push({
          id: res.data.data[h].id,
          img: res.data.data[h].pic,
          name: res.data.data[h].name,
          score: self.calculationScore(res.data.data[h].avg_score),
          addr: res.data.data[h].address,
          price: res.data.data[h].lowest_price == null ? 0 : res.data.data[h].lowest_price,
        })
      }
      self.setData({
        nearbyHotel: nearbyHotelArr
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
      })
    })
  },

<<<<<<< HEAD
  //查看房间详情
  toRoomDetail: function (e) {
    let self = this
    console.log(e,123)
=======
  //计算评分
  calculationScore: function (num) {
    let self = this
    let newNum = parseInt(num / 2) - 1
    return parseFloat(num / 2).toFixed(1) + '分 ' + getApp().globalData.scores[newNum]
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
    let getDate = new Date(time.substring(0, 4), parseInt(time.substring(5, 7)) - 1,time.substring(8, 10),
      time.substring(11, 13), time.substring(14, 16), time.substring(17, 19)) //评论的时间
    let getTime = getDate.getTime() //评论的时间戳
    let comYear = getDate.getFullYear()
    let comMon = getDate.getMonth()
    let comDay = getDate.getDate()
    let getTime2 = new Date(comYear, comMon, comDay).getTime() //评论的日期时间戳
    //自然日分界
    let timeDifference = nowTime2 - getTime2
    if (timeDifference == 0){ //同一天的评论
      let timeDifference2 = nowTime - getTime
      if (timeDifference2 <= 3600000) { //时差小于一小时，显示为N分钟前
        return parseInt(timeDifference2 / 60000) + '分钟前'
      } else if (3600000 < timeDifference2 && timeDifference2 <= 86400000) {
        return parseInt(timeDifference2 / 3600000) + '小时前'
      }
    } else if (timeDifference == 86400000){
      return '昨天'
    } else if (timeDifference == 172800000){
      return '前天'
    } else if (timeDifference > 172800000){
      let mon = parseInt(comMon + 1) < 10 ? '0' + parseInt(comMon + 1) : parseInt(comMon + 1)
      let day = comDay < 10 ? '0' + comDay : comDay
      return comYear + '/' + mon + '/' + day
    }
  },

  //点赞
  zan: function (e) {
    let self = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let list = self.data.commentList
    list[index].havaThumbsUp = !list[index].havaThumbsUp
    wx.showLoading({
      title:'加载中...',
      mask:true
    })
    //点赞
    getRequest.getRequest('mini/order/comment/uplog', {
      api_token: getApp().globalData.api_token,
      comment_id: id
    }).then(res => {
      if (res.data.status == 0) {
        if (list[index].havaThumbsUp){
          list[index].thumbsUpNum = list[index].thumbsUpNum + 1
        } else {
          list[index].thumbsUpNum = list[index].thumbsUpNum - 1
        }

        self.setData({
          commentList:list
        })
      }
      wx.hideToast()
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
      id: self.data.hotel_id
    }).then(res => {
      if (res.data.status == 0){
        let hotel_star = !self.data.hotel_star
        self.setData({
          hotel_star: hotel_star
        })
      }
      wx.hideToast()
    })
  },

  //查看房间详情
  toRoomDetail: function (e) {
    let self = this
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
    let roomDetail = e.currentTarget.dataset.room
    let newArr = []
    for (let i = 0; i < roomDetail.specs.length; i++){
      newArr.push({
        key:roomDetail.specs[i].name,
        value: roomDetail.specs[i].content,
      })
    }
    
    let newArr2 = {
      imgUrls: roomDetail.atlas,
      name: roomDetail.name,
      specs: newArr,
      reserve_rule: roomDetail.reserve_rule, //退款详情
      cancel_rule: roomDetail.cancel_rule, //使用详情
      money: parseFloat(roomDetail.member_price).toFixed(2),
      index: e.currentTarget.dataset.ind,
      num: e.currentTarget.dataset.num
    }
    self.setData({
      roomDetail: newArr2,
      rdClick: true
    });
  },

  //更多酒店
  moreHotel: function(){
    let self = this
    wx.switchTab({
      url: '../hotelList/hotelList'
    })
  },

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
    self.dateCalculation()
  },

  //跳转至日历控件页面
  toCalendar: function () {
    let self = this
    wx.navigateTo({
      url: '../calendar/calendar?startTime=' + self.data.startTime + '&endTime=' + self.data.endTime
    })
  },

  //修改日期查询可定房型
  searchRoomList: function (e) {
    let self = this
    getRequest.getRequest('mini/merchant/rooms', {
      api_token: getApp().globalData.api_token,
      id: self.data.hotel_id,
      start_date: self.data.startTime,
      end_date: self.data.endTime
    }).then(res => {
      let arr = []
      for (let i = 0; i < res.data.data.length; i++) {
        let con = ''
        for (let y = 0; y < res.data.data[i].specs.length; y++) {
          con += res.data.data[i].specs[y].name + '/'
        }
        con = con.substring(0, con.length - 1)
        let newArr = {
          id: res.data.data[i].id,
          name: res.data.data[i].name,
          content: con,
          num: res.data.data[i].valid_stock,
          price: parseFloat(res.data.data[i].member_price),
          strike_price: parseFloat(res.data.data[i].strike_price),
          roomDetail: res.data.data[i],
          moneyList: res.data.data[i].prices,
          is_sharetime: res.data.data[i].is_sharetime
        }
        arr.push(newArr)
      }
      self.setData({
        roomList: arr
      })
    })
  },

  //根据开始/结束时间计算日期
  dateCalculation: function (e) {
    let self = this
    let weeks = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');  
    let nowStartTime = new Date(self.data.startTime).getTime() //开始时间的时间戳
    let nowEndTime = new Date(self.data.endTime).getTime() //结束时间的时间戳
    /* 计算选择的日期距离现在的时间，两天内显示为'今天'/'明天'，超过两天显示为星期几 */
    let nowTime = new Date().getTime() //当前时间的时间戳
    let startDays = parseFloat(parseFloat(nowStartTime - nowTime) / 86400000).toFixed(0) //入住时间相距天数
    let endDays = parseFloat(parseFloat(nowEndTime - nowTime) / 86400000).toFixed(0) //离开时间相距天数
    //入住时间判断
    if (startDays == 0){
      self.setData({
        startWeek:'今天'
      })
    } else if (startDays == 1) {
      self.setData({
        startWeek: '明天'
      })
    } else {
      self.setData({
        startWeek: weeks[new Date(self.data.startTime).getDay()]
      })
    }
    //离开时间判断
    if (endDays == 1) {
      self.setData({
        endWeek: '明天'
      })
    } else {
      self.setData({
        endWeek: weeks[new Date(self.data.endTime).getDay()]
      })
    }
  },

  //提交订单
  comfirmOrder: function (e) {
    let self = this
    wx.showLoading({
      title:'加载中...',
      mask:true
    })
    getRequest.getFormId(e.detail.formId, 0).then(res => {
      let newArr = {
        hotel_id: self.data.hotel_id,
        room_id: e.currentTarget.dataset.room.id,
        name: self.data.hotel_name,
        addr: self.data.hotel_addr,
        startTime: self.data.startTime,
        endTime: self.data.endTime,
        roomName: e.currentTarget.dataset.room.name,
        num: e.currentTarget.dataset.room.num,
        moneyList: e.currentTarget.dataset.room.moneyList,
        days: self.data.toDays,
        is_sharetime: e.currentTarget.dataset.room.is_sharetime
      }
      wx.navigateTo({
        url: '../pay/pay?orderInfo=' + JSON.stringify(newArr)
      })
    })
  },
  
  //房间详情提交订单
  toRoomDetail_comfirmOrder: function (e) {
    let self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let index = e.currentTarget.dataset.roomdetail.index
    let newArr = {
      hotel_id: self.data.hotel_id,
      room_id: self.data.roomList[index].id,
      name: self.data.hotel_name,
      addr: self.data.hotel_addr,
      startTime: self.data.startTime,
      endTime: self.data.endTime,
      roomName: self.data.roomList[index].name,
      num: self.data.roomList[index].num,
      moneyList: self.data.roomList[index].moneyList,
      days: self.data.toDays,
      is_sharetime: self.data.roomList[index].is_sharetime
    }
    wx.navigateTo({
      url: '../pay/pay?orderInfo=' + JSON.stringify(newArr)
    })
  }, 

  //拨打电话
  getTel(e) {
    let self = this
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  //隐藏遮挡层
  unshow: function (e) {
    let self = this
    this.setData({
      rdClick: false,
    });
  },

<<<<<<< HEAD
=======
  //swiper滑动
  changeCurrent: function (e) {
    let self = this
    self.setData({
      swiper_current:e.detail.current
    })
  },

>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  //打开地图
  openMap: function (e){
    let self = this
    var latitude = parseFloat(self.data.latitude)
    var longitude = parseFloat(self.data.longitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: self.data.hotel_name,
      scale: 28
    })
  },

<<<<<<< HEAD
=======
  //查看全部房型点击事件
  showMoreClick: function (e) {
    let self = this
    let newArr = []
    for (let i = 0; i < self.data.roomList.length; i++) {
      newArr.push(self.data.roomList[i])
    }
    for (let i = 0; i < self.data.roomList2.length; i++) {
      newArr.push(self.data.roomList2[i])
    }
    self.setData({
      roomList:newArr,
      showMoreBoo:true
    })
  },

  //前往评论中心
  toCommentCenter: function (e) {
    let self = this
    wx.navigateTo({
      url: '../comment_center/comment_center?hotelId=' + self.data.hotel_id
    })
  },

>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
    if (getApp().globalData.chooseStartTime != null && getApp().globalData.chooseStartTime != '') {
      console.log(getApp().globalData.chooseEndTime,'离店时间')
      this.setData({
        startTime: getApp().globalData.chooseStartTime,
        stText: getApp().globalData.chooseStartTime.substring(5,10),
        endTime: getApp().globalData.chooseEndTime,
        etText: getApp().globalData.chooseEndTime.substring(5, 10)
      });
      //计算相差天数
      let dateSpan, iDays;
      let sDate1 = Date.parse(self.data.startTime);
      let sDate2 = Date.parse(self.data.endTime);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      this.setData({
        toDays: iDays,
      });
      self.searchRoomList()
      self.dateCalculation()
    }
<<<<<<< HEAD
  },
=======

    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.nextRun(self.data.options)
        wx.hideLoading()
      })
    } else {
      self.nextRun(self.data.options)
      wx.hideLoading()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let self = this
  }
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
})