//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var box_mac;
var forscreen_type;
var common_appid = app.globalData.common_appid;
var sign_box_list; //签到包间
Page({
  data: {
    SystemInfo: app.SystemInfo,
    objectBoxArray: [],
    box_list: [],
    index: 0,
    userInfo: {},
    is_link: 0, //是否连接酒楼
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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showHotelErr: false,
    sign_box_list: [], //签到包间
    tv_forscreen:true,
    signin:true,
    showControlWindow:false,
    exchangerecord:[],//兑换记录
    is_have_adv:0,
    subscribe_status:3, //1 未获取公众号openid 2:已获取公众号openid但未关注 3：已获取公众号openid并且已关注
    comment_info:{'is_prompt':true,'comment_num':0,'reward_num':0},//是否有评价(弹窗)
    showMessageWindow:false,
    money_task_img:'',
    hasJurisdiction:true,
  },

  onLoad: function(res) {
    var that = this;
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
    uma.trackEvent('tv_interact_gotopage',{})

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
              rts.select_hotel_name = user_info.select_hotel_name;
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: rts,
              })
            }else{
              var subscribe_status = res.data.result.userinfo.subscribe_status;
              if(subscribe_status==1){
                wx.reLaunch({
                  url: '/pages/h5/index?h5_url='+app.globalData.Official_account_url+openid,
                })
                return false;
              }else if(subscribe_status == 2){
                wx.reLaunch({
                  url: '/pages/h5/index?h5_url='+app.globalData.Official_article_url,
                })
                return false;
              }
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: res.data.result.userinfo,
              })
              var user_info = res.data.result.userinfo;
              var hotel_id = user_info.hotel_id;
              //如果是注册的酒楼
              if (user_info.hotel_type==2){
                wx.reLaunch({
                  url: '/pages/hotel/register/index',
                })
                return false;
              }else if(user_info.hotel_type==3){//非合作餐厅 后台开通
                wx.reLaunch({
                  url: '/pages/hotel/nocooper/index',
                })
                return false;
              }
              //如果已登录 并且用户角色为服务员
              if (user_info.role_type==3){
                //跳转到服务员登陆页面
                wx.reLaunch({
                  url: '/pages/waiter/home',
                })
                return false;
              }
            }
            that.isComment(openid);
            //判断权限
            var tv_forscreen = app.in_array('tv_forscreen',user_info.service);
            var room_signin = app.in_array('room_signin', user_info.service);
            
            that.setData({
              user_info:user_info,
              tv_forscreen: tv_forscreen,
              room_signin: room_signin
            })
            /*(utils.PostRequest(api_v_url +'/withdraw/exchangerecord',{
              hotel_id : hotel_id
            }, (data, headers, cookies, errMsg, statusCode) => {
              that.setData({
                exchangerecord:data.result.datalist,
              })
            })*/
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
                url: api_v_url + '/Stb/getBoxList',
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
              //获取销售端配置  
              utils.PostRequest(api_v_url +'/config/getConfig',{
                hotel_id : hotel_id,
                openid:openid,
                action:'onload'
              }, (data, headers, cookies, errMsg, statusCode) => {
                app.globalData.config_info = data.result;
                that.setData({
                  is_have_adv: data.result.is_have_adv,
                  subscribe_status: data.result.subscribe_status,
                  showSurpriseWindow:data.result.is_open_money_task,
                  money_task_img:data.result.money_task_img
                })
              })
            } else {
              wx.reLaunch({
                url: '/pages/tv_sale/system',
              })
            }
          } else { //未授权登陆 跳转到登陆页面
            wx.setStorage({
              key: cache_key + 'userinfo',
              data: res.data.result.userinfo,
            })
            var user_info = res.data.result.userinfo;
            if(user_info.role_type== 4){//如果用户未代购注册
              if (user_info.status == 1) {
                wx.reLaunch({
                  url: '/pages/purchase/index',
                })
                return false;
              } else if (user_info.status == 2) {
                wx.reLaunch({
                  url: '/pages/purchase/auth',
                })
                return false;
              }
            }else{
              wx.reLaunch({
                url: '/pages/user/login',
              })
            }
          }
        }
      })
    }
  },
  isComment:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/comment/prompt', {
       openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(data.result.is_prompt==1){
        var showMessageWindow = true;
      }else {
        var showMessageWindow = false;
      }
      that.setData({comment_info:data.result,showMessageWindow:showMessageWindow})
     },res=>{},{isShowLoading:false})
  },
  closeComment:function(e){
    this.setData({showMessageWindow:false})
  },
  viewComment:function(e){
    wx.navigateTo({
      url: '/pages/waiter/index',
    })
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
    uma.trackEvent('tv_interact_changeroom',{'open_id':user_info.openid})
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
        wx.navigateTo({
          url: '/pages/launch/picture/index',
        })
        //数据埋点-点击图片上电视
        uma.trackEvent('tv_interact_clickforimg',{'open_id':user_info.openid})
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
        wx.navigateTo({
          url: '/pages/launch/video/index',
        })
        //数据埋点-点击视频上电视
        uma.trackEvent('tv_interact_clickforvideo',{'open_id':user_info.openid})
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
      utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
        box_mac: box_mac,
        msg: '{ "action": 3,"openid":"' + openid + '"}',
      }, (data, headers, cookies, errMsg, statusCode) => {
        app.showToast('退出成功');
        
      },{},
      {
          complete:function(res){
            //数据埋点-首页点击退出投屏
            uma.trackEvent('control_click_exit_forscreen',{'open_id':openid,'box_mac':box_mac})
          }
      })
    }
  }, //退出投屏结束
  changeVolume: function(e) { //更改音量
    var box_mac = e.target.dataset.box_mac;
    var change_type = e.target.dataset.change_type;
    var timestamp = (new Date()).valueOf();
    if (box_mac == '' || typeof(box_mac) == 'undefined') {
      app.showToast('请您先链接包间电视');
    } else {
      utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
        box_mac: box_mac,
        msg: '{"action":31,"change_type":' + change_type + '}'
      }, (data, headers, cookies, errMsg, statusCode) => {
        //app.showToast('操作成功');
      },{},
      {
        complete:function(res){
          var user_info = wx.getStorageSync(cache_key + 'userinfo');
          var openid = user_info.openid;
          //数据埋点-点击音量增减
          if (change_type == 2) {
            uma.trackEvent('control_click_voice',{'open_id':openid,'box_mac':box_mac,'status':1})
          } else if (change_type == 1) {
            uma.trackEvent('control_click_voice',{'open_id':openid,'box_mac':box_mac,'status':2})
          }
        }
      });
    }
  },
  
  gotoForFile:function(e){
    var that = this;
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
        that.setData({
          showMe: true,
        })
      }
    }
    uma.trackEvent('tv_interact_clickforfile',{'open_id':user_info.openid})
  },
  //微信好友文件
  wxFriendfiles: function(e) {
    var that = this;
    var box_mac = e.currentTarget.dataset.boxmac;
    var openid = e.currentTarget.dataset.openid;
    var is_open_simple = e.currentTarget.dataset.is_open_simple;
    wx.navigateTo({
      url: '/pages/launch/file/index?box_mac=' + box_mac + '&openid=' + openid ,
      success: function(e) {
        that.setData({
          showMe: false
        })
      }
    })
  },
  phonefiles: function(e) {
    var that = this;
    var box_mac = e.currentTarget.dataset.boxmac;
    var openid = e.currentTarget.dataset.openid;
    var is_open_simple = e.currentTarget.dataset.is_open_simple;
    wx.navigateTo({
      url: '/pages/launch/file/h5files?box_mac=' + box_mac + '&openid=' + openid ,
      success: function(e) {
        that.setData({
          showMe: false
        })
      }
    })
  },
  modalCancel: function(e) {
    var that = this;
    that.setData({
      showMe: false,
    })
  },
  /**
   * 宣传片列表
   */
  goToHotelAdv:function(e){
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    if (user_info.hotel_id == -1) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    if (typeof (hotel_id) =='undefined'){
      app.showToast('请您先选择酒楼');
    }else {
      var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
      var box_mac = link_box_info.box_mac;
      if (box_mac == '' || typeof(box_mac) == 'undefined'){
        app.showToast('请选择包间电视');
      }else{
        wx.navigateTo({
          url: '/pages/adv/index?hotel_id='+hotel_id+'&box_mac='+box_mac+'&openid='+user_info.openid,
        })
      } 
    }
  },
  signIn: function(e) {
    var that = this;
    var box_mac = e.currentTarget.dataset.box_mac;
    var keys = e.currentTarget.dataset.keys;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if(user_info.is_wx_auth!=3){
      that.setData({
        showWXAuthLogin: true,

      })
    }else {
      wx.request({
        url: api_v_url + '/user/signin',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          box_mac: box_mac,
          openid: openid,
          is_sale_wine:1
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
              uma.trackEvent('tv_interact_click_signroom',{'open_id':openid,'box_mac': box_mac})
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
    }
    //sign_box_list
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
    //this.onLoad()
    var that =this;
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      })
    }
    //数据埋点-进入电视互动页
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    that.setData({
      user_info: user_info
    })
    var openid = user_info.openid;
    //获取链接的盒子
    var link_box_info = wx.getStorageSync(cache_key + 'link_box_info');
    if (link_box_info!='') {
      that.setData({
        box_mac: link_box_info.box_mac,
        room_name: link_box_info.box_name
      })
    }
    if (user_info.hotel_id == -1) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    if(typeof(hotel_id)!='undefined'){
      that.getSignBoxList(hotel_id,user_info.openid);
      //获取销售端配置  
      utils.PostRequest(api_v_url +'/config/getConfig',{
        hotel_id : hotel_id,
        openid:openid
      }, (data, headers, cookies, errMsg, statusCode) => {
        that.setData({
        is_have_adv: data.result.is_have_adv,
        subscribe_status: data.result.subscribe_status
        })
        var subscribe_status = data.result.subscribe_status;
        if(subscribe_status==1){
          wx.reLaunch({
            url: '/pages/h5/index?h5_url='+app.globalData.Official_account_url+openid,
          })
        }else if(subscribe_status==2){
          wx.reLaunch({
            url: '/pages/h5/index?h5_url='+app.globalData.Official_article_url,
          })
        }
      },res=>{},{isShowLoading:false})
      var user_info = wx.getStorageSync(cache_key+'userinfo');
      if(user_info.role_type==0){
        that.setData({hasJurisdiction:false})
      }else{
        that.setData({hasJurisdiction:true})
      }
    }
  },
  getSignBoxList:function(hotel_id,openid){
    var that = this;
    utils.PostRequest(api_v_url + '/user/getSigninBoxList',{
      hotel_id : hotel_id,
      openid:openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        sign_box_list : data.result
      })
    },res=>{},{isShowLoading:false})
  },
  closeAuth: function() {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    //数据埋点-首页关闭取消授权弹窗
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    uma.trackEvent('closewxauth',{'open_id':user_info.openid})
  },
  //微信用户授权登陆
  onGetUserInfo: function(res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    uma.trackEvent('clickonwxauth',{'open_id':openid})
    wx.getUserProfile({
      desc:'获取用户头像',
      success(rets) {
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
                wx.setStorage({
                  key: cache_key + 'userinfo',
                  data: res.data.result,
                });
                
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
        uma.trackEvent('wxauthsucess',{'open_id':openid})
      },fail:function(){
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
        uma.trackEvent('refusewxauth',{'open_id':openid})
      }
    })
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
        uma.trackEvent('tv_interact_changehotel',{'open_id':user_info.openid})
      }
    }); 
  },
  chooseHotel: function(e) {
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
    //wx.setStorageSync(cache_key + "userinfo", user_info);
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
        url: api_v_url + '/Stb/getBoxList',
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
      //获取销售端配置  
      utils.PostRequest(api_v_url +'/config/getConfig',{
        hotel_id : hotel_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        app.globalData.config_info = data.result;
        if(typeof(data.result.is_have_adv)!='undefined'){
          that.setData({
            is_have_adv:data.result.is_have_adv
          })
        }
      })
    }
  },
  goRelief:function(res){
    //数据埋点-首页用户点击免责声明
    var user_info = wx.getStorageSync(cache_key+'userinfo');
  },
  goToWelcome:function(e){ 
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    if (user_info.hotel_id == -1) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    if (typeof (hotel_id) =='undefined'){
      app.showToast('请您先选择酒楼');
    }else {
      wx.navigateTo({
        url: '/pages/welcome/index',
      })
    }
    uma.trackEvent('tv_interact_clickwelcome',{'open_id':user_info.openid})
  },
  goToHappy:function(e){
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    var box_mac = link_box_info.box_mac;
    if (box_mac == '' || typeof(box_mac) == 'undefined'){
      app.showToast('请选择包间电视');
    }else{
      wx.navigateTo({
        url: '/pages/birthday/index',
      })
    }
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    uma.trackEvent('tv_interact_clickhappy',{'open_id':user_info.openid})
  },
  /**
   * 控制弹窗弹开/关闭
   */
  switchShowControl:function(e){
    var that = this ;
    var is_show = e.currentTarget.dataset.is_show;
    if(is_show==1){
      uma.trackEvent('control_operation_panel',{'open_id':app.globalData.openid,'status':1})
      var link_box_info = wx.getStorageSync(cache_key + 'link_box_info');
      if(link_box_info==''){
        app.showToast('请先选择包间电视');
        return false;
      }
      is_show = true;
    }else if(is_show==2){
      is_show = false;
      let propertyKey = e.currentTarget.dataset.p_key;
      let propertyVal = JSON.parse(e.currentTarget.dataset.p_value);
      
      let setData = {showControlWindow:false};
      setData[propertyKey] = propertyVal;
      that.setData(setData);
    }else {
      is_show = false;
      uma.trackEvent('control_operation_panel',{'open_id':app.globalData.openid,'status':2})
    }
    that.setData({
      showControlWindow: is_show
    })
    
  },
  /**
   * 指定服务员
   */
  assign_waiter:function(e){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var openid = user_info.openid;
    if(user_info.select_hotel_id>0){
      var hotel_id= user_info.select_hotel_id;
    }else {
      if(user_info.hotel_id==-1){
        app.showToast('请先选择酒楼');
        return false;
      }else {
        var hotel_id = user_info.hotel_id
      }
    }
    wx.navigateTo({
      url: '/pages/mine/assign_waiter?openid='+openid+'&hotel_id='+hotel_id,
    })
  },
  /**
   * 跳转帮助列表
   */
  gotoHelpList:function(e){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    if(user_info.select_hotel_id>0){
      var hotel_id= user_info.select_hotel_id;
    }else {
      if(user_info.hotel_id==-1){
        app.showToast('请先选择酒楼');
        return false;
      }else {
        var hotel_id = user_info.hotel_id
      }
    }
    wx.navigateTo({
      url: '/pages/hotel/help/list?hotel_id='+hotel_id,
    });
  },
  
  //关闭领取红包弹窗
  closeSurprise:function(){
    this.setData({showSurpriseWindow:false})
    var openid = this.data.openid;
    /*utils.PostRequest(api_v_url +'/aa/bb',{
      openid : openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      
    },{},{isShowLoading:false})*/
  },
  //点击领取礼物
  gotoTaskPrizeList:function(e){
    var openid = this.data.openid;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    if(user_info.select_hotel_id>0){
      var hotel_id= user_info.select_hotel_id;
    }else {
      if(user_info.hotel_id==-1){
        app.showToast('请先选择酒楼');
        return false;
      }else {
        var hotel_id = user_info.hotel_id
      }
    }
    if (user_info.is_wx_auth != 3) {
      this.setData({
        showWXAuthLogin: true,

      })
    } else {
      wx.navigateTo({
        url: '/pages/task/prize_list?openid='+openid+'&hotel_id='+hotel_id,
      })
      this.setData({showSurpriseWindow:false})
    }
  },
  scanCode:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    var url = '';
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    if(user_info.select_hotel_id>0){
      var hotel_id= user_info.select_hotel_id;
    }else {
      if(user_info.hotel_id==-1){
        app.showToast('请先选择酒楼');
        return false;
      }else {
        var hotel_id = user_info.hotel_id
      }
    }
    
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var code_msg = res.result;

        utils.PostRequest(api_v_url +'/qrcode/scancode',{
          content : code_msg,
          openid  : user_info.openid,
          type    : type
        }, (data, headers, cookies, errMsg, statusCode) => {
    
    
          switch(type){
            case '1':
              url = '/store/pages/goodschargeoff/addinfo?code_msg='+code_msg+'&hotel_id='+hotel_id;
              break;
            case '2':
              url ="/store/pages/couponbreakage/havecode/index?code_msg="+code_msg+'&hotel_id='+hotel_id;
              break;
            case '3':
              url = '/store/pages/activity/winesale/index?code_msg='+code_msg+'&hotel_id='+hotel_id;
              break;
            case '4':
              url = '/store/pages/phyprizechargeoff/index?code_msg='+code_msg+'&hotel_id='+hotel_id;
              break;
          }
          wx.navigateTo({
            url: url,
          })
          that.setData({showQRChoosePopWindow:false})


        })



        
      },fail:function(res){
        //app.showToast('二维码识别失败,请重试');
      }
    })
  },
})