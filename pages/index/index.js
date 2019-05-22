//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    swiperCount: 3, // 轮播图个数
    userInfo: {}, // 用户信息
    hasUserInfo: false, // 是否有用户信息
    bingImagesUrl: [], // Bing壁纸的URL
    location: {}, // 用户的位置信息
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getBingImageUrl();
    this.getLocation();
  },
  getUserInfo: function(e) { // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getBingImageUrl: function(){ // 获取Bing主页的壁纸URL
    let _ = this;
    wx.request({
      url: app.globalData.bing.imagesApi,
      data: {
        format: 'js',
        mkt: 'zh-CN',
        n: _.data.swiperCount,
      },
      success(res){
        if(res.data && res.data.images.length){
          let images = res.data.images;
          let bingImagesUrl = images.map((item) => {
            return `${app.globalData.bing.bingUrl}${item.url}`
          });

          _.setData({
            bingImagesUrl
          })
        }
      }
    })
  },
  getLocation: function(){ // 获取当前位置
    let _ = this;
    wx.getLocation({
      success: function(res) {
        app.globalData.location = res;
        _.getWeather();
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getWeather: function (){ // 获取天气
    let _ = this;
    let location = `${app.globalData.location.longitude},${app.globalData.location.latitude}` || '116.29845,39.95933'; // 默认搜狐媒体大厦
    wx.request({
      url: `${app.globalData.heWeather.heUrl}/s6/weather`,
      data: {
        location,
        key: app.globalData.heWeather.key,
      },
      success(res) {
        if (res.data.HeWeather6[0]){
          app.globalData.weatherData = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0];
          var weatherData = app.globalData.weatherData ? app.globalData.weatherData.now : "暂无该城市天气信息";
          var dress = app.globalData.weatherData ? res.data.HeWeather6[0].lifestyle[1] : { txt: "暂无该城市天气信息" };
          that.setData({
            weatherData: weatherData, //今天天气情况数组 
            dress: dress //生活指数
          });
        }
      }
    })
  }
})
