// pages/task/index.js
/**
 * 任务列表
 */

const util = require('../../utils/util.js');
const app = getApp()
const api_url = app.globalData.api_url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1, // 当前页码
    taskList: [{
        name: '电视开机',
        icon: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        profit: 120,
        progress: '今日获得积分',
        detail: '1.用餐时间打开餐厅内安装热点投屏设备的电视；2.在销售端首页-包间信息中对自己开机的；3.每天包含两个用餐时段，11:00-14:00,18:00-21:00；4.电视在单独用餐时段内开机大于1小时则奖励10积分。'
      },
      {
        name: '食客电视互动',
        icon: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        profit: 0,
        progress: '今日获得积分',
        detail: '1.用餐时间打开餐厅内安装热点投屏设备的电视；2.在销售端首页-包间信息中对自己开机的；3.每天包含两个用餐时段，11:00-14:00,18:00-21:00；4.电视在单独用餐时段内开机大于1小时则奖励10积分。'
      },
      {
        name: '电视开机',
        icon: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        profit: 120,
        progress: '今日获得积分',
        detail: '1.用餐时间打开餐厅内安装热点投屏设备的电视；2.在销售端首页-包间信息中对自己开机的；3.每天包含两个用餐时段，11:00-14:00,18:00-21:00；4.电视在单独用餐时段内开机大于1小时则奖励10积分。'
      }
    ], // 任务列表数据
    taskDetailWindowShow: false, // 是否吊起任务详情弹窗
    openTaskInWindow: {} // 在任务详情弹窗中打开任务
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    this.loadingData({
      page: 1,
      pageSize: 20
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
    console.log('flushTaskList', e);
    this.loadingData({
      pageNo: 1,
      pageSize: 20
    });
  },

  /**
   * 加载下页面数据
   */
  loadingNextPageData: function(e) {
    let that = this;
    console.log('loadingNextPageData', e);
    this.loadingData({
      pageNo: that.data.pageNo++,
      pageSize: 20
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

  /* **************************** 自定义方法 **************************** */
  loadingData: function(requestData, navigateBackOnError) {
    let that = this;
    util.GetRequest(api_url + '/Smallsale/user/center', requestData, function(data, headers, cookies, errMsg, httpCode) {
      console.log('util.PostRequest', 'success', this, data, headers, cookies, errMsg, httpCode, arguments);
      that.setData({
        pageNo: requestData.page,
        taskList: data.data
      });
    }, function(res) {
      if (navigateBackOnError == true) {
        wx.navigateBack();
      }
    });
    // util.PostRequest(api_url, {}, function(data, headers, cookies, errMsg, httpCode) {
    //   console.log('util.PostRequest', 'success', this, data, headers, cookies, errMsg, httpCode, arguments);
    // }, function(res) {
    //   console.log('util.PostRequest', 'fail', res);
    // });
  }
})