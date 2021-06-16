// pages/launch/video/index.js
const app = getApp();
var uma = app.globalData.uma;
var openid;
var box_mac;
var res_sup_time ;
var policy;
var signature;
var forscreen_char='' ;
var intranet_ip;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play_times: 0,
    item: [],
    updateStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    var that = this;
    wx.hideShareMenu();
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    openid = user_info.openid;
    box_mac = link_box_info.box_mac;
    that.setData({
      box_mac: box_mac,
      openid: openid,

    })
    var forscreen_id = (new Date()).valueOf();
    var filename = (new Date()).valueOf();


    wx.request({
      url: api_v_url + '/playtime/getTimeList',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rts) {
        that.setData({
          item: rts.data.result,
          openid: openid,
          box_mac: box_mac,
        })
      }

    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var video_url = res.tempFilePath

        that.setData({
          upload_vedio_temp: video_url,
          duration: res.duration,
          video_size: res.size,
          is_forscreen: 1
        })
        uma.trackEvent('forscreen_forvideo_choosevideo',{'open_id':openid,'box_mac':box_mac,'status':1,'is_rechoose':0})
      },
      fail: function (e) {
        wx.navigateBack({
          delta: 1,
        })
        uma.trackEvent('forscreen_forvideo_choosevideo',{'open_id':openid,'box_mac':box_mac,'status':0,'is_rechoose':0})
      }
    })
    

    uma.trackEvent('forscreen_forvideo_onshowpage',{'open_id':openid,'box_mac':box_mac});
  },
  forscreen_video: function (res) {
    var that = this;
    that.setData({
      updateStatus: 1,
      is_btn_disabel: true,
      hiddens: false,
    })
    openid = res.detail.value.openid;
    box_mac = res.detail.value.box_mac;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var video_url = res.detail.value.video_url;
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var resouce_size = res.detail.value.video_size;
    var duration = res.detail.value.duration;
    var play_times = res.detail.value.play_times;
    var forscreen_id = (new Date()).valueOf();
    var filename = (new Date()).valueOf();
    var is_pub_hotelinfo = res.detail.value.is_pub_hotelinfo;
    var is_share = res.detail.value.is_share;
    var res_sup_time = (new Date()).valueOf();
    
    wx.request({
      url: api_url+'/smallapp21/User/isForscreenIng',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: { box_mac: box_mac },
      success: function (res) {

        var is_forscreen = res.data.result.is_forscreen;
        if (is_forscreen == 1) {
          uma.trackEvent('break_popbreakwindow',{'open_id':openid,'box_mac':box_mac})
          wx.showModal({
            title: '确认要打断投屏',
            content: '当前电视正在进行投屏,继续投屏有可能打断当前投屏中的内容.',
            success: function (res) {
              if (res.confirm) {

                uploadVedio(video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times,resouce_size);
                uma.trackEvent('break_confirbreak',{'open_id':openid,'box_mac':box_mac,'status':1})
              } else {
                that.setData({
                  is_btn_disabel:false,
                  updateStatus:0
                })
                uma.trackEvent('break_confirbreak',{'open_id':openid,'box_mac':box_mac,'status':0})
              }
            }
          })
        } else {

          uploadVedio(video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times,resouce_size);
        }
      }
    })
    function uploadVedio(video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times,resouce_size) {

      wx.request({
        url: api_url+'/Smallapp/Index/getOssParams',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (rest) {
          policy = rest.data.policy;
          signature = rest.data.signature;
          uploadOssVedio(policy, signature, video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times,resouce_size);
        }
      });
    }
    function uploadOssVedio(policy, signature, video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times,resouce_size) {

      var filename = video_url;          //视频url

      //var filename_img = video.thumbTempFilePath; //视频封面图
      //console.log(video);
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      var postf_t = filename.substring(index1, index2);//后缀名
      var timestamp = (new Date()).valueOf();

      var upload_task = wx.uploadFile({
        url: oss_upload_url,
        filePath: filename,
        name: 'file',

        formData: {
          Bucket: "redian-produce",
          name: filename,
          key: "forscreen/resource/" + timestamp + postf_t,
          policy: policy,
          OSSAccessKeyId: app.globalData.oss_access_key_id,
          sucess_action_status: "200",
          signature: signature

        },
        success: function (res) {
          that.setData({
            showVedio: false,
            oss_video_url: app.globalData.oss_url+"/forscreen/resource/" + timestamp + postf_t,
            upload_vedio_temp: app.globalData.oss_url+"/forscreen/resource/" + timestamp + postf_t,
            is_view_control: true,
            hiddens: true,
          })
          var res_eup_time = (new Date()).valueOf();
          wx.request({
            url: api_url+'/Netty/Index/pushnetty',
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            data: {
              box_mac: box_mac,
              msg: '{"action":42, "url": "forscreen/resource/' + timestamp + postf_t + '", "filename":"' + timestamp + postf_t + '","openid":"' + openid + '","resource_type":2,"video_id":"' + timestamp + '","forscreen_id":"' + res_eup_time + '","play_times":' + play_times + ',"res_sup_time":"'+res_sup_time+'","res_eup_time":"'+res_eup_time+'","resource_size":'+resouce_size+'}',
            },
            success: function (result) {

            },
          });
          wx.request({
            url: api_v_url+'/ForscreenLog/recordForScreenPics',
            header: {
              'content-type': 'application/json'
            },
            data: {
              openid: openid,
              box_mac: box_mac,
              action: 2,
              resource_type: 2,
              mobile_brand: mobile_brand,
              mobile_model: mobile_model,
              forscreen_char: forscreen_char,

              imgs: '["forscreen/resource/' + timestamp + postf_t + '"]',
              resource_id: timestamp,
              res_sup_time: res_sup_time,
              res_eup_time: res_eup_time,
              resource_size: res.totalBytesSent,
              is_pub_hotelinfo: is_pub_hotelinfo,
              is_share: is_share,
              forscreen_id: res_eup_time,
              duration: duration,
              small_app_id: app.globalData.small_app_id,
            },
            success: function (ret) {
              
            }
          });
        }
      });
      upload_task.onProgressUpdate((res) => {
        //console.log(res);

        that.setData({
          vedio_percent: res.progress
        });
        if (res.progress == 100) {
          
          //console.log(res_eup_time);
          
          
        }

      });
      
      that.setData({

        updateStatus: 4,
        upload_vedio_temp: video_url,
        filename: "forscreen/resource/" + timestamp + postf_t,
        resouce_size: resouce_size,
        duration: duration,
        hiddens: true,
      })
    }
    
    //数据埋点-点击投屏
    uma.trackEvent('forscreen_forvideo_clickforscreen',{'open_id':openid,'box_mac':box_mac}) 
  },
  playTimesChange: function (res) {
    var that = this;
    var play_times = res.detail.value;
    that.setData({
      play_times: play_times
    })
    //数据埋点-切换播放时间
    uma.trackEvent('forscreen_forvideo_changefortime',{'open_id':openid,'box_mac':box_mac,'timethype':play_times})
  },
  //重新选择视频
  chooseVedio(e) {
    var that = this;
    //console.log(res);
    box_mac = e.currentTarget.dataset.box_mac;
    openid = e.currentTarget.dataset.openid;
    that.setData({
      play_times: 0,
      is_btn_disabel: false,
      item: that.data.item,
      box_mac: box_mac,
      openid: openid
    })
    var forscreen_id = (new Date()).valueOf();
    var filename = (new Date()).valueOf();
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var video_url = res.tempFilePath
        that.setData({
          updateStatus: 0,
          upload_vedio_temp: res.tempFilePath,
          is_btn_disabel: false,
          openid: openid,
          box_mac: box_mac,
          duration: res.duration,
          video_size: res.size,
          is_forscreen: 1
        })
        uma.trackEvent('forscreen_forvideo_choosevideo',{'open_id':openid,'box_mac':box_mac,'status':1,'is_rechoose':1})
      },fail:function(res){
        uma.trackEvent('forscreen_forvideo_choosevideo',{'open_id':openid,'box_mac':box_mac,'status':0,'is_rechoose':1})
      }
    })
    
    //数据埋点-重选视频
    
  },
  //退出投屏
  exitForscreend(res) {
    var that = this;
    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.box_mac;
    wx.request({
      url: api_url+'/Netty/Index/pushnetty',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{ "action": 3,"openid":"' + openid + '"}',
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，退出失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
    
    //数据埋点-退出投屏
    uma.trackEvent('forscreen_forvideo_exitforscreen',{'open_id':openid,'box_mac':box_mac})
  },
  goRelief:function(res){
    //数据埋点-视频投屏点击免责声明
    var user_info = wx.getStorageSync(cache_key+'userinfo');
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})