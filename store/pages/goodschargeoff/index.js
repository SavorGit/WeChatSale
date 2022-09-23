// store/pages/goodschargeoff/index.js
/**
 * 核销 首页
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var page;
var c_page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    coupon_list:[],
    tab:'goods',
    popEntityInfoWind:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    page   = 1;
    c_page = 1;
    
  },
  getChargeOffList:function(page){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getWriteoffList', {
      openid:openid,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(page ==1){
        var list = [];
      }else {
        var list = that.data.list;
      }
      
      var ret_list = data.result;
      if(ret_list.length>0){
        for(let i in ret_list){
          list.push(ret_list[i]);
        }
        that.setData({list:list})
      }else {
        if(page>1){
          app.showToast('没有更多了...')
        }
      }
      
    })
  },
  getCouponList:function(page){
    var that = this;
    utils.PostRequest(api_v_url + '/coupon/getWriteoffList', {
      openid:openid,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(page= 1){
        var coupon_list = [];
      }else{
        var coupon_list = that.data.coupon_list;
      }
      var ret_list = data.result;
      if(ret_list.length>0){
        for(let i in ret_list){
          coupon_list.push(ret_list[i]);
        }
        that.setData({coupon_list:coupon_list});
      }else {
        if(page>1){
          app.showToast('没有更多了...')
        }
      }
    })
  },
  loadMore:function(){
    var tab = this.data.tab;
    if(tab=='goods'){
      page ++;
      this.getChargeOffList(page);
    }else {
      c_page ++;
      this.getCouponList(c_page);
    }
    
  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    var url = '';
    if(type=='coupon'){
      var user_info = wx.getStorageSync(cache_key + 'userinfo');
      if (user_info.hotel_id == -1) {
        var hotel_id = user_info.select_hotel_id;
      } else {
        var hotel_id = user_info.hotel_id;
      }
      if(typeof(hotel_id)=='undefined'){
        app.showToast('请您先选择酒楼');
        return false;
      }
    }else if(type=='addinfo'){//商品资料未添加
      var keys = e.currentTarget.dataset.keys;
      var list = this.data.list;
      var code_msg = list[keys].goods[0].idcode;

    }

    switch(type){
      case 'goods':
        url = '/store/pages/goodschargeoff/addinfo';
        break;
      case 'coupon':
        url = '/store/pages/couponbreakage/havecode/index?hotel_id='+hotel_id;
        break;
      case 'addinfo':
        url = '/store/pages/goodschargeoff/addinfo?code_msg='+code_msg+'&is_supplement=1';
        break;
    }
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  },
  viewEntityInfo:function(e){
    var list = this.data.list;
    var keys = e.currentTarget.dataset.keys;
    var entity_info = list[keys].entity;
    if(entity_info.length>0){
        this.setData({popEntityInfoWind:true,entity_info:entity_info})
    }
  },
  closePopWind:function(){
    this.setData({popEntityInfoWind:false})
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getChargeOffList(1);
    this.getCouponList(1);
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

  // 选项卡选择
  showTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.tab;
    self.setData({tab: tabType}, function () {
    });
  }
})