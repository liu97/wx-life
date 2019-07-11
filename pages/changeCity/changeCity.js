//index.js
//获取应用实例
import citys from '../../utils/city.js';
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js';
import create from '../../utils/create.js';
import store from '../../store/index.js'
const app = getApp()

create(store, {
  data: {
    searchCityResult: []
  },
  onLoad(){
    this.getBingImageUrl();
    this.getCurrentLocation();
  },
  bindSearchCity(text){
    if(!text){
      console.log('未传入城市名称');
      return;
    }
    let cityArr = citys.reduce((total, item, index, arr) => {
      let result = item.children.filter((value, index, arr) => {
        return value.name.indexOf(text) != -1;
      })
      total.push(...result);
      return total;
    }, []);

    this.setData({
      searchCityResult: cityArr,
    })
  },
  bindSelectCity(){
    
  }
 
})
