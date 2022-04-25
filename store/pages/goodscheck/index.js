// store/pages/goodscheck/index.js
/**
 * 商品验收 首页
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
    goodsList: [],
    scanList: [],
    stock_id:0,
    config_info:{step:1},
    img_path:'',
    oss_url: app.globalData.oss_url + '/',
    addDisabled: false,
    title:'已扫商品码(0/0)',
    all_nums:0,
    have_scan_nums:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;


  },
  scanGoodsCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
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
    var config_info = this.data.config_info;
    var stock_id = this.data.stock_id;
    utils.PostRequest(api_v_url + '/stock/scanCheck', {
      openid: app.globalData.openid,
      idcode: code_msg,
      stock_id  : stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(stock_id==0){
        that.getStockInfo(data.result.stock_id,app.globalData.openid)
        that.setData({stock_id:data.result.stock_id});
      }
      var idcode = data.result.idcode;
      
      var scanList = data.result.goods_list;
      if(scanList.length==0){
        scanList = that.data.scanList;
        var is_return = false;
        for(let i in scanList){
          if(scanList[i].idcode==idcode && scanList[i].checked==true){
            is_return = true;
          }
        }
        if(is_return){
          app.showToast('该商品已扫码');
          return false;
        }
      }
      var have_scan_nums = 0;
      for(let i in scanList){
        if(scanList[i].idcode==idcode){
          scanList[i].checked = true;
        }
        if(scanList[i].checked == true){
          have_scan_nums ++;
        }
      }
      var title = "已扫码商品("+have_scan_nums+"/"+scanList.length+")";
      that.setData({scanList:scanList,title:title,have_scan_nums:have_scan_nums,all_nums:scanList.length})
    })
  },
  getStockInfo:function(stock_id,openid){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getGoodsByStockid', {
      openid: openid,
      stock_id  : stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goodsList = data.result.goods_list;
      for(let i in goodsList){
        goodsList[i].viewBt = false;
      }
      that.setData({goodsList:goodsList})
    })
  },
  changeStep:function(){
    var all_nums = this.data.all_nums;
    var have_scan_nums = this.data.have_scan_nums;
    if(all_nums==0){
      app.showToast('请扫商品码')
      return false;
    } 
    if(have_scan_nums<all_nums){
      app.showToast('请扫完所有商品码');
      return false;
    }

    var config_info = this.data.config_info;
    config_info.step = 2;
    this.setData({config_info:config_info});
  },
  uploadCheckBillPic: function (e) {
    console.log(e)
    var that = this;
    

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
                that.setData({
                  img_path:img_path
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
  subGoodsCheck:function(){
    var that = this;
    var stock_id = this.data.stock_id;
    var check_img = this.data.img_path;
    var scanList = this.data.scanList;
    var space = '';
    var goods_codes = '';
    for(let i in scanList){
      goods_codes += space + scanList[i].idcode;
      space = ',';
    }
    wx.showModal({
      title: '确定要提交吗？',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/stock/finishCheck', {
            openid: openid,
            check_img:check_img,
            goods_codes:goods_codes,
            stock_id:stock_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            wx.navigateBack({ delta: 1})
            app.showToast('提交成功',2000,'success');
          })
        }
      }
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