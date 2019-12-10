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
    base_info: { 'step': 0, //操作步骤 
                 'type': 0, //背景图类型
                 'img_info': { 'is_choose_img': 0, 'choose_img_url': '', 'oss_img_url': '', 'forscreen_url': '','angle':0}, 
                 
                 'word_info':{'welcome_word':''},                     //欢迎词
                 'word_size_info':{'word_size':'','word_size_id':''}, //欢迎词字号
                 'word_color_info':{'color':'','color_id':''},        //欢迎词颜色
                 'music_info':{'music_name':'','music_id':0}          //背景音乐
                }, 
    wordsize_list:[],  //字号列表
    color_list:[],     //颜色列表
    music_list:[],     //音乐列表
    box_list :[],     //包间列表
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
    //背景图分类列表
    utils.PostRequest(api_url + '/Smallsale14/welcome/categorylist', {
     
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data.result.category_list);
      that.setData({
        categoryList:data.category
      })
    });
    /**
     * 获取配置
     */
    utils.PostRequest(api_url +'/Smallsale14/welcome/config',{

    }, (data, headers, cookies, errMsg, statusCode)=>{
      console.log(data.result)
      that.setData({
        wordsize_list: data.result.wordsize,
        color_list:data.result.color,
        music_list:data.result.music,
      })
    })
    //包间列表
    utils.PostRequest(api_url + '/Smalldinnerapp11/Stb/getBoxList',{
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) =>{
      that.setData({
        box_list:data.result.box_list
      })
      // that.setData({
      //   objectBoxArray: res.data.result.box_name_list,
      //   box_list: res.data.result.box_list
      // })
    })
    
  },
  /**
   * 切换欢迎词类型 0:自主上传  1：生日宴 2：寿宴 3：婚宴 4：朋友聚会
   */
  switchWelType:function(e){
    var category_id = e.currentTarget.dataset.category_id;
    welType = type;
    if(type!=0){
      utils.PostRequest(api_url + '/Smallsale14/welcome/imglist', {
        category_id: category_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        that.setData({
          imglist: data,
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
        var postf_t = tmp_file.substring(index1, index2);//后缀名
        var postf_w = tmp_file.substring(index1 + 1, index2);//后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img_url = app.globalData.oss_url+ "/forscreen/resource/" + timestamp + postf_t;
        var oss_key = "forscreen/resource/" + timestamp + postf_t;
        console.log('aaaa');

        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          success:function(res){
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

              },success: function (res) {
                console.log(oss_img_url);
                that.setData({
                  base_info: { 'step': 0, 'type': 0, 'is_choose_img': 1, 'choose_img_url': oss_img_url,'oss_img_url':oss_img_url}
                })
              },fail: function ({ errMsg }) {
                wx.showToast({
                  title: '上传图片失败',
                  icon:'none',
                  duration:2000,
                })
              },
            });
          }
        })
      },fail(res){//取消选择照片
        console.log(res);
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
    //var welcome_option = wx.getStorageSync(cache_key+'welcome_option');
    //var welcome_info = welcome_option.welcome_info;
    var music_play_type = e.currentTarget.dataset.music_play_type;  //欢迎词播放类型
    var start_time = '';
    var end_time   = '';
    if(music_play_type==2){
      start_time = e.currentTarget.dataset.start_time;
      end_time   = e.currentTarget.dataset.end_time;
    }
    var box_mac = e.currentTarget.dataset.box_mac;  //包间mac



    var base_info = that.data.base_info;
    var img_url      = base_info.img_info.forscreen_url;       //背景图片
    var welcome_word = base_info.word_info.welcome_word;       //欢迎词
    var word_size_id = base_info.word_size_info.word_size_id;  //欢迎词字号 
    var word_color_id= base_info.word_color_info.color_id;     //字体颜色
    var music_id     = base_info.music_info.music_id;          //背景音乐
    
    utils.PostRequest(api_url + '/aa/bb/cc', {
      img_url :img_url,
      welcome_word:welcome_word,
      word_size_id: word_size_id,
      word_color_id:word_color_id,
      music_id : music_id,
      music_play_type: music_play_type,
      start_time:start_time,
      end_time : end_time,
      box_mac  : box_mac,  
    }, (data, headers, cookies, errMsg, statusCode) => {
      wx.showToast({
        title: '新建欢迎词成功',
        icon:'none',
        duration:2000,
      })
      wx.redirectTo({
        url: '/pages/welcome/index',
      })
    });
  },
  /**
   * 旋转图片
   */
  rotateImg:function(e){
    var that = this;
    var angle = e.currentTarget.dataset.angle;
    var choose_img_url = e.currentTarget.dataset.choose_img_url;
    var nextAngle = angle+90;
    if (nextAngle==360){
      nextAngle = 0;
    }
    var base_info = that.data.base_info;
    base_info.choose_img_url = choose_img_url +'?x-oss-process=image/rotate,'+nextAngle;
    that.setData({
      base_info:base_info
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