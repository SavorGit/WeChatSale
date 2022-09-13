// store/pages/couponbreakage/havecode/index.js

/**
 * 新增核销申请-优惠券
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
var code_msg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listTitle: '已扫优惠券（0）',
    scanList:[],
    tab:"tab1",
    popWindowShow:false,
    
    scanGoogsTitle:'已扫商品（0）',
    scanGoogsList:[],
    checkGoogsTitle:'选择已扫码商品',
    checkGoogsList:[
      {idcode:'赖茅生肖酒1111XXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXX',add_time:'2022/04/10 11:00:40',checked:false},
      {idcode:'赖茅生肖酒2222XXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXX',add_time:'2022/04/10 10:00:40',checked:false},
      {idcode:'赖茅生肖酒3333XXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXX',add_time:'2022/04/10 9:00:40',checked:false}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    hotel_id = options.hotel_id;
    code_msg = options.code_msg;
    if(typeof(options.code_msg)!='undefined'){
      this.couponDecode(options.code_msg)
    }
    //this.setData({popWindowShow:true});
  },
  scanCouponCode:function(){
    var that = this;
    var scanList = this.data.scanList;
    if(scanList.length>0){
      app.showToast('优惠券每次只能核销一个');
      return false;
    }
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var code_msg = res.result;
        //解码
        that.couponDecode(code_msg);

      },fail:function(res){
        app.showToast('二维码识别失败,请重试');
      }
    })
  },
  couponDecode:function(code_msg){
    var that = this;
    var scanList = this.data.scanList;
    if(scanList.length>0){
      app.showToast('每次只能核销一个优惠券');
    }else {
      utils.PostRequest(api_v_url + '/coupon/scancode', {
        openid: openid,
        qrcontent:code_msg,
        hotel_id:hotel_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        var coupon_info = data.result;
        coupon_info.idcode = coupon_info.name;
        var flag  = 0;
        for(let i in scanList){
          if(scanList[i].qrcode==coupon_info.qrcode){
            flag = 1;
            break;
          }
        }
        if(flag == 0){
          scanList.push(coupon_info);
          var listTitle = '已扫优惠券('+scanList.length+')';
          that.setData({scanList:scanList,listTitle:listTitle});
        }else {
          app.showToast('请勿重复扫码');
        }
        
      })
    }
    
  },
  deleteScanCoupon:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var scanList = this.data.scanList;

    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          scanList.splice(keys,1);
          var listTitle = '已扫优惠券（'+scanList.length+'）';
          
          
          that.setData({scanList:scanList,listTitle:listTitle});
        }
      }
    })
    
  },

  scanGoodsCode:function(){
    var that = this;
    var tab = this.data.tab;
    if(tab=='tab2'){
      this.setData({tab:'tab1'})
    }else {
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
    }
    
  },
  goodsDecode:function(code_msg){
    var that = this;
    var scanGoogsList = this.data.scanGoogsList;
    var goods_id = this.data.goods_id;
    utils.PostRequest(api_v_url + '/stock/scanWriteoff', {
      openid: openid,
      idcode:code_msg,
      goods_id:goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var flag  = 0;
      var goods_info = data.result;
      for(let i in scanGoogsList){
        if(scanGoogsList[i].idcode==goods_info.idcode){
          flag = 1;
          break;
        }
      }
      if(flag == 0){
        scanGoogsList.push(goods_info);
        var scanGoogsTitle = '已扫商品('+scanGoogsList.length+')';
        that.setData({scanGoogsList:scanGoogsList,scanGoogsTitle:scanGoogsTitle});
      }else {
        app.showToast('请勿重复扫码');
      }
    })
  },
  deleteScanGoods:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var scanGoogsList = this.data.scanGoogsList;
    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          scanGoogsList.splice(keys,1);
          var scanGoogsTitle = '已扫商品（'+scanGoogsList.length+'）';
          
          
          that.setData({scanGoogsList:scanGoogsList,scanGoogsTitle:scanGoogsTitle});
        }
      }
    })
    
  },
  selectGoods:function(){
    var tab = this.data.tab;
    if(tab=='tab1'){
      this.setData({tab:'tab2'});
      utils.PostRequest(api_v_url + '/aa/bb', {
        openid: openid,
        
      }, (data, headers, cookies, errMsg, statusCode) => {

      })
    }else {

    }
  },
  checkboxChange:function(e){
    console.log(e)
    
    var checkinfo = e.detail.value;
    var checkGoogsList = this.data.checkGoogsList;

    for(let i in checkGoogsList){
      checkGoogsList[i].checked= false;
        if(checkinfo== checkGoogsList[i].idcode){
          checkGoogsList[i].checked= true;
        }

      

    }
    this.setData({checkGoogsList:checkGoogsList})
  },
  confirmSubmitCoupon:function(){

    var tab = this.data.tab;
    if(tab=='tab1'){
      var scanGoogsList = this.data.scanGoogsList;
      if(scanGoogsList.length==0){
        app.showToast('请扫商品二维码');
        return false;
      }
    }else if(tab=='tab2'){
      var flag = 0; 
      var checkGoogsList = this.data.checkGoogsList;
      for(let i in checkGoogsList){
        if(checkGoogsList[i].checked==true){
          flag = 1;
        }
      }
      if(flag==0){
        app.showToast('请选择已扫商品');
        return false;
      }
    }

    this.setData({popWindowShow:true});
  },


  submitCoupon:function(){
    var scanList = this.data.scanList;
    var scanGoogsList = this.data.scanGoogsList;

    var checkGoogsList = this.data.checkGoogsList;
    var tab = this.data.tab;
    if(scanList.length==0){
      app.showToast('请扫描优惠券二维码进行核销');
      return false;
    }
    if(tab=='tab1' && scanGoogsList.length==0){
      app.showToast('请扫商品二维码');
      return false;
    }
    if(tab=='tab2' && checkGoogsList.length==0){
      app.showToast('请选择已扫商品');
        return false;
    }
    wx.showModal({
      title: '确定要提交吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/coupon/writeoff', {
            openid: openid,
            hotel_id:hotel_id,
            qrcontent:scanList[0].qrcode
          }, (data, headers, cookies, errMsg, statusCode) => {
            
            app.showToast(data.result.message,2000,'success');
            setTimeout(function () {
                wx.navigateBack({delta: 1})
              }, 2000);
            
          })
        }
      }
    })
    
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