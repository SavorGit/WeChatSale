// pages/hotel/dishes/detail.js
/**
 * 菜品详情页面
 */


const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var goods_id;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    is_share: false,
    amount: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    openid = options.openid;
    goods_id = options.goods_id;   
    var is_share = 0;
    if (typeof (options.is_share)!='undefined'){
      var is_share = options.is_share
    }
    that.setData({
      openid:openid,
      goods_id:goods_id,
      is_share: is_share
    })
      //菜品详情
    that.getDishInfo(goods_id)
  },
  getDishInfo: function (goods_id) {
    var that = this;
    utils.PostRequest(api_url + '/Smallapp4/dish/detail', {
      goods_id: goods_id,
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      goods_info: data.result,
      merchant: data.result.merchant
    }), function () {
      var is_share = that.data.is_share
      if (is_share == true) {
        wx.reLaunch({
          url: '/pages/demand/index',
        })

      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  /**
   * 拨打订餐电话
   */
  phonecallevent: function (e) {
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })

  },
  gotoHotelDetail: function (e) {
    var that = this;
    var is_share = that.data.is_share;
    var merchant_id = e.currentTarget.dataset.merchant_id;
    if(is_share==0){
      wx.navigateTo({
        url: '/pages/purchase/merchant/detail?merchant_id=' + merchant_id+'&openid='+openid,
      })
    }else {
      wx.navigateTo({
        url: '/pages/purchase/share/detail?merchant_id=' + merchant_id+'&openid='+openid,
      })
    }
    
  },
  gotoPlaceOrder: function (e) {
    var self = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    var openid = e.currentTarget.dataset.openid;
    var amount = e.currentTarget.dataset.amount;
    if (self.data.showChangeOrderGoodsPopWindow) {
      wx.navigateTo({
        url: '/pages/purchase/order/account?goods_id=' + goods_id + "&openid=" + openid + '&order_type=1&merchant_name=' + this.data.merchant.name + '&merchant_id=' + this.data.merchant.merchant_id + '&amount=' + amount,
        success: function (res) {
          self.closeChangeOrderGoodsWindow(e);
        }
      })
    } else {
      self.openChangeOrderGoodsWindow(e);
    }
  },
  cutNum: function (e) {
    var amount = this.data.amount;
    amount = Number(amount);
    if (amount == 1) {
      app.showToast('数量不能小于1');
      return false;
    }
    amount -= 1;
    this.setData({
      amount: amount
    })

  },
  addNum: function (e) {
    var amount = this.data.amount;
    amount = Number(amount);
    amount += 1;
    this.setData({
      amount: amount
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
    //wx.removeStorageSync(cache_key + 'select_address_info')
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
  onShareAppMessage: function (e) {
    
  },

  // 打开更改订单商品弹窗
  openChangeOrderGoodsWindow: function (e) {
    let self = this;
    self.setData({ showChangeOrderGoodsPopWindow: true, showChangeOrderGoodsWindow: true });

  },

  // 关闭更改订单商品弹窗
  closeChangeOrderGoodsWindow: function (e) {
    let self = this;
    self.setData({ showChangeOrderGoodsWindow: false });
    setTimeout(function () {
      self.setData({ showChangeOrderGoodsPopWindow: false });
    }, 500);
  }
})