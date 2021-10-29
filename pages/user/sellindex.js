// pages/user/sellindex.js
/**
 * 注册用户首页 [品鉴酒]
 */
const app = getApp()
const utils = require('../../utils/util.js')
var uma = app.globalData.uma;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [], // 任务列表数据
    taskDetailWindowShow: false, // 是否吊起任务详情弹窗
    openTaskInWindow: {}, // 在任务详情弹窗中打开任务
    saleDetailWindowShow: false,
    judgeWindowShow: false,

    loop_play_list:[],    //走马灯数据
    taste_wine_info:{'room_id':0,'nums':''}, //发起品鉴酒活动
    box_index:0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    this.setData({user_info:user_info});
    
  },
  getRoomList:function(openid,hotel_id){
    var that = this;

    utils.PostRequest(api_v_url + '/room/getWelcomeBoxlist', {
      hotel_id: hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data.result.box_name_list)
      that.setData({
        box_name_list: data.result.box_name_list,
        box_list: data.result.box_list
      })
    })
  },
  bindBoxPickerChange:function(e){
    var box_index = e.detail.value;
    var box_list  = this.data.box_list;
    this.setData({box_index:box_index})
    var taste_wine_info = this.data.taste_wine_info;
    taste_wine_info.room_id = box_list[box_index].id;
    this.setData({taste_wine_info:taste_wine_info})
  },
  bindInputTasteWineNums:function(e){
    var nums = e.detail.value;
    var taste_wine_info = this.data.taste_wine_info;
    taste_wine_info.nums = nums;
    this.setData({taste_wine_info:taste_wine_info})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    if (userInfo.hotel_id == -1) {
      var hotel_id = userInfo.select_hotel_id;
    } else {
      var hotel_id = userInfo.hotel_id;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
    if (app.globalData.openid && app.globalData.openid != '') {
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      //注册用户
      that.is_login(openid);
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          //注册用户
          that.is_login(openid);
          
        }
      }
    }
    
  },
  is_login:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/User/isRegister',{
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var hotel_id = data.result.userinfo.hotel_id;
      if(hotel_id ==0){
         wx.redirectTo({
          url: '/pages/user/login',
        })
      }else {
        this.getRoomList(openid,hotel_id);
        that.getTaskList(openid,hotel_id);
        var loop_play_list = that.data.loop_play_list;
        if(loop_play_list.length==0){
          that.getLoopPlay();
        }
      }
    })
  },
  /**
   * 获取任务列表
   */
  getTaskList:function(openid,hotel_id){
    var that = this;

    utils.PostRequest(api_v_url + '/task/getTaskList',{
      openid:openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var task_list = data.result;
      that.setData({task_list:task_list});
    })
  },
  /***
   * 获取循环播放任务列表
   */
  getLoopPlay:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb',{
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var loop_play_list = data.result;
      that.setData({loop_play_list:loop_play_list});
    })
  },
  /**
   * 领取任务弹窗显示详情
   */
  getTaskPopWind:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var canreceive = this.data.task_list.canreceive;
    var task_info = canreceive[index];
    this.setData({task_info:task_info,saleDetailWindowShow:true});
  },
  /**
   * 立即领取任务
   */
  receiveTaskNow:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var task_info = this.data.task_info;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var task_list = this.data.task_list;

    utils.PostRequest(api_v_url + '/task/receiveTask',{
      openid:user_info.openid,
      hotel_id:user_info.hotel_id,
      task_id:task_info.task_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({saleDetailWindowShow:false})
      that.getTaskList(user_info.openid,user_info.hotel_id)
      app.showToast('任务领取成功',2000,'success')
    })
  },
  closePopWind:function(e){
    this.setData({
      saleDetailWindowShow: false,
      judgeWindowShow: false,
      box_index:0,
      taste_wine_info:{'room_id':0,'nums':''}
    })
  },
  /**
   * 播放任务的电视广告
   */
  boxShowAd:function(e){
    
  },
  /**
   * 检测品鉴酒活动库存并弹窗
   */
  examTasteWineTask:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var task_list = this.data.task_list;
    var task_info = task_list.inprogress[index];
    var user_info = wx.getStorageSync(cache_key+'userinfo')
    utils.PostRequest(api_v_url + '/task/checkStock',{
      openid:user_info.openid,
      hotel_id:user_info.hotel_id,
      task_id:task_info.task_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var tasteWineTask = data.result;
      that.setData({tasteWineTask:tasteWineTask,judgeWindowShow:true})
    })
  },
  /**
   * 发起品鉴酒领取活动
   */
  startTasteWineTask:function(e){
    var that = this;
    var user_info = this.data.user_info;
    var box_list = this.data.box_list;
    var box_index = this.data.box_index;
    var box_mac = box_list[box_index].box_mac;


    
    var tasteWineTask = this.data.tasteWineTask;
    var task_user_id = tasteWineTask.task_user_id;
    var taste_wine_info = this.data.taste_wine_info;
    var send_num = taste_wine_info.nums;
    if(send_num>tasteWineTask.send_num){
      app.showToast('领取数量不可大于剩余数量')
      return false;
    }

    utils.PostRequest(api_v_url + '/activity/startTastewine',{
      openid:user_info.openid,
      hotel_id:user_info.hotel_id,
      box_mac:box_mac,
      send_num:send_num,
      task_user_id:task_user_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({judgeWindowShow:false,taste_wine_info:{'room_id':0,'nums':''},box_index:0})
    })
  },
  /**
   * 删除失效任务
   */
  delInvalid:function(e){
    utils.PostRequest(api_v_url + '/aa/bb',{
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {


    })
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


  

  

  /**
   * 弹出任务详情弹窗
   */
  popTaskDetailWindow: function (e) {
    let that = this;
    let taskListIndex = e.currentTarget.dataset.index;

    that.setData({
      taskDetailWindowShow: true,
      openTaskInWindow: that.data.task_list.inprogress[taskListIndex]
    });
    uma.trackEvent('mytask_task_detail',{'open_id':app.globalData.openid,'task_id':e.currentTarget.dataset.taskId})
  },

  /**
   * 点击任务详情弹窗确定按钮
   */
  taskDetailWindowConfirm: function (e) {
    let that = this;
    that.setData({
      taskDetailWindowShow: false
    });
  },
  /**
   * 
   * 点击弹出分润弹框 
   */
  setShareBenefit: function (e) {
    var that = this;

    /*that.setData({
      taskDetailWindowShow: false,
      setTaskBenefitWindowShow: true,
      level1: 10,
      level2: 70,
      level3: 20
    }, function () {
      this.selectComponent('#setTaskBenefitSlider').redraw({
        minValue: this.data.level1,
        maxValue: this.data.level1 + this.data.level2
      });
    });*/

    var task_id = e.currentTarget.dataset.task_id;

    let userInfo = wx.getStorageSync(cache_key + 'userinfo');
    if (userInfo.hotel_id == -1) {
      var hotel_id = userInfo.select_hotel_id;
    } else {
      var hotel_id = userInfo.hotel_id;
    }
    var openid = userInfo.openid;

    utils.PostRequest(api_v_url + '/task/getShareprofit', {
      openid: openid,
      hotel_id: hotel_id,
      task_id: task_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        //taskInfo:taskInfo,
        level1: data.result.level1,
        level2: data.result.level2,
        level3: data.result.level3,
        num: data.result.num,
        task_id: task_id,
        openid: openid,
        hotel_id: hotel_id,
        shareprofit: data.result,
        taskDetailWindowShow: false,
        setTaskBenefitWindowShow: true,
      }, function () {
        this.selectComponent('#setTaskBenefitSlider').redraw({
          minValue: this.data.level1,
          maxValue: this.data.level1 + this.data.level2
        });
      });


    });

  },
  /**
   * 关闭分润弹窗
   */
  closeShareBenefit: function (e) {
    var that = this;
    that.setData({
      setTaskBenefitWindowShow: false,
    })
  },
  slideSet: function (e) {
    var that = this;
    var staff_share_benefit = e.detail.value;  //设置数值
    var manager_share_benefit = 100 - staff_share_benefit;  //管理员分润数值
    that.setData({
      level2: staff_share_benefit,
      level1: manager_share_benefit
    })
  },
  lowValueChange: function (e) {
    console.log(e);
    var that = this;
    var lowValue = e.detail.lowValue;
    var level1 = that.data.level1;
    var level2 = that.data.level2;
    var level3 = that.data.level3;
    level1 = lowValue;
    level2 = 100 - level3 - level1;

    that.setData({
      level1: level1,
      level2: level2,
      level3: level3
    }, function () {
      this.selectComponent('#setTaskBenefitSlider').redraw({
        minValue: this.data.level1,
        maxValue: this.data.level1 + this.data.level2
      });
    });

  },
  heighValueChange: function (e) {
    var that = this;
    var heighValue = e.detail.heighValue;
    var level1 = that.data.level1;
    var level2 = that.data.level2;
    var level3 = that.data.level3;

    level3 = 100 - heighValue;
    level2 = 100 - level1 - level3;

    that.setData({
      level1: level1,
      level2: level2,
      level3: level3
    }, function () {
      this.selectComponent('#setTaskBenefitSlider').redraw({
        minValue: this.data.level1,
        maxValue: this.data.level1 + this.data.level2
      });
    });

  },
  /**
   * 管理员修改任务分润比例
   */
  editTaskShareBenefit: function (e) {

    var that = this;
    var task_id = e.detail.value.task_id;
    var level1 = e.detail.value.level1;
    var level2 = e.detail.value.level2;
    var level3 = e.detail.value.level3;
    var total = level1 + level2 + level3;


    var openid = e.detail.value.openid;
    var hotel_id = e.detail.value.hotel_id;

    utils.PostRequest(api_v_url + '/task/setShareprofit', {
      task_id: task_id,
      level1: level1,
      level2: level2,
      level3: level3,
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('保存成功')
      that.setData({
        setTaskBenefitWindowShow: false,
      })
    }, res => {
      app.showToast('保存失败');
    })
  },
  
})