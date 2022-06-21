// store/pages/goodsbreakage/havecode/scancode.js
/**
 * 报损 扫码报损
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    popReasonWind:false,   //弹窗报损原因
    reason_info  :'', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
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
    var list = this.data.list;

    utils.PostRequest(api_v_url + '/stock/scanReportedloss', {
      openid:openid,
      idcode:code_msg
    }, (data, headers, cookies, errMsg, statusCode) => {
      var result = data.result;
      var scan_info = {};
      var goods_info = {};
      var goods_nums = list.length +1;
      scan_info.title = "报损商品"+goods_nums+"("+result.idcode+")";
      scan_info.type_str = result.type_str;
      scan_info.add_time = result.add_time;
      scan_info.op_uname = result.op_uname;
      scan_info.idcode   = result.idcode;
      goods_info.goods_id = result.goods_id;
      goods_info.goods_name = result.goods_name;
      goods_info.cate_name = result.cate_name;
      goods_info.spec_name = result.spec_name;
      goods_info.unit_name = result.unit_name;
      scan_info.stock_name = result.stock_name;
      scan_info.goods_info = goods_info;
      
      list.push(scan_info);
      that.setData({list:list});
    })
  },
  popReasonWind:function(){
    var list  = this.data.list;
    if(list.length==0){
      app.showToast('请先扫报损商品码');
      return false;
    }
    this.setData({popReasonWind:true})
  },
  inputReason:function(e){
    var reason_info = e.detail.value.replace(/\s+/g, '');
    this.setData({reason_info:reason_info});
  },
  subBreakage:function(){
    var that = this;
    var list = this.data.list;
    var goods_codes = '';
    var space  = '';
    for(let i in list){
      goods_codes += space+list[i].idcode;
      space = ',';
    }
    var reason_info = this.data.reason_info;
    if(reason_info==''){
      app.showToast('请填写报损原因');
      return false;
    }
    console.log(openid)
    console.log(reason_info)
    console.log(goods_codes)
    
    wx.showModal({
      title: '确定要提交吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/stock/finishReportedloss', {
            openid:openid,
            reason:reason_info,
            goods_codes:goods_codes
          }, (data, headers, cookies, errMsg, statusCode) => {
            wx.navigateBack({delta: 1});
            app.showToast('提交成功',2000,'success');
          })
        }
      }
    })
    
  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    var url = '';
    switch(type){
        case 'replace':
            url = '/store/pages/goodsbreakage/replace/index';
            break;
        case 'nocode':
            url = '/store/pages/goodsbreakage/nocode/index';
    }
    wx.navigateTo({
      url: url,
    })
  },
  offPopWindForLoss:function(){
    this.setData({popReasonWind:false})
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