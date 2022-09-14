// pages/adv/index.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var box_mac = '';
var openid  = '';
var hotel_id= '';
var pageNum = 1;
var is_adv;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options);
    var that = this;
    box_mac = options.box_mac;
    openid  = options.openid;
    hotel_id = options.hotel_id;
    if(typeof(options.is_adv)!='undefined'){
      is_adv = options.is_adv;
    }else {
      is_adv = 0;
    }
    that.setData({
      box_mac:box_mac,
      openid:openid,
      hotel_id:hotel_id
    })  
    utils.PostRequest(api_v_url + '/adv/getAdvList', {
      page: pageNum,
      hotel_id:hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var list = data.result.datalist
      if(is_adv==0){
        var adv_list = [];
        for(let i in list){
          if(list[i].rtype=='wineads'){
            adv_list.push(list[i])
          }
        }
      }else {
        var adv_list = list;
      }



      that.setData({
        adv_list:  adv_list

      })
    });
  },
  loadMore:function(e){
    var that = this;
    pageNum +=1;
    utils.PostRequest(api_v_url + '/adv/getAdvList', {
      page: pageNum,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        adv_list:data.result.datalist
      })
    });
  },
  boxShow:function(e){
    var that = this;
    var pubdetail = e.currentTarget.dataset.pubdetail;
    var rtype     = e.currentTarget.dataset.rtype
    var ads_id    = e.currentTarget.dataset.ads_id;
    console.log(ads_id);
    var action =5;
    
    app.boxShow(box_mac,pubdetail,2,action,that,rtype,ads_id,hotel_id);
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