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
    task_list:[],
    box_list:[],
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
    /*var user_info = wx.getStorageSync(cache_key+'userinfo');
    this.setData({user_info:user_info});
    this.getRoomList(user_info.openid,user_info.hotel_id);*/
    this.setData({lotteryWindowShow:true,lotteryDetailWindow:{show:true,tab:'rule'},task_info:{
      rule:'<div class="rich-text"><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">奖励规则：</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">1.</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">领取任务即可获得100积分奖励；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">2.</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每位客人</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">参与</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">将</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">奖励对应</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">发起人员10积分；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动说明：</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第1步.您需要点击“发起餐厅抽奖活动“来发起；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第2步.发起后您需要选择对应的活动范围、活动开始</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">时间、抽奖开始时间；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第3步.到达活动开始时间后，活动范围内的电视将出现</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动参与页面，引导客人扫描电视中二维码参与；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第4步.到达抽奖开始时间后，电视中会开始抽取幸运客</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">人，抽奖结束后需将奖品给予中奖客人；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">注：</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">参与人数需大于xx人才可以正常开奖</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">。</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动有效时间：</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">2021年10月15日--2021年11月15日</span></p></div>',
      prize:'<div style="position: absolute; left: 0px; top: 0px; width: 176px; height: 131px;"><div class="widget rich_text hleft vtop " style="width: 176px; height: 131px; font-size: 14px; text-align: left; line-height: 0px; font-weight: normal; font-style: normal;"><div class="rich-text"><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">一等奖1人：xxxxxxxx一瓶</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">二等奖2人：xxxxx250ml</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">三等奖4人：xxxxx125ml</span></p></div></div></div>'
    }});
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
        if(user_info.select_hotel_id>0 ){

        }else {
          wx.setStorageSync(cache_key+'userinfo', data.result.userinfo)
        }
        
        if(data.result.userinfo.role_type==3){
          wx.redirectTo({
            url: '/pages/waiter/home',
          })
        }else {
          that.setData({user_info:data.result.userinfo})
          var task_list = that.data.task_list;
          if(task_list.length==0){
            that.getTaskList(openid,hotel_id);
          }
          var box_list = that.data.box_list;
          if(box_list.length==0){
            this.getRoomList(openid,hotel_id);
          }
          
          var loop_play_list = that.data.loop_play_list;
          console.log(loop_play_list)
          if(loop_play_list.length==0){
            that.getLoopPlay();
          }
        }

        
      }
    },res=>{},{isShowLoading:false})
  },
  /**
   * 获取任务列表
   */
  getTaskList:function(openid,hotel_id){
    var that = this;

    var task_list = that.data.task_list;
    console.log(task_list)
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
    var that = this;
    
    var forscreen_id = (new Date()).valueOf();

    var task_list = this.data.task_list;
    var task_index = this.data.task_index;
    var task_info = task_list.inprogress[task_index]
    console.log(task_info.filename)
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
  
  // 选项卡选择
  showLotteryDetailWindowTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.tab;
    self.setData({
      lotteryDetailWindow:{
        show:true,
        tab: tabType
      }
    }, function () {
      // self.setNavigationBarTitle(tabType);
    });
  },
  closeLotteryDetailWindow:function(e){
    let self = this;
    self.setData({
      lotteryDetailWindow:{
        show:false
      }
    });
  }
})