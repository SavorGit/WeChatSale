// pages/mine/index.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
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
    is_open_integral: 0,
    goods_manage: false,
    staff_manage: false,
    integral_manage: false,
    integral_shop: false,
    task_manage: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    mta.Page.init()
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    }else {
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
      openid: openid
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
            is_open_integral: res.data.result.is_open_integral,
            month_integral: res.data.result.month_integral,
            next_month_integral: res.data.result.next_month_integral,
            dish_num: res.data.result.dish_num,
            dishorder_all_num: res.data.result.dishorder_all_num,
            dishorder_process_num: res.data.result.dishorder_process_num,
            merchant_id: res.data.result.merchant_id,
            shoporder_all_num:res.data.result.shoporder_all_num,
            shoporder_process_num:res.data.result.shoporder_process_num,
            //dishorder_purchase_num: res.data.result.dishorder_purchase_num,
            //dishorder_common_num: res.data.result.dishorder_common_num,
            is_purchase: res.data.result.is_purchase
          })
        }
      }
    })

    //我的员工
    wx.request({
      url: api_v_url + '/user/employeelist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: 1,
        pagesize: 5
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            staff_list: res.data.result.datalist
          })
        }
      }
    })
    
  },
  loadMore: function (res) {
    var that = this;
    page = page + 1;
    wx.showLoading({
      title: '加载中，请稍后',
    })
    wx.request({
      url: api_v_url + '/user/integralrecord',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: page,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            integral_list: res.data.result.datalist
          })
          wx.hideLoading()
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    }, 5000)
  },
  exchange: function (res) {
    wx.navigateTo({
      url: '/pages/mine/exchange',
    })
  },
  addStaff: function (e) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");

    wx.request({
      url: api_v_url + '/user/invite',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: user_info.openid,

      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            showAddTeamMemberPage: true,
            qrcode_url: res.data.result.qrcode_url,
            qrcode: res.data.result.qrcode,
          })
        } else {
          wx.showToast({
            title: '参数异常，请重试!',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，请重试!',
          icon: 'none',
          duration: 2000,
        })
      },
      complete: function (res) {
        //数据埋点-点击添加员工
        mta.Event.stat('clickAddStaff', {
          'openid': user_info.openid
        })
      }
    })

  },
  freshQrcode: function (e) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    wx.request({
      url: api_v_url + '/user/invite',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: user_info.openid,

      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({

            qrcode_url: res.data.result.qrcode_url,
            qrcode: res.data.result.qrcode,
          })
        } else {
          wx.showToast({
            title: '参数异常，请重试!',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，请重试!',
          icon: 'none',
          duration: 2000,
        })
      },
      complete: function (res) {
        //数据埋点-点击刷新邀请码
        mta.Event.stat('clickFreshQrcode', {
          'openid': user_info.openid
        })
      }
    })
  },
  closeAddStaff: function (e) {
    var that = this;
    that.setData({
      showAddTeamMemberPage: false,
    })
    //数据埋点-关闭员工添加员工弹窗
    mta.Event.stat("clickcloseaddstaff", {})
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
  onGetUserInfo: function (res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    if (res.detail.errMsg == 'getUserInfo:ok') {

      wx.getUserInfo({
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
        }
      })
      //数据埋点-用户确认授权
      mta.Event.stat('userConfirmAuth', {
        'openid': openid
      })
    } else {
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
      //数据埋点-用户拒绝授权
      mta.Event.stat('userRefuseAuth', {
        'openid': openid
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
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    if (user_info.hotel_has_room == 0) {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1,
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
    } else {
      this.getTabBar().setData({
        selected: 2,

      })
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
            is_open_integral: res.data.result.is_open_integral,
            month_integral: res.data.result.month_integral,
            next_month_integral: res.data.result.next_month_integral,
            dish_num: res.data.result.dish_num,
            dishorder_all_num: res.data.result.dishorder_all_num,
            dishorder_process_num: res.data.result.dishorder_process_num,
            merchant_id: res.data.result.merchant_id
          })
        }
      }
    })
    //数据埋点-进入个人信息页面
    mta.Event.stat('showUserIndex', {
      'openid': user_info.openid
    })
    this.onLoad()
  },
  closeAuth: function () {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    //数据埋点-个人信息页面关闭取消授权登陆
    mta.Event.stat('userCloseAuth', {
      'openid': openid
    })
  },
  integralList: function (e) {
    //数据埋点-点击收益明细
    mta.Event.stat('clickIntegralList', {
      'openid': openid
    })
  },
  popActivityList: function (e) {
    //数据埋点-点击活动商品管理

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
        url: '/pages/mine/pop_list',
      })
    }

    mta.Event.stat('clickActivityGoodsList', {
      'openid': openid
    })
  },
  staffList: function (e) {
    //数据埋点-点击移除员工
    mta.Event.stat('clickRemoveStaff', {
      'openid': openid,
      'inviteid': invite_id
    })
  },
  goRelief: function (res) {
    //数据埋点-点击免责声明
    mta.Event.stat('userClickRelief', {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var qrcode = e.target.dataset.qrcode;
    var userinfo = wx.getStorageSync(cache_key + 'userinfo');
    var title = "邀请您使用小热点销售端";
    var img_url = 'http://oss.littlehotspot.com/media/resource/GyXmE3jRNh.jpg';
    if (e.from === 'button') {
      //数据埋点-点击邀请员工
      mta.Event.stat('clickInviteStaff', {
        'openid': userinfo.openid
      })
      // 转发成功
      // 来自页面内转发按钮
      return {
        title: title,
        path: '/pages/user/invite?q=' + qrcode,
        imageUrl: img_url,
        success: function (res) {

        }
      }
    }
  },
  showLoadingOnClick: function (e) {

    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
    var id = e.currentTarget.dataset.id;
    if (id == 1) {//兑换
      mta.Event.stat("clickintegral", {})
    } else if (id == 2) {//任务列表
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

  // 打开用户归属信息窗口
  openUserAscriptionInfomationWindow: function (e) {
    let self = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    self.setData({
      showUserAscriptionInfomationWindow: true,
      userInfo: user_info
    });
  },

  // 关闭修改昵称弹窗
  closeChangeNikenameWindow: function (e) {
    let self = this;
    self.setData({ showChangeNikenameWindow: false });
  },
  saleDishes:function(e){
    var that = this;
    var merchant_id = that.data.merchant_id;
    var hotel_id = that.data.hotel_id;
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/hotel/dishes/index?merchant_id=' + merchant_id + '&openid=' + openid + "&hotel_id=" + hotel_id,
      })
    }
    
  },
  gotoOrder:function(e){
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    var type = e.currentTarget.dataset.type;
    if (typeof (merchant_id)=='undefined'){
      return false;
    }else {
      if(type==3){
        var url = '/pages/hotel/order/index?merchant_id=' + merchant_id + '&openid=' + openid + '&order_status=' + order_status + '&type=' + type
      }else {
        var url = '/pages/hotel/order/goods_list?merchant_id=' + merchant_id + '&openid=' + openid + '&order_status=' + order_status + '&type=' + type
      }
      wx.navigateTo({
        url: url,
      })
    }
    
  },
  gotoPlatform:function(e){
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/hotel/platform/index?merchant_id=' + merchant_id + '&openid=' + openid ,
      })
    }
  },
  gotoSetting:function(e){
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/mine/setting/list?merchant_id=' + merchant_id + '&openid=' + openid,
      })
    }
  },
  gotoPurchaseOrder:function(e){
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/hotel/order/agent?merchant_id=' + merchant_id + '&openid=' + openid,
      })
    }
  }
})