// pages/purchase/shopping/poster.js
/**
 * 商城 - 生成海报页面
 */
const utils = require('../../../utils/util.js')
var mta = require('../../../utils/mta_analysis.js')
const app = getApp()
var api_v_url = app.globalData.api_v_url;
var openid; //用户openid
var goods_id;
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
    wx.hideShareMenu();
    openid = options.openid;
    goods_id = options.goods_id;


    let self = this;
    let testData = {
      canvasId: 'sharePoster',// 画布标识
      page: {
        name: '大董 红豆蛋黄酥300g饼干蛋糕传统点心',
        pic: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg', // 商品图片。1000x1000
        promotePic: 'https://oss.littlehotspot.com/WeChat/resource/promote.png', // 促销图片。320x88
        promotePrice: {// 促销价格
          label: '秒杀价',
          value: '￥58'
        },
        marketPrice: '￥99',
        qrCode: {// 二维码
          pic: 'https://oss.littlehotspot.com/WeChat/resource/qr-code.jpg', // 220x220
          tip: '长按扫码查看'
        },
        power: {// 服务提供者
          pic: 'https://oss.littlehotspot.com/WeChat/resource/favicon.png', // 100x100
          name: '小热点',
          slogan: '为高净值人群提供优质服务'
        }
      },
      success: function () {
        //生成海报日志
        utils.PostRequest(api_v_url + '/purchase/generatePoster', {
          openid: openid,
          poster: '[{ "id":' + goods_id + ', "price":' + testData.page.posterPrice + '}]',
        }, (data, headers, cookies, errMsg, statusCode) => {

        });
        wx.showToast({
          icon: 'none',
          title: '海报生成成功',
        });
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '海报生成失败',
        });
      },
      getTempFilePath: function () {// 生成图片临时地址的回调函数
        wx.canvasToTempFilePath({
          canvasId: 'sharePoster',
          success: (res) => {
            self.setData({
              shareTempFilePath: res.tempFilePath
            });
          }
        });
      }
    };

    utils.PostRequest(api_v_url + '/dish/detail', {
      goods_id: goods_id,
      openid: openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goods_info = data.result;
      if (typeof (goods_info.poster_img) == 'string' && goods_info.poster_img.trim() != '') {
        testData.page.pic = goods_info.poster_img;
        testData.page.qrCode.pic = goods_info.qrcode_url;
        console.log('APISuccess', 'Poster', 'Data', testData);
        self.drawPosterPictureV2(self, testData);
      } else {
        testData.page.name = goods_info.name;
        testData.page.pic = goods_info.cover_imgs[0];
        testData.page.promotePrice.value = '￥' + goods_info.price;
        testData.page.posterPrice = goods_info.price;
        testData.page.marketPrice = goods_info.line_price;
        testData.page.qrCode.pic = goods_info.qrcode_url;
        console.log('APISuccess', 'Poster', 'Data', testData);
        self.drawPosterPicture(self, testData);
      }
    });
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


  drawPosterPicture: function (pageContext, data) {
    let canvasSelf = this;
    wx.showLoading({
      title: '生成海报...',
      mask: true
    });
    try {
      if (typeof (data) != 'object') {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              icon: 'none',
              title: '无绘制画布'
            });
          }
        });
      }
      if (typeof (data.page) != 'object') {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              icon: 'none',
              title: '无绘制数据'
            });
          }
        });
      }
      let systemInfo = app.SystemInfo;
      let documentWidth = systemInfo.documentWidth;
      let canvasWidth = 750;
      let canvasHeight = 1222;
      let pixelRatio = canvasWidth / documentWidth;
      let fontSize = 12;
      let waitCount = 0;
      let x = 0, y = 0, width = 0, height = 0;

      // 设置画布高度
      pageContext.setData({ posterPictureHeight: canvasHeight });

      let canvasContext = utils.createCanvasContext(wx.createCanvasContext(data.canvasId));

      // 绘制背景
      let backgroundLinearGradient = canvasContext.createLinearGradient(0, 0, 0, parseInt(canvasHeight / pixelRatio));
      backgroundLinearGradient.addColorStop(0, '#FDB9A2');
      backgroundLinearGradient.addColorStop(1, '#F74749');
      canvasContext.setFillStyle(backgroundLinearGradient);
      canvasContext.fillRect(x, y, parseInt(canvasWidth / pixelRatio), parseInt(canvasHeight / pixelRatio));

      let __x__ = 28, __y__ = 55, radius = 15;
      let bgRoundedRectX = __x__, bgRoundedRectY = __y__, bgRoundedRectWidth = 694, bgRoundedRectHeight = 1111;
      canvasContext.setFillStyle('#FFFFFF');
      canvasContext.drawRoundedRect(parseInt(bgRoundedRectX / pixelRatio), parseInt(bgRoundedRectY / pixelRatio), parseInt(bgRoundedRectWidth / pixelRatio), parseInt(bgRoundedRectHeight / pixelRatio), parseInt(radius / pixelRatio), true, false);
      canvasContext.save();
      canvasContext.restore();

      // 绘制商品图片
      let picX = __x__, picY = __y__, picWidth = 694, picHeight = 694;
      waitCount++;
      wx.getImageInfo({
        src: data.page.pic, success: function (res) {
          try {
            // 绘制促销图片
            wx.getImageInfo({
              src: data.page.promotePic, success: function (promotePicRes) {
                try {
                  canvasContext.save();
                  canvasContext.restore();
                  canvasContext.drawImageRoundedRectAllCorner(res, parseInt(picX / pixelRatio), parseInt(picY / pixelRatio), parseInt(picWidth / pixelRatio), parseInt(picHeight / pixelRatio), parseInt(radius / pixelRatio), parseInt(radius / pixelRatio), 1, 1);
                  canvasContext.drawImageRoundedRect(promotePicRes, parseInt((picX + 21) / pixelRatio), parseInt((picY + 21) / pixelRatio), parseInt(222 / pixelRatio), parseInt(61 / pixelRatio), parseInt(10 / pixelRatio));
                } catch (error) {
                  wx.showToast({
                    icon: 'none',
                    title: '促销图片[' + data.page.promotePic + ']加载失败',
                  });
                }
              }
            });
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '商品图片[' + data.page.pic + ']加载失败',
            });
          }
          waitCount--;
        }
      });
      x += picX + picWidth; y += picY + picHeight;

      // 促销价格
      let promotePriceLabelX = __x__ + 35, promotePriceLabelY = y + 35;
      canvasContext.save();
      canvasContext.restore();
      canvasContext.setFillStyle('#E82B38');
      canvasContext.setFontSize(parseInt(26 / pixelRatio));
      canvasContext.fillText(data.page.promotePrice.label, parseInt(promotePriceLabelX / pixelRatio), parseInt((promotePriceLabelY + 26 + 8) / pixelRatio));
      x = promotePriceLabelX + canvasContext.measureText(data.page.promotePrice.label).width * pixelRatio;
      canvasContext.fillText(data.page.promotePrice.value.substr(0, 1), parseInt((x + 0) / pixelRatio), parseInt((promotePriceLabelY + 26 + 8) / pixelRatio));
      x += canvasContext.measureText(data.page.promotePrice.value.substr(0, 1)).width * pixelRatio;
      canvasContext.setFontSize(parseInt(50 / pixelRatio));
      canvasContext.fillText(data.page.promotePrice.value.substring(1), parseInt((x + 0) / pixelRatio), parseInt((y + 21 + 50) / pixelRatio));
      x += canvasContext.measureText(data.page.promotePrice.value.substring(1)).width * pixelRatio;

      // 市场价格
      canvasContext.save();
      canvasContext.restore();
      canvasContext.setFillStyle('#999999');
      canvasContext.setFontSize(parseInt(26 / pixelRatio));
      canvasContext.fillText(data.page.marketPrice, parseInt((x + 20) / pixelRatio), parseInt((y + 35 + 26 + 8) / pixelRatio));
      canvasContext.beginPath();
      canvasContext.moveTo(parseInt((x + 20 + 4) / pixelRatio), parseInt((y + 35 + 25) / pixelRatio));
      canvasContext.lineTo(parseInt((x + 20 + canvasContext.measureText(data.page.marketPrice).width * pixelRatio + 4) / pixelRatio), parseInt((y + 35 + 25) / pixelRatio));
      canvasContext.lineWidth = 1; //线的宽度
      canvasContext.strokeStyle = '#999999'; //线的颜色
      canvasContext.lineCap = 'round'; //线的两头圆滑
      canvasContext.stroke();
      x = __x__ + 35, y += 35 + 26;
      canvasContext.save();
      canvasContext.restore();

      // 商品名称
      let nameX = x, nameY = y + 21, nameWidth = 450, nameHeight = 60;
      canvasContext.save();
      canvasContext.restore();
      canvasContext.setFillStyle('#000000');
      fontSize = 50;
      canvasContext.drawMultiLineText(data.page.name, parseInt(fontSize / pixelRatio), parseInt((nameX) / pixelRatio), parseInt((nameY) / pixelRatio), parseInt(nameWidth / pixelRatio), parseInt(nameHeight / pixelRatio), false, 2);

      // 绘制二维码图片
      let qrCodePicX = __x__ + 35 + nameWidth + 30, qrCodePicY = picY + picHeight + 56 + 10, qrCodePicWidth = 153, qrCodePicHeight = 153;
      waitCount++;
      wx.getImageInfo({
        src: data.page.qrCode.pic, success: function (res) {
          try {
            canvasContext.save();
            canvasContext.restore();
            canvasContext.drawImageAspectFill(res, parseInt(qrCodePicX / pixelRatio), parseInt(qrCodePicY / pixelRatio), parseInt(qrCodePicWidth / pixelRatio), parseInt(qrCodePicHeight / pixelRatio));
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '二维码图片[' + data.page.qrCodePic + ']加载失败',
            });
          }
          waitCount--;
        }
      });

      // 二维码提示
      canvasContext.save();
      canvasContext.restore();
      canvasContext.setFillStyle('#999999');
      fontSize = 21;
      canvasContext.drawMultiLineText(data.page.qrCode.tip, parseInt(fontSize / pixelRatio), parseInt(qrCodePicX / pixelRatio), parseInt((qrCodePicY + qrCodePicHeight) / pixelRatio), parseInt(qrCodePicWidth / pixelRatio), parseInt(30 / pixelRatio), true);

      // 服务提供者图片
      let powerPicX = __x__ + 35, powerPicY = 1040, powerPicWidth = 70, powerPicHeight = 70;
      waitCount++;
      wx.getImageInfo({
        src: data.page.power.pic, success: function (res) {
          try {
            canvasContext.save();
            canvasContext.restore();
            canvasContext.drawImageAspectFill(res, parseInt(powerPicX / pixelRatio), parseInt(powerPicY / pixelRatio), parseInt(powerPicWidth / pixelRatio), parseInt(powerPicHeight / pixelRatio));
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '图片[' + data.page.powerPic + ']加载失败',
            });
          }
          waitCount--;
        }
      });
      x = powerPicX + powerPicWidth; y = powerPicY;

      // 服务提供者名称
      let powerNameX = x + 24, powerNameY = y - 4, powerNameWidth = 555, powerNameHeight = 30;
      canvasContext.save();
      canvasContext.restore();
      canvasContext.setFillStyle('#333333');
      fontSize = 26;
      // canvasContext.drawOneLineText(data.page.power.name, parseInt(fontSize / pixelRatio), parseInt((powerNameX - 0.5) / pixelRatio), parseInt((powerNameY) / pixelRatio), parseInt(powerNameWidth / pixelRatio), parseInt(powerNameHeight / pixelRatio), false);
      // canvasContext.drawOneLineText(data.page.power.name, parseInt(fontSize / pixelRatio), parseInt((powerNameX) / pixelRatio), parseInt((powerNameY - 0.5) / pixelRatio), parseInt(powerNameWidth / pixelRatio), parseInt(powerNameHeight / pixelRatio), false);
      canvasContext.drawOneLineText(data.page.power.name, parseInt(fontSize / pixelRatio), parseInt((powerNameX) / pixelRatio), parseInt((powerNameY) / pixelRatio), parseInt(powerNameWidth / pixelRatio), parseInt(powerNameHeight / pixelRatio), false);
      canvasContext.drawOneLineText(data.page.power.name, parseInt(fontSize / pixelRatio), parseInt((powerNameX + 0.5) / pixelRatio), parseInt((powerNameY) / pixelRatio), parseInt(powerNameWidth / pixelRatio), parseInt(powerNameHeight / pixelRatio), false);
      canvasContext.drawOneLineText(data.page.power.name, parseInt(fontSize / pixelRatio), parseInt((powerNameX) / pixelRatio), parseInt((powerNameY + 0.5) / pixelRatio), parseInt(powerNameWidth / pixelRatio), parseInt(powerNameHeight / pixelRatio), false);

      // 服务提供者标语
      let powerSloganX = x + 24, powerSloganY = y + 26 + 10, powerSloganWidth = 555, powerSloganHeight = 30;
      canvasContext.save();
      canvasContext.restore();
      canvasContext.setFillStyle('#999999');
      fontSize = 22;
      canvasContext.drawOneLineText(data.page.power.slogan, parseInt(fontSize / pixelRatio), parseInt((powerSloganX) / pixelRatio), parseInt((powerSloganY) / pixelRatio), parseInt(powerSloganWidth / pixelRatio), parseInt(powerSloganHeight / pixelRatio), false);


      // 统一保存
      canvasContext.save();
      let waitTimer = setInterval(function () {
        if (waitCount > 0) {
          return;
        }
        clearInterval(waitTimer);
        canvasContext.restore();
        canvasContext.draw(false, data.getTempFilePath);
        wx.hideLoading();
        try {
          if (typeof (data.success) == 'function') {
            data.success();
          }
        } catch (error) {
          wx.showToast({
            icon: 'none',
            title: '海报已生成，记录日志失败',
          });
        }
      }, 2000);
    } catch (error) {
      wx.hideLoading();
      console.error(error);
      try {
        if (typeof (data.fail) == 'function') {
          data.fail(error);
        }
      } catch (error2) {
        wx.showToast({
          icon: 'none',
          title: '海报生成失败',
        });
      }
    }
  },

  drawPosterPictureV2: function (pageContext, data) {
    let canvasSelf = this;
    wx.showLoading({
      title: '生成海报...',
      mask: true
    });
    try {
      if (typeof (data) != 'object') {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              icon: 'none',
              title: '无绘制画布'
            });
          }
        });
      }
      if (typeof (data.page) != 'object') {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              icon: 'none',
              title: '无绘制数据'
            });
          }
        });
      }
      let systemInfo = app.SystemInfo;
      let documentWidth = systemInfo.documentWidth;
      let canvasWidth = 750;
      let canvasHeight = 1333.3333333333;
      let pixelRatio = canvasWidth / documentWidth;
      let fontSize = 12;
      let waitCount = 0;
      let x = 0, y = 0, width = 0, height = 0, radius = 0;

      // 设置画布高度
      pageContext.setData({ posterPictureHeight: canvasHeight });

      let canvasContext = utils.createCanvasContext(wx.createCanvasContext(data.canvasId));

      // 绘制商品图片
      if (typeof (data.page.pic) != 'string' || data.page.pic.trim() == '') {
        wx.showToast({
          icon: 'none',
          title: '商品颜值不佳，无法示人',
        });
        return;
      }
      let picX = x, picY = y, picWidth = canvasWidth, picHeight = canvasHeight, picRadius = radius;
      waitCount++;
      wx.getImageInfo({
        src: data.page.pic, success: function (res) {
          console.log('success', res);
          try {
            canvasContext.save();
            canvasContext.restore();
            canvasContext.drawImageRoundedRectAllCorner(res, parseInt(picX / pixelRatio), parseInt(picY / pixelRatio), parseInt(picWidth / pixelRatio), parseInt(picHeight / pixelRatio), parseInt(picRadius / pixelRatio), parseInt(picRadius / pixelRatio), parseInt(picRadius / pixelRatio), parseInt(picRadius / pixelRatio));
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '商品图片[' + data.page.pic + ']渲染失败',
            });
          }
        }, fail: function (a, b) {
          wx.showToast({
            icon: 'none',
            title: '商品图片[' + data.page.pic + ']加载失败',
          });
        }, complete: function (a, b) {
          waitCount--;
        }
      });

      // 绘制二维码图片
      let qrCodePicWidth = 166.6666666667, qrCodePicHeight = 166.6666666667;
      let qrCodePicX = 104.1666666667, qrCodePicY = 1125;
      waitCount++;
      wx.getImageInfo({
        src: data.page.qrCode.pic, success: function (res) {
          try {
            canvasContext.save();
            canvasContext.restore();
            canvasContext.drawImageAspectFill(res, parseInt(qrCodePicX / pixelRatio), parseInt(qrCodePicY / pixelRatio), parseInt(qrCodePicWidth / pixelRatio), parseInt(qrCodePicHeight / pixelRatio));
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '二维码图片[' + data.page.qrCodePic + ']加载失败',
            });
          }
          waitCount--;
        }
      });

      // 统一保存
      canvasContext.save();
      let waitTimer = setInterval(function () {
        if (waitCount > 0) {
          return;
        }
        clearInterval(waitTimer);
        canvasContext.restore();
        canvasContext.draw(false, data.getTempFilePath);
        wx.hideLoading();
        try {
          if (typeof (data.success) == 'function') {
            data.success();
          }
        } catch (error) {
          wx.showToast({
            icon: 'none',
            title: '海报已生成，记录日志失败',
          });
        }
      }, 2000);
    } catch (error) {
      wx.hideLoading();
      console.error(error);
      try {
        if (typeof (data.fail) == 'function') {
          data.fail(error);
        }
      } catch (error2) {
        wx.showToast({
          icon: 'none',
          title: '海报生成失败',
        });
      }
    }
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