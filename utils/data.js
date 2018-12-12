const conURL = 'https://hotel.zhudianfenshi.com/api/v1/'

const request = (path, data, callback) => {
  wx.request({
    conURL: conURL + path,
    data: data,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res);
    }
  });
};

//获取当前微信信息
const getUserInfo = (callback) => {
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    callback(userInfo);
  }
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            wx.setStorageSync('userInfo', res.userInfo);
            callback(res);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            // if (this.userInfoReadyCallback) {
            //     this.userInfoReadyCallback(res)
            // }
          }
        })
      }
    }
  })
};
//获取登录用户信息
const getLoginInfo = (callback) => {
  // let memberInfo = wx.getStorageSync('memberInfo');
  // if (memberInfo) {
  //     callback(memberInfo);
  // }

  // 登录
  wx.login({
    success: function (res) {
      if (res.code) {
        request(conURL + '/mini/login', { code: res.code }, res => {
          console.log(res)
          if (res.data.code === 0) {
            wx.setStorageSync('memberInfo', res.data.data);
            callback(res.data.data);
            console.log('memberInfo', res.data.data)
          }
          // console.log(res)

        });

      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
};
//获取会员信息
const getMemberInfo = (callback) => {
  let memberInfo = wx.getStorageSync('memberInfo');
  if (memberInfo) {
    callback(memberInfo);
  }

  // 登录
  wx.login({
    success: function (res) {
      if (res.code) {
        request('callback/weixin/mini/login', { code: res.code }, res => {
          if (res.data.code === 0) {
            wx.setStorageSync('LoginSessionKey', res.data.data.login.session_key);
            wx.setStorageSync('memberInfo', res.data.data);
            callback(res.data.data);
            console.log('memberInfo', res.data.data)
          }
          // console.log(res)

        });

      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
};

//服务器解密
const decryptData = (iv, encryptedData, callback) => {

  let sessionKey = wx.getStorageSync('LoginSessionKey');
  console.log('sessionKey', sessionKey);
  wx.request({
    conURL: conURL + 'callback/weixin/mini/decryp',
    data: {
      sessionKey: sessionKey,
      iv: iv,
      encryptedData: encryptedData
    },
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res);
    }
  });
};

module.exports = {
  conURL: conURL,
  request: request,
  decryptData: decryptData,
  getUserInfo: getUserInfo,
  getMemberInfo: getMemberInfo,
};
