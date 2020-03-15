// pages/hotel/detail.js
/**
 * 分销 - 餐厅详情页面
 */


const app = getApp()
const utils = require('../../../utils/util.js')
const mta = require('../../../utils/mta_analysis.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
var page = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    is_share: false,
    cart_list: [],
    cart_dish_nums: 0,
    total_price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    merchant_id = options.merchant_id
    openid = options.openid;
    //商家详情
    that.getMerchantInfo(merchant_id);

    //菜品列表
    that.getDishInfo(merchant_id)
    //购物车列表
    that.getCartInfo(merchant_id);

    


  },
  getMerchantInfo: function (merchant_id) {
    var that = this;
    utils.PostRequest(api_v_url + '/merchant/info', {
      merchant_id: merchant_id,
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      is_changeprice: data.result.is_changeprice,
      hotel_info: data.result
    }));
  },
  getDishInfo: function (merchant_id) {
    var that = this;
    utils.PostRequest(api_url + '/Smallapp4/dish/goodslist', {
      merchant_id: merchant_id,
      page: 1,
      type: 2
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      dishes_list: data.result
    }));
  },
  getCartInfo: function (merchant_id) {
    var that = this;
    var cart_list = wx.getStorageSync(cache_key + 'cart_poster' )
    if (cart_list != '') {
      cart_list = JSON.parse(cart_list);
      var total_price = 0;
      var goods_price = 0;
      var cart_dish_nums = 0;
      for (var i = 0; i < cart_list.length; i++) {
        goods_price = app.accMul(cart_list[i].price, cart_list[i].amount)

        total_price = app.plus(total_price, goods_price)
        cart_dish_nums += cart_list[i].amount;

      }
      that.setData({
        cart_list: cart_list,
        cart_dish_nums: cart_dish_nums,
        total_price: total_price,
      })
    }

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
  loadMore: function (e) {
    var that = this;
    page += 1;
    //菜品列表
    utils.PostRequest(api_url + '/Smallapp4/dish/goodslist', {
      merchant_id: merchant_id,
      page: page,
      type: 2
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      dishes_list: data.result
    }));
  },
  /**
   * 下单
   */
  placeOrder: function (e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/hotel/order/account?goods_id=' + goods_id + "&openid=" + openid,
    })
    that.setData({
      showShoppingCartPopWindow: false,
      showShoppingCartWindow: false,
    })

  },
  gotoDisheDetail: function (e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/purchase/dishes/detail?goods_id=' + goods_id + '&openid=' + openid +'&is_share=1',
    })
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    var urls = [];
    for (var i = 0; i < 1; i++) {
      urls[i] = current;
    }
    wx.previewImage({
      current: urls[0], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })

  },
  /**
   * 第三方平台
   */
  gotoPlatform: function (e) {
    // wx.navigateTo({
    //   url: '/pages/hotel/platform/index?merchant_id=' + merchant_id,
    // })
  },
  /**
   * 添加购物车
   */
  addCart: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    var goods_info = e.currentTarget.dataset.goods_info;
    var cart_list = wx.getStorageSync(cache_key + 'cart_poster')
    
    
    
    var cart_dish_nums = 0;
    var hotel_info = that.data.hotel_info;
    if (cart_list == '') {

      let dishesList = that.data.dishes_list;
      dishesList[index].addToCart = true;
      that.setData({ dishes_list: dishesList });
      setTimeout(function () {
        delete dishesList[index].addToCart;
        that.setData({ dishes_list: dishesList });
      }, 500);
      cart_list = [];
      goods_info.amount = 1;
      goods_info.hotel = hotel_info.name;
      goods_info.area_name = hotel_info.area_name
      cart_list.unshift(goods_info);

      for (var i = 0; i < cart_list.length; i++) {
        //goods_price = app.accMul(cart_list[i].price, cart_list[i].amount)

        //total_price = app.plus(total_price, goods_price)
        cart_dish_nums += cart_list[i].amount;
      }
      that.setData({
        cart_list: cart_list,
        cart_dish_nums: cart_dish_nums,
        //total_price: total_price
      })
      cart_list = JSON.stringify(cart_list);
      wx.setStorageSync(cache_key + 'cart_poster' , cart_list)
    } else {
      cart_list = JSON.parse(cart_list)
      if (cart_list.length >= 4) {
        app.showToast('最多可选4个商品');
        return false;
      }
      var is_have = 0;
      for (var i = 0; i < cart_list.length; i++) {
        if (cart_list[i].id == goods_info.id) {
          //cart_list[i].amount += 1;
          is_have = 1;
          break;
        }
      }
      if(is_have==1){
        app.showToast('该菜品已被选中');
        return false;
      }else if (is_have == 0) {
        let dishesList = that.data.dishes_list;
        dishesList[index].addToCart = true;
        that.setData({ dishes_list: dishesList });
        setTimeout(function () {
          delete dishesList[index].addToCart;
          that.setData({ dishes_list: dishesList });
        }, 500);

        goods_info.amount = 1;
        goods_info.hotel = hotel_info.name;
        goods_info.area_name = hotel_info.area_name
        cart_list.unshift(goods_info);
      }

      for (var i = 0; i < cart_list.length; i++) {
        ///goods_price = app.accMul(cart_list[i].price, cart_list[i].amount)

        //total_price = app.plus(total_price, goods_price)
        cart_dish_nums += cart_list[i].amount;
      }
      that.setData({
        cart_list: cart_list,
        cart_dish_nums: cart_dish_nums,
        //total_price: total_price
      })
      cart_list = JSON.stringify(cart_list);
      wx.setStorageSync(cache_key + 'cart_poster' , cart_list)

    }
    app.showToast('添加成功', 2000, 'success')
    mta.Event.stat('addCart', { 'openid': that.data.openid, 'goodsid': goods_info.id })
  },
  
  
  /**
   * 清空购物车
   */
  clearCart: function (e) {
    var that = this;
    wx.removeStorage({
      key: cache_key + 'cart_poster' ,
      success(res) {
        that.setData({
          cart_list: [],
          cart_dish_nums: 0,
          total_price: 0,
        })
        app.showToast('清空成功', 2000, 'success')
      }, fail: function () {
        app.showToast('清空成功')
      }
    })
  },
  setSalePrice:function(e){
    console.log(e)
    var cart_list = wx.getStorageSync(cache_key + 'cart_poster');
    var keys = e.currentTarget.id;
    var price = e.detail.value;
    cart_list = JSON.parse(cart_list)
    if(cart_list.length>=4){
      app.showToast('最多可选4个商品');
      return false;
    }
    if(price!=''){
      var goods_price = Number(cart_list[keys].price)
      if (price < goods_price) {
        app.showToast('不能小于商品原价格');
        return false;
      }

      cart_list[keys].set_price = price;
      console.log(cart_list)
    }else{
      cart_list[keys].set_price = '';
    }
    cart_list = JSON.stringify(cart_list);
    wx.setStorageSync(cache_key + 'cart_set_poster' , cart_list)
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //菜品列表
    utils.PostRequest(api_url + '/Smallapp4/dish/goodslist', {
      merchant_id: merchant_id,
      page: page,
      type: 2
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      dishes_list: data.result
    }));
    var cart_list = wx.getStorageSync(cache_key + 'cart_poster' )
    if (cart_list != '') {
      cart_list = JSON.parse(cart_list);
      that.setData({
        cart_list: cart_list
      })
    } else {
      that.setData({
        cart_list: [],
        cart_dish_nums: 0,
        total_price: 0
      })
    }
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
    var that = this;
    page += 1;
    //菜品列表
    utils.PostRequest(api_url + '/Smallapp4/dish/goodslist', {
      merchant_id: merchant_id,
      page: page,
      type: 2
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      dishes_list: data.result
    }));
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    

  },

  // 打开购物车弹窗
  openShoppingCartWindow: function (e) {
    let self = this;
    self.setData({ showShoppingCartPopWindow: true, showShoppingCartWindow: true });

  },

  // 关闭购物车弹窗
  closeShoppingCartWindow: function (e) {
    let self = this;
    self.setData({ showShoppingCartWindow: false });
    setTimeout(function () {
      self.setData({ showShoppingCartPopWindow: false });
    }, 500);
  },

  // 跳转到海报页
  gotoPoster: function (e) {
    let self = this;
    var post_list = wx.getStorageSync(cache_key + 'cart_poster');
    if(post_list!=''){
      wx.navigateTo({
        url: '/pages/purchase/share/poster?merchant_id=' + merchant_id + '&openid=' + openid + "&merchant_name=" + self.data.hotel_info.name,
      });
      self.closeShoppingCartWindow();
    }else {
      app.showToast('请选择菜品')
    }
    
  }
})