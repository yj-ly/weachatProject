/* 封装的异步ajax请求 */
let getRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.conURL + url,
      data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res)
        if (res.data.status == 0) {
          resolve(res)
        } else if (res.data.status == -2) { //授权失败
          wx.showModal({
            title: '授权失败',
            showCancel: false,
            content: '即将返回首页重新登录',
            complete: function () {
              wx.reLaunch({
                url:'../index/index'
              })
            }
          })
        } else if (res.statusCode != 200) { //接口连接失败
          wx.showModal({
            title: '系统繁忙',
            showCancel: false,
            icon: 'none',
            content: '请稍后再试'
          })
        } else {
          wx.showModal({
            title: '错误',
            showCancel: false,
            icon: 'none',
            content: res.data.msg
          })
        }
      }
    })
  })
}

/* 公共的登陆请求 */
let getLogin = (loginInfo) => {
  if (loginInfo == null) {
    return new Promise((resolve, reject) => {
      wx.login({//login流程
        success: function (res) {//登录成功
          if (res.code) {
            var code = res.code;
            var latitude, longitude
            getRequest('mini/login', { code: code }).then(res => {
              getApp().globalData.loginInfo = res.data.data
              getApp().globalData.api_token = res.data.data.api_token
              resolve(res)
              /*获取用户当前经纬度*/
              wx.getLocation({
                type: 'wgs84',
                success: function (ress) {
                  latitude = ress.latitude
                  longitude = ress.longitude
                  getRequest('mini/weixin/location', {
                    api_token: getApp().globalData.api_token,
                    lat: latitude,
                    lng: longitude
                  }).then(ress => {
                  })
                },
              })
            })
          } else {
            reject()
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    })
  }
}

/* 更新模板需要的form_id */
let getFormId = (form_id,clickType) => {
  return new Promise((resolve, reject) => {
    getRequest('mini/weixin/formid',{
      api_token: getApp().globalData.api_token,
      type: clickType,
      form_id: form_id
    }).then(res => {
      if (res.data.status == 0) {
        resolve(res)
      }
    })
  })
}

module.exports = {
  getRequest: getRequest,
  getLogin: getLogin,
  getFormId: getFormId
}