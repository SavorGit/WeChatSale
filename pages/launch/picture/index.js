// pages/launch/picture/index.js
const app = getApp();
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var img_lenth = 0;
var openid;
var box_mac;
var forscreen_char = '';
var upimgs = [];
var policy;
var signature;
var postf;   //上传文件扩展名
var post_imgs = [];
var tmp_percent = [];
var pic_show_cur = [];
var api_url  = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var angle = 0;
var netty_push_info ;
var netty_push_img ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    play_times:0,
    updateStatus:0,
    is_btn_disabel: false,
    angle: 0 //单图旋转角度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    var that = this;
    netty_push_info = {}
    netty_push_img  = []
    wx.hideShareMenu();
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var link_box_info = wx.getStorageSync(cache_key + "link_box_info");
    
    openid = user_info.openid;
    box_mac = link_box_info.box_mac;
    that.setData({
      box_mac: box_mac,
      openid: openid,
      is_btn_disabel: true,
    })

    wx.request({
      url: api_v_url + '/playtime/getTimeList',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rts) {
        that.setData({
          item: rts.data.result,
        })
      }

    })
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {


        var img_len = res.tempFilePaths.length;
        var tmp_imgs = [];
        for (var i = 0; i < img_len; i++) {
          tmp_imgs[i] = { "tmp_img": res.tempFilePaths[i], "resource_size": res.tempFiles[i].size };
        }
        that.setData({
          up_imgs: tmp_imgs,
          img_lenth: img_len,
          is_btn_disabel: false,

        })
        uma.trackEvent('forscreen_forimg_chooseimg',{'open_id':openid,'box_mac':box_mac,'status':1,'img_num':img_len,'is_rechoose':0})
      },
      fail: function (e) {
        wx.navigateBack({
          delta: 1,
        })
        uma.trackEvent('forscreen_forimg_chooseimg',{'open_id':openid,'box_mac':box_mac,'status':0,'img_num':0,'is_rechoose':0})
      }
    })
    uma.trackEvent('forscreen_forimg_onpageshow',{'open_id':openid,'box_mac':box_mac})
  },
  playTimesChange:function(res){
    var that = this;
    var play_times = res.detail.value;
    that.setData({
      play_times:play_times
    })
    //数据埋点-切换播放时间
    uma.trackEvent('forscreen_forimg_changefortime',{'open_id':openid,'box_mac':box_mac,'timetype': play_times})

  },
  up_forscreen(e) {//多张图片投屏开始(不分享到发现)
    var that = this;
    netty_push_info={};
    netty_push_img = [];
    that.setData({
      is_btn_disabel: true,
      hiddens: true,
    })
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var img_lenth = e.detail.value.img_lenth;
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var forscreen_char = e.detail.value.forscreen_char;
    forscreen_char = forscreen_char.split('\n').join('');
    var play_times = e.detail.value.play_times;
    var upimgs = [];
    var is_pub_hotelinfo = e.detail.value.is_pub_hotelinfo;   //是否公开显示餐厅信息
    var is_share = e.detail.value.is_share;
    if (e.detail.value.upimgs0 != '' && e.detail.value.upimgs0 != undefined) {
      upimgs[0] = { 'img_url': e.detail.value.upimgs0, 'img_size': e.detail.value.upimgsize0 };
    }
    if (e.detail.value.upimgs1 != '' && e.detail.value.upimgs1 != undefined) {
      upimgs[1] = { 'img_url': e.detail.value.upimgs1, 'img_size': e.detail.value.upimgsize1 };
    }
    if (e.detail.value.upimgs2 != '' && e.detail.value.upimgs2 != undefined) {
      upimgs[2] = { 'img_url': e.detail.value.upimgs2, 'img_size': e.detail.value.upimgsize2 };
    }
    if (e.detail.value.upimgs3 != '' && e.detail.value.upimgs3 != undefined) {
      upimgs[3] = { 'img_url': e.detail.value.upimgs3, 'img_size': e.detail.value.upimgsize3 };
    }
    if (e.detail.value.upimgs4 != '' && e.detail.value.upimgs4 != undefined) {
      upimgs[4] = { 'img_url': e.detail.value.upimgs4, 'img_size': e.detail.value.upimgsize4 };
    }
    if (e.detail.value.upimgs5 != '' && e.detail.value.upimgs5 != undefined) {
      upimgs[5] = { 'img_url': e.detail.value.upimgs5, 'img_size': e.detail.value.upimgsize5 };
    }
    if (e.detail.value.upimgs6 != '' && e.detail.value.upimgs6 != undefined) {
      upimgs[6] = { 'img_url': e.detail.value.upimgs6, 'img_size': e.detail.value.upimgsize6 };
    }
    var public_text = '';
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

                wx.request({
                  url: api_url+'/Smallapp/Index/getOssParams',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  success: function (rest) {

                    policy = rest.data.policy;
                    signature = rest.data.signature;
                    uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_lenth, forscreen_char, avatarUrl, nickName, public_text, play_times);
                    
                  }
                });
                uma.trackEvent('break_confirbreak',{'open_id':openid,'box_mac':box_mac,'status':1})
              } else {
                that.setData({
                  is_btn_disabel:false,
                })
                uma.trackEvent('break_confirbreak',{'open_id':openid,'box_mac':box_mac,'status':0})
              }
            }
          })
        } else {
          wx.request({
            url: api_url+'/Smallapp/Index/getOssParams',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (rest) {

              policy = rest.data.policy;
              signature = rest.data.signature;
              uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_lenth, forscreen_char, avatarUrl, nickName, public_text, play_times);
            }
          });

        }
      }
    })


    function uploadOssNew(policy, signature, img_url, box_mac, openid, timestamp, flag, img_len, forscreen_char, forscreen_id, res_sup_time, avatarUrl, nickName, public_text, play_times,resource_size) {

      var filename = img_url;
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      var order = flag + 1;
      var postf_t = filename.substring(index1, index2);//后缀名
      var postf_w = filename.substring(index1 + 1, index2);//后缀名
      var fg = 0;
      var upload_task = wx.uploadFile({
        url: oss_upload_url,
        filePath: img_url,
        name: 'file',
        header: {
          'Content-Type': 'image/' + postf_w
        },
        formData: {
          Bucket: "redian-produce",
          name: img_url,
          key: "forscreen/resource/" + timestamp + postf_t,
          policy: policy,
          OSSAccessKeyId: app.globalData.oss_access_key_id,
          sucess_action_status: "200",
          signature: signature

        },

        success: function (res) {
          var netty_tmp = {};
          netty_tmp.url = "forscreen/resource/" + timestamp + postf_t;
          netty_tmp.filename = filename = timestamp + postf_t ;
          netty_tmp.order    = flag;
          netty_tmp.img_id   = timestamp;
          netty_tmp.resource_size = resource_size
          
          //netty_push_img[] = netty_tmp;
          netty_push_img.push(netty_tmp);
          if (netty_push_img.length == img_len) {
            netty_push_info.img_list = netty_push_img;
            netty_push_info.res_eup_time = (new Date()).valueOf();
            netty_push_info = JSON.stringify(netty_push_info);
            wx.request({
              url: api_url+'/Netty/Index/pushnetty',
              headers: {
                'Content-Type': 'application/json'
              },
              method: "POST",
              data: {
                box_mac: box_mac,
                msg: netty_push_info,
              },
              success: function (result) {
  
                that.setData({
                  updateStatus: 4,
  
                  percent: 0
                })
              },
            });
          }
        },
        complete: function (es) {
          tmp_percent[flag] = { "percent": 100 };
          that.setData({
            tmp_percent: tmp_percent
          })
        },
        fail: function ({ errMsg }) {
          console.log('uploadImage fail,errMsg is', errMsg)
        },
      });
      upload_task.onProgressUpdate((res) => {
        tmp_percent[flag] = { "percent": res.progress };
        //console.log(res.progress);
        that.setData({
          tmp_percent: tmp_percent
        });
        if (res.progress == 100) {
          var res_eup_time = (new Date()).valueOf();
          
          
          wx.request({
            url: api_v_url+'/ForscreenLog/recordForScreenPics',
            header: {
              'content-type': 'application/json'
            },
            data: {
              forscreen_id: forscreen_id,
              openid: openid,
              box_mac: box_mac,
              action: 4,
              mobile_brand: mobile_brand,
              mobile_model: mobile_model,
              forscreen_char: forscreen_char,
              public_text: public_text,
              imgs: '["forscreen/resource/' + timestamp + postf_t + '"]',
              resource_id: timestamp,
              res_sup_time: res_sup_time,
              res_eup_time: res_eup_time,
              resource_size: res.totalBytesSent,
              is_pub_hotelinfo: is_pub_hotelinfo,
              is_share: is_share,
              small_app_id: app.globalData.small_app_id,
            },
            success: function (ret) {
              

            }
          });

        }

      })

    }
    function uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_len, forscreen_char, avatarUrl, nickName, public_text, play_times) {
      //console.log(img_len);
      //var tmp_imgs = [];
      var filename_arr = [];
      var forscreen_id = (new Date()).valueOf();
      netty_push_info.forscreen_id = forscreen_id;
      netty_push_info.action = 44;
      netty_push_info.resource_type = 2;
      netty_push_info.openid = openid;
      netty_push_info.forscreen_char = forscreen_char;
      netty_push_info.avatarUrl = avatarUrl;
      netty_push_info.nickName  = nickName;
      netty_push_info.play_times = play_times
      netty_push_info.res_sup_time = (new Date()).valueOf();
      for (var i = 0; i < img_len; i++) {
        var res_sup_time = (new Date()).valueOf();
        
        var filename = upimgs[i].img_url;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var timestamp = (new Date()).valueOf();
        postf = filename.substring(index1, index2);//后缀名
        var resource_size = upimgs[i].img_size
        console.log('dddddddddddd'+resource_size)
        post_imgs[i] = { 'oss_addr': app.globalData.oss_url + "/forscreen/resource/" + timestamp + postf, 'forscreen_url': "forscreen/resource/" + timestamp + postf, 'filename': timestamp + postf,'img_id':timestamp,'resource_size':resource_size };
        filename_arr[i] = timestamp + postf;
        /*tmp_imgs[i] = { "oss_img": post_imgs[i] };
        that.setData({
          tmp_imgs: tmp_imgs
        });*/
        uploadOssNew(policy, signature, filename, box_mac, openid, timestamp, i, img_len, forscreen_char, forscreen_id, res_sup_time, avatarUrl, nickName, public_text, play_times,resource_size);
      }
      that.setData({
        post_imgs: post_imgs,
        up_imgs: upimgs,
        filename_arr: filename_arr,
        is_upload: 1,
        forscreen_char: forscreen_char,
        hiddens: true,
        updateStatus: 4,
      })
    }
    //数据埋点-图片投屏
    if (forscreen_char!=''){
      var is_forscreen_char =1;
    }else {
      var is_forscreen_char = 0;
    }


    uma.trackEvent('forscreen_forimg_clickforscreen',{'open_id':openid,'box_mac':box_mac,'img_num':upimgs.length,'forscreenchar':is_forscreen_char,'play_times':play_times})
    
  }, //多张图片投屏结束(不分享到发现)
  up_single_pic(res) {//指定单张图片投屏开始
    
    var that = this;
    var post_imgs = that.data.post_imgs;

    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.boxmac;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var filename = res.currentTarget.dataset.filename;
    var choose_key = res.currentTarget.dataset.choose_key;
    var forscreen_img = 'forscreen/resource/'+filename;
    var img_id = post_imgs[choose_key].img_id;
    var resource_size = post_imgs[choose_key].resource_size;
    that.setData({
      choose_key: choose_key
    })

    var params = {};
    params.forscreen_img = forscreen_img;
    params.filename = filename;
    params.play_times = res.target.dataset.play_times;
    params.forscreen_char = res.currentTarget.dataset.forscreen_char.split('\n').join('');
    params.rotate = 0;
    params.angle  = angle;
    params.img_id = img_id;
    params.resource_size = resource_size;


    that.forOnePic(params);

    
    //数据埋点-单张图片投屏
    uma.trackEvent('forscreen_forimg_forimgsingle',{'open_id':openid,'box_mac':box_mac})
    
  },//指定单张图片投屏结束
  chooseImage(res) {//重新选择照片开始
    var that = this;
    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.box_mac;
    that.setData({
      box_mac: box_mac,
      openid: openid,
      is_btn_disabel: true,
    })
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        angle = 0;
        that.setData({
          up_imgs: [],
        })
        var img_len = res.tempFilePaths.length;

        var tmp_imgs = [];
        for (var i = 0; i < img_len; i++) {
          tmp_imgs[i] = { "tmp_img": res.tempFilePaths[i], "resource_size": res.tempFiles[i].size };
        }
        that.setData({
          up_imgs: tmp_imgs,
          img_lenth: img_len,
          updateStatus: 0,
          is_btn_disabel: false,
          forscreen_char: ''
        })
        uma.trackEvent('forscreen_forimg_chooseimg',{'open_id':openid,'box_mac':box_mac,'status':1,'img_num':img_len,'is_rechoose':1})
      },fail:function(res){
        uma.trackEvent('forscreen_forimg_chooseimg',{'open_id':openid,'box_mac':box_mac,'status':0,'img_num':0,'is_rechoose':1})
      }
    })
    //数据埋点-重选图片
    
  },//重新选择照片结束
  exitForscreen(res) {
    var that = this;
    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.box_mac;
    utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
      box_mac: box_mac,
      msg: '{ "action": 3,"openid":"' + openid + '"}',
    }, (data, headers, cookies, errMsg, statusCode) => {
      wx.navigateBack({
        delta: 1
      })
      wx.showToast({
        title: '退出成功',
        icon: 'none',
        duration: 2000
      });
    })
    //数据埋点-退出投屏
    uma.trackEvent('forscreen_forimg_exitforscreen',{'open_id':openid,'box_mac':box_mac})
  },//退出投屏结束
  goRelief:function(res){
    //数据埋点-跳转到免责声明
  },
  /**
   * 旋转图片
   */
  rotateImg:function(e){
    var that = this;
    var post_imgs = e.currentTarget.dataset.post_imgs;
    var oss_addr  = post_imgs[0].oss_addr;
    var forscreen_url = post_imgs[0].forscreen_url;
    var filename  = post_imgs[0].filename;
    var up_imgs = that.data.up_imgs;
    var play_times = e.currentTarget.dataset.play_times;
    var forscreen_char = e.currentTarget.dataset.forscreen_char;
    var resource_size = post_imgs[0].resource_size;
    forscreen_char = forscreen_char.split('\n').join('');


    angle +=90;
    if(angle==360 || angle>360){
      angle = 0;
    }

    wx.showLoading({
      title: '图片旋转中...',
      mask:true,
    })
    wx.getImageInfo({
      src: oss_addr,
      success:function(res){
        var width = res.width;
        var height = res.height;
        wx.hideLoading();
        if (height > app.globalData.oss_xz_limit || width > app.globalData.oss_xz_limit) {
          app.showToast('图片宽高过大,不可旋转');
          angle -=90;
          uma.trackEvent('forscreen_forimg_rotateimg',{'open_id':openid,'box_mac':box_mac,'status':0})
        }else {

          up_imgs[0].img_url = oss_addr + '?x-oss-process=image/rotate,' + angle;
          //forscreen_url += '?x-oss-process=image/rotate,' + angle;

          that.setData({
            up_imgs: up_imgs
          })
          //推送盒子
          var params = {};
          params.forscreen_img = forscreen_url;
          params.filename = filename;
          params.play_times = play_times;
          params.forscreen_char = forscreen_char;
          params.angle  = angle;
          params.is_rotate = 1;
          params.resource_size = resource_size;

          that.forOnePic(params);
          uma.trackEvent('forscreen_forimg_rotateimg',{'open_id':openid,'box_mac':box_mac,'status':1})
        }
      },fail:function(res){
        wx.hideLoading();
        app.showToast('旋转失败');
        uma.trackEvent('forscreen_forimg_rotateimg',{'open_id':openid,'box_mac':box_mac,'status':0})
      }
    })
    

  },
  forOnePic:function(params){

    var forscreen_img = params.forscreen_img;
    var filename      = params.filename ;
    var play_times    = params.play_times;
    var forscreen_char= params.forscreen_char;
    var forscreen_id  = (new Date()).valueOf();
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var avatarUrl = user_info.avatarUrl;
    var nickName  = user_info.nickName;
    var is_rotate = params.is_rotate;
    var angle = params.angle;
    var img_id = params.img_id
    var resource_size = params.resource_size;
    if (is_rotate==1){
      utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
        box_mac: box_mac,
        msg: '{"action":8,"filename":"' + filename + '","rotation":"' + angle + '","url":"' + forscreen_img + '","openid":"' + user_info.openid+'","forscreen_id":'+forscreen_id+',"resource_size":'+resource_size+'}',
      }, (data, headers, cookies, errMsg, statusCode) => {
        app.showToast('投屏成功');
        utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
          forscreen_id: forscreen_id,
          openid: openid,
          box_mac: box_mac,
          action: 2,
          resource_type: 1,
          mobile_brand: app.globalData.mobile_brand,
          mobile_model: app.globalData.mobile_model,
          imgs: '["' + forscreen_img + '"]',
          small_app_id: app.globalData.small_app_id,
        }, (data, headers, cookies, errMsg, statusCode) => {
          
        })
      })
    }else {
      var push_img = [];
      var push_info = {};
      var tmp_info = {};
      tmp_info.url = forscreen_img;
      tmp_info.filename = filename;
      tmp_info.img_id   = img_id;
      tmp_info.angle = angle;
      tmp_info.resource_size = resource_size
      push_img.push(tmp_info);

      push_info.forscreen_id = forscreen_id;
      push_info.action = 44;
      push_info.resource_type = 2;
      push_info.openid = openid;
      push_info.forscreen_char = forscreen_char;
      push_info.avatarUrl = avatarUrl;
      push_info.nickName  = nickName;
      push_info.play_times = play_times;
      push_info.img_list = push_img;
      push_info = JSON.stringify(push_info);


      utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
        box_mac: box_mac,
        msg: push_info,
      }, (data, headers, cookies, errMsg, statusCode) => {
        app.showToast('投屏成功');
        utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
          forscreen_id: forscreen_id,
          openid: openid,
          box_mac: box_mac,
          action: 2,
          resource_type: 1,
          mobile_brand: app.globalData.mobile_brand,
          mobile_model: app.globalData.mobile_model,
          imgs: '["' + forscreen_img + '"]',
          small_app_id: app.globalData.small_app_id,
        }, (data, headers, cookies, errMsg, statusCode) => {

        })
      })
    }

    
    
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