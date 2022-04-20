// store/pages/storein/index.js
/**
 * 入库 首页
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores: [], //库房列表
    doingList: [],
    doneList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = app.globalData.openid;
    
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
    
    this.getCityStores();
    
  },
  getCityStores:function(){
    var that = this;
    var stores = this.data.stores;
    var city_id = 0; 
    console.log('dddd')
    console.log(stores)
    if(stores.length==0){
      utils.PostRequest(api_v_url + '/stock/arealist', {
        openid: openid,
      }, (data, headers, cookies, errMsg, statusCode) => {
        var stores = data.result;
        that.setData({stores:stores}) 
        console.log('sss')
        console.log(stores) 
        city_id = stores[0].id;
        that.getDoingList(city_id); 
      })
    }else {
      for(let i in stores){
        if(stores[i].is_select==true){
          city_id = stores[i].id;
          break;
        }
      }
      that.getDoingList(city_id); 
    }
  },
  getDoingList:function(city_id){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/stocklist', {
      openid: openid,
      area_id:city_id,
      type:10
    }, (data, headers, cookies, errMsg, statusCode) => {
      var doingList = data.result.inprogress_list;
      var doneList = data.result.finish_list
      that.setData({doingList:doingList,doneList:doneList})
    })
  },
  changeArea:function(e){
    var keys = e.currentTarget.dataset.keys;
    var stores = this.data.stores;
    for(let i in stores){
      if(stores[i].is_select==1){
        stores[i].is_select=0;
        break;
      }
    }
    stores[keys].is_select = 1;
    this.setData({stores:stores});
    
    var city_id = stores[keys].id;
    this.getDoingList(city_id);
  },
  gotoPage:function(e){
    var stock_id = e.currentTarget.dataset.stock_id;
    var status   = e.currentTarget.dataset.status;
    console.log(e.currentTarget.dataset)
    if(status==1){
      var pageUrl = '/store/pages/storein/selectgoods?stock_id='+stock_id;
      wx.navigateTo({
        url: pageUrl,
      })
    }
    
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})