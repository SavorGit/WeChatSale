// store/pages/goodsbreakage/replace/index.js
/**
 * 报损 二维码替换
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
    goods_info:{goods_id:0},
    code_info:{code:''}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    //var goods_info = that.data.goods_info;
    utils.PostRequest(api_v_url + '/stock/scanReplaceCode', {
      openid:openid,
      idcode:code_msg,
      type:1
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(typeof(data.result.tips)!='undefined' && data.result.tips!=''){
        wx.showModal({
            title: '提示',
            content: data.result.tips,
            showCancel:false,
            confirmText:'我知道了',
            success: function (res) {

            }
        })
      } else{
        var goods_info = data.result;
        that.setData({goods_info:goods_info});
      } 
      
    })
  },
  delGoodsInfo:function(e){
    console.log(e)
    var type = e.currentTarget.dataset.type;
    if(type=='original'){
        var goods_info = {goods_id:0};
        this.setData({goods_info:goods_info});
    }else {
        var code_info = {code:''};
        this.setData({code_info:code_info});
    }
  },
  scanReGoodsCode:function(){
    var that = this;
    var code_info = this.data.code_info;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var code_msg = res.result;
        utils.PostRequest(api_v_url + '/stock/scanReplaceCode', {
            openid:openid,
            idcode:code_msg,
            type:2
        }, (data, headers, cookies, errMsg, statusCode) => {

            if(typeof(data.result.tips)!='undefined' && data.result.tips!=''){
                wx.showModal({
                    title: '提示',
                    content: data.result.tips,
                    showCancel:false,
                    confirmText:'我知道了',
                    success: function (res) {
        
                    }
                })
            }else {
                code_info.code = code_msg;
                that.setData({code_info:code_info});
            }
            
        })
      },fail:function(res){
        app.showToast('二维码识别失败,请重试');
      }
    })
  },
  confirmReplace:function(){
    var goods_info = this.data.goods_info;
    var code_info  = this.data.code_info;
    if(goods_info.goods_id==0){
        app.showToast('请扫描商品当前唯一标识码');
        return false;
    }
    if(code_info.code==''){
        app.showToast('请扫描新的唯一标识码');
        return false;
    }
    utils.PostRequest(api_v_url + '/stock/finishReplaceCode ', {
        openid:openid,
        old_code:goods_info.idcode,
        new_code:code_info.code
    }, (data, headers, cookies, errMsg, statusCode) => {
        var tips = data.result.tips;
        wx.navigateBack({delta: 1});
        app.showToast(tips,2000,'success');
    })
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