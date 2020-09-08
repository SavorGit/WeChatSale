// pages/activity/dine_add.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2020; i <= date.getFullYear() + 1; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10],
    choose_year: '',
    award_img:'', //奖品图片
    award_open_time:'',//开奖时间 
    add_button_disable:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      choose_year: this.data.multiArray[0][0]
    })
  },
  //获取时间日期
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour 
    })
    // console.log(this.data.time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function(e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  addActivityPic:function(){
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
                that.setData({img_url:oss_key})
              },
              fail: function ({
                errMsg
              }) {
                wx.showToast({
                  title: '上传图片失败,请重试',
                  icon: 'none',
                  duration: 2000,
                })
              },
            });
          }
        })
        
      },
      fail(res) { //取消选择照片
       
      }
    })
  },
  addActivity:function(e){
    var that = this;
    var activity_name = e.detail.activity_name.replace.replace(/\s+/g, '');
    var award_name    = e.detail.award_name.replace(/\s+/g, '');
    var award_img     = this.data.award_img;
    var award_open_time = this.data.award_open_time;

    if(activity_name==''){
      app.showToast('请填写活动名称');
      return false;
    }
    if(award_name==''){
      app.showToast('请填写奖品名称');
      return false;
    }
    if(award_img==''){
      app.showToast('请上传奖品图片');
      return false;
    }
    if(award_open_time==''){
      app.showToast('请选择开奖时间');
      return false;
    }
    that.setData({add_button_disable:true});
    utils.PostRequest(api_v_url + '/aa/bb/', {
      hotel_id: hotel_id,
      openid:openid,
      activity_name : activity_name,
      award_name:award_name,
      award_img:award_img,
      award_open_time:award_open_time,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({add_button_disable:false})
      wx.showToast({
        title: '添加成功',
        icon:'success',
        duration:2000,
        mask:true,
        success:function(){
          wx.navigateBack({
            delta: 1,
          })
        }
      })
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