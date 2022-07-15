// pages/mine/index.js
const app = getApp()
var uma = app.globalData.uma;
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
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
    is_salestat:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.hideShareMenu();
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_lifeCycle', {'open_id':openid,'lc_type':'onLoad'}));
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
    

    
    

  },
  //我的员工
  getMyStaffList:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/user/employeelist', {
      openid: openid,
        page: 1,
        pagesize: 5
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        staff_list: data.result.datalist
      })
    },res=>{},{isShowLoading:false})
  },
  getUserCenter:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/user/center', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        avatarUrl: data.result.avatarUrl,
        nickName: data.result.nickName,
        integral: data.result.integral,
        dishorder_process_num: data.result.dishorder_process_num,
        merchant_id:data.result.merchant_id,
        shoporder_process_num: data.result.shoporder_process_num,
        userScore: data.result.score,
        reward_integral:data.result.reward_integral,
        reward_money:data.result.reward_money,
        is_salestat:data.result.is_salestat
      })
    },res=>{},{isShowLoading:false})
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
    //数据埋点-点击添加员工
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickAddStaff', {'open_id':openid}));
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
      }
    })

  },
  freshQrcode: function (e) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    //数据埋点-点击刷新邀请码
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickFreshQrcode', {'open_id':openid}));
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
      }
    })
  },
  closeAddStaff: function (e) {
    var that = this;
    that.setData({
      showAddTeamMemberPage: false,
    })
    //数据埋点-关闭员工添加员工弹窗
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickCloseAddStaffWindown', {'open_id':openid}));
  },
  userLogin: function (res) {
    var that = this;
    that.setData({
      showWXAuthLogin: true,
    })
    //数据埋点-个人信息页面点击登录
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickUserLogin', {'open_id':openid}));
  },
  onGetUserInfo: function (res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    uma.trackEvent('clickonwxauth',{'open_id':openid})
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
          selected: 0,
          list: [
            /*
            {
              "pagePath": "/pages/tv_sale/system",
              "text": "活动促销",
              "iconPath": "/images/icon/999999_sale.png",
              "selectedIconPath": "/images/icon/333333_sale.png"
            },
            */
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
          that.setData({user_info:res.data.result.userinfo})
          //console.log(res.data.result.userinfo)
        } else {
          wx.reLaunch({
            url: '/pages/user/login',
          })
        }
        
      }
    })
    that.getUserCenter(openid)
    that.getMyStaffList(openid);
    //数据埋点-进入个人信息页面
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_lifeCycle', {'open_id':openid,'lc_type':'onShow'}));
  },
  closeAuth: function () {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
    })
    //数据埋点-个人信息页面关闭取消授权登陆
    
    uma.trackEvent('closewxauth',{'open_id':openid})
  },
  integralList: function (e) {
    //数据埋点-点击收益明细
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickIntegralList', {'open_id':openid}));
  },
  popActivityList: function (e) {
    //数据埋点-点击活动商品管理
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickActivityGoodsList', {'open_id':openid}));
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
  },
  staffList: function (e) {
    //数据埋点-点击移除员工
    
  },
  goRelief: function (res) {
    //数据埋点-点击免责声明
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_lifeCycle', {'open_id':openid,'lc_type':'onHide'}));
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_lifeCycle', {'open_id':openid,'lc_type':'onUnload'}));
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
    //数据埋点-点击邀请员工
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickShareButton', {'open_id':openid}));
    var title = "邀请您使用小热点销售端";
    var img_url = 'http://oss.littlehotspot.com/media/resource/GyXmE3jRNh.jpg';
    if (e.from === 'button') {
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
    if (id == 1) { //兑换
      utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickIntegral', {'open_id':openid}));
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
      utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickTaskList', {'open_id':openid}));
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
    self.setData({
      showChangeNikenameWindow: false
    });
  },
  saleDishes: function (e) {
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
  gotoOrder: function (e) {
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    var type = e.currentTarget.dataset.type;
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      if (type == 3) {
        var url = '/pages/hotel/order/index?merchant_id=' + merchant_id + '&openid=' + openid + '&order_status=' + order_status + '&type=' + type
      } else {
        var url = '/pages/hotel/order/goods_list?merchant_id=' + merchant_id + '&openid=' + openid + '&order_status=' + order_status + '&type=' + type
      }
      wx.navigateTo({
        url: url,
      })
    }

  },
  gotoPlatform: function (e) {
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/hotel/platform/index?merchant_id=' + merchant_id + '&openid=' + openid,
      })
    }
  },
  gotoSetting: function (e) {
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
  gotoPurchaseOrder: function (e) {
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
  hotelActivity:function(){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    wx.navigateTo({
      url: '/pages/activity/dine_list?hotel_id='+hotel_id+'&openid='+openid,
    })
  },
  //客人打赏详情
  gotoPayDetail:function(e){
    wx.navigateTo({
      url: '/pages/reward/pay_detail',
    })
  },
  //积分奖励详情
  gotoIntegralDetail:function(e){
    wx.navigateTo({
      url: '/pages/reward/integral_detail',
    })
  },
  gotoDataCenter:function(e){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    wx.navigateTo({
      url: '/pages/mine/datecenter/statistics?openid='+openid+'&hotel_id='+hotel_id,
    })
  },
  gotoWaiterList:function(e){
    let self = this;
    let roleType = e.currentTarget.dataset.role_type;
    utils.tryCatch(getApp().globalData.uma.trackEvent('mineIndex_clickGotoWaiterList', {'open_id':openid,'role_type':roleType}));
  },
  gotoUrl:function(e){
    let self = this;
    let jumpUrl = e.currentTarget.dataset.url;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    wx.navigateTo({
      url: jumpUrl+'?hotel_id='+hotel_id+'&openid='+openid,
    });
    if(jumpUrl=='/pages/mine/post_book/index'){
      uma.trackEvent('mine_click_postbook',{'open_id':openid,'hotel_id':hotel_id})
    }
    
  },
  gotoStore:function(e){
    wx.navigateTo({
      url: '/store/pages/index?is_commen_user=1',
    })
  },
  gotoChargeoff:function(e){
    wx.navigateTo({
      url: '/store/pages/goodschargeoff/index',
    })
  },
  messageNotify:function(e){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    wx.navigateTo({
      url: '/pages/mine/message/index?hotel_id='+hotel_id+'&openid='+openid,
    })
  },
  gotoDishMenu:function(e){
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    var merchant_id = this.data.merchant_id;
    wx.navigateTo({
      url: '/pages/hotel/dishmenu/index?hotel_id='+hotel_id+'&openid='+openid+"&merchant_id="+merchant_id,
    })
  }
})