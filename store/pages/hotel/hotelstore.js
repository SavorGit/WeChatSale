// store/pages/hotel/hotelstore.js
/**
 * 酒楼库存
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    hotel_name: '',
    list: [
      /*{ goods_id: 122, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", cate_name: "白酒", sepc_name:"500ml", unit_name:"瓶",  viewBt: true, amount: 100  },
      { goods_id: 121, name: "恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩", cate_name: "白酒", sepc_name:"500ml", unit_name:"瓶",  viewBt: true, amount: 100  },
      { goods_id: 120, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", cate_name: "白酒", sepc_name:"500ml", unit_name:"瓶",  viewBt: true, amount: 100  }*/
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    hotel_id = options.hotel_id;
    this.getHotelstock();
  },
  getHotelstock:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/hotelstock', {
      openid: app.globalData.openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var hotel_name = data.result.hotel_name;
      var list = data.result.goods_list;
      var btnTitle = '';
      for(let i in list){
        list[i].amount = list[i].stock_num;
        list[i].viewBt = true;
        if(list[i].stock_num==0){
          var btnTitle = 0;
        }
        
      }
      that.setData({hotel_name:hotel_name,list:list,btnTitle:btnTitle,is_gray:true});

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