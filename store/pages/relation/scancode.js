// store/pages/relation/scancode.js
const utils = require('../../../utils/util.js')

/**
 * 关联酒商码
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var openid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scan_code_step:0,  //0:扫热点码  11已扫热点码1-1   12已扫热点码2  21已扫热点码2-1 22已扫热点码2-2 
        scan_code_info:{goods_info:{},security_code:'',security_img:''}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu();
        openid = app.globalData.openid;
        this.getOssParams();

    },
    getOssParams:function(){
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
    //扫码
    scanCode:function(e){
        console.log(e)
        var type = e.currentTarget.dataset.type;

        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              console.log(res)
              var code_msg = res.result;
              if(type == 'hotspot'){//扫热点码

                //
              }else if(type=='vintner'){//扫酒商码
                  
              }
            },fail:function(res){
              app.showToast('二维码识别失败,请重试');
            }
        })


        
    },
    //取消关联
    cancelRelation:function(){
        this.setData({scan_code_step:0, 
                      scan_code_info:{goods_info:{},security_code:'',security_img:''}
        })
    },
    //保存并继续
    submitInfo:function(){
        var that = this;
        var scan_code_step = this.data.scan_code_step;
        utils.PostRequest(api_v_url + '/aa/bb', {
            openid: openid,
            
        }, (data, headers, cookies, errMsg, statusCode) => {
    
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})