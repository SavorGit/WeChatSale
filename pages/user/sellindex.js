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
    this.setData({
      exchangerecord: [{
        img: '/images/icon/FFFFFF_horn.png',
        msg: 'a'
      }, {
        img: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg',
        msg: 'b'
      }],
      taskList: [{
        "task_id": "5",
        "task_name": "\u7535\u89c6\u5f00\u673a",
        "img_url": "http:\/\/oss.littlehotspot.com\/media\/resource\/MrBd3KM2Xt.png",
        "desc": "\u5728\u7528\u9910\u65f6\u95f4\u5c06\u7535\u89c6\u5f00\u673a\uff0c\u6bcf\u5f00\u673a1\u5c0f\u65f6\u53ef\u83b7\u5f9725\u79ef\u5206\u7684\u5956\u52b1\u3002\u5348\u9910\u65f6\u95f4\uff1a11:00-14:00\uff1b\u665a\u9910\u65f6\u95f4\uff1a18:00-21:00\u3002\uff08\u5348\u9910\u4e0e\u665a\u9910\u4e24\u4e2a\u65f6\u6bb5\u9700\u8981\u5206\u522b\u5728\u9996\u9875\u8fdb\u884c\u5305\u95f4\u7b7e\u5230\u4e4b\u540e\u60a8\u624d\u53ef\u83b7\u5f97\u6536\u76ca\u54e6\uff5e\uff09",
        "is_shareprofit": "0",
        "integral": 0,
        "progress": "\u4eca\u65e5\u83b7\u5f97\u79ef\u5206"
      }, {
        "task_id": "82",
        "task_name": "\u8bc4\u8bba\u79ef\u5206",
        "img_url": "http:\/\/oss.littlehotspot.com\/media\/resource\/PwQHme8xat.jpeg",
        "desc": "",
        "is_shareprofit": "0",
        "integral": 0,
        "progress": "\u4eca\u65e5\u83b7\u5f97\u79ef\u5206"
      }],
      saleDetailWindowDesc: '<div class="rich-text"><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">奖励规则：</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">1.</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">领取任务即可获得100积分奖励；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">2.</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每个销售人员有3次邀请客人试饮的机会，</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每位客人</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">试饮</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">将</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">奖励对应</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">发起人员100积分；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动说明：</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第1步.您需要点击“邀请客人试饮“来发起；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第2步.发起后您需要选择对应的包间并填写可领取的数量；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第3步.电视出现后活动二维码后邀请客人扫码领取；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第4步.为领取成功的客人倒试饮酒100ml；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">注：</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每瓶赖茅酒500ml，供4人试饮用（每人100ml），</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">剩余部分的酒可以自行处理。</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动有效时间：</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">2021年10月15日--2021年11月15日</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p></div>',
      
    });
    
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

    utils.PostRequest(api_v_url + '/task/checkStock',{
      openid:openid,
      hotel_id:hotel_id,
      task_id:task_id
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
    utils.PostRequest(api_v_url + '/task/checkStock',{
      openid:openid,
      hotel_id:hotel_id,
      box_mac:box_mac,
      send_num:send_num,
      task_user_id:task_user_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({judgeWindowShow:false})
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
      openTaskInWindow: that.data.taskList[taskListIndex]
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