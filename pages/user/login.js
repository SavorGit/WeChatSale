// pages/user/login.js
const app = getApp()
let utils = require('../../utils/util.js')
var openid;
var sms_time_djs;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var common_appid =  app.globalData.common_appid;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',                //手机号
    invite_code:'',           //邀请码
    is_get_sms_code:0,        //是否显示获取手机验证码倒计时
    showModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu();
    that.setData({
      common_appid: common_appid,
    })
    if (app.globalData.openid && app.globalData.openid != '') {
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      //判断用户是否注册
      userRegister(openid);
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          //判断用户是否注册
          userRegister(openid);

        }
      }

    }
    //数据埋点-进入登录页面
    utils.tryCatch(getApp().globalData.uma.trackEvent('userLogin_lifeCycle', {'open_id':openid,'lc_type':'onLoad'}));
    
    //判断用户是否注册
    function userRegister(openid){
      if(openid !='' && openid !=undefined){
        wx.request({
          url: api_v_url+'/User/isRegister',
          header: {
            'content-type': 'application/json'
          },
          data: {
            openid: openid,
          },
          success: function (res) {
            if(res.data.code==10000){
              
              if (res.data.result.userinfo.mobile != '' && res.data.result.userinfo.hotel_id != 0) {

                //res.data.result.userinfo.is_login = 1;
                wx.setStorage({
                  key: cache_key + 'userinfo',
                  data: res.data.result.userinfo,
                })
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              } else {
                wx.setStorage({
                  key: cache_key + 'userinfo',
                  data: res.data.result.userinfo,
                })
              }
            }
          }
        })
      }
      
    }
  },
  //微信用户授权登陆
  onGetUserInfo:function(res){
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    wx.getUserProfile({
      desc:'获取用户头像',
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
          success: function (res) {
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
                wx.reLaunch({
                  url: '/pages/index/index',
                })
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
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }

          },
          fail: function (res) {
            wx.showToast({
              title: '微信登陆失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }
        })
      },fail:function(){
        wx.request({
          url: api_v_url +'/User/refuseRegister',
          header: {
            'content-type': 'application/json'
          },
          data:{
            openid:openid
          },
          success:function(){
            user_info.is_wx_auth = 1;
            wx.setStorage({
              key: cache_key + 'userinfo',
              data: user_info,
            });
          }
        })
      }
    })

    
  },


  //输入手机号失去焦点
  mobileOnInput:function(res){
    var that = this;
    var mobile = res.detail.value;
    that.setData({
      mobile: mobile
    }) 
  },
  //输入邀请码失去焦点
  inviteCodeOnInput:function(res){
    var that =this;
    var invite_code = res.detail.value;
    that.setData({
      invite_code:invite_code
    })
  },
  //获取手机验证码
  getSmsCode:function(res){
    var that = this;
    var mobile = res.target.dataset.mobile;
    var invite_code = res.target.dataset.invite_code;
    if(mobile==''){
      
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return ;
    }
    var is_mobile = app.checkMobile(mobile);
    if(!is_mobile){
      return ;
    }
    if(invite_code==''){
      
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    //数据埋点-获取手机验证码
    utils.tryCatch(getApp().globalData.uma.trackEvent('userLogin_clickSendSmsCode', {'open_id':openid,'mobile': mobile,'code':invite_code}));
    wx.request({
      url: api_v_url+'/sms/sendverifyCode',
      header: {
        'content-type': 'application/json'
      },
      data:{
        mobile:mobile,
        invite_code:invite_code,
      },
      success:function(res){
        
        
        if(res.data.code==10000){ //上线前更换
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
          /*wx.setStorage({
            key: 'savor_user_info',
            data: { 'openid': openid,'hotel_id': 7 },
          })*/
        }else {
          var error_msg = res.data.msg;
          wx.showToast({
            title: error_msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  doLogin:function(res){
    var that = this;
    var mobile = res.detail.value.mobile;
    var invite_code = res.detail.value.invite_code;
    var verify_code = res.detail.value.verify_code;
    var openid = res.detail.value.openid;
    var is_mobile = app.checkMobile(mobile);
    if(!is_mobile){
      return ;
    }
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if(invite_code==''){
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 2000
      });
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
    //数据埋点-用户登录
    utils.tryCatch(getApp().globalData.uma.trackEvent('userLogin_clickDoLogin', {'open_id':openid,'mobile':mobile,'code': invite_code}));
    wx.request({
      url: api_v_url+'/login/login',
      header: {
        'content-type': 'application/json'
      },
      data: {
        //box_mac:box_mac,
        mobile: mobile,
        invite_code: invite_code,
        verify_code: verify_code,
        openid:openid,
      },
      success:function(rt){
        if(rt.data.code==10000){
          if(rt.data.result.hotel_type==3){//非合作餐厅
            wx.reLaunch({
              url: '/pages/hotel/nocooper/index',
            })
            return false;
          }else if(rt.data.result.hotel_type==2){//注册餐厅
            wx.reLaunch({
              url: '/pages/hotel/register/index',
            })
            return false;
          }else {//合作餐厅
            if (rt.data.result.hotel_has_room == 1) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            } else {
              wx.reLaunch({
                url: '/pages/tv_sale/system',
              })
            }
            var user_info = rt.data.result;
            //var user_info = wx.getStorageSync(cache_key + "userinfo");
            //user_info.is_login = 1;

            wx.setStorage({
              key: cache_key + 'userinfo',
              data: user_info,
            })
            wx.removeStorageSync(cache_key + 'link_box_info');
          }
          
        }else {
          wx.showToast({
            title: rt.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  register:function(e){
    wx.navigateTo({
      url: '/pages/user/signin',
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
    utils.tryCatch(getApp().globalData.uma.trackEvent('userLogin_lifeCycle', {'open_id':openid,'lc_type':'onShow'}));
    wx.hideHomeButton();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    utils.tryCatch(getApp().globalData.uma.trackEvent('userLogin_lifeCycle', {'open_id':openid,'lc_type':'onHide'}));
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    utils.tryCatch(getApp().globalData.uma.trackEvent('userLogin_lifeCycle', {'open_id':openid,'lc_type':'onUnload'}));
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