// pages/user/register.js
const app = getApp()
const mta = require('../../utils/mta_analysis.js')
const utils = require('../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var cache_key = app.globalData.cache_key;
var sms_time_djs;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRegisterSuccessPopWindow:false,
    mobile:'',
    cityArray: ['北京'],
    objectCityArray: [],
    cityIndex: 0,

    areaArray: [],
    objectAreaArray: [],
    areaIndex: 0,

    cuisineArray: [],
    objectCuisineArray: [],
    cuisineIndex: 0,

    addDisabled:false,
    oss_url: app.globalData.oss_url + '/',
    logoimg:'',
    faceimg:'',
    envimg:'',
    legal_idcard_img0:'',
    legal_idcard_img1:'',
    legal_idcard_img2:'',
    legal_charter_img0:'',
    legal_charter_img1:'',
    is_get_sms_code:'',
    name_focus:false,
    avg_focus:false,
    tel_focus:false,
    addr_focus:false,
    legal_focus:false,
    contractor_focus:false,
    mobile_focus:false,
    verify_code_focus:false,
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    //获取菜品列表
    utils.PostRequest(api_v_url + '/FoodStyle/getList', {
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data)
      that.setData({
        cuisineArray: data.result.food_name_list,
        objectCuisineArray: data.result.food_list
      })
    })
    //获取城市列表
    utils.PostRequest(api_v_url + '/Area/getAreaList', {
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data)
      that.setData({
        cityArray: data.result.city_name_list,
        objectCityArray: data.result.city_list
      })
    }) 
  },
  //城市切换 
  bindCityPickerChange: function (e) {
    var that = this;
    var city_list = that.data.objectCityArray;
    var picCityIndex = e.detail.value //切换之后城市key
    var cityIndex = that.data.cityIndex; //切换之前城市key
    if (picCityIndex != cityIndex) {
      that.setData({
        cityIndex: picCityIndex,
        areaIndex: 0
      })
      //获取当前城市的区域
      var area_id = city_list[picCityIndex].id;

      //获取城市列表
      utils.PostRequest(api_v_url + '/Area/getSecArea', {
        area_id:area_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        console.log(data)
        that.setData({
          areaArray: data.result.area_name_list,
          objectAreaArray: data.result.area_list
        })
      }) 
    }
  },
  //切换区域
  bindAreaPickerChange: function (e) {
    var that = this;
    var area_list = that.data.objectAreaArray;
    var areaIndex = e.detail.value;
    that.setData({
      areaIndex: e.detail.value
    })



  },
  //切换菜系
  bindCuiPickerChange: function (e) {
    var that = this;
    var cui_list = that.data.objectCuisineArray;
    var cuisineIndex = e.detail.value
    that.setData({
      cuisineIndex: cuisineIndex
    })
    //获取城市列表
    /*wx.request({
      url: api_v_url + 'Area/getAreaList',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          cityArray: res.data.result.city_name_list,
          objectCityArray: res.data.result.city_list
        })
      }
    })*/
  },

  /**
   * 上传菜品图
   */
  uploadDishesPic: function (e) {
    console.log(e)
    var that = this;
    var keys = e.currentTarget.dataset.keys;
    var is_desc_img = e.currentTarget.dataset.is_desc_img;
    var type = e.currentTarget.dataset.type;

    wx.showLoading({
      title: '图片上传中...',
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

        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rest) {
            var policy = rest.data.policy;
            var signature = rest.data.signature;

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
                var dish_img_url = "forscreen/resource/" + img_url
                
                if(type=='logo'){//logo图
                  that.setData({
                    logoimg: dish_img_url
                  })
                }else if(type=='face'){ //门帘
                  that.setData({
                    faceimg: dish_img_url
                  })
                } else if (type =='env'){ //环境
                  that.setData({
                    envimg:dish_img_url
                  })
                } else if (type =='idcard'){  //法人身份证
                  if(keys==0){
                    that.setData({
                      legal_idcard_img0: dish_img_url
                    })
                  }else if(keys==1){
                    that.setData({
                      legal_idcard_img1: dish_img_url
                    })
                  }else if(keys==2){
                    that.setData({
                      legal_idcard_img2: dish_img_url
                    })
                  }
                  
                } else if (type =='charter'){//执照
                  if(keys==0){
                    that.setData({
                      legal_charter_img0: dish_img_url
                    })
                  }else if(keys ==1){
                    that.setData({
                      legal_charter_img1: dish_img_url
                    })
                  }
                }
                wx.hideLoading();

                setTimeout(function () {
                  that.setData({
                    addDisabled: false
                  })
                }, 1000);
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
      }, fail: function (e) {
        wx.hideLoading();
        that.setData({
          addDisabled: false
        })
      }
    })
  },
  //输入手机号失去焦点
  mobileOnInput: function (res) {
    var that = this;
    var mobile = res.detail.value;
    that.setData({
      mobile: mobile
    })
  },
  //获取手机验证码
  getSmsCode: function (res) {
    var that = this;
    var mobile = res.target.dataset.mobile;
    var invite_code = res.target.dataset.invite_code;
    if (mobile == '') {

      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var is_mobile = app.checkMobile(mobile);
    if (!is_mobile) {
      return;
    }
    utils.PostRequest(api_v_url + '/sms/sendRegisterCode', {
      mobile: mobile,
    }, (data, headers, cookies, errMsg, statusCode) => {
      sms_time_djs = 60
      that.setData({
        is_get_sms_code: 1,
        sms_time_djs: sms_time_djs
      })
      var timer8_0 = setInterval(function () {
        sms_time_djs -= 1;
        that.setData({
          sms_time_djs: sms_time_djs
        });
        if (sms_time_djs == 0) {
          that.setData({
            is_get_sms_code: 0,
          })
          clearInterval(timer8_0);
        }

      }, 1000);
    })
  },
  registerHotel:function(e){
    
    var that = this;
    console.log(e);
    console.log(that.data)
    var name = e.detail.value.name; //餐厅名称
    var cuisineIndex = that.data.cuisineIndex;
    var cityIndex = that.data.cityIndex;
    var areaIndex = that.data.areaIndex;
    var avg_exp = e.detail.value.avg_exp;
    var tel = e.detail.value.tel;
    var addr = e.detail.value.addr;
    var logoimg = e.detail.value.logoimg;
    var faceimg = e.detail.value.faceimg;
    var envimg = e.detail.value.envimg;
    var legal_name = e.detail.value.legal_name;
    var legal_idcard_img0 = e.detail.value.legal_idcard_img0;
    var legal_idcard_img1 = e.detail.value.legal_idcard_img1;
    var legal_idcard_img2 = e.detail.value.legal_idcard_img2;
    var legal_charter_img0 = e.detail.value.legal_charter_img0;
    var legal_charter_img1 = e.detail.value.legal_charter_img1;
    var contractor = e.detail.value.contractor;
    var mobile = e.detail.value.mobile;
    var verify_code = e.detail.value.verify_code;


    if(name==''){
      app.showToast('请输入餐厅名称');
      that.setData({
        name_focus:true
      })
      return false;
    }
    if (cuisineIndex==0){
      app.showToast('请选择菜品类型');
      return false;
    }
    if (avg_exp==''){
      app.showToast('请输入人均消费');
      that.setData({
        avg_focus: true
      })
      return false;
    }
    if (tel==''){
      app.showToast('请输入订餐电话');
      that.setData({
        tel_focus: true
      })
      return false;
    }

    if (cityIndex==0){
      app.showToast('请选择所在城市');
      return false;
    }
    if (areaIndex == 0) {
      app.showToast('请选择所在区域');
      return false;
    }
    if (addr==''){
      app.showToast('请输入餐厅地址');
      that.setData({
        addr_focus: true
      })
      return false;
    }
    /*if (logoimg==''){
      app.showToast('请上传餐厅logo图');
      return false;
    }*/
    if (faceimg==''){
      app.showToast('请上传餐厅门脸图');
      return false;
    }
    if (legal_name==''){
      app.showToast('请输入法人姓名');
      that.setData({
        legal_focus: true
      })
      return false;
    }
    if (legal_idcard_img0 == '') {
      app.showToast('请上传法人身份证正面照');
      return false;
    }
    if (legal_idcard_img1 == '') {
      app.showToast('请上传法人身份证反面照');
      return false;
    }
    if (legal_idcard_img2 == '') {
      app.showToast('请上传法人手持身份证件照');
      return false;
    }
    if (legal_charter_img0==''){
      app.showToast('请上传营业执照');
      return false;
    }
    if (legal_charter_img1 == '') {
      app.showToast('请上传许可证');
      return false;
    }

    if (contractor==''){
      app.showToast('请输入联系人姓名');
      that.setData({
        contractor_focus:true
      })
      return false;
    }
    if(mobile==''){
      app.showToast('请输入联系方式');
      that.setData({
        mobile_focus: true
      })
      return false;   
    }
    if (verify_code==''){
      app.showToast('请输入手机验证码');
      that.setData({
        verify_code_focus: true
      })
      return false;   
    }
    
    var foods_list = that.data.objectCuisineArray
    var food_style_id = foods_list[cuisineIndex].id;

    var area_list = that.data.objectCityArray;
    var area_id = area_list[cityIndex].id;
    
    var county_list = that.data.objectAreaArray;
    
    var county_id = county_list[cityIndex].id;


    var legal_idcard = '';

    legal_idcard += legal_idcard_img0 + ',';
    legal_idcard += legal_idcard_img1 + ',';
    legal_idcard += legal_idcard_img1;


    var legal_charter = '';

    legal_charter += legal_idcard_img0 + ',';
    legal_charter += legal_idcard_img1 + ',';

    //注册酒楼
    utils.PostRequest(api_v_url + '/merchant/register', {
      openid: openid,
      addr: addr,
      area_id: area_id,
      avg_exp: avg_exp,
      contractor: contractor,
      county_id: county_id,
      envimg: envimg,
      faceimg: faceimg,
      food_style_id: food_style_id,
      legal_charter: legal_charter,
      legal_idcard: legal_idcard,
      legal_name: legal_name,
      logoimg: logoimg,
      mobile: mobile,
      name: name,
      tel: tel,
      verify_code: verify_code
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        showRegisterSuccessPopWindow:true,
        message: data.result.message
      })
    })
  },
  modalConfirm: function (e) {
    wx.navigateBack({
      delta: 1
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