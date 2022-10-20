//app.js
import touch from './utils/touch.js'
const utils = require('./utils/util.js')
var uma = require('./utils/uma_analysis.js')
App({
  umengConfig:{
    appKey:'60bd92784d0228352bbe1c8b',//由友盟分配的APP_KEY
    useOpenid:true,// 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
    autoGetOpenid:true,// 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug:false,//是否打开调试模式
    uploadUserInfo:false,// 上传用户信息，上传后可以查看有头像的用户分享信息，同时在查看用户画像时，公域画像的准确性会提升。
    enableVerify:true
  },
  getNowFormatDate: function() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  checkMobile: function (mobile) {

    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
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
  //乘法
  accMul: function (arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  //加法
  plus: function (num1, num2) {
    const num1Digits = (num1.toString().split('.')[1] || '').length;
    const num2Digits = (num2.toString().split('.')[1] || '').length;
    const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
  },
  //减法
  accSubtr: function (arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m); //.toFixed(n)
  },
  showToast: function (title, duration=2000, icon = 'none',mask='false'){
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration,
      mask:mask,
    })
  },
  sleep:function (delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
      continue;
    }
  },
  checkIdCard:function (idcard) {
    const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(!regIdCard.test(idcard)) {
      //errorMsg = '身份证号填写有误';
      return false;
    } else {
      return true;
    }
  },
  boxShow:function(box_mac='',pubdetail,res_type,action,that,rtype='',ads_id=0,hotel_id=0){
    var self = this;
    var user_info = wx.getStorageSync(this.globalData.cache_key + 'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var openid = user_info.openid;
    var forscreen_char = '';
    var mobile_brand = this.globalData.mobile_brand;
    var mobile_model = this.globalData.mobile_model;
    
    var forscreen_id = (new Date()).valueOf();
    if(res_type==2){//视频
      for (var i = 0; i < pubdetail.length; i++) {
        var res_url = self.globalData.oss_url+'/'+pubdetail[i].forscreen_url
        var forscreen_url = pubdetail[i]. forscreen_url
        var filename      = pubdetail[i].filename
        var resource_id   = pubdetail[i].res_id
        utils.PostRequest(this.globalData.api_url + '/Netty/Index/pushnetty', {
          box_mac: box_mac,
          msg: '{ "action": 5,"url":"' + res_url + '","filename":"' + filename + '","forscreen_id":' + forscreen_id + ',"resource_id":' + resource_id + ',"openid":"'+openid+'"}',
        }, (data, headers, cookies, errMsg, statusCode) => {
          
          self.showToast('点播成功，电视即将播放');

          if(rtype=='wineads'){//如果是售酒广告点播 调用完成任务接口
            utils.PostRequest(this.globalData.api_v_url + '/task/finishDemandadvTask', {
              openid:openid,
              box_mac:box_mac,
              ads_id:ads_id,
              hotel_id:hotel_id
            }, (data, headers, cookies, errMsg, statusCode) => {

            
            })
          }

          utils.PostRequest(this.globalData.api_v_url + '/ForscreenLog/recordForScreenPics', {
            forscreen_id: forscreen_id,
            resource_id:resource_id,
            openid: openid,
            box_mac: box_mac,
            action: action,
            mobile_brand: mobile_brand,
            mobile_model: mobile_model,
            forscreen_char: '',
            imgs: '["'+forscreen_url+'"]',
            small_app_id: self.globalData.small_app_id,
          }, (data, headers, cookies, errMsg, statusCode) => {
    
          }, res => { }, { isShowLoading: false })
          
        });
        
      }
    }
  },
  isInteger:function (obj) {
    return obj % 1 === 0
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
          url: that.globalData.api_v_url + '/user/getOpenid',
          data: {
            "code": code
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {

            that.globalData.openid = res.data.result.openid;
            that.globalData.session_key = res.data.result.session_key;
            that.globalData.Official_article_url = res.data.result.official_account_article_url
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
  onHide: function (e) {
    let pages = getCurrentPages();
    let currPage = null;
    if (pages.length) {
      currPage = pages[pages.length - 1];
    }
    uma.trackEvent('onapphide',{'open_id':this.globalData.openid,'from_page':currPage.__route__})
  },
  in_array:function(search, array) {
    for(var i in array) {
      if (array[i] == search) {
        return true;
      }
    }
    return false;
  },
  globalData: {
    uma,
    openid: '',
    session_key: '',
    box_mac: '',
    mobile_brand: '',
    mobile_model: '',
    api_url: 'https://mobile.littlehotspot.com',
    api_v_url: 'https://mobile.littlehotspot.com/smallsale22',
    oss_upload_url: 'https://image.littlehotspot.com',
    oss_url: 'https://oss.littlehotspot.com',
    Official_account_url:'https://mobile.littlehotspot.com/h5/official/getuserinfo/p/',
    Official_article_url:'',
    oss_bucket:'redian-produce',
    cache_key: 'savor:sale:',
    common_appid: 'wxfdf0346934bb672f', 
    oss_access_key_id:'LTAI4SFjj1AsowpVFZNXOBCVqRHDs',
    oss_xz_limit:4096,     //oss旋转照片最大宽高
    small_app_id:5,
    config_info:{},
    is_pop_notice_wind:0
  },
  touch: new touch()
})