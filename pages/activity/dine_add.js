// pages/activity/dine_add.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var api_url   = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_access_key_id = app.globalData.oss_access_key_id;
var hotel_id;
var openid;

const days = ['今天','明天','后天'];
const hours = [];
const minutes = ['00','10','20','30','40','50'];  




Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    multiArray: [days, hours, minutes],
    multiIndex: [0, 0, 0],
    //choose_year: '',
    award_img:'', //奖品图片
    award_oss_img:'',
    award_open_time:'',//开奖时间 
    add_button_disable:false,
    config_img_info:{'width':500,'height':500},
    choose_day:'',
    choose_hour:'',
    is_select_open_time:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    //获取小时
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hours.push("" + i);
    }
    
    openid   = options.openid;
    hotel_id = options.hotel_id;
    this.getConfig();
  },
  getConfig:function(){
    var that= this;
    utils.PostRequest(api_v_url + '/config/getConfig', {
      hotel_id:hotel_id,
      openid:openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      var config_hour_index = data.result.activity_initiate_time[1];
      var config_minute_index = data.result.activity_initiate_time[2];
      var multiIndex = that.data.multiIndex; 
      var multiArray = that.data.multiArray;
      multiArray[1] = hours
      multiArray[2] = minutes
      multiIndex[1] = config_hour_index;
      multiIndex[2] = config_minute_index;


      //开奖等待时间
      var activity_wait_time = data.result.activity_wait_time;
      that.setData({multiArray:multiArray,activity_lottery_time:data.result.activity_initiate_time,multiIndex:multiIndex,activity_wait_time:activity_wait_time})
      
    })
  },
  //获取时间日期
  bindMultiPickerChange: function(e) {
    //console.log(e)
    var choose_day_index = e.detail.value[0];
    var choose_hour_index = e.detail.value[1];
    var choose_minute_index = e.detail.value[2];
    var multiArray = this.data.multiArray;

    var day = multiArray[0][choose_day_index];
    var hour = multiArray[1][choose_hour_index];
    var minute = multiArray[2][choose_minute_index];

    this.setData({
      award_open_time:day + ' ' + hour +':'+minute,
      choose_day :choose_day_index,
      choose_hour:hour,
      choose_minute:minute,
      is_select_open_time:1
    })
    
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function(e) {
    //获取年份
    
  },
  addActivityPic:function(){
    var that = this;
    var base_info = that.data.base_info;
    var config_img_info = that.data.config_img_info
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res);
        var tmp_file = res.tempFilePaths[0];
        wx.getImageInfo({
          src: tmp_file,
          success (res) {
            var width = res.width
            var height = res.height
            if(width<config_img_info.width || height<config_img_info.height){
              app.showToast('图片质量太低,请重新选择');

            }else {
              var index1 = tmp_file.lastIndexOf(".");
              var index2 = tmp_file.length;
              var postf_t = tmp_file.substring(index1, index2); //后缀名
              var postf_w = tmp_file.substring(index1 + 1, index2); //后缀名
              var timestamp = (new Date()).valueOf();
              var oss_img_url = app.globalData.oss_url + "/forscreen/resource/" + timestamp + postf_t;
              var oss_key = "forscreen/resource/" + timestamp + postf_t;
              wx.request({
                url: api_url + '/Smallapp/Index/getOssParams',
                success: function (res) {
                  var policy = res.data.policy;
                  var signature = res.data.signature;
                  wx.uploadFile({
                    url: oss_upload_url,
                    filePath: tmp_file,
                    name: 'file',
                    header: {
                      'Content-Type': 'image/' + postf_w
                    },
                    formData: {
                      Bucket: app.globalData.oss_bucket,
                      name: tmp_file,
                      key: oss_key,
                      policy: policy,
                      OSSAccessKeyId: oss_access_key_id,
                      sucess_action_status: "200",
                      signature: signature
                    },
                    success: function (res) {
                      that.setData({award_oss_img:oss_key,award_img:oss_img_url})
                    },
                    fail: function ({
                      errMsg
                    }) {
                      wx.showToast({
                        title: '上传图片失败,请重试',
                        icon: 'none',
                        duration: 2000,
                      })
                    },
                  });
                }
              })
            }
          }
        })  
        
      },
      fail(res) { //取消选择照片
       
      }
    })
  },
  delAwardPic:function(){
    this.setData({award_img:'',award_oss_img:''})
  },
  changeWaitTime:function(e){
    var value = e.detail.value;
    var activity_wait_time = this.data.activity_wait_time;
    for(let i in activity_wait_time){
      activity_wait_time[i].is_select = false;
      if(activity_wait_time[i].value==value){
        activity_wait_time[i].is_select = true;
      }
    }
    this.setData({activity_wait_time:activity_wait_time})
  },
  addActivity:function(e){
    var that = this;
    //console.log(e)
    var activity_name = e.detail.value.activity_name.replace(/\s+/g, '');
    var award_name    = e.detail.value.award_name.replace(/\s+/g, '');
    var award_img     = this.data.award_oss_img;
    var choose_day = this.data.choose_day;
    var choose_hour = this.data.choose_hour;
    var choose_minute = this.data.choose_minute

    var activity_wait_time = this.data.activity_wait_time;
    var wait_time = 30;
 
    for(let i in activity_wait_time){
      if(activity_wait_time[i].is_select==true){
        wait_time = activity_wait_time[i].value;
        break;
      }
    }
   

    var is_select_open_time =  that.data.is_select_open_time;
    //console.log(this.data)
    if(activity_name==''){
      app.showToast('请填写活动名称');
      return false;
    }
    if(award_name==''){
      app.showToast('请填写奖品名称');
      return false;
    }
    //console.log(award_img+'ddddd');
    if(award_img==''){
      app.showToast('请上传奖品图片');
      return false;
    }
    if(is_select_open_time==0){
      app.showToast('请选择开奖时间');
      return false;
    }
    that.setData({add_button_disable:true});
    utils.PostRequest(api_v_url + '/activity/addActivity', {
      hotel_id: hotel_id,
      openid:openid,
      activity_name : activity_name,
      prize:award_name,
      image:award_img,
      lottery_day:choose_day,
      lottery_hour:choose_hour,
      lottery_minute:choose_minute,
      wait_time:wait_time
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({add_button_disable:false})
      wx.showToast({
        title: '添加成功',
        icon:'success',
        duration:2000,
        mask:true,
        success:function(){
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    },res=>{
      that.setData({add_button_disable:false})
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