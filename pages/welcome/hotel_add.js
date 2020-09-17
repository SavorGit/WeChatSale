// pages/welcome/hotel_add.js
const utils = require('../../utils/util.js')
var mta = require('../../utils/mta_analysis.js')
const app = getApp()
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var welType = 0;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_access_key_id = app.globalData.oss_access_key_id;

var welcome_info = []; //欢迎词数据
var storInfo = {
  'step': 0,
  'welcome_info': []
}; //用户操作数据
//const innerAudioContext = wx.createInnerAudioContext('music');
var angle = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo: app.SystemInfo,
    base_info: {
      'step': 0, //操作步骤 
      'type': 0, //背景图类型
      'img_info': {
        'is_choose_img': 0,
        'choose_img_url': '',
        'oss_img_url': '',
        'forscreen_url': '',
        'angle': 0,
        'backgroundimg_id': ''
      },

      'word_info': {
        'welcome_word': ''
      }, //欢迎词
      'word_size_info': {
        'word_size': '',
        'word_size_id': 0
      }, //欢迎词字号
      'word_color_info': {
        'color': '',
        'color_id': 0
      }, //欢迎词颜色
      'word_type': {
        'type': 0,
        'name': '',
        'type_str': ''
      },
      'music_info': {
        'music_name': '',
        'music_id': 0,
        'oss_addr': ''
      }, //背景音乐
      'play_info': {
        'play_type': 1,
        'play_date': '',
        'timing': '',
        'box_mac': ''
      } //播放设置
    },
    wordsize_list: [], //字号列表
    color_list: [], //颜色列表
    music_list: [], //音乐列表
    box_list: [], //包间列表
    play_index: 0, //播放音乐索引
    play_music_url: '', //播放音乐url
    boxIndex: 0,
    start_date: app.getNowFormatDate(),
    wordtype_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    if (user_info.hotel_id == -1) {
      hotel_id = user_info.select_hotel_id;
    } else {
      hotel_id = user_info.hotel_id;
    }
    //背景图分类列表
    utils.PostRequest(api_v_url + '/welcome/categorylist', {

    }, (data, headers, cookies, errMsg, statusCode) => {
      //console.log(data.result.category_list);
      that.setData({
        categoryList: data.result.category_list
      })
    });
    /**
     * 获取配置
     */
    utils.PostRequest(api_v_url + '/welcome/config', {

    }, (data, headers, cookies, errMsg, statusCode) => {
      //console.log(data.result)
      var base_info = that.data.base_info;
      var wordsize = data.result.wordsize;
      var color = data.result.color;
      var music = data.result.music
      var wordtype = data.result.font_namelist
      var wordtype_list = data.result.font
      if (typeof (wordtype_list) == 'object' && wordtype_list instanceof Array) {
        for (let fontIndex in wordtype_list) {
          let font = wordtype_list[fontIndex];
          if (typeof (font.name) != 'string' || typeof (font.oss_addr) != 'string') {
            continue;
          }
          wx.loadFontFace({
            family: font.name,
            source: 'url("' + font.oss_addr + '")',
            // success: console.log
          });
        }
      }
      base_info.word_size_info.word_size = wordsize[0].wordsize;
      base_info.word_size_info.word_size_id = wordsize[0].id;
      base_info.word_color_info.color = color[0].color;
      base_info.word_color_info.color_id = color[0].id;
      base_info.word_type.type = wordtype_list[0].id
      base_info.word_type.name = wordtype_list[0].name
      console.log(base_info);
      that.setData({
        base_info: base_info,
        wordsize_list: wordsize,
        color_list: color,
        music_list: music,
        wordtype: wordtype,
        wordtype_list: wordtype_list
      })
    })
    //包间列表
    utils.PostRequest(api_v_url + '/room/getWelcomeBoxlist', {
      hotel_id: hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      /*that.setData({
        box_list:data.result.box_list
      })*/
      //console.log(data.result.box_name_list);
      that.setData({
        objectBoxArray: data.result.box_name_list,
        box_list: data.result.box_list
      })
    })

    // wx.createAudioContext('music').play();
  },
  /**
   * 第一步：切换欢迎词类型 0:自主上传  1：生日宴 2：寿宴 3：婚宴 4：朋友聚会 
   */
  switchWelType: function (e) {
    var that = this;
    var base_info = that.data.base_info;
    var category_id = e.currentTarget.dataset.category_id;
    //welType = type;
    //console.log(category_id);
    if (category_id != 0) {
      utils.PostRequest(api_v_url + '/welcome/imglist', {
        category_id: category_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        base_info.type = category_id;
        that.setData({
          imglist: data.result,
          base_info: base_info
        })
      });
      mta.Event.stat('switchBackImg', {
        'categoryid': category_id
      })
    } else {
      base_info.type = 0;
      that.setData({
        base_info: base_info,
      })
    }
  },
  /**
   * 第一步：相册选择照片
   */
  chooseImage: function (e) {
    var that = this;
    var base_info = that.data.base_info;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res);

        var tmp_file = res.tempFilePaths[0];
        var index1 = tmp_file.lastIndexOf(".");
        var index2 = tmp_file.length;
        var postf_t = tmp_file.substring(index1, index2); //后缀名
        var postf_w = tmp_file.substring(index1 + 1, index2); //后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img_url = app.globalData.oss_url + "/forscreen/resource/" + timestamp + postf_t;
        var oss_key = "forscreen/resource/" + timestamp + postf_t;

        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          success: function (res) {
            var policy = res.data.policy;
            var signature = res.data.signature;

            wx.uploadFile({
              url: oss_upload_url,
              filePath: tmp_file,
              name: 'file',
              header: {
                'Content-Type': 'image/' + postf_w
              },
              formData: {
                Bucket: app.globalData.oss_bucket,
                name: tmp_file,
                key: oss_key,
                policy: policy,
                OSSAccessKeyId: oss_access_key_id,
                sucess_action_status: "200",
                signature: signature

              },
              success: function (res) {
                angle = 0;
                base_info.img_info.is_choose_img = 1;
                base_info.img_info.choose_img_url = oss_img_url;
                base_info.img_info.oss_img_url = oss_img_url;
                base_info.img_info.forscreen_url = oss_key;
                base_info.img_info.backgroundimg_id = '';
                //console.log(base_info);
                that.setData({
                  base_info: base_info
                })
              },
              fail: function ({
                errMsg
              }) {
                wx.showToast({
                  title: '上传图片失败',
                  icon: 'none',
                  duration: 2000,
                })
              },
            });
          }
        })
        mta.Event.stat('chooseWelcomeImage', {
          'choosestatus': 1
        })
      },
      fail(res) { //取消选择照片
        console.log(res);
        mta.Event.stat('chooseWelcomeImage', {
          'choosestatus': 0
        })
      }
    })
  },
  /**
   * 第一步：旋转自主上传图片
   */
  turnImg: function (e) {
    var that = this;
    var base_info = that.data.base_info;
    //var angle = e.currentTarget.dataset.angle;
    angle += 90;
    var pms = ''
    //console.log()
    if (angle == 360 || angle > 360) {
      angle = 0;
    }
    wx.showLoading({
      title: '图片旋转中...',
      mask: true,
    })
    wx.getImageInfo({
      src: base_info.img_info.oss_img_url,
      success: function (res) {
        wx.hideLoading();
        var width = res.width;
        var height = res.height;
        if (height > app.globalData.oss_xz_limit || width > app.globalData.oss_xz_limit) {
          app.showToast('图片宽高过大,不可旋转');
        } else {
          var choose_img_url = base_info.img_info.oss_img_url + '?x-oss-process=image/rotate,' + angle;
          base_info.img_info.choose_img_url = choose_img_url;
          base_info.img_info.angle = angle;
          that.setData({
            base_info: base_info
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
      }
    })


  },
  /**
   *第一步： 选择背景图片
   */
  selectBackImg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var oss_addr = e.currentTarget.dataset.oss_addr;
    var forscreen_url = e.currentTarget.dataset.forscreen_url;
    var base_info = that.data.base_info;
    base_info.img_info.backgroundimg_id = id;
    base_info.img_info.choose_img_url = oss_addr;
    base_info.img_info.is_choose_img = 0;
    base_info.img_info.forscreen_url = forscreen_url;
    that.setData({
      base_info: base_info,
    })
    //mta.Event.stat('selectBackImg', { 'imgid': id })
  },
  /**
   * 下一步
   */
  nextOption: function (e) {
    var that = this;
    //console.log(e);
    //return false;
    //var step = e.currentTarget.dataset.step;
    var base_info = that.data.base_info
    var rec_step = base_info.step;
    if (base_info.step == 0) { //选择背景结束

      if (base_info.type == 0) { //自主上传
        var choose_img_url = e.detail.value.choose_img_url;
        var oss_img_url = e.detail.value.oss_img_url;
        var angle = e.detail.value.angle;
        if (base_info.img_info.choose_img_url == '') {
          app.showToast('请上传背景图片');
          return false;
        } else {
          base_info.img_info.is_choose_img = 1;
          base_info.img_info.choose_img_url = choose_img_url;
          base_info.img_info.oss_img_url = oss_img_url;
          base_info.img_info.angle = angle;
          base_info.step = 1;
          that.setData({
            base_info: base_info,
          })
        }
      } else { //选择背景图
        var backgroundimg_id = e.detail.value.backgroundimg_id
        if (backgroundimg_id == '') {
          app.showToast('请选择背景图片');

          return false;
        } else {
          base_info.img_info.backgroundimg_id = backgroundimg_id;
          base_info.step = 1;
          that.setData({
            base_info: base_info,
          })
        }
      }

    } else if (base_info.step == 1) { //添加文字结束
      var content = base_info.word_info.welcome_word;
      var wordsize_id = base_info.word_info.word_size_id;
      var color_id = base_info.word_color_info.color_id;
      var word_color = base_info.word_color_info.color;
      /*if(content==''){
        app.showToast('请输入欢迎词');
        return false;
      }*/
      if (wordsize_id == '') {
        app.showToast('请选择字号');
        return false;
      }
      if (color_id == '') {
        app.showToast('请选择字体颜色');
        return false;
      }
      base_info.step = 2;
      that.setData({
        base_info: base_info
      })

    } else if (base_info.step == 2) { //添加音乐结束

      base_info.step = 3;
      that.setData({
        base_info: base_info,
        play_index: 0,
      })
      //innerAudioContext.pause();
      wx.createAudioContext('music').pause();
    } else if (base_info.step == 3) { //完成
      var play_type = base_info.play_info.play_type;
      var play_date = base_info.play_info.play_date;
      var timing = base_info.play_info.timing;
      var play_box_mac = base_info.play_info.box_mac;
      console.log(play_box_mac);
      if (play_type == 2) { //1、立即播放 2、定时播放
        if (play_date == '') {
          app.showToast('请选择播放日期');
          return false;
        }
        if (timing == '') {
          app.showToast('请选择播放时间');
          return false;
        }
      }
      if (play_box_mac.toString() == '') {
        app.showToast('请选择包间电视');
        return false;
      }
      var forscreen_url = base_info.img_info.forscreen_url
      //console.log(base_info);
      if (base_info.img_info.is_choose_img == 0) {
        base_info.img_info.forscreen_url = '';
      }
      wx.showModal({
        title: '确定要完成吗？',
        //content: '当前电视正在进行投屏,继续投屏有可能打断当前投屏中的内容.',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              completeBtn: true,
            })
            utils.PostRequest(api_v_url + '/welcome/addwelcome', {
              backgroundimg_id: base_info.img_info.backgroundimg_id,
              box_mac: play_box_mac,
              color_id: base_info.word_color_info.color_id,
              content: base_info.word_info.welcome_word,
              image: base_info.img_info.forscreen_url,
              music_id: base_info.music_info.music_id,
              openid: openid,
              play_date: play_date,
              play_type: play_type,
              rotate: base_info.img_info.angle,
              timing: timing,
              wordsize_id: base_info.word_size_info.word_size_id,
              hotel_id: hotel_id,
              font_id: base_info.word_type.type
            }, (data, headers, cookies, errMsg, statusCode) => {
              var forscreen_id = (new Date()).valueOf();
              
              
              wx.redirectTo({
                url: '/pages/welcome/index',
                success: function (e) {
                  that.setData({
                    completeBtn: false,
                  })
                }

              })
              app.showToast('新建欢迎词成功', 2000, 'success', true);



              var box_list = that.data.box_list;
              if(play_box_mac == 2){
                for(let i in box_list){
                  if(box_list[i].box_mac !='' && box_list[i].box_mac!=2){
                    utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
                      forscreen_id: forscreen_id,
                      openid: openid,
                      box_mac: box_list[i].box_mac,
                      action: 41,
                      mobile_brand: app.globalData.mobile_brand,
                      mobile_model: app.globalData.mobile_model,
                      forscreen_char: base_info.word_info.welcome_word,
                      public_text: '',
                      imgs: '["' + forscreen_url + '"]',
                      resource_id: forscreen_id,
                      res_sup_time: 0,
                      res_eup_time: 0,
                      resource_size: 0,
                      is_pub_hotelinfo: 0,
                      is_share: 0,
                      small_app_id: app.globalData.small_app_id,
      
                    }, (data, headers, cookies, errMsg, statusCode) => {
      
                    })
                  }
                  
                }
              }else {
                utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
                  forscreen_id: forscreen_id,
                  openid: openid,
                  box_mac: play_box_mac,
                  action: 41,
                  mobile_brand: app.globalData.mobile_brand,
                  mobile_model: app.globalData.mobile_model,
                  forscreen_char: base_info.word_info.welcome_word,
                  public_text: '',
                  imgs: '["' + forscreen_url + '"]',
                  resource_id: forscreen_id,
                  res_sup_time: 0,
                  res_eup_time: 0,
                  resource_size: 0,
                  is_pub_hotelinfo: 0,
                  is_share: 0,
                  small_app_id: app.globalData.small_app_id,
  
                }, (data, headers, cookies, errMsg, statusCode) => {
  
                })
              }
              mta.Event.stat('welcomeComplete', {
                'completestatus': 1,
                'imgtype': base_info.img_info.is_choose_img,
                'musicid': base_info.music_info.music_id,
                'playtype': base_info.play_info.play_type,
                'wordcolorid': base_info.word_color_info.color_id,
                'wordsizeid': base_info.word_size_info.word_size_id
              })
            }, res => {
              that.setData({
                completeBtn: false,
              })
              app.showToast('新建欢迎词失败');
              mta.Event.stat('welcomeComplete', {
                'completestatus': 0,
                'imgtype': base_info.img_info.is_choose_img,
                'musicid': base_info.music_info.music_id,
                'playtype': base_info.play_info.play_type,
                'wordcolorid': base_info.word_color_info.color_id,
                'wordsizeid': base_info.word_size_info.word_size_id
              })
            })
          }
        }
      })

    }
    if (rec_step < 3) {
      mta.Event.stat('clickNextOption', {
        'step': rec_step
      })
    }

  },
  /**
   * 上一步
   */
  lastOption: function (e) {
    var that = this;
    //console.log(e);
    var step = e.currentTarget.dataset.step;
    var rec_step = step;
    if (step > 0) {
      if (step == 2) {
        that.setData({
          play_index: 0,
        })
        //innerAudioContext.pause();
        wx.createAudioContext('music').pause();
      }
      step -= 1;
      var base_info = that.data.base_info;
      base_info.step = step;
      that.setData({
        base_info: base_info
      })
    }
    mta.Event.stat('clickLastOption', {
      'step': rec_step
    })
  },

  /**
   * 第二步：输入欢迎词
   */
  inputWelcomeWord: function (e) {
    //console.log(e);
    var that = this;
    var welcome_word = e.detail.value;
    var base_info = that.data.base_info;
    base_info.word_info.welcome_word = welcome_word;
    that.setData({
      base_info: base_info
    })

  },
  /**
   * 第二步：选择字体大小
   */
  selectWordSize: function (e) {
    //console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    var wordsize = e.currentTarget.dataset.wordsize;
    var base_info = that.data.base_info;
    base_info.word_size_info.word_size_id = id;
    base_info.word_size_info.word_size = wordsize;
    that.setData({
      base_info: base_info
    })
    //mta.Event.stat('selectWordSize', { 'wordsizeid': id })
  },
  /**
   * 第二步
   */
  selectWordType: function (e) {
    var that = this;
    var wordtype_list = that.data.wordtype_list;
    var index = e.detail.value;
    var base_info = that.data.base_info;
    if (index == 0) {
      base_info.word_type.type = 0;
      base_info.word_type.name = wordtype_list[index].name
      base_info.word_type.type_str = '';
    } else {
      base_info.word_type.type = wordtype_list[index].id
      base_info.word_type.name = wordtype_list[index].name
      base_info.word_type.type_str = "font-family: '" + wordtype_list[index].name + "'";
    }
    console.log(base_info)
    that.setData({
      base_info: base_info,
      wordtype_index: index
    })
  },
  /**
   * 第二步：选择字体颜色
   */
  selectWordColor: function (e) {
    //console.log(e);
    var that = this;
    //'word_color_info':{'color':'','color_id':0}
    var base_info = that.data.base_info;
    var color = e.currentTarget.dataset.color;
    var id = e.currentTarget.dataset.id;
    base_info.word_color_info.color = color;
    base_info.word_color_info.color_id = id;
    that.setData({
      base_info: base_info
    })
    //mta.Event.stat('selectWordColor', { 'colorid': id })
  },
  /**
   * 第三步：选中音乐
   */
  selectMusic: function (e) {
    //console.log(e);
    var that = this;
    var base_info = that.data.base_info;
    var id = e.currentTarget.dataset.id;
    if (id != 0) {
      var oss_addr = e.currentTarget.dataset.oss_addr;
      var name = e.currentTarget.dataset.name;

    } else {
      var oss_addr = '';
      var name = '无';
    }
    base_info.music_info.oss_addr = oss_addr;
    base_info.music_info.music_id = id;
    base_info.music_info.music_name = name;
    that.setData({
      base_info: base_info
    })
    //mta.Event.stat('selectMusic', { 'musicid': id })
  },
  /**
   * 第三步：播放/暂停音乐
   */
  changePlayStatus: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var status = e.currentTarget.dataset.status;

    if (status == 1) { //播放音乐
      var oss_addr = e.currentTarget.dataset.oss_addr;
      //innerAudioContext.src = oss_addr;
      that.setData({
        play_music_url: oss_addr,
        play_index: index,
      })
      //innerAudioContext.play();
      wx.createAudioContext('music').play();
    } else { //暂停音乐
      that.setData({
        play_index: 0,
      })
      //innerAudioContext.pause();
      wx.createAudioContext('music').pause();
    }
    mta.Event.stat('changeMusicPlayStatus', {
      'status': status
    })
  },
  /**
   * 第四部：设置播放类型
   */
  swichPlayType: function (e) {
    //console.log(e);
    var that = this;
    var play_type = e.detail.value;
    var base_info = that.data.base_info;
    base_info.play_info.play_type = play_type;
    that.setData({
      base_info: base_info,
    })
  },
  /**
   * 第四部：选择日期
   */
  selectData: function (e) {
    //console.log(e);
    var that = this;
    var that = this;
    var base_info = that.data.base_info;
    var play_date = e.detail.value;
    base_info.play_info.play_date = play_date;
    that.setData({
      base_info: base_info
    })
  },
  /**
   * 第四部：选择时间
   */
  selectTiming: function (e) {
    //console.log(e);
    var that = this;
    var base_info = that.data.base_info;
    var timing = e.detail.value;
    base_info.play_info.timing = timing;
    that.setData({
      base_info: base_info
    })

  },
  /**
   * 第四部：选择包间
   */
  selectRoom: function (e) {
    //console.log(e);
    var that = this;
    var boxIndex = e.detail.value;
    var base_info = that.data.base_info;
    var box_list = that.data.box_list;

    var play_box_mac = box_list[boxIndex].box_mac;
    base_info.play_info.box_mac = play_box_mac;
    that.setData({
      boxIndex: boxIndex,
      base_info: base_info,
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

  }
})