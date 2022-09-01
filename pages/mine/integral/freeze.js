// pages/mine/integral/freeze.js
const utils = require('../../../utils/util.js')

/**
 * 冻结明细页面
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
var page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freeze_list:[],
    popchargeoffGoodsWind:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    page = 1;
    this.getFreezeIntegralList(openid,hotel_id,page);
  },
  getFreezeIntegralList:function(openid,hotel_id,page){
    var that = this;
    var freeze_list = this.data.freeze_list;
    utils.PostRequest(api_v_url + '/user/getWriteoffFreezeIntegralrecord', {
        openid: openid,
        hotel_id: 0,
        page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
        var ret_list = data.result.datalist;
        if(ret_list.length>0){
            for(let i in ret_list){
                freeze_list.push(ret_list[i])
            }
            that.setData({freeze_list:freeze_list})
            
        }else {
            if(page>1){
                app.showToast('没有更多了...')
            }
            
        }
    })
  },
  viewEntityInfo:function(e){
    var freeze_list = this.data.freeze_list;
    var keys = e.currentTarget.dataset.keys;
    var entity_info = freeze_list[keys].entity;
    if(entity_info.length>0){
        this.setData({popEntityInfoWind:true,entity_info:entity_info})
    }
  },
  closePopWind:function(){
    this.setData({popEntityInfoWind:false})
  },
  loadMore:function(){
    page ++;
    this.getFreezeIntegralList(openid,hotel_id,page);
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    var urls = [];
    for (var i = 0; i < 1; i++) {
      urls[i] = current;
    }
    wx.previewImage({
      current: urls[0], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
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

  }
})