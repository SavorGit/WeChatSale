// store/pages/storein/selectgoods.js
/**
 * 入库 选择商品
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var stock_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideShareMenu();
    openid = app.globalData.openid;
    stock_id = options.stock_id;
    
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
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getGoodsByStockid', {
      openid: openid,
      stock_id:stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var list = data.result.goods_list;
      for(let i in list){
        list[i].viewBt = true;
      }
      that.setData({list:list})
    })
  },
  gotoPage:function(e){
    var keys = e.currentTarget.dataset.keys;
    var list = this.data.list;
    var goods_info = list[keys];

    var unit_id = goods_info.unit_id;
    var convert_type = goods_info.convert_type;



    var params = JSON.stringify(goods_info);
    if(convert_type>1){
      var pageUrl = '/store/pages/storein/scanboxcode?stock_id='+stock_id+'&goods_info='+params;
    }else {
      var pageUrl = '/store/pages/storein/scancode?stock_id='+stock_id+'&goods_info='+params;
    }

    wx.navigateTo({
      url: pageUrl,
    })
  },
  finishStore:function(){
    var that = this;
    wx.showModal({
      title: '确定要完成入库吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/stock/finish', {
            openid: openid,
            stock_id:stock_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            wx.navigateBack({ delta: 1})
            app.showToast('成功完成入库');
          })
        }
      }
    })
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