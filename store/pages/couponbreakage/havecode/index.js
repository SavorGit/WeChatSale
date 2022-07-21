// store/pages/couponbreakage/havecode/index.js

/**
 * 新增核销申请-优惠券
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
    listTitle: '已扫优惠券（0）',
    scanList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    hotel_id = options.hotel_id;
    code_msg = options.code_msg;
    if(typeof(options.code_msg)!='undefined'){
      this.goodsDecode(options.code_msg)
    }
  },
  scanGoodsCode:function(){
    var that = this;
    var scanList = this.data.scanList;
    if(scanList.length>0){
      app.showToast('优惠券每次只能核销一个');
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
    var scanList = this.data.scanList;
    if(scanList.length>0){
      app.showToast('每次只能核销一个优惠券');
    }else {
      utils.PostRequest(api_v_url + '/coupon/scancode', {
        openid: openid,
        qrcontent:code_msg,
        hotel_id:hotel_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        var coupon_info = data.result;
        coupon_info.idcode = coupon_info.name;
        var flag  = 0;
        for(let i in scanList){
          if(scanList[i].qrcode==coupon_info.qrcode){
            flag = 1;
            break;
          }
        }
        if(flag == 0){
          scanList.push(coupon_info);
          var listTitle = '已扫优惠券('+scanList.length+')';
          that.setData({scanList:scanList,listTitle:listTitle});
        }else {
          app.showToast('请勿重复扫码');
        }
        
      })
    }
    
  },
  deleteScanGoods:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var scanList = this.data.scanList;

    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          scanList.splice(keys,1);
          var listTitle = '已扫优惠券（'+scanList.length+'）';
          
          
          that.setData({scanList:scanList,listTitle:listTitle});
        }
      }
    })
    
  },
  submitCoupon:function(){
    var scanList = this.data.scanList;
    if(scanList.length==0){
      app.showToast('请扫描优惠券二维码进行核销');
      return false;
    }
    wx.showModal({
      title: '确定要提交吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/coupon/writeoff', {
            openid: openid,
            hotel_id:hotel_id,
            qrcontent:scanList[0].qrcode
          }, (data, headers, cookies, errMsg, statusCode) => {
            
            wx.navigateBack({delta: 1});
            app.showToast('提交成功',3000,'success');
            
          })
        }
      }
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