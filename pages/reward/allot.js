// pages/reward/allot.js

/**
 * 为员工分配收益页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    staff_list: [
      {
        id: '001',
        name: '张三',
        head: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg'
      },
      {
        id: '001',
        name: '张大',
        head: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg'
      }
    ],
    staff: {
      id: '001',
      name: '张大',
      head: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ showDisposeProfitWindow: true });
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