// pages/purchase/shopping/search_result.js
const utils = require('../../../utils/util.js')
var mta = require('../../../utils/mta_analysis.js')
const app = getApp()
var api_v_url = app.globalData.api_v_url;
var openid; //用户openid
var page = 1; 
var keywords;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo: getApp().SystemInfo,
    statusBarHeight: getApp().globalData.statusBarHeight,
    keywords:'',
    input_keywords:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid;
    keywords = options.keywords;
    that.setData({
      keywords:keywords,
      input_keywords: keywords,
    })
    that.getGoodsList(keywords,1);
  },
  getGoodsList: function (keywords, page) {
    var that = this;
    utils.PostRequest(api_v_url + '/purchase/goods', {
      keywords: keywords,
      openid: openid,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        total: data.result.total,
        goods_list: data.result.datalist,
      })
    });
  },
  inputSearch: function (e) {
    var input_keywords = e.detail.value.replace(/\s+/g, '');
    this.setData({
      input_keywords: input_keywords
    })
  },
  searchGoods: function (e) {
    var that =this;
    var keywords = this.data.input_keywords;
    
    if (keywords == '') {
      app.showToast('请输入搜索关键词');
      return false;
    }
    that.setData({
      keywords: keywords
    })
    that.getGoodsList(keywords,1);
  },

  loadMore:function(e){
    var that = this;
    page +=1;
    that.getGoodsList(keywords,page);
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