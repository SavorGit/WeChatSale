// pages/mine/receiving_info.js
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var openid;
var goods_nums = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_nums:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var data = JSON.parse(options.data);
    var goods_id = data.goods_id;
    var openid   = data.openid;
    wx.request({
      url: api_url +'/Smallsale/goods/getdetail',
      header: {
        'content-type': 'application/json'
      },
      data:{
        goods_id: goods_id,
      },success:function(res){
        if(res.data.code==10000){
          that.setData({
            goods_info:res.data.result,
            openid:openid,
          })
        }
      }
      
    })
  },
  changeActNums: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {//数量增加
      if (goods_nums == 100) {
        wx.showToast({
          title: '数量不能大于100',
          icon: 'none',
          duration: 2000,
        })
      } else {
        goods_nums += 1;
        //console.log(goods_nums);
      }
    } else if (type == 2) { //数量减少
      if (goods_nums == 1) {
        wx.showToast({
          title: '数量不能小于1',
          icon: 'none',
          duration: 2000,
        })
      } else {
        goods_nums -= 1;
      }
    }
    that.setData({
      goods_nums: goods_nums,
    })
  },
  exchangeGoods:function(e){
    console.log(e);
    var goods_id   = e.detail.value.goods_id;
    var goods_nums = e.detail.value.goods_nums;
    var linkman    = e.detail.value.linkman;
    var mobile     = e.detail.value.mobile;
    var address    = e.detail.value.address; 
    var openid     = e.detail.value.openid;
    if (linkman == '') {
      wx.showToast({
        title: '请输入联系人名称',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(mobile==''){
      wx.showToast({
        title: '请输入您的联系电话',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    
    if(address==''){
      wx.showToast({
        title: '请输入您的收货地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    if(link_box_info==''){
      var box_mac ='';
    }else {
      var box_mac = link_box_info.box_mac;
    }
    wx.request({
      url: api_url +'/Smallsale/order/addOrder',
      header: {
        'content-type': 'application/json'
      },
      data:{
        address: address,
        amount:goods_nums,
        box_mac: box_mac,
        contact:linkman,
        goods_id: goods_id,
        openid:openid,
        phone:mobile
      },success:function(res){
        if(res.data.code==10000){
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '兑换成功',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:2000
          })
          
          
        }
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})