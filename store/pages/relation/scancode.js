// store/pages/relation/scancode.js
const utils = require('../../../utils/util.js')

/**
 * 关联酒商码
 */
const app = getApp()
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var oss_upload_url = app.globalData.oss_upload_url;
var openid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scan_code_step:0,  //0:扫热点码  11已扫热点码1-1   12已扫热点码2  21已扫热点码2-1 22已扫热点码2-2 
        scan_code_info:{goods_info:[],winecode:'',img:'',}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu();
        openid = app.globalData.openid;
        this.getOssParams();

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
    //扫码
    scanCode:function(e){
        console.log(e)
        var that = this;
        var type = e.currentTarget.dataset.type;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              console.log(res)
              var code_msg = res.result;
              if(type == 'hotspot'){//扫热点码
                that.decode(code_msg)
                
              }else if(type=='vintner'){//扫酒商码
                var scan_code_info = that.data.scan_code_info;
                scan_code_info.winecode = code_msg;
                that.setData({scan_code_info:scan_code_info,scan_code_step:12})
                
              }
            },fail:function(res){
              app.showToast('二维码识别失败,请重试');
            }
        })
    },
    decode:function(code_msg){
        var that = this;
        var scan_code_info = this.data.scan_code_info;
        utils.PostRequest(api_v_url + '/winecode/scanCode', {
            openid      : openid,
            idcode      : code_msg,
        }, (data, headers, cookies, errMsg, statusCode) => {
            var goods_info = data.result;
            scan_code_info.goods_info.push(goods_info);
            if(goods_info.link_type==1){
                var scan_code_step = 11;
            }else if(goods_info.link_type==2){
                var scan_code_step = 21;
            }
            that.setData({goodsList:scan_code_info.goods_info,scan_code_step:scan_code_step})
        })
    },
    addPic:function(e){
        var that = this;
        var policy  = this.data.policy ;
        var signature = this.data.signature;
        wx.showLoading({
          title: '图片识别中...',
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
            
            for(let i in res.tempFilePaths)
            {
              that.uploadImg(res.tempFilePaths[i],policy,signature);
            }
            
          }, fail: function (e) {
            wx.hideLoading();
            that.setData({
              addDisabled: false
            })
          }
        })
    },
    uploadImg:function(filename,policy,signature){
        var that = this;
        var scan_code_info = that.data.scan_code_info;
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
            
            var head_pic = "forscreen/resource/" + img_url
            utils.PostRequest(api_v_url + '/winecode/getImageCode', {
              openid:openid,
              img_url : head_pic
            }, (data, headers, cookies, errMsg, statusCode) => {
              
              scan_code_info.winecode = data.result.winecode;
              scan_code_info.image    = data.result.image;
              that.setData({scan_code_info:scan_code_info,scan_code_step:22});

            })
          },
          fail: function ({ errMsg }) {
            wx.hideLoading();
            app.showToast('图片上传失败，请重试');
            that.setData({
              addDisabled: false
            })
          },
        });
    },
    //取消关联
    cancelRelation:function(){
        this.setData({scan_code_step:0, 
                      scan_code_info:{goods_info:[],winecode:'',img:''}
                    })
    },
    //保存并继续
    submitInfo:function(){
        var that = this;
        var scan_code_step = this.data.scan_code_step;
        var scan_code_info = this.data.scan_code_info;
        var goods_info = scan_code_info.goods_info[0].goods_id;
        var image = '';
        var winecode = '';
        if(scan_code_step==12){
            winecode = scan_code_info.winecode;
        }else if(scan_code_step==22){
            image = scan_code_info.image;
        }
        wx.showModal({
          title: '提示',
          content: '确定要保存吗?',
          complete: (res) => {
            if (res.confirm) {
                utils.PostRequest(api_v_url + '/winecode/association', {
                    goods_id : goods_info.goods_id,
                    idcode   : goods_info.idcode,
                    image    : image,
                    openid   : openid,
                    winecode : winecode
                }, (data, headers, cookies, errMsg, statusCode) => {



                    that.setData({scan_code_step:0, 
                                  scan_code_info:{goods_info:[],winecode:'',img:''}
                    })
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

    }
})