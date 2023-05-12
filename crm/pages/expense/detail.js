// crm/pages/expense/detail.js

/**
 * 消费记录页
 */
const app = getApp()
const utils = require('../../../utils/util.js')

var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var expense_record_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    expense_record_id = options.expense_record_id;
    this.getRecordinfo(openid,expense_record_id);
  },
  getRecordinfo:function(openid,expense_record_id){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/recordinfo', {
      openid           : openid,
      expense_record_id: expense_record_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({expense_info:data.result})
    })
  },
  /**
   * 预览图片
   * @param {*} e 
   */
  previewImages: function (e) {
    var expense_info = this.data.expense_info;
    
    let pictures = expense_info.images;
    let pictureIndex = e.currentTarget.dataset.index;
    let urls = [];
    for (let row in pictures) {
      urls[row] = pictures[row];
    }
    wx.previewImage({
      current: urls[pictureIndex], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
      success: function (res) {
       
      },
      fail: function (e) {
        
      }
    });
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