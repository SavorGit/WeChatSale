// store/pages/goodschargeoff/confirm.js
const utils = require('../../../utils/util.js');

/**
 * 核销 新增核销申请
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var openid;
var page;
Page({

    /**
     * 确认核销记录页面
     */
    data: {
        list: [],
        popEntityInfoWind:false,
        search_config:{start_date:'',end_date:'',chargeoff_list:[],chargeoff_name_arr:[],recycle_status_list:[],
                    recycle_status_name_arr:[]},
        search_data:{start_date:'',end_date:'',chargeoff_index:0,recycle_status_index:0},
        confirm_data:{sdate:'',sdate:'',num:0,integral:0,step_num:0,step_integral:0,confirm_month:'',month:''}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu();
        var is_confirm = 0;
        if(typeof(options.is_confirm)!='undefined'){
            is_confirm = options.is_confirm;
            var sdate = options.sdate
            var edate = options.edate
            var num = options.num
            var integral = options.integral
            var step_num = options.step_num
            var step_integral = options.step_integral
            var confirm_month = options.confirm_month;
            var month = options.month;
            var confirm_data = {sdate:sdate,edate:edate,num:num,integral:integral,step_num:step_num,step_integral:step_integral,confirm_month:confirm_month,month:month}
            var title = month+'月待确认活动激励';
            wx.setNavigationBarTitle({
              title: title,
            })
            this.setData({confirm_data:confirm_data})
        }
        this.setData({is_confirm:is_confirm});
        openid = app.globalData.openid;
        //page   = 1;
        
    
        
    },
    getFilter:function(){
        var that = this;
        var search_config = this.data.search_config;
        var search_data   = this.data.search_data;
        utils.PostRequest(api_v_url + '/writeoff/filter', {
          openid:openid,
        }, (data, headers, cookies, errMsg, statusCode) => {
          var is_confirm = that.data.is_confirm;
          search_config.start_date = data.result.now_month_date[0];
          search_config.end_date   = data.result.now_month_date[1];
          search_data.start_date   = data.result.now_month_date[0];;
          search_data.end_date   = data.result.now_month_date[1];


    
          var recycle_status = data.result.recycle_status;
          search_config.recycle_status_list = recycle_status;
          var recycle_status_name_arr = [];
          for(let i in recycle_status){
            recycle_status_name_arr.push(recycle_status[i].name);
          }
          

          var stock_status = data.result.stock_status;
          search_config.chargeoff_list = stock_status;
          var chargeoff_name_arr = [];
          for(let i in stock_status){
            chargeoff_name_arr.push(stock_status[i].name);
          }
    
          search_config.recycle_status_name_arr = recycle_status_name_arr;
          search_config.chargeoff_name_arr      = chargeoff_name_arr;
          that.setData({search_config:search_config,search_data:search_data});
          
          
          that.getStatdata();
          
          
          that.getChargeOffList(1,is_confirm);
        })
    },
    getStatdata:function(){
        var that = this;
        var search_data = this.data.search_data;
        var search_config = this.data.search_config;
        var recycle_status = search_config.recycle_status_list[search_data.recycle_status_index].recycle_status;
        var wo_status      = search_config.chargeoff_list[search_data.chargeoff_index].status

        utils.PostRequest(api_v_url + '/writeoff/statdata', {
            sdate          : search_data.start_date,
            edate          : search_data.end_date,
            openid         : openid,
            recycle_status : recycle_status,
            wo_status      : wo_status
        }, (data, headers, cookies, errMsg, statusCode) => {
            var statdata = data.result;
            that.setData({statdata:statdata})
        })
    },
    getChargeOffList:function(page,is_confirm=0){
        var that = this;
        var search_data = this.data.search_data;
        //console.log(search_data)
        var search_config = this.data.search_config;
        var recycle_status = search_config.recycle_status_list[search_data.recycle_status_index].recycle_status;
        var wo_status      = search_config.chargeoff_list[search_data.chargeoff_index].status
        //utils.PostRequest(api_v_url + '/stock/getWriteoffList', {

        if(is_confirm==0){
          var params = {openid         : openid,
                        sdate          : search_data.start_date,
                        edate          : search_data.end_date,
                        recycle_status : recycle_status,
                        wo_status      : wo_status,
                        page           : page
                      }
        }else if(is_confirm==1){
          var confirm_data = this.data.confirm_data;
          var params = {openid         : openid,
                        page           : page,
                        sdate          : confirm_data.sdate,
                        edate          : confirm_data.edate,
                        recycle_status : recycle_status,
                        wo_status      : wo_status,
                      }
        }

        utils.PostRequest(api_v_url + '/writeoff/datalist', params, 
        (data, headers, cookies, errMsg, statusCode) => {
          if(page ==1){
            var list = [];
          }else {
            var list = that.data.list;
          }
          var ret_list = data.result.datalist;
          var reward_tips  = data.result.reward_tips;
          if(ret_list.length>0){
            for(let i in ret_list){
              list.push(ret_list[i]);
            }
            that.setData({list:list})
            if(typeof(reward_tips)!='undefined' && reward_tips!=''){
              app.showToast(reward_tips);
            }
          }else {
            
            if(page>1){
              app.showToast('没有更多了...')
            }else{
              that.setData({list:list})
            }
          }
          
        })
    },
    loadMore:function(){
        page ++;
        var is_confirm = this.data.is_confirm;
        this.getChargeOffList(page,is_confirm);
    },
    clickSearchButton:function(){
        page = 1;
        this.getStatdata();
        var is_confirm = this.data.is_confirm;
        this.getChargeOffList(page,is_confirm);
        
    },
    selectParams:function(e){
        var type = e.currentTarget.dataset.type;
        var value = e.detail.value;
        var search_data = this.data.search_data;
        switch(type){
          case 'start_date':
            search_data.start_date = value;
            break;
          case 'end_data':
            search_data.end_date = value;
            break;
          case 'chargeoff':
            search_data.chargeoff_index = value;
            break;
          case 'recycle':
            search_data.recycle_status_index = value;
            break;
        }
        this.setData({search_data:search_data});
    },
    isConfirm:function(e){
        var that = this;
        var type = e.currentTarget.dataset.type;
        if(type ==0){
            wx.navigateBack({
                delta:1
            })
        }else if(type == 1){
            wx.showModal({
              title: '提示',
              content: '是否确认活动激励无误',
              complete: (res) => {
                if (res.confirm) {
                  that.confirmSell();
                }
              }
            })
        }
    },
    confirmSell:function(){
        var confirm_data = this.data.confirm_data;

        utils.PostRequest(api_v_url + '/ActivityPolicy/confirm', {
            openid         : openid,
            confirm_month  : confirm_data.confirm_month
        }, (data, headers, cookies, errMsg, statusCode) => {
            app.showToast('确认成功，激励积分已发放',2000,'success');
            setTimeout(() => {
              wx.navigateBack({
                delta:1
              })
            }, 2000);
        })
    },
    viewChargeOff:function(){
      this.setData({is_confirm:0});
      page = 1;
      this.getStatdata();
      this.getChargeOffList(page,0)
    },
    gotoPage:function(e){
        var type = e.currentTarget.dataset.type;
        var url = '';
        if(type=='addinfo'){//商品资料未添加
            var keys = e.currentTarget.dataset.keys;
            var list = this.data.list;
            var code_msg = list[keys].goods[0].idcode;
        }
        switch(type){
            case 'addinfo':
              url = '/store/pages/goodschargeoff/addinfo?code_msg='+code_msg+'&is_supplement=1';
              break;
        }
        wx.navigateTo({
            url: url,
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
        page = 1;
        this.getFilter();
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