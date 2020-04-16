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
var tab = 'take-out';
let swapImageObject = {
  1: null,
  2: null
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'take-out',
    dish_img_list: [], //菜品图
    dish_intro_img_list: [], //菜品介绍图
    goods_img_list: [],  //商品图
    goods_intro_img_list: [], //商品介绍图
    video_img: '',   //视频图
    goods_video_url: '', //上传商品视频
    sale_goods_type_index: 0,  //售全国商品分类
    sale_goods_type_arr: [],
    sale_goods_type_obj: [],
    oss_url: app.globalData.oss_url + '/',
    addDisabled: false,
    upDisabled: false,
    is_sale: '',
    is_localsale:0,
    hotel_type:1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    goods_id = options.goods_id;
    openid = options.openid;
    tab = options.tab;
    if(typeof(options.hotel_type)!='undefined'){
      that.setData({
        hotel_type:options.hotel_type
      })
    }
    that.setData({
      tab: tab
    }, function () {
      try { that.setNavigationBarTitle(tab); } catch (error) { console.error(error); }
    });
    if (tab == 'take-out') {
      utils.PostRequest(api_v_url + '/dish/detail', {
        goods_id: goods_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        var goods_info = data.result;
        var dish_img_list = data.result.cover_imgs_path;
        var dish_intro_img_list = data.result.detail_imgs_path;
        var is_sale = goods_info.is_sale;
        that.setData({
          is_sale: is_sale,
          goods_info: goods_info,
          dish_img_list: dish_img_list,
          dish_intro_img_list: dish_intro_img_list,
        })
      }, function () {
        wx.navigateBack({
          delta: 1
        })
      })
    } else {//全国售卖商品
      //获取分类
      utils.PostRequest(api_v_url + '/category/categorylist', {

      }, (data, headers, cookies, errMsg, statusCode) => {
        var sale_goods_type_obj = data.result.category_list
        that.setData({
          sale_goods_type_arr: data.result.category_name_list,
          sale_goods_type_obj: data.result.category_list,
        })


        utils.PostRequest(api_v_url + '/dish/detail', {
          goods_id: goods_id
        }, (data, headers, cookies, errMsg, statusCode) => {

          var goods_info = data.result;
          var goods_img_list = data.result.cover_imgs_path;
          var goods_intro_img_list = data.result.detail_imgs_path;
          //var is_sale = goods_info.is_sale;
          var video_img = data.result.video_img;
          var goods_video_url = data.result.video_path;
          var category_id = data.result.category_id;
          var sale_goods_type_index = 0;
          for (var i = 0; i < sale_goods_type_obj.length; i++) {
            if (category_id == sale_goods_type_obj[i].id) {
              sale_goods_type_index = i;
              break;
            }
          }
          that.setData({
            is_localsale: data.result.is_localsale,
            sale_goods_type_index: sale_goods_type_index,
            video_img: video_img,
            goods_video_url: goods_video_url,
            goods_info: goods_info,
            goods_img_list: goods_img_list,
            goods_intro_img_list: goods_intro_img_list,
          })
        }, function () {
          wx.navigateBack({
            delta: 1
          })
        })
      })


    }
  },
  //选择分类
  selectGoodsType: function (e) {
    var sale_goods_type_index = e.detail.value;
    this.setData({
      sale_goods_type_index: sale_goods_type_index
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
    } else if (type == 2) {
      var total_pic = that.data.dish_intro_img_list.length;
      //var choose_num = 6 - total_pic;
    } else if (type == 3) {
      var total_pic = that.data.goods_img_list.length;
    } else if (type == 4) {
      var total_pic = that.data.goods_intro_img_list.length;
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

        var postf = filename.substring(index1, index2); //后缀名\
        var postf_t = filename.substring(index1, index2); //后缀名
        var postf_w = filename.substring(index1 + 1, index2); //后缀名

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
                } else if (type == 3) {
                  var goods_img_list = that.data.goods_img_list;
                  for (var i = 0; i < goods_img_list.length; i++) {
                    if (i == keys) {
                      goods_img_list[i] = dish_img_url;
                      break;
                    }
                  }
                  that.setData({
                    goods_img_list: goods_img_list
                  })
                } else if (type == 4) {
                  var goods_intro_img_list = that.data.goods_intro_img_list;
                  for (var i = 0; i < goods_intro_img_list.length; i++) {
                    if (i == keys) {
                      goods_intro_img_list[i] = dish_img_url;
                      break;
                    }
                  }
                  that.setData({
                    goods_intro_img_list: goods_intro_img_list
                  })
                }

                wx.hideLoading();

                setTimeout(function () {
                  that.setData({
                    addDisabled: false
                  })
                }, 1000);
              },
              fail: function ({
                errMsg
              }) {
                wx.hideLoading();
                app.showToast('图片上传失败，请重试')
                that.setData({
                  addDisabled: false
                })
              },
            });
          },
          fail: function (e) {
            wx.hideLoading();
            that.setData({
              addDisabled: false
            })
          }
        })
      },
      fail: function (e) {
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
    } else if (type == 2) {
      var total_pic = that.data.dish_intro_img_list.length;
    } else if (type == 3) {
      var total_pic = that.data.goods_img_list.length;
    } else if (type == 4) {
      var total_pic = that.data.goods_intro_img_list.length;
    }
    var choose_num = 6 - total_pic;
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
        var tempFilePaths = res.tempFilePaths; //多张图片临时地址
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

              var postf = filename.substring(index1, index2); //后缀名
              var postf_t = filename.substring(index1, index2); //后缀名
              var postf_w = filename.substring(index1 + 1, index2); //后缀名

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




      },
      fail: function (e) {
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

      },
      success: function (res) {

        if (type == 1) {
          var dish_img_list = that.data.dish_img_list;
          dish_img_list.push("forscreen/resource/" + img_url);

          var end_flag = dish_img_list.length
        } else if (type == 2) {
          var dish_intro_img_list = that.data.dish_intro_img_list;
          dish_intro_img_list.push("forscreen/resource/" + img_url);

          var end_flag = dish_intro_img_list.length
        } else if (type == 3) {
          var goods_img_list = that.data.goods_img_list;
          goods_img_list.push("forscreen/resource/" + img_url);
          var end_flag = goods_img_list.length
        } else if (type == 4) {
          var goods_intro_img_list = that.data.goods_intro_img_list;
          goods_intro_img_list.push("forscreen/resource/" + img_url);
          var end_flag = goods_intro_img_list.length
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
          } else if (type == 3) {
            that.setData({
              goods_img_list: goods_img_list
            }, () => {
              wx.hideLoading();
              that.setData({
                addDisabled: false,
                upDisabled: false
              })
            })
          } else if (type == 4) {
            that.setData({
              goods_intro_img_list: goods_intro_img_list
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
    } else if (type == 3) {
      var goods_img_list = that.data.goods_img_list;
      for (var i = 0; i < goods_img_list.length; i++) {
        if (i == keys) {
          goods_img_list.splice(keys, 1);
          break;
        }
      }
      that.setData({
        goods_img_list: goods_img_list
      })
    } else if (type == 4) {
      var goods_intro_img_list = that.data.goods_intro_img_list;
      for (var i = 0; i < goods_intro_img_list.length; i++) {
        if (i == keys) {
          goods_intro_img_list.splice(keys, 1);
          break;
        }
      }
      that.setData({
        goods_intro_img_list: goods_intro_img_list
      })
    }
  },
  changeSale: function (e) {
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
    if (dish_intro_img_list.length == 0) { //如果菜品图为空
      if (intro == '') { //如果菜品介绍为空
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
      type: 21,
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
  //视频上传
  uploadVideo: function (e) {
    var that = this;
    wx.showLoading({
      title: '视频上传中...',
      mask: true
    })
    that.setData({
      addDisabled: true,
      upDisabled: true
    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {

        var size = res.size;
        if (size > 52428800) {
          app.showToast('视频不能超过50M');
          wx.hideLoading();
          that.setData({
            addDisabled: false,
            upDisabled: false
          })
        } else {
          //console.log(res);return false;
          var video_img = res.thumbTempFilePath;
          var filename = res.tempFilePath;

          var index1 = filename.lastIndexOf(".");
          var index2 = filename.length;
          var timestamp = (new Date()).valueOf();

          var postf = filename.substring(index1, index2); //后缀名\
          var postf_t = filename.substring(index1, index2); //后缀名
          var postf_w = filename.substring(index1 + 1, index2); //后缀名

          var video_url = timestamp + postf;
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
                  name: video_url,
                  key: "forscreen/resource/" + video_url,
                  policy: policy,
                  OSSAccessKeyId: app.globalData.oss_access_key_id,
                  sucess_action_status: "200",
                  signature: signature

                }, success: function (res) {
                  var goods_video_url = "forscreen/resource/" + video_url;
                  console.log(goods_video_url)
                  that.setData({
                    video_img: video_img,
                    goods_video_url: goods_video_url
                  })
                  wx.hideLoading();
                  app.showToast('视频上传成功')
                  that.setData({
                    addDisabled: false,
                    upDisabled: false
                  })
                }, fail: function (e) {
                  wx.hideLoading();
                  that.setData({
                    addDisabled: false,
                    upDisabled: false
                  })
                }
              })
            }, fail: function (res) {
              wx.hideLoading();
              that.setData({
                addDisabled: false,
                upDisabled: false
              })
            }
          })
        }
      }, fail: function (res) {
        wx.hideLoading();
        that.setData({
          addDisabled: false,
          upDisabled: false
        })
      }
    })
  },
  delVideo: function (e) {
    this.setData({
      video_img: '',
      goods_video_url: ''
    })
  },
  //修改售全国商品
  editMallGoods: function (e) {
    var that = this;
    var name = e.detail.value.name.replace(/\s+/g, '');
    var sale_goods_index = that.data.sale_goods_type_index;
    var retail_price = e.detail.value.retail_price;
    var sale_price = e.detail.value.sale_price;
    var inventory = e.detail.value.inventory;

    var goods_img_list = that.data.goods_img_list;
    var goods_video_url = that.data.goods_video_url;
    var introduce = e.detail.value.introduce.replace(/\s+/g, '');
    var goods_intro_img_list = that.data.goods_intro_img_list;
    var is_localsale = that.data.is_localsale;
    if (name == '') {
      app.showToast('请输入商品名称');
      return false;
    }
    if (sale_goods_index == 0) {
      app.showToast('请选择商品分类');
      return false;
    }
    if (retail_price == '') {
      app.showToast('请输入零售价');
      return false;
    } else {
      if (retail_price <= 0) {
        app.showToast('零售价不能小于0');
        return false;
      }
    }
    if (sale_price == '') {
      app.showToast('请输入供货价');
      return false;
    } else {
      if (sale_price <= 0) {
        app.showToast('供货价不能小于0');
        return false;
      }
    }
    if (retail_price < sale_price) {
      app.showToast('零售价不能小于包邮供货价');
      return false;
    }
    if (inventory == '') {
      app.showToast('请输入库存');
      return false;
    } else {
      var reg = /^\d{1,3}$/;
      if (!reg.test(inventory)){
        app.showToast('库存请输入三位以内的整数');
        return false;
      }
      if (inventory <= 0) {
        app.showToast('库存不能小于1');
        return false;
      }
    }

    if (goods_img_list.length == 0) {
      app.showToast('请上传商品图')
      return false;
    }
    if (goods_video_url == '') {
      app.showToast('请上传视频介绍');
      return false;
    }
    if (introduce == '') {
      app.showToast('请输入文字详情');
      return false;
    }
    if (goods_intro_img_list.length == 0) {
      app.showToast('请上传详情图片');
      return false;
    }
    var sale_goods_type_obj = that.data.sale_goods_type_obj;
    var category_id = sale_goods_type_obj[sale_goods_index].id;
    var imgs = '';
    var space = '';
    for (var i = 0; i < goods_img_list.length; i++) {
      imgs += space + goods_img_list[i];
      space = ',';
    }
    var intro_imgs = '';
    space = '';
    for (var i = 0; i < goods_intro_img_list.length; i++) {
      intro_imgs += space + goods_intro_img_list[i];
      space = ',';
    }


    that.setData({
      addDisabled: true,
    })
    utils.PostRequest(api_v_url + '/dish/editDish', {
      amount: inventory,
      category_id: category_id,
      imgs: imgs,
      goods_id: goods_id,
      detail_imgs: intro_imgs,
      intro: introduce,
      is_localsale: is_localsale,
      name: name,
      openid, openid,
      price: retail_price,
      supply_price: sale_price,
      type: 22,
      video_path: goods_video_url,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('添加成功')
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
  changeLocalSale: function (e) {
    var that = this;
    var is_localsale = that.data.is_localsale
    if (is_localsale == 0) {
      is_localsale = 1;
    } else if (is_localsale == 1) {
      is_localsale = 0;
    }
    that.setData({ is_localsale: is_localsale })
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
    let propetyNameProfix = "",
      nextClickTip = null,
      reclickTip = null;
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
      wx.showToast({
        icon: 'none',
        title: reclickTip,
        duration: 3000
      });
      return;
    }
    if (swapImageObject[picType] == null) {
      swapImageObject[picType] = {
        index: clickIndex,
        picObj: picObj
      };
      wx.showToast({
        icon: 'none',
        title: nextClickTip,
        duration: 3000
      });
      return;
    }
    let lastImageObject = swapImageObject[picType];
    swapImageObject[picType] = null;
    let dataSrc = self.data;
    dataSrc[propetyNameProfix + lastImageObject.index] = picObj;
    dataSrc[propetyNameProfix + clickIndex] = lastImageObject.picObj;
    self.setData(dataSrc);
  },


  // 选项卡选择
  showTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.tab;
    self.setData({
      tab: tabType
    }, function () {
      self.setNavigationBarTitle(tabType);
    });
  },

  setNavigationBarTitle: function (tab) {
    let navigationBarTitle = '';
    switch (tab) {
      case 'take-out':
        navigationBarTitle = '编辑菜品';
        break;
      case 'nationwide':
        navigationBarTitle = '编辑商品';
        break;
      default:
        navigationBarTitle = '编辑页';
        break;
    }
    wx.setNavigationBarTitle({ title: navigationBarTitle });
  },

  // 打开提示弹窗
  openTipPopWindow: function (e) {
    let self = this;
    let tipType = e.currentTarget.dataset.type;
    switch (tipType) {
      case 'SuggestedRetailPrice':
        self.setData({
          showTipPopWindow: true,
          tipTitle: '建议零售价',
          tipContentArray: ['建议零售价即市场指导价，是建议卖给普通用户的价格']
        });
        break;
      case 'DeliveryPriceByParcelPost':
        self.setData({
          showTipPopWindow: true,
          tipTitle: '包邮供货价',
          tipContentArray: ['包邮供货价即餐厅给小热点的包邮供货价格，订单成交后，小热点会按照包邮供货价为餐厅进行结算']
        });
        break;
      default:
        break;
    }
  },

  // 打开提示弹窗
  closeTipPopWindow: function (e) {
    let self = this;
    self.setData({
      showTipPopWindow: false
    });
  }
})