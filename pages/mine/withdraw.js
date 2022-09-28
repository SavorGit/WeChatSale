// pages/mine/withdraw.js
/**
 * 积分提现
 */
const util = require('../../utils/util.js');
const app = getApp()
const api_url = app.globalData.api_url;
const api_v_url = app.globalData.api_v_url;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_access_key_id = app.globalData.oss_access_key_id;
const cache_key = app.globalData.cache_key;
var uma = app.globalData.uma
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1, // 当前页码
    userIntegral: 0, // 用户积分
    freeze_integral:0, //用户冻结待核销积分
    goodsList: [], // 商品列表
    notEnoughIntegralWindowShow: false, // 是否弹出没有足够积分窗口
    confirmExchangeGoodsWindowShow: false, // 是否弹出确定兑换窗口
    openGoodsInWindow: {}, // 在确认弹窗中打开商品
    exchangeGoodsSuccess: {}, // 兑换成功后的提示
    collectIdcardWindowShow:false,  //手机用户身份信息弹窗
    addDisabled:false,                 //用户完善资料提交按钮是否可用
    user_id_info :{name:'',idcard:''}, //用户完善资料信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    uma.trackEvent('withdraw_gotopage',{'open_id':app.globalData.openid})
    wx.hideShareMenu();
    let that = this;
    var userInfo = wx.getStorageSync(cache_key + 'userinfo');
    this.setData({userInfo:userInfo})
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
    this.getOssInfo();
  },
  getOssInfo:function(){
    var that = this;
    wx.request({
      url: api_url + '/Smallapp/Index/getOssParams',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rest) {
        var policy = rest.data.policy;
        var signature = rest.data.signature;
        that.setData({policy:policy,signature:signature})
      }
    })
  },
  gotoFreezeIntegral:function(){
    var freeze_integral = this.data.freeze_integral;
    if(freeze_integral>0){
      var userInfo = wx.getStorageSync(cache_key + 'userinfo');
      wx.navigateTo({
        url: '/pages/mine/integral/freeze?openid='+userInfo.openid+'&hotel_id=0',
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    wx.hideLoading();
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    that.loadingData({
      hotel_id: userInfo.hotel_id,
      openid: userInfo.openid
    }, true);
  },
  chooseIdcardImage:function(e){
    console.log(e)
    var that = this;
    

    wx.showLoading({
      title: '图片扫描中...',
      mask: true
    })
    that.setData({
      addDisabled: true
    })
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filename = res.tempFilePaths[0];

        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var timestamp = (new Date()).valueOf();

        var postf = filename.substring(index1, index2);//后缀名\
        var postf_t = filename.substring(index1, index2);//后缀名
        var postf_w = filename.substring(index1 + 1, index2);//后缀名

        var img_url = timestamp + postf;

        var policy = that.data.policy;
        var signature = that.data.signature;

        wx.uploadFile({
          url: oss_upload_url,
          filePath: filename,
          name: 'file',
          header: {
            'Content-Type': 'image/' + postf_w
          },
          formData: {
            Bucket: "redian-produce",
            name: img_url,
            key: "forscreen/resource/" + img_url,
            policy: policy,
            OSSAccessKeyId: app.globalData.oss_access_key_id,
            sucess_action_status: "200",
            signature: signature

          },

          success: function (res) {
            var img_path = "forscreen/resource/" + img_url
            
            util.PostRequest(api_v_url + '/ocr/getIdcardInfo', {
              openid: app.globalData.openid,
              img_url: img_path,
            }, (data, headers, cookies, errMsg, statusCode) => {
              
              if(data.result.errcode==0){
                wx.hideLoading();
                var user_id_info = that.data.user_id_info;
                user_id_info.name = data.result.name;
                user_id_info.idcard = data.result.id;
                
                that.setData({user_id_info:user_id_info})
              }else{
                var errmsg = '['+data.result.errcode+']身份证扫描失败';
                app.showToast(errmsg);
              }
              
              setTimeout(function () {
                that.setData({
                  addDisabled: false
                })
              }, 1000);

            })



            
          },
          fail: function ({ errMsg }) {
            wx.hideLoading();
            app.showToast('图片上传失败，请重试')
            that.setData({
              addDisabled: false
            })
          },
        });
      }, fail: function (e) {
        wx.hideLoading();
        that.setData({
          addDisabled: false
        })
      }
    })
  },
  inputName:function(e){
    var user_id_info = this.data.user_id_info;
    var name  = e.detail.value.replace(/\s+/g, '');
    user_id_info.name = name;
    this.setData({user_id_info:user_id_info});
  },
  inputIdcard:function(e){
    var user_id_info = this.data.user_id_info;
    var idcard = e.detail.value.replace(/\s+/g, '');
    user_id_info.idcard = idcard;
    this.setData({user_id_info:user_id_info})
  },
  perfectUserIdInfo:function(){
    var that = this;
    var user_id_info = this.data.user_id_info;
    if(user_id_info.name==''){
      app.showToast('请填写您的姓名');
      return false;
    }
    if(user_id_info.idcard==''){
      app.showToast('请填写您的身份证号');
      return false;
    }
    if(user_id_info.idcard.length!=18){
      app.showToast('请填写正确的身份证号');
      return false;
    }
    util.PostRequest(api_v_url + '/user/edit', {
      openid: app.globalData.openid,
      name: user_id_info.name,
      idnumber :user_id_info.idcard
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({collectIdcardWindowShow:false})
      that.wxchange();

    })
  },

  getPhoneNumber:function(e){
    var that = this;
    if ("getPhoneNumber:ok" != e.detail.errMsg) {
      app.showToast('获取用户手机号失败')
      return false;
    }
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    util.PostRequest(api_v_url + '/user/bindAuthMobile', {
      openid:app.globalData.openid,
      iv: iv,
      encryptedData: encryptedData,
      session_key: app.globalData.session_key,
    }, (data, headers, cookies, errMsg, statusCode) => {

      //更新缓存
      var userInfo = wx.getStorageSync(cache_key + 'userinfo');
      userInfo.mobile = data.result.phoneNumber;
      wx.setStorageSync(cache_key + 'userinfo', userInfo)
      that.setData({
        userInfo:userInfo
      })
      app.showToast('绑定手机成功')
      
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    console.log('Page.onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 兑换商品
   */
  exchangeGoods: function(e) {
    let that = this;
    let goodsListIndex = e.currentTarget.dataset.index;
    let goods = that.data.goodsList[goodsListIndex];
    let goodsConsume = parseInt(goods.integral);
    
    uma.trackEvent('withdraw_click_exchange_money',{'open_id':app.globalData.openid,'money_goods_id':goods.id})

    if (that.data.userIntegral < goodsConsume) {
      that.setData({
        notEnoughIntegralWindowShow: true
      });
      return;
    }
    that.setData({
      confirmExchangeGoodsWindowShow: true,
      openGoodsInWindow: that.data.goodsList[goodsListIndex]
    });
  },

  /**
   * 关闭积分不足弹窗
   */
  closeNotEnoughIntegralWindow: function(e) {
    let that = this;
    that.setData({
      notEnoughIntegralWindowShow: false
    });
  },

  /**
   * 关闭兑换确认弹窗
   */
  closeConfirmExchangeGoodsWindow: function(e) {
    let that = this;
    that.setData({
      confirmExchangeGoodsWindowShow: false
    });
  },

  /**
   * 确认兑换商品
   */
  confirmExchangeGoods: function(e) {
    let that = this;
    var goods_id = that.data.openGoodsInWindow.id;
    util.PostRequest(api_v_url + '/withdraw/checkMoney', {
      openid:app.globalData.openid,
      goods_id:goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var is_alert = data.result.is_alert;
      if(is_alert==1){
        that.setData({collectIdcardWindowShow:true})
      }else {
        that.wxchange();
      }

    })
    
  },
  wxchange:function(){
    var that = this;
    // console.log('兑换', e);
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    // let goodsId = e.currentTarget.dataset.goodsId;
    let requestData = {
      id: that.data.openGoodsInWindow.id,
      hotel_id: userInfo.hotel_id,
      openid: userInfo.openid
    };
    util.PostRequest(api_v_url + '/withdraw/wxchange', requestData, function(data, headers, cookies, errMsg, httpCode) {
      // console.log('confirmExchangeGoods', 'success', this, data, headers, cookies, errMsg, httpCode);
      // console.log('confirmExchangeGoods', 'success', this, data, headers, cookies, errMsg, httpCode, arguments);
      if (typeof(data) != 'object' || typeof(data.result) != 'object') {
        wx.showToast({
          title: "服务器返回数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000
        });
        return;
      }
      let userIntegral = data.result.integral;
      
      if (typeof(userIntegral) != 'number' && typeof(userIntegral) != 'string') {
        wx.showToast({
          title: "服务器返回积分数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000
        });
        return;
      }
      if (that.data.openGoodsInWindow.is_audit == 1) { // 需审核
        that.setData({
          userIntegral: userIntegral,
          
          exchangeGoodsCheckWindowShow: true,
          exchangeGoodsSuccess: data.result
        });
      } else { // 无审核
        that.setData({
          userIntegral: data.result.integral,
          //freeze_integral:freeze_integral,
          exchangeGoodsWindowShow: true,
          exchangeGoodsSuccess: data.result
        });
      }
    }, function(res) {
      // wx.navigateBack();
    });
  },



  /* **************************** 自定义方法 **************************** */
  loadingData: function(requestData, navigateBackOnError) {
    let that = this;
    util.PostRequest(api_v_url + '/withdraw/getMoneyList', requestData, function(data, headers, cookies, errMsg, httpCode) {
      if (typeof(data) != 'object' || typeof(data.result) != 'object') {
        wx.showToast({
          title: "服务器返回数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack();
            }, 2000);
          }
        });
        return;
      }
      let userIntegral = data.result.integral;
      let freeze_integral = data.result.freeze_integral;
      if (typeof(userIntegral) != 'number' && typeof(userIntegral) != 'string') {
        wx.showToast({
          title: "服务器返回积分数据错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack();
            }, 2000);
          }
        });
        return;
      }
      let goodsListForReturn = data.result.datalist;
      if (typeof(goodsListForReturn) != 'object' || !(goodsListForReturn instanceof Array)) {
        wx.showToast({
          title: "服务器返回兑换列表错误！请用联系管理员。",
          icon: 'none',
          mask: true,
          duration: 5000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack();
            }, 2000);
          }
        });
        return;
      } else if (goodsListForReturn.length < 1) {
        wx.showToast({
          title: "该商家没有配置兑换列表！",
          icon: 'none',
          mask: true,
          duration: 5000
        });
      }
      that.setData({
        userIntegral: userIntegral,
        freeze_integral:freeze_integral,
        goodsList: goodsListForReturn
      });
    }, function(res) {
      if (navigateBackOnError == true) {
        wx.navigateBack();
      }
    }, that);
  }
})