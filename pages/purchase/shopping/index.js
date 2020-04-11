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
      var category_list = data.result.category_list
      var page_arr = that.data.page_arr;
      for(var i=0;i<category_list.length;i++){
        var id = category_list[i].id;
        page_arr[id] = 1;
      }
      that.setData({
        page_arr: page_arr,
        category_list: category_list,
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
  selectCate:function(e){
    var that = this;
    var category_id = e.currentTarget.dataset.category_id;
    that.setData({
      category_id: category_id
    })
    var page_arr = that.data.page_arr;
    var select_page = 1;
    for (let index in page_arr) { 
      if(category_id==index){
        select_page = page_arr[index];
      }
    }
    that.getGoodsList(category_id,select_page);
  },
  loadMore:function(e){
    var that = this;
    var category_id = that.data.category_id;
    var page_arr = that.data.page_arr;
    var select_page = 1;
    for(let index in page_arr){
      if(index==category_id){
        select_page = page_arr[index]+1;
        page_arr[index] +=1;
        break;
      }
    }
    that.setData({
      page_arr: page_arr,
    })
    that.getGoodsList(category_id,select_page)
  },
  gotoGoodsDetail:function(e){
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/purchase/shopping/goods_detail?goods_id=' + goods_id + '&openid=' + openid,
    })
  },
  creatPoster:function(e){
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/purchase/shopping/poster?goods_id=' + goods_id + '&openid=' + openid,
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