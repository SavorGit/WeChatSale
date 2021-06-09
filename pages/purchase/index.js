// pages/purchase/index.js
/**
 * 分销 - 主页
 */
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showWXAuthLogin:false,
    income_fee:0,
    withdraw_fee:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;

    utils.PostRequest(api_v_url + '/user/center', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        income_fee: data.result.income_fee,
        withdraw_fee: data.result.withdraw_fee,
      })
    });
  },
  closeAuth: function () {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    
  },
  withdraw:function(e){
    var that = this;
    var money = that.data.withdraw_fee;
    if(money<=0){
      app.showToast('暂时无可提现的收益');
      return false;
    }
    utils.PostRequest(api_v_url + '/Withdraw/income', {
      money:money,
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        income_fee: data.result.income_fee,
        withdraw_fee: data.result.withdraw_fee,
      })
      app.showToast('申请提现成功');
    });
  },
  gotoIncomerecord:function(e){
    wx.navigateTo({
      url: '/pages/purchase/shopping/profit-detail?openid='+openid,
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
    var that = this;
    wx.hideHomeButton();
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;

    utils.PostRequest(api_v_url + '/user/center', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        income_fee: data.result.income_fee,
        withdraw_fee: data.result.withdraw_fee,
      })
    });
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


  // 页面跳转
  gotoPage: function (e) {
    let self = this;
    let pageType = e.currentTarget.dataset.page;

    var user_info = wx.getStorageSync(cache_key+'userinfo');
    if(user_info.is_wx_auth!=3){
      self.setData({
        showWXAuthLogin: true
      })
    }else {
      wx.showLoading({
        title: '正在跳转...',
        mask: true
      });
      switch (pageType) {
        case 'foods':
          wx.navigateTo({
            url: '/pages/purchase/merchant/index?openid=' + openid,
            success: function (res) {
              wx.hideLoading();
            }
          });
          break;
        case 'share':
          wx.navigateTo({
            url: '/pages/purchase/shopping/index?openid=' + openid,
            success: function (res) {
              wx.hideLoading();
            }
          });
          break;
        case 'order':
          wx.navigateTo({
            url: '/pages/purchase/order/index?openid=' + openid + "&order_status=0",
            success: function (res) {
              wx.hideLoading();
            }
          });
          break;
        case 'recod':
          wx.navigateTo({
            url: '/pages/purchase/share/log?openid=' + openid,
            success: function (res) {
              wx.hideLoading();
            }
          });
          break;
        default:
          wx.showToast({
            icon: 'none',
            title: '无此页面',
          });
          break;
      }
    }
  },
  onGetUserInfo: function (res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    wx.getUserProfile({
      desc:'获取用户头像',
      success(rets) {
        var avatarUrl = rets.userInfo.avatarUrl;
        var nickName = rets.userInfo.nickName;
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
              that.setData({
                nickName: nickName,
                avatarUrl: avatarUrl,
                is_wx_auth: res.data.result.is_wx_auth
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
          fail: function (res) {
            wx.showToast({
              title: '微信登陆失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }
        })
      },fail:function(e){
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
      }
    })

    
  },
})