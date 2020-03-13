// pages/mine/setting/list.js
/**
 * 设置列表页面
 */


Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
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

  // 跳转页面
  gotoSetting: function (e) {
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    });
    let jumpType = e.currentTarget.dataset.type;
    switch (jumpType) {
      case 'basic':
        wx.navigateTo({
          url: '/pages/hotel/setting/basic',
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'distribution':
        wx.navigateTo({
          url: '/pages/hotel/setting/distribution',
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'customer-pay':
        wx.navigateTo({
          url: '/pages/hotel/setting/customer_pay',
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'third-platform':
        wx.navigateTo({
          url: '/pages/hotel/platform/index',
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'agent-setting':
        wx.navigateTo({
          url: '/pages/hotel/setting/agent_setting',
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      default:
        wx.showToast({
          icon: 'none',
          title: '无此类型',
        });
        break;
    }
  }
})