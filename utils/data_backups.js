const url = 'https://hotel.4255.cn/';

const request = (path, data, callback) => {
    wx.request({
        url: url + path,
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
                request('callback/weixin/mini/login', {code: res.code}, res => {
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
                request('callback/weixin/mini/login', {code: res.code}, res => {
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
        url: url + 'callback/weixin/mini/decryp',
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
//获取可预定酒店信息
// const getOrders = (callback) => {
//     wx.request({
//         url: url + 'hotel/order/lists',
//         data: {size: 10, page: 1, sort: "id", order: "asc"},
//         method: 'POST',
//         header: {
//             'content-type': 'application/json'
//         },
//         success: function (res) {
//             callback(res);
//         }
//     });
// };

//获取可预定酒店信息
// const getHousesForbook = (callback) => {
//     wx.request({
//         url: url + 'hotel/check/gethousesforbook',
//         data: {},
//         method: 'POST',
//         header: {
//             'content-type': 'application/json'
//         },
//         success: function (res) {
//             callback(res);
//         }
//     });
// };
//获取当前酒店信息
// const getHotelInfo = (hotel_id, callback) => {
//     wx.request({
//         url: url + '/api/hotel/hotel/show',
//         data: {hotel_id: hotel_id},
//         method: 'GET',
//         header: {
//             'content-type': 'application/json'
//         },
//         success: function (res) {
//             callback(res);
//         }
//     });
// };

//获取支付记录
// const miniPay = (payId, openId, callback) => {
//     wx.request({
//         url: url + 'callback/weixin/mini/pay',
//         data: {id: payId, open_id: openId},
//         method: 'POST',
//         header: {
//             'content-type': 'application/json'
//         },
//         success: function (res) {
//             callback(res);
//         }
//     });
// };

module.exports = {
    url: url,
    request: request,
    decryptData: decryptData,
    // getHotelInfo: getHotelInfo,
    getUserInfo: getUserInfo,
    // getOrders: getOrders,
    // getMemberInfo: getMemberInfo,
    // getHousesForbook: getHousesForbook,
    // miniPay: miniPay,
};
