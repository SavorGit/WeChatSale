// pages/waiter/signin.js

//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
var mta = require('../../utils/mta_analysis.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
var sign_box_list; //签到包间
Page({
  data: {
    SystemInfo: app.SystemInfo,
   
    sign_box_list: [], //签到包间
    
  },

  onLoad: function (option) {
    var that = this;
    openid = option.openid;
    hotel_id = option.hotel_id;
    //获取当前酒楼包间签到信息
    this.getSignBoxList(hotel_id,openid)


  },
  getSignBoxList: function (hotel_id, openid) {
    var that = this;
    utils.PostRequest(api_v_url + '/user/getSigninBoxList', {
      hotel_id: hotel_id,
      openid: openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        sign_box_list: data.result
      })
    })
  },
  signIn: function (e) {
    var that = this;
    var box_mac = e.currentTarget.dataset.box_mac;
    var keys = e.currentTarget.dataset.keys;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var sign_box_list = this.data.sign_box_list;
    openid = user_info.openid;
    if (user_info.is_wx_auth != 3) {
      that.setData({
        showWXAuthLogin: true,

      })
    } else {
      wx.request({
        url: api_v_url + '/user/signin',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          box_mac: box_mac,
          openid: openid,
        },
        success: function (res) {
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
              mta.Event.stat('indexRoomSign', { 'boxmac': box_mac, 'openid': openid })
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
  repeatSign: function (e) {
    var nickname = e.currentTarget.dataset.nickname;
    wx.showToast({
      title: '该电视已由' + nickname + '签到',
      icon: 'none',
      duration: 2000
    })
  },

  assign_waiter:function(){
    wx.navigateTo({
      url: '/pages/mine/assign_waiter?openid='+openid+'&hotel_id='+hotel_id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  
  

  
  
})