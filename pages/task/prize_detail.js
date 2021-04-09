// pages/task/prize_detail.js
const utils = require('../../utils/util.js');
const app = getApp()
const api_v_url = app.globalData.api_v_url;
var   task_page ;  //任务记录分页
var   claim_page;  //认领记录分页
var   complete_page; //完成记录分页
var   openid;
var   hotel_id;
var   task_id;
/**
 * 奖品任务详情
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    taskStatus: 0,
    change_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = options.openid;
    hotel_id = options.hotel_id;
    task_page = 1;
    claim_page = 1;
    complete_page = 1;
    task_id = options.task_id;
    

    this.getTaskLog(1);   //任务记录
    this.claimTaskLog(1);  //认领记录
    this.completeTaskLog(1);//完成记录


    this.getGotRollData();
  },
  //获取已领取的红包详情
  getChoosePrizeInfo:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/task/getCashTask', {
      openid: openid,
      hotel_id: hotel_id,
      task_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({task_info:data.result});
    },res=>{
      wx.navigateBack({
        delta: 1
      })
    })
  },
  //获取领红包滚动数据
  getGotRollData:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/record/rollexchangelist', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var change_list = data.result.datalist;
      that.setData({change_list:change_list})
    })
  },
  loadMore:function(e){
    var that = this;
    var tab = that.data.tab;
    if(tab ==1){
      task_page +=1;
      that.getTaskLog(task_page);
    }else if(tab ==2){
      claim_page +=1;
      that.claimTaskLog(claim_page);
    }else if(tab ==3){
      complete_page +=1;
      that.completeTaskLog(complete_page);
    }


  },
  //任务完成立即领取
  takeMyPrize:function(e){
    var that = this;

    utils.PostRequest(api_v_url + '/withdraw/claimMoney', {
      openid: openid,
      hotel_id: hotel_id,
      task_id:task_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      wx.showModal({
        title: '提示',
        content: data.result.message,
        showCancel: false,
        confirmText:'我知道了',
        success:function(){
          wx.navigateBack({
            delta: 1,
          })
        }
      })
      
      
    })
  },
  //任务记录
  getTaskLog:function(page = 1){
    var that = this;
    utils.PostRequest(api_v_url + '/record/taskprocess', {
      openid:openid,
      hotel_id:hotel_id,
      page:page,
      task_id:task_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var task_log = data.result.datalist;
      that.setData({task_log:task_log})
    })
  },
  //认领记录
  claimTaskLog:function(page = 1){
    var that = this;
    utils.PostRequest(api_v_url + '/record/taskclaim', {
      openid:openid,
      hotel_id:hotel_id,
      task_id:task_id,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
      var claim_log_list = data.result.datalist;
      that.setData({claim_log_list:claim_log_list})
    })
  },
  //完成记录
  completeTaskLog:function(page = 1){
    var that = this;
    utils.PostRequest(api_v_url + '/record/taskfinish', {
      openid:openid,
      hotel_id:hotel_id,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {
      var complete_log_list = data.result.datalist;
      that.setData({complete_log_list:complete_log_list})
    })
  },
  //跳转到指定包间
  gotoAssignWater:function(e){
    wx.navigateTo({
      url: '/pages/mine/assign_waiter?openid='+openid+'&hotel_id='+hotel_id,
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

  // 选项卡选择
  showTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.tab;
    self.setData({
      tab: tabType
    }, function () {
    });
  },
})