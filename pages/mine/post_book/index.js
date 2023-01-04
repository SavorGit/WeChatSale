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
    book_info:{'select_room_name':'--请选择包间--','room_index':0,'book_time':'','book_name':'','nums':'','mobile':'','hotel_contract':'','hotel_tel':'','template_id':0},
    themes_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    this.getRoomlist(openid,hotel_id);
    this.getThemes(openid,hotel_id);
  },
  getRoomlist:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRooms', {
      hotel_id:hotel_id,
      
    }, (data, headers, cookies, errMsg, statusCode) => {
      var book_info = that.data.book_info;
      book_info.select_room_name = data.result.room_name_list[0];

      that.setData({
        objectBoxArray: data.result.room_name_list,
        box_list: data.result.room_list,
        book_info:book_info
      })
    })
  },
  getThemes:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/invitation/themes', {
      hotel_id:hotel_id,
      openid:openid,
      version:app.globalData.small_app_version
    }, (data, headers, cookies, errMsg, statusCode) => {
      var themes_list = data.result.datalist;
      that.setData({themes_list:themes_list})
    })
    
  },
  selectRoom:function(e){
    var keys = e.detail.value;
    var objectBoxArray = this.data.objectBoxArray;
    var book_info = this.data.book_info;
    book_info.room_index = keys;
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
  inputBookNums:function(e){
    var nums = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.nums = nums;
    this.setData({book_info:book_info});
  },
  inputBookMobile:function(e){
    var mobile = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.mobile = mobile;
    this.setData({book_info:book_info});
  },
  inputHotelContract:function(e){
    var hotel_contract = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.hotel_contract = hotel_contract;
    this.setData({book_info:book_info});
  },
  inputHotelTel:function(e){
    var hotel_tel = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.hotel_tel = hotel_tel;
    this.setData({book_info:book_info});
  },
  selectTemplate:function(e){
    var template_id = e.detail.value;
    var book_info = this.data.book_info;
    book_info.template_id = template_id;
    this.setData({book_info:book_info});
  },
  confirmBookInfo:function(e){
    console.log(e)
    var post_type = e.currentTarget.dataset.post_type
    var book_info = this.data.book_info;
    if(book_info.book_time==''){
      app.showToast('请选择预定时间');
      return false;
    }
    
    if(book_info.nums=='' || book_info.nums<1){
      app.showToast('请输入预定就餐的人数');
      return false;
    }
    if(book_info.book_name==''){
        app.showToast('请输入预定人称呼');
        return false;
      }
    if(book_info.mobile=='' ){
      app.showToast('请输入预定人的手机号码');
      return false;
    }
    if(!app.checkMobile(book_info.mobile)){
      app.showToast('请输入正确的手机号');
      return false; 
    }
    if(book_info.template_id==0){
      app.showToast('请选择邀请函模板');
      return false;
    }
    console.log(book_info)
    var box_list = this.data.box_list;
    var room_index = book_info.room_index;    
    var room_id = box_list[room_index].id;
    
    utils.PostRequest(api_v_url + '/invitation/confirminfo', {
      openid: openid,
      room_id:room_id,
      hotel_id:hotel_id,
      book_time:book_info.book_time,
      name:book_info.book_name,
      people_num:book_info.nums,
      mobile:book_info.mobile,
      contact_name: book_info.hotel_contract,
      contact_mobile:book_info.hotel_tel,
      theme_id:book_info.template_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var  invitation_id = data.result.invitation_id
      if(post_type=='smallapp'){
        wx.navigateToMiniProgram({
          appId: 'wxfdf0346934bb672f',
          path:'/mall/pages/wine/post_book/index?id='+invitation_id+'&status=0',
          envVersion:'trial'
        })
      }else if(post_type=='message'){
        app.showToast('发送成功',2000,'success');
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
      
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