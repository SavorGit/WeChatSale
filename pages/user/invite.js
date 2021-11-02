// pages/user/invite.js
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key; 
var openid;
var sms_time_djs;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    wx.removeStorageSync(cache_key + 'link_box_info');
    var q = decodeURIComponent(options.q);
    if (q.indexOf("?") != -1){
      var selemite = q.indexOf("?");
      var invite_code = q.substring(selemite + 3, q.length);
    }else {
      var invite_code = q; 
    }

    if (app.globalData.openid && app.globalData.openid != '') {
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      //注册用户
      register(openid, invite_code);
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          
          //注册用户
          register(openid, invite_code);
        }
      }
    }
    function register(openid, invite_code){
      wx.request({
        url: api_v_url +'/login/scancodeLogin',
        header: {
          'content-type': 'application/json'
        },
        data: {
          openid: openid,
          qrcode: invite_code
        },
        success:function(res){
          if(res.data.code==10000){
            var user_info = res.data.result;
            
            
            if(res.data.result.hotel_id !=0){
              
              
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: user_info,
              })
              that.setData({
                showWXAuthLogin: true
              })
            }else {
              
              wx.redirectTo({
               url: '/pages/user/login',
              })
              wx.showToast({
                title: '邀请链接已失效！',
                icon: 'none',
                duration: 3000,
              })
            }
          }else {
            
            wx.redirectTo({
              url: '/pages/user/login',
            })
            wx.showToast({
              title: '邀请链接已失效！',
              icon: 'none',
              duration: 3000,
            })
          }
        },fail:function(res){
          wx.redirectTo({
            url: '/pages/user/login',
          })
        }
      })
    }
  },
  //微信用户授权登陆
  onGetUserInfo: function (res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var openid = user_info.openid;
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
          success: function (res) {
            if (res.data.code == 10000) {
              that.setData({
                showWXAuthLogin: false,

              })
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: res.data.result,
              });
              if (res.data.result.mobile==''){
                that.setData({
                  showRegister:true,
                  is_get_sms_code:0
                })
              }else {
                if (res.data.result.hotel_has_room == 1) {
                  var role_type = res.data.result.role_type;
                  if(role_type==3){
                    wx.reLaunch({
                      url: '/pages/waiter/home',
                    })
                  }else{
                    wx.reLaunch({
                      url: '/pages/user/sellindex',
                    })
                  }
                  
                } else {
                  wx.reLaunch({
                    url: '/pages/tv_sale/system',
                  })
                }
              }
            } else {
              wx.showToast({
                title: '微信授权登陆失败，请重试',
                icon: 'none',
                duration: 2000
              });
              wx.reLaunch({
                url: '/pages/user/login',
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
          success: function () {
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
  closeAuth: function () {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    //数据埋点-邀请页面关闭授权
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var openid = user_info.openid;
    uma.trackEvent('closewxauth',{'open_id':openid})

  },
  goRelief:function(res){
    console.log('ddddd')
    //数据埋点-点击免责声明
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var openid = user_info.openid;
    
  },
  bindMobile: function (e) {
    
    var that = this;
    var mobile = e.detail.value.mobile;
    var verify_code = e.detail.value.verify_code;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
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
    wx.showLoading({
      title: '手机号绑定中',
      mask: 'true'
    })
    wx.request({
      url: api_v_url + '/user/bindmobile',
      header: {
        'content-type': 'application/json'
      },
      data: {
        mobile: mobile,
        verify_code: verify_code,
        openid: user_info.openid,
      }, success: function (res) {
        if (res.data.code == 10000) {
          user_info.mobile = mobile;
          wx.setStorageSync(cache_key + 'userinfo', user_info);
          that.setData({
            showRegister: false
          })
          if(user_info.hotel_has_room==1){
            if(user_info.role_type==3){
              wx.reLaunch({
                url: '/pages/waiter/home',
              })
            }else {
              wx.reLaunch({
                url: '/pages/user/sellindex',
              })
            }
            
          }else {
            wx.reLaunch({
              url: '/pages/tv_sale/system',
            })
          }
          wx.showToast({
            title: '手机号绑定成功',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },complete:function(res){
        wx.hideLoading()
        //数据埋点-邀请页面绑定手机号
        uma.trackEvent('invite_bindmobile',{'open_id':openid,'mobile':mobile})
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
  sendSmsCode: function (e) {
    console.log(e);
    var that = this;
    var mobile = e.target.dataset.mobile;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
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
          console.log(typeof (sms_time_djs));
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
        //数据埋点-邀请页面发送手机验证码
        uma.trackEvent('invite_sendverifycode',{'open_id':openid,'mobile':mobile})
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