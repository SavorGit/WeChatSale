// pages/mine/post_book/index.js
const app = getApp()
var uma = app.globalData.uma;
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_info:{'select_room_name':'--请选择包间--','box_index':0,'book_time':'','book_name':''}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    this.getRoomlist(openid,hotel_id);
  },
  getRoomlist:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRoomList', {
      openid: openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var book_info = that.data.book_info;
      book_info.select_room_name = data.result.box_name_list[0];

      that.setData({
        objectBoxArray: data.result.box_name_list,
        box_list: data.result.box_list,
        book_info:book_info
      })
    })
  },
  selectRoom:function(e){
    var keys = e.detail.value;
    var objectBoxArray = this.data.objectBoxArray;
    var book_info = this.data.book_info;
    book_info.box_index = keys;
    book_info.select_room_name = objectBoxArray[keys];
    this.setData({book_info:book_info})
  },
  handleChange:function(e){
    var book_info = this.data.book_info;
    var select_time = e.detail.dateString;
    //select_time = select_time.slice(0,13);
    book_info.book_time = select_time;
    this.setData({book_info:book_info})
  },
  inputBookName:function(e){
    var book_name = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.book_name = book_name;
    this.setData({book_info:book_info})

  },
  confirmBookInfo:function(){
    var book_info = this.data.book_info;
    if(book_info.book_time==''){
      app.showToast('请输选择预定时间');
      return false;
    }
    if(book_info.name==''){
      app.showToast('请输选择预定人称呼');
      return false;
    }
    var box_list = this.data.box_list;
    var box_index = book_info.box_index;    
    var box_mac = box_list[box_index].box_mac;


    utils.PostRequest(api_v_url + '/invitation/confirminfo', {
      openid: openid,
      box_mac:box_mac,
      hotel_id:hotel_id,
      book_time:book_info.book_time,
      name:book_info.book_name
    }, (data, headers, cookies, errMsg, statusCode) => {
      var  invitation_id = data.result.invitation_id
      wx.navigateToMiniProgram({
        appId: 'wxfdf0346934bb672f',
        path:'/mall/pages/wine/post_book/index?id='+invitation_id+'&status=0',
        envVersion:'trial'
      })
      uma.trackEvent('postbook_confirm',{'open_id':openid,'hotel_id':hotel_id})
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