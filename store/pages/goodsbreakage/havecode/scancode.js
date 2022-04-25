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
    list: [
      /*{
        title: "报损商品1（xxxxxxx）", type_str: "领取（xxxxxxx）", goods_info: 
          { goods_id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", code: "x14w2d8w" }
        , add_time: "2022/04/10 11:00", op_uname: "陈灵玉", desc: "哪里来的"
      },
      {
        title: "报损商品2（xxxxxxx）", type_str: "出库（xxxxxxx）", goodsList: 
          { goods_id: 123, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶", idcode: "x14w2d8w" }, add_time: "2022/04/10 11:00", op_uname: "陈灵玉", desc: "库存未知"
      },*/
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
    var that = this;
    var list = this.data.list;

    utils.PostRequest(api_v_url + '/stock/scanReportedloss', {
      openid:openid,
      idcode:code_msg
    }, (data, headers, cookies, errMsg, statusCode) => {
      var result = data.result;
      var scan_info = {};
      var goods_info = {};
      var goods_nums = list.length +1;
      scan_info.title = "报损商品"+goods_nums+"("+result.idcode+")";
      scan_info.type_str = result.type_str;
      scan_info.add_time = result.add_time;
      scan_info.op_uname = result.op_uname;
      goods_info.goods_id = result.goods_id;
      goods_info.goods_name = result.goods_name;
      goods_info.cate_name = result.cate_name;
      goods_info.spec_name = result.spec_name;
      goods_info.unit_name = result.unit_name;
      scan_info.stock_name = result.stock_name;
      scan_info.goods_info = goods_info;
      
      list.push(scan_info);
      that.setData({list:list});
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