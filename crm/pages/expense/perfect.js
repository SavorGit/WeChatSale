// crm/pages/expense/perfect.js

/**
 * 完善消费记录页
 */
const app = getApp()
const utils = require('../../../utils/util.js')

var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room_list:[],
    room_name_list:[],
    lable_list:[],
    consumer_info:{customer_id:0,mobile:'',name:'',room_id:0,room_index:0,meal_time:'',people_num:'',money:''}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid   = app.globalData.openid;
    hotel_id = options.hotel_id;
    var consumer_info = this.data.consumer_info;
    var customer_id   = options.customer_id;
    var mobile        = options.mobile;
    var name          = options.name;
    var room_id       = options.room_id;
    var book_time     = options.book_time;
    
    consumer_info.customer_id = customer_id;
    consumer_info.mobile      = mobile;
    consumer_info.name        = name;
    consumer_info.room_id     = room_id;
    consumer_info.meal_time   = book_time;

    wx.removeStorageSync(cache_key+'customer_lable');
    this.getRoomList(openid,hotel_id,room_id,consumer_info);

    this.getLables(openid,customer_id);
  },
  getRoomList:function(openid,hotel_id,room_id,consumer_info){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRooms', {
      hotel_id: hotel_id,
      openid  : openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var room_list = data.result.room_list;
      var room_index = data.result.room_index;
      var room_name_list = data.result.room_name_list
      console.log(room_id)
      for(let i in room_list){
        if(room_list[i].id==room_id){
          room_index = i;
          break;
        }
      }
      console.log(room_index)
      consumer_info.room_index = room_index;
      that.setData({
        room_list      : room_list,
        room_name_list : room_name_list,
        consumer_info  : consumer_info
      })
    })
  },
  getLables:function(openid,customer_id){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/getLabels', {
      openid        : openid,
      customer_id  : customer_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({lable_list:data.result.datalist})
    })
    
  },
  inputInfo:function(e){
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var consumer_info = this.data.consumer_info;
    var input_value = e.detail.value;
    switch(type){
      case 'name':
        consumer_info.name = input_value;
        break;
      case 'people_num':
        consumer_info.people_num = input_value;
        break;
      case 'money':
        consumer_info.money = input_value;
        break;
    }
    console.log(consumer_info)
    this.setData({consumer_info:consumer_info});
  },
  chooseRoom:function(e){
    var room_index = e.detail.value;
    var room_list = this.data.room_list;
    var consumer_info = this.data.consumer_info;

    var room_id = room_list[room_index].id;
    consumer_info.room_index = room_index
    consumer_info.room_id = room_id;
    console.log(consumer_info)
    this.setData({consumer_info:consumer_info})
  },
  handleChange:function(e){
    console.log(e)
    var consumer_info = this.data.consumer_info;
    var select_time = e.detail.dateString;
    //select_time = select_time.slice(0,13);
    consumer_info.meal_time = select_time;
    this.setData({consumer_info:consumer_info})
  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    var consumer_info = this.data.consumer_info;
    
    var url = '';
    if(type=='lable'){
      url = '/crm/pages/consumer/label?customer_id='+consumer_info.customer_id ;
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var lable_info = wx.getStorageSync(cache_key+'customer_lable');
    if(lable_info!=''){
      console.log(lable_info)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})