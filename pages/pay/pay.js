const data = require('../../utils/data.js');
let dateTimePicker = require('dateTimePicker.js');
const getRequest = require('../../utils/getRequest.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cantClick: false, //最高级遮挡层
    is_sharetime: 0, //是否为分时订单，0否1是
    hotel:{},
    room_id:0, //房型id
    people_name:'',
    people_tel:'',
    starDate:'', //年月日的开始时间
    maxDate:'', //年月日的最大时间
    starTime:'', //时分秒的开始时间
    maxTime: '23:59', //时分秒的最大时间
    arriveTime:'', //实际选择到店时间
    choosePay: [true,false], //选择的支付方式
    roomNumList:[], //可以选择的房间数
    moneyList:[], //日历价格列表
    totalMoney:0, //总价
    rdClick:false, //遮挡层
    totalNight:0, //共计N天
    integral: 0, //易用豆
    chooseNight: 1, //选择N间房
    chooseList:[], //选择的房间列表
    showDiscounts:false,  //是否显示优惠券
    discountsMoney:0,    //优惠券
    discountsCheck:true,    //是否勾选优惠券
    discountsId:'',      //红包id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // console.log(options)
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    wx.setNavigationBarTitle({
      title: '预定确认'
    })
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.nextRun(options)
        wx.hideLoading()
      })
    }else{
      self.nextRun(options)
      // console.log(options);
      wx.hideLoading()
    }
  },

  nextRun: function (options){
    let self = this
    let par = []
    if (options.orderInfo != undefined && options.orderInfo != null && options.orderInfo != '') {
      par = JSON.parse(options.orderInfo)
      // console.log(par,1)
      self.setData({
        is_sharetime: par.is_sharetime
      })
      let newArr = []
      if (par.num <= 10) {
        for (let i = 1; i <= par.num; i++) {
          newArr.push(i)
        }
      } else {
        for (let i = 1; i <= 10; i++) {
          newArr.push(i)
        }
      }
      let moneyArr = []
      if (par.moneyList.length > 0) {
        for (let m = 0; m < par.moneyList.length; m++) {
          moneyArr.push({
            date: par.moneyList[m].effected_at,
            price: par.moneyList[m].member_price
          })
        }
      }
      //更新会员资料
      getRequest.getRequest('mini/member/show', {
        api_token: getApp().globalData.api_token,
      }).then(res => {
        app.globalData.loginInfo.member = res.data.data
      })
      let newDetailList = []
      for (let d = 0; d < par.days; d++) {
        newDetailList.push({
          date: par.moneyList[d].effected_at,
          price: par.moneyList[d].member_price,
        })
      }
      if (app.globalData.loginInfo.member != null) {
        if (app.globalData.loginInfo.member.use_name != null && app.globalData.loginInfo.member.use_name != undefined) {
          self.setData({
            people_name: app.globalData.loginInfo.member.use_name,
          })
        }
        if (app.globalData.loginInfo.member.use_phone != null && app.globalData.loginInfo.member.use_phone != undefined) {
          self.setData({
            people_tel: app.globalData.loginInfo.member.use_phone,
          })
        }
        if (app.globalData.loginInfo.member.integral != null && app.globalData.loginInfo.member.integral != undefined) {
          self.setData({
            integral: app.globalData.loginInfo.member.integral,
          })
        }
      }
      self.setData({
        hotel: par,
        room_id: par.room_id,
        moneyList: moneyArr,
        roomNumList: newArr,
        totalNight: par.days,
        chooseList: newDetailList
      })
      self.valuation(self.data.totalNight)
    }

    //到店时间初始化
    let date = new Date()
    let newYear = date.getFullYear()
    let newMon = self.dateResult(date.getMonth() + 1) //当前月份
    let newDay = self.dateResult(date.getDate())
    let h = self.dateResult(date.getHours())
    let m = self.dateResult(date.getMinutes())
    this.setData({
      starDate: newYear + '-' + newMon + '-' + newDay,
      maxDate: self.data.hotel.starTime,
      starTime: h + ':' + m,
      arriveTime: '18:00'
    });
  },

  //计算房费
  valuation:function(night){
    let self = this
    let money = 0
    for(let i = 0; i < night; i++){
      money += parseFloat(self.data.moneyList[i].price)
    }
    let result = parseFloat(self.data.chooseNight * money).toFixed(2)
    self.setData({
      totalMoney: result
    })
  },

  //房间数量选择
  roomNumChange: function(e){
    let self = this
    this.setData({
      chooseNight: parseInt(e.detail.value) + 1
    })
    let newDetailList = []
    for (let d = 0; d < self.data.totalNight; d++) {
      newDetailList.push({
        date: self.data.moneyList[d].date,
        price: self.data.moneyList[d].price,
      })
    }
    this.setData({
      chooseList: newDetailList
    })
    self.valuation(self.data.totalNight)
  },

  //月份、日期、小时、分钟如果小于10则在前面加个0
  dateResult: function (num){
    if (num < 10) {
      return num = '0' + num
    }else{
      return num
    }
  },

  //预计到店时间
  bindTimeChange: function (e) {
    this.setData({
      arriveTime: e.detail.value,
    });
  },

  //姓名输入框
  nameBlur: function (e) {
    let self = this
    self.setData({
      people_name:e.detail.value
    })
  },

  //电话输入框
  telBlur: function (e) {
    let self = this
    self.setData({
      people_tel: e.detail.value
    })
  },
  //勾选红包 
  checkboxChange:function(){
    let self = this;
    let newArr = [];
    newArr = self.data.choosePay;
    if (self.data.discountsCheck){
      newArr[1] = false;
      self.setData({
        discountsCheck:false,
        choosePay: newArr
    })
    }else{
      self.setData({
        discountsCheck: true
      })
      if (self.data.integral > 0  ) {
        newArr[1] = false;
        self.setData({
          choosePay: newArr
        })

      }
    }
  },

  //支付方式选择
  payChoose: function (e) {
    let self = this
    let index = e.currentTarget.id.slice(1, e.currentTarget.id.length)
    let newArr = self.data.choosePay
    if (index == 0) {
      if (!newArr[0]) {
        newArr[0] = true
        newArr[1] = false
      }
    } else {
      if (!newArr[1]) {
        newArr[1] = true
        newArr[0] = false
      }
      this.setData({
        discountsCheck:false,
      });
    }
    this.setData({
      choosePay: newArr,
    });
  },

  //确认付款(封装数据)
  pay: function (e) {
    let self = this
    getRequest.getFormId(e.detail.formId, 1).then(res => {
      wx.showLoading({
        title:'加载中...',
        mask:true
      })
      self.setData({
        cantClick:true
      })
      let zz = false
      var tel = self.data.people_tel;
<<<<<<< HEAD
      if (tel.length != 11) {
        zz = false
      } else {
        zz = true
=======
      if (tel.length == 11 && tel.substring(0, 1) == '1') {
        zz = true
      } else {
        zz = false
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
      }

      if (self.data.people_name == '' || self.data.people_tel == '' || self.data.people_name == null || self.data.people_tel == null) {
        if (self.data.people_name == '' || self.data.people_name == null) {
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '请填写预订人姓名'
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请填写联系电话'
          })
        }
        wx.hideLoading()
        self.setData({
          cantClick: false
        })
      } else if (zz){
        let pay_type = 0; //0为微信支付，1为易用豆支付
      
        if (self.data.choosePay[0]) {
          pay_type = 0
        } else {
          pay_type = 1
        }

        let newArr = []
        for (let i = 0; i < self.data.chooseList.length; i++){
          newArr.push({
            date: self.data.chooseList[i].date,
            price: self.data.chooseList[i].price,
            num: self.data.chooseNight
          })
        }


        let newObjeckt = {
          api_token: getApp().globalData.api_token,
          room_id:self.data.room_id,
          use_name: self.data.people_name,
          use_phone: self.data.people_tel,
          latest_time: self.data.hotel.startTime + ' ' +self.data.arriveTime,
          user_note:'',
          pay_type: pay_type,
          arrival_date: self.data.hotel.startTime,
          departure_date: self.data.hotel.endTime,
          total_amount: self.data.totalMoney,
          quantity: self.data.chooseNight,
          prices: newArr,
        }
        if (self.data.discountsCheck && self.data.discountsMoney > 0){
          newObjeckt.coupon_id = self.data.discountsId;
          if (self.data.discountsMoney >= self.data.totalMoney ){
            newObjeckt.pay_amount = 0
          }else{
            newObjeckt.pay_amount = self.data.discountsMoney >= self.data.totalMoney;
          }
          
        }
        self.payFunc(newObjeckt)
      } else {
        self.setData({
          cantClick: false
        })
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '联系电话有误请重新输入'
        })
      }
    })
  },

  //支付
  payFunc(Objeck) {
    let self = this
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    //创建订单
    getRequest.getRequest('mini/order/room/create', Objeck).then(res => {
      //调用微信支付
<<<<<<< HEAD
        console.log(res);
        if(res.data.status == 0){
          if (res.data.data.pay_status == 0){
            setTimeout(() => {
              wx.navigateTo({
                url: '../orderDetail_dai/orderDetail_dai?orderId=' + res.data.data.id
=======
      getRequest.getRequest('mini/order/room/pay', {
        api_token: getApp().globalData.api_token,
        id: res.data.data.id,
      }).then(res2 => {
        if (self.data.choosePay[0]) { //微信支付
          wx.requestPayment({
            timeStamp: res2.data.data.timestamp,
            nonceStr: res2.data.data.nonceStr,
            package: res2.data.data.package,
            signType: res2.data.data.signType,
            paySign: res2.data.data.paySign,
            success: function (ress) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
<<<<<<< HEAD
                duration: 1500,
=======
                duration: 1000,
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
                mask: true
              });
              setTimeout(() => {
                wx.navigateTo({
                  url: '../orderDetail_dai/orderDetail_dai?orderId=' + res.data.data.id
>>>>>>> 5a86af1827f6764d3201aea645b3ac7524bfa692
                  + '&&hotelId=' + res.data.data.merchant_id
              })
            }, 1500)
          }else{
            getRequest.getRequest('mini/order/room/pay', {
              api_token: getApp().globalData.api_token,
              id: res.data.data.id,
            }).then(res2 => {
              if (self.data.choosePay[0]) { //微信支付
                console.log('微信支付');
                wx.requestPayment({
                  timeStamp: res2.data.data.timestamp,
                  nonceStr: res2.data.data.nonceStr,
                  package: res2.data.data.package,
                  signType: res2.data.data.signType,
                  paySign: res2.data.data.paySign,
                  success: function (ress) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1500,
                      mask: true
                    });
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '../orderDetail_dai/orderDetail_dai?orderId=' + res.data.data.id
                          + '&&hotelId=' + res.data.data.merchant_id
                      })
                    }, 1500)
                  },
                  'fail': function (ress) {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                      duration: 1500,
                      mask: true
                    });
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '../orderDetail_noPay/orderDetail_noPay?orderId=' + res.data.data.id
                          + '&&hotelId=' + res.data.data.merchant_id
                      })
                    }, 1500)
                  }
                })
<<<<<<< HEAD
              } else { //易用豆支付
                console.log('易用豆支付');
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1500,
                  mask: true
                });
                setTimeout(() => {
                  wx.navigateTo({
                    url: '../orderDetail_dai/orderDetail_dai?orderId=' + res.data.data.id
                      + '&&hotelId=' + res.data.data.merchant_id
                  })
                }, 1500)
              }
            })
          }
=======
<<<<<<< HEAD
              }, 1500)
=======
              }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
            },
            'fail': function (ress) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
<<<<<<< HEAD
                duration: 1500,
=======
                duration: 1000,
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
                mask: true
              });
              setTimeout(() => {
                wx.navigateTo({
                  url: '../orderDetail_noPay/orderDetail_noPay?orderId=' + res.data.data.id
                  + '&&hotelId=' + res.data.data.merchant_id
                })
<<<<<<< HEAD
              }, 1500)
=======
              }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
            }
          })
        } else { //易用豆支付
          wx.showToast({
            title: '支付成功',
            icon: 'success',
<<<<<<< HEAD
            duration: 1500,
=======
            duration: 1000,
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
            mask: true
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '../orderDetail_dai/orderDetail_dai?orderId=' + res.data.data.id
              + '&&hotelId=' + res.data.data.merchant_id
            })
<<<<<<< HEAD
          }, 1500)
=======
          }, 1000)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
>>>>>>> 5a86af1827f6764d3201aea645b3ac7524bfa692
        }

    })
  },
  
  //明细
  detailed: function (e) {
    let self = this
    if (self.data.rdClick) {
      this.setData({
        rdClick: false,
      });
    } else {
      this.setData({
        rdClick: true,
      });
    }
  },

  //隐藏明细
  unshow: function (e) {
    let self = this
    this.setData({
      rdClick: false,
    });
  },
  //处理浮点数相减问题
   accSub:function(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    }
    catch(e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    }
    catch(e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return((arg1 * m - arg2 * m) / m).toFixed(n);
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
    let self = this;
    console.log('页面加载');
    getRequest.getRequest('mini/order/room/getconpousfororder', {
      api_token: getApp().globalData.api_token,

    }).then( res => {
        if(res.data.status == 0){
          // console.log(res);
            self.setData({
              integral: res.data.data.integral
            })
            if(res.data.data.coupons.length >= 1){
              self.setData({
                discountsId: res.data.data.coupons[0].id,
                  discountsMoney: Number(res.data.data.coupons[0].money)
              })
              // console.log(self.data.discountsMoney);
              // console.log(self.data.totalMoney);
              // console.log(  self.data.totalMoney > self.data.discountsMoney  );
            }else{
              self.setData({
                discountsCheck: false
              })
            }
        }
    })
   
    
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