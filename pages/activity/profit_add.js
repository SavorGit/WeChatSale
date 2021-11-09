// pages/activity/profit_add.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var hotel_id;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_button_disable:false,
    select_room_name:'---请选择---',
    select_box_mac:'',
    is_checked:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid   = options.openid;
    hotel_id = options.hotel_id;
    this.getRoomList();
  },
  getRoomList:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getWelcomeBoxlist', {
      hotel_id: hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        objectBoxArray: data.result.box_name_list,
        box_list: data.result.box_list
      })
    })
  },
  selectRoom:function(e){
    console.log(e)
    var that = this;
    var keys = e.detail.value;
    var box_list = that.data.box_list
    var select_room_name = '';
    var select_box_mac = ''; 
    for(let i in box_list){
      if(i == keys){
        box_list[i].is_select = 1
        select_room_name = box_list[i].name;
        select_box_mac   = box_list[i].box_mac;
      }
    }
    that.setData({box_list:box_list,select_room_name:select_room_name,select_box_mac:select_box_mac})
  },
  addProfite:function(e){
    var that = this;
    var activity_name = e.detail.value.activity_name.replace(/\s+/g, '');
    var select_box_mac = that.data.select_box_mac;
    var prize1 = e.detail.value.prize1.replace(/\s+/g, '');
    var prize2 = e.detail.value.prize2.replace(/\s+/g, '');
    var rcontent = e.detail.value.rcontent.replace(/\s+/g, '');

    if(activity_name==''){
      app.showToast('请填写活动名称');
      return false;
    }
    if(prize1==''){
      app.showToast('请填写奖品1');
      return false;
    }
    if(prize2==''){
      app.showToast('请填写奖品2');
      return false;
    }
    if(rcontent==''){
      app.showToast('请填写规则');
      return false;
    }
    if(select_box_mac==''){
      app.showToast('请选择活动包间');
      return false;
    }
    var is_checked = that.data.is_checked;
    if(is_checked){
      var is_compareprice = 1;
    }else {
      var is_compareprice = 0;
    }

    wx.showModal({
      title: '确定要完成保存吗？',
      //content: '当前电视正在进行投屏,继续投屏有可能打断当前投屏中的内容.',
      success: function (res) {
        if (res.confirm) {
          that.setData({add_button_disable:true});
          utils.PostRequest(api_v_url + '/activity/addJuactivity', {
            hotel_id: hotel_id,
            openid,openid,
            activity_name:activity_name,
            box_mac:select_box_mac,
            prize1:prize1,
            prize2:prize2,
            rcontent:rcontent,
            is_compareprice:is_compareprice

          }, (data, headers, cookies, errMsg, statusCode) => {
            that.setData({add_button_disable:false})
            wx.showToast({
              title: '添加成功',
              icon:'success',
              duration:2000,
              mask:true,
              success:function(){
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          },res=>{
            that.setData({add_button_disable:false})
          })
        }
      }
    })
  },
  comPrice:function(e){
    console.log(e)
    var is_checked = e.detail.value;
    this.setData({is_checked:is_checked})
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