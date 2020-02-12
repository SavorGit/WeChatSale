// pages/hotel/dishes/add_dishes.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var hotel_id;
var openid;
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
    openid = options.openid;
    hotel_id = options.hotel_id;

  },
  /**
   * 上传菜品图
   */
  uploadDishesPic:function(e){
    var keys = e.currentTarget.dataset.keys;
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

                
              },
              fail: function ({ errMsg }) {
                
              },
            });
          }
        })
      }
    })
  },
  addDishes:function(e){
    var name = e.detail.value.name;
    var price = e.detail.value.price;
    var desc = e.detail.value.desc;
    var dishes_pic = e.detail.dishes_pic;
    var desc_img = e.detail.value.desc_img;

    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id:hotel_id,
      name:name,
      price:price,
      desc:desc,
      desc_img:desc_img
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('添加成功')
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