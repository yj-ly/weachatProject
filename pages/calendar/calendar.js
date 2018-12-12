const getRequest = require('../../utils/getRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalDays:30,
    days:[],
    monList:[],
    startDay:[-1,-1,'1900-01-01'],
    endDay: [-1, -1, '1900-01-01'],
    showBc:false,
    haveOpt:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarTitle({
      title: '日期选择'
    })
    wx.showLoading({
      title: '日历加载中...',
      mask: true
    })
    if (getApp().globalData.loginInfo == null) {
      getRequest.getLogin(getApp().globalData.loginInfo).then(res => {
        self.nextRun()
      })
    } else {
      if (options.startTime != '' && options.startTime != undefined && options.startTime != null) {
        self.setData({
          haveOpt: true
        })
        self.nextRun(options.startTime, options.endTime)
      } else {
        self.nextRun()
      }
    }
  },

  nextRun: function (startTime, endTime) {
    let self = this
    let contentList = []
    for (let i = 0; i < self.data.totalDays; i++) {
      let date = new Date()
      let now = date.getTime() //当前时间的时间戳
      let nextDay = now + (i * 86400000) //当前时间后一天的时间
      let newDate = new Date(nextDay)
      let tomYear = newDate.getFullYear() //明天的年份
      let tomMon = newDate.getMonth() + 1 //明天的月份数
      let tomDate = newDate.getDate() //明天的日期
      let tomDate2 = newDate.getDate()
      if (tomMon < 10) { //10月以前的月份前面加0
        tomMon = '0' + tomMon
      }
      if (tomDate < 10) { //10号以前的日期前面加0
        tomDate2 = '0' + tomDate2
      }
      let time = tomYear + '-' + tomMon + '-' + tomDate2
      if (contentList.length == 0) {
        let newDay = [{
          mon: tomYear + '年' + tomMon + '月',
          days: [{
            day: tomDate,
            trueDay: time,
            choose: false
          }]
        }]
        contentList = newDay
        let newMon = []
        newMon.push(tomYear + '年' + tomMon + '月')
        self.setData({
          monList: newMon
        })
      } else {
        if (self.data.monList.indexOf(tomYear + '年' + tomMon + '月') > -1) {
          contentList[self.data.monList.indexOf(tomYear + '年' + tomMon + '月')].days.push({
            day: tomDate,
            trueDay: time,
            choose: false
          })
        } else {
          let newMon = self.data.monList
          newMon.push(tomYear + '年' + tomMon + '月')
          self.setData({
            monList: newMon
          })
          let newDay = [{
            mon: tomYear + '年' + tomMon + '月',
            days: [{
              day: tomDate,
              trueDay: time,
              choose: false
            }]
          }]
          contentList.push({
            mon: tomYear + '年' + tomMon + '月',
            days: [{
              day: tomDate,
              trueDay: time,
              choose: false
            }]
          })
        }
      }
    }
    self.setData({
      days: contentList
    })
    let newArr = self.data.days
    for (let i = 0; i < self.data.days.length; i++) {
      let startWeek = new Date(self.data.days[i].days[0].trueDay).getDay()
      let endWeek = new Date(self.data.days[i].days[self.data.days[i].days.length - 1].trueDay).getDay()
      if (startWeek != 0) {
        let num = startWeek
        for (let n = 0; n < num; n++) {
          newArr[i].days.unshift({
            day: '',
            trueDay: '',
            choose: false
          })
        }
      }
      if (endWeek != 6) {
        let num = 6 - endWeek
        for (let n = 0; n < num; n++) {
          newArr[i].days.push({
            day: '',
            trueDay: '',
            choose: false
          })
        }
      }
    }
    self.setData({
      days: newArr
    })
    if (startTime != undefined && endTime != undefined) {
      let resetStartTime = startTime.substring(0, 4) + '年' + startTime.substring(5, 7) + '月'
      let resetEndTime = endTime.substring(0, 4) + '年' + endTime.substring(5, 7) + '月'
      for (let i = 0; i < newArr.length; i++){
        if (resetStartTime == newArr[i].mon){
          for (let x = 0; x < newArr[i].days.length; x++){
            if (parseInt(startTime.substring(8, 10)) == newArr[i].days[x].day){
              let startDay = [i, x, newArr[i].days[x].trueDay]
              self.setData({
                startDay: startDay
              })
            }
          }
        }
      }
      self.chooseDays(self.data.startDay[0], self.data.startDay[1], self.data.startDay[2])
      for (let i = 0; i < newArr.length; i++) {
        if (resetEndTime == newArr[i].mon) {
          for (let x = 0; x < newArr[i].days.length; x++) {
            if (parseInt(endTime.substring(8, 10)) == newArr[i].days[x].day) {
              let endDay = [i, x, newArr[i].days[x].trueDay]
              self.setData({
                endDay: endDay
              })
            }
          }
        }
      }
      self.chooseDays(self.data.endDay[0], self.data.endDay[1], self.data.endDay[2])
      self.setData({
        showBc: false,
      })
      wx.hideLoading()
    } else {
      wx.hideLoading()
    }
  },

  //点击日期
  dayClick: function (e) {
    let self = this
    if (self.data.haveOpt) {
      self.resetChooseList()
      self.setData({
        startDay: [-1, -1, '1900-01-01'],
        endDay: [-1, -1, '1900-01-01'],
        haveOpt: false
      })
    }
    let day = e.currentTarget.dataset.day
    let index = e.currentTarget.dataset.index //月的数组下标
    let ind = e.currentTarget.dataset.ind //日的数组下标
    self.chooseDays(index,ind,day)
  },

  //选择时间
  chooseDays: function (index,ind,day) {
    let self = this
    let newArr = self.data.days
    if (day.trueDay != '') { //不为占位符
      if (day.trueDay != self.data.startDay[2]) { //和之前的选择不是同一天
        if (index == self.data.startDay[0]) { //所在月份等于之前选择的月份
          if (ind > self.data.startDay[1]) { //所在日子大于之前选择的日子
            if (self.data.startDay[0] == -1) { //未选择入住时间
              newArr[index].days[ind].choose = true
              let startDay = [index, ind, newArr[index].days[ind].trueDay]
              self.setData({
                days: newArr,
                startDay: startDay
              })
            } else {
              self.resetChooseList()
              let endDay = [index, ind, newArr[index].days[ind].trueDay]
              for (let y = 0; y < newArr[self.data.startDay[0]].days.length; y++) {
                if (y >= self.data.startDay[1] && y <= endDay[1]) {
                  if (newArr[self.data.startDay[0]].days[y].day != '') {
                    newArr[self.data.startDay[0]].days[y].choose = true
                  }
                }
              }
              self.setData({
                endDay: endDay,
                days: newArr,
                showBc: true
              })
              if (!self.data.haveOpt) {
                getApp().globalData.chooseStartTime = self.data.startDay[2]
                getApp().globalData.chooseEndTime = self.data.endDay[2]
                setTimeout(() => {
                  wx.navigateBack({
<<<<<<< HEAD
                    url: '../hotelDetail/hotelDetail'
                  })
                },1000)
=======
                    delta:1
                  })
                },300)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
              }
            }
          } else { //同月，但选择日期小于之前的选择
            self.resetChooseList()
            newArr[index].days[ind].choose = true
            let startDay = [index, ind, newArr[index].days[ind].trueDay]
            self.setData({
              days: newArr,
              startDay: startDay
            })
          }
        } else { //选择的月份不等于之前选择
          if (index < self.data.startDay[0]) {
            self.resetChooseList()
            newArr[index].days[ind].choose = true
            let startDay = [index, ind, newArr[index].days[ind].trueDay]
            self.setData({
              days: newArr,
              startDay: startDay
            })
          } else {
            if (self.data.startDay[0] == -1) { //没有选择过入住时间
              newArr[index].days[ind].choose = true
              let startDay = [index, ind, newArr[index].days[ind].trueDay]
              self.setData({
                days: newArr,
                startDay: startDay
              })
            } else { //选择过入住时间
              self.resetChooseList()
              let endDay = [index, ind, newArr[index].days[ind].trueDay]
              let s_mon = self.data.startDay[0] //入住日期所在的月份
              let e_mon = endDay[0] //离开日期所在的月份
              if (e_mon - s_mon == 1) { //入住月份和离店月份为临月
                for (let y = 0; y < newArr[s_mon].days.length; y++) {
                  if (y >= self.data.startDay[1]) {
                    if (newArr[s_mon].days[y].day != '') {
                      newArr[s_mon].days[y].choose = true
                    }
                  }
                }
                for (let y = 0; y < newArr[e_mon].days.length; y++) {
                  if (y <= endDay[1]) {
                    if (newArr[e_mon].days[y].day != '') {
                      newArr[e_mon].days[y].choose = true
                    }
                  }
                }
              } else {
                for (let y = 0; y < newArr[s_mon].days.length; y++) {
                  if (y >= self.data.startDay[1]) {
                    if (newArr[s_mon].days[y].day != '') {
                      newArr[s_mon].days[y].choose = true
                    }
                  }
                }

                //将中间月全部选取
                for (let i = 1; i < e_mon - s_mon; i++) {
                  let index = s_mon + i //需要全部选取的月份
                  for (let y = 0; y < newArr[index].days.length; y++) {
                    if (newArr[index].days[y].day != '') {
                      newArr[index].days[y].choose = true
                    }
                  }
                }

                for (let y = 0; y < newArr[e_mon].days.length; y++) {
                  if (y <= endDay[1]) {
                    if (newArr[e_mon].days[y].day != '') {
                      newArr[e_mon].days[y].choose = true
                    }
                  }
                }
              }
              self.setData({
                endDay: endDay,
                days: newArr,
                showBc: true
              })
              if (!self.data.haveOpt) {
                getApp().globalData.chooseStartTime = self.data.startDay[2]
                getApp().globalData.chooseEndTime = self.data.endDay[2]
                setTimeout(() => {
                  wx.navigateBack({
<<<<<<< HEAD
                    url: '../hotelDetail/hotelDetail'
                  })
                }, 1000)
=======
                    delta: 1
                  })
                }, 300)
>>>>>>> 66651f8a6fab4fb8b88c5543761810d39b94b8a7
              }
            }
          }
        }
      }
    }
  },

  //重置日期列表的选择
  resetChooseList: function (){
    let self = this
    let newArr = self.data.days
    for(let i = 0;i < newArr.length; i++){
      for (let n = 0; n < newArr[i].days.length; n++){
        newArr[i].days[n].choose = false
      }
    }
    self.setData({
      days:newArr
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
})