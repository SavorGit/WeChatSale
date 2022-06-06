// store/pages/storein/scancode.js
/**
 * 扫码入库
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var stock_id;
var goods_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    scanList: [],
    listTitle:'',
    listTitle2:'',
    scancode_nums:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideShareMenu();
    var goods_info = {goods_id:0,name:'',cate_name:'',sepc_name:'',unit_name:''}

    openid = app.globalData.openid;
    stock_id = options.stock_id;
    var goods_info = options.goods_info;
    goods_info = JSON.parse(goods_info);
    goods_info.viewBt    = false;
    var goodsList = this.data.goodsList;
    goodsList.push(goods_info)
    this.setData({goodsList:goodsList});
    this.getScanList(openid,goods_info.stock_detail_id);
  },
  
  getScanList:function(openid,stock_detail_id){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getRecords', {
      openid: openid,
      stock_detail_id:stock_detail_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var scanList = data.result;
      if(JSON.stringify(scanList)=='{}'){
        var listTitle = '已扫商品码（0）';
        var listTitle2 = '已入库（0）';
        that.setData({listTitle:listTitle,listTitle2:listTitle2});
      }else {
        var listTitle = '已扫商品码（0）';
        var listTitle2 = '已入库（'+scanList.length+'）';
        that.setData({scanList:scanList,listTitle:listTitle,listTitle2:listTitle2,scancode_nums:scanList.length});
      }
      
    })
  },
  deleteScanGoods:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var scanList = this.data.scanList;
    var goods_info = scanList[keys];

    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          if(goods_info.status==1){
            scanList.splice(keys,1);
            that.setData({scanList:scanList})
          }else {
            utils.PostRequest(api_v_url + '/stock/delGoodscode', {
              openid:openid,
              idcode:goods_info.idcode,
              type:1
            }, (data, headers, cookies, errMsg, statusCode) => {
              var scancode_nums = that.data.scancode_nums
              scancode_nums --;
              scanList.splice(keys,1);
              that.setData({scanList:scanList,scancode_nums:scancode_nums})
            })
          }
        }
      }
    })
    
  },
  scanGoodsCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var code_msg = res.result;
        //解码
        that.goodsDecode(code_msg);

      },fail:function(res){
        app.showToast('二维码识别失败,请重试');
      }
    })
  },
  goodsDecode:function(code_msg){
    var that = this;
    var goodsList = this.data.goodsList;
    var goods_info = goodsList[0];
    var scanList = this.data.scanList
    utils.PostRequest(api_v_url + '/stock/scancode', {
      goods_id:goods_info.goods_id,
      openid: app.globalData.openid,
      idcode:code_msg,
      type:10,
      unit_id:goods_info.unit_id,
      stock_detail_id:goods_info.stock_detail_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goods_info = data.result;
      var flag = 0;
      for(let i in scanList){
        if(goods_info.idcode== scanList[i].idcode){
          var flag = 1;
          break;
        }
      }
      if(flag==1){
        app.showToast('商品已扫码')
      }else {
        var scancode_nums = this.data.scancode_nums;
        scancode_nums ++;
        var listTitle = '已扫商品码('+scancode_nums+')';
        scanList.push(goods_info);
        that.setData({scanList:scanList,scancode_nums:scancode_nums,listTitle:listTitle});
      }
    })
  },
  cansleStore:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  completeStore:function(){
    var that = this;
    var goodsList = this.data.goodsList;
    var goods_info = goodsList[0];
    var goods_codes = '';
    var scanList = this.data.scanList;
    var space = '';
    for(let i in scanList){
      if(scanList[i].status==1){
        goods_codes += space + scanList[i].idcode;  
        space = ','
      }
      
    }

    if(goods_codes==''){
      wx.navigateBack({delta: 1})
    }else{
      wx.showModal({
        title: '确定要完成入库吗？',
        success: function (res) {
          if (res.confirm) {
  
            utils.PostRequest(api_v_url + '/stock/finishGoods', {
              goods_codes:goods_codes,
              openid:openid,
              stock_detail_id:goods_info.stock_detail_id,
              type:1
             }, (data, headers, cookies, errMsg, statusCode) => {
               
               wx.navigateBack({delta: 1})
               app.showToast('完成入库成功')
             })
          }
        }
      })
    }
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