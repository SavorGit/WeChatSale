// pages/task/prize_list.js
const utils = require('../../utils/util.js');
const app = getApp()
const api_v_url = app.globalData.api_v_url;
var page ;
var openid;
var hotel_id;
/**
 * 奖品任务列表
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClaimWindow:false,  //收益弹窗
    task_info:{'status':0,'img_url':'','percent':0,'end_time':'','name':'','task_id':0},
    task_list:[],          //任务列表
    claim_total:0,
    claim_list:[],
    is_hand_close:false,  //是否手动关闭收益弹窗
    claim_bt_disable:false, //认领收益按钮是否可用
    //status:0,           //是否领取了红包任务 0无领取任务 1进行中 2已完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    page     = 1;
    openid   = options.openid;
    hotel_id = options.hotel_id;
    
  },
  //获取已领取的红包详情
  getChoosePrizeInfo:function(){
    var that = this;
    var is_hand_close = this.data.is_hand_close;
    utils.PostRequest(api_v_url + '/task/getInProgressCashTask', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var task_info = data.result;
      that.setData({task_info:task_info})
      if(task_info.status==1 && is_hand_close==false){
        that.getAllIncome();
      }
    })
  },
  //获取现金红包列表
  getPrizeList:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/task/getCashTaskList', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({task_list:data.result.datalist})
    })
  },
  //获取所有收益
  getAllIncome:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/boxincome/datalist', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var claim_total = data.result.total;
      var claim_list = data.result.datalist;
      that.setData({claim_total:claim_total,claim_list:claim_list})

    })
  },
  //选择领取红包
  choosePrize:function(e){
    var that = this;
    var task_id = e.currentTarget.dataset.task_id;
    
    utils.PostRequest(api_v_url + '/task/receiveCashTask', {
      openid: openid,
      hotel_id: hotel_id,
      task_id:task_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.getChoosePrizeInfo();
      app.showToast('领取成功');
    })
  },
  //认领收益
  takeMyIncome:function(e){
    var that = this;
    var claim_id = e.currentTarget.dataset.claim_id;
    var claim_list = this.data.claim_list;
    that.setData({claim_bt_disable:true})
    utils.PostRequest(api_v_url + '/boxincome/claim', {
      openid: openid,
      hotel_id: hotel_id,
      claim_id:claim_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      for(var i in claim_list ){
        if(claim_list[i].id== claim_id){
          claim_list[i].is_claim = 1;
          claim_list[i].avatar_url = data.result.avatar_url
          break;
        }
      }
      that.setData({claim_list:claim_list,claim_bt_disable:false})
      
    },res=>{
      that.setData({claim_bt_disable:false})
    })
  },
  //关闭收益弹窗
  closePopIncome:function(e){
    this.setData({claim_total:0,is_hand_close:true})
    this.getChoosePrizeInfo();
    
  },
  //继续领取
  gotoPrizeDetail:function(e){
    var task_info = this.data.task_info;
    wx.navigateTo({
      url: '/pages/task/prize_detail?openid='+openid+'&hotel_id='+hotel_id+'&task_id='+task_info.task_id,
    })
  },
  //任务完成立即领取
  takeMyPrize:function(e){
    var that = this;
    var task_info = this.data.task_info;

    utils.PostRequest(api_v_url + '/withdraw/claimMoney', {
      openid: openid,
      hotel_id: hotel_id,
      task_id:task_info.task_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var task_info = {'status':0,'img_url':'','percent':0,'end_time':'','name':'','task_id':0};
      that.setData({task_info:task_info})
      wx.showModal({
        title: data.result.message,
        content: data.result.tips,
        showCancel: false,
        confirmText:'我知道了'
      })
      
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
    this.getChoosePrizeInfo();
    this.getPrizeList();
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