// pages/user/invite.js
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
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
    wx.hideShareMenu();
    var q = decodeURIComponent(options.q);
    if (q.indexOf("?")){
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
      register(openid);
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          
          //注册用户
          register(openid);
        }
      }
    }
    function register(openid){
      wx.request({
        url: api_url+'/aa/bb/cc',
        header: {
          'content-type': 'application/json'
        },
        data: {
          openid: openid,
        },
        success:function(res){
          if(res.data.code==10000){
            var user_info = res.data.reseult;
            
            
            if(res.data.result.hotel_id !=0){
              wx.switchTab({
                url: '/pages/index/index',
              })   
            }else {
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: user_info,
              })
              that.setData({
                showWXAuthLogin: true
              })
            }
          }else {
            wx.redirectTo({
              url: '/pages/user/login',
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
    openid = user_info.openid;
    if (res.detail.errMsg == 'getUserInfo:ok') {

      wx.getUserInfo({
        success(rets) {
          console.log(rets);
          wx.request({
            url: api_url + '/Smallsale/User/registerCom',
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
                wx.reLaunch({
                  url: '/pages/index/index',
                })
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
        }
      })
    } else {
      wx.request({
        url: api_url + '/Smallsale/User/refuseRegister',
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

  }
})