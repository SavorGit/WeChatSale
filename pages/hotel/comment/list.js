// pages/hotel/comment.js
const app = getApp()
const utils = require('../../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
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
    hotel_id = options.hotel_id;
    openid   = options.openid;
    that.getCommnetList();
  },
  getCommnetList:function(start_date='',end_date=''){
    var that = this;
    utils.PostRequest(api_v_url + '/comment/hotelcommentlist', {
      openid: openid,
      hotel_id:hotel_id,
      start_date:start_date,
      end_date:end_date,
      page: page,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        comment_list: data.result.datalist,
        comment_total: data.result.total,
        comment_avg_score: data.result.avg_score,
        start_date: data.result.start_date,
        end_date: data.result.end_date,
        hotel_logo:data.result.hotel_logo,
        hotel_name:data.result.hotel_name
      })
    })
  },
  /**
   * 更改开始、结束日期
   */
  bindDateChange: function (e) {
    var that = this;
    var date_type = e.currentTarget.dataset.date_type;
    if (date_type == 1) {
      that.setData({
        start_date: e.detail.value
      })
    } else {
      that.setData({
        end_date: e.detail.value
      })
    }
  },
  /**
   * 查询服务员某个时间段的评分列表
   */
  searchCommentList: function (e) {

    var that = this;
    var start_date = e.detail.value.start_date;
    var end_date = e.detail.value.end_date;
    if(start_date>end_date){
      app.showToast('开始时间大于结束时间');
      return false;
    }
    page = 1;
    that.getCommnetList(start_date,end_date);
  },
  /**
   * 服务员详情评分列表分页
   */
  loadMore: function (e) {
    var that = this;
    page += 1;
    var start_date = that.data.start_date;
    var end_date = that.data.end_date;
    that.getCommnetList(start_date,end_date);
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