// pages/welcome/hotel_add.js
const utils = require('../../utils/util.js')
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var welType = 0;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_access_key_id = app.globalData.oss_access_key_id;

var welcome_info = [];   //欢迎词数据
var storInfo = {'step':0,'welcome_info':[]};       //用户操作数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_choose_img:0,     //自主上传照片  0：未上传  1：已上传
    choose_img_url: '',  //自主上传照片 oss地址 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.hotel_id == -1) {
      hotel_id = user_info.select_hotel_id;
    } else {
      hotel_id = user_info.hotel_id;
    }
  },
  /**
   * 切换欢迎词类型 0:自主上传  1：生日宴 2：寿宴 3：婚宴 4：朋友聚会
   */
  switchWelType:function(e){
    var type = e.currentTarget.dataset.type;
    welType = type;
    if(type!=0){
      utils.PostRequest(api_url + '/aa/bb/cc', {
        openid: openid,
        hotel_id: hotel_id,
        type: type
      }, (data, headers, cookies, errMsg, statusCode) => {

        list.splice(index, 1);
        that.setData({
          list: list,
        })
      });
    }
  },
  /**
   * 相册选择照片
   */
  chooseImage:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tmp_file = res.tempFilePaths[0];
        var index1 = tmp_file.lastIndexOf(".");
        var index2 = tmp_file.length;
        var postf_t = filename.substring(index1, index2);//后缀名
        var postf_w = filename.substring(index1 + 1, index2);//后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img_url = app.globalData.oss_url+ "/forscreen/resource/" + timestamp + postf_t;
        var oss_key = "forscreen/resource/" + timestamp + postf_t;


        utils.PostRequest(api_url + '/Smallapp/Index/getOssParams', {
          openid: openid,
          hotel_id: hotel_id,
          type: type
        }, (data, headers, cookies, errMsg, statusCode) => {
          var policy = data.policy;
          var signature = data.signature;
          wx.uploadFile({
            url: oss_upload_url,
            filePath: tmp_file,
            name: 'file',
            header: {
              'Content-Type': 'image/' + postf_w
            },
            formData: {
              Bucket: app.globalData.oss_bucket,
              name: img_url,
              key: oss_key,
              policy: policy,
              OSSAccessKeyId: oss_access_key_id,
              sucess_action_status: "200",
              signature: signature

            },success: function (res) {
              that.setData({
                is_choose_img:1,
                choose_img_url: oss_img_url,
                step :0
              })
            },fail: function ({ errMsg }) {

            },
          });
        });
      }
    })
  },
  /**
   * 下一步
   */
  nextOption:function(e){
    var that = this;
    var step = e.currentTarget.dataset.step;
    if(step==0){//选择背景结束

    }else if(step==1){//添加文字结束

    }else if(step==2){//添加音乐结束

    }
  },
  /**
   * 上一步
   */
  lastOption:function(e){
    var that = this;
    var step = e.currentTarget.dataset.step;
    if(step==0){//开始选择图片

    }else if(step ==1){//开始添加文字

    }else if(step==2){//开始添加音乐

    }
  },
  completeWel:function(e){
    var that = this;
    wx.redirectTo('/pages/welcome/index');
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