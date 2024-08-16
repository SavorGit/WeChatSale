// pages/sell/stock/restock_wine.js
const utils = require('../../../utils/util.js');
/**
 * 申请补酒页面
 */

const app = getApp()
var uma = app.globalData.uma;
var api_v_url = app.globalData.api_v_url;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config_info:{wine_list:[],name_wine_list:[],wine_key:0,num_list:[],name_num_list:[],num_key:1,delivery_date:'',delivery_hour:''},
    wine_info:{name:'',id:0,num:'',},
    select_wine_list:[],
    pop_wind:{is_pop:false},
    addDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid   = app.globalData.openid;
    hotel_id = options.hotel_id;
    this.getWineConfig();
  },
  getWineConfig:function(){
    var that = this;
    var config_info = this.data.config_info;
    utils.PostRequest(api_v_url +'/restockWine/config',{
        openid   : openid, 
        hotel_id : hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
        var goods_list = data.result.goods_list;
        var goods_num  = data.result.goods_num;
        config_info.wine_list = goods_list
        config_info.num_list  = goods_num;
        config_info.delivery_date = data.result.delivery_date;
        config_info.delivery_hour = data.result.delivery_hour;
        for(let i in goods_list){
            config_info.name_wine_list.push(goods_list[i].name);
        }
        for(let i in goods_num){
            config_info.name_num_list.push(goods_num[i].name);
        }
        that.setData({config_info});
    })
  },
  popSelectWineWind:function(){
    var pop_wind = this.data.pop_wind;
    pop_wind.is_pop = true;
    this.setData({pop_wind:pop_wind});
  },
  selectInfo:function(e){
      console.log(e)
    var keys = e.detail.value;
    var type = e.currentTarget.dataset.type;
    var config_info = this.data.config_info;
    if(type=='wine'){
        config_info.wine_key = keys;
    }else if(type=='num'){
        config_info.num_key = keys;
    }else if(type=='date'){
        config_info.delivery_date = keys;
    }else if(type=='hour'){
        config_info.delivery_hour = keys;
    }
    console.log(config_info)
    this.setData({config_info:config_info});
  },
  confirmSelectWine:function(){
      var wine_info = this.data.wine_info;
      var config_info = this.data.config_info;
      if(config_info.wine_key==0){
        common.showToast('请选择您要补的酒水');
        return false;
      }
      if(config_info.num_key==0){
          common.showToast('请选择您要补酒水的瓶数');
          return false;
      }

      wine_info.name = config_info.wine_list[config_info.wine_key].name;
      wine_info.id   = config_info.wine_list[config_info.wine_key].value;
      wine_info.num  = config_info.num_list[config_info.num_key].value;

      var select_wine_list = this.data.select_wine_list;
      select_wine_list.push(wine_info);
      config_info.wine_key = 0;
      config_info.num_key  = 1;
      this.setData({select_wine_list:select_wine_list,
                    pop_wind:{is_pop:false},
                    wine_info:{name:'',id:0,num:''},
                    config_info:config_info
                })
  },
  submitApply:function(){
    var that = this;
    var select_wine_list = this.data.select_wine_list;
    if(select_wine_list.length==0){
        app.showToast('请选择您要补的酒水');
        return false;
    }
    
    var config_info = this.data.config_info;
    var delivery_time = config_info.delivery_date + ' ' + config_info.delivery_hour;
    console.log(select_wine_list)
    var goods_data = JSON.stringify(select_wine_list);
    wx.showModal({
      title: '提示',
      content: '确认要提交申请？',
      complete: (res) => {
        if (res.confirm) {
            that.setData({
                addDisabled: true
            })
            utils.PostRequest(api_v_url +'/restockWine/addwine',{
                delivery_time : delivery_time,
                goods_data    : goods_data,
                openid        : openid, 
            }, (data, headers, cookies, errMsg, statusCode) => {
                common.showToast('申请成功',2000,'success');
                setTimeout(() => {
                    wx.navigateBack({
                        delta:1
                    })
                }, 2000);
            },res=>{
                that.setData({addDisabled: false})
            })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onOpenWindow(e) {// 打开窗口
      let self = this;
      let windowType = e.currentTarget.dataset.window_type;
      let windowId = e.currentTarget.dataset.window_id;
      if ('pop' === windowType) {// 弹窗
          switch (windowId) {
              case 'WindowSelectWine':// 选择酒水弹窗
                  self.setData({ pop_wind: { is_pop: true } });
                  break;
          }
      } else {// 普通窗口
          console.log('/pages/sell/stock/restock_wine.js', 'onOpenWindow', windowType, windowId);
      }
  },
  onCloseWindow(e) {// 关闭窗口
      let self = this;
      let windowType = e.currentTarget.dataset.window_type;
      let windowId = e.currentTarget.dataset.window_id;
      var config_info = this.data.config_info;

      if ('pop' === windowType) {// 弹窗
          switch (windowId) {
              case 'WindowSelectWine':// 选择酒水弹窗
                    config_info.wine_key = 0;
                    config_info.num_key  = 1;
                    self.setData({ 
                      pop_wind: { is_pop: false }, 
                      wine_info:{name:'',id:0,num:''},
                      config_info:config_info
                    });
                  break;
          }
      } else {// 普通窗口
          console.log('/pages/sell/stock/restock_wine.js', 'onCloseWindow', windowType, windowId);
      }
  }
})