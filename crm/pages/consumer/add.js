// crm/pages/consumer/add.js
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var hotel_id;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    policy:'',
    signature:'',
    addDisabled:false,
    consumer_info:{mobile_arr:[''],name:'',sex:0,avg_expense:0,avatarUrl:'',oss_head_pic:'',birthday:'',birthplace:''},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    id = 0 ;
    if(typeof(options.id)!='undefined'){
      id = options.id;
      this.getConsumerInfo(openid,id);
    }
    
    this.getOssParams();
  },
  getOssParams:function(){
    var that = this;
    wx.request({
      url: api_url + '/Smallapp/Index/getOssParams',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rest) {
        var policy = rest.data.policy;
        var signature = rest.data.signature;
        that.setData({policy:policy,signature:signature})
      }
    })
  },
  getConsumerInfo:function(openid,id){
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid           : openid,
      id               : id,
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  addMobile:function(e){
    
    var consumer_info = this.data.consumer_info;
    var mobile_arr = consumer_info.mobile_arr;
    var max_length = 3
    if(mobile_arr.length>=max_length){
      app.showToast('手机号能添加'+max_length+'个');
      return false;
    }
    mobile_arr.push('');
    consumer_info.mobile_arr = mobile_arr;
    this.setData({consumer_info:consumer_info})
  },
  
  /**
   * @desc 输入姓名 籍贯
   */
  inputInfo:function(e){
    var type = e.currentTarget.dataset.type;
    var input_value = e.detail.value.replace(/\s+/g,'');
    var consumer_info = this.data.consumer_info;
    if(type=='mobile'){
      var keys = e.currentTarget.dataset.keys;

      consumer_info.mobile_arr[keys] = input_value;
    }else if(type=='name'){
      consumer_info.name = input_value;
    }else if(type=='avg_expense'){
      consumer_info.avg_expense = input_value;
    }
    else if(type=='birthplace'){
      consumer_info.birthplace = input_value;
    }
    console.log(consumer_info)
    this.setData({consumer_info:consumer_info});
  },
  chooseSex:function(e){
    console.log(e)
    var sex = e.detail.value;
    var consumer_info = this.data.consumer_info;
    consumer_info.sex = sex;
    this.setData({consumer_info:consumer_info});
  },
  addPic:function(e){
    var that = this;
    var policy  = this.data.policy ;
    var signature = this.data.signature;
    wx.showLoading({
      title: '图片上传中...',
      mask: true
    })
    that.setData({
      addDisabled: true
    })
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //return false;
        
        for(let i in res.tempFilePaths)
        {
          that.uploadImg(res.tempFilePaths[i],policy,signature);
        }
        
      }, fail: function (e) {
        wx.hideLoading();
        that.setData({
          addDisabled: false
        })
      }
    })
  },
  uploadImg:function(filename,policy,signature){
    var that = this;

    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    var timestamp = (new Date()).valueOf();
    var postf = filename.substring(index1, index2);//后缀名
    var postf_t = filename.substring(index1, index2);//后缀名
    var postf_w = filename.substring(index1 + 1, index2);//后缀名

    var img_url = timestamp + postf;
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
        
        var head_pic = "forscreen/resource/" + img_url
        var consumer_info = that.data.consumer_info;
        consumer_info.avatarUrl = head_pic;
        consumer_info.head_pic = oss_url +'/'+head_pic;
        that.setData({consumer_info:consumer_info})
        wx.hideLoading();
          setTimeout(function () {
            that.setData({
              addDisabled: false
            })
          }, 1000);
      },
      fail: function ({ errMsg }) {
        wx.hideLoading();
        app.showToast('图片上传失败，请重试')
        that.setData({
          addDisabled: false
        })
      },
    });
  },
  bindDateChange:function(e){
    console.log(e)
    var birthday = e.detail.value;
    var consumer_info = this.data.consumer_info;
    consumer_info.birthday = birthday;
    this.setData({consumer_info:consumer_info});
  },
  submitConsumerInfo:function(){
    var that = this;
    var consumer_info = this.data.consumer_info;
    var flag = 0;
    var mobile_arr = consumer_info.mobile_arr;
    var mobile = '';
    var space  = '';
    for(let i in mobile_arr){
      if(mobile_arr[i]!=''){
        flag = 1;
      }
      mobile +=space + mobile_arr[i];
    }
    if(flag ==0){
      app.showToast('请输入手机号');
      return false;
    }
    if(consumer_info.name==''){
      app.showToast('请输入姓名');
      return false;
    }
    this.setData({addDisabled:true})
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid           : openid,
      mobile           : mobile,
      name             : consumer_info.name,
      sex              : consumer_info.sex,
      avg_expense      : consumer_info.avg_expense,
      avatarUrl        : consumer_info.avatarUrl,
      birthday         : consumer_info.birthday,
      birthplace       : consumer_info.birthplace
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({addDisabled:false})
      wx.navigateBack({
        delta: 1
      })
    },res=>{
      that.setData({addDisabled:false})
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