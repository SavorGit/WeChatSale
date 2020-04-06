// pages/purchase/shopping/index.js
/**
 * 商品首页
 */
const utils = require('../../../utils/util.js')
var mta = require('../../../utils/mta_analysis.js')
const app = getApp()
var api_v_url = app.globalData.api_v_url;
var openid; //用户openid
var page = 1; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_arr:[],
    category_id :0,
    keywords:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid;
    
    that.getCategoryList();
    that.getGoodsList(0,1);

    
  },
  getGoodsList: function (category_id,page){
    var that = this;
    utils.PostRequest(api_v_url + '/purchase/goods', {
      category_id: category_id,
      openid: openid,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        goods_list: data.result.datalist,
      })
    });
  },
  //获取分类列表
  getCategoryList:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/category/categorylist', {
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        category_list: data.result.category_list,
      })
    });
  },
  inputSearch:function(e){
    var keywords = e.detail.value.replace(/\s+/g, '');
    this.setData({
      keywords: keywords
    })
  },
  searchGoods:function(e){
    var keywords = this.data.keywords;
    if(keywords==''){
      app.showToast('请输入搜索关键词');
      return false;
    }
    wx.showLoading({
      title: '搜索中',
      mask:true,
    })
    wx.navigateTo({
      url: '/pages/purchase/shopping/search_result?openid='+openid+'&keywords='+keywords,
      success:function(e){
        wx.hideLoading();
      }
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