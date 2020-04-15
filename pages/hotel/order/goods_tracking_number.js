// pages/hotel/order/goods_tracking_number.js
/**
 * 商城订单发货页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var order_id

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_list:[],
    comcode:'',  //快递公司编号 
    enumber:'',   //快递单号
    input_enumber:'',  //手动输入快递单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = options.openid;
    order_id = options.order_id;
  },
  //扫码识别快递单号
  scarnCode:function(e){
    var that = this;
    wx.scanCode({
      success:function(res){
        console.log(res)
        if (res.errMsg =='scanCode:ok'){
          var enumber = res.result;  //快递单号
          that.getExCompany(enumber);
        }
      },fail:function(res){
        app.showToast('扫码失败,请重试');
      }
    })
  },
  //根据物流单号获取物流公司
  getExCompany:function(enumber){
    var that = this;
    utils.PostRequest(api_v_url + '/express/autonumber', {
      enum:enumber
    }, (data, headers, cookies, errMsg, statusCode) => {
      var company_list = data.result;
      if (JSON.stringify(company_list) == "{}"){
        app.showToast('物流单号异常');
      }else {
        if(company_list.length==1){
          that.setData({
            comcode:company_list[0].comcode
          })
        }
        that.setData({
          company_list: company_list,
          enumber: enumber
        })
      }
      
    },()=>{
      app.showToast('物流单号异常');
    })
  },
  selectExCompany:function(e){
    var comcode = e.detail.value;
    this.setData({
      comcode: comcode,
    })
  },
  addExpressnum:function(e){
    var that = this;
    var enumber = that.data.enumber;
    var comcode = that.data.comcode;
    if(enumber==''){
      app.showToast('请输入或扫描快递单');
      return false;
    }
    if(comcode==''){
      app.showToast('请选择确认物流公司');
      return false;
    }
    //保存物流订单
    utils.PostRequest(api_v_url + '/express/addExpressnum', {
      comcode:comcode,
      enum: enumber,
      openid:openid,
      order_id:order_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('发货成功');
      wx.navigateBack({
        delta: 1
      })
    })
  },
  setEnumber:function(e){
    var that = this;
    console.log(e)
    var input_enumber = e.detail.value.input_enumber;
    that.setData({
      showInputCodePopWindow:false,
    })
    that.getExCompany(input_enumber);

  },
  // 关闭修改昵称弹窗
  closeChangeNikenameWindow: function (e) {
    let self = this;
    self.setData({ showInputCodePopWindow: false });
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

  },

  // 打开手动码弹窗
  openInputCodePopWindow: function (e) {
    let self = this;
    
    self.setData({ showInputCodePopWindow: true,input_enumber:'' });
  }
})