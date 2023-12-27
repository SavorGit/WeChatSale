// store/pages/goodschargeoff/applyCrackReward.js
const utils = require('../../../utils/util.js')

/**
 * 核销 新增核销申请 - 开瓶奖励
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var openid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        examplePopWindowOpen: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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

    },
    /**
     * 打开示例弹窗
     * @param {Event} e 事件
     */
    openExamplePopWindow: function (e) {
        let self = this;
        self.setData({ examplePopWindowOpen: true });
    },
    /**
     * 关闭示例弹窗
     * @param {Event} e 事件
     */
    closeExamplePopWindow: function (e) {
        let self = this;
        self.setData({ examplePopWindowOpen: false });
    }
})