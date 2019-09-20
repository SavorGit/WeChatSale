// pages/tv_sale/system.js
const app = getApp()
var api_url = app.globalData.api_url;
var box_mac;
var hotel_id;
var openid;
var policy;
var signature;
var accessid;
var page = 1;
var common_appid = app.globalData.common_appid;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var play_list = [];
var mobile_brand = app.globalData.mobile_brand;
var mobile_model = app.globalData.mobile_model;
var my_activity_info = {
  'start_date': '',
  'end_date': '',
  'room_type': 0,
  'price': '',
  'goods_img': '',
  'media_type': 0
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myChoosed: 0,
    showPageType: 1,
    play_list: [], //节目单播放列表
    sale_list: [], //促销活动列表
    room_type: 1, //活动范围1：全部 2：包间 3：非包间
    room_arr: [{
        'id': 0,
        'name': '全部',
        'checked': true,
        'desc': '本餐厅全部电视'
      },
      {
        'id': 1,
        'name': '包间',
        'checked': false,
        'desc': '本餐厅包间电视'
      },
      {
        'id': 2,
        'name': '非包间',
        'checked': false,
        'desc': '本餐厅非包间电视'
      }
    ],
    check_status_arr: [{
        'status': 1,
        'name': '审核中',
        'img': 'https://oss.littlehotspot.com/Html5/images/sale/EB6877-examining.png'
      },
      {
        'status': 2,
        'name': '审核通过',
        'img': 'https://oss.littlehotspot.com/Html5/images/sale/EB6877-examined.png'
      },
      {
        'status': 3,
        'name': '未审核通过',
        'img': 'https://oss.littlehotspot.com/Html5/images/sale/EB6877-unpass.png'
      },
      {
        'status': 5,
        'name': '已过期',
        'img': 'https://oss.littlehotspot.com/Html5/images/sale/EB6877-expire.png'
      }
    ],
    start_date: '', //活动开始时间
    end_date: '', //活动结束时间
    is_my_activity: 0, //是否有我的活动
    my_activity_info: {
      'goods_id': 0,
      'start_date': '',
      'end_date': '',
      'room_type': 0,
      'price': '',
      'goods_img': '',
      'media_type': 0,
      'file_size': '',
      'duration': ''
    },
    showHotelErr: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    openid = user_info.openid;
    hotel_id = user_info.hotel_id;
    box_mac = link_box_info.box_mac;

    wx.request({ //节目单播放列表
      url: api_url + '/Smallsale/goods/getPlayList',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
      },
      success: function(res) {
        if (res.data.code == 10000) {
          play_list = res.data.result.datalist;
          that.setData({
            play_list: res.data.result.datalist,
          })
        }
      }
    })
    wx.request({ //促销活动列表
      url: api_url + '/Smallsale/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        page: 1,
        type: 10
      },
      success: function(res) {
        if (res.data.code == 10000) {
          that.setData({
            sale_list: res.data.result.datalist,
          })
        }
      }
    })
    wx.request({ //我的活动
      url: api_url + '/Smallsale/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        type: 20,
        page: 1
      },
      success: function(res) {
        if (res.data.code == 10000) {
          if (res.data.result.datalist.length > 0) {
            var goods_status = res.data.result.datalist[0].status;
            if (goods_status == 2) {
              var box_btn = false
            } else {
              var box_btn = true
            }
            var room_type = res.data.result.datalist[0].scope;
            var check_status_arr = that.data.check_status_arr;
            var room_arr = that.data.room_arr;
            for (var i = 0; i < check_status_arr.length; i++) {
              if (check_status_arr[i].status == goods_status) {
                var check_status_img = check_status_arr[i].img;
                break;
              }
            }
            for (var j = 0; j < room_arr.length; j++) {
              if (room_type == room_arr[j].id) {
                var room_type_desc = room_arr[j].desc;
                break;
              }
            }
            my_activity_info = res.data.result.datalist[0]
            my_activity_info.room_type_desc = room_type_desc;
            my_activity_info.check_status_img = check_status_img;
            my_activity_info.vedio_url = app.globalData.oss_url + '/' + res.data.result.datalist[0].oss_addr;

            that.setData({
              is_my_activity: 1,
              my_activity_info: my_activity_info,
              box_btn: box_btn,
            })
          } else {
            my_activity_info = {};
            my_activity_info.media_type = 0;
            my_activity_info.room_type = 0
            that.setData({
              price: '',
              my_activity_info: my_activity_info,
              is_my_activity: 0,

            })
          }

        } else {
          my_activity_info = {};
          my_activity_info.media_type = 0;
          my_activity_info.room_type = 0
          that.setData({
            price: '',
            my_activity_info: my_activity_info,
            is_my_activity: 0,

          })
        }
      },
      fail: function(res) {
        my_activity_info = {};
        my_activity_info.media_type = 0;
        my_activity_info.room_type = 0
        that.setData({
          price: '',
          my_activity_info: my_activity_info,
          is_my_activity: 0,

        })
      }
    })
    //获取酒楼包间签到详情
    /*wx.request({
      url: api_url + '/Smallsale/user/getSigninBoxList',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid
      },
      success: function(res) {
        console.log(res);
      }
    })*/
  },
  delProgramPlay: function(e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.request({
      url: api_url + '/Smallsale/goods/removePlaygoods',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        goods_id: goods_id,
      },
      success: function(res) {
        if (res.data.code == 10000) {
          wx.showToast({
            title: '移除成功',
            icon: 'none',
            duration: 2000,
          })
          wx.request({
            url: api_url + '/Smallsale/goods/getPlayList',
            header: {
              'content-type': 'application/json'
            },
            data: {
              hotel_id: hotel_id,
            },
            success: function(res) {
              if (res.data.code == 10000) {
                play_list = res.data.result.datalist;
                that.setData({
                  play_list: res.data.result.datalist,
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '移除失败，请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '移除失败，请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  programPlay: function(e) { //节目单播放
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    box_mac = link_box_info.box_mac;
    wx.request({
      url: api_url + '/Smallsale/goods/programPlay',
      header: {
        'content-type': 'application/json'
      },
      data: {
        box_mac: box_mac,
        openid: openid,
        goods_id: goods_id
      },
      success: function(res) {
        wx.request({
          url: api_url + '/Smallsale/goods/getPlayList',
          header: {
            'content-type': 'application/json'
          },
          data: {
            hotel_id: hotel_id,
          },
          success: function(res) {
            if (res.data.code == 10000) {
              play_list = res.data.result.datalist;
              that.setData({
                play_list: res.data.result.datalist,
              })
            }
          }
        })
        if (res.data.code == 10000) {
          var tip_desc = '添加节目单播放成功';
        } else {
          var tip_desc = res.data.msg;
        }
        wx.showToast({
          title: tip_desc,
          icon: 'none',
          duration: 2000,
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '添加节目单失败，请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  boxShow: function(e) {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    box_mac = link_box_info.box_mac;
    var goods_id = e.currentTarget.dataset.goods_id;

    var imgs = e.currentTarget.dataset.oss_addr;

    var timestamp = (new Date()).valueOf();
    wx.request({
      url: api_url + '/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{"goods_id":' + goods_id + ',"action":40,"forscreen_id":' + timestamp + '}',
      },
      success: function(res) {
        if (res.data.code == 10000) {
          wx.request({
            url: api_url + '/Smallapp/index/recordForScreenPics',
            header: {
              'content-type': 'application/json'
            },
            data: {
              openid: openid,
              box_mac: box_mac,
              action: 40,
              mobile_brand: mobile_brand,
              mobile_model: mobile_model,
              forscreen_char: '',
              forscreen_id: timestamp,
              resource_id: timestamp,
              imgs: '["' + imgs + '"]'
            },
          });
          wx.showToast({
            title: '电视播放成功',
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '电视播放失败,请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '电视播放失败,请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  //切换选项卡  活动促销  我的活动
  selectXxk: function(res) {
    var that = this;
    var status = res.currentTarget.dataset.status;
    if (status == 1) {
      that.setData({
        showPageType: 1
      })
    } else {
      that.setData({
        showPageType: 2
      })
      wx.request({ //我的活动
        url: api_url + '/Smallsale/goods/myGoodslist',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid: openid,
          type: 20,
          page: 1
        },
        success: function(res) {

          if (res.data.code == 10000) {
            if (res.data.result.datalist.length > 0) {
              var goods_status = res.data.result.datalist[0].status;
              if (goods_status == 2) {
                var box_btn = false
              } else {
                var box_btn = true
              }
              var room_type = res.data.result.datalist[0].scope;
              var check_status_arr = that.data.check_status_arr;
              var room_arr = that.data.room_arr;
              for (var i = 0; i < check_status_arr.length; i++) {
                if (check_status_arr[i].status == goods_status) {
                  var check_status_img = check_status_arr[i].img;
                  break;
                }
              }
              for (var j = 0; j < room_arr.length; j++) {
                if (room_type == room_arr[j].id) {
                  var room_type_desc = room_arr[j].desc;
                  break;
                }
              }
              my_activity_info = res.data.result.datalist[0]
              my_activity_info.room_type_desc = room_type_desc;
              my_activity_info.check_status_img = check_status_img;
              my_activity_info.vedio_url = app.globalData.oss_url + '/' + res.data.result.datalist[0].oss_addr;

              that.setData({
                is_my_activity: 1,
                my_activity_info: my_activity_info,
                box_btn: box_btn,
              })
            } else {
              my_activity_info = {};
              my_activity_info.media_type = 0;
              my_activity_info.room_type = 0
              that.setData({
                price: '',
                is_my_activity: 0,
                my_activity_info: my_activity_info
              })
            }

          } else {
            my_activity_info = {};
            my_activity_info.media_type = 0;
            my_activity_info.room_type = 0
            that.setData({
              price: '',
              is_my_activity: 0,
              my_activity_info: my_activity_info
            })
          }
        },
        fail: function(res) {
          my_activity_info = {};
          my_activity_info.media_type = 0;
          my_activity_info.room_type = 0
          that.setData({
            price: '',
            is_my_activity: 0,
            my_activity_info: my_activity_info
          })
        }
      })
    }

  },
  //上传图片
  chooseImg: function(res) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var filename = res.tempFiles[0].path;
        var file_size = res.tempFiles[0].size;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var postf = filename.substring(index1, index2); //后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img = "forscreen/resource/" + timestamp + postf;
        var postf_w = filename.substring(index1 + 1, index2); //后缀名
        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function(rest) {
            signature = rest.data.signature;
            policy = rest.data.policy;
            accessid = rest.data.accessid;
            wx.uploadFile({
              url: oss_upload_url,
              filePath: filename,
              name: 'file',
              header: {
                'Content-Type': 'image/' + postf_w
              },
              formData: {
                Bucket: "redian-produce",
                name: filename,
                key: "forscreen/resource/" + timestamp + postf,
                policy: policy,
                OSSAccessKeyId: accessid,
                sucess_action_status: "200",
                signature: signature

              },

              success: function(res) {
                my_activity_info.goods_img = oss_img;
                my_activity_info.media_type = 2;
                my_activity_info.file_size = file_size;
                that.setData({
                  filename: filename,
                  my_activity_info: my_activity_info
                })
              },
              complete: function(es) {

              },
              fail: function({
                errMsg
              }) {

              },
            });

          }
        });
      },
    })
  },
  //上传视频
  chooseVideo: function() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        var filename = res.tempFilePath;
        var file_size = res.size;
        var duration = res.duration;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var postf = filename.substring(index1, index2); //后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img = "forscreen/resource/" + timestamp + postf;
        var postf_w = filename.substring(index1 + 1, index2); //后缀名
        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function(rest) {
            signature = rest.data.signature;
            policy = rest.data.policy;
            accessid = rest.data.accessid;
            wx.uploadFile({
              url: oss_upload_url,
              filePath: filename,
              name: 'file',
              header: {
                'Content-Type': 'image/' + postf_w
              },
              formData: {
                Bucket: "redian-produce",
                name: filename,
                key: "forscreen/resource/" + timestamp + postf,
                policy: policy,
                OSSAccessKeyId: accessid,
                sucess_action_status: "200",
                signature: signature

              },

              success: function(res) {
                my_activity_info.media_type = 1;
                my_activity_info.goods_img = oss_img;
                my_activity_info.file_size = file_size;
                my_activity_info.duration = duration;
                that.setData({
                  my_activity_info: my_activity_info,
                  filename: filename,
                })
              },
              complete: function(es) {

              },
              fail: function({
                errMsg
              }) {

              },
            });

          }
        });
      },
    })
  },
  //切换最大值
  setMaxPrice: function(res) {
    var that = this;
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
      //totalCount = parseFloat(totalCount).toFixed(2);
      if (totalCount > 9999) {
        return 9999;
      }
      if (totalCount <= 0) {
        return 1;
      }
    }
    /*if (totalNums != '') {
      if (totalNums < 0) {
        return 1;
      }
      if (totalNums > 9999) {
        return 9999;
      }
    }*/
  },
  //切换活动范围单选按钮
  changeRoomType: function(res) {
    var that = this;
    var room_arr = this.data.room_arr;
    var room_type = res.currentTarget.dataset.room_type;

    my_activity_info.room_type = room_type;
    that.setData({
      my_activity_info: my_activity_info
    })

    for (var i = 0; i < room_arr.length; i++) {
      if (room_arr[i].id == room_type) {
        room_arr[i].checked = true;

      } else {
        room_arr[i].checked = false;
      }
    }
  },
  bindDateChange: function(res) {
    var that = this;
    var date_type = res.currentTarget.dataset.date_type;
    if (date_type == 1) {
      my_activity_info.start_time = res.detail.value;

    } else if (date_type == 2) {
      my_activity_info.end_time = res.detail.value;
    }
    that.setData({
      my_activity_info: my_activity_info,
    })
  },
  pubAct: function(res) {
    var that = this;
    var goods_img = res.detail.value.goods_img;
    var start_time = res.detail.value.start_time;
    var end_time = res.detail.value.end_time;
    var goods_name = res.detail.value.goods_name;
    var price = res.detail.value.price;
    var room_type = res.detail.value.room_type;
    var room_arr = this.data.room_arr;
    var check_status_arr = this.data.check_status_arr;
    var goods_id = res.detail.value.goods_id;
    var file_size = res.detail.value.file_size;
    var duration = res.detail.value.duration;

    if (goods_id > 0) {
      var tost_success_desc = '活动编辑成功';
    } else {
      var tost_success_desc = '活动添加成功';
    }
    if (goods_img == '') {
      wx.showToast({
        title: '请上传图片/视频',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (goods_name == '') {
      that.setData({
        goods_name_focus: true
      })
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (price == '') {
      that.setData({
        price_focus: true
      })
      wx.showToast({
        title: '请输入价格',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (start_time == '') {
      wx.showToast({
        title: '请输入活动开始时间',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (end_time == '') {
      wx.showToast({
        title: '请输入活动结束时间',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var diff_date = tab(start_time, end_time);
    if (diff_date == 0) {
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    wx.showLoading({
      title: '活动商品处理中',
    })
    wx.request({
      url: api_url + '/Smallsale/goods/addActivityGoods',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        hotel_id: hotel_id,
        oss_addr: goods_img,
        goods_name: goods_name,
        price: price,
        start_time: start_time,
        end_time: end_time,
        scope: room_type,
        goods_id: goods_id,
        oss_filesize: file_size,
        duration: duration
      },
      success: function(res) {
        wx.hideLoading();
        var tost_err_desc = res.data.msg;
        if (res.data.code == 10000) {
          for (var i = 0; i < room_arr.length; i++) {
            if (room_arr[i].id == room_type) {
              var room_desc = room_arr[i].desc;
              break;
            }
          }
          //var check_status_arr = that.data.check_status_arr;

          //var check_status_img = check_status_arr[0].img
          var resource_type = res.data.result.media_type;
          var goods_status = res.data.result.status;
          for (var j = 0; j < check_status_arr.length; j++) {
            if (check_status_arr[j].status == goods_status) {
              var check_status_img = check_status_arr[j].img;
              break;
            }
          }
          if (goods_status == 2) {
            var box_btn = false;
          } else {
            var box_btn = true;
          }
          my_activity_info.goods_id = res.data.result.goods_id;
          my_activity_info.oss_addr = res.data.result.oss_addr;
          my_activity_info.file_size = file_size;
          my_activity_info.duration = duration;
          my_activity_info.goods_name = goods_name,
            my_activity_info.price = price;
          my_activity_info.start_time = start_time
          my_activity_info.resource_type = res.data.result.resource_type;
          my_activity_info.check_status_img = check_status_img;
          my_activity_info.room_type_desc = room_desc;
          if (resource_type == 1) {
            my_activity_info.vedio_url = app.globalData.oss_url + '/' + goods_img;
            my_activity_info.img_url = res.data.result.img_url;
          } else {
            my_activity_info.img_url = app.globalData.oss_url + '/' + goods_img;
          }


          that.setData({
            box_btn: box_btn,
            showPageType: 2,
            is_my_activity: 1,
            my_activity_info: my_activity_info
          })
          wx.showToast({
            title: tost_success_desc,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: tost_err_desc,
            icon: 'none',
            duration: 2000
          })
        }




      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: tost_err_desc,
          icon: 'none',
          duration: 2000
        })
      }
    })


    function tab(date1, date2) {
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if (oDate1.getTime() > oDate2.getTime()) {
        return 0
      } else {
        return 1
      }
    }
  },
  editGoods: function(e) {
    var that = this;
    wx.request({ //我的活动
      url: api_url + '/Smallsale/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        type: 20,
        page: 1
      },
      success: function(res) {
        if (res.data.code == 10000) {
          if (res.data.result.datalist.length > 0) {
            var goods_status = res.data.result.datalist[0].status;
            var room_type = res.data.result.datalist[0].scope;
            var check_status_arr = that.data.check_status_arr;
            var room_arr = that.data.room_arr;
            for (var i = 0; i < check_status_arr.length; i++) {
              if (check_status_arr[i].status == goods_status) {
                var check_status_img = check_status_arr[i].img;
                break;
              }
            }
            for (var j = 0; j < room_arr.length; j++) {
              if (room_type == room_arr[j].id) {
                var room_type_desc = room_arr[j].desc;
                room_arr[j].checked = true;

              } else {
                room_arr[j].checked = false;
              }
            }

            var resource_type = res.data.result.datalist[0].media_type;
            my_activity_info = res.data.result.datalist[0]
            my_activity_info.room_type_desc = room_type_desc;
            my_activity_info.check_status_img = check_status_img;
            my_activity_info.room_type = res.data.result.datalist[0].scope;
            var goods_name = res.data.result.datalist[0].goods_name;
            if (resource_type == 1) {
              var filename = app.globalData.oss_url + '/' + res.data.result.datalist[0].oss_addr;
              my_activity_info.vedio_url = app.globalData.oss_url + '/' + res.data.result.datalist[0].oss_addr;
            } else {
              var filename = res.data.result.datalist[0].img_url
            }
            var goods_img = res.data.result.datalist[0].oss_addr
            my_activity_info.goods_img = goods_img;
            var price = res.data.result.datalist[0].price;

            that.setData({
              room_arr: room_arr,
              is_my_activity: 0,
              price: price,
              filename: filename,
              goods_img: goods_img,
              my_activity_info: my_activity_info,
              goods_name: goods_name
            })
          } else {
            that.setData({
              is_my_activity: 0,

            })
          }

        }
      }
    })
  },
  clearGoodsImg: function(res) {
    var that = this;
    var resource_type = res.currentTarget.dataset.resource_type;
    my_activity_info.media_type = 0;
    my_activity_info.goods_img = '';
    that.setData({
      my_activity_info: my_activity_info
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    if(user_info.hotel_has_room==0){
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0,
          list: [
            
            {
              "pagePath": "/pages/tv_sale/system",
              "text": "活动促销",
              "iconPath": "/images/icon/999999_sale.png",
              "selectedIconPath": "/images/icon/333333_sale.png"
            },
            {
              "pagePath": "/pages/mine/index",
              "text": "个人信息",
              "iconPath": "/images/icon/999999_mine.png",
              "selectedIconPath": "/images/icon/333333_mine.png"
            }
          ]
        })
      }
    }else{
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1,

        })
      }
    }

    
    var link_user_info = wx.getStorageSync(cache_key + "link_box_info");

    if (typeof(link_user_info.box_mac) == 'undefined') {
      wx.showModal({
        title: '提示',
        content: '请您先连接包间电视',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })


    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
    //wx.showNavigationBarLoading();
    // 隐藏导航栏加载框
    //wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon: 'none',
      duration: 2000,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    hotel_id = user_info.hotel_id;
    var showPageType = this.data.showPageType;
    if (showPageType == 1) {
      wx.showLoading({
        title: '加载中，请稍后',
      })
      page = page + 1;
      wx.request({
        url: api_url + '/Smallsale/goods/myGoodslist',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid: openid,
          page: page,
          type: 10
        },
        success: function(res) {
          if (res.data.code == 10000) {
            wx.hideLoading()
            that.setData({
              sale_list: res.data.result.datalist,
            })

          } else {
            wx.hideLoading()
            wx.showToast({
              title: '加载失败，请重试',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: function(e) {
          wx.hideLoading()
          wx.showToast({
            title: '加载失败，请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      })

    }

  },
  /**
   * 推荐到好物圈
   */
  recwsad:function(e){
    var res_id = e.currentTarget.dataset.res_id;
    var res_title = e.currentTarget.dataset.res_title;
    var res_img_list = e.currentTarget.dataset.res_img_list;
    if (wx.openBusinessView){
      wx.openBusinessView({
        businessType: 'friendGoodsRecommend',
        extraData: {
          product: {
            item_code: res_id,
            title: res_title,
            image_list: res_img_list
          }
        },
        success: function (res) {
          wx.showToast({
            title: '推荐成功',
            icon: 'success',
            duration: 2000,
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '推荐失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }else {
      wx.showToast({
        title: '微信版本过低，不支持此功能',
        icon: 'none',
        duration: 2000,
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var res_id = res.target.dataset.res_id;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    var share_url = '/pages/mine/pop_detail?goods_id='+res_id;
    var img_url = e.target.dataset.img_url;
    if (res.from === 'button') {
      // 转发成功
      wx.request({
        url: api_url + '/Smallapp/share/recLogs',
        header: {
          'content-type': 'application/json'
        },
        data: {
          'openid': openid,
          'res_id': res_id,
          'type': 4,
          'status': 1,
        },
        success: function (e) {
          

        },
        fail: function (){
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
      // 来自页面内转发按钮
      return {
        title: '我发现了一个特别好的东西，来看看吧',
        path: share_url,
        imageUrl: img_url,
        success: function (res) {

        },
      }
    }
  },
  //商品码
  viewGoodsCode: function (e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;

    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var is_box = user_info.is_box;
    that.setData({
      is_box:is_box,
    })
    wx.request({
      url: api_url+'/aa/bb/cc',
      header: {
        'content-type': 'application/json'
      },
      data:{
        goods_id:goods_id,
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            goods_info:res.data.goods_info,
          })
        }
      },
    })


    
  },
  //包间切换 
  bindBoxPickerChange: function (e) {
    var that = this;
    var box_list = that.data.objectCityArray;
    var picBoxIndex = e.detail.value //切换之后城市key
    var boxIndex = that.data.boxIndex; //切换之前城市key

    if (picBoxIndex != boxIndex) {
      that.setData({
        box_index: picBoxIndex,
      })
    }
  },
  //显示包间列表弹窗
  viewRoomWin: function (e) {
    var that = this;
    that.setData({
      view_room: true,
    })
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var is_box = user_info.is_box;
    if (is_box) {

      var link_box_info = wx.getStorageSync(cache_key + 'link_box_info');
      var box_mac = link_box_info.box_mac;
      //包间列表
      wx.request({
        url: api_url + '/smallsale/room/getRoomList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          box_mac: box_mac,
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 10000) {
            that.setData({
              box_list: res.data.result.box_list,
              box_name_list: res.data.result.box_name_list,
              box_index: res.data.result.box_index,
            })
          }
        }
      })
    }
  },
  //大屏展示
  /*boxShow: function (e) {
    var that = this;
    wx.request({
      url: api_url + '/aa/bb/cc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        goods_id:goods_id,
      }, success: function (res) {
        if (res.data.code == 10000) {
          wx.showToast({
            title: '大屏即将展示，请稍后',
            icon: 'success',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '大屏展示失败',
            icon: 'success',
            duration: 2000,
          })
        }
        that.setData({
          view_room: false,
        })
      }, fail: function (res) {
        wx.showToast({
          title: '大屏展示失败',
          icon: 'success',
          duration: 2000,
        })
      }
    })
  },*/
  
})