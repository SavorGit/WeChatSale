// pages/mine/withdraw.js
/**
 * 积分提现
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
    userIntegral: 12345, // 用户积分
    goodsList: [{
        isCheck: true,
        faceValue: "5元",
        consume: '1000积分'
      },
      {
        isCheck: false,
        faceValue: "10元",
        consume: '1900积分'
      },
      {
        isCheck: false,
        faceValue: "20元",
        consume: '3700积分'
      },
      {
        isCheck: false,
        faceValue: "50元",
        consume: '9100积分'
      },
      {
        isCheck: true,
        faceValue: "100元",
        consume: '18000积分'
      },
      {
        isCheck: true,
        faceValue: "200元",
        consume: '35000积分'
      },
    ], // 商品列表
    notEnoughIntegralWindowShow: false, // 是否弹出没有足够积分窗口
    confirmExchangeGoodsWindowShow: false, // 是否弹出确定兑换窗口
    openGoodsInWindow: {} // 在确认弹窗中打开商品
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
  flushGoodsList: function(e) {
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
   * 兑换商品
   */
  exchangeGoods: function(e) {
    let that = this;
    let goodsListIndex = e.currentTarget.dataset.index;
    let goods = that.data.goodsList[goodsListIndex];
    let goodsConsume = parseInt(goods.consume);
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
    //TODO 发送兑换指令
    console.log('兑换');
    that.setData({
      confirmExchangeGoodsWindowShow: false
    });
  },

  /* **************************** 自定义方法 **************************** */
  loadingData: function(requestData, navigateBackOnError) {
    let that = this;
    util.GetRequest(api_url + '/Smallsale/user/center', requestData, function(data, headers, cookies, errMsg, httpCode) {
      console.log('util.PostRequest', 'success', this, data, headers, cookies, errMsg, httpCode, arguments);
      that.setData({
        pageNo: requestData.page,
        goodsList: data.data
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