// crm/pages/consumer/list.js
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
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
    customListPage: {
      show: true,
      enableBackup: false,
      searchPlaceholder: '输入姓名/手机号',
      topTips: {
        show: true,
        list: ['共123个客户']
      },
      data: [
        {
          id: "1",
          region: "A",
          items: [
            { id: "1", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "2", name: "阿明", phone: '13800138000/13800138000', avatarUrl: '' },
            { id: "3", name: "阿明", phone: '13800138000', avatarUrl: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg' },
            { id: "4", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' }
          ]
        },
        {
          id: "2",
          region: "B",
          items: [
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' },
            { id: "A-MING", name: "阿明", phone: '13800138000', avatarUrl: '' }
          ]
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;

    
  },
  gotoDetail:function(e){
    
    var consumer_id = e.detail.id;
    wx.navigateTo({
      url: '/crm/pages/consumer/detail?id='+consumer_id,
    })
  },
  inputSearch:function(e){
    console.log(e)
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