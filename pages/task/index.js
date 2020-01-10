// pages/task/index.js
/**
 * 任务列表
 */

const util = require('../../utils/util.js');
var mta = require('../../utils/mta_analysis.js')
const app = getApp()
const api_url = app.globalData.api_url;
const cache_key = app.globalData.cache_key;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskListShowStatus: 0, // 是否展示任务列表。0：加载中；1:无数据；2:有数据。
    pageNo: 1, // 当前页码
    taskList: [], // 任务列表数据
    taskDetailWindowShow: false, // 是否吊起任务详情弹窗
    openTaskInWindow: {}, // 在任务详情弹窗中打开任务
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    wx.hideLoading();
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    if (userInfo.hotel_id == -1) {
      var hotel_id = userInfo.select_hotel_id;
    } else {
      var hotel_id = userInfo.hotel_id;
    }
    that.loadingData({
      page: 1,
      hotel_id: hotel_id,
      openid: userInfo.openid
    }, true);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    console.log('Page.onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 刷新列表
   */
  flushTaskList: function(e) {
    let that = this;
    // console.log('flushTaskList', e);
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    this.loadingData({
      page: 1,
      hotel_id: userInfo.hotel_id,
      openid: userInfo.openid
    });
  },

  /**
   * 加载下页面数据
   */
  loadingNextPageData: function(e) {
    let that = this;
    // console.log('loadingNextPageData', e);
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    this.loadingData({
      page: ++that.data.pageNo,
      hotel_id: userInfo.hotel_id,
      openid: userInfo.openid
    });
  },

  /**
   * 弹出任务详情弹窗
   */
  popTaskDetailWindow: function(e) {
    let that = this;
    let taskListIndex = e.currentTarget.dataset.index;
    that.setData({
      taskDetailWindowShow: true,
      openTaskInWindow: that.data.taskList[taskListIndex]
    });
    mta.Event.stat("viewtaskdetail", {})
  },

  /**
   * 点击任务详情弹窗确定按钮
   */
  taskDetailWindowConfirm: function(e) {
    let that = this;
    that.setData({
      taskDetailWindowShow: false
    });
  },
  /**
   * 
   * 点击弹出分润弹框 
   */
  setShareBenefit:function(e){
    var that = this;
    var taskListIndex = e.currentTarget.dataset.index;
    var taskList = that.data.taskList;
    var taskInfo = taskList[taskListIndex];
    that.setData({
      taskInfo:taskInfo,
      taskDetailWindowShow: false,
      setTaskBenefitWindowShow:true,
    })
  },
  /**
   * 关闭分润弹窗
   */
  closeShareBenefit:function(e){
    var that = this;
    that.setData({
      setTaskBenefitWindowShow:false,
    })
  },
  slideSet:function(e){
    var that = this;
    var staff_share_benefit = e.detail.value;  //设置数值
    var manager_share_benefit = 100 - staff_share_benefit;  //管理员分润数值
    that.setData({
      staff_share_benefit:staff_share_benefit,
      manager_share_benefit:manager_share_benefit
    })
  },
  /**
   * 管理员修改任务分润比例
   */
  editTaskShareBenefit:function(e){
    var that = this;
    var task_id = e.detail.value.task_id;
    var bili  = e.detail.value.bili;
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    var openid = userInfo.openid;
    utils.PostRequest(api_url +'/aa/bb/cc',{
      task_id : task_id,
      bili:bili,
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('保存成功')
      that.setData({
        setTaskBenefitWindowShow:false,
      })
    },res=>{
      app.showToast('保存失败');
    })
  },
  /* **************************** 自定义方法 **************************** */
  loadingData: function(requestData, navigateBackOnError) {
    let that = this;
    util.PostRequest(api_url + '/smallsale14/task/getHotelTastList', requestData, function(data, headers, cookies, errMsg, httpCode) {
      if (typeof(data) != 'object' || typeof(data.result) != 'object') {
        wx.showToast({
          title: "服务器返回数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack();
            }, 2000);
          }
        });
        return;
      }
      let taskListForReturn = data.result;
      let taskListShowStatus = 0;
      if (typeof(taskListForReturn) != 'object') {
        wx.showToast({
          title: "服务器返回任务列表错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack();
            }, 2000);
          }
        });
        return;
      } else if ((taskListForReturn instanceof Array) && taskListForReturn.length > 0) {
        taskListShowStatus = 2;
      } else {
        wx.showToast({
          title: "您当前没有任务！",
          icon: 'none',
          mask: true,
          duration: 5000
        });
        taskListShowStatus = 1;
      }
      that.setData({
        taskListShowStatus: taskListShowStatus,
        pageNo: requestData.page,
        taskList: taskListForReturn
      });
    }, function(res) {
      if (navigateBackOnError == true) {
        wx.navigateBack();
      }
    });
  }
})