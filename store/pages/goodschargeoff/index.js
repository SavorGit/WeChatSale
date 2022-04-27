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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        title: "核销（售卖）", status: 0, goodsList: [
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" },
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" }
        ], date_time: "2022/04/10 11:00", profit: "123456元"
      },
      {
        title: "核销（品鉴）", status: 1, goodsList: [
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" },
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" },
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" }
        ], date_time: "2022/04/10 11:00", profit: "123积分"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    page = 1;
    this.getChargeOffList();
  },
  getChargeOffList:function(page){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid:openid,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
      /*var off_goods_list = that.data.off_goods_list;
      var ret_off_goods_list = data.result;
      if(ret_off_goods_list.length>=0){
        for(let i in ret_off_goods_list){
          off_goods_list.push(ret_off_goods_list[i])
        }
        that.setData({off_goods_list:off_goods_list})
      }else {
        if(page>1){
          app.showToast('没有更多了...')
        }
        
      }*/
    })
  },
  loadMore:function(){
    page ++;
    this.getChargeOffList(page);
  },
  gotoPage:function(){
    wx.navigateTo({
      url: '/store/pages/goodschargeoff/addinfo',
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