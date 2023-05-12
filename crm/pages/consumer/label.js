// crm/pages/consumer/label.js

/**
 * 标签管理页
 */
const app = getApp()
const utils = require('../../../utils/util.js')

var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var customer_id;
var is_save;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop_add_lable:false,
    lable_list:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    wx.hideShareMenu();
    openid = app.globalData.openid;
    customer_id = options.customer_id;
    is_save = options.is_save;
    if(customer_id==0){
      var lable_info = wx.getStorageSync(cache_key+'customer_lable');
      if(lable_info!=''){
        var lable_list = JSON.parse(lable_info);
        this.setData({lable_list:lable_list});
      }
    }else {
      this.getLables(openid,customer_id);
    }
  },
  getLables:function(openid,customer_id){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/getLabels', {
      openid        : openid,
      customer_id  : customer_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({lable_list:data.result.datalist})
    })
    
  },
  opsPopLableWind:function(e){
    console.log(e)
    var type= e.currentTarget.dataset.type;
    if(type==1){
      var lable_list = this.data.lable_list;
      if(lable_list.length>=50){
        app.showToast('最多可添加50个标签')
        return false;
      }
      
    }
    var is_pop = type==1?true:false;
    this.setData({pop_add_lable:is_pop})
  },
  addLable:function(e){
    console.log(e)
    var lable_list = this.data.lable_list;
    var info = {id:'',name:''};
    info.name = e.detail.value.lable;
    lable_list.push(info);
    this.setData({lable_list:lable_list,pop_add_lable:false});
  },
  delLable:function(e){
    console.log(e)
    var keys = e.currentTarget.dataset.keys;
    var lable_list = this.data.lable_list;
    lable_list.splice(keys,1)
    this.setData({lable_list:lable_list});
  },
  saveLale:function(e){
    var lable_list = this.data.lable_list;
    if(is_save==0){
      var lable_str = JSON.stringify(lable_list);

      wx.setStorageSync(cache_key+'customer_lable', lable_str);
      app.showToast('保存成功',2000,'success',true);
      setTimeout(() => {
        wx.navigateBack({
          delta:1
        })
      }, 2000);
    }else {
      var lable_str  = '';
      var space = '';
      for(let i in lable_list){
        lable_str += space+lable_list[i].name;
        space = ',';
      }
      utils.PostRequest(api_v_url + '/customer/editLabels', {
        openid        : openid,
        customer_id   : customer_id,
        labels        : lable_str
      }, (data, headers, cookies, errMsg, statusCode) => {
        app.showToast('保存成功',2000,'success',true);
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 2000);
      })
    }
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