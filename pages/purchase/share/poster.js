// pages/purchase/share/poster.js
/**
 * 分享 - 生成海报页面
 */


let app = getApp();
let utils = require('../../../utils/util.js');
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
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
        headImg: 'https://oss.littlehotspot.com/WeChat/WeChatSale/pages/purchase/share/poster/head.png',// 头部图片
        footImg: 'https://oss.littlehotspot.com/WeChat/WeChatSale/pages/purchase/share/poster/foot.png',// 底部图片
        list: []
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

    merchant_id = options.merchant_id;
    openid = options.openid;
    //var merchant_name = options.merchant_name
    var post_list = wx.getStorageSync(cache_key + 'cart_set_poster');
    if (post_list == '') {
      post_list = wx.getStorageSync(cache_key + 'cart_poster')
    }
    post_list = JSON.parse(post_list);

    for (var i = 0; i < post_list.length; i++) {
      post_list[i].hotel = post_list[i].hotel;
      post_list[i].area = '\u2762 ' + post_list[i].area_name + ' \u2022 ';
      post_list[i].pic = post_list[i].img_url;
      post_list[i].marketPrice = '￥' + post_list[i].price;
      post_list[i].salePriceTip = '到手价';// 销售价格提示
      if (post_list[i].set_price != '' && typeof (post_list[i].set_price) != 'undefined') {
        post_list[i].salePrice = '￥' + post_list[i].set_price
        post_list[i].recPrice = post_list[i].set_price
      } else {
        post_list[i].salePrice = '￥' + post_list[i].price;
        post_list[i].recPrice = post_list[i].price;
      }

    }
    testData.page.list = post_list;
    testData.success = function () {
      var poster = [];
      for (var j = 0; j < post_list.length; j++) {
        var tmp = {};
        tmp.id = post_list[j].id;
        tmp.price = post_list[j].recPrice;
        poster.push(tmp);
      }
      poster = JSON.stringify(poster);
      console.log * (poster)
      //生成海报日志
      utils.PostRequest(api_v_url + '/purchase/generatePoster', {
        openid: openid,
        poster: poster,
        merchant_id: merchant_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        wx.removeStorageSync(cache_key + 'cart_set_poster');
        wx.removeStorageSync(cache_key + 'cart_poster');
      });
    };
    testData.fail = function () {
      wx.showToast({
        icon: 'none',
        title: '海报生成失败',
      });
    };

    self.drawPosterPicture(self, testData);
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
      title: '加载中...',
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
      let dataList = [];
      if (typeof (data.page.list) == 'object' && data.page.list instanceof Array) {
        dataList = data.page.list;
      }
      let systemInfo = app.SystemInfo;
      let documentWidth = systemInfo.documentWidth;
      let itemBlockHeight = 500;
      let canvasWidth = 750;
      let canvasHeight = 685 + dataList.length * itemBlockHeight;
      let pixelRatio = canvasWidth / documentWidth;
      let fontSize = 12;
      let waitCount = 0;
      let x = 0, y = 0, width = 0, height = 0;
      // let __x,__y,__width,__height;

      // 设置画布高度
      pageContext.setData({ posterPictureHeight: canvasHeight });

      let canvasContext = utils.createCanvasContext(wx.createCanvasContext(data.canvasId));

      // 绘制背景
      canvasContext.setFillStyle('#FFDC11');
      canvasContext.fillRect(x, y, parseInt(canvasWidth / pixelRatio), parseInt(canvasHeight / pixelRatio));
      // canvasContext.draw();
      canvasContext.save();

      // 绘制头部
      let headImgX = 50, headImgY = 60, headImgWidth = 500, headImgHeight = 450;
      waitCount++;
      wx.getImageInfo({
        src: data.page.headImg, success: function (res) {
          try {
            canvasContext.drawImageAspectFill(res, parseInt(headImgX / pixelRatio), parseInt(headImgY / pixelRatio), parseInt(headImgWidth / pixelRatio), parseInt(headImgHeight / pixelRatio));
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '图片[' + data.page.headImg + ']加载失败',
            });
          }
          waitCount--;
        }
      });
      x += headImgX + headImgWidth; y += headImgY + headImgHeight + 20;

      // 绘制商品列表
      // 绘制商品列表
      if (typeof (dataList) == 'object' && dataList instanceof Array && dataList.length > 0) {
        for (let index = 0; index < dataList.length; index++) {
          let item = dataList[index];
          // canvasContext.save();
          // let itemX = 55, itemY = y + 30, itemWidth = 640, itemHeight = 270, borderRadius = 10, isFill = true, isStroke = false;
          // canvasContext.setFillStyle('#FFFFFF');
          // canvasContext.drawRoundedRect(parseInt(itemX / pixelRatio), parseInt(itemY / pixelRatio), parseInt(itemWidth / pixelRatio), parseInt(itemHeight / pixelRatio), parseInt(borderRadius / pixelRatio), isFill, isStroke);
          // itemY += 15;
          // const grd = canvasContext.createLinearGradient(0, 0, parseInt(itemWidth / pixelRatio), parseInt(50 / pixelRatio));
          // grd.addColorStop(0, '#000000');
          // grd.addColorStop(1, '#FFFFFF');
          // canvasContext.setFillStyle(grd);
          // canvasContext.fillRect(parseInt(itemX / pixelRatio), parseInt(itemY / pixelRatio), parseInt(itemWidth / pixelRatio), parseInt(50 / pixelRatio));
          // canvasContext.restore();
          // fontSize = 24;
          // // canvasContext.fillText(item.hotel, parseInt(100 / pixelRatio), parseInt(((itemY + (50 - 30) / 2 + 24)) / pixelRatio));
          // canvasContext.drawOneLineText(item.hotel, parseInt(fontSize / pixelRatio), parseInt(100 / pixelRatio), parseInt((itemY - 15) / pixelRatio), parseInt(600 / pixelRatio), parseInt(50 / pixelRatio));
          // canvasContext.save();
          // itemX += 20, itemY += 50 + 15;
          // let picX = itemX, picY = itemY, picWidth = 175, picHeight = 175;
          // let nameX = itemX + picWidth + 30, nameY = itemY, nameWidth = 400, nameHeight = 80, lineCount = 2;
          // fontSize = 32;
          // canvasContext.setFillStyle('#000000');
          // itemY = canvasContext.drawMultiLineText(item.name, parseInt(fontSize / pixelRatio), parseInt(nameX / pixelRatio), parseInt((nameY + 15) / pixelRatio), parseInt(nameWidth / pixelRatio), parseInt(nameHeight / lineCount / pixelRatio), true, lineCount) * pixelRatio;
          // let salePriceX = itemX + picWidth + 30, salePriceY = itemY + 10, salePriceWidth = 400, salePriceHeight = 40;
          // fontSize = 33;
          // canvasContext.setFillStyle('#F44358');
          // itemY = canvasContext.drawOneLineText(item.salePrice, parseInt(fontSize / pixelRatio), parseInt(salePriceX / pixelRatio), parseInt((salePriceY + 15) / pixelRatio), parseInt(salePriceWidth / pixelRatio), parseInt(salePriceHeight / pixelRatio), true) * pixelRatio;
          // // fontSize = 28;
          // // canvasContext.setFillStyle('#999999');
          // // itemY = canvasContext.drawOneLineText(item.marketPrice, parseInt(fontSize / pixelRatio), parseInt(salePriceX / pixelRatio), parseInt((salePriceY + 15) / pixelRatio), parseInt(salePriceWidth / pixelRatio), parseInt(salePriceHeight / pixelRatio), true) * pixelRatio;
          // canvasContext.restore();
          // waitCount++;
          // wx.getImageInfo({
          //   src: item.pic, success: function (res) {
          //     try {
          //       canvasContext.drawImageArc(res, parseInt(picX / pixelRatio), parseInt(picY / pixelRatio), parseInt(picWidth / pixelRatio), parseInt(picHeight / pixelRatio), parseInt((picWidth > picHeight ? picHeight / 2 : picWidth / 2) / pixelRatio));
          //     } catch (error) {
          //       wx.showToast({
          //         icon: 'none',
          //         title: '图片[' + item.pic + ']加载失败',
          //       });
          //     }
          //     waitCount--;
          //   }
          // });
          // y += 300;


          let itemX = 50, itemY = y + 30, itemWidth = 650, itemHeight = 475, itemBorderRadius = 10;
          let picX = itemX, picY = itemY, picWidth = itemWidth, picHeight = 460, picBorderRadius = itemBorderRadius;
          waitCount++;
          wx.getImageInfo({
            src: item.pic, success: function (res) {
              try {
                canvasContext.drawImageRoundedRect(res, parseInt(picX / pixelRatio), parseInt(picY / pixelRatio), parseInt(picWidth / pixelRatio), parseInt(picHeight / pixelRatio), parseInt(picBorderRadius / pixelRatio));
              } catch (error) {
                wx.showToast({
                  icon: 'none',
                  title: '图片[' + item.pic + ']加载失败',
                });
              }
              waitCount--;
              let hotelGrd = canvasContext.createLinearGradient(parseInt(itemX / pixelRatio), parseInt((itemY + 15) / pixelRatio), parseInt((itemX + 600) / pixelRatio), parseInt((itemY + 65) / pixelRatio));
              hotelGrd.addColorStop(0, '#000000');
              hotelGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');
              canvasContext.setFillStyle(hotelGrd);
              canvasContext.fillRect(parseInt(itemX / pixelRatio), parseInt((itemY + 15) / pixelRatio), parseInt(itemWidth / pixelRatio), parseInt(50 / pixelRatio));
              canvasContext.setFontSize(30);
              fontSize = 24;
              canvasContext.setFillStyle('#FFDC11');
              canvasContext.drawOneLineText(item.area + item.hotel, parseInt(fontSize / pixelRatio), parseInt((itemX + 20) / pixelRatio), parseInt((itemY) / pixelRatio), parseInt(600 / pixelRatio), parseInt(50 / pixelRatio));

              // 底部横条渐变
              canvasContext.beginPath();
              let aX = itemX, aY = itemY + 390;
              const nameGrd = canvasContext.createLinearGradient(parseInt(aX / pixelRatio), parseInt(aY / pixelRatio), parseInt((itemX + itemWidth) / pixelRatio), parseInt((itemY + itemHeight) / pixelRatio));
              nameGrd.addColorStop(0, '#F960A5');
              nameGrd.addColorStop(0.3, '#FF8A81');
              nameGrd.addColorStop(0.7, '#FFCAC1');
              nameGrd.addColorStop(1, '#FFDAA1');
              canvasContext.setFillStyle(nameGrd);
              canvasContext.moveTo(parseInt(aX / pixelRatio), parseInt(aY / pixelRatio));
              canvasContext.lineTo(parseInt((aX + itemWidth - 180) / pixelRatio), parseInt(aY / pixelRatio));
              canvasContext.lineTo(parseInt((aX + itemWidth - 110) / pixelRatio), parseInt((itemY + picHeight) / pixelRatio));
              canvasContext.lineTo(parseInt(aX / pixelRatio), parseInt((itemY + picHeight) / pixelRatio));
              canvasContext.lineTo(parseInt(aX / pixelRatio), parseInt(aY / pixelRatio));
              canvasContext.moveTo(parseInt((aX + itemWidth) / pixelRatio), parseInt(aY / pixelRatio));
              canvasContext.lineTo(parseInt((aX + itemWidth) / pixelRatio), parseInt((itemY + picHeight) / pixelRatio));
              canvasContext.lineTo(parseInt((aX + itemWidth - 70) / pixelRatio), parseInt((itemY + picHeight) / pixelRatio));
              canvasContext.lineTo(parseInt((aX + itemWidth) / pixelRatio), parseInt(aY / pixelRatio));
              canvasContext.fill();

              // 底部箭头渐变
              canvasContext.beginPath();
              let downArrowX = itemX + itemWidth - 175, downArrowY = itemY + 330, downArrowWidth = 170, downArrowHeight = 145;
              let downArrowGrd = canvasContext.createLinearGradient(parseInt(downArrowX / pixelRatio), parseInt(downArrowY / pixelRatio), parseInt(downArrowX / pixelRatio), parseInt((downArrowY + downArrowHeight) / pixelRatio));
              downArrowGrd.addColorStop(0, '#9E95F8');
              downArrowGrd.addColorStop(1, '#EA8ED9');
              canvasContext.setFillStyle(downArrowGrd);
              canvasContext.moveTo(parseInt(downArrowX / pixelRatio), parseInt((downArrowY + 60) / pixelRatio));
              canvasContext.lineTo(parseInt((downArrowX + downArrowWidth / 2) / pixelRatio), parseInt((downArrowY + downArrowHeight) / pixelRatio));
              canvasContext.lineTo(parseInt((downArrowX + downArrowWidth) / pixelRatio), parseInt((downArrowY + 60) / pixelRatio));
              canvasContext.lineTo(parseInt((downArrowX + downArrowWidth - 25) / pixelRatio), parseInt((downArrowY + 60) / pixelRatio));
              canvasContext.lineTo(parseInt((downArrowX + downArrowWidth - 25) / pixelRatio), parseInt(downArrowY / pixelRatio));
              canvasContext.lineTo(parseInt((downArrowX + downArrowWidth - 145) / pixelRatio), parseInt(downArrowY / pixelRatio));
              canvasContext.lineTo(parseInt((downArrowX + downArrowWidth - 145) / pixelRatio), parseInt((downArrowY + 60) / pixelRatio));
              canvasContext.lineTo(parseInt(downArrowX / pixelRatio), parseInt((downArrowY + 60) / pixelRatio));
              canvasContext.fill();

              // 名称显示
              let nameX = itemX + 30, nameY = itemY + 370, nameWidth = 500, nameHeight = 70;
              fontSize = 36;
              canvasContext.setFillStyle('#FFFFFF');
              canvasContext.drawOneLineText(item.name, parseInt(fontSize / pixelRatio), parseInt(nameX / pixelRatio), parseInt(nameY / pixelRatio), parseInt(nameWidth / pixelRatio), parseInt(nameHeight / pixelRatio));

              // 售价提示显示
              let salePriceTipX = downArrowX + 25, salePriceTipY = downArrowY, salePriceTipWidth = 120, salePriceTipHeight = 40;
              fontSize = 28;
              canvasContext.drawOneLineText(item.salePriceTip, parseInt(fontSize / pixelRatio), parseInt(salePriceTipX / pixelRatio), parseInt(salePriceTipY / pixelRatio), parseInt(salePriceTipWidth / pixelRatio), parseInt(salePriceTipHeight / pixelRatio), true);

              // 售价显示
              let salePriceX = downArrowX + 30, salePriceY = downArrowY + 90, salePriceWidth = 120;
              canvasContext.setFontSize(parseInt(22 / pixelRatio));
              canvasContext.fillText(item.salePrice.substr(0, 1), parseInt(salePriceX / pixelRatio), parseInt(salePriceY / pixelRatio), parseInt(salePriceWidth / pixelRatio));
              canvasContext.setFontSize(parseInt(40 / pixelRatio));
              canvasContext.fillText(item.salePrice.substring(1), parseInt((salePriceX + 22) / pixelRatio), parseInt(salePriceY / pixelRatio), parseInt(salePriceWidth / pixelRatio));
            }
          });
          y += itemBlockHeight;
        }
      }

      // 绘制底部
      let footImgX = 50, footImgY = y + 40, footImgWidth = 350, footImgHeight = 65;
      waitCount++;
      wx.getImageInfo({
        src: data.page.footImg, success: function (res) {
          try {
            canvasContext.drawImageAspectFill(res, parseInt((canvasWidth - footImgWidth) / 2 / pixelRatio), parseInt(footImgY / pixelRatio), parseInt(footImgWidth / pixelRatio), parseInt(footImgHeight / pixelRatio));
          } catch (error) {
            wx.showToast({
              icon: 'none',
              title: '图片[' + data.page.footImg + ']加载失败',
            });
          }
          waitCount--;
        }
      });
      x += footImgX + footImgWidth; y += footImgY + footImgHeight;

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