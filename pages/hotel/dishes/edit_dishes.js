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
var goods_id;
let swapImageObject = { 1: null, 2: null };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dish_img_list: [],        //菜品图
    dish_intro_img_list: [],   //菜品介绍图
    oss_url: app.globalData.oss_url + '/',
    addDisabled: false,
    upDisabled: false,
    is_sale:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    goods_id = options.goods_id;
    openid = options.openid;

    utils.PostRequest(api_v_url + '/dish/detail', {
      goods_id: goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goods_info = data.result;
      var dish_img_list = data.result.cover_imgs_path;
      var dish_intro_img_list = data.result.detail_imgs_path;
      var is_sale = goods_info.is_sale;
      that.setData({
        is_sale:is_sale,
        goods_info: goods_info,
        dish_img_list: dish_img_list,
        dish_intro_img_list: dish_intro_img_list,
      })
    }, function () {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  /**
   * 上传菜品图
   */
  uploadOneDishesPic: function (e) {
    console.log(e)
    app.sleep(200);
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      var total_pic = that.data.dish_img_list.length;
      //var choose_num = 6 - total_pic;
    } else {
      var total_pic = that.data.dish_intro_img_list.length;
      //var choose_num = 6 - total_pic;
    }
    if (total_pic > 6) {
      app.showToast('最多上传6张照片');
      return false;
    }
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
                if (type == 1) {
                  var dish_img_list = that.data.dish_img_list;
                  for (var i = 0; i < dish_img_list.length; i++) {
                    if (i == keys) {
                      dish_img_list[i] = dish_img_url;
                      break;
                    }
                  }
                  that.setData({
                    dish_img_list: dish_img_list
                  })
                } else if (type == 2) {
                  var dish_intro_img_list = that.data.dish_intro_img_list;
                  for (var i = 0; i < dish_intro_img_list.length; i++) {
                    if (i == keys) {
                      dish_intro_img_list[i] = dish_img_url;
                      break;
                    }
                  }
                  that.setData({
                    dish_intro_img_list: dish_intro_img_list
                  })
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
  uploadDishesPic: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;

    if (type == 1) {
      var total_pic = that.data.dish_img_list.length;
      var choose_num = 6 - total_pic;
    } else {
      var total_pic = that.data.dish_intro_img_list.length;
      var choose_num = 6 - total_pic;
    }
    if (total_pic >= 6) {
      app.showToast('最多上传6张照片');
      return false;
    }

    wx.showLoading({
      title: '图片上传中...',
      mask: true
    })
    that.setData({
      addDisabled: true,
      upDisabled: true
    })
    
    wx.chooseImage({
      count: choose_num, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;  //多张图片临时地址
        var flag = tempFilePaths.length + total_pic;
        console.log(flag)
        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rest) {
            var policy = rest.data.policy;
            var signature = rest.data.signature;

            for (var i = 0; i < tempFilePaths.length; i++) {
              var filename = tempFilePaths[i];

              var index1 = filename.lastIndexOf(".");
              var index2 = filename.length;
              var timestamp = (new Date()).valueOf();

              var postf = filename.substring(index1, index2);//后缀名
              var postf_t = filename.substring(index1, index2);//后缀名
              var postf_w = filename.substring(index1 + 1, index2);//后缀名

              var img_url = timestamp + postf;
              //console.log(img_url)
              that.upOss(filename, postf_w, img_url, policy, signature, i, flag, type)
            }
          },
          fail: function (rt) {
            wx.hideLoading();
            that.setData({
              addDisabled: false,
              upDisabled: false
            })

          }
        })




      }, fail: function (e) {
        wx.hideLoading();
        that.setData({
          addDisabled: false,
          upDisabled: false
        })
      }
    })
  },
  upOss: function (filename, postf_w, img_url, policy, signature, i, flag, type) {

    var that = this;


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

      }, success: function (res) {

        if (type == 1) {
          var dish_img_list = that.data.dish_img_list;
          dish_img_list.push("forscreen/resource/" + img_url);
          
          var end_flag = dish_img_list.length
        } else if (type == 2) {
          var dish_intro_img_list = that.data.dish_intro_img_list;
          dish_intro_img_list.push("forscreen/resource/" + img_url);
          
          var end_flag = dish_intro_img_list.length
        }

        if (end_flag == flag) {
          if (type == 1) {
            that.setData({
              dish_img_list: dish_img_list
            }, () => {
              wx.hideLoading();
              that.setData({
                addDisabled: false,
                upDisabled: false
              })
            })
          } else if (type == 2) {
            that.setData({
              dish_intro_img_list: dish_intro_img_list
            }, () => {
              wx.hideLoading();
              that.setData({
                addDisabled: false,
                upDisabled: false
              })
            })
          }
        }
      }
    })
  },
  delPic: function (e) {
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      var dish_img_list = that.data.dish_img_list;
      for (var i = 0; i < dish_img_list.length; i++) {
        if (i == keys) {
          dish_img_list.splice(keys, 1);
          break;
        }
      }
      that.setData({
        dish_img_list: dish_img_list
      })
    } else if (type == 2) {
      var dish_intro_img_list = that.data.dish_intro_img_list;
      for (var i = 0; i < dish_intro_img_list.length; i++) {
        if (i == keys) {
          dish_intro_img_list.splice(keys, 1);
          break;
        }
      }
      console.log(dish_intro_img_list)
      that.setData({
        dish_intro_img_list: dish_intro_img_list
      })
    }
  },
  changeSale:function(e){
    var is_sale = this.data.is_sale
    if (is_sale == 1) {
      is_sale = 0;
    } else if (is_sale == 0) {
      is_sale = 1;
    }
    this.setData({
      is_sale: is_sale
    })
  },
  editDishes: function (e) {
    var that = this;

    var name = e.detail.value.name.replace(/\s+/g, '');
    var intro = e.detail.value.intro;
    if (name == '') {
      app.showToast('请填写菜品名称');
      return false;
    }
    var price = e.detail.value.price.replace(/\s+/g, '');


    if (price == '') {
      app.showToast('请填写价格');
      return false;
    }
    if (price < 0.1 || price >= 100000) {
      app.showToast('价格请填写0.10-99999.99之间的数字')
      return false;
    }

    var dish_img_list = that.data.dish_img_list;
    if (dish_img_list.length == 0) {
      app.showToast('请上传菜品图')
      return false;
    }
    var dish_intro_img_list = that.data.dish_intro_img_list;
    console.log(that.data)
    if (dish_intro_img_list.length == 0) {//如果菜品图为空
      if (intro == '') {//如果菜品介绍为空
        app.showToast('请填写菜品介绍或者上传详情图片')
        return false;
      }

    }
    var imgs = '';
    var space = '';
    for (var i = 0; i < dish_img_list.length; i++) {
      imgs += space + dish_img_list[i];
      space = ',';
    }
    var intro_imgs = '';
    space = '';
    for (var i = 0; i < dish_intro_img_list.length; i++) {
      intro_imgs += space + dish_intro_img_list[i];
      space = ',';
    }
    var is_sale = that.data.is_sale;


    that.setData({
      addDisabled: true,
    })
    utils.PostRequest(api_v_url + '/dish/editDish', {
      detail_imgs: intro_imgs,
      goods_id: goods_id,
      imgs: imgs,
      intro: intro,
      is_sale: is_sale,
      name: name,
      openid: openid,
      price: price,

    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('编辑成功')
      wx.navigateBack({
        delta: 1
      })
      that.setData({
        addDisabled: false,
      })
      
    }, function () {
      that.setData({
        addDisabled: false,
      })
    })
  },

  setTotalCount: function (res) {
    var regu = "^([0-9]*[.0-9])$"; // 小数测试
    var re = new RegExp(regu);
    var totalCount = res.detail.value;
    if (totalCount != '') {

      if (totalCount.substr(0, 1) == '.') {
        return '';
      }
      if (totalCount.search(re) == -1) {

        totalCount = Math.round(totalCount * 100) / 100;
        if (parseFloat(totalCount).toString() == "NaN") {
          return '';
        }
        return parseFloat(totalCount).toString();

      }
      if (totalCount >= 100000) {
        return 99999.99;
      }


    }
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

  // 长按对调位置
  longPressForChangePosition: function (e) {
    let self = this;
    let clickIndex = e.currentTarget.dataset.index;
    let picType = e.currentTarget.dataset.type;
    let propetyNameProfix = "", nextClickTip = null, reclickTip = null;
    if (picType == 1) {
      propetyNameProfix = "dish_img";
      reclickTip = "操作错误，重新选择第一张菜品图片";
      nextClickTip = "请长按下一张菜品图片进行对调";
    } else if (picType == 2) {
      propetyNameProfix = "intro_img";
      reclickTip = "操作错误，重新选择第一张详情图片";
      nextClickTip = "请长按下一张详情图片进行对调";
    }
    let picObj = self.data[propetyNameProfix + clickIndex];
    if (typeof (picObj) != "string" || picObj.trim() == "") {
      swapImageObject[picType] = null;
      wx.showToast({ icon: 'none', title: reclickTip, duration: 3000 });
      return;
    }
    if (swapImageObject[picType] == null) {
      swapImageObject[picType] = { index: clickIndex, picObj: picObj };
      wx.showToast({ icon: 'none', title: nextClickTip, duration: 3000 });
      return;
    }
    let lastImageObject = swapImageObject[picType]; swapImageObject[picType] = null;
    let dataSrc = self.data;
    dataSrc[propetyNameProfix + lastImageObject.index] = picObj;
    dataSrc[propetyNameProfix + clickIndex] = lastImageObject.picObj;
    self.setData(dataSrc);
  },
})