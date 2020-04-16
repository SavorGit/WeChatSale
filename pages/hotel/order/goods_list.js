// pages/hotel/order/goods_list.js
/**
 * 商城订单列表页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
var type;
var order_status ;
var page_all ;      //全部订单
var page_dealing ;  //待处理
var page_ship ;    //待发货
var page_complete  ;//已完成

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_status: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    page_all = 1;      //全部订单
    page_dealing = 1;  //待处理
    page_ship = 1;     //待发货
    page_complete = 1; //已完成
    var that = this;
    openid = options.openid
    order_status = options.order_status
    that.setData({
      order_status: order_status
    })
    merchant_id = options.merchant_id;
    type = options.type;

    that.getOrderList(openid,merchant_id,0,1);
    that.getOrderList(openid, merchant_id, 1, 1);
    that.getOrderList(openid, merchant_id, 2, 1);
    that.getOrderList(openid, merchant_id, 3, 1);


  },
  getOrderList:function(openid,merchant_id,order_status,page){
    var that = this;
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: page,
      status: order_status,
      type, type
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(order_status==0){
        that.setData({
          all_order_list: data.result.datalist
        })
      }else if(order_status==1){
        that.setData({
          deal_order_list: data.result.datalist
        })
      }else if(order_status==3){
        that.setData({
          ship_order_list: data.result.datalist
        })
      }else if(order_status==2){
        that.setData({
          complete_order_list: data.result.datalist
        })
      }
      
    })
  },
  //接单
  orderReceive:function(e){
    
    var that = this;
    var order_id = e.currentTarget.dataset.order_id;
    var keys = e.currentTarget.dataset.keys;

    var order_status = that.data.order_status
    //var user_info = wx.getStorageSync(cache_key + 'userinfo');
    
    wx.showModal({
      title: '提示',
      content: '确认接单',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/order/orderReceive', {
            action: 1,
            openid: openid,
            order_id: order_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            app.showToast('操作成功');
            if (order_status == 0) {//全部订单
              //全部订单改状态
              var all_order_list = that.data.all_order_list;
              all_order_list[keys].status = 52;
              all_order_list[keys].status_str = '待发货';
              that.setData({ all_order_list: all_order_list})
              //待处理更新列表
              that.getOrderList(openid, merchant_id, 1, page_dealing);

              //待发货更新列表
              that.getOrderList(openid, merchant_id, 3, page_ship);
            }else if(order_status==1){//待处理
              var deal_order_list = that.data.deal_order_list;
              //删除待处理订单列表
              deal_order_list.splice(keys, 1)
              that.setData({deal_order_list:deal_order_list})
              //更新全部订单列表
              that.getOrderList(openid, merchant_id, 0, page_all);
              //代发货更新列表
              that.getOrderList(openid, merchant_id, 3, page_ship);
            }
          })
        }
      }
    })

  },
  //发货
  onShip:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/hotel/order/goods_tracking_number?order_id='+order_id+'&openid='+openid,
    })
  },
  gotoOrderDetail:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    var order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/hotel/order/goods_detail?openid=' + openid + '&order_id=' + order_id,
    })
  },
  loadMore:function(e){
    var that = this;
    var order_status = that.data.order_status;
    if(order_status==0){
      page_all +=1;
      var page = page_all;
    }else if(order_status==1){
      page_dealing +=1;
      var page = page_dealing;
    }else if(order_status==3){
      page_ship +=1;
      var page = page_ship
    }else if(order_status==2){
      page_complete +=1;
      var page = page_complete;
    }
    console.log(order_status)
    console.log(page)
    that.getOrderList(openid,merchant_id,order_status,page);
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
    var that = this;
    that.getOrderList(openid, merchant_id, 0, page_all);
    that.getOrderList(openid, merchant_id, 1, page_dealing);
    that.getOrderList(openid, merchant_id, 3, page_ship);
    that.getOrderList(openid, merchant_id, 2, page_complete);
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


  // 选项卡选择
  showTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.order_status;
    self.setData({
      order_status: tabType
    });
  }
})