//app.js
import touch from './utils/touch.js'
var mta = require('./utils/mta_analysis.js')
App({
  checkMobile: function (mobile) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length == 0) {

      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (mobile.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  onLaunch: function () {
    var oss_tmp_key = this.globalData.oss_access_key_id;
    var oss_access_key_id = '';
    for (var n = 0; n < oss_tmp_key.length; n++) {
      if (n == 0 || n % 5 != 0) {
        oss_access_key_id += oss_tmp_key[n];
      }
    }
    this.globalData.oss_access_key_id = oss_access_key_id
    mta.App.init({
      "appID": "500699143",
      "eventID": "500699145",
      "autoReport": true,
      "statParam": true,
      "ignoreParams": [],
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新打开',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }



    var that = this

    wx.login({
      success: res => {
        var code = res.code; //返回code
        wx.request({
          url: that.globalData.api_url + '/smallsale/user/getOpenid',
          data: {
            "code": code
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {

            that.globalData.openid = res.data.result.openid;
            that.globalData.session_key = res.data.result.session_key;
            if (that.openidCallback) {
              that.openidCallback(res.data.result.openid);
            }
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.mobile_brand = res.brand;
        that.globalData.mobile_model = res.model;
        that.SystemInfo = {
          SDKVersion: res.SDKVersion,
          batteryLevel: res.batteryLevel,
          brand: res.brand,
          errMsg: res.errMsg,
          fontSizeSetting: res.fontSizeSetting,
          language: res.language,
          model: res.model,
          pixelRatio: res.pixelRatio,
          platform: res.platform,
          statusBarHeight: res.statusBarHeight,
          system: res.system,
          version: res.version,
          safeArea: res.safeArea,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          window: {
            width: res.windowWidth,
            height: res.windowHeight
          },
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          screen: {
            width: res.screenWidth,
            height: res.screenHeight
          },
          screenBottomSpace: (res.screenHeight - res.safeArea.bottom),
          documentWidth: res.safeArea.width,
          documentHeight: res.safeArea.bottom - res.statusBarHeight
        };
      }
    })
  },
  globalData: {
    openid: '',
    session_key: '',
    box_mac: '',
    mobile_brand: '',
    mobile_model: '',
    api_url: 'https://dev-mobile.littlehotspot.com',
    oss_upload_url: 'https://dev-image.littlehotspot.com',
    oss_url: 'https://dev-oss.littlehotspot.com',
    cache_key: 'savor:sale:',
    common_appid: 'wxfdf0346934bb672f',
    box_type: 0,
    is_zhilian: 1,
    oss_access_key_id:'LTAITBjXOpORHKfXlOX'
  },
  touch: new touch()
})