// pages/welcome/index.js
const utils = require('../../utils/util.js')
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    openid = user_info.openid;
    if (user_info.hotel_id == -1) {
      hotel_id = user_info.select_hotel_id;
    } else {
      hotel_id = user_info.hotel_id;
    }

    utils.PostRequest(api_url + '/Smallsale14/welcome/getwelcomelist', {
      page: page,
      hotel_id:hotel_id,
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data);
      that.setData({
        list:data.result.datalist,
      })
    });
  },
  /**
   * 停止播放
   */
  stopPlay:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '您确认要停止播放吗？',
      content: '停止播放后该欢迎词将不会再出现在列表中!',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_url + '/Smallsale14/welcome/stopplay', {
            openid: openid,
            hotel_id: hotel_id,
            welcome_id: id,
          }, (data, headers, cookies, errMsg, statusCode) => {
            var list = that.data.list;
            list.splice(index, 1)
            that.setData({
              list: list,
            })
            app.showToast('操作成功');
          });
        }
      }
    })
    
  },
  
  /**
   * 立即播放
   */
  startPlay:function(e){ 
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = that.data.list;
    wx.showModal({
      title: '您确定要立即播放该欢迎词吗?',
      success:function(res){
        if(res.confirm){
          utils.PostRequest(api_url + '/Smallsale14/welcome/startplay', {
            openid: openid,
            hotel_id: hotel_id,
            welcome_id: id,
            type: 1
          }, (data, headers, cookies, errMsg, statusCode) => {
            list[index].status = 1;
            that.setData({
              list: list,
            })
            app.showToast('操作成功');
          });
        }
      }
    })
    
  },
  /**
   * 删除
   */
  delItem:function(e){
    var that  = this;
    var index = e.currentTarget.dataset.index;
    var id    = e.currentTarget.dataset.id;
    var list  = that.data.list;
    wx.showModal({
      title: '您确定要删除该欢迎词吗?',
      content: '删除后该欢迎词将不会再出现在列表中!',
      success:function(res){
        if(res.confirm){
          utils.PostRequest(api_url + '/Smallsale14/welcome/removeplay', {
            openid: openid,
            hotel_id: hotel_id,
            welcome_id: id
          }, (data, headers, cookies, errMsg, statusCode) => {

            list.splice(index, 1);
            that.setData({
              list: list,
            })
            app.showToast('删除成功');
          });
        }
      }
    })
    

    
  },

  /**
   * 新建欢迎词
   */
  createWelcome:function(e){
    wx.navigateTo({
      url: '/pages/welcome/hotel_add',
    })
  },
  /**
   * 分页加载列表
   */
  loadMore:function(e){
    var that = this;
    page +=1;
    utils.PostRequest(api_url +'/Smallsale14/welcome/getwelcomelist',{
      openid:openid,
      hotel_id:hotel_id,
      page: page
    }, (data, headers, cookies, errMsg, statusCode)=>{
      that.setData({
        list: data.result.datalist,
      })
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