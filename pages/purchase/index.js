// pages/purchase/index.js
/**
 * 代购 - 主页
 */


Page({

  /**
   * 页面的初始数据
   */
  data: {

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


  // 页面跳转
  gotoPage: function (e) {
    let self = this;
    let pageType = e.currentTarget.dataset.page;
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    });
    switch (pageType) {
      case 'foods':
        wx.navigateTo({
          url: '/pages/purchase/merchant/index',
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      case 'share':
        wx.navigateTo({
          url: '/pages/purchase/share/index',
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      case 'order':
        wx.navigateTo({
          url: '/pages/purchase/order/index',
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      case 'recod':
        wx.navigateTo({
          url: '/pages/purchase/share/log',
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      default:
        wx.showToast({
          icon: 'none',
          title: '无此页面',
        });
        break;
    }
  }
})