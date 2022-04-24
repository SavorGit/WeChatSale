// store/pages/storereceive/scancode.js
/**
 * 出库 首页
 */
const app = getApp()
const utils = require('../../../utils/util.js')
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
    scanList: [],
    stock_id :0,
    title:"已扫码商品(0/0)",
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
    var stock_id = this.data.stock_id;
    utils.PostRequest(api_v_url + '/stock/scanReceive', {
      openid: app.globalData.openid,
      idcode:code_msg,
      stock_id : stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(stock_id==0){
        that.setData({stock_id:data.result.stock_id});
      }
      var idcode = data.result.idcode;
      
      var scanList = data.result.goods_list;
      if(scanList.length==0){
        scanList = that.data.scanList;
        var is_return = false;
        for(let i in scanList){
          if(scanList[i].idcode==idcode && scanList[i].checked==true){
            is_return = true;
          }
        }
        if(is_return){
          app.showToast('该商品已扫码');
          return false;
        }
      }
      var have_scan_nums = 0;
      for(let i in scanList){
        if(scanList[i].idcode==idcode){
          scanList[i].checked = true;
        }
        if(scanList[i].checked == true){
          have_scan_nums ++;
        }
      }
      var title = "已扫码商品("+have_scan_nums+"/"+scanList.length+")";
      that.setData({scanList:scanList,title:title})
    })
  },
  
  gotoPage:function(e){
    var stock_id = this.data.stock_id;
    wx.navigateTo({
      url: '/store/pages/storereceive/billinfo?stock_id='+stock_id,
    })
  },
  confirmReceive:function(){
    var scanList = this.data.scanList;
    if(scanList.length==0){
      app.showToast('请扫商品码');
      return false;
    }
    var is_return = false;
    var goods_codes = '';
    var space = '';
    for(let i in scanList){
      if(scanList[i].checked== false){
        is_return = true;
        break;
      }
      goods_codes += space + scanList[i].idcode;
      space = ',';
    }
    if(is_return){
      app.showToast('请扫完全部商品码后确认');
      return false;
    }
    var stock_id = this.data.stock_id;
    wx.showModal({
      title: '确定要认领吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/stock/finishReceive', {
            openid  : openid,
            goods_codes:goods_codes,
            stock_id:stock_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            wx.navigateBack({delta: 1})
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