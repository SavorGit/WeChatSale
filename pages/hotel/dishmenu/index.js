// pages/hotel/dishmenu/index.js
/**
 * 菜品管理
 */


const app = getApp()
var uma = app.globalData.uma;
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var oss_url = app.globalData.oss_url;
var oss_upload_url = app.globalData.oss_upload_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
var merchant_id;
var page ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popEidtWinds:false,
    dish_menu_list:[],
    btn_disable:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    merchant_id = options.merchant_id;
    
    page = 1;
    console.log(oss_url);
    
    this.getDishMenuList(openid,hotel_id,merchant_id,page);
  },
  getDishMenuList:function(openid,hotel_id,merchant_id,page){
    var that = this;
    utils.PostRequest(api_v_url +'/dish/goodslist',{
      openid   : openid, 
      hotel_id : hotel_id,
      merchant_id:merchant_id,
      page     : page,
      type:24
    }, (data, headers, cookies, errMsg, statusCode) => {
      var dish_menu_list = that.data.dish_menu_list;
      var ret = data.result;
      if(ret.length>0){
        for(let i in ret){
          dish_menu_list.push(ret[i]);
        }
        that.setData({dish_menu_list:dish_menu_list})
      }else {
        if(page>1){
            app.showToast('没有更多了...')
        }
        
      }
      

    })
  },
  popEditWind:function(e){
    console.log(e);
    var keys = e.currentTarget.dataset.keys;
    var dish_menu_list = this.data.dish_menu_list;
    var edit_dish_menu = dish_menu_list[keys];
    this.setData({
      keys:keys,
      edit_dish_menu:edit_dish_menu,
      popEidtWinds:true,
    })
    
  },
  closeEditWind:function(){
    this.setData({popEidtWinds:false})
  },
  editImage:function(){
    var that = this;
    var edit_dish_menu = this.data.edit_dish_menu;
    wx.showLoading({
      title: '图片上传中...',
      mask: true
    })
    that.setData({btn_disable:true});
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filename = res.tempFilePaths[0];

        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var timestamp = (new Date()).valueOf();

        var postf = filename.substring(index1, index2);//后缀名\
        var postf_t = filename.substring(index1, index2);//后缀名
        var postf_w = filename.substring(index1 + 1, index2);//后缀名

        var img_url = timestamp + postf;
        console.log(img_url);

        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rest) {
            var policy = rest.data.policy;
            var signature = rest.data.signature;

            wx.uploadFile({
              url: oss_upload_url,
              filePath: filename,
              name: 'file',
              header: {
                'Content-Type': 'image/' + postf_w
              },
              formData: {
                Bucket: "redian-produce",
                name: img_url,
                key: "forscreen/resource/" + img_url,
                policy: policy,
                OSSAccessKeyId: app.globalData.oss_access_key_id,
                sucess_action_status: "200",
                signature: signature

              },

              success: function (res) {
                edit_dish_menu.img_url = oss_url + "/forscreen/resource/" + img_url;
                edit_dish_menu.oss_url  = "forscreen/resource/" + img_url;
                
                wx.hideLoading();
                app.showToast('图片修改成功')
                that.setData({edit_dish_menu:edit_dish_menu,btn_disable:false});
              },
              fail: function ({ errMsg }) {
                wx.hideLoading();
                app.showToast('图片修改失败')
                that.setData({btn_disable:false});
              },
            });
          }
        })
      },fail:function(){
        wx.hideLoading();
        that.setData({btn_disable:false});
      }
    })
  },
  inputTitle:function(e){
    var edit_dish_menu = this.data.edit_dish_menu;
    var title = e.detail.value.replace(/\s+/g, '');
    edit_dish_menu.name = title;
    this.setData({edit_dish_menu});
  },
  inputDesc:function(e){
    var edit_dish_menu = this.data.edit_dish_menu;
    var desc = e.detail.value.replace(/\s+/g, '');
    edit_dish_menu.intro = desc;
    this.setData({edit_dish_menu:edit_dish_menu});
  },
  editDishMenu:function(){
    var that = this;
    var edit_dish_menu = this.data.edit_dish_menu;
    var keys = keys;
    var dish_menu_list = this.data.dish_menu_list;

    

    utils.PostRequest(api_v_url +'/dish/editDish',{
      openid   : openid, 
      goods_id: edit_dish_menu.id,
      imgs: edit_dish_menu.oss_url,
      intro: edit_dish_menu.intro,
      name: edit_dish_menu.name,
      type:24
    }, (data, headers, cookies, errMsg, statusCode) => {
        dish_menu_list[keys] = edit_dish_menu;
        that.setData({popEidtWinds:false,dish_menu_list:dish_menu_list})
        app.showToast('修改成功',2000,'success');
    })
  },
  loadMore:function(){
    page ++;
    this.getDishMenuList(openid,hotel_id,merchant_id,page);
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