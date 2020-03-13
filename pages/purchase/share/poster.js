// pages/purchase/share/poster.js
/**
 * 分享 - 生成海报页面
 */


let app = getApp();
let utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let testData = {
      canvasId: 'sharePoster',// 画布标识
      page: {
        headImg: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 头部图片
        footImg: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 底部图片
        list: [
          {
            hotel: '北京全聚德烤鸭（前门店）',// 酒楼名称
            name: '传承百年 老北京烤鸭',// 菜品名称
            pic: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 菜品图片
            salePrice: '￥298',// 销售价格
            marketPrice: '￥300'// 市场价格
          },
          {
            hotel: '北京全聚德烤鸭（前门店）',// 酒楼名称
            name: '传承百年 老北京烤鸭',// 菜品名称
            pic: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 菜品图片
            salePrice: '￥298',// 销售价格
            marketPrice: '￥300'// 市场价格
          },
          {
            hotel: '北京全聚德烤鸭（前门店）',// 酒楼名称
            name: '传承百年 老北京烤鸭',// 菜品名称
            pic: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 菜品图片
            salePrice: '￥298',// 销售价格
            marketPrice: '￥300'// 市场价格
          },
          {
            hotel: '北京全聚德烤鸭（前门店）',// 酒楼名称
            name: '传承百年 老北京烤鸭',// 菜品名称
            pic: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 菜品图片
            salePrice: '￥298',// 销售价格
            marketPrice: '￥300'// 市场价格
          },
          {
            hotel: '北京全聚德烤鸭（前门店）',// 酒楼名称
            name: '传承百年 老北京烤鸭',// 菜品名称
            pic: 'https://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',// 菜品图片
            salePrice: '￥298',// 销售价格
            marketPrice: '￥300'// 市场价格
          },
        ]
      },
      /*
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
      */
      getTempFilePath: function () {// 生成图片临时地址的回调函数
        wx.canvasToTempFilePath({
          canvasId: 'sharePoster',
          destWidth: 1080,
          destHeight: 2600,
          success: (res) => {
            self.setData({
              shareTempFilePath: res.tempFilePath
            });
          }
        });
      }
    };
    self.drawPosterPicture(testData);
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


  drawPosterPicture: function (data) {
    let canvasSelf = this;
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // });

    let systemInfo = app.SystemInfo;
    let pixelRatio = systemInfo.pixelRatio;
    let fontSize = 12;
    let canvasWidth = 750;
    let canvasHeight = 1806;
    let x = 0, y = 0, width = 0, height = 0;
    // let __x,__y,__width,__height;

    const canvasContext = utils.createCanvasContext(wx.createCanvasContext(data.canvasId));
    canvasContext.setFillStyle('#FFDC11');
    canvasContext.fillRect(0, 0, parseInt(canvasWidth / pixelRatio), parseInt(canvasHeight / pixelRatio));
    // canvasContext.draw();

    canvasContext.draw(false, data.getTempFilePath);
    /*
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
    */
  },

  // 保存海报图片到相册
  savePosterPictureToAlbum: function (e) {
    let self = this;
    if (!this.data.shareTempFilePath) {
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel: false,
        mask: true
      });
      return;
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
            wx.navigateBack();
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
})