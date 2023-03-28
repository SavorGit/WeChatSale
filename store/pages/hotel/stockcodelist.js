// store/pages/hotel/stockcodelist.js
const utils = require('../../../utils/util.js');

/**
 * [酒楼库存] 库存码列表页面
 */
const app = getApp()
var uma = app.globalData.uma;

var api_v_url = app.globalData.api_v_url;
var openid;
var hotel_id;
var goods_id;
var page ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    hotel_id = options.hotel_id;
    goods_id = options.goods_id;
    page = 1;
    this.getStockCodeList(openid,hotel_id,goods_id,page);
  },
  getStockCodeList:function(openid,hotel_id,goods_id,page =1){
    utils.PostRequest(api_v_url + '/stock/idcodelist', {
      openid   : openid,
      hotel_id : hotel_id,
      goods_id : goods_id,
      page     : page,
    }, (data, headers, cookies, errMsg, statusCode) => {
        var ret_list = data.result.datalist;
        var list = this.data.list;
        if(ret_list.length>0){
          for(let i in ret_list){
            list.push(ret_list[i])
          }
          console.log(list)
          this.setData({list:list})
        }else {
            if(page>1){
                app.showToast('没有更多了...')
            }
        }
    })

  },
  loadMore:function(){
    page +=1;
    this.getStockCodeList(openid,hotel_id,goods_id,page);
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