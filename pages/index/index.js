//index.js
//获取应用实例
import md5 from '../../utils/md5.js';
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js';
const app = getApp()

Page({
  data: {
    swiperCount: 3, // 轮播图个数
    userInfo: {}, // 用户信息
    hasUserInfo: false, // 是否有用户信息
    bingImagesUrl: [], // Bing壁纸的URL
    location: {}, // 位置信息
    weatherData: {}, // 天气数据
    dress: {}, // 穿衣指数
    air: {}, // 空气质量
  },
  //事件处理函数
  bindViewTap(){
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(){
    this.getBingImageUrl();
    this.getCurrentLocation();
  },
  getUserInfo(e) { // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getBingImageUrl(){ // 获取Bing主页的壁纸URL
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
  getCurrentLocation(){ // 获取当前位置
    let _ = this;
    wx.getLocation({
      async success(res) {
        let result = await _.getCity(res);
        if (result.data && result.data.status == 0) {
          app.globalData.location.latitude = res.latitude;
          app.globalData.location.longitude = res.longitude;
          app.globalData.location.city = result.data.result.address_component.city;
          app.globalData.location.county = result.data.result.address_component.district;
        }
        _.setData({
          location: { ...app.globalData.location },
        });
        _.getWeather();
      },
      fail(res) {},
      complete(res) {},
    })
  },
  getCity(location){ // 获取
    if(!location){
      console.error('未传入地址');
      return;
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.tencent.tenUrl}/ws/geocoder/v1/`,
        data: {
          key: app.globalData.tencent.key,
          location: `${location.latitude},${location.longitude}`,
        },
        success: result => {
          resolve(result);
        }
      })
    })
  },
  getWeather(){ // 获取天气信息
    let _ = this;
    let location = Object.keys(this.data.location).length ? this.data.location : app.globalData.location;

    wx.request({
      url: `${app.globalData.heWeather.heUrl}/s6/weather`,
      data: {
        location: `${location.longitude},${location.latitude}`,
        key: app.globalData.heWeather.key,
      },
      success(res) {
        let weatherData = null;
        let dress = null;
        if (res.data.HeWeather6[0]){
          weatherData = res.data.HeWeather6[0].status == "unknown city" ? "暂无该城市天气信息" : res.data.HeWeather6[0].now;
          dress = res.data.HeWeather6[0].status == "unknown city" ? { txt: "暂无该城市天气信息" } : res.data.HeWeather6[0].lifestyle[1];
        }
        _.setData({
          weatherData: weatherData, //今天天气情况数组 
          dress: dress //生活指数
        });
      }
    })
    wx.request({
      url: `${app.globalData.heWeather.heUrl}/s6/air/now`,
      data: {
        location: location.city,
        key: app.globalData.heWeather.key,
      },
      success(res) {
        let air = null;
        if (res.data.HeWeather6[0]) {
          air = res.data.HeWeather6[0].status == "unknown location" ? "暂无该城市天气信息" : res.data.HeWeather6[0].air_now_city;
        }
        _.setData({
          air,
        })
      }
    })
  },
  /**
    * @param {String}   path      请求路径，eg:/ws/geocoder/v1
    * @param {String}   key       密钥
    * @param {String}   location  经纬度，eg:28.7033487,115.8660847
    * @param {String}   secretKey 加密Key
   */
  getMd5Sig(path, key, location, secretKey){ // 腾讯地图计算签名
    if(!path || !key || !location || !secretKey){
      console.error('Incomplete parameters in getMd5Sig!');
      return;
    }else{
      return md5(`${path}?key=${key}&location=${location}${secretKey}`);
    }
  }
})
