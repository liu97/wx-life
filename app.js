//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    location: {
      longitude: 116.29845,
      latitude: 39.95933,
      city: '北京市',
      county: '海淀区',
    },
    bing: {
      bingUrl: 'https://cn.bing.com',
      imagesApi: 'https://cn.bing.com/HPImageArchive.aspx',
    },
    heWeather: {
      heUrl: 'https://free-api.heweather.net',
      key: '03274db03f884ebdaa539707688be2b1',
    },
    tencent: {
      tenUrl: 'https://apis.map.qq.com',
      key: 'YHNBZ-SI7K2-A4NUO-CKWVR-BHDNQ-4WFNY',
      secretKey: 'La0qYo8Uje8DH5GO50mV6Ke4h0mOf8BU', // WebServiceAPI 加密key
    }
  }
})