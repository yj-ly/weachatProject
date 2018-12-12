var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    people_stus:1, //用户权限，1为房间预订人，享有所有权限，0为拜访人，没有换房和退房权限，无法查看入住和离开时间
    roomInfo:{},
    userName:'',
    list: [],
    chooseList:[false,false,false,false,false,true],
    showBox:false,
    remark:'',
    hotel_id:0,
    order_id:0,
    house_id:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
      order_id: options.order_id,
      hotel_id: options.hotel_id,
      house_id: options.house_id
    })
    wx.request({
      url: getApp().globalData.conURL + 'mini/order/house',
      data: {
        api_token: getApp().globalData.api_token,
        house_id: self.data.house_id,
        order_id: self.data.order_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          self.setData({
            roomInfo: {
              room_num: res.data.data.house_no,
              room_name: res.data.data.room_name,
              liveTime: res.data.data.live_time_str,
              consumption: res.data.data.consume_money,
              starTime: res.data.data.start_time.substring(5, 16),
              endTime: res.data.data.end_date.substring(5, 16),
            },
            userName: res.data.data.member_name
          })
        }
      }
    })
    self.searchList()
  },
  //获取列表
  searchList: function (e) {
    let self = this
    wx.request({
      url: getApp().globalData.conURL + 'mini/user/usercalllist',
      data: {
        api_token: getApp().globalData.api_token,
        hotel_id: self.data.hotel_id,
        house_id: self.data.house_id,
        order_id: self.data.order_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        if(res.data.code == 0){
          let arr = []
          for (let i = 0; i < res.data.data.data.length; i++) {
            let operation = ''
            //0:其他，1：换房，2：续房，3：退房，4：加床，5：清扫
            if (res.data.data.data[i].call_type == 0){
              operation = '其他'
            } else if (res.data.data.data[i].call_type == 1){
              operation = '换房'
            } else if (res.data.data.data[i].call_type == 2) {
              operation = '续房'
            } else if (res.data.data.data[i].call_type == 3) {
              operation = '退房'
            } else if (res.data.data.data[i].call_type == 4) {
              operation = '加床'
            } else if (res.data.data.data[i].call_type == 5) {
              operation = '清扫'
            }
            let newArr = {
              operation: operation,
              time: res.data.data.data[i].created_at.substring(5, res.data.data.data[i].created_at.length),
              note: res.data.data.data[i].remark == null ? '无' : res.data.data.data[i].remark,
              status: res.data.data.data[i].status == 0?'前台处理中':'处理完成',
            }
            arr.push(newArr)
          }
          self.setData({
            list:arr
          })
        }
      }
    })
  },
  //选择呼叫类型
  chooseRadios: function (e) {
    let self = this
    let index = e.currentTarget.id;
    let newArr = [false, false, false, false, false, false]
    newArr[index] = true
    this.setData({
      chooseList: newArr
    });
  },
  //显示/隐藏弹出层
  showB: function (e) {
    let slef = this
    if (slef.data.showBox){
      this.setData({
        showBox: false
      });
    }else{
      this.setData({
        showBox: true
      });
    }
  },
  //填写备注
  bindTextAreaBlur: function (e) {
    let self = this
    self.setData({
      remark:e.detail.value
    })
  },
  //呼叫前台点击确定
  userCall: function (e) {
    let self = this
    //0:其他，1：换房，2：续房，3：退房，4：加床，5：清扫
    let Btype = 0
    let index = 0
    for (let i = 0; i < self.data.chooseList.length; i++){
      if (self.data.chooseList[i]){
        index = i
      }
    }
    if (index == 0){
      Btype = 1
    } else if (index == 1) {
      Btype = 2
    } else if (index == 2) {
      Btype = 3
    } else if (index == 3) {
      Btype = 5
    } else if (index == 4) {
      Btype = 4
    } else if (index == 5) {
      Btype = 0
    }
    setTimeout(() => {
      wx.request({
        url: getApp().globalData.conURL + 'mini/user/usercall',
        data: {
          api_token: getApp().globalData.api_token,
          hotel_id: self.data.hotel_id,
          house_id: self.data.house_id,
          order_id: self.data.order_id,
          call_type: Btype,
          remark: self.data.remark
        },
        method: 'POST',
        header: {
          'api_token': getApp().globalData.api_token,
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showLoading({
              mask: true,
              title: '呼叫成功',
            })
            self.searchList()
            self.showB()
          }
        }
      })
    },100)
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
})