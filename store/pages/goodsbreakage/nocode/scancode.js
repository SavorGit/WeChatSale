// store/pages/goodsbreakage/nocode/scancode.js
/**
 * 报损 无码报损 扫码
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
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
    goodsList: [
      /*{ goods_id: 122, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", cate_name: "白酒", sepc_name: "500ml", unit_name: "瓶" }*/
    ],
    scanList: [
      /*{  idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", is_check: 0, checked: true },
      {  idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", is_check: 1, checked: false },
      { idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", is_check: 0, checked: false },
      { idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", is_check: 0, checked: true },*/
     
    ],
    popReasonWind:false,
    reason_info:'',
    title:'已扫码商品(0/0)'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    stock_id = options.stock_id;
    openid   = app.globalData.openid;

    this.getStockGoods();
    this.getGoodsList();

  },
  getGoodsList:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getGoodsByStockid', {
      openid:openid,
      stock_id:stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goodsList = data.result.goods_list;
      that.setData({goodsList:goodsList})
    })
  },
  getStockGoods:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getStockGoods', {
      openid:openid,
      stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var scanList = data.result.goods_list;
      var title = '已扫码商品(0/'+scanList.length+')';
      that.setData({scanList:scanList,title:title});
    })
  },
  scanGoodsCode:function(){
    var that = this;
    var scanList = that.data.scanList;
    var is_continue = false;
    for(let i in scanList){
      if(scanList[i].is_check==0 && scanList[i].checked==false){//未被核销的数据
        is_continue = true;
      }
    }
    if(!is_continue){
      app.showToast('已完成扫码商品');
      return false;
    }
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
    var scanList = that.data.scanList;
    utils.PostRequest(api_v_url + '/stock/scanReportedloss', {
      openid:openid,
      idcode:code_msg
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      var result = data.result;
      var have_scancode_nums = 0
      for(let i in scanList){
        if(scanList[i].idcode==result.idcode){
          scanList[i].checked = true;
        }
        if(scanList[i].checked==true){
          have_scancode_nums++;
        }
      }
      var title = '已扫码商品('+have_scancode_nums+'/'+scanList.length+')';
      that.setData({scanList:scanList,title:title})
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
    var reason_info = this.data.reason_info
    if(reason_info==''){
      app.showToast('请填写报损原因');
      return false;
    }
    var scanList = this.data.scanList;
    var goods_codes = '';
    var space = '';
    for(let i in scanList){
      if(scanList[i].checked==false && scanList[i].is_check==0){
        goods_codes += space + scanList[i].idcode;
        space = ',';
      }
    }
    wx.showModal({
      title: '确定要提交吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/stock/finishReportedloss', {
            openid:openid,
            reason:reason_info,
            goods_codes:goods_codes
          }, (data, headers, cookies, errMsg, statusCode) => {
            wx.navigateBack({delta: 1});
            app.showToast('提交成功',2000,'success');
          })
        }
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