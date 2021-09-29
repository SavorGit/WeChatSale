// pages/mine/message/index.js
/**
 * 消息通知首页
 */

const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var openid ;
var hotel_id;
var page ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    tasteWineList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    openid = options.openid;
    hotel_id = options.hotel_id;
    page = 1;
    self.getTastewineList()
  },
  getTastewineList:function(){
    var that = this;
    var tasteWineList = this.data.tasteWineList;
    utils.PostRequest(api_v_url + '/activity/tastewineGetlist', {
      openid: openid,
      hotel_id: hotel_id,
      page:page
    }, (data, headers, cookies, errMsg, statusCode) => {

      var ret_list = data.result.datalist;
      if(ret_list.length>0){
        for(let i in ret_list){
          tasteWineList.push(ret_list[i])
        }
        that.setData({tasteWineList:tasteWineList})
        
      }else {
        app.showToast('没有更多了...')
      }
    })
  },
  loadMore:function(){
    page +=1;
    this.getTastewineList();
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