// pages/waiter/index.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
const utils = require('../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var openid;
var avatarUrl;
var nickName;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    utils.PostRequest(api_v_url + '/staff/detail', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        user_info: data.result,
        avatarUrl: data.result.avatarUrl,
        nickName: data.result.nickName,
        userScore: data.result.score
      })
    })
    utils.PostRequest(api_v_url + '/comment/commentlist', {
      openid: openid,
      page:1,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        comment_list: data.result.datalist,
        comment_total: data.result.total,
        comment_avg_score: data.result.avg_score,
        start_date: data.result.start_date,
        end_date: data.result.end_date,
      })
    })

    
    
  },
  /**
   * 更改开始、结束日期
   */
  bindDateChange: function (e) {
    var that = this;
    var date_type = e.currentTarget.dataset.date_type;
    if (date_type == 1) {
      that.setData({
        start_date: e.detail.value
      })
    } else {
      that.setData({
        end_date: e.detail.value
      })
    }
  },
  /**
   * 查询服务员某个时间段的评分列表
   */
  warterScoreList: function (e) {

    var that = this;
    var start_date = e.detail.value.start_date;
    var end_date = e.detail.value.end_date;
    utils.PostRequest(api_v_url + '/comment/commentlist', {
      openid: openid,
      start_date: start_date,
      end_date: end_date,
      page: 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        comment_list: data.result.datalist,
        comment_total: data.result.total,
        comment_avg_score: data.result.avg_score,
      })
    })
  },

  /**
   * 服务员详情评分列表分页
   */
  loadMore: function (e) {
    var that = this;
    page += 1;
    var start_date = that.data.start_date;
    var end_date = that.data.end_date;
    utils.PostRequest(api_v_url + '/comment/commentlist', {
      openid: openid,
      start_date: start_date,
      end_date: end_date,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        comment_list: data.result.datalist
      })
    });
  },
  /**
   * 修改头像
   */
  editAvatar:function(e){
    var that = this;
    var staff_id = e.currentTarget.dataset.staff_id;
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


        console.log(img_url);
        console.log(oss_upload_url)
        console.log(postf_w)
        console.log(postf_t)
        console.log(postf)
        console.log(filename)
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

                utils.PostRequest(api_v_url + '/user/edit', {
                  openid: openid,
                  avatar_url: "forscreen/resource/" + img_url,
                }, (data, headers, cookies, errMsg, statusCode) => {
                  that.setData({
                    avatarUrl: oss_url + "/forscreen/resource/" + img_url
                  })
                  app.showTost('头像修改成功')
                })
              },
              fail: function ({ errMsg }) {
                app.showTost('头像修改失败')
              },
            });
          }
        })
      }
    })
  },
  editNickname:function(e){
    var name = e.detail.value.name;
    utils.PostRequest(api_v_url + '/user/edit', {
      openid: openid,
      name: name,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        nickname: name
      })
      app.showTost('昵称修改成功')
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