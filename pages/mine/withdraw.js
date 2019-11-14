// pages/mine/withdraw.js
/**
 * 积分提现
 */
const util = require('../../utils/util.js');
const app = getApp()
const api_url = app.globalData.api_url;
const cache_key = app.globalData.cache_key;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1, // 当前页码
    userIntegral: 0, // 用户积分
    goodsList: [], // 商品列表
    notEnoughIntegralWindowShow: false, // 是否弹出没有足够积分窗口
    confirmExchangeGoodsWindowShow: false, // 是否弹出确定兑换窗口
    openGoodsInWindow: {}, // 在确认弹窗中打开商品
    exchangeGoodsSuccess: {} // 兑换成功后的提示
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
    that.loadingData({
      hotel_id: userInfo.hotel_id,
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
   * 兑换商品
   */
  exchangeGoods: function(e) {
    let that = this;
    let goodsListIndex = e.currentTarget.dataset.index;
    let goods = that.data.goodsList[goodsListIndex];
    let goodsConsume = parseInt(goods.integral);
    if (that.data.userIntegral < goodsConsume) {
      that.setData({
        notEnoughIntegralWindowShow: true
      });
      return;
    }
    that.setData({
      confirmExchangeGoodsWindowShow: true,
      openGoodsInWindow: that.data.goodsList[goodsListIndex]
    });
  },

  /**
   * 关闭积分不足弹窗
   */
  closeNotEnoughIntegralWindow: function(e) {
    let that = this;
    that.setData({
      notEnoughIntegralWindowShow: false
    });
  },

  /**
   * 关闭兑换确认弹窗
   */
  closeConfirmExchangeGoodsWindow: function(e) {
    let that = this;
    that.setData({
      confirmExchangeGoodsWindowShow: false
    });
  },

  /**
   * 确认兑换商品
   */
  confirmExchangeGoods: function(e) {
    let that = this;
    // console.log('兑换', e);
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    // let goodsId = e.currentTarget.dataset.goodsId;
    let requestData = {
      id: that.data.openGoodsInWindow.id,
      hotel_id: userInfo.hotel_id,
      openid: userInfo.openid
    };
    util.PostRequest(api_url + '/Smallsale14/withdraw/wxchange', requestData, function(data, headers, cookies, errMsg, httpCode) {
      // console.log('confirmExchangeGoods', 'success', this, data, headers, cookies, errMsg, httpCode);
      // console.log('confirmExchangeGoods', 'success', this, data, headers, cookies, errMsg, httpCode, arguments);
      if (typeof(data) != 'object' || typeof(data.result) != 'object') {
        wx.showToast({
          title: "服务器返回数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000
        });
        return;
      }
      let userIntegral = data.result.integral;
      if (typeof(userIntegral) != 'number' && typeof(userIntegral) != 'string') {
        wx.showToast({
          title: "服务器返回积分数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000
        });
        return;
      }
      if (that.data.openGoodsInWindow.is_audit == 1) { // 需审核
        that.setData({
          userIntegral: userIntegral,
          exchangeGoodsCheckWindowShow: true,
          exchangeGoodsSuccess: data.result
        });
      } else { // 无审核
        that.setData({
          userIntegral: data.result.integral,
          exchangeGoodsWindowShow: true,
          exchangeGoodsSuccess: data.result
        });
      }
    }, function(res) {
      // wx.navigateBack();
    });
  },

  /* **************************** 自定义方法 **************************** */
  loadingData: function(requestData, navigateBackOnError) {
    let that = this;
    util.PostRequest(api_url + '/Smallsale14/withdraw/getMoneyList', requestData, function(data, headers, cookies, errMsg, httpCode) {
      // console.log('loadingData', 'success', this, data, headers, cookies, errMsg, httpCode, arguments);
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
      let userIntegral = data.result.integral;
      if (typeof(userIntegral) != 'number' && typeof(userIntegral) != 'string') {
        wx.showToast({
          title: "服务器返回积分数据错误！请用联系管理员。",
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
      let goodsListForReturn = data.result.datalist;
      if (!goodsListForReturn instanceof Array) {
        wx.showToast({
          title: "服务器返回兑换列表错误！请用联系管理员。",
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
      } else if (goodsListForReturn.length < 1) {
        wx.showToast({
          title: "该商家没有配置兑换列表！",
          icon: 'none',
          mask: true,
          duration: 5000
        });
      }
      that.setData({
        userIntegral: userIntegral,
        goodsList: goodsListForReturn
      });
    }, function(res) {
      if (navigateBackOnError == true) {
        wx.navigateBack();
      }
    });
  }
})