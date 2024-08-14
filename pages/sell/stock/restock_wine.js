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
    wine_list:[],
    wine_info:{name:'',id:0,num:''},
    select_wine_list:[],
    pop_wind:{is_pop:false}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid   = app.globalData.openid;
    hotel_id = options.hotel_id;
    this.getWineList();
  },
  getWineList:function(){
    var that = this;
    utils.PostRequest(api_v_url +'/aa/bb',{
        openid   : openid, 
        hotel_id : hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  popSelectWineWind:function(){
    var pop_wind = this.data.pop_wind;
    pop_wind.is_pop = true;
    this.setData({pop_wind:pop_wind});
  },
  selectInfo:function(e){
    var keys = e.detail.value();
    var wine_list = this.data.wine_list;
    var wine_info = this.data.wine_info;
 
    wine_info.name = wine_list[keys].name;
    wine_info.id   = wine_list[keys].id;
    this.setData({wine_info:wine_info});
  },
  inputWineNum:function(e){
    var that = this;
    var num = e.detail.value;
    var wine_info = this.data.wine_info;
    wine_info.num = num;
    this.setData({wine_info:wine_info});
  },
  closePopWind:function(){
    var pop_wind = this.data.pop_wind;
    pop_wind.is_pop = false;

    this.setData({pop_wind:pop_wind,wine_info:{name:'',id:0,num:''}});
  },
  confirmSelectWine:function(){
      var wine_info = this.data.wine_info;
      if(wine_info.num=='' || wine_info.num==0){
          app.showToast('请输入补酒数量');
          return false;
      }
      var wine_list = this.data.wine_list;
      wine_list.push(wine_info);
      this.setData({wine_list:wine_list,wine_info:{name:'',id:0,num:''}})
  },
  submitApply:function(){
    var wine_list = this.data.wine_list;
    if(wine_list.length==0){
        app.showToast('请选择您要补的酒水');
        return false;
    }
    utils.PostRequest(api_v_url +'/aa/bb',{
        openid   : openid, 
        hotel_id : hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

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
          console.log('pages/hotel/wine/addstock.js', 'onOpenWindow', windowType, windowId);
      }
  },
  onCloseWindow(e) {// 关闭窗口
      let self = this;
      let windowType = e.currentTarget.dataset.window_type;
      let windowId = e.currentTarget.dataset.window_id;
      if ('pop' === windowType) {// 弹窗
          switch (windowId) {
              case 'WindowSelectWine':// 选择酒水弹窗
                  self.setData({ pop_wind: { is_pop: false } });
                  break;
          }
      } else {// 普通窗口
          console.log('pages/hotel/wine/addstock.js', 'onCloseWindow', windowType, windowId);
      }
  }
})