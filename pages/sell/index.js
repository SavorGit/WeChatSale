// pages/sell/index.js
const tbUtil = require('../../utils/tab_bar.js');
const utils = require('../../utils/util.js');
/**
 * 销售中心页面
 */

const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu();
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
        var that = this;
        tbUtil.selectTab(this);
        if (app.globalData.openid && app.globalData.openid != '') {
            that.setData({
                openid: app.globalData.openid
            })
            openid = app.globalData.openid;
            //注册用户
            that.is_login(openid, 0);
        } else {
            app.openidCallback = openid => {
                if (openid != '') {
                    that.setData({
                        openid: openid
                    })
                    openid = openid;
                    //注册用户
                    that.is_login(openid, 1);

                }
            }
        }
    },
    is_login: function (openid, is_onload = 0) {
        var that = this;
        var showLoading = is_onload == 1 ? true : false;
        utils.PostRequest(api_v_url + '/User/isRegister', {
            openid: openid,
        }, (data, headers, cookies, errMsg, statusCode) => {
            var hotel_id = data.result.userinfo.hotel_id;
            if (hotel_id == 0) {
                wx.redirectTo({
                    url: '/pages/user/login',
                })
            } else {
                var cache_user_info = wx.getStorageSync(cache_key + 'userinfo');
                var user_info = data.result.userinfo
                if (cache_user_info != '' && typeof (cache_user_info.select_hotel_id) != 'undefined' && cache_user_info.select_hotel_id > 0) {
                    user_info.select_hotel_id = cache_user_info.select_hotel_id;
                    user_info.select_hotel_name = cache_user_info.select_hotel_name;

                }
                wx.setStorageSync(cache_key + 'userinfo', data.result.userinfo)
                if (hotel_id == -1 && is_onload == 1) {
                    wx.showModal({
                        title: '提示',
                        content: '您当前为通用版权限,除投屏外的的功能只可作为演示使用',
                        showCancel: false,
                        success: function () {

                        }
                    })
                }
                if (data.result.userinfo.role_type == 3) {
                    wx.redirectTo({
                        url: '/pages/waiter/home',
                    })
                } else if (data.result.userinfo.role_type == 6) {
                    wx.redirectTo({
                        url: '/store/pages/index',
                    })
                } else {
                    that.setData({ user_info: data.result.userinfo })
                    //本月售酒汇总
                    that.getSellWineSta(openid, hotel_id, is_onload);
                    // 本月售酒汇总  如果是餐厅指认活动政策受益人
                    that.getStimulate(openid, hotel_id, is_onload);
                    if (user_info.is_perfect == 0) {
                        wx.redirectTo({
                            //url: '/pages/user/authorization',
                            url: '/pages/hotel/setting/personalinfo?openid=' + openid + '&is_auth=1'
                        })
                    } else {
                        wx.getSetting({
                            success(res) {
                                console.log(res.authSetting, 'authSetting')
                                var authSetting = res.authSetting;

                                if (typeof (authSetting['scope.userLocation']) != 'undefined' && authSetting['scope.userLocation'] == true) {

                                } else {
                                    wx.redirectTo({
                                        url: '/pages/user/login?userlocation=1',
                                    })
                                }
                            }
                        })
                    }
                }
            }
        }, res => { }, { isShowLoading: showLoading })
    },
    /**
     * @desc 售酒汇总 
     * @date 20240521 
     */
    getSellWineSta: function (openid, hotel_id, is_onload = 0) {
        var that = this;
        var showLoading = is_onload == 1 ? true : false;
        utils.PostRequest(api_v_url + '/writeoff/statdata', {
            openid: openid,

        }, (data, headers, cookies, errMsg, statusCode) => {
            that.setData({ sumsellwine: data.result })
        }, res => { }, { isShowLoading: showLoading })
    },
    /**
     * @desc 活动激励数据
     * @date 20240521
     */
    getStimulate: function (openid, hotel_id, is_onload = 0) {
        var that = this;
        var showLoading = is_onload == 1 ? true : false;
        utils.PostRequest(api_v_url + '/ActivityPolicy/statdata', {
            openid: openid,
        }, (data, headers, cookies, errMsg, statusCode) => {

            var sell_wine_statdata = data.result;
            if (sell_wine_statdata.step_award_process.end_step_num > 0) {
                var process = sell_wine_statdata.step_award_process.process;
                var now_step = 0;
                if (process.length > 0) {
                    var last_step_num = process[0].n;
                }

                for (let i in process) {
                    /*if(process[i].is_select==1){
                      now_step = process[i].n ;
                    }*/
                    if (i == 0) {
                        process[i].step_percent = 'margin-left:calc(' + (process[i].n / sell_wine_statdata.step_award_process.end_step_num * 100) + '% - 90rpx);';
                    } else {

                        process[i].step_percent = 'margin-left:calc(' + ((process[i].n - last_step_num) / sell_wine_statdata.step_award_process.end_step_num * 100) + '% - 180rpx)';

                    }
                    last_step_num = process[i].n;
                }
                now_step = sell_wine_statdata.step_award_process.now_step_num
                sell_wine_statdata.step_award_process.process = process;
                sell_wine_statdata.step_award_process.now_step_percent = 'width:' + (now_step / sell_wine_statdata.step_award_process.end_step_num * 100) + '%;';
            }


            that.setData({ sell_wine_statdat: sell_wine_statdata })
        }, res => { }, { isShowLoading: showLoading })

    },
    gotoPage: function (e) {
        var that = this;
        var url = '';
        var type = e.currentTarget.dataset.type;
        var user_info = wx.getStorageSync(cache_key + 'userinfo');

        wx.showLoading({
            title: '加载中',
        })
        switch (type) {
            case 'stock':
                url = '/pages/sell/stock/list';
                break;
            case 'chargeoff':
                url = '/store/pages/goodschargeoff/index';
                break;
            case 'sale_log':
                url = '/store/pages/goodschargeoff/confirm';
                break;
            case 'sale_log_confirm':
                var confirm_data = this.data.sell_wine_statdat.confirm_data;
                url = '/store/pages/goodschargeoff/confirm?is_confirm=1&sdate=' + confirm_data.sdate + '&edate=' + confirm_data.edate + '&num=' + confirm_data.num + '&integral=' + confirm_data.integral + '&step_num=' + confirm_data.step_num + '&step_integral=' + confirm_data.step_integral + '&confirm_month=' + confirm_data.confirm_month + '&month=' + confirm_data.month;
                break;
        }
        wx.navigateTo({
            url: url,
            success: function () {
                wx.hideLoading();
                if (type == 'perfect_expense_log') {
                    that.setData({ expense_log: { popPerfectExpenseWind: false, id: 0, str: '' } })
                }
            }
        })
    },
    scanCode: function (e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var url = '';
        var user_info = wx.getStorageSync(cache_key + 'userinfo');
        if (user_info.select_hotel_id > 0) {
            var hotel_id = user_info.select_hotel_id;
        } else {
            if (user_info.hotel_id == -1) {
                app.showToast('请先选择酒楼');
                return false;
            } else {
                var hotel_id = user_info.hotel_id
            }
        }

        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                var code_msg = res.result;

                utils.PostRequest(api_v_url + '/qrcode/scancode', {
                    content: code_msg,
                    openid: user_info.openid,
                    type: type
                }, (data, headers, cookies, errMsg, statusCode) => {


                    switch (type) {
                        case '1':
                            url = '/store/pages/goodschargeoff/addinfo?code_msg=' + code_msg + '&hotel_id=' + hotel_id;
                            break;
                        case '2':
                            url = "/store/pages/couponbreakage/havecode/index?code_msg=" + code_msg + '&hotel_id=' + hotel_id;
                            break;
                        case '3':
                            url = '/store/pages/activity/winesale/index?code_msg=' + code_msg + '&hotel_id=' + hotel_id;
                            break;
                        case '4':
                            url = '/store/pages/phyprizechargeoff/index?code_msg=' + code_msg + '&hotel_id=' + hotel_id;
                            break;
                    }
                    wx.navigateTo({
                        url: url,
                    })
                })
            }, fail: function (res) {
                //app.showToast('二维码识别失败,请重试');
            }
        })
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