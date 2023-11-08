// store/pages/storein/scanboxcode.js
const utils = require('../../../utils/util.js')

/**
 * 扫码入库 [箱]
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var stock_id;
var goods_id;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        button:{
            type:1,// 1:唯一码；2：酒商码
            class:'theme-button-blue',// theme-button-blue：蓝色；theme-button-welcome：棕色
            text:'扫码'
        },
        goodsList: [],
        scanList: [],
        listTitle:'',
        listTitle2:'',
        scancode_nums:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        wx.hideShareMenu();
        var goods_info = {goods_id:0,name:'',cate_name:'',sepc_name:'',unit_name:''}

        openid = app.globalData.openid;
        stock_id = options.stock_id;
        var goods_info = options.goods_info;
        goods_info = JSON.parse(goods_info);
        goods_info.viewBt    = false;
        var goodsList = this.data.goodsList;
        goodsList.push(goods_info)
        this.setData({goodsList:goodsList});
        this.getScanList(openid,goods_info.stock_detail_id);
    },
    getScanList:function(openid,stock_detail_id){
        var that = this;
        utils.PostRequest(api_v_url + '/stock/getRecords', {
          openid: openid,
          stock_detail_id:stock_detail_id,
        }, (data, headers, cookies, errMsg, statusCode) => {
          var scanList = data.result;
          if(JSON.stringify(scanList)=='{}'){
            var listTitle = '已扫商品码（0）';
            var listTitle2 = '已入库（0）';
            that.setData({listTitle:listTitle,listTitle2:listTitle2});
          }else {
            var listTitle = '已扫商品码（0）';
            var listTitle2 = '已入库（'+scanList.length+'）';
            that.setData({scanList:scanList,listTitle:listTitle,listTitle2:listTitle2,scancode_nums:scanList.length});
          }
          
        })
    },
    scanGoodsCode:function(e){
        var that = this;
        var buttontype = e.currentTarget.dataset.buttontype;

        wx.scanCode({
          onlyFromCamera: true,
          success: (res) => {
            //console.log(res)
            var code_msg = res.result;
            //解码
            that.goodsDecode(code_msg,buttontype);
    
          },fail:function(res){
            app.showToast('二维码识别失败,请重试');
          }
        })
    },
    goodsDecode:function(code_msg,buttontype){
        var that = this;
        var goodsList = this.data.goodsList;
        var goods_info = goodsList[0];
        var scanList = this.data.scanList
        var button = this.data.button;

        if(button.type==1){
            utils.PostRequest(api_v_url + '/stock/scancode', {
                goods_id:goods_info.goods_id,
                openid: app.globalData.openid,
                idcode:code_msg,
                type:10,
                unit_id:goods_info.unit_id,
                stock_detail_id:goods_info.stock_detail_id
            }, (data, headers, cookies, errMsg, statusCode) => {
                var goods_info = data.result;
                var flag = 0;
                for(let i in scanList){
                  if(goods_info.idcode== scanList[i].idcode){
                    var flag = 1;
                    break;
                  }
                }
                if(flag==1){
                  app.showToast('商品已扫码')
                  /*wx.showModal({
                    title: '扫码重复',
                    content: '此商品已有扫码记录，请勿重复扫码',
                    showCancel :false,
                    complete: (res) => {
                      if (res.cancel) {
                        
                      }
                  
                      if (res.confirm) {
                        
                      }
                    }
                  })*/
                }else {
                  goods_info.vintner_code = '';
                  var scancode_nums = this.data.scancode_nums;
                  scancode_nums ++;
                  var listTitle = '已扫商品码('+scancode_nums+')';
                  scanList.push(goods_info);
                  button.type = 2;
                  button.class  = 'theme-button-welcome';
                  button.text   = '扫酒商码';
                  that.setData({scanList:scanList,scancode_nums:scancode_nums,listTitle:listTitle,button:button});
                }
            })
        }else {
            utils.PostRequest(api_v_url + '/stock/scanVintnercode', {
                openid      : app.globalData.openid,
                vintner_code:code_msg,
            }, (data, headers, cookies, errMsg, statusCode) => {
              var vintner_code = data.result.vintner_code;

              var flag = 0;
              for(let i in scanList){
                if(vintner_code== scanList[i].vintner_code){
                  var flag = 1;
                  break;
                }
              }
              if(flag==1){
                wx.showModal({
                  title: '扫码重复',
                  content: '此商品已有扫码记录，请勿重复扫码',
                  showCancel :false,
                  
                })
              }else {
                for(let i in scanList){
                  if(scanList[i].vintner_code==''){
                    scanList[i].vintner_code = vintner_code;
                    break;
                  }
                }
                button.type = 1;
                button.class = 'theme-button-blue';
                button.text  = '扫码';
                that.setData({scanList:scanList,button:button});
              }
              
            })
        }
    },
    deleteScanGoods:function(e){
      var that = this;
      var keys = e.currentTarget.dataset.keys;
      var scanList = this.data.scanList;
      var goods_info = scanList[keys];
      var button = that.data.button;

      var key_nums = keys +1;
      wx.showModal({
        title: '确定要删除吗？',
        success: function (res) {
          if (res.confirm) {
            if(goods_info.status==1){

              if (key_nums==scanList.length){
                button.type = 1;
                button.class = 'theme-button-blue';
                button.text  = '扫码';

              }

              scanList.splice(keys,1);
              var scancode_nums = scanList.length;
              var listTitle = '已扫商品码('+scancode_nums+')';
              

              that.setData({scanList:scanList,scancode_nums:scanList.length,listTitle:listTitle,button:button})
            }else {
              utils.PostRequest(api_v_url + '/stock/delGoodscode', {
                openid:openid,
                idcode:goods_info.idcode,
                type:1
              }, (data, headers, cookies, errMsg, statusCode) => {

                
                
                if (key_nums==scanList.length){
                  button.type = 1;
                  button.class = 'theme-button-blue';
                  button.text  = '扫码';

                }


                var scancode_nums = that.data.scancode_nums
                scancode_nums --;
                scanList.splice(keys,1);

                var listTitle = '已扫商品码('+scancode_nums+')';
                that.setData({scanList:scanList,scancode_nums:scancode_nums,listTitle:listTitle,button:button})
              })
            }
          }
        }
      })  
    },
    cansleStore:function(){
      wx.navigateBack({
        delta: 1,
      })
    },
    completeStore:function(){
      var that = this;
      var goodsList = this.data.goodsList;
      var goods_info = goodsList[0];
      var goods_codes = '';
      var scanList = this.data.scanList;

      var not_perfect = false;
      for(let i in scanList){
        if(scanList[i].vintner_code ==''){
          not_perfect = true;
          
          break;
        }
      }
      if(not_perfect){
        app.showToast('请完善商品的酒商码');
        return false;


      }
      var space = '';
      for(let i in scanList){
        if(scanList[i].status==1){
          goods_codes += space + scanList[i].idcode + '-'+scanList[i].vintner_code;  
          space = ','
        }
        
      }
  
      if(goods_codes==''){
        wx.navigateBack({delta: 1})
      }else{
        wx.showModal({
          title: '确定要完成入库吗？',
          success: function (res) {
            if (res.confirm) {
    
              utils.PostRequest(api_v_url + '/stock/finishInGoods', {
                goods_codes:goods_codes,
                openid:openid,
                stock_detail_id:goods_info.stock_detail_id,
                
               }, (data, headers, cookies, errMsg, statusCode) => {
                 
                 wx.navigateBack({delta: 1})
                 app.showToast('完成入库成功')
               })
            }
          }
        })
      }
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