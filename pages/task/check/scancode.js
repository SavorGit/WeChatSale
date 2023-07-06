// pages/task/check/scancode.js
const utils = require('../../../utils/util.js');

/**
 * 盘点任务
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
var task_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_list       : [],
    hotel_goods_list : [],
    pop_confirm_wind : false,
    addDisabled      : false,
    completeDisabled : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid   = app.globalData.openid;
    hotel_id = options.hotel_id;
    task_id  = options.task_id;
  },
  /**
   * 扫码盘点
   */
  scanGoodsCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log(res)
        var code_msg = res.result;
        
        that.goodsDecode(code_msg);

      },fail:function(res){
        app.showToast('二维码识别失败,请重试');
      }
    })
  },
  goodsDecode:function(code_msg){
    var that = this;
    var check_list = this.data.check_list;
    utils.PostRequest(api_v_url + '/stockcheck/scancode', {
      idcode   : code_msg,
      openid   : openid,
      hotel_id : hotel_id,
      task_id  : task_id
    },(data,headers,cookies,errMsg,statusCode) => {

      var is_pop_tips_wind = data.result.is_pop_tips_wind

      if(is_pop_tips_wind==1){
        var msg = data.result.msg;
        wx.showModal({
          title: '提示',
          content: msg,
          confirmText:'我知道了',
          showCancel:false,
          success: function (res) {
            wx.navigateBack({
              delta:1
            })
          }
        })
      }else {
        var flag = 0;
        for(let i in check_list){
          if(code_msg==check_list[i].idcode){
            flag = 1;
            break;
          }
        }
        if(flag==1){
          app.showToast('该二维码已扫码');
        }else {
          var ret  = {'idcode':'','goods_name':'','goods_id':0};
          ret.idcode     = data.result.idcode;
          ret.goods_name = data.result.goods_name;
          ret.goods_id   = data.result.goods_id;
          check_list.push(ret);
          that.setData({check_list:check_list});
        }
      }
    })
  },
  /**
   * 完成盘点
   */
  completeCheck:function(){
    var that = this;
    var check_list = this.data.check_list;
    
    var idcodes = '';
    if(check_list.length==0){
      app.showToast('请扫码商品二维码进行盘点');
      return false;
    }
    var space = '';
    for(let i in check_list){
      idcodes += space + check_list[i].idcode
      space   = ',';
    }


    this.setData({completeDisabled:true});

    utils.PostRequest(api_v_url + '/stockcheck/checkidcodes', {
      openid   : openid,
      hotel_id : hotel_id,
      idcodes  : idcodes,
      task_id  : task_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

      var is_pop_tips_wind = data.result.is_pop_tips_wind;
        
      if(is_pop_tips_wind==1){
        var msg = data.result.msg;
        wx.showModal({
          title: '提示',
          content: msg,
          confirmText:'我知道了',
          showCancel:false,
          success: function (res) {
            wx.navigateBack({
              delta:1
            })
          }
        })
      }else {
        var no_check_num = data.result.no_check_num; //为盘点数量
        if(no_check_num==0){
          
          that.submitCheck();
        }else {
          var no_check_list = data.result.datalist;
          that.setData({pop_confirm_wind:true,no_check_num:no_check_num,no_check_list:no_check_list});
        }
      }
    })
  },
  closePopWind:function(){
    this.setData({pop_confirm_wind:false,completeDisabled:false})
  },
  submitCheck:function(){
    var that = this;
    this.setData({addDisabled:true});
    var check_list = this.data.check_list;
    var idcodes = '';
    var space   = '';
    for(let i in check_list){
      idcodes += space + check_list[i].idcode
      space   = ',';
    }

    utils.PostRequest(api_v_url + '/stockcheck/addcheckrecord', {
      openid   : openid,
      hotel_id : hotel_id,
      task_id  : task_id,
      idcodes  : idcodes
    }, (data, headers, cookies, errMsg, statusCode) => {

      var is_pop_tips_wind = data.result.is_pop_tips_wind;
        
      if(is_pop_tips_wind==1){
        var msg = data.result.msg;
        wx.showModal({
          title: '提示',
          content: msg,
          confirmText:'我知道了',
          showCancel:false,
          success: function (res) {
            wx.navigateBack({
              delta:1
            })
          }
        })
      }else {
        app.showToast('提交成功',2000,'success');
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
      //that.setData({completeDisabled:false,addDisabled:false,pop_confirm_wind:false});
      
      
    }, function () {
      that.setData({completeDisabled:false,addDisabled: false});
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