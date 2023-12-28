// store/pages/goodschargeoff/addinfo.js
/**
 * 核销 新增核销申请
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listTitle: "已扫商品码(0)",
    scanList: [],
    
    reasons:[],   //核销原因
    datas:[],     //核销资料
    oss_url: app.globalData.oss_url + '/',
    addDisabled: false, 
    goods_id:0,
    location_info:{latitude:'',longitude:''}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    if(typeof(options.code_msg)!='undefined'){
      this.goodsDecode(options.code_msg);
    }
    if(typeof(options.is_supplement)!='undefined'){
      var is_supplement = options.is_supplement;
    }else {
      var is_supplement = 0;
    }
    this.setData({is_supplement:is_supplement})
    this.getLocation();
  },
  getLocation:function(){
    var that = this;
    var location_info = this.data.location_info;
    wx.getSetting({
      success (res) {
        var setting  = res.authSetting;
        
        if(typeof(setting['scope.userLocation'])!='undefined' && setting['scope.userLocation']==true){
          console.log('ddddd')
          wx.getLocation({
            type: 'wgs84',
            isHighAccuracy:true,
            success(rts) {
              var latitude = rts.latitude;
              var longitude = rts.longitude;
              location_info.latitude = latitude;
              location_info.longitude = longitude;
              that.setData({location_info});
            }
          })
        }
      }
    })
  },
  scanGoodsCode:function(){
    var that = this;
    var scanList = this.data.scanList;
    if(scanList.length>=6){
      app.showToast('单次核销不能超过6瓶',2000,'none',true);
      return false;
    }
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log(res)
        var code_msg = res.result;
        //解码
        that.goodsDecode(code_msg);

      },fail:function(res){
        app.showToast('二维码识别失败,请重试');
      }
    })
  },
  goodsDecode:function(code_msg){
    var that = this;
    var scanList = this.data.scanList;
    
    var goods_id = this.data.goods_id;
    utils.PostRequest(api_v_url + '/stock/scanWriteoff', {
      openid: openid,
      idcode:code_msg,
      goods_id:goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var flag  = 0;
      var goods_info = data.result;
      for(let i in scanList){
        if(scanList[i].idcode==goods_info.idcode){
          flag = 1;
          break;
        }
      }
      if(flag == 0){
        scanList.push(goods_info);
        var listTitle = '已扫商品码('+scanList.length+')';
        that.setData({scanList:scanList,goods_id:goods_info.goods_id,listTitle:listTitle});
        if(goods_id==0){
          that.getWriteoffReasonByGoods(goods_info.goods_id);
        }
      }else {
        app.showToast('请勿重复扫码');
      }
      
      
      
    })
  },
  getWriteoffReasonByGoods:function(goods_id){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getWriteoffReasonByGoods', {
      goods_id:goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var reasons = data.result.reasons;
      var datas   = data.result.datas;
      for(let i in reasons){
        reasons[i].checked = false;
      }
      var entity = data.result.entity;
      //that.setData({reasons:reasons,datas:datas})
      that.setData({reasons:reasons,entity:entity})
    })
  },
  deleteScanGoods:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var scanList = this.data.scanList;

    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          scanList.splice(keys,1);
          var listTitle = '已扫商品码（'+scanList.length+'）';
          var goods_id = that.data.goods_id;
          var reasons  = that.data.reasons;
          var datas    = that.data.datas;
          if(scanList.length==0){
            goods_id = 0;
            reasons  = [];
            datas    = [];
          }
          that.setData({scanList:scanList,listTitle:listTitle,goods_id:goods_id,reasons:reasons,datas:datas});
        }
      }
    })
    
  },
  changeReason:function(e){
    var that = this;
    var id = e.detail.value;
    var reasons = this.data.reasons;
    for(let i in reasons){
      reasons[i].checked = false;
      if(reasons[i].id== id){
        reasons[i].checked = true;
      }
    }
    this.setData({reasons:reasons,datas:[]})
    var goods_id = this.data.goods_id;
    this.getAbcd(id,goods_id)
  },
  getAbcd:function(id,goods_id){
    var that = this;
    
    utils.PostRequest(api_v_url + '/stock/getWriteoffReasonByGoods', {
      type:id,
      goods_id:goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({datas:data.result.datas})
    })
  },
  uploadChargeoffPic: function (e) {
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    
    var datas = this.data.datas;
    wx.showLoading({
      title: '图片上传中...',
      mask: true
    })
    that.setData({
      addDisabled: true
    })
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
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
                var img_path = "forscreen/resource/" + img_url
                console.log(datas);
                datas[keys].img_url = img_path;

                that.setData({
                  datas:datas
                })
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
          }, fail: function (e) {
            wx.hideLoading();
            that.setData({
              addDisabled: false
            })
          }
        })
      }, fail: function (e) {
        wx.hideLoading();
        that.setData({
          addDisabled: false
        })
      }
    })
  },
  subGoodsChargeoff:function(){
    var that = this;
    var scanList = this.data.scanList;
    if(scanList.length==0){
      app.showToast('请扫核销的商品码');
      return false;
    }
    var goods_codes = '';
    var space       = '';
    for(let i in scanList){
      goods_codes += space + scanList[i].idcode;
      space  = ',';
    }

    var reasons = this.data.reasons;
    var is_return_reason = true;
    var reason_type = 0;
    for(let i in reasons){
      if(reasons[i].checked==true){
        is_return_reason = false;
        reason_type = reasons[i].id;
        break;
      }
    }
    if(is_return_reason){
      app.showToast('请选择核销原因');
      return false;
    }
    var datas = this.data.datas;
    var is_return_datas = false;
    var data_imgs = '';
    var ispace = '';
    for(let i in datas){
      if(datas[i].img_url =='' && datas[i].is_required==1){
        is_return_datas = true;
      }
      if(datas[i].img_url!=''){
        data_imgs += ispace + datas[i].img_url;
        ispace = ',';
      }
    }
    if(is_return_datas){
      app.showToast('请上传核销资料');
      return false;
    }
    var location_info = this.data.location_info;

    utils.PostRequest(api_v_url + '/stock/finishWriteoff', {
      openid: openid,
      data_imgs:data_imgs,
      goods_codes:goods_codes,
      reason_type:reason_type,
      longitude  : location_info.longitude,
      latitude   : location_info.latitude
    }, (data, headers, cookies, errMsg, statusCode) => {
      var message = data.result.message; 
      app.showToast(message,2000,'success');
      wx.navigateBack({delta:1})
      
    })
    
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    var urls = [];
    for (var i = 0; i < 1; i++) {
      urls[i] = current;
    }
    wx.previewImage({
      current: urls[0], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
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