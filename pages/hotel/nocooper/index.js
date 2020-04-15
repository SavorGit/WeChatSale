// pages/hotel/register/index.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchant_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;

    utils.PostRequest(api_v_url + '/user/center', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      merchant_id = data.result.merchant_id;
      that.setData({
        merchant_id: merchant_id
      })
      utils.PostRequest(api_v_url + '/merchant/info', {
        merchant_id: merchant_id,
      }, (data, headers, cookies, errMsg, statusCode) => {
        that.setData({
          merchant_info: data.result
        })

      })
      that.getMallGoodsList(openid,merchant_id,22,1);  //获取售全国商品
      /*utils.PostRequest(api_v_url + '/dish/goodslist', {
        merchant_id: merchant_id,
        page: 1,
      }, (data, headers, cookies, errMsg, statusCode) => {
        that.setData({
          dishes_list: data.result
        })
      })*/

    })
  },
  //获取售全国商品
  getMallGoodsList:function(openid,merchant_id,type,page){
    var that = this;
    utils.PostRequest(api_v_url + '/dish/goodslist', {
      openid: openid,
      page: page,
      type:type,
      merchant_id: merchant_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        goods_list: data.result,
      })
    })
  },
  /**
   * 加载更多
   */
  loadMore: function (e) {
    var that = this;
    page += 1;
    var merchant_id = that.data.merchant_id;
    that.getMallGoodsList(openid,merchant_id,22,page);  //获取售全国商品
  },
  /**
   * 菜品置顶
   */
  setTop: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.keys;
    var goods_id = e.currentTarget.dataset.goods_id;
    var dishes_list = that.data.dishes_list;
    var top_item = dishes_list[index];
    wx.showModal({
      title: '提示',
      content: '确认置顶该商品?',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/dish/top', {
            goods_id: goods_id,
            openid: openid,
          }, (data, headers, cookies, errMsg, statusCode) => {
            dishes_list[0].is_top = 0;
            top_item.is_top = 1;

            dishes_list.splice(index, 1);
            dishes_list.unshift(top_item);


            that.setData({
              dishes_list: dishes_list
            })
            app.showToast('置顶成功');
          })
        }
      }
    })



  },
  editDish: function (e) {
    var that = this;
    var goods_id = e.currentTarget.dataset.goods_id;
    var tab = 'nationwide';
    var hotel_type = 3;
    wx.navigateTo({
      url: '/pages/hotel/dishes/edit_dishes?goods_id=' + goods_id + '&openid=' + openid+'&tab='+tab+'&hotel_type=3',
    })
  },
  /**
   * 上架下架商品
   */
  putawayDish: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var goods_id = e.currentTarget.dataset.goods_id;
    var keys = e.currentTarget.dataset.keys;
    if (status == 1) {
      var msg = '确认上架该商品?';
      var toast = '上架成功';
    } else {
      var msg = '确认下架该商品?';
      var toast = '下架成功';
    }
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/dish/putaway', {
            openid: openid,
            goods_id: goods_id,
            status: status
          }, (data, headers, cookies, errMsg, statusCode) => {
            /*var dishes_list = that.data.dishes_list;
            dishes_list[keys].status = status;
            that.setData({
              dishes_list: dishes_list
            })*/
            utils.PostRequest(api_v_url + '/dish/goodslist', {
              openid: openid,
              merchant_id: merchant_id,
              page: page,
            }, (data, headers, cookies, errMsg, statusCode) => {
              that.setData({
                dishes_list: data.result
              })
            })

            app.showToast(toast)
          })
        }
      }
    })

  },
  /**
   * 新增菜品
   */
  addDishes: function (e) {
    var tab = 'nationwide';
    var hotel_type = 3;
    wx.navigateTo({
      url: '/pages/hotel/dishes/add_dishes?merchant_id=' + merchant_id + "&openid=" + openid+'&tab='+tab+'&hotel_type='+hotel_type,
    })
  },
  /**
   * 查看菜品详情
   */
  gotoDeshDetail: function (e) {
    console.log(e)
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/hotel/dishes/detail?goods_id=' + goods_id,
    })
  },
  gotoOrder: function (e) {
    var that = this;
    var merchant_id = that.data.merchant_id;
    
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/hotel/order/goods_list?merchant_id=' + merchant_id + '&openid=' + openid + '&order_status=0',
      })
    }

  },
  // 打开分享菜品窗口
  openShareGoodsWindow: function (e) {
    let self = this;
    console.log(e)
    var pictrue = e.currentTarget.dataset.img_url;
    var qrCode = e.currentTarget.dataset.qrcode;
    var hotel_name = e.currentTarget.dataset.hotel_name;
    var goods_name = e.currentTarget.dataset.goods_name;
    self.setData({ showGoodsPopWindow: true });
    self.drawSharePicture({
      canvasId: 'goodsCanvas',// 画布标识
      object: {
        picture: pictrue, // 展示的图片
        activePicture: 'https://oss.littlehotspot.com/media/resource/wJtZrkyrah.png', // 活动的图片
        name: goods_name, // 名称
        hotel: {
          name: hotel_name // 酒楼名称
        },
        qrCode: qrCode, // 二维码图片
        tipContent: '扫码或长按识别，即可前往购买'// 提示信息
      },
      getTempFilePath: function () {// 生成图片临时地址的回调函数
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
  },
  drawSharePicture: function (data) {
    let canvasSelf = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.getImageInfo({
      src: data.object.picture, success: function (picture) {
        wx.getImageInfo({
          src: data.object.activePicture, success: function (activePicture) {
            wx.getImageInfo({
              src: data.object.qrCode, success: function (qrCode) {
                wx.hideLoading();
                let pixelRatio = 2;
                let x = 0, y = 0, fontSize = 12;
                let __x = 0, __y = 0, __pictureWidth = 0, __pictureHeight = 0, __pictureWidthRatio = 1, __pictureHeightRatio = 1;
                const canvasContext = utils.createCanvasContext(wx.createCanvasContext(data.canvasId));
                canvasContext.setFillStyle('#FFFFFF');

                let fullWidth = 500, fullHeight = 740;
                canvasContext.fillRect(x, y, parseInt(fullWidth / pixelRatio), parseInt(fullHeight / pixelRatio));

                x = 15; y = 15;
                let objectPictureWidth = 470, objectPictureHeight = 300;
                canvasContext.drawImageAspectFill(picture, parseInt(x / pixelRatio), parseInt(y / pixelRatio), parseInt(objectPictureWidth / pixelRatio), parseInt(objectPictureHeight / pixelRatio));

                let activePictureWidth = 125, activePictureHeight = 125;
                x = fullWidth - activePictureWidth; y = 0;
                canvasContext.drawImageAspectFill(activePicture, parseInt(x / pixelRatio), parseInt(y / pixelRatio), parseInt(activePictureWidth / pixelRatio), parseInt(activePictureHeight / pixelRatio));

                x = 25; y += objectPictureHeight + 25;
                fontSize = 28;
                canvasContext.setFillStyle("#333333");
                y = canvasContext.drawOneLineText(data.object.name, parseInt(fontSize / pixelRatio), parseInt(x / pixelRatio), parseInt(y / pixelRatio), parseInt((fullWidth - 50) / pixelRatio)) * pixelRatio;

                x = 25; y += 25;
                fontSize = 24;
                canvasContext.setFillStyle("#a18668");
                y = canvasContext.drawOneLineText(data.object.hotel.name, parseInt(fontSize / pixelRatio), parseInt(x / pixelRatio), parseInt(y / pixelRatio), parseInt((fullWidth - 50) / pixelRatio)) * pixelRatio;

                let qrCodeWidth = 250, qrCodeHeight = 250;
                x = fullWidth / 2 - qrCodeWidth / 2; y += 25;
                canvasContext.drawImageAspectFill(qrCode, parseInt(x / pixelRatio), parseInt(y / pixelRatio), parseInt(qrCodeWidth / pixelRatio), parseInt(qrCodeHeight / pixelRatio));

                let grd = canvasContext.createLinearGradient(0, 0, fullWidth, 0);
                grd.addColorStop(0, '#F19154');
                grd.addColorStop(1, '#F15D61');
                canvasContext.setFillStyle(grd)
                let tipBannerWidth = fullWidth, tipBannerHeight = 50;
                x = 0; y = fullHeight - tipBannerHeight;
                canvasContext.fillRect(parseInt(x / pixelRatio), parseInt(y / pixelRatio), parseInt(tipBannerWidth / pixelRatio), parseInt(tipBannerHeight / pixelRatio));

                let tipContentMetrics = canvasContext.measureText(data.object.tipContent);
                fontSize = 24;
                x = fullWidth / 2 - tipContentMetrics.width * pixelRatio / 2; y = fullHeight - tipBannerHeight / 2 + fontSize / 2 - 2;
                canvasContext.setFontSize(parseInt(fontSize / pixelRatio));
                canvasContext.setFillStyle("#FFFFFF");
                canvasContext.fillText(data.object.tipContent, parseInt(x / pixelRatio), parseInt(y / pixelRatio));

                canvasContext.draw(false, data.getTempFilePath);
              },
              fail: function (picture) {
                wx.hideLoading();
              }
            });
          },
          fail: function (picture) {
            wx.hideLoading();
          }
        });
      },
      fail: function (picture) {
        wx.hideLoading();
      }
    });
  },
  // 关闭分享菜品窗口
  closeShareGoodsWindow: function (e) {
    let self = this;
    self.setData({ showGoodsPopWindow: false });
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
            self.setData({ showGoodsPopWindow: false });
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
  // 打开分享店铺窗口
  openShareShopWindow: function (e) {
    let self = this;
    console.log(e);
    var picture = e.currentTarget.dataset.picture;
    var qrcode_url = e.currentTarget.dataset.qrcode_url;
    var hotel_name = e.currentTarget.dataset.hotel_name;
    var tips = e.currentTarget.dataset.tips;
    self.setData({ showShopPopWindow: true });
    self.drawSharePicture({
      canvasId: 'shopCanvas',// 画布标识
      object: {
        picture: picture, // 展示的图片
        activePicture: 'https://oss.littlehotspot.com/media/resource/wJtZrkyrah.png', // 活动的图片
        name: tips, // 名称
        hotel: {
          name: hotel_name  // 酒楼名称
        },
        qrCode: qrcode_url, // 二维码图片
        tipContent: '扫码或长按识别，即可前往购买'// 提示信息
      },
      getTempFilePath: function () {// 生成图片临时地址的回调函数
        wx.canvasToTempFilePath({
          canvasId: 'shopCanvas',
          success: (res) => {
            self.setData({
              shareTempFilePath: res.tempFilePath
            });
          }
        });
      }
    });
  },

  // 关闭分享店铺窗口
  closeShareShopWindow: function (e) {
    let self = this;
    self.setData({ showShopPopWindow: false });
  },
  // 保存店铺图片到相册
  saveShareShopPic: function (e) {
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
            self.setData({ showShopPopWindow: false });
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

  gotoPlatform: function (e) {
    var that = this;
    var merchant_id = that.data.merchant_id;
    var order_status = e.currentTarget.dataset.order_status
    if (typeof (merchant_id) == 'undefined') {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/hotel/platform/index?merchant_id=' + merchant_id + '&openid=' + openid,
      })
    }
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
    wx.hideHomeButton();

    var that = this;
    
    var merchant_id = that.data.merchant_id;
    if(merchant_id!=''){
      that.getMallGoodsList(openid,merchant_id,22,page);  //获取售全国商品

    }
    
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

  }
})