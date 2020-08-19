// pages/hotel/help/list.js
/**
 * 酒楼帮助列表页面
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      'id': 'D-001',
      'name': '电视节目如何切换'
    }]
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

  },

  /**
   * 跳转到详情页
   */
  gotoDetail: function (e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let bean = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/hotel/help/detail?id=' + bean.id,
    })
  }
})