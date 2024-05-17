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
    search_config:{start_date:'',end_date:'',chargeoff_list:[],chargeoff_name_arr:[],recycle_status_list:[],
                   recycle_status_name_arr:[]},
    search_data:{start_date:'',end_date:'',chargeoff_index:0,recycle_status_index:0}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    page   = 1;
    c_page = 1;
    this.setData({userinfo:app.globalData.userinfo})
  },
  getFilter:function(){
    var that = this;
    var search_config = this.data.search_config;
    var search_data   = this.data.search_data;
    utils.PostRequest(api_v_url + '/writeoff/filter', {
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      search_config.start_date = data.result.date_range[0];
      search_config.end_date   = data.result.date_range[1];
      search_data.start_date   = data.result.date_range[0];
      search_data.end_date   = data.result.date_range[1];

      var recycle_status = data.result.recycle_status;
      search_config.recycle_status_list = recycle_status;
      var recycle_status_name_arr = [];
      for(let i in recycle_status){
        recycle_status_name_arr.push(recycle_status[i].name);
      }
      var stock_status = data.result.stock_status;
      search_config.chargeoff_list = stock_status;
      var chargeoff_name_arr = [];
      for(let i in stock_status){
        chargeoff_name_arr.push(stock_status[i].name);
      }

      search_config.recycle_status_name_arr = recycle_status_name_arr;
      search_config.chargeoff_name_arr      = chargeoff_name_arr;
      that.setData({search_config:search_config,search_data:search_data});
      that.getStatdata();
      that.getChargeOffList(1);
    })
  },
  getStatdata:function(){
    var that = this;
    var search_data = this.data.search_data;
    var search_config = this.data.search_config;
    var recycle_status = search_config.recycle_status_list[search_data.recycle_status_index].recycle_status;
    var wo_status      = search_config.chargeoff_list[search_data.chargeoff_index].status

    utils.PostRequest(api_v_url + '/writeoff/statdata', {
      sdate          : search_data.start_date,
      edate          : search_data.end_date,
      openid         : openid,
      recycle_status : recycle_status,
      wo_status      : wo_status
    }, (data, headers, cookies, errMsg, statusCode) => {
      var statdata = data.result;
      that.setData({statdata:statdata})
    })
  },
  getChargeOffList:function(page){
    var that = this;
    var search_data = this.data.search_data;
    //console.log(search_data)
    var search_config = this.data.search_config;
    var recycle_status = search_config.recycle_status_list[search_data.recycle_status_index].recycle_status;
    var wo_status      = search_config.chargeoff_list[search_data.chargeoff_index].status
    //utils.PostRequest(api_v_url + '/stock/getWriteoffList', {
    utils.PostRequest(api_v_url + '/writeoff/datalist', {
      sdate          : search_data.start_date,
      edate          : search_data.end_date,
      openid         : openid,
      page           : page,
      recycle_status : recycle_status,
      wo_status      : wo_status
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(page ==1){
        var list = [];
      }else {
        var list = that.data.list;
      }
      var ret_list = data.result.datalist;
      var reward_tips  = data.result.reward_tips;
      if(ret_list.length>0){
        for(let i in ret_list){
          list.push(ret_list[i]);
        }
        that.setData({list:list})
        if(typeof(reward_tips)!='undefined' && reward_tips!=''){
          app.showToast(reward_tips);
        }
      }else {
        
        if(page>1){
          app.showToast('没有更多了...')
        }else{
          that.setData({list:list})
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
  //没有开瓶
  noCrack:function(e){
    var that = this;
    var list = this.data.list;
    var keys = e.currentTarget.dataset.keys;
    var batch_no = list[keys].batch_no;
    wx.showModal({
      title: '提示',
      content: '确定没有开瓶?',
      complete: (res) => {
        
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/recycle/noOpenReward', {
            openid:openid,
            batch_no:batch_no
          }, (data, headers, cookies, errMsg, statusCode) => {
            page = 1;
            this.getChargeOffList(page);
          })
        }
      }
    })
    
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

    }else if(type=='applyCrackReward'){
      var keys = e.currentTarget.dataset.keys;
      var list = this.data.list;
      var goods_name = list[keys].goods[0].goods_name;
      var goods_num  = list[keys].goods.length;
      var batch_no   = list[keys].batch_no;
      var demo_img   = list[keys].demo_img;
      var goods_id   = list[keys].goods[0].goods_id;
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
      case 'applyCrackReward':
        url = '/store/pages/goodschargeoff/applyCrackReward?goods_name='+goods_name+'&goods_num='+goods_num+'&batch_no='+batch_no+'&demo_img='+demo_img+'&goods_id='+goods_id;
        break;
    }
    //console.log(url)
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
  selectParams:function(e){
    var type = e.currentTarget.dataset.type;
    var value = e.detail.value;
    var search_data = this.data.search_data;
    switch(type){
      case 'start_date':
        search_data.start_date = value;
        break;
      case 'end_data':
        search_data.end_date = value;
        break;
      case 'chargeoff':
        search_data.chargeoff_index = value;
        break;
      case 'recycle':
        search_data.recycle_status_index = value;
        break;
    }
    this.setData({search_data:search_data});
  },
  clickSearchButton:function(){
    page = 1;
    this.getStatdata();
    this.getChargeOffList(page);
    
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
    this.getFilter();
    
    //this.getChargeOffList(1);
    //this.getCouponList(1);
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