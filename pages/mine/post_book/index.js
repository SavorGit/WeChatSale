// pages/mine/post_book/index.js
const app = getApp()
var uma = app.globalData.uma;
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    policy:'',
    signature:'',
    oss_url:oss_url,
    book_info:{room_type:1,table_name:'','select_room_name':'--请选择包间--','room_index':0,'book_time':'','book_name':'','nums':'','mobile':'','hotel_contract':'','hotel_tel':'','desc':'','template_id':0,dish_pics:[],is_view_wine:1,is_open_sellplatform:1},
    themes_list:[],
    addDisabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;

    this.getRoomlist(openid,hotel_id);
    this.getInitdata(openid,hotel_id);
    this.getThemes(openid,hotel_id);
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
  getRoomlist:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRooms', {
      hotel_id:hotel_id,
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var book_info = that.data.book_info;
      book_info.select_room_name = data.result.room_name_list[0];

      that.setData({
        objectBoxArray: data.result.room_name_list,
        box_list: data.result.room_list,
        book_info:book_info
      })
    })
  },
  getInitdata:function(openid,hotel_id){
    var that = this;
    var book_info = this.data.book_info;
    utils.PostRequest(api_v_url + '/invitation/initdata', {
      hotel_id:hotel_id,
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var images = data.result.images;
      var is_open_sellplatform = data.result.is_open_sellplatform;
      book_info.dish_pics = images;
      book_info.is_open_sellplatform = is_open_sellplatform;
      that.setData({book_info:book_info});
    })
  },
  getThemes:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/invitation/themes', {
      hotel_id:hotel_id,
      openid:openid,
      version:app.globalData.small_app_version
    }, (data, headers, cookies, errMsg, statusCode) => {
      var themes_list = data.result.datalist;
      that.setData({themes_list:themes_list})
    })
    
  },
  changeRoomRype:function(e){
    console.log(e)
    var room_type = e.detail.value;
    var book_info = this.data.book_info;
    book_info.room_type = room_type;
    this.setData({book_info:book_info});
  },
  selectRoom:function(e){
    var keys = e.detail.value;
    var objectBoxArray = this.data.objectBoxArray;
    var book_info = this.data.book_info;
    book_info.room_index = keys;
    book_info.select_room_name = objectBoxArray[keys];
    this.setData({book_info:book_info})
  },
  inputTableName:function(e){
    console.log(e)
    var table_name = e.detail.value.replace(/\s+/g, '');
    var book_info  = this.data.book_info;
    book_info.table_name = table_name;
    this.setData({book_info:book_info})
  },
  handleChange:function(e){
    var book_info = this.data.book_info;
    var select_time = e.detail.dateString;
    //select_time = select_time.slice(0,13);
    book_info.book_time = select_time;
    this.setData({book_info:book_info})
  },
  inputBookName:function(e){
    var book_name = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.book_name = book_name;
    this.setData({book_info:book_info})

  },
  inputBookNums:function(e){
    var nums = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.nums = nums;
    this.setData({book_info:book_info});
  },
  inputBookMobile:function(e){
    var mobile = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.mobile = mobile;
    this.setData({book_info:book_info});
  },
  inputHotelContract:function(e){
    var hotel_contract = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.hotel_contract = hotel_contract;
    this.setData({book_info:book_info});
  },
  inputHotelTel:function(e){
    var hotel_tel = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.hotel_tel = hotel_tel;
    this.setData({book_info:book_info});
  },
  inputDesc:function(e){
    var desc = e.detail.value.replace(/\s+/g, '');
    var book_info = this.data.book_info;
    book_info.desc = desc;
    this.setData({book_info:book_info});
  },
  selectTemplate:function(e){
    var template_id = e.detail.value;
    var book_info = this.data.book_info;
    book_info.template_id = template_id;
    this.setData({book_info:book_info});
  },
  confirmBookInfo:function(e){
    console.log(e)
    var post_type = e.currentTarget.dataset.post_type
    var book_info = this.data.book_info;

    var room_type = book_info.room_type;
    var room_id = 0;
    if(room_type==1){
      var box_list = this.data.box_list;
      var room_index = book_info.room_index;    
      var room_id = box_list[room_index].id;
    }else if(room_type==2){
      var table_name = book_info.table_name;
      if(table_name==''){
        app.showToast('请输入大厅的桌号');
        return false;
      }
    }

    if(book_info.book_time==''){
      app.showToast('请选择预定时间');
      return false;
    }
    
    if(book_info.nums=='' || book_info.nums<1){
      app.showToast('请输入预定就餐的人数');
      return false;
    }
    if(book_info.book_name==''){
        app.showToast('请输入预定人称呼');
        return false;
      }
    if(book_info.mobile=='' ){
      app.showToast('请输入预定人的手机号码');
      return false;
    }
    if(!app.checkMobile(book_info.mobile)){
      app.showToast('请输入正确的手机号');
      return false; 
    }
    if(book_info.template_id==0){
      app.showToast('请选择邀请函模板');
      return false;
    }
    console.log(book_info)

    
    

    var images = '';
    var space  = '';
    for(let i in book_info.dish_pics){
      images += space + book_info.dish_pics[i].img_path;
      space = ',';
    }
    var is_open_sellplatform = book_info.is_open_sellplatform;
    var is_view_wine         = book_info.is_view_wine;
    if(is_open_sellplatform==0){
      is_view_wine = 2;
    }


    
    utils.PostRequest(api_v_url + '/invitation/confirmdata', {
      openid         : openid,
      room_id        : room_id,
      hotel_id       : hotel_id,
      book_time      : book_info.book_time,
      name           : book_info.book_name,
      people_num     : book_info.nums,
      mobile         : book_info.mobile,
      contact_name   : book_info.hotel_contract,
      contact_mobile : book_info.hotel_tel,
      desc           : book_info.desc,
      theme_id       : book_info.template_id,
      room_type      : room_type,
      table_name     : table_name,
      images         : images,
      is_sellwine    : is_view_wine
    }, (data, headers, cookies, errMsg, statusCode) => {
      var  invitation_id = data.result.invitation_id
      if(post_type=='smallapp'){
        wx.navigateToMiniProgram({
          appId: 'wxfdf0346934bb672f',
          path:'/mall/pages/wine/post_book/index?id='+invitation_id+'&status=0',
          //envVersion:'trial'
        })
      }else if(post_type=='message'){
        app.showToast('发送成功',2000,'success');
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
      
      uma.trackEvent('postbook_confirm',{'open_id':openid,'hotel_id':hotel_id})
    })

    
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
    var dish_pics = this.data.book_info.dish_pics;
    var count = 5 - dish_pics.length;
    

    wx.chooseImage({
      count: count, // 默认9
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
        
        var tmp_pic = {id:0,img_path:'',img_url:''};

        tmp_pic.img_path = "forscreen/resource/" + img_url
        var book_info = that.data.book_info;
        book_info.dish_pics.push(tmp_pic);
        that.setData({book_info:book_info})
        wx.hideLoading();
          setTimeout(function () {
            that.setData({
              addDisabled: false
            })
          }, 500);
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
  delPic:function(e){
    var keys = e.currentTarget.dataset.keys;
    var book_info = this.data.book_info;
    book_info.dish_pics.splice(keys,1);
    this.setData({book_info:book_info});
  },
  changeViewWine:function(e){
    console.log(e)
    var book_info = this.data.book_info;
    
    var is_view_wine = e.detail.value;
    is_view_wine = is_view_wine==true? 1: 2;
    book_info.is_view_wine = is_view_wine;
    this.setData({book_info:book_info});
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