// pages/hotel/setting/agent_setting.js
/**
 * 分销设置页面
 */

const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
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
	  console.log('ddd')
    var that = this;
    merchant_id = options.merchant_id;
    openid = options.openid;
    utils.PostRequest(api_v_url + '/merchant/info', {
      merchant_id: merchant_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var is_changeprice = data.result.is_changeprice;
      that.setData({
        is_changeprice: is_changeprice
      })
    })
  },
  editChangeprice:function(e){
    var that = this;
    var is_changeprice = e.detail.value;
    if(is_changeprice){
      is_changeprice = 1;
    }else {
      is_changeprice = 0;
    }
    utils.PostRequest(api_v_url + '/merchant/setChangeprice', {
      is_changeprice: is_changeprice,
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('设置成功')
      that.setData({
        is_changeprice: is_changeprice
      })
    },()=>function(){
      app.showToast('设置失败')
      if(is_changeprice==1){
        is_changeprice = 0;
      }else{
        is_changeprice = 1;
      }
      that.setData({
        is_changeprice: is_changeprice 
      })
    })
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

  },

  // 打开提示弹窗
  openChangeSalePriceTipPopWindow: function (e) {
    let self = this;
    self.setData({ showTipsPopWindow: true, tipsPopWindowTitle: '提示', tipsPopWindowContents: ['1.您在允许分销改价售卖时，分销可以在菜品原价的基础上进行调整。以此来进行售卖获得分销自己的收益。', '2.如果您不支持菜品改价售卖，可能会使分销售卖您餐厅的菜品时产生障碍，需要单独与您在线下沟通分销在帮您餐厅售卖菜品时如何获得利润。'] });
  },
})