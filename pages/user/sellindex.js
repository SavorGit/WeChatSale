// pages/user/sellindex.js
/**
 * 注册用户首页 [品鉴酒]
 */
const app = getApp()
const utils = require('../../utils/util.js')
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
    SystemInfo: app.SystemInfo,
    task_list:[],
    box_list:[],
    demand_box_list:[],
    taskDetailWindowShow: false, // 是否吊起任务详情弹窗
    openTaskInWindow: {}, // 在任务详情弹窗中打开任务
    saleDetailWindowShow: false,
    judgeWindowShow: false,
    tgDetailWindowShow:false,  //团购任务详情

    loop_play_list:[],    //走马灯数据
    taste_wine_info:{'room_id':0,'nums':''}, //发起品鉴酒活动
    box_index:0,

    

    lottery_detail_window:false , //抽奖任务弹窗
    lottery_activity_window:false,  //发起抽奖活动弹窗
    lottery_detail_info :{tab:'rule',desc:''},
    lottery_activity_info:{activity_scope:1,start_time:'',lottery_time:'',lottery_edit:false},
    activityStartTimeIndex:[0,0],
    lotteryStartTimeIndex:[0,0],

    select_time_arr:[['10','11','12','13','14','15','16','17','18','19','20','21','22','23'],['00','10','20','30','40','50']],
    popDemandAdsWind:false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  getRsRoomlist:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/room/getRoomList', {
      openid: openid,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {

      that.setData({
        objectBoxArray: data.result.box_name_list,
        demand_box_list: data.result.box_list,
        demand_box_index : data.result.box_index,
      })
    })
  },



  getRoomList:function(openid,hotel_id){
    var that = this;

    utils.PostRequest(api_v_url + '/room/getWelcomeBoxlist', {
      hotel_id: hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      that.setData({
        box_name_list: data.result.box_name_list,
        box_list: data.result.box_list
      })
    },res=>{},{isShowLoading:false})
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
        var user_info = wx.getStorageSync(cache_key+'userinfo');
        console.log(user_info)
        if(user_info.select_hotel_id>0 ){

        }else {
          wx.setStorageSync(cache_key+'userinfo', data.result.userinfo)
        }
        
        if(data.result.userinfo.role_type==3){
          wx.redirectTo({
            url: '/pages/waiter/home',
          })
        }else if(data.result.userinfo.role_type==6){
          wx.redirectTo({
            url: '/store/pages/index',
          })
        }else {
          if(user_info==''){
            that.isHaveStockHotel(data.result.userinfo);
          }else {
            that.isHaveStockHotel(user_info);
          }
          
          that.setData({user_info:data.result.userinfo})
          var task_list = that.data.task_list;
          if(task_list.length==0){
            that.getTaskList(openid,hotel_id);
          }
          var box_list = that.data.box_list;
          var demand_box_list = that.data.demand_box_list;
          if(demand_box_list.length==0){
            that.getRsRoomlist(openid,hotel_id);
          }
          if(box_list.length==0){
            that.getRoomList(openid,hotel_id);
          }
          
          var loop_play_list = that.data.loop_play_list;
          
          if(loop_play_list.length==0){
            that.getLoopPlay();
          }
        }

        
      }
    },res=>{},{isShowLoading:false})
  },
  isHaveStockHotel:function(user_info){
    var openid = user_info.openid;
    if (user_info.select_hotel_id > 0) {
      var hotel_id = user_info.select_hotel_id;
    } else {
      var hotel_id = user_info.hotel_id;
    }
    var is_pop_notice_wind = app.globalData.is_pop_notice_wind;
    if(is_pop_notice_wind===0){
      
      utils.PostRequest(api_v_url + '/stock/isHaveStockHotel',{
        openid:openid,
        hotel_id:hotel_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        var is_pop_time = data.result.is_pop_time;
          if(is_pop_time==1 &&  app.globalData.is_pop_notice_wind==0){
            wx.showModal({
              title: '提示',
              content: '请您在酒楼宣传片页面点播酒水广告',
              confirmText:'我知道了',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  app.globalData.is_pop_notice_wind = 1;
                  console.log('dddd')
                } else if (res.cancel) {
                  console.log('ssss')
                }
              },complete:function(){
                app.globalData.is_pop_notice_wind = 1;
              }
            })
          }
      },res=>{},{isShowLoading:false})
    }
  },
  /**
   * 获取任务列表
   */
  getTaskList:function(openid,hotel_id){
    var that = this;

    var task_list = that.data.task_list;
    if(task_list.length>0){
      var is_f = false
    }else {
      var is_f = true;
    }
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
    utils.PostRequest(api_v_url + '/record/rolldata',{
      openid:that.data.user_info.openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var loop_play_list = data.result.datalist;
      that.setData({loop_play_list:loop_play_list});
    })
  },
  /**
   * 领取任务弹窗显示详情
   */
  getTaskPopWind:function(e){
    var index = e.currentTarget.dataset.index;
    var canreceive = this.data.task_list.canreceive;
    var task_info = canreceive[index];
    this.setData({task_info:task_info,saleDetailWindowShow:true});
  },
  //进行中的团购任务详情
  getTgTaskPopWind:function(e){
     var index = e.currentTarget.dataset.index;
    var inprogress = this.data.task_list.inprogress;
    var task_info = inprogress[index];
    this.setData({task_info:task_info,tgDetailWindowShow:true});
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
  /**
   * 领取抽奖任务弹窗详情
   */
  getLotteryPopWind:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var canreceive = this.data.task_list.canreceive;
    var lottery_detail_info = canreceive[index];
    lottery_detail_info.tab = 'rule';
    console.log(lottery_detail_info);
    this.setData({lottery_detail_info:lottery_detail_info,lottery_detail_window:true});
  },
  /**
   * 领取餐厅抽奖活动
   */
  startLotteryActivity:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var user_info = that.data.user_info;
    var lottery_detail_info = that.data.lottery_detail_info;
    console.log(lottery_detail_info)
    if(lottery_detail_info.task_type==24){
      var content = '确定要领取此团购活动?'
    }else if(lottery_detail_info.task_type==25){
      var content = '确定要领取此点播广告活动?'
    }else {
      var content = '确定要领取此抽奖活动?'
    }
    wx.showModal({
      title:'提示',
      content:content,
      success:function(res){
        if(res.confirm){
          utils.PostRequest(api_v_url + '/task/receiveTask',{
            openid:user_info.openid,
            hotel_id:user_info.hotel_id,
            task_id:lottery_detail_info.task_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            that.setData({lottery_detail_window:false})
            that.getTaskList(user_info.openid,user_info.hotel_id)
            app.showToast('任务领取成功',2000,'success')
          })
        }
      }
    })
    
  },
  popStartLotterActivyt:function(e){
    var that = this;
    
    var index = e.currentTarget.dataset.index;
    console.log('aa')
    var task_list = this.data.task_list;
    console.log('vbv')
    var l_info = task_list['inprogress'][index];

    that.setData({lottery_activity_window:true,l_info:l_info})
  },
  goHotelLotteryActivity:function(){
    var that  = this;
    var user_info = this.data.user_info;

    var lottery_activity_info = this.data.lottery_activity_info
    console.log(lottery_activity_info)
    var l_info = this.data.l_info;
    var task_user_id = l_info.task_user_id;
    if(lottery_activity_info.start_time==''){
      app.showToast('请选择活动开始时间');
      return false;
    }
    if(lottery_activity_info.lottery_time==''){
      app.showToast('请选择开奖时间');
      return false;
    }
    var activityStartTimeIndex = this.data.activityStartTimeIndex;
    var lotteryStartTimeIndex = this.data.lotteryStartTimeIndex;
    console.log(activityStartTimeIndex)
      console.log(lotteryStartTimeIndex)
    if(activityStartTimeIndex[0]>lotteryStartTimeIndex[0]){
      app.showToast('开始时间应小于开奖时间');
      return false;
    }else if(activityStartTimeIndex[0]==lotteryStartTimeIndex[0]){
      
      if(activityStartTimeIndex[1]>=lotteryStartTimeIndex[1]){
        app.showToast('开始时间应小于开奖时间');
        return false;
      }
    }

    if(lottery_activity_info.lottery_edit==false){
      var url = '/activity/addhotelLottery';
      var msg = '抽奖活动发起成功';
      var content = "确定发起抽奖活动?";
      var activity_id = 0;
    }else{
      var url = '/activity/edithotelLottery';
      var msg = "编辑抽奖活动成功";
      var content = "确定修改此抽奖活动?";
      var activity_id = l_info.activity_id
    }

    wx.showModal({
      title:'提示',
      content:content,
      success:function(res){
        if(res.confirm){
          utils.PostRequest(api_v_url +url,{
            activity_id:activity_id,
            openid:user_info.openid,
            hotel_id:user_info.hotel_id,
            task_user_id:task_user_id,
            scope:lottery_activity_info.activity_scope,
            start_time:lottery_activity_info.start_time,
            lottery_time:lottery_activity_info.lottery_time,
          }, (data, headers, cookies, errMsg, statusCode) => {
            that.getTaskList(user_info.openid,user_info.hotel_id)
            that.setData({lottery_activity_window:false,lottery_activity_info:{activity_scope:1,start_time:'',lottery_time:'',lottery_edit:false}})
            app.showToast(msg,2000,'success');
          })
        }
      }
    })
  },



  editLotteryActivityPopWind:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var task_list = this.data.task_list;
    var lottery_activity_info = this.data.lottery_activity_info;
    var select_time_arr = this.data.select_time_arr;
    
    var l_info = task_list['inprogress'][index];
    var activityStartTimeIndex = l_info.activity_start_time;
    var lotteryStartTimeIndex  = l_info.activity_lottery_time
    lottery_activity_info.lottery_time = select_time_arr[0][l_info.activity_lottery_time[0]]+':'+ select_time_arr[1][l_info.activity_lottery_time[1]]
    lottery_activity_info.start_time   = select_time_arr[0][l_info.activity_start_time[0]]+':'+ select_time_arr[1][l_info.activity_start_time[1]]
    lottery_activity_info.lottery_edit = true;
    lottery_activity_info.activity_scope = l_info.activity_scope
    that.setData({lottery_activity_window:true,l_info:l_info,lottery_activity_info:lottery_activity_info,
      activityStartTimeIndex:activityStartTimeIndex,lotteryStartTimeIndex:lotteryStartTimeIndex})
  },
  

  closePopWind:function(e){
    this.setData({
      saleDetailWindowShow: false,
      tgDetailWindowShow: false,
      judgeWindowShow: false,
      box_index:0,
      taste_wine_info:{'room_id':0,'nums':''},

      lottery_detail_window:false , //抽奖任务弹窗
      lottery_activity_window:false,  //发起抽奖活动弹窗
      lottery_detail_info :{tab:'rule',desc:''},
      lottery_activity_info:{activity_scope:1,start_time:'',lottery_time:'',lottery_edit:false},
      activityStartTimeIndex:[0,0],
      lotteryStartTimeIndex:[0,0],
      popDemandAdsWind:false,
      demand_task_info:[],
    })
  },
  
  

  


  /**
   * 播放任务的电视广告
   */
  boxShowAd:function(e){
    var that = this;
    
    var forscreen_id = (new Date()).valueOf();

    var task_list = this.data.task_list;
    var task_index = this.data.task_index;
    var task_info = task_list.inprogress[task_index]
    var box_list = this.data.box_list;
    var box_index = this.data.box_index;
    var box_mac = box_list[box_index].box_mac;


    var netty_info = {};
    netty_info.action = 5;
    netty_info.url = task_info.tx_url
    netty_info.filename = task_info.filename;
    netty_info.openid = that.data.user_info.openid;
    netty_info.resource_type = 2;
    netty_info.avatarUrl = that.data.user_info.avatarUrl
    netty_info.nickName  = that.data.user_info.nickName;
    netty_info.forscreen_id = forscreen_id;
    netty_info.resource_size = task_info.resource_size
    var msg = JSON.stringify(netty_info);

    utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
      box_mac: box_mac,
      msg: msg,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      app.showToast('点播成功,电视即将开始播放');
      
    });
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
      forscreen_id: forscreen_id,
      openid: that.data.user_info.openid,
      box_mac: box_mac,
      action: 58,
      mobile_brand: mobile_brand,
      mobile_model: mobile_model,
      forscreen_char: '',
      imgs: '["media/resource/' + task_info.filename + '"]',
      small_app_id: app.globalData.small_app_id,
      duration:task_info.duration,
      resource_size:task_info.resource_size,
    }, (data, headers, cookies, errMsg, statusCode) => {

      }, res => { }, { isShowLoading: false })

  },
  /**
   * 检测品鉴酒活动库存并弹窗
   */
  examTasteWineTask:function(e){
    var that = this;
    var pop_type = e.currentTarget.dataset.pop_type;
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
      that.setData({tasteWineTask:tasteWineTask,judgeWindowShow:true,pop_type:pop_type,task_index:index})
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
    var reg = /^[1-9]\d*$/;
    if(!reg.test(send_num)){
      app.showToast('请输入大于0的整数');
      return false;
    }
    if(send_num>tasteWineTask.send_num){
      app.showToast('领取数量不可大于剩余数量')
      return false;
    }
    if(send_num==0){
      app.showToast('领取数量不可小于1')
      return false;
    }

    if(send_num ==''){
      app.showToast('请输入领取份数')
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
      app.showToast('活动发起成功',2000,'success');
    })
  },
  /**
   * 删除失效任务
   */
  delInvalid:function(e){
    var that = this;
    var user_info = this.data.user_info;
    var index = e.currentTarget.dataset.index;
    var task_list = this.data.task_list;
    var task_info = task_list.invalid[index];
    wx.showModal({
      title:'提示',
      content:'确定要删除吗?',
      success:function(res){
        if(res.confirm){
          utils.PostRequest(api_v_url + '/task/delTask',{
            openid:user_info.openid,
            hotel_id:user_info.hotel_id,
            task_user_id:task_info.task_user_id
      
          }, (data, headers, cookies, errMsg, statusCode) => {
            that.getTaskList(user_info.openid,user_info.hotel_id)
            app.showToast('删除成功',2000,'success')
      
          })
        }
      }
    })

    
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    var urls = [];
    for (var i = 0; i < 1; i++) {
      urls[i] = current;
    }
    wx.previewImage({
      current: urls[0], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 宣传片列表
   */
  goToHotelAdv:function(e){
    var that = this;
    var keys = e.currentTarget.dataset.keys
    var task_list = this.data.task_list.inprogress;
    var demand_task_info = task_list[keys];
    that.setData({popDemandAdsWind:true,demand_task_info:demand_task_info});
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
  
  // 选项卡选择
  showLotteryDetailWindowTab: function (e) {
    let self = this;
    console.log(e)
    let tabType = e.currentTarget.dataset.tab;
    var lottery_detail_info = this.data.lottery_detail_info;
    console.log(lottery_detail_info)
    lottery_detail_info.tab = tabType;
    console.log(lottery_detail_info)
    this.setData({lottery_detail_info:lottery_detail_info})
  },
  
  lotteryRoomChange:function(e){
    var activity_scope = e.detail.value;
    var lottery_activity_info = this.data.lottery_activity_info;
    lottery_activity_info.activity_scope = activity_scope;
    this.setData({lottery_activity_info:lottery_activity_info})
  },
  activityStartTimeChange:function(e){
    var select_time_arr = this.data.select_time_arr;

    var time_h = select_time_arr[0][e.detail.value[0]];
    var time_m = select_time_arr[1][e.detail.value[1]];
    var activityStartTimeIndex = this.data.activityStartTimeIndex;
    var lottery_activity_info = this.data.lottery_activity_info;
    activityStartTimeIndex = [e.detail.value[0],e.detail.value[1]];
    var start_time = time_h+':'+time_m;
    lottery_activity_info.start_time = start_time;
    this.setData({activityStartTimeIndex:activityStartTimeIndex,lottery_activity_info:lottery_activity_info})
  },
  lotteryStartTimeChange:function(e){
    var select_time_arr = this.data.select_time_arr;
    var time_h = select_time_arr[0][e.detail.value[0]];
    var time_m = select_time_arr[1][e.detail.value[1]];



    var lotteryStartTimeIndex = this.data.lotteryStartTimeIndex;
    var lottery_activity_info = this.data.lottery_activity_info;
    lotteryStartTimeIndex = [e.detail.value[0],e.detail.value[1]];
    var lottery_time = time_h+':'+time_m;
    lottery_activity_info.lottery_time = lottery_time;
    this.setData({lottery_time:lottery_time,lottery_activity_info:lottery_activity_info,lotteryStartTimeIndex:lotteryStartTimeIndex})


    
  },

  // 打开团购售卖弹窗
  openDrawGroupBuyPosterWindow:function(e){

    let self = this;
    var index = e.currentTarget.dataset.index;
    var task_list = self.data.task_list.inprogress
    var task_info = task_list[index];

    var user_info = this.data.user_info;

    utils.PostRequest(api_v_url + '/salecode/info', {
      hotel_id:user_info.hotel_id,
      openid:user_info.openid,
      task_user_id:task_info.task_user_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var group_info = data.result;


      this.setData({
        showDrawGroupBuyPosterWindow: true
      },function(){
        self.drawGoodsCanvas({
          canvasId: 'goodsCanvas', // 画布标识
          zoomRatio: 750 / app.SystemInfo.windowWidth, // 压缩率
          goods: {
            name: group_info.name, // 商品名称
            picture: group_info.poster_img,
            marketPrice: group_info.line_price, // 原价
            favorablePrice: group_info.price, // 优惠价
            qrImg: group_info.qrcode // 二维码图片
          },
          tipContent: group_info.desc, // 提示信息
          power: {
            logo: 'https://oss.littlehotspot.com/media/resource/btCfRRhHkn.jpg', // 公司logo
            name: group_info.company // 公司名称
          },
          getTempFilePath: function () { // 生成图片临时地址的回调函数
            wx.canvasToTempFilePath({
              canvasId: 'goodsCanvas',
              success: (res) => {
                self.setData({
                  shareTempFilePath: res.tempFilePath
                });
              }
            });
          }
        });
      });
    })
  },

  // 关闭团购售卖弹窗
  closeDrawGroupBuyPosterWindow:function(e){
    let self = this;
    this.setData({
      showDrawGroupBuyPosterWindow: false
    });
  },

  // 保存菜品图片到相册
  saveShareGoodsPic: function (e) {
    let self = this;
    if (!this.data.shareTempFilePath) {
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel: false,
        mask: true
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareTempFilePath,
      success: (res) => {
        wx.showModal({
          title: '提示',
          content: '图片保存成功',
          showCancel: false,
          mask: true,
          success() {
            self.setData({
              showGoodsPopWindow: false
            });
          }
        });
      },
      fail: (err) => {
        wx.showModal({
          title: '提示',
          content: '图片保存失败',
          showCancel: false,
          mask: true
        });
      }
    });
  },

  

  /**
   * 绘制分享商品图片
   * 
   * @param {*} data 生成图片所需要的数据。
   *                 数据结构[data]：
   *                   {
   *                     canvasId: '', // 画布标识
   *                     zoomRatio: 2, // 压缩率
   *                     goods:{
   *                       name:'', // 商品名称
   *                       picture:'', // 商品图片
   *                       marketPrice:'', // 原价
   *                       favorablePrice:'', // 优惠价
   *                       qrImg:'' // 二维码图片
   *                     },
   *                     tipContent: '', // 提示信息
   *                     power:{
   *                       logo:'', // 公司logo
   *                       name:'' // 公司名称
   *                     },
   *                     getTempFilePath: function // 生成图片临时地址的回调函数
   *                   }
   */
  drawGoodsCanvas: function (data) {
    let page = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let pixelRatio = typeof (data.zoomRatio) == 'number' ? data.zoomRatio : 2;
    let x = 0,
        y = 0;

    const canvasContext = utils.createCanvasContext(wx.createCanvasContext(data.canvasId));
    canvasContext.setFillStyle('#FFFFFF');

    let fullWidth = 480,
        fullHeight = 770;
    canvasContext.fillRect(x, y, parseInt(fullWidth / pixelRatio), parseInt(fullHeight / pixelRatio));
    wx.showLoading({
      title: '加载商品图片...',
      mask: true
    });
    wx.getImageInfo({
      src: data.goods.picture,
      success: function (goodsPic) {
        let goodsPicX = 0,
            goodsPicY = y,
            goodsPicWidth = fullWidth,
            goodsPicHeight = 290;
        canvasContext.drawImageAspectFill(goodsPic, parseInt(goodsPicX / pixelRatio), parseInt(goodsPicY / pixelRatio), parseInt(goodsPicWidth / pixelRatio), parseInt(goodsPicHeight / pixelRatio));
        y += goodsPicHeight;
        
        let goodsNameFontSize = 28,
            goodsNameWidth = fullWidth - 20,
            goodsNameHeight = 40,
            goodsNameX = 10,
            goodsNameY = y - (goodsNameHeight - goodsNameFontSize) / 2,
            goodsNameIsCenter = true;
        canvasContext.setFillStyle("#101010");
        canvasContext.drawMultiLineText(data.goods.name, parseInt(goodsNameFontSize / pixelRatio), parseInt(goodsNameX / pixelRatio), parseInt(goodsNameY / pixelRatio), parseInt(goodsNameWidth / pixelRatio), parseInt(goodsNameHeight / pixelRatio), goodsNameIsCenter, 2) * pixelRatio;
        y += goodsNameHeight * 2;
        
        let marketPriceFontSize = 24,
            marketPriceWidth = fullWidth - 40,
            marketPriceHeight = 30,
            marketPriceX = 20,
            marketPriceY = y - (marketPriceHeight - marketPriceFontSize) / 2,
            marketPriceIsCenter = true;
        canvasContext.setFillStyle("#999999");
        canvasContext.drawOneLineText("原价：￥" + data.goods.marketPrice, parseInt(marketPriceFontSize / pixelRatio), parseInt(marketPriceX / pixelRatio), parseInt(marketPriceY / pixelRatio), parseInt(marketPriceWidth / pixelRatio), parseInt(marketPriceHeight / pixelRatio), marketPriceIsCenter) * pixelRatio;
        canvasContext.setFillStyle('#999999');
        canvasContext.fillRect(parseInt((fullWidth - 192) / 2 / pixelRatio), parseInt((marketPriceY + 20) / pixelRatio), parseInt(192 / pixelRatio), parseInt(3 / pixelRatio));
        y += marketPriceHeight;
        
        let favorablePriceFontSize = 28,
            favorablePriceWidth = fullWidth - 40,
            favorablePriceHeight = 30,
            favorablePriceX = 20,
            favorablePriceY = y - (favorablePriceHeight - favorablePriceFontSize) / 2,
            favorablePriceIsCenter = true;
        canvasContext.setFillStyle("#F44444");
        canvasContext.drawOneLineText("限时优惠：￥" + data.goods.favorablePrice, parseInt(favorablePriceFontSize / pixelRatio), parseInt(favorablePriceX / pixelRatio), parseInt(favorablePriceY / pixelRatio), parseInt(favorablePriceWidth / pixelRatio), parseInt(favorablePriceHeight / pixelRatio), favorablePriceIsCenter) * pixelRatio;
        y += favorablePriceHeight + 10;

        wx.showLoading({
          title: '加载二维码图片...',
          mask: true
        });
        wx.getImageInfo({
          src: data.goods.qrImg,
          success: function (qrImg) {
            let qrImgWidth = 220,
                qrImgHeight = 220,
                qrImgX = (fullWidth - qrImgWidth) / 2,
                qrImgY = y;
            canvasContext.drawImageAspectFill(qrImg, parseInt(qrImgX / pixelRatio), parseInt(qrImgY / pixelRatio), parseInt(qrImgWidth / pixelRatio), parseInt(qrImgHeight / pixelRatio));
            y += qrImgHeight + 8;
        
            let tipContentFontSize = 28,
                tipContentWidth = fullWidth - 20,
                tipContentHeight = 30,
                tipContentX = 10,
                tipContentY = y - (tipContentHeight - tipContentFontSize) / 2,
                tipContentIsCenter = true;
            canvasContext.setFillStyle("#58525C");
            canvasContext.drawOneLineText(data.tipContent, parseInt(tipContentFontSize / pixelRatio), parseInt(tipContentX / pixelRatio), parseInt(tipContentY / pixelRatio), parseInt(tipContentWidth / pixelRatio), parseInt(tipContentHeight / pixelRatio), tipContentIsCenter) * pixelRatio;
            y += tipContentHeight;

            wx.showLoading({
              title: '加载 LOGO 图片...',
              mask: true
            });
            wx.getImageInfo({
              src: data.power.logo,
              success: function (logoImg) {
                let powerBlockWidth = fullWidth,
                    powerBlockHeight = 60,
                    powerBlockX = 0,
                    powerBlockY = fullHeight - powerBlockHeight;
                canvasContext.setFillStyle('#58525C');
                canvasContext.fillRect(parseInt(powerBlockX / pixelRatio), parseInt(powerBlockY / pixelRatio), parseInt(powerBlockWidth / pixelRatio), parseInt(powerBlockHeight / pixelRatio));

                let logoImgWidth = 42,
                    powerNameFontSize = 28,
                    powerNameWidth = parseInt(powerNameFontSize / pixelRatio) * data.power.name.length * pixelRatio,
                    spacing = 8;
                    
                let logoImgHeight = 42,
                    logoImgX = (fullWidth - logoImgWidth - powerNameWidth - spacing) / 2,
                    logoImgY = fullHeight - powerBlockHeight + ((powerBlockHeight - logoImgHeight) / 2) + 2,
                    logoImgRadius = 10 / 2;
                canvasContext.drawImageRoundedRect(logoImg, parseInt(logoImgX / pixelRatio), parseInt(logoImgY / pixelRatio), parseInt(logoImgWidth / pixelRatio), parseInt(logoImgHeight / pixelRatio), parseInt(logoImgRadius / pixelRatio));
                x = logoImgX + logoImgWidth;
        
                let powerNameX = x + spacing,
                    powerNameHeight = powerBlockHeight,
                    powerNameY = fullHeight - powerNameHeight - (powerNameHeight - powerNameFontSize) / 2 - 2,
                    powerNameIsCenter = false;
                canvasContext.setFillStyle("#FFFFFF");
                canvasContext.drawOneLineText(data.power.name, parseInt(powerNameFontSize / pixelRatio), parseInt(powerNameX / pixelRatio), parseInt(powerNameY / pixelRatio), parseInt(powerNameWidth / pixelRatio), parseInt(powerNameHeight / pixelRatio), powerNameIsCenter) * pixelRatio;

                canvasContext.draw(false, data.getTempFilePath);
                wx.hideLoading();
              },
              fail: function (logoImg) {
                wx.hideLoading();
              }
            });
          },
          fail: function (qrImg) {
            wx.hideLoading();
          }
        });
      },
      fail: function (goodsPic) {
        wx.hideLoading();
      }
    });
  },
  /**
   * 选择推送点播广告任务的包间
   */
  selectDemandMissionRoom(e){
    var keys = e.currentTarget.dataset.keys;
    this.setData({demand_box_index:keys})

  },
  /**
   * 选择包间后推送点播任务对应的广告
   */
  demandTaskAds(){
    var that = this;
    var demand_task_info = this.data.demand_task_info;
    var demand_box_index = this.data.demand_box_index;
    var demand_box_list = this.data.demand_box_list;
    var box_mac = demand_box_list[demand_box_index].box_mac;
    var ads_id = demand_task_info.ads_id;
    var forscreen_id = (new Date()).valueOf();
    var netty_info = {};
    netty_info.action = 5;
    netty_info.url = demand_task_info.forscreen_url
    netty_info.filename = demand_task_info.filename;
    netty_info.openid = that.data.user_info.openid;
    netty_info.resource_type = 2;
    netty_info.avatarUrl = that.data.user_info.avatarUrl
    netty_info.nickName  = that.data.user_info.nickName;
    netty_info.forscreen_id = forscreen_id;
    netty_info.resource_size = demand_task_info.resource_size
    var msg = JSON.stringify(netty_info);

    utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
      box_mac: box_mac,
      msg: msg,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      app.showToast('点播成功');
      that.setData({popDemandAdsWind:false,demand_box_index:0})
      that.finishDemandadvTask(ads_id,that.data.user_info.openid,that.data.user_info.hotel_id,box_mac);
      
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
        forscreen_id: forscreen_id,
        openid: that.data.user_info.openid,
        box_mac: box_mac,
        action: 59,
        mobile_brand: mobile_brand,
        mobile_model: mobile_model,
        forscreen_char: '',
        imgs: '["media/resource/' + demand_task_info.filename + '"]',
        small_app_id: app.globalData.small_app_id,
        duration:demand_task_info.duration,
        resource_size:demand_task_info.resource_size,
      }, (data, headers, cookies, errMsg, statusCode) => {

      }, res => { }, { isShowLoading: false })
      
    });
    
  },
  finishDemandadvTask:function(ads_id,openid,hotel_id,box_mac){
    utils.PostRequest(api_v_url + '/task/finishDemandadvTask', {
        ads_id:ads_id,
        openid:openid,
        hotel_id:hotel_id,
        box_mac: box_mac,
        
      }, (data, headers, cookies, errMsg, statusCode) => {

      }, res => { }, { isShowLoading: false })
  },

  zyttest:function(){
    wx.redirectTo({
      url: '/store/pages/index',
    })
  }
})