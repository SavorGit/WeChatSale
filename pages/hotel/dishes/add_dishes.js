// pages/hotel/dishes/add_dishes.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var merchant_id;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dish_img0:'',
    dish_img1: '',
    dish_img2: '',
    dish_img3: '',
    dish_img4: '',
    dish_img5: '',
    intro_type:1,  //介绍类型  1：文本 2： 图片
    intro_img0:'',
    intro_img1: '',
    intro_img2: '',
    intro_img3: '',
    intro_img4: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = options.openid;
    merchant_id = options.hotel_id;

  },
  /**
   * 上传菜品图
   */
  uploadDishesPic:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var is_desc_img = e.currentTarget.dataset.is_desc_img;
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
                
                if(keys=0){
                  that.setData({
                    dish_img0: dish_img_url,
                  })
                }else if(keys ==1){
                  that.setData({
                    dish_img1: dish_img_url,
                  })
                }else if(keys=2){
                  that.setData({
                    dish_img2: dish_img_url,
                  })
                }else if(keys ==3){
                  that.setData({
                    dish_img3: dish_img_url,
                  })
                }else if(keys ==4){
                  that.setData({
                    dish_img4: dish_img_url,
                  })
                }else if(keys ==5){
                  that.setData({
                    dish_img5: dish_img_url,
                  })
                }
              },
              fail: function ({ errMsg }) {
                app.showToast('图片上传失败，请重试')
              },
            });
          }
        })
      }
    })
  },
  addDishes:function(e){
    var that = this;
    console.log(e)
    var name = e.detail.value.name;
    if(name==''){
      app.showToast('请填写菜品名称');
      return false;
    }
    var price = e.detail.value.price;
    if (price == '') {
      app.showToast('请填写价格');
      return false;
    }

    var dish_img0 = e.detail.value.dish_img0;
    var dish_img1 = e.detail.value.dish_img1;
    var dish_img2 = e.detail.value.dish_img2;
    var dish_img3 = e.detail.value.dish_img3;
    var dish_img4 = e.detail.value.dish_img4;
    var dish_img5 = e.detail.value.dish_img5;
    var imgs = '';
    if (dish_img0 !=''){
      imgs += dish_img0+',';
    }
    if(dish_img1 !=''){
      imgs += dish_img1 +',';
    }
    if(dish_img2 !=''){
      imgs += dish_img2 + ',';
    }
    if (dish_img3 != '') {
      imgs += dish_img3 + ',';
    }
    if (dish_img4 != '') {
      imgs += dish_img4 + ',';
    }
    if (dish_img5 != '') {
      imgs += dish_img5 + ',';
    }
    if(imgs.length==0){
      app.showToast('请上传菜品图')
      return false;
    }else {
      imgs = imgs.substring(0,imgs.length-1);
      if(imgs.length==0){
        app.showToast('请上传菜品图')
        return false;
      }
    }

    var intro_type = that.data.intro_type;
    if(intro_type==1){//文本介绍
      var intro = e.detail.value.intro
      if(intro==''){
        app.showToast('请填写菜品介绍')
        return false;
      }
    }else if(intro_type==2){//图片介绍
      var intro_img0 = e.detail.value.intro_img0;
      var intro_img1 = e.detail.value.intro_img1;
      var intro_img2 = e.detail.value.intro_img2;
      var intro_img3 = e.detail.value.intro_img3;
      var intro_img4 = e.detail.value.intro_img4;

      var intro_imgs = '';
      if (intro_img0 != '') {
        intro_imgs += intro_img0 + ',';
      }
      if (intro_img1 != '') {
        intro_imgs += intro_img1 + ',';
      }
      if (intro_img2 != '') {
        intro_imgs += intro_img2 + ',';
      }
      if (intro_img3 != '') {
        intro_imgs += intro_img3 + ',';
      }
      if (intro_img4 != '') {
        intro_imgs += intro_img4 + ',';
      }

      if (intro_imgs.length == 0) {
        app.showToast('请上传菜品介绍图')
        return false;
      } else {
        intro_imgs = intro_imgs.substring(0, intro_imgs.length - 1);
        if (intro_imgs.length == 0) {
          app.showToast('请上传菜品介绍图')
          return false;
        }
      }
      var intro = intro_imgs;
    }
    utils.PostRequest(api_v_url + '/dish/addDish', {
      imgs: imgs,
      intro: intro,
      intro_type: intro_type,
      name:name,
      openid: openid,
      price:price,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('添加成功')
      wx.navigateBack({
        delta: 1
      })
    })
  },
  /**
   * 切换菜品介绍类型  1 文本 2 图片
   */
  switchIntroType:function(e){
    var that = this ;
    var intro_type = that.data.intro_type
    if(intro_type==1){
      intro_type ==2
    }else if(intro_type==2){
      intro_type==1
    }
    that.setData({
      intro_type:intro_type
    })
  },
  uploadIntroPic:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filename_arr = res.tempFilePaths;

        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success:function(rt){
            var policy = rt.data.policy;
            var signature = rt.data.signature;   
            for(var i=0;i<filename_arr.length;i++){
              var filename = filename_arr[i];

              var index1 = filename.lastIndexOf(".");
              var index2 = filename.length;
              var timestamp = (new Date()).valueOf();

              var postf = filename.substring(index1, index2);//后缀名\
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
                  var intro_img_url = "forscreen/resource/" + img_url
                  if(i=0){
                    that.setData({
                      intro_img0: dish_img_url,
                    })
                  }
                  if (i = 1) {
                    that.setData({
                      intro_img1: dish_img_url,
                    })
                  }
                  if (i = 2) {
                    that.setData({
                      intro_img2: dish_img_url,
                    })
                  }
                  if (i = 3) {
                    that.setData({
                      intro_img3: dish_img_url,
                    })
                  }
                  if (i = 4) {
                    that.setData({
                      intro_img4: dish_img_url,
                    })
                  }
                },
                fail: function ({ errMsg }) {

                },
              });
            } 
          }
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

  }
})