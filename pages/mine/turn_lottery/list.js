// pages/mine/turn_lottery/list.js
/**
 * 幸运抽奖页面
 */

const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
const  minute = ['00','10','20','30','40','50'];
const  hour = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    
   
    lottery_config:{'hour_index':0,'minute_index':0,'box_index':0,'id':0,'award_open_time':'','select_room_name':'请选择抽奖包间','nums':''},
    multiArray:[hour,minute],
    multiIndex: [0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = options.openid;
    hotel_id = options.hotel_id;
    this.getLotteryList(openid,hotel_id);
    this.getRoomlist(openid,hotel_id);
  },
  getLotteryList:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/lottery/datalist', {
      openid: openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({list:data.result})
    })
  },
  getRoomlist:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRoomList', {
      openid: openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var lottery_config = that.data.lottery_config;
      lottery_config.select_room_name = data.result.box_name_list[0];

      that.setData({
        objectBoxArray: data.result.box_name_list,
        box_list: data.result.box_list,
        lottery_config:lottery_config
      })
    })
  },
  selectRoom:function(e){
    var keys = e.detail.value;
    var objectBoxArray = this.data.objectBoxArray;
    var lottery_config = this.data.lottery_config;
    lottery_config.box_index = keys;
    lottery_config.select_room_name = objectBoxArray[keys];
    this.setData({lottery_config:lottery_config})
  },
  inputLotteryNums:function(e){
    var nums = e.detail.value.replace(/\s+/g, '');
    var lottery_config = this.data.lottery_config;
    lottery_config.nums = nums;
    this.setData({lottery_config:lottery_config})
  },
  // 设置发起抽奖
  setPrize: function (e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let bean = self.data.list[index];
    self.setData({ showSetPrizeWindow: true, setPrize: bean });
  },
  // 关闭设置奖项弹窗
  closeSetPrizeWindow: function (e) {
    let self = this;
    var lottery_config = this.data.lottery_config;
    lottery_config.award_open_time = '';
    self.setData({ showSetPrizeWindow: false,lottery_config:lottery_config });
  },
  //发起抽奖
  startLottery:function(e){
    var that = this;
    var box_list = this.data.box_list;
    var lottery_config = this.data.lottery_config;
    var award_open_time = lottery_config.award_open_time;
    var nums = lottery_config.nums;
    if(nums == ''){
      app.showToast('请输入最大中奖人数');
      return false;
    }
    if(nums <=0){
      app.showToast('请输入大于0的整数');
      return false;
    }
    if(!app.isInteger(nums)){
      app.showToast('最大中奖人数请输入整数');
      return false;
    }
    
    var box_index = lottery_config.box_index;
    
    var box_mac = box_list[box_index].box_mac;
    var setPrize = this.data.setPrize;

    utils.PostRequest(api_v_url + '/lottery/startLottery', {
      openid: openid,
      box_mac:box_mac,
      hotel_id:hotel_id,
      people_num:nums,
      start_time:award_open_time,
      syslottery_id:setPrize.syslottery_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.closeSetPrizeWindow();
      lottery_config.award_open_time = '';
      that.setData({lottery_config:lottery_config})
      app.showToast('发起成功',2000,'success')
    })
  },


  //获取时间日期
  bindMultiPickerChange: function(e) {
    //console.log(e)
    var choose_hour_index = e.detail.value[0];
    var choose_minute_index = e.detail.value[1];
    var multiArray = this.data.multiArray;
    var multiIndex = this.data.multiIndex;
    multiIndex[0] = choose_hour_index;
    multiIndex[1] = choose_minute_index;


    var hour = multiArray[0][choose_hour_index];
    var minute = multiArray[1][choose_minute_index];
    var lottery_config = this.data.lottery_config;
    lottery_config.award_open_time = hour+':'+minute;

    this.setData({lottery_config:lottery_config,multiIndex:multiIndex})

    
    
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

  },
  
})