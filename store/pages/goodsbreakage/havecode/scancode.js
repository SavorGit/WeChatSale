// store/pages/goodsbreakage/havecode/scancode.js
/**
 * 报损 扫码报损
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanList: [
      { id: 10, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: true },
      { id: 9, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 8, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 7, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: true },
      { id: 6, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 5, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 4, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: true },
      { id: 3, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 2, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 1, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
    ],
    list: [
      {
        title: "报损商品1（xxxxxxx）", node: "领取（xxxxxxx）", goodsList: [
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" }
        ], date_time: "2022/04/10 11:00", username: "陈灵玉", desc: "哪里来的"
      },
      {
        title: "报损商品2（xxxxxxx）", node: "出库（xxxxxxx）", goodsList: [
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" },
          { id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" }
        ], date_time: "2022/04/10 11:00", username: "陈灵玉", desc: "库存未知"
      },
    ],
    popReasonWind:false,   //弹窗报损原因
    reason_info  :false, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
  },
  scanGoodsCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var code_msg = res.result;
        //解码
        that.goodsDecode(code_msg);

      },fail:function(res){
        app.showToast('二维码识别失败,请重试');
      }
    })
  },
  goodsDecode:function(code_msg){
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid:openid
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  popReasonWind:function(){
    this.setData({popReasonWind:true})
  },
  inputReason:function(e){
    var reason_info = e.detail.value.replace(/\s+/g, '');
    this.setData({reason_info:reason_info});
  },
  subBreakage:function(){
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid:openid
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  gotoPage:function(){
    wx.navigateTo({
      url: '/store/pages/goodsbreakage/nocode/index',
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