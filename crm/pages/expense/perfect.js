// crm/pages/expense/perfect.js

/**
 * 完善消费记录页
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
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    policy:'',
    signature:'',
    addDisabled:false,
    popRemakWind : false,
    oss_url:oss_url,
    room_list:[],
    room_name_list:[],
    lable_list:[],
    consumer_info:{customer_id:0,mobile:'',name:'',room_id:0,room_index:0,meal_time:'',people_num:'',money:'',remark:'',small_ticket:[],type:''}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid   = app.globalData.openid;
    hotel_id = options.hotel_id;
    var consumer_info = this.data.consumer_info;
    var customer_id   = options.customer_id;
    var mobile        = options.mobile;
    var name          = options.name;
    var room_id       = options.room_id;
    var book_time     = options.book_time;
    var type          = options.type;

    
    consumer_info.customer_id = customer_id;
    consumer_info.mobile      = mobile;
    consumer_info.name        = name;
    consumer_info.room_id     = room_id;
    consumer_info.meal_time   = book_time;
    consumer_info.type        = type;

    wx.removeStorageSync(cache_key+'customer_lable');
    this.getRoomList(openid,hotel_id,room_id,consumer_info);
    this.getOssParams();
    this.getLables(openid,customer_id);
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
  getRoomList:function(openid,hotel_id,room_id,consumer_info){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRooms', {
      hotel_id: hotel_id,
      openid  : openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var room_list = data.result.room_list;
      var room_index = data.result.room_index;
      var room_name_list = data.result.room_name_list
      console.log(room_id)
      for(let i in room_list){
        if(room_list[i].id==room_id){
          room_index = i;
          break;
        }
      }
      
      consumer_info.room_index = room_index;
      consumer_info.room_id    = room_list[room_index].id;
      that.setData({
        room_list      : room_list,
        room_name_list : room_name_list,
        consumer_info  : consumer_info
      })
    })
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
  inputInfo:function(e){
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var consumer_info = this.data.consumer_info;
    var input_value = e.detail.value;
    switch(type){
      case 'name':
        consumer_info.name = input_value;
        break;
      case 'people_num':
        consumer_info.people_num = input_value;
        break;
      case 'money':
        consumer_info.money = input_value;
        break;
    }
    console.log(consumer_info)
    this.setData({consumer_info:consumer_info});
  },
  chooseRoom:function(e){
    var room_index = e.detail.value;
    var room_list = this.data.room_list;
    var consumer_info = this.data.consumer_info;

    var room_id = room_list[room_index].id;
    consumer_info.room_index = room_index
    consumer_info.room_id = room_id;
    console.log(consumer_info)
    this.setData({consumer_info:consumer_info})
  },
  handleChange:function(e){
    console.log(e)
    var consumer_info = this.data.consumer_info;
    var select_time = e.detail.dateString;
    //select_time = select_time.slice(0,13);
    consumer_info.meal_time = select_time;
    this.setData({consumer_info:consumer_info})
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
    var small_ticket = this.data.consumer_info.small_ticket;
    var count = 3 - small_ticket.length;
    

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
        
        var head_pic = "forscreen/resource/" + img_url
        var consumer_info = that.data.consumer_info;
        consumer_info.small_ticket.push(head_pic);
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
  delSmallTicket:function(e){
    var keys = e.currentTarget.dataset.keys;
    var consumer_info = this.data.consumer_info;
    consumer_info.small_ticket.splice(keys,1);
    this.setData({consumer_info:consumer_info});
  },
  /**
   * 预览图片
   * @param {*} e 
   */
  previewImages: function (e) {
    let oss_url = this.data.oss_url;
    
    let pictures = this.data.consumer_info.small_ticket;
    let pictureIndex = e.currentTarget.dataset.index;
    let urls = [];
    for (let row in pictures) {
      urls[row] = oss_url+'/'+pictures[row];
    }
    wx.previewImage({
      current: urls[pictureIndex], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
      success: function (res) {
       
      },
      fail: function (e) {
        
      }
    });
  },
  popRemarkWind:function(e){
    var type = e.currentTarget.dataset.type;
    var is_pop = type==1?true:false;
    this.setData({popRemakWind:is_pop})
  },
  addRemark:function(e){
    console.log(e)
    var remark = e.detail.value.remark;
    var consumer_info = this.data.consumer_info;
    consumer_info.remark = remark;
    this.setData({consumer_info:consumer_info,popRemakWind:false});
  },
  submitConsumerInfo:function(e){
    var that = this;
    var consumer_info = this.data.consumer_info;
    
    if(consumer_info.name=='' && consumer_info.type=='perfect'){
      app.showToast('请填写客人姓名');
      return false;
    }
    if(consumer_info.room_id==0){
      app.showToast('请选择就餐包间');
      return false;
    }
    if(consumer_info.meal_time==''){
      app.showToast('请选择就餐时间');
      return false;
    }
    if(consumer_info.people_num=='' || consumer_info.people_num==0){
      app.showToast('请输入就餐人数');
      return false;
    }
    if(consumer_info.money=='' || consumer_info.money==0){
      app.showToast('请输入消费金额');
      return false;
    }
    if(consumer_info.small_ticket.length==0){
      app.showToast('请上传消费小票');
      return false;
    }
    var images = '';
    var space  = '';
    var small_ticket = consumer_info.small_ticket;
    for(let i in small_ticket){
      images +=space+small_ticket[i];
      space = ',';
    }
    space  = '';
    var labels = '';
    var lable_list = this.data.lable_list;
    for(let i in lable_list){
      labels +=space +lable_list[i].name;
      space  = ',';
    }
    this.setData({addDisabled:true});
    utils.PostRequest(api_v_url + '/customer/addExpenseRecord', {
      customer_id  : consumer_info.customer_id,
      images       : images,
      labels       : labels,
      meal_time    : consumer_info.meal_time,
      mobile       : consumer_info.mobile,
      money        : consumer_info.money,
      name         : consumer_info.name,
      openid       : openid,
      people_num   : consumer_info.people_num,
      remark       : consumer_info.remark,
      room_id      : consumer_info.room_id 
      
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('保存成功',2000,'success',true);
      that.setData({addDisabled:false});
      setTimeout(() => {
        wx.navigateBack({
          delta:1
        })
      }, 2000);
    },rec=>{
      that.setData({addDisabled:false});
    })
  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    var consumer_info = this.data.consumer_info;
    
    var url = '';
    if(type=='lable'){
      url = '/crm/pages/consumer/label?customer_id='+consumer_info.customer_id+'&is_save=0' ;
    }
    wx.navigateTo({
      url: url,
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
    console.log('ssssss')
    var lable_info = wx.getStorageSync(cache_key+'customer_lable');
    if(lable_info!=''){
      console.log('fdafasdfadsf')
      var lable_list = JSON.parse(lable_info);
      console.log(lable_list)
      this.setData({lable_list:lable_list})
    }
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