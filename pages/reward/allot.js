// pages/reward/allot.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid ;
var hotel_id;
var page;
/**
 * 为员工分配收益页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    staff_list: [],
    showDisposeProfitWindow:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    wx.hideShareMenu();
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    hotel_id = user_info.hotel_id;
    page = 1;
    /*var reward_integral = options.reward_integral;
    var reward_money = options.reward_money
    that.setData({reward_integral:reward_integral,reward_money:reward_money})*/
    that.getStaffList(openid,hotel_id);
    that.getAssigninfo(openid);

  },
  /**
   * 获取可分配的金额和积分
   */
  getAssigninfo:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/staff/getAssigninfo', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({reward_money:data.result.money,reward_integral:data.result.integral})
    })
  },
  /**
   * 获取酒楼员工列表
   */
  getStaffList:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/staff/stafflist', {
      openid: openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        staff_list : data.result.datalist
      })
    })
  },
  /**
   * 分配窗口打开/关闭
   */
  openAllotWind(e){
    var that = this;
    var open_type = e.target.dataset.open_type;
    if(open_type==1){//打开分派弹窗
      var staff_list = that.data.staff_list;
      var index = e.target.dataset.index;
      var staff_info = staff_list[index];
      that.setData({
        showDisposeProfitWindow:true,
        staff_info:staff_info,
        input_reward_integral:'',
        input_reward_money:'',
      })
    }else{//关闭分配弹窗
      that.setData({
        showDisposeProfitWindow:false,
      })
    }
    
    
  },
  /**
   * 分配金额以及积分
   */
  allotReward:function(e){
    var that = this;
    var staff_id = e.detail.value.staff_id;
    var allot_reward_money = e.detail.value.allot_reward_money;
    var allot_reward_integral = e.detail.value.allot_reward_integral;

    var reward_money = this.data.reward_money;
    var reward_integral = this.data.reward_integral;

    if(allot_reward_money!=''){
      if(!app.isInteger(allot_reward_money)){
        app.showToast('金额请输入整数');
        return false;
      }
      if(allot_reward_money>reward_money){
        app.showToast('输入金额不能大于可分配金额');
        return false;
      }
      
    }
    if( allot_reward_integral!=''){
      if(!app.isInteger(allot_reward_integral)){
        app.showToast('积分请输入整数');
        return false;
      }
      if(allot_reward_integral>reward_integral){
        app.showToast('输入积分不能大于可分配积分');
        return false;
      }
    }
    if(allot_reward_money=='' && allot_reward_integral==''){
      app.showToast('请填写金额或者积分');
      return false;
    }
    wx.showModal({
      title: '确定要完成分配吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/staff/assignMoney', {
            openid: openid,
            staff_id:staff_id,
            money:allot_reward_money,
            integral:allot_reward_integral
          }, (data, headers, cookies, errMsg, statusCode) => {
            app.showToast('分配成功');
            that.setData({
              showDisposeProfitWindow:false,
              reward_integral:data.result.integral ,
              reward_money:data.result.money
            })
          })
        }
      }
    })
    
  },
  gotoFreezeIntegral:function(){
    wx.navigateTo({
      url: '/pages/mine/integral/freeze?openid='+openid+'&hotel_id='+hotel_id,
    })
  },
  //积分奖励详情
  gotoIntegralDetail:function(e){
    wx.navigateTo({
      url: '/pages/reward/integral_detail',
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