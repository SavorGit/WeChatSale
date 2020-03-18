// pages/hotel/setting/basic.js
/**
 * 基本信息设置页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTipPopWindow: false,
    tipContent: '',
    oss_url: app.globalData.oss_url + '/',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 上传菜品图
   */
  uploadDishesPic: function (e) {
    console.log(e)
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var is_desc_img = e.currentTarget.dataset.is_desc_img;
    var type = e.currentTarget.dataset.type;

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
                var dish_img_url = "forscreen/resource/" + img_url

                if (type == 'logo') {//logo图
                  that.setData({
                    logoimg: dish_img_url
                  })
                } else if (type == 'face') { //门帘
                  that.setData({
                    faceimg: dish_img_url
                  })
                } else if (type == 'env') { //环境
                  that.setData({
                    envimg: dish_img_url
                  })
                } else if (type == 'idcard') {  //法人身份证
                  if (keys == 0) {
                    that.setData({
                      legal_idcard_img0: dish_img_url
                    })
                  } else if (keys == 1) {
                    that.setData({
                      legal_idcard_img1: dish_img_url
                    })
                  } else if (keys == 2) {
                    that.setData({
                      legal_idcard_img2: dish_img_url
                    })
                  }

                } else if (type == 'charter') {//执照
                  if (keys == 0) {
                    that.setData({
                      legal_charter_img0: dish_img_url
                    })
                  } else if (keys == 1) {
                    that.setData({
                      legal_charter_img1: dish_img_url
                    })
                  }
                } else if (type == 'pu_idcard') {//身份证
                  console.log('idcard_0' + dish_img_url)
                  if (keys == 0) {
                    that.setData({
                      id_before: dish_img_url
                    })
                  } else if (keys == 1) {
                    that.setData({
                      id_after: dish_img_url
                    })
                  }
                }
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

  },

  // 打开提示弹窗
  openTipPopWindow: function (e) {
    let self = this;
    self.setData({ showTipPopWindow: true, tipTitle: '说明', tipContent: '提示内容' });
  },

  // 打开提示弹窗
  closeTipPopWindow: function (e) {
    let self = this;
    self.setData({ showTipPopWindow: false });
  }
})