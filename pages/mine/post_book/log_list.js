// pages/mine/post_book/log_list.js


/**
 * 预定记录页
 */
const app = getApp()
var uma = app.globalData.uma;
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var hotel_id;
var page ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    log_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    page = 1;
    this.getPostLogList(openid,hotel_id,page);
  },
  getPostLogList:function(openid,hotel_id,page = 1){
    var that = this;
    utils.PostRequest(api_v_url + '/invitation/datalist', {
      hotel_id:hotel_id,
      openid:openid,
      page  : page,
      pagesize:20,
    }, (data, headers, cookies, errMsg, statusCode) => {

      var log_list = this.data.log_list;
      var ret_record = data.result.datalist;
      if(ret_record.length>0){
          for(let i in ret_record){
            log_list.push(ret_record[i]);
          }
          this.setData({log_list:log_list})
      }else {
          if(page!=1){
              app.showToast('没有更多了...')
          }
      }

    })
  },
  loadMore:function(){
    page +=1;
    this.getPostLogList(openid,hotel_id,page);
  },
  gotoPage:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/post_book/log_detail?openid='+openid+'&hotel_id='+hotel_id+'&id='+id,
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