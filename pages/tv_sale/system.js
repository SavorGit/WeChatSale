// pages/tv_sale/system.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
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
var sms_time_djs;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo: app.SystemInfo,
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
    showHotelErr: false,
    hotel: {
      id: null,
      name: "请选择酒楼"
    },
    hotel_activity_list: [],
    pro_play:false,
    activity_pop:true,
    hotel_activity:true,
    goods_manage : true,
    room_name:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    
    mta.Page.init()
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    var hotel_has_room = user_info.hotel_has_room;
    var pro_play = app.in_array('pro_play',user_info.service);
    var activity_pop = app.in_array('activity_pop',user_info.service);
    var hotel_activity = app.in_array('hotel_activity', user_info.service);
    var goods_manage = app.in_array('goods_manage', user_info.service);
    if(activity_pop==false && hotel_activity==true) {
      var showPageType = 3;
    } else if (activity_pop ==true){
      var showPageType = 1;
    }
    that.setData({
      hotel_has_room: hotel_has_room,
      user_info: user_info,
      pro_play: pro_play,
      activity_pop: activity_pop,
      hotel_activity: hotel_activity,
      goods_manage: goods_manage,
      showPageType: showPageType
    })

    openid = user_info.openid;
    if(user_info.hotel_id==-1){
      hotel_id = user_info.select_hotel_id;
      //获取酒楼包间列表
      wx.request({
        url: api_url + '/Smalldinnerapp11/Stb/getBoxList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            that.setData({
              objectBoxArray: res.data.result.box_name_list,
              box_list: res.data.result.box_list
            })
          }
        }
      })
    }else{
      hotel_id = user_info.hotel_id;
    }
    
    box_mac = link_box_info.box_mac;

    wx.request({ //节目单播放列表
      url: api_v_url + '/goods/getPlayList',
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
      url: api_v_url + '/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        page: 1,
        type: 10,
        box_mac: box_mac
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
      url: api_v_url + '/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        type: 20,
        page: 1,
        box_mac: box_mac,

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
            my_activity_info.qrcode_url = res.data.result.datalist[0].qrcode_url;

            var hotel_activity_list = res.data.result.datalist;
            that.setData({
              is_my_activity: 1,
              my_activity_info: my_activity_info,
              box_btn: box_btn,
              hotel_activity_list: hotel_activity_list
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
    
  },
  delProgramPlay: function(e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.request({
      url: api_v_url + '/goods/removePlaygoods',
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
            url: api_v_url + '/goods/getPlayList',
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
      },complete:function(res){
        //数据埋点-移除轮播内容
        mta.Event.stat('clickDelProgram', { 'openid': openid,'hotel_id':hotel_id,'goodsid':goods_id })
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
      url: api_v_url + '/goods/programPlay',
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
          url: api_v_url + '/goods/getPlayList',
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
      },complete:function(res){
        //数据埋点-点击电视轮播
        mta.Event.stat('clickAddProgramPlay', { 'openid': openid,'boxmac':box_mac,'goodsid':goods_id })
      }
    })
  },
  boxShow: function(e) {
    var that = this;
    if (typeof(e.currentTarget.dataset.box_index) != 'undefined') {
      var box_index = e.currentTarget.dataset.box_index;
      var box_list = that.data.box_list;
      box_mac = box_list[box_index].box_mac;

    } else {
      var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
      box_mac = link_box_info.box_mac;
    }
    var user_info = wx.getStorageSync(cache_key + "userinfo");


    var goods_id = e.currentTarget.dataset.goods_id;

    var imgs = e.currentTarget.dataset.oss_addr;
    var qrcode_url = e.currentTarget.dataset.qrcode_url;


    var timestamp = (new Date()).valueOf();
    wx.request({
      url: api_url + '/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{"goods_id":' + goods_id + ',"action":40,"forscreen_id":' + timestamp + ',"qrcode_url":"' + qrcode_url + '"}',
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
      },complete:function(res){
        //数据埋点-点击大屏展示
        mta.Event.stat('clickBoxShow', { 'openid': openid, 'boxmac': box_mac, 'goodsid': goods_id })
      }
    })
  },
  //切换选项卡  活动促销  我的活动
  selectXxk: function(res) {
    var that = this;
    var status = res.currentTarget.dataset.status;
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    if (status == 1) {
      that.setData({
        showPageType: 1
      })
    } else {
      that.setData({
        showPageType: 3
      })
      wx.request({ //我的活动
        url: api_v_url + '/goods/myGoodslist',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid: openid,
          type: 20,
          page: 1,
          box_mac: link_box_info.box_mac
        },
        success: function(res) {

          if (res.data.code == 10000) {
            if (res.data.result.datalist.length > 0) {
              if(res.data.result.is_my_activity==1){
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
                my_activity_info.qrcode_url = res.data.result.datalist[0].qrcode_url;
              }else {
                my_activity_info = {};
              }
              


              var hotel_activity_list = res.data.result.datalist;
              var is_my_activity = res.data.result.is_my_activity
              that.setData({
                is_my_activity: is_my_activity,
                my_activity_info: my_activity_info,
                hotel_activity_list: hotel_activity_list,
                box_btn: box_btn,
              })
            } else {
              my_activity_info = {};
              my_activity_info.media_type = 0;
              my_activity_info.room_type = 0
              that.setData({
                price: '',
                is_my_activity: 0,
                my_activity_info: my_activity_info,
                hotel_activity_list: []
              })
            }

          } else {
            
            my_activity_info = {};
            my_activity_info.media_type = 0;
            my_activity_info.room_type = 0
            that.setData({
              price: '',
              is_my_activity: 0,
              my_activity_info: my_activity_info,
              hotel_activity_list:[]
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
            my_activity_info: my_activity_info,
            hotel_activity_list: []
          })
        }
      })
      //数据埋点-点击餐厅活动
      mta.Event.stat('clickHotelActivity', { 'openid': openid,'boxmac':link_box_info.box_mac })
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
                  my_activity_info: my_activity_info,
                  //is_my_activity:0
                })
              },
              complete: function(es) {

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
                  //is_my_activity: 0
                })
              },
              complete: function(res) {

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
    if(room_type=='' ){
      room_type = 0
    }
    var room_arr = this.data.room_arr;
    var check_status_arr = this.data.check_status_arr;
    var goods_id = res.detail.value.goods_id;
    var file_size = res.detail.value.file_size;
    var duration = res.detail.value.duration;
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
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
      //数据埋点-添加商品报错
      mta.Event.stat('addMyActivityErr', { 'code': 1, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id  })
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
      //数据埋点-添加商品报错
      mta.Event.stat('addMyActivityErr', { 'code': 2, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id  })
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
      //数据埋点-添加商品报错
      mta.Event.stat('addMyActivityErr', { 'code': 3, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id  })
      return false;
    }
    if (start_time == '') {
      wx.showToast({
        title: '请输入活动开始时间',
        icon: 'none',
        duration: 2000
      });
      //数据埋点-添加商品报错
      mta.Event.stat('addMyActivityErr', { 'code': 4, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id })
      return false;
    }
    if (end_time == '') {
      wx.showToast({
        title: '请输入活动结束时间',
        icon: 'none',
        duration: 2000
      });
      //数据埋点-添加商品报错
      mta.Event.stat('addMyActivityErr', { 'code': 5, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id })
      return false;
    }
    var diff_date = tab(start_time, end_time);
    if (diff_date == 0) {
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none',
        duration: 2000
      });
      //数据埋点-添加商品报错
      mta.Event.stat('addMyActivityErr', { 'code': 6, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id  })
      return false;
    }
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    wx.showLoading({
      title: '活动商品处理中',
    })
    wx.request({
      url: api_v_url + '/goods/addActivityGoods',
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
          wx.request({
            url: api_v_url + '/goods/myGoodslist',
            header: {
              'content-type': 'application/json'
            },
            data: {
              hotel_id: hotel_id,
              openid: openid,
              type: 20,
              page: 1,
              box_mac: link_box_info.box_mac,

            },
            success: function(res) {
              if (res.data.code == 10000) {
                that.setData({
                  hotel_activity_list: res.data.result.datalist
                })
                
              }
            }
          })

          that.setData({
            box_btn: box_btn,
            showPageType: 3,
            is_my_activity: 1,
            my_activity_info: my_activity_info
          })
          wx.showToast({
            title: tost_success_desc,
            icon: 'none',
            duration: 2000
          })
          //数据埋点-活动添加成功
          mta.Event.stat('addActivitySucc', { 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id })
        } else {
          wx.showToast({
            title: tost_err_desc,
            icon: 'none',
            duration: 2000
          })
          //数据埋点-活动添加报错
          mta.Event.stat('addMyActivityErr', { 'code': 7, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id })
        }




      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: tost_err_desc,
          icon: 'none',
          duration: 2000
        })
        //数据埋点-活动添加报错
        mta.Event.stat('addMyActivityErr', { 'code': 8, 'openid': openid, 'hotelid': hotel_id, 'goods_id': goods_id })
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
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.request({ //我的活动
      url: api_v_url + '/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        type: 20,
        page: 1,
        is_edit: 1,
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
              goods_name: goods_name,
              showPageType: 2,
              is_my_activity: 0
            })
          } else {
            that.setData({
              is_my_activity: 0,

            })
          }

        }
      },complete:function(res){
        mta.Event.stat('clickEditMyActivity', { 'openid': openid, 'hotelid': hotel_id,'goodsid':goods_id })
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
    /*this.drowGoodsCode({
      picture: "https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg",
      name: "HYPERICE HYPERVOLT2019款 筋膜枪按摩肌肉放松器按摩器筋膜枪 浅灰色",
      price: "￥3420",
      qrCode: "https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg"
    });*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    if(user_info.hotel_id==-1){
      hotel_id= user_info.select_hotel_id
    }else {
      hotel_id = user_info.hotel_id
    }
    if (user_info.hotel_has_room == 0) {
      that.setData({
        showPageType:1,
        user_info: user_info,
      })
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
      wx.request({ //节目单播放列表
        url: api_v_url + '/goods/getPlayList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            play_list = res.data.result.datalist;
            that.setData({
              play_list: res.data.result.datalist,
            })
          }
        }
      })
      wx.request({ //促销活动列表
        url: api_v_url + '/goods/myGoodslist',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid: user_info.openid,
          page: 1,
          type: 10,
          //box_mac: link_user_info.box_mac,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            that.setData({
              sale_list: res.data.result.datalist,
            })
          }
        }
      })
    } else {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1,

        })
      }
      that.setData({
        
        user_info: user_info,
      })
      var link_user_info = wx.getStorageSync(cache_key + "link_box_info");
      if (link_user_info == '') {
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


      } else {
        //获取链接的盒子
        that.setData({
          box_mac: link_user_info.box_mac,
          room_name: link_user_info.box_name
        })
        //获取酒楼包间列表
        wx.request({
          url: api_url + '/Smalldinnerapp11/Stb/getBoxList',
          header: {
            'content-type': 'application/json'
          },
          data: {
            hotel_id: hotel_id,
          },
          success: function (res) {
            if (res.data.code == 10000) {
              that.setData({
                objectBoxArray: res.data.result.box_name_list,
                box_list: res.data.result.box_list
              })
            }
          }
        })
        wx.request({ //节目单播放列表
          url: api_v_url + '/goods/getPlayList',
          header: {
            'content-type': 'application/json'
          },
          data: {
            hotel_id: hotel_id,
          },
          success: function (res) {
            if (res.data.code == 10000) {
              play_list = res.data.result.datalist;
              that.setData({
                play_list: res.data.result.datalist,
              })
            }
          }
        })
        wx.request({ //促销活动列表
          url: api_v_url + '/goods/myGoodslist',
          header: {
            'content-type': 'application/json'
          },
          data: {
            hotel_id: hotel_id,
            openid: user_info.openid,
            page: 1,
            type: 10,
            box_mac: link_user_info.box_mac,
          },
          success: function(res) {
            if (res.data.code == 10000) {
              that.setData({
                sale_list: res.data.result.datalist,
              })
            }
          }
        })
        var user_info = wx.getStorageSync(cache_key+'userinfo');
        if(user_info.mobile==''){
          that.setData({
            showRegister: true,
            is_get_sms_code: 0
          })
        }
      }

    }
    wx.request({
      url: api_v_url + '/User/isRegister',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: user_info.openid,
      },
      success: function (res) {
        if (res.data.code == 10000 && res.data.result.userinfo.hotel_id != 0) {
          //var user_info = wx.getStorageSync(cache_key + 'userinfo');
          if (user_info.select_hotel_id > 0) {
            var hotel_id = user_info.select_hotel_id;
            var rts = res.data.result.userinfo;
            rts.select_hotel_id = user_info.select_hotel_id;
            
          } else {
            wx.setStorage({
              key: cache_key + 'userinfo',
              data: res.data.result.userinfo,
            })
            var goods_manage = app.in_array('goods_manage', user_info.service);
            var staff_manage = app.in_array('staff_manage', user_info.service);
            var integral_manage = app.in_array('integral_manage', user_info.service);
            var integral_shop = app.in_array('integral_shop', user_info.service);
            var task_manage = app.in_array('task_manage', user_info.service);
            that.setData({
              goods_manage: goods_manage,
              staff_manage: staff_manage,
              integral_manage: integral_manage,
              task_manage: task_manage,
              integral_shop: integral_shop
            })
          }
        } else {
          wx.reLaunch({
            url: '/pages/user/login',
          })
        }
      }
    })
    //数据埋点-进入活动促销页面
    if (this.data.showPageType==1){
      mta.Event.stat('showActivityPop', { 'openid': openid })
    } else if (this.data.showPageType == 3){
      mta.Event.stat("showhotelactivity", { 'openid': openid })
    }
    
    
    //this.onLoad()
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
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    openid = user_info.openid;
    if(user_info.hotel_id==-1){
      hotel_id = user_info.select_hotel_id;
      
    }else{
      hotel_id = user_info.hotel_id;
    }
    
    var showPageType = this.data.showPageType;
    if (showPageType == 1) {
      wx.showLoading({
        title: '加载中，请稍后',
      })
      page = page + 1;
      wx.request({
        url: api_v_url + '/goods/myGoodslist',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid: openid,
          page: page,
          type: 10,
          box_mac: link_box_info.box_mac
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
  recwsad: function(e) {

    var goods_info = e.currentTarget.dataset.goods_info;

    var res_id = goods_info.goods_id;
    var res_title = goods_info.goods_name;
    var res_img_list = [];
    res_img_list[0] = goods_info.img_url
    if (wx.openBusinessView) {
      wx.openBusinessView({
        businessType: 'friendGoodsRecommend',
        extraData: {
          product: {
            item_code: res_id,
            title: res_title,
            image_list: res_img_list
          }
        },
        success: function(res) {
          /*console.log(res)
          wx.showToast({
            title: '推荐成功',
            icon: 'success',
            duration: 2000,
          })*/
        },
        fail: function(res) {
          wx.showToast({
            title: '推荐失败',
            icon: 'none',
            duration: 2000,
          })
        },complete:function(res){
          //数据埋点-点击添加到好物圈
          mta.Event.stat('clickRecWsad', { 'openid': openid, 'goodsid': res_id})
        }
      })
    } else {
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
  onShareAppMessage: function(e) {
    var that = this;
    var goods_info = e.target.dataset.goods_info;
    var goods_id = goods_info.goods_id;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    var share_url = '/pages/mine/pop_detail?goods_id=' + goods_id;
    var img_url = goods_info.img_url;
    if (e.from === 'button') {
      // 转发成功
      wx.request({
        url: api_url + '/Smallapp/share/recLogs',
        header: {
          'content-type': 'application/json'
        },
        data: {
          'openid': openid,
          'res_id': goods_id,
          'type': 4,
          'status': 1,
        },
        success: function(e) {


        },
        fail: function() {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        },complete:function(res){
          //数据埋点-促销活动分享微信好友
          mta.Event.stat('clickSharePopGoods', { 'openid': openid, 'goodsid': goods_id })
        }
      })
      // 来自页面内转发按钮
      return {
        title: '我发现了一个特别好的东西，来看看吧',
        path: share_url,
        imageUrl: img_url,
        success: function(res) {

        },
      }
      
    }
  },
  //商品码
  viewGoodsCode: function(e) {
    var that = this;
    var goods_info = e.currentTarget.dataset.goods_info;

    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var hotel_has_room = user_info.hotel_has_room;

    that.setData({
      hotel_has_room: hotel_has_room,
      showBottomPopGoodsCodeWindow: true
    })

    const context = wx.createCanvasContext('goodsCode');
    context.setFillStyle('#FFFFFF');
    context.fillRect(0, 0, 230, 380);
    context.draw();

    this.drowGoodsCode({
      picture: goods_info.img_url,
      name: goods_info.goods_name,
      price: "￥" + goods_info.price,
      qrCode: goods_info.qrcode_url
    });
    //数据埋点-点击生成商品码
    mta.Event.stat('clickCreateGoodsCode', { 'openid': user_info.openid,'goodsid':goods_info.goods_id })

  },
  closeViewGoodsCode: function(e) {
    var that = this;
    that.setData({
      showBottomPopGoodsCodeWindow: false
    })
  },
  //包间切换 
  bindBoxPickerChange: function(e) {
    var that = this;
    //var box_list = that.data.objectCityArray;
    var picBoxIndex = e.detail.value //切换之后城市key
    var boxIndex = that.data.boxIndex; //切换之前城市key

    if (picBoxIndex != boxIndex) {
      that.setData({
        box_index: picBoxIndex,
      })
    }
  },
  closeViewRoom: function(e) {
    var that = this;
    that.setData({
      showMiddlePopChoseBoxWindow: false,
    })
  },
  //显示包间列表弹窗
  viewRoomWin: function(e) {
    var that = this;
    that.setData({
      showMiddlePopChoseBoxWindow: true,
    })
    var user_info = wx.getStorageSync(cache_key + 'userinfo');


    var link_box_info = wx.getStorageSync(cache_key + 'link_box_info');
    var box_mac = link_box_info.box_mac;
    //包间列表
    wx.request({
      url: api_v_url + '/room/getRoomList',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        box_mac: box_mac,
      },
      success: function(res) {
        if (res.data.code == 10000) {
          that.setData({
            box_list: res.data.result.box_list,
            box_name_list: res.data.result.box_name_list,
            box_index: res.data.result.box_index,
          })
        }
      }
    })

  },
  pop_share: function(e) {
    var that = this;
    var goods_info = e.currentTarget.dataset.goods_info;
    that.setData({
      showShareBottomPopWindow: true,
      goods_info: goods_info,
      share_goods_info:goods_info,
    })
    //数据埋点-点击活动商品分享
    mta.Event.stat('clickPopShare', { 'openid': openid,'goodsid':goods_info.goods_id })
  },
  close_share: function(e) {
    var that = this;
    that.setData({
      showShareBottomPopWindow: false
    })
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

  /**
   * 绘制多行文本，由于文字比较多，这里我们写了一个函数处理
   * @param context      画布上下文
   * @param str          字符串
   * @param fontSize     文字大小
   * @param leftWidth    左边距
   * @param initHeight   上边距
   * @param canvasWidth  文本最大宽度
   * @return y 上边距 
   */
  drawMultilineText: function(context, str, fontSize, leftWidth, initHeight, canvasWidth) {
    let lineWordCount = parseInt(canvasWidth / fontSize);
    context.setFontSize(fontSize);
    if (lineWordCount >= str.length) {
      context.fillText(str, leftWidth + 115 - context.measureText(str).width / 2, initHeight);
      return initHeight;
    }
    let lineString = str.substring(0, lineWordCount);
    if (canvasWidth - context.measureText(lineString).width <= fontSize) {
      context.fillText(lineString, leftWidth + 115 - context.measureText(lineString).width / 2, initHeight);
      initHeight += fontSize;
      return this.drawMultilineText(context, str.substring(lineWordCount), fontSize, leftWidth, initHeight, canvasWidth);
    }
    for (let index = lineWordCount; index < str.length; index++) {
      lineString = str.substring(0, index);
      if (canvasWidth - context.measureText(lineString).width <= fontSize) {
        context.fillText(lineString, leftWidth + 115 - context.measureText(lineString).width / 2, initHeight);
        initHeight += fontSize + 2;
        break;
      }
    }
    return this.drawMultilineText(context, str.substring(lineString.length), fontSize, leftWidth, initHeight, canvasWidth);
  },
  drowGoodsCode: function(bean) {
    var that = this;
    var qrcode_tmp;
    var goods_img_tmp;
    wx.getImageInfo({
      src: bean.qrCode,
      success: function(res) {
        qrcode_tmp = res.path
        wx.getImageInfo({
          src: bean.picture,
          success: function(rt) {
            goods_img_tmp = rt.path;
            let goodsPicture = goods_img_tmp; // "https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg";
            let goodsName = bean.name; //"HYPERICE HYPERVOLT2019款 筋膜枪按摩肌肉放松器按摩器筋膜枪 浅灰色";
            let goodsPrice = bean.price; //"￥3420";
            let qrCode = qrcode_tmp; //"https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg";
            let qrCodeTip = "扫码或长按识别，即可前往购买";
            let adMsg = "更多优质商品，尽在 [热点投屏] 小程序";

            let fullWidth = 230;
            let fullHeight = 380;
            let x = 0;
            let y = 0;
            const context = wx.createCanvasContext('goodsCode');
            context.setFillStyle('#FFFFFF')
            context.fillRect(0, 0, fullWidth, fullHeight)

            let goodsPictureHeight = 168;
            context.drawImage(goodsPicture, x, y, fullWidth, goodsPictureHeight);

            // context.setFontSize(10);
            // context.setFillStyle("#666666");
            // x = 10;
            // y = goodsPictureHeight + 10;
            // context.fillText(goodsName, x, y, fullWidth - 20);
            context.setFillStyle("#666666");
            x = 0;
            y = goodsPictureHeight + 17;
            y = that.drawMultilineText(context, goodsName, 10, x, y, 220);

            context.setFontSize(14);
            context.setFillStyle("#E75A5A");
            let goodsPriceMetrics = context.measureText(goodsPrice);
            x = fullWidth / 2 - goodsPriceMetrics.width / 2;
            y += 19;
            context.fillText(goodsPrice, x, y);

            let qrCodeWidth = 100;
            let qrCodeHeight = 100;
            x = fullWidth / 2 - qrCodeWidth / 2;
            y += 10;
            context.drawImage(qrCode, x, y, qrCodeWidth, qrCodeHeight);

            context.setFontSize(10);
            context.setFillStyle("#E75A5A");
            let qrCodeTipMetrics = context.measureText(qrCodeTip);
            x = fullWidth / 2 - qrCodeTipMetrics.width / 2;
            y += 22 + qrCodeHeight;
            context.fillText(qrCodeTip, x, y);

            let grd = context.createLinearGradient(0, 0, fullWidth, 0);
            grd.addColorStop(0, '#F19154');
            grd.addColorStop(1, '#F15D61');
            context.setFillStyle(grd)
            x = 0;
            y = fullHeight - 20;
            context.fillRect(x, y, fullWidth, 20);

            context.setFontSize(10);
            context.setFillStyle("#FFFFFF");
            let adMsgMetrics = context.measureText(adMsg);
            x = fullWidth / 2 - adMsgMetrics.width / 2;
            y = fullHeight - 7;
            context.fillText(adMsg, x, y);

            context.draw(false, that.getTempFilePath);
          }
        })
      }
    })

  },
  //获取临时路径
  getTempFilePath: function() {
    wx.canvasToTempFilePath({
      canvasId: 'goodsCode',
      success: (res) => {
        this.setData({
          shareTempFilePath: res.tempFilePath
        });
      }
    });
  },
  //保存至相册
  saveImageToPhotosAlbum: function(e) {
    var share_goods_info = e.currentTarget.dataset.share_goods_info;
    if (!this.data.shareTempFilePath) {
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel: false
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareTempFilePath,
      success: (res) => {
        wx.showModal({
          title: '提示',
          content: '图片保存成功',
          showCancel: false
        })
      },
      fail: (err) => {
        wx.showModal({
          title: '提示',
          content: '图片保存失败',
          showCancel: false
        })
      },complete:function(res){
        //数据埋点-点击保存到相册
        mta.Event.stat("clicksaveimgtoalbum", { 'openid': openid, 'goodsid': share_goods_info.goods_id})
      }
    })
  },
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.sale_list)
    this.setData({
      sale_list: data
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    let data = app.touch._touchmove(e, this.data.sale_list)
    this.setData({
      sale_list: data
    })
  },

  //删除事件
  del: function(e) {
    var that = this;
    var sale_list = this.data.sale_list;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var openid = user_info.openid;
    var goods_id = e.currentTarget.dataset.goods_id;

    if(user_info.hotel_id==-1){
      var hotel_id = user_info.select_hotel_id;
    }else {
      var hotel_id = user_info.hotel_id;
    }
    
    wx.showModal({
      title: '提示',
      content: '确认要删除此条信息么？',
      success: function(res) {
        if (res.confirm) {


          wx.request({
            url: api_v_url + '/goods/addSalegoods',
            header: {
              'content-type': 'application/json'
            },
            data: {
              goods_id: goods_id,
              hotel_id: hotel_id,
              openid: openid
            },
            success: function(res) {
              if (res.data.code == 10000) {
                sale_list.splice(e.currentTarget.dataset.index, 1)
                that.setData({
                  sale_list: sale_list
                })
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addMyActivity: function(e) {
    var that = this;
    var my_activity_info = {};
    my_activity_info.media_type= 0;
    my_activity_info.room_type = 0;
    //var is_my_activity = e.currentTarget.dataset.is_my_activity; 
    that.setData({
      showPageType: 2,
      is_my_activity: 0,
      my_activity_info: my_activity_info,
      price:''

    })
    //数据埋点-点击添加我的活动
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var link_box_info = wx.getStorageSync(cache_key +'link_box_info');
    mta.Event.stat('clickAddMyActivity', { 'openid': user_info.openid, 'boxmac': link_box_info.box_mac })

  },
  
  showMailListPage: function(e) {
    let that = this;
    wx.request({
      url: api_v_url + '/hotel/getHotelList',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.code == 10000) {
          that.setData({
            mailListPageShow: true,
            //mailListData: that.convertDataFormat(res.data.result)
            mailListData: res.data.result
          });
        }
      }
    });

  },
  
  reChooseHotel:function(e){
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    user_info.select_hotel_id = 0;
    wx.setStorageSync(cache_key + 'userinfo', user_info);
    wx.reLaunch({
      url: '/pages/index/index',
    })
    //数据埋点-活动促销页面重选酒楼
    mta.Event.stat('popActivityRechooseHotel', { 'openid': user_info.openid })
  },
  addPopGoods:function(e){
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var openid    = user_info.openid;
    //数据埋点-点击添加促销活动按钮
    mta.Event.stat('clickAddPopList', { 'openid': openid })
  },
  bindMobile:function(e){
    //console.log(e)
    var that = this;
    var mobile = e.detail.value.mobile;
    var verify_code = e.detail.value.verify_code;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var is_mobile = app.checkMobile(mobile);
    if (!is_mobile) {
      return;
    }
    if (verify_code == '') {

      wx.showToast({
        title: '请输入手机验证码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.request({
      url: api_v_url + '/user/bindmobile',
      header: {
        'content-type': 'application/json'
      },
      data:{
        mobile:mobile,
        verify_code: verify_code,
        openid: user_info.openid,
      },success:function(res){
        if(res.data.code==10000){
          user_info.mobile = mobile;
          wx.setStorageSync(cache_key+'userinfo', user_info);
          that.setData({
            showRegister:false
          })
          wx.showToast({
            title: '手机号绑定成功',
            icon:'none',
            duration:2000
          })
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },complete:function(res){
        //数据埋点-活动促销页面绑定手机号
        mta.Event.stat('popActivityBindMobile', { 'openid': user_info.openid,'mobile':mobile })
      }
    })
  },
  //输入手机号失去焦点
  mobileOnInput: function (res) {
    var that = this;
    var mobile = res.detail.value;
    that.setData({
      mobile: mobile
    })
  },
  sendSmsCode:function(e){
    var that = this;
    var mobile = e.target.dataset.mobile;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    //var invite_code = e.target.dataset.invite_code;
    if (mobile == '') {

      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var is_mobile = app.checkMobile(mobile);
    if (!is_mobile) {
      return;
    }
    wx.request({
      url: api_v_url + '/sms/sendbindmobileverifyCode',
      header: {
        'content-type': 'application/json'
      },
      data: {
        mobile: mobile,
        openid: openid,
      },
      success: function (res) {
        if (res.data.code == 10000) { //上线前更换
          sms_time_djs = 60
          that.setData({
            is_get_sms_code: 1,
            sms_time_djs: sms_time_djs
          })
          var timer8_0 = setInterval(function () {
            
            sms_time_djs -= 1;
            that.setData({
              sms_time_djs: sms_time_djs
            });
            if (sms_time_djs == 0) {
              that.setData({
                is_get_sms_code: 0,
              })
              clearInterval(timer8_0);
            }
          }, 1000);
          
        } else {
          var error_msg = res.data.msg;
          wx.showToast({
            title: error_msg,
            icon: 'none',
            duration: 2000
          });
        }
      }, complete: function (res) {
        //数据埋点-促销活动页面发送手机验证码
        mta.Event.stat('popActivitySendVerifyCode', { 'openid': openid,'mobile':mobile})
      }
    })
  },
  chooseHotel: function (e) {
    let that = this;
    that.setData({
      hotel: e.detail,
      room_name: '',
    });
    var hotel_id = e.detail.id;
    var hotel_name = e.detail.name;
    var hotel_has_room = e.detail.hotel_has_room;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    user_info.select_hotel_id = hotel_id;
    user_info.select_hotel_name = hotel_name;
    user_info.is_common = 1;
    user_info.hotel_has_room = hotel_has_room;
    //wx.setStorageSync(cache_key + "userinfo", user_info);
    that.setData({
      user_info: user_info
    })
    wx.setStorageSync(cache_key + "userinfo", user_info);
    wx.removeStorageSync(cache_key + 'link_box_info');
    
      //获取酒楼包间列表
      wx.request({
        url: api_url + '/Smalldinnerapp11/Stb/getBoxList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            that.setData({
              objectBoxArray: res.data.result.box_name_list,
              box_list: res.data.result.box_list
            })
          }
        }
      })


    wx.request({ //节目单播放列表
      url: api_v_url + '/goods/getPlayList',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          play_list = res.data.result.datalist;
          that.setData({
            play_list: res.data.result.datalist,
          })
        }
      }
    })
    wx.request({ //促销活动列表
      url: api_v_url + '/goods/myGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: user_info.openid,
        page: 1,
        type: 10,
        //box_mac: link_user_info.box_mac,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            sale_list: res.data.result.datalist,
          })
        }
      }
    })  
    
  },
  //选择包间开始
  bindPickerChange: function (e) {
    var keys = e.detail.value;
    var box_list = this.data.box_list;
    var link_box_info = {
      'box_mac': '',
      'box_name': ''
    };
    if (keys > 0) {
      box_mac = box_list[keys].box_mac;
      link_box_info.box_mac = box_mac;
      link_box_info.box_name = box_list[keys].name;
      wx.setStorageSync(cache_key + "link_box_info", link_box_info);
      this.setData({
        is_link: 1,
        room_name: box_list[keys].name,
        box_mac: box_mac
      })
    }
    //数据埋点-点击选择包间
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    mta.Event.stat('changeRoom', { 'openid': user_info.openid })
  }, //选择包间结束
})