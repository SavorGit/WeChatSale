// store/pages/goodsbreakage/nocode/goodslist.js
/**
 * 报损 无码报损 商品列表
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var type;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    title_list:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideShareMenu();
    type = options.type;
    var title = '';
    switch(type){
      case '10':
        title= '已入库的商品(入库单)';
        break;
      case '20':
        title = '已出库的商品(出库单)';
        break;
      case '30':
        title = '已领取的商品(出库单)';
        break;
    }
    this.setData({title:title})
    openid = app.globalData.openid;
    this.getStockList();
  },
  getStockList:function(){
    var that = this;

    utils.PostRequest(api_v_url + '/stock/userstocklist', {
      openid:openid,
      type:type
    }, (data, headers, cookies, errMsg, statusCode) => {
        var list = data.result.data_list;
        that.setData({list:list})
    })
  },
  gotoPage:function(e){
    var stock_id = e.currentTarget.dataset.stock_id;
    wx.navigateTo({
      url: '/store/pages/goodsbreakage/nocode/scancode?stock_id='+stock_id,
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

  }
})