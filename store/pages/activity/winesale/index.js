// store/pages/activity/winesale/index.js

/**
 * 售酒抽奖
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
var code_msg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipList: ['请问是否卖出以下商品？', '如确认无误可发起抽奖！'],
    list: [{
      stock_id: 123,
      goods_id: 456,
      name: '测试一下下',
      cate_name: '白酒',
      sepc_name: '500ml',
      unit_name: '瓶'
    }],
    pageConfig:{popLotteryWind:false,isNotHaveStartLottery:true},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    code_msg = options.code_msg;
    hotel_id = options.hotel_id;
    this.goodsDecode(code_msg);
    this.getRoomlist(openid,hotel_id);
    this.setData({code_msg:code_msg});
  },
  goodsDecode:function(code_msg){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      idcode:code_msg,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      
    })
  },
  getRoomlist:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRoomList', {
      openid: openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      //var lottery_config = that.data.lottery_config;
      //lottery_config.select_room_name = data.result.box_name_list[0];

      that.setData({
        objectBoxArray: data.result.box_name_list,
        box_list: data.result.box_list,
        box_index:data.result.box_index
        //lottery_config:lottery_config
      })
    })
  },
  selectRoom:function(e){
    var keys = e.detail.value;
    this.setData({box_index:keys})
  },
  startLottery:function(){
    var that = this;
    var pageConfig = this.data.pageConfig;
   
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      idcode:code_msg,
    }, (data, headers, cookies, errMsg, statusCode) => {
      pageConfig.isNotHaveStartLottery = false;
      pageConfig.popLotteryWind        = true;
      that.setData({pageConfig:pageConfig});
    })
  },
  closeLotteryWind:function(){
    var pageConfig = this.data.pageConfig;
    pageConfig.popLotteryWind = false;
    this.setData({pageConfig:pageConfig});
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