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
    listTitle: "已扫商品码（2）",
    scanList: [
      { id: 3, idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 2, idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
      { id: 1, idcode: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", checked: false },
    ],
    typeList: [
      { id: 1, label: "售卖", checked: true },
      { id: 2, label: "品鉴酒", checked: false },
      { id: 3, label: "活动", checked: false },
    ],
    img_list:{wine_receipt_img:'',bottle_cap_img:'',other_img:''},
    oss_url: app.globalData.oss_url + '/',
    addDisabled: false,
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
    var goodsList = this.data.goodsList;
    var goods_info = goodsList[0];
    var scanList = this.data.scanList
    utils.PostRequest(api_v_url + '/aa/bb', {
     
      openid: app.globalData.openid,
      idcode:code_msg,
     
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goods_info = data.result;
      var flag = 0;
      for(let i in scanList){
        if(goods_info.idcode== scanList[i].idcode){
          var flag = 1;
          break;
        }
      }
      if(flag==1){
        app.showToast('商品已扫码')
      }else {
        var scancode_nums = this.data.scancode_nums;
        scancode_nums ++;
        var listTitle = '已扫商品码('+scancode_nums+')';
        scanList.push(goods_info);
        that.setData({scanList:scanList,scancode_nums:scancode_nums,listTitle:listTitle});
      }
    })
  },
  deleteScanGoods:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var scanList = this.data.scanList;
    var goods_info = scanList[keys];

    wx.showModal({
      title: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          /*if(goods_info.status==1){
            scanList.splice(keys,1);
            that.setData({scanList:scanList})
          }else {
            utils.PostRequest(api_v_url + '/stock/delGoodscode', {
              openid:openid,
              idcode:goods_info.idcode,
              type:1
            }, (data, headers, cookies, errMsg, statusCode) => {
              var scancode_nums = that.data.scancode_nums
              scancode_nums --;
              scanList.splice(keys,1);
              that.setData({scanList:scanList,scancode_nums:scancode_nums})
            })
          }*/
        }
      }
    })
    
  },
  changeReason:function(e){
    var id = e.detail.value;
    var typeList = this.data.typeList;
    for(let i in typeList){
      typeList[i].checked = false;
      if(typeList[i].id== id){
        typeList[i].checked = true;
      }
    }
    console.log(typeList)
    this.setData({typeList:typeList})
  },
  uploadChargeoffPic: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var img_list = this.data.img_list;
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
                switch(type){
                  case 'wine_receipt_img':
                    img_list.wine_receipt_img = img_path;
                    break;
                  case 'bottle_cap_img':
                    img_list.bottle_cap_img = img_path;
                    break;
                  case 'other_img':
                    img_list.other_img = img_path;
                    break;
                }

                that.setData({
                  img_list:img_list
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
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {

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