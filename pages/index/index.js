//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
var mta = require('../../utils/mta_analysis.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var box_mac;
var is_view_wifi = 0;
var wifi_password;
var intranet_ip;
var wifi_name;
var wifi_mac;
var use_wifi_password;
var forscreen_type;
var common_appid = app.globalData.common_appid;
var sign_box_list; //签到包间
Page({
  data: {
    SystemInfo: app.SystemInfo,
    objectBoxArray: [],
    box_list: [],
    index: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    is_link: 0, //是否连接酒楼
    is_link_wifi: 0, //是否连接wifi
    is_view_link: 0,
    hotel_name: '',
    room_name: '',
    box_mac: '',
    wifi_mac: '',
    wifi_name: '',
    wifi_password: '',
    hiddens: true,
    hotel: {
      id: null,
      name: "请选择酒楼"
    },

    showRetryModal: true, //连接WIFI重试弹窗
    bdShowModal: true, //邀请码酒楼和绑定酒楼不一致
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showHotelErr: false,
    sign_box_list: [], //签到包间
    tv_forscreen:true,
    signin:true,
    showControlWindow:false,
  },

  onLoad: function(res) {
    var that = this;
    mta.Page.init()
    if (app.globalData.openid && app.globalData.openid != '') {
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      //注册用户
      is_login(openid);
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          //注册用户
          is_login(openid);
        }
      }
    }

    function is_login(openid) {

      wx.request({
        url: api_v_url + '/User/isRegister',
        header: {
          'content-type': 'application/json'
        },
        data: {
          openid: openid,
        },
        success: function(res) {
          if (res.data.code == 10000 && res.data.result.userinfo.hotel_id != 0) {
            var user_info = wx.getStorageSync(cache_key+'userinfo');
            if(user_info.select_hotel_id>0){
              var hotel_id = user_info.select_hotel_id;
              var rts = res.data.result.userinfo;
              rts.select_hotel_id = user_info.select_hotel_id;
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: rts,
              })
            }else{
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: res.data.result.userinfo,
              })
              var user_info = res.data.result.userinfo;
              var hotel_id = user_info.hotel_id;
            }
            //判断权限
            var tv_forscreen = app.in_array('tv_forscreen',user_info.service);
            var room_signin = app.in_array('room_signin', user_info.service);
            
            that.setData({
              user_info:user_info,
              tv_forscreen: tv_forscreen,
              room_signin: room_signin
            })
            var link_box_info = wx.getStorageSync(cache_key + 'link_box_info');
            if (link_box_info != '') { //已链接盒子
              var box_name = link_box_info.box_name;
              that.setData({
                openid: openid,
                box_mac: link_box_info.box_mac,
                is_link: 1,
                room_name: box_name
              })
            } else { //未链接盒子

            }
            if (user_info.hotel_has_room == 1) {
              
              //获取酒楼包间列表
              wx.request({
                url: api_url + '/Smalldinnerapp11/Stb/getBoxList',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  hotel_id: hotel_id,
                },
                success: function(res) {
                  if (res.data.code == 10000) {
                    that.setData({
                      objectBoxArray: res.data.result.box_name_list,
                      box_list: res.data.result.box_list
                    })
                  }
                }
              })
              //获取当前酒楼包间签到信息
              wx.request({
                url: api_v_url + '/user/getSigninBoxList',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  hotel_id: hotel_id,
                  openid: openid,
                },
                success: function(res) {
                  if (res.data.code == 10000) {
                    sign_box_list = res.data.result;
                    that.setData({
                      sign_box_list: sign_box_list
                    })
                  }
                }
              })
            } else {
              wx.reLaunch({
                url: '/pages/tv_sale/system',
              })
            }
          } else { //未授权登陆 跳转到登陆页面
            wx.reLaunch({
              url: '/pages/user/login',
            })
          }
        }
      })
    }
    

  },
  //选择包间开始
  bindPickerChange: function(e) {
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
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    mta.Event.stat('changeRoom', { 'openid': user_info.openid })
  }, //选择包间结束


  chooseImage: function(res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    if (user_info.is_wx_auth != 3) {
      that.setData({
        showWXAuthLogin: true,

      })
    } else {
      var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
      var mobile = user_info.mobile;
      var box_mac = link_box_info.box_mac;
      if (box_mac == '' || box_mac == undefined) {

        wx.showToast({
          title: '请选择包间电视',
          icon: 'none',
          duration: 2000
        });
      } else {
        wx.request({
          url: api_v_url + '/user/checkuser',
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          data: {
            mobile: mobile,
            openid: user_info.openid
          },
          success: function(res) {
            if (res.data.code == 10000) {
              wx.navigateTo({
                url: '/pages/launch/picture/index',
              })
            } else {
              wx.showToast({
                title: '邀请码已失效',
                icon: 'none',
                duration: 2000
              });
              wx.removeStorageSync(cache_key + "userinfo");
              wx.navigateTo({
                url: '/pages/user/login',
              })
            }
          },complete:function(res){
            //数据埋点-点击图片上电视
            mta.Event.stat('clickForImg', { 'openid': user_info.openid })
          }
        })
      }
    }
  },
  chooseVideo: function(res) {
    var that = this
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    if (user_info.is_wx_auth != 3) {
      that.setData({
        showWXAuthLogin: true
      })
    } else {
      var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
      var mobile = user_info.mobile;
      var box_mac = link_box_info.box_mac;
      if (box_mac == '' || box_mac == undefined) {
        wx.showToast({
          title: '请选择包间电视',
          icon: 'none',
          duration: 2000
        });
      } else {
        wx.request({
          url: api_v_url + '/user/checkuser',
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          data: {
            mobile: mobile,
            openid: user_info.openid,
          },
          success: function(res) {
            if (res.data.code == 10000) {
              wx.navigateTo({
                url: '/pages/launch/video/index',
              })
            } else {
              wx.showToast({
                title: '邀请码已失效',
                icon: 'none',
                duration: 2000
              });
              wx.removeStorageSync(cache_key + "userinfo");
              wx.navigateTo({
                url: '/pages/user/login',
              })
            }
          },complete:function(res){
            //数据埋点-点击视频上电视
            mta.Event.stat('clickForVideo', { 'openid': user_info.openid })
          }
        })
      }
    }

  },
  exitForscreen(e) {
    var that = this;
    var openid = e.currentTarget.dataset.openid;
    var box_mac = e.currentTarget.dataset.box_mac;
    if (box_mac == '' || typeof(box_mac) == 'undefined') {
      wx.showToast({
        title: '请您先链接包间电视',
        icon: 'none',

        duration: 2000,

      })
    } else {
      var timestamp = (new Date()).valueOf();

      utils.PostRequest(api_url + '/Netty/Index/index', {
        box_mac: box_mac,
        msg: '{ "action": 3,"openid":"' + openid + '"}',
      }, (data, headers, cookies, errMsg, statusCode) => {
        app.showToast('退出成功');
        //数据埋点-首页点击退出投屏
        mta.Event.stat('indexExitForscreen', { 'openid': openid, 'boxmac': box_mac })
      },res=>{
        mta.Event.stat('indexExitForscreen', { 'openid': openid, 'boxmac': box_mac })
      })
      
    }

  }, //退出投屏结束
  changeVolume: function(e) { //更改音量
    var box_mac = e.target.dataset.box_mac;
    var change_type = e.target.dataset.change_type;
    var timestamp = (new Date()).valueOf();
    if (box_mac == '' || typeof(box_mac) == 'undefined') {
      wx.showToast({
        title: '请您先链接包间电视',
        icon: 'none',

        duration: 2000,

      })
    } else {
      utils.PostRequest(api_url + '/Netty/Index/index', {
        box_mac: box_mac,
        msg: '{"action":31,"change_type":' + change_type + '}'
      }, (data, headers, cookies, errMsg, statusCode) => {
        
        app.showToast('操作成功');
        var user_info = wx.getStorageSync(cache_key + 'userinfo');
        var openid = user_info.openid;
        //数据埋点-点击音量增减
        if (change_type == 2) {
          mta.Event.stat('indexVoicePlus', { 'boxmac': box_mac, 'openid': openid })
        } else if (change_type == 1) {
          mta.Event.stat('indexVoiceDecrease', { 'boxmac': box_mac, 'openid': openid })
        }
      },res=>{
        var user_info = wx.getStorageSync(cache_key + 'userinfo');
        var openid = user_info.openid;
        //数据埋点-点击音量增减
        if (change_type == 2) {
          mta.Event.stat('indexVoicePlus', { 'boxmac': box_mac, 'openid': openid })
        } else if (change_type == 1) {
          mta.Event.stat('indexVoiceDecrease', { 'boxmac': box_mac, 'openid': openid })
        }
      });
    }
  },
  /*gotodownload: function(res) {
    var that = this;
    that.setData({
      download_disable: true,
    })
    wx.navigateTo({
      url: '/pages/download/index',
      success: function() {
        that.setData({
          download_disable: false,
        })
      },complete:function(res){
        //数据埋点-点击下载图片模板
        var user_info = wx.getStorageSync(cache_key+'userinfo');
        mta.Event.stat('clickDownImg', { 'openid': user_info.openid })
      }
    })
  },*/
  gotoForFile:function(e){
    wx.showToast({
      title: '敬请期待',
      icon:'none',
      duration:2000,
    })
  },

  signIn: function(e) {
    var that = this;
    var box_mac = e.currentTarget.dataset.box_mac;
    var keys = e.currentTarget.dataset.keys;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    //sign_box_list
    wx.request({
      url: api_v_url + '/user/signin',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        box_mac: box_mac,
        openid: openid,
      },
      success: function(res) {
        if (res.data.code == 10000) {
          if (res.data.result.status == 2) {
            for (var i = 0; i < sign_box_list.length; i++) {
              if (keys == i) {
                sign_box_list[i].status = 2;
                sign_box_list[i].user = {
                  "avatarUrl": user_info.avatarUrl,
                  "nickName": user_info.nickName,
                  "openid": user_info.openid,
                  "user_id": user_info.user_id
                };
              }
            }
            that.setData({
              sign_box_list: sign_box_list,
            })
            wx.showToast({
              title: '签到成功',
              icon: 'none',
              duration: 2000
            })
            //数据埋点-点击包间签到
            mta.Event.stat('indexRoomSign', { 'boxmac': box_mac,'openid':openid })
          } else {
            for (var i = 0; i < sign_box_list.length; i++) {
              if (keys == i) {
                sign_box_list[i].status = 2;
                sign_box_list[i].user = {
                  "avatarUrl": res.data.result.user.avatarUrl,
                  "nickName": res.data.result.user.nickName,
                  "openid": user_info.openid,
                  "user_id": user_info.user_id
                };
              }
            }
            var err_desc = '该包间已由' + res.data.result.user.nickName + '签到';
            that.setData({
              sign_box_list: sign_box_list,
            })
            wx.showToast({
              title: err_desc,
              icon: 'none',
              duration: 2000
            })
          }


        } else {
          wx.showToast({
            title: '签到失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },
  repeatSign: function(e) {
    var nickname = e.currentTarget.dataset.nickname;
    wx.showToast({
      title: '该电视已由' + nickname + '签到',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,

      })
    }
    //数据埋点-进入电视互动页
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    mta.Event.stat('showIndex', { 'openid': user_info.openid })
  },
  closeAuth: function() {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    //数据埋点-首页关闭取消授权弹窗
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    mta.Event.stat('indexCloseAuth', { 'openid': user_info.openid })
  },
  //微信用户授权登陆
  onGetUserInfo: function(res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    if (res.detail.errMsg == 'getUserInfo:ok') {

      wx.getUserInfo({
        success(rets) {
          console.log(rets);
          wx.request({
            url: api_v_url + '/User/registerCom',
            data: {
              'openid': openid,
              'avatarUrl': rets.userInfo.avatarUrl,
              'nickName': rets.userInfo.nickName,
              'gender': rets.userInfo.gender,
              'session_key': app.globalData.session_key,
              'iv': rets.iv,
              'encryptedData': rets.encryptedData
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              if (res.data.code == 10000) {
                that.setData({
                  showWXAuthLogin: false,

                })
                var mobile = res.data.result.mobile;
                if (mobile != '') {
                  //res.data.result.is_login = 1;

                  wx.setStorage({
                    key: cache_key + 'userinfo',
                    data: res.data.result,
                  });
                  /*wx.reLaunch({
                    url: '/pages/index/index',
                  })*/
                } else {
                  wx.setStorage({
                    key: cache_key + 'userinfo',
                    data: res.data.result,
                  });
                }



              } else {
                wx.showToast({
                  title: '微信授权登陆失败，请重试',
                  icon: 'none',
                  duration: 2000
                });
                /*wx.reLaunch({
                  url: '/pages/index/index',
                })*/
              }

            },
            fail: function(res) {
              wx.showToast({
                title: '微信登陆失败，请重试',
                icon: 'none',
                duration: 2000
              });
            }
          })
        }
      })
      //数据埋点-用户确认授权
      mta.Event.stat('indexConfirmAuth', { 'openid': openid })
    } else {
      wx.request({
        url: api_v_url + '/User/refuseRegister',
        header: {
          'content-type': 'application/json'
        },
        data: {
          openid: openid
        },
        success: function() {
          user_info.is_wx_auth = 1;
          wx.setStorage({
            key: cache_key + 'userinfo',
            data: user_info,
          });
        }
      })
      //数据埋点-用户确认授权
      mta.Event.stat('indexRefuseAuth', { 'openid': openid })
    }
  },
  // 处理数据格式
  convertDataFormat: function(data) {
    // let someTtitle = null;
    // let someArrary = [];
    // for (let index = 0; index < mailListData.length; index++) {
    //   let newBrands = {
    //     brandId: mailListData[index].brandId,
    //     name: mailListData[index].brandName
    //   };
    //   if (mailListData[index].initial != someTtitle) {
    //     someTtitle = mailListData[index].initial
    //     let newObj = {
    //       id: index,
    //       region: someTtitle,
    //       brands: []
    //     };
    //     newObj.brands.push(newBrands);
    //     someArrary.push(newObj)
    //   }
    // };
  },
  showMailListPage: function(e) {
    let that = this;
    wx.request({
      url: api_v_url+'/hotel/getHotelList',
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
      },complete:function(res){
        //数据埋点-点击选择酒楼
        var user_info = wx.getStorageSync(cache_key+'userinfo');
        mta.Event.stat('changeHotel', { 'openid': user_info.openid })
      }
    }); 
  },
  chooseHotel: function(e) {
    console.log(e);
    let that = this;
    that.setData({
      hotel: e.detail,
      is_link:0,
    });
    var hotel_id = e.detail.id;
    var hotel_name = e.detail.name;
    var hotel_has_room = e.detail.hotel_has_room;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    user_info.select_hotel_id = hotel_id;
    user_info.select_hotel_name = hotel_name;
    user_info.is_common = 1;
    user_info.hotel_has_room = hotel_has_room;
    that.setData({
      user_info:user_info
    })
    wx.setStorageSync(cache_key + "userinfo", user_info);
    wx.removeStorageSync(cache_key +'link_box_info');
    if(hotel_has_room==0){
      
      wx.reLaunch({
        url: '/pages/tv_sale/system',
      })
    }else {
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
      //获取当前酒楼包间签到信息
      wx.request({
        url: api_v_url + '/user/getSigninBoxList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid: user_info.openid,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            sign_box_list = res.data.result;
            that.setData({
              sign_box_list: sign_box_list
            })
          }
        }
      })
    }
  },
  goRelief:function(res){
    //数据埋点-首页用户点击免责声明
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    mta.Event.stat('indexClickRelief', { 'openid': user_info.openid })
  },
  goToWelcome:function(e){ 
    wx.navigateTo({
      url: '/pages/welcome/index',
    })
  },
  goToHappy:function(e){
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    var box_mac = link_box_info.box_mac;
    if (box_mac == '' || typeof(box_mac) == 'undefined'){
      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.navigateTo({
        url: '/pages/birthday/index',
      })
    } 
  },
  /**
   * 控制弹窗弹开/关闭
   */
  switchShowControl:function(e){
    var that = this ;
    var is_show = e.currentTarget.dataset.is_show;
    if(is_show==1){
      var link_box_info = wx.getStorageSync(cache_key + 'link_box_info');
      if(link_box_info==''){
        app.showToast('请先选择包间电视');
        return false;
      }
      
      is_show = true;
    }else {
      is_show = false;
    }
    that.setData({
      showControlWindow: is_show
    })
  }
})