// crm/pages/consumer/add.js
const app = getApp()
const utils = require('../../../utils/util.js')

/**
 * 添加客户页
 */
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
    consumer_info:{mobile_arr:[''],name:'',gender:0,avg_expense:0,avatar_url:'',oss_avatar_url:'',birthday:'',native_place:''},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();

    openid = app.globalData.openid;
    hotel_id = options.hotel_id;
    id = 0 ;
    if(typeof(options.id)!='undefined'){
      id = options.id;
      if(id>0){
        wx.setNavigationBarTitle({title:'编辑客户'})
      }
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
    var that = this;
    var consumer_info = this.data.consumer_info;
    utils.PostRequest(api_v_url + '/customer/detail', {
      openid           : openid,
      customer_id      : id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var info = data.result;
      consumer_info = info;
      var mobile = info.mobile;
      var mobile1 = info.mobile1;
      var mobile2 = info.mobile2;
      var mobile_arr = [''];
      if(mobile!=''){
        mobile_arr[0] = mobile;
      }
      if(mobile1!=''){
        mobile_arr[1] = mobile1;
      }
      if(mobile2!=''){
        mobile_arr[1] = mobile1;
        mobile_arr[2] = mobile2;
      }
      consumer_info.mobile_arr = mobile_arr;
      that.setData({consumer_info:consumer_info});
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
    else if(type=='native_place'){
      consumer_info.native_place = input_value;
    }
    console.log(consumer_info)
    this.setData({consumer_info:consumer_info});
  },
  chooseSex:function(e){
    console.log(e)
    var gender = e.detail.value;
    var consumer_info = this.data.consumer_info;
    consumer_info.gender = gender;
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
        consumer_info.avatar_url = head_pic;
        consumer_info.oss_avatar_url = oss_url +'/'+head_pic;
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
    
    var mobile_arr = consumer_info.mobile_arr;

    /*var mobile = '';
    var space  = '';
    for(let i in mobile_arr){
      if(mobile_arr[i]!=''){
        flag = 1;
      }
      mobile +=space + mobile_arr[i];
    }*/
    var mobile,mobile1,mobile2 = '';

    if(mobile_arr[0] ==''){
      app.showToast('请输入手机号');
      return false;
    }
    mobile = mobile_arr[0];
    if(mobile_arr.length==2){
      mobile1 = mobile_arr[1];
    }
    if(mobile_arr.length==3){
      mobile1 = mobile_arr[1];
      mobile2 = mobile_arr[2];
    }
    if(consumer_info.name==''){
      app.showToast('请输入姓名');
      return false;
    }
    this.setData({addDisabled:true})
    utils.PostRequest(api_v_url + '/customer/addCustomer', {
      avatar_url       : consumer_info.avatar_url,
      avg_expense      : consumer_info.avg_expense,
      birthday         : consumer_info.birthday,
      customer_id      : id,
      gender           : consumer_info.gender,
      hotel_id         : hotel_id,
      mobile           : mobile,
      mobile1          : mobile1,
      mobile2          : mobile2,
      name             : consumer_info.name,
      native_place     : consumer_info.native_place,
      openid           : openid,
      
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({addDisabled:false})
      var msg = '添加成功';
      if(id>0){
        msg = '编辑成功';
      }
      app.showToast(msg,2000,'success',true)
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
     
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