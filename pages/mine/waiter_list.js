// pages/mine/waiter_list.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var page = 1;
var is_scangoods;
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    showPurviewManageWindow: false// 是否显示权限管理弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    var that = this;
    
    utils.PostRequest(api_v_url + '/staff/stafflist', {
      openid: openid,
      hotel_id:0,
      page: 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      is_scangoods = data.result.user.is_scangoods
      that.setData({
        waiter_list: data.result.datalist,
        user_info:data.result.user,
        is_scangoods:is_scangoods
      })
    })
  },
  /**
   * 移除服务员
   */
  remove_waiter: function (e) {
    var that = this;
    console.log(e);
    //var user_id = e.currentTarget.dataset.user_id;
    var invite_id = e.currentTarget.dataset.invite_id;
    var openid = e.currentTarget.dataset.openid;
    var index = e.currentTarget.dataset.keys;
    var waiter_list = e.currentTarget.dataset.waiter_list;
    utils.tryCatch(getApp().globalData.uma.trackEvent('waiterList_clickRemoveWaiter', {'open_id':getApp().globalData.openid,'remove_openid':openid}));
    

    utils.PostRequest(api_v_url + '/user/removeEmployee', {
      invite_id: invite_id,
      openid: openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      //去掉移除的服务员 生成新的服务员列表
      waiter_list.splice(index,1);
      that.setData({
        waiter_list: waiter_list
      })
    })
  },
  /**
   * 查看服务员详情
   */
  waiter_detail: function (e) {
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/mine/team_member_detail?openid=' + openid,
    })

  },
  handleCheckboxChange:function(e){
    var that = this;
    var vals = e.detail.value;
    if(vals.lengh==0){
      //值设置为0
      is_scangoods = 0;

    }else {
      is_scangoods = 1;
    }
    that.setData({
      is_scangoods: is_scangoods
    })
  },
  /**
   * 设置二级员工权限
   */
  savePower:function(e){
    console.log(e)
    var that = this;
    var is_scangoods = e.detail.value.is_scangoods;
    var staff_id = e.detail.value.staff_id
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    utils.PostRequest(api_v_url + '/staff/setPermission', {
      openid: user_info.openid,
      is_scangoods: is_scangoods,
      staff_id: staff_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        showPurviewManageWindow: false,
      })
      app.showToast('保存成功');
    })
  },
  editUserInfo:function(e){
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/hotel/setting/personalinfo?openid='+openid+'&is_my=false',
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

  },

  // 打开权限管理弹窗
  openPurviewManageWindow: function (e) {
    let self = this;
    self.setData({ showPurviewManageWindow: true });
  },

  // 关闭权限管理弹窗
  closePurviewManageWindow: function (e) {
    let self = this;
    self.setData({ showPurviewManageWindow: false });
  }
})