//index.js
//获取应用实例
const app = getApp()
var api_url = app.globalData.api_url;
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
    objectBoxArray: [],
    box_list :[], 
    index: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    is_link: 0,     //是否连接酒楼
    is_link_wifi: 0, //是否连接wifi
    is_view_link: 0,
    hotel_name: '',
    room_name: '',
    box_mac: '',
    wifi_mac: '',
    wifi_name: '',
    wifi_password: '',
    hiddens: true,

    showRetryModal: true, //连接WIFI重试弹窗
    bdShowModal:true,    //邀请码酒楼和绑定酒楼不一致
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showHotelErr:false,
    sign_box_list:[] //签到包间
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
    function is_login(openid){

      wx.request({
        url: api_url + '/Smallsale/User/isRegister',
        header: {
          'content-type': 'application/json'
        },
        data: {
          openid: openid,
        },
        success:function(res){
          if(res.data.code==10000 && res.data.result.userinfo.hotel_id !=0){
            wx.setStorage({
              key: cache_key + 'userinfo',
              data: res.data.result.userinfo,
            })
            var user_info = res.data.result.userinfo;
            var link_box_info = wx.getStorageSync(cache_key+'link_box_info');
            if(link_box_info !=''){//已链接盒子
              var box_name = link_box_info.box_name;
              that.setData({
                openid: openid,
                box_mac: link_box_info.box_mac,
                is_link: 1,
                room_name: box_name
              })
            }else {//未链接盒子

            }
            var hotel_id = user_info.hotel_id;
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
              url: api_url + '/Smallsale/user/getSigninBoxList',
              header: {
                'content-type': 'application/json'
              },
              data: {
                hotel_id: hotel_id,
                openid: openid,
              }, success: function (res) {
                console.log(res);
                if (res.data.code == 10000) {
                  sign_box_list = res.data.result;
                  that.setData({
                    sign_box_list: sign_box_list
                  })
                }
              }
            })


          }else {//未授权登陆 跳转到登陆页面
            wx.reLaunch({
              url: '/pages/user/login',
            })
          }
        }
      })  
    }

    /*var user_info = wx.getStorageSync(cache_key + "userinfo");
    var hotel_id = user_info.hotel_id;
    var openid = user_info.openid;
    that.setData({
      common_appid: common_appid,
    })
    
    //box_mac = '00226D655202';  
    //box_mac = '00226D583D92';    //兜率宫
    //box_mac = '00226D5845CE';   //4G监测
    if (user_info.is_login!=1 || user_info.is_wx_auth !=3){
      wx.reLaunch({
        url: '/pages/user/login',
      })
      
    }else if(user_info.hotel_id=='' || typeof(user_info.hotel_id)=='undefined'){
      wx.removeStorageSync(cache_key+'userinfo');
      that.setData({
        showHotelErr:true
      })
    }
    else {
      if(typeof(user_info.box_mac)!='undefined'){
        var box_name = user_info.box_name;
        that.setData({
          openid:openid,
          box_mac:user_info.box_mac,
          is_link :1,
          room_name:box_name
        })

      }
      var hotel_id = user_info.hotel_id;
      //获取酒楼包间列表
      wx.request({
        url: api_url +'/Smalldinnerapp11/Stb/getBoxList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
        },
        success:function(res){
          if(res.data.code==10000){
            that.setData({
              objectBoxArray:res.data.result.box_name_list,
              box_list:res.data.result.box_list
            })
          }
        }
      })
      //获取当前酒楼包间签到信息
      wx.request({
        url: api_url +'/Smallsale/user/getSigninBoxList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
          openid:openid,
        },success:function(res){
          console.log(res);
          if(res.data.code==10000){
            sign_box_list = res.data.result;
            that.setData({
              sign_box_list:sign_box_list
            })
          }
        }
      })
    }*/
  },
  //选择包间开始
  bindPickerChange: function (e) {
    var keys = e.detail.value;
    var box_list = this.data.box_list;
    var link_box_info = { 'box_mac': '', 'box_name': '' };
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

  },//选择包间结束
  
  
  chooseImage: function (res) {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var mobile = user_info.mobile;
    var box_mac = user_info.box_mac;
    if (box_mac == '' || box_mac == undefined) {

      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: api_url+'/Smallsale/user/checkuser',
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data: {
          mobile: mobile
        },
        success: function (res) {
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

        }
      })

    }
  },
  chooseVideo: function (res) {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var mobile = user_info.mobile;
    var box_mac = user_info.box_mac;
    if (box_mac == '' || box_mac == undefined) {
      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: api_url+'/Smallsale/user/checkuser',
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data: {
          mobile: mobile
        },
        success: function (res) {
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
        }
      })
    }
  },
  exitForscreen(e) {
    var that = this;
    var openid = e.currentTarget.dataset.openid;
    var box_mac = e.currentTarget.dataset.box_mac;
    var timestamp = (new Date()).valueOf();
    wx.request({
      url: api_url+'/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{ "action": 3,"openid":"' + openid + '"}',
      },
      success: function (res) {
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，退出失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },//退出投屏结束
  changeVolume: function (e) {//更改音量
    var box_mac = e.target.dataset.box_mac;
    var change_type = e.target.dataset.change_type;
    var timestamp = (new Date()).valueOf();
    wx.request({
      url: api_url+'/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{"action":31,"change_type":' + change_type + '}',
      },
    })
  },
  gotodownload:function(res){
    var that = this;
    that.setData({
      download_disable:true,
    })
    wx.navigateTo({
      url: '/pages/download/index',
      success:function(){
        that.setData({
          download_disable: false,
        })
      }
    })
  },
  
  signIn:function(e){
    var that = this;
    var box_mac = e.currentTarget.dataset.box_mac;
    var keys = e.currentTarget.dataset.keys;
    var user_info = wx.getStorageSync('savor:dinners:userinfo');
    openid = user_info.openid;
    //sign_box_list
    wx.request({
      url: api_url +'/Smallsale/user/signin',
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        box_mac:box_mac,
        openid:openid,
      },
      success:function(res){
        if(res.data.code==10000){
          if(res.data.result.status==2){
            for (var i = 0; i < sign_box_list.length; i++) {
              if (keys == i) {
                sign_box_list[i].status = 2;
                sign_box_list[i].user = { "avatarUrl": user_info.avatarUrl, "nickName": user_info.nickName, "openid": user_info.openid, "user_id": user_info.user_id };
              }
            }
            console.log(sign_box_list);
            that.setData({
              sign_box_list: sign_box_list,
            })
            wx.showToast({
              title: '签到成功',
              icon: 'none',
              duration: 2000
            })
          }else {
            for (var i = 0; i < sign_box_list.length; i++) {
              if (keys == i) {
                sign_box_list[i].status = 2;
                sign_box_list[i].user = { "avatarUrl": res.data.result.user.avatarUrl, "nickName": res.data.result.user.nickName, "openid": user_info.openid, "user_id": user_info.user_id };
              }
            }
            var err_desc = '该包间已由'+res.data.result.user.nickName+'签到';
            that.setData({
              sign_box_list: sign_box_list,
            })
            wx.showToast({
              title: err_desc,
              icon: 'none',
              duration: 2000
            })
          }

          
        }else {
          wx.showToast({
            title: '签到失败，请重试',
            icon:'none',
            duration:2000
          })
        }
      }
    })

  },
  repeatSign:function(e){
    var nickname = e.currentTarget.dataset.nickname;
    wx.showToast({
      title: '该电视已由' + nickname+'签到',
      icon:'none',
      duration:2000
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },
})