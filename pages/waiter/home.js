// pages/waiter/home.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
const utils = require('../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var box_mac;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo: app.SystemInfo,
    nickName: '匿名用户',
    integral: 0,
    goods_manage: false,
    staff_manage: false,
    integral_manage: false,
    integral_shop: false,
    task_manage: false,
    userScore: 3.7,
    is_activity:0,
    showMessageWindow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
    wx.hideShareMenu();
    var that = this;
    mta.Page.init()
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    var role_type = user_info.role_type;
    var is_wx_auth = user_info.is_wx_auth;
    var goods_manage = app.in_array('goods_manage', user_info.service);
    var staff_manage = app.in_array('staff_manage', user_info.service);
    var integral_manage = app.in_array('integral_manage', user_info.service);
    var integral_shop = app.in_array('integral_shop', user_info.service);
    var task_manage = app.in_array('task_manage', user_info.service);

    that.setData({
      role_type: role_type,
      is_wx_auth: is_wx_auth,
      goods_manage: goods_manage,
      staff_manage: staff_manage,
      integral_manage: integral_manage,
      task_manage: task_manage,
      integral_shop: integral_shop,
      hotel_id: hotel_id,
      openid: openid,
      role_id: user_info.role_id,
      config_info:app.globalData.config_info
    })
    wx.request({
      url: api_v_url + '/user/center',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            avatarUrl: res.data.result.avatarUrl,
            nickName: res.data.result.nickName,
            integral: res.data.result.integral,
            
            dishorder_process_num: res.data.result.dishorder_process_num,
            merchant_id: res.data.result.merchant_id,
            shoporder_process_num: res.data.result.shoporder_process_num,
            //dishorder_purchase_num: res.data.result.dishorder_purchase_num,
            //dishorder_common_num: res.data.result.dishorder_common_num,
  
            userScore: res.data.result.score
          })
        }
      }
    })

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
     })
  },
  closeComment:function(e){
    this.setData({showMessageWindow:false})
  },
  viewComment:function(e){
    wx.navigateTo({
      url: '/pages/waiter/index',
    })
  },
  exchange: function (res) {
    wx.navigateTo({
      url: '/pages/mine/exchange',
    })
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
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    
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
            /*wx.setStorage({
              key: cache_key + 'userinfo',
              data: rts,
            })*/
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
    wx.request({
      url: api_v_url + '/user/center',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            avatarUrl: res.data.result.avatarUrl,
            nickName: res.data.result.nickName,
            integral: res.data.result.integral,
            dishorder_process_num: res.data.result.dishorder_process_num,
            merchant_id: res.data.result.merchant_id,
            shoporder_process_num: res.data.result.shoporder_process_num,
            userScore: res.data.result.score
          })
        }
      }
    })
    that.isComment(openid);
    //this.onLoad()
  },
  closeAuth: function () {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    
  },
  integralList: function (e) {
    //数据埋点-点击收益明细
    mta.Event.stat('clickIntegralList', {
      'openid': openid
    })
  },
  
  
  goRelief: function (res) {
    //数据埋点-点击免责声明
    mta.Event.stat('userClickRelief', {
      'openid': openid
    })
  },
  userLogin: function (res) {
    var that = this;
    that.setData({
      showWXAuthLogin: true,
    })
    //数据埋点-个人信息页面点击登录
    mta.Event.stat('clickUserLogin', {
      'openid': openid
    })
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

  
  showLoadingOnClick: function (e) {

    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
    var id = e.currentTarget.dataset.id;
    if (id == 1) { //兑换
      mta.Event.stat("clickintegral", {})
    } else if (id == 2) { //任务列表
      var user_info = wx.getStorageSync(cache_key + 'userinfo');
      if (user_info.hotel_id == -1) {
        var hotel_id = user_info.select_hotel_id;
      } else {
        var hotel_id = user_info.hotel_id;
      }
      if (typeof (hotel_id) == 'undefined') {
        app.showToast('请您选择酒楼');
      } else {
        wx.navigateTo({
          url: '/pages/task/index',
        })
      }
      mta.Event.stat("clicktask", {})
    }

  },
  gotoWaiterDetail: function (e) {
    wx.navigateTo({
      url: '/pages/waiter/index?openid=' + openid,
    })
  },
  hotelComment:function(){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    wx.navigateTo({
      url: '/pages/hotel/comment/list?hotel_id='+hotel_id+'&openid='+openid,
    })
  },
  boxSignin:function(e){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    var hotel_id = user_info.hotel_id;
    wx.navigateTo({
      url: '/pages/waiter/signin?openid=' + openid+'&hotel_id='+hotel_id,
    })
  }
})