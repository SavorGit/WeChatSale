// pages/task/prize_detail.js
const utils = require('../../utils/util.js');
const app = getApp()
const api_v_url = app.globalData.api_v_url;
var   task_page ;  //任务记录分页
var   claim_page;  //认领记录分页
var   complete_page; //完成记录分页
var   openid;
var   hotel_id;
/**
 * 奖品任务详情
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    taskStatus: 0
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
    this.getChoosePrizeInfo();

  },
  //获取已领取的红包详情
  getChoosePrizeInfo:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  //获取领红包滚动数据
  getGotRollData:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  loadMore:function(e){
    var that = this;
    var tab = that.data.tab;
    if(tab ==1){
      task_page +=1;
      var page = task_page
    }else if(tab ==2){
      claim_page +=1;
      var page = claim_page
    }else if(tab ==3){
      complete_page +=1;
      var page = complete_page;
    }

  },
  //完成任务立即领取
  takeMyPrize:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
      prize_id:prize_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
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