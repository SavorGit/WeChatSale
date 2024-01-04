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
        oss_url: oss_url,
        examplePopWindowOpen: false,
        goods_info:{goods_id:0,goods_name:'',goods_num:0,batch_no:'',demo_img:''},
        policy:'',
        signature:'',
        wine_code_img:[],
        addDisabled:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu();
        openid = app.globalData.openid;
        var goods_id   = options.goods_id;
        var goods_name = options.goods_name;
        var goods_num  = options.goods_num;
        var batch_no   = options.batch_no;
        var demo_img   = options.demo_img;

        var goods_info = this.data.goods_info;
        goods_info.goods_id   = goods_id;
        goods_info.goods_name = goods_name;
        goods_info.goods_num  = goods_num;
        goods_info.batch_no   = batch_no;
        goods_info.demo_img   = demo_img;

        this.setData({goods_info:goods_info});
        this.getWriteoffReasonByGoods(goods_id,goods_num)

        /*var wine_code_img = this.data.wine_code_img;
        for(let i=0;i<goods_num; i++){
            wine_code_img[i] = '';
        }
        this.setData({goods_info:goods_info,wine_code_img:wine_code_img});*/
        this.getOssParams();
    },
    getWriteoffReasonByGoods:function(goods_id,goods_num){
      var that = this;
      utils.PostRequest(api_v_url + '/stock/getWriteoffReasonByGoods', {
        goods_id: goods_id,
        type    : 21
      }, (data, headers, cookies, errMsg, statusCode) => {
        
        var wine_code_img = this.data.wine_code_img;
        var img_datas   = data.result.datas;
        for(let i=0;i<goods_num; i++){
            wine_code_img[i] = img_datas;
        }

        
        console.log(wine_code_img)
        that.setData({wine_code_img:wine_code_img})
      })
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

    addPic:function(e){
        var that = this;
        var policy  = this.data.policy ;
        var signature = this.data.signature;
        var keys = e.currentTarget.dataset.keys;
        var idx  = e.currentTarget.dataset.idx;
        //console.log(this.data.wine_code_img)
        wx.showLoading({
          title: '图片上传中...',
          mask: true
        })
        that.setData({
          addDisabled: true
        })
    
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            //return false;
            
            for(let i in res.tempFilePaths)
            {
              that.uploadImg(res.tempFilePaths[i],policy,signature,keys,idx);
            }
            
          }, fail: function (e) {
            wx.hideLoading();
            that.setData({
              addDisabled: false
            })
          }
        })
      },
      uploadImg:function(filename,policy,signature,keys,idx){
        var that = this;
        var wine_code_img = that.data.wine_code_img;
        console.log(wine_code_img)
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var timestamp = (new Date()).valueOf();
        var postf = filename.substring(index1, index2);//后缀名
        var postf_t = filename.substring(index1, index2);//后缀名
        var postf_w = filename.substring(index1 + 1, index2);//后缀名
    
        var img_url = timestamp + postf;
        wx.uploadFile({
          url: oss_upload_url,
          filePath: filename,
          name: 'file',
          header: {
            'Content-Type': 'image/' + postf_w
          },
          formData: {
            Bucket: "redian-produce",
            name: img_url,
            key: "forscreen/resource/" + img_url,
            policy: policy,
            OSSAccessKeyId: app.globalData.oss_access_key_id,
            sucess_action_status: "200",
            signature: signature
    
          },
    
          success: function (res) {
            
            //var tmp_pic = {id:0,img_path:'',img_url:''};
            
            //wine_code_img[keys][idx].img_url = "forscreen/resource/" + img_url;
            
            wine_code_img[keys][idx].img_url = "forscreen/resource/" + img_url;
            that.setData({wine_code_img:wine_code_img})
            wx.hideLoading();
              setTimeout(function () {
                that.setData({
                  addDisabled: false
                })
              }, 500);
          },
          fail: function ({ errMsg }) {
            wx.hideLoading();
            app.showToast('图片上传失败，请重试')
            that.setData({
              addDisabled: false
            })
          },
        });
    },
    submitApply:function(e){
        var that = this;

        var wine_code_img = that.data.wine_code_img;
        var err_flag = 1;
        var space = '';
        var wine_code_img_str = '';
        for(let i in wine_code_img){
            if(wine_code_img[i]!=''){
                err_flag = 0;
            }
            wine_code_img_str += space + wine_code_img[i];
            space = ',';
        }
        if(err_flag==1){
            app.showToast('请上传瓶盖内二维码照片');
            return false;
        }
        var goods_info = this.data.goods_info;

        wx.showModal({
          title: '提示',
          content: '确定要提交申请?',
          complete: (res) => {
            if (res.cancel) {
              
            }
            
            if (res.confirm) {
                that.setData({addDisabled:true})


                
                utils.PostRequest(api_v_url + '/recycle/applyOpenReward', {
                    openid:openid,
                    imgs  : wine_code_img_str,
                    batch_no : goods_info.batch_no,
                }, (data, headers, cookies, errMsg, statusCode) => {
                    app.showToast('提交成功',2000,'success');
                    setTimeout(function () {
                        wx.navigateBack({delta: 1})
                        that.setData({
                          addDisabled: false
                        })  
                    }, 2000);
                })
            }
          }
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