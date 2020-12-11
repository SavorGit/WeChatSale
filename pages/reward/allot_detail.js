// pages/reward/allot_detail.js

/**
 * 为员工收益明细页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    integralTypeNameArr: ['全部'],
    integralTypeIndex: 0,
    integralDateNameArr: ['2020年12月'],
    integralDateIndex: 0,
    profit_list: [
      {
        id: '001',
        name: '张三',
        head: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg',
        dateTime: '2020.12.01  9:00',
        profit: '+100分'
      },
      {
        id: '001',
        name: '张大',
        head: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg',
        dateTime: '2020.12.01  9:00',
        profit: '+1元'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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