const verbose = false; // true: 开；false: 关。

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res);
      };
      obj.fail = function (res) {
        reject(res);
      };
      fn(obj);
    });
  };
};

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  wxPromisify: wxPromisify,
  verbose: verbose
};

module.exports.throttle = function (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

/**
 * 发起 HTTPS 网络请求。封装
 * 
 * @para: options Object。  请求能数对象。格式：
 *                {
 *                  url: string,                     // 必填。开发者服务器接口地址
 *                  headers: Object,                 // 设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
 *                  data: string/object/ArrayBuffer, // 请求的参数
 *                  method: string,                  // HTTP 请求方法。默认为 GET
 *                  dataType: string,                // 返回的数据格式。默认为 Json
 *                  isShowLoading: boolean,          // 是否展示 Loading
 *                  responseType: string,            // 响应的数据类型。默认为 Text
 *                  success: function,               // 接口调用成功的回调函数。function(res)
 *                  fail: function,                  // 接口调用失败的回调函数。function(res)
 *                  complete: function               // 接口调用结束的回调函数（调用成功、失败都会执行）。function(res)
 *                }
 */
const HttpRequest = (options) => {
  if (options.isShowLoading != false) {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
  }
  if (typeof (options) != 'object' || options == null) {
    throw "The request arguments is wrong";
  }
  let requestUrl = options.url;
  if (typeof (requestUrl) != 'string') {
    throw "The request 'url' is wrong";
  }
  let requestHeaders = options.header;
  if (typeof (requestHeaders) != 'object') {
    requestHeaders = {};
  }
  let requestMethod = options.method;
  let requestOptions = {
    url: requestUrl,
    headers: requestHeaders,
    data: options.data,
    method: options.method,
    dataType: options.dataType,
    responseType: options.responseType,
    success: function () {
      var successFnArgumentArray = [].slice.call(arguments);
      if (verbose == true) {
        console.log('util.HttpRequest.success', 'function', requestUrl, options.data, options.method, successFnArgumentArray);
      }
      if (options.isShowLoading != false) {
        wx.hideLoading();
      }
      if (typeof (options.success) == "function") {
        try {
          options.success.apply(requestOptions, successFnArgumentArray);
        } catch (err) {
          requestOptions.error.call(requestOptions, err);
        }
      }
    },
    fail: function () {
      var failFnArgumentArray = [].slice.call(arguments);
      if (verbose == true) {
        console.log('util.HttpRequest.fail', 'function', requestUrl, options.data, options.method, failFnArgumentArray);
      }
      if (options.isShowLoading != false) {
        wx.hideLoading();
      }
      if (typeof (options.fail) == "function") {
        try {
          options.fail.apply(requestOptions, failFnArgumentArray);
        } catch (err) {
          requestOptions.error.call(requestOptions, err);
        }
      }
    },
    error: function (err) {
      console.error(err);
    },
    complete: function () {
      var completeFnArgumentArray = [].slice.call(arguments);
      if (verbose == true) {
        console.log('util.HttpRequest.complete', 'function', requestUrl, options.data, options.method, completeFnArgumentArray);
      }
      if (typeof (options.complete) == "function") {
        try {
          options.complete.apply(requestOptions, completeFnArgumentArray);
        } catch (err) {
          requestOptions.error.call(requestOptions, err);
        }
      }
    }
  };
  wx.request(requestOptions);
};
module.exports.HttpRequest = HttpRequest;

/**
 * 发起 HTTPS 网络请求。封装为热点使用
 *
 * @para: options Object。  请求能数对象。格式：
 *                {
 *                  url: string,                     // 必填。开发者服务器接口地址
 *                  headers: Object,                 // 设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
 *                  data: string/object/ArrayBuffer, // 请求的参数
 *                  method: string,                  // HTTP 请求方法。默认为 GET
 *                  dataType: string,                // 返回的数据格式。默认为 Json
 *                  responseType: string,            // 响应的数据类型。默认为 Text
 *                  isShowLoading: boolean,          // 是否展示 Loading
 *                  isShowToastForSuccess:boolean,   // 是否在 success 方法中弹出系统Toast
 *                  success: function,               // 接口调用成功的回调函数。function(data, headers, cookies, errMsg, statusCode)
 *                  isShowToastForFail:boolean,      // 是否在 fail 方法中弹出系统Toast
 *                  fail: function,                  // 接口调用失败的回调函数。function(res)
 *                  complete: function               // 接口调用结束的回调函数（调用成功、失败都会执行）。function(res)
 *                }
 * }
 */
const HttpRequestForLHS = (options) => HttpRequest({
  url: options.url,
  headers: options.headers,
  data: options.data,
  method: options.method,
  dataType: options.dataType,
  responseType: options.responseType,
  isShowLoading: options.isShowLoading,
  success: function (res) {
    var httpRequst = this;
    if (verbose == true) {
      console.log('util.HttpRequestForLHS.success', 'function', options.url, options.data, options.method, res);
    }
    var statusCode = res.statusCode;
    if (parseInt(statusCode / 100) != 2) {
      httpRequst.fail.call(httpRequst, {
        'errMsg': 'statusCode:' + statusCode
      });
      return;
    }
    var responseData = res.data;
    if (typeof (responseData) != 'object' || responseData == null) {
      // wx.showLoading({
      //   mask: true
      // });
      httpRequst.fail.call(httpRequst, {
        'errMsg': "Response 'data' is wrong"
      });
      return;
    }
    if (options.isShowToastForSuccess != false && responseData.code != 10000) {
      wx.showToast({
        title: responseData.msg,
        icon: 'none',
        mask: true,
        duration: 5000,
        complete: function () {
          setTimeout(function () {
            // wx.showLoading({
            //   mask: true
            // });
            httpRequst.fail.call(httpRequst, {
              'code': responseData.code,
              'errMsg': responseData.msg
            });
          }, 5000);
        }
      });
      return;
    }
    var responseHeaders = res.header;
    var responseCookies = res.cookies;
    var errMsg = res.errMsg;
    if (typeof (options.success) == "function") {
      options.success.call(this, responseData, responseHeaders, responseCookies, errMsg, statusCode);
    }
  },
  fail: function (res) {
    var failFnArgumentArray = [].slice.call(arguments);
    if (verbose == true) {
      console.log('util.HttpRequestForLHS.fail', 'function', options.url, options.data, options.method, res, failFnArgumentArray);
    }
    if (typeof (options.fail) == "function") {
      if (options.isShowToastForFail != false && !res.code) {
        wx.showToast({
          title: "网络异常！请稍后重试",
          icon: 'none',
          mask: true,
          duration: 2000,
          complete: function () {
            setTimeout(function () {
              options.fail.apply(this, failFnArgumentArray);
            }, 2000);
          }
        });
      } else {
        options.fail.apply(this, failFnArgumentArray);
      }
    }
  },
  complete: options.complete
});
module.exports.HttpRequestForLHS = HttpRequestForLHS;

/**
 * 发起 HTTPS 网络 POST 请求。
 *
 * @para: url                   string。                    必填。开发者服务器接口地址
 * @para: data                  string/object/ArrayBuffer。 请求的参数
 * @para: successFn             function。                  接口调用成功的回调函数。function(data, headers, cookies, errMsg, statusCode)
 * @para: failFn                function。                  接口调用失败的回调函数。function(res)
 * @para: options               object,                     {
 *                                                              isShowLoading:          boolean,    // 是否展示 Loading
 *                                                              isShowToastForSuccess:  boolean,    // 是否在 success 方法中弹出系统Toast
 *                                                              isShowToastForFail:     boolean,    // 是否在 fail 方法中弹出系统Toast
 *                                                              complete:               function,   // 完成方法
 *                                                          }             
 */
const PostRequest = (url, data, successFn, failFn, options) => {
  if (typeof (options) != 'object') {
    options = {};
  }
  HttpRequestForLHS({
    url: url,
    data: data,
    method: 'POST',
    isShowLoading: options.isShowLoading,
    isShowToastForSuccess: options.isShowToastForSuccess,
    success: successFn,
    isShowToastForFail: options.isShowToastForFail,
    fail: failFn,
    complete: options.complete
  });
};
module.exports.PostRequest = PostRequest;

/**
 * 发起 HTTPS 网络 GET 请求。
 *
 * @para: url                   string。                    必填。开发者服务器接口地址
 * @para: data                  string/object/ArrayBuffer。 请求的参数
 * @para: successFn             function。                  接口调用成功的回调函数。function(data, headers, cookies, errMsg, statusCode)
 * @para: failFn                function。                  接口调用失败的回调函数。function(res)
 * @para: options               object,                     {
 *                                                              isShowLoading:          boolean,    // 是否展示 Loading
 *                                                              isShowToastForSuccess:  boolean,    // 是否在 success 方法中弹出系统Toast
 *                                                              isShowToastForFail:     boolean,    // 是否在 fail 方法中弹出系统Toast
 *                                                              complete:               function,   // 完成方法
 *                                                          }
 */
const GetRequest = (url, data, successFn, failFn, options) => {
  if (typeof (options) != 'object') {
    options = {};
  }
  HttpRequestForLHS({
    url: url,
    data: data,
    method: 'GET',
    isShowLoading: options.isShowLoading,
    isShowToastForSuccess: options.isShowToastForSuccess,
    success: successFn,
    isShowToastForFail: options.isShowToastForFail,
    fail: failFn,
    complete: options.complete
  });
};
module.exports.GetRequest = GetRequest;

const TouchMoveHandler = function (systemInfo, touchMoveExecuteTrip) {
  if (typeof (systemInfo) != "object") {
    throw '"systemInfo" is not object';
  }

  this.options = {
    systemInfo: systemInfo,
    touchMoveExecuteTrip: touchMoveExecuteTrip,
    moveExecuteTrip: 0
  }

  /**
   * 输入字符串或数字转换成数字。结果单位为：px。
   * 
   * @para argumentName    参数名
   * @para pixelValue      开始滑动的事件
   * @return 返回以 PX 为单位的数字。
   */
  this.turnPixel = function (argumentName, pixelValue) {
    let handler = this;
    let __movePixelValue = 0;
    if (typeof (pixelValue) == "string") {
      let pixelValueLength = pixelValue.length;
      if (pixelValue.endsWith("rpx")) {
        // __movePixelValue = parseFloat(pixelValue.substr(0, pixelValueLength - 3)) / handler.options.systemInfo.pixelRatio;
        __movePixelValue = parseFloat(pixelValue) / handler.options.systemInfo.pixelRatio;
      } else if (pixelValue.endsWith("px")) {
        // __movePixelValue = parseFloat(pixelValue.substr(0, pixelValueLength - 2));
        __movePixelValue = parseFloat(pixelValue);
      }
    } else if (typeof (pixelValue) == "number") {
      __movePixelValue = pixelValue;
    } else {
      throw '"' + argumentName + '" is wrong';
    }
    if (__movePixelValue < 0) {
      throw '"' + argumentName + '" is out of range';
    }
    if (typeof (__movePixelValue) == "number") {
      return __movePixelValue;
    } else {
      throw 'unknow error';
    }
  };
  this.options.moveExecuteTrip = this.turnPixel('touchMoveExecuteTrip', touchMoveExecuteTrip);

  this.Event = { // 滑动事件定义
    Start: 0x00, // 滑动开始
    InsufficientData: 0x01, // 数据量不足
    UndifindedStartTouchEvent: 0x90, // 没有开始滑动事件
    UndifindedEndTouchEvent: 0x99, // 没有结束滑动事件
    UndifindedSlideType: 0x92, // 没有滑动类型
    LeftSlide: 0x10, // 向左滑动开始
    LeftSlideMoved: 0x19, // 向左滑动完成
    RightSlide: 0x20, // 向右滑动开始
    RightSlideMoved: 0x29, // 向右滑动完成
    ReturnToOrigin: 0x80, // 返回原点滑动开始
    ReturnToOriginMoved: 0x89 // 返回原点滑动完成
  };
  this.SlideType = { // 滑动类型定义
    LeftSlide: -1, // 向左滑动
    RightSlide: 1 // 向右滑动
  };

  /**
   * 手指滑动处理
   *
   * @para page                页面对象
   * @para startEvent          开始滑动的事件
   * @para endEvent            结束滑动的事件
   * @para callbackFunction    执行动画完成后回调函数。返回 Argument{
   *                                                           handleEvent // 处理事件
   *                                                           page // 页面对象
   *                                                           startEvent // 手指滑动开始事件
   *                                                           endEvent // 手指滑动结束事件
   *                                                           top // 元素上边距
   *                                                           left // 元素左边距
   *                                                           x // 元素移动距离
   *                                                      }
   */
  this.touchMoveHandle = function (page, startEvent, endEvent, callbackFunction) {
    // console.log(page, startEvent, endEvent);
    let handler = this;
    handler.callbackHandel(callbackFunction, handler.Event.Start, page, startEvent, endEvent);
    if (typeof (startEvent) != 'object' || startEvent == null) {
      handler.callbackHandel(callbackFunction, handler.Event.UndifindedStartTouchEvent, page, startEvent, endEvent);
      console.error('start-touch-event is null');
      return;
    }
    if (typeof (endEvent) != 'object' || endEvent == null) {
      handler.callbackHandel(callbackFunction, handler.Event.UndifindedEndTouchEvent, page, startEvent, endEvent);
      console.error('end-touch-event is null');
      return;
    }
    let tripX = endEvent.touches[0].pageX - startEvent.touches[0].pageX;
    let tripY = endEvent.touches[0].pageY - startEvent.touches[0].pageY;
    let tripLeft = tripX + 0;
    let tripTop = tripY + handler.options.systemInfo.statusBarHeight + 46;
    if (tripX <= -1 * handler.options.moveExecuteTrip) { // 向左滑动处理
      let x = (handler.options.systemInfo.screen.width + tripLeft) * -1;
      handler.callbackHandel(callbackFunction, handler.Event.LeftSlide, page, startEvent, endEvent, tripTop, tripLeft, x);
      handler.moveOnhorizontalHandel(page, tripTop, tripLeft, x, startEvent, endEvent, callbackFunction);
      handler.callbackHandel(callbackFunction, handler.Event.LeftSlideMoved, page, startEvent, endEvent, tripTop, tripLeft, x);
    } else if (tripX >= handler.options.moveExecuteTrip) { // 向右滑动处理
      let x = handler.options.systemInfo.screen.width - tripLeft;
      handler.callbackHandel(callbackFunction, handler.Event.RightSlide, page, startEvent, endEvent, tripTop, tripLeft, x);
      handler.moveOnhorizontalHandel(page, tripTop, tripLeft, x, startEvent, endEvent, callbackFunction);
      handler.callbackHandel(callbackFunction, handler.Event.RightSlideMoved, page, startEvent, endEvent, tripTop, tripLeft, x);
    } else {
      handler.callbackHandel(callbackFunction, handler.Event.ReturnToOrigin, page, startEvent, endEvent, tripTop, tripLeft);
      handler.returnToOriginHandel(page, startEvent, endEvent);
      handler.callbackHandel(callbackFunction, handler.Event.ReturnToOriginMoved, page, startEvent, endEvent, tripTop, tripLeft);
    }
  };

  /**
   * 点击滑动处理
   *
   * @para page                页面对象
   * @para slideType           滑动类型
   * @para trip                滑动行程
   * @para wechartEvent        微信的事件
   * @para callbackFunction    执行动画完成后回调函数。返回 Argument{
   *                                                           handleEvent // 处理事件
   *                                                           page // 页面对象
   *                                                           startEvent // 手指滑动开始事件
   *                                                           endEvent // 手指滑动结束事件
   *                                                           top // 元素上边距
   *                                                           left // 元素左边距
   *                                                           x // 元素移动距离
   *                                                      }
   */
  this.clickMoveHandle = function (page, slideType, trip, wechartEvent, callbackFunction) {
    // console.log(page, startEvent, endEvent);
    let handler = this;
    let startEvent = wechartEvent,
      endEvent = wechartEvent;
    handler.callbackHandel(callbackFunction, handler.Event.Start, page, startEvent, endEvent);
    if (typeof (slideType) != 'number') {
      handler.callbackHandel(callbackFunction, handler.Event.UndifindedSlideType, page, startEvent, endEvent);
      console.error('start-event is null');
      return;
    }
    let tripLeft = 0;
    let tripTop = handler.options.systemInfo.statusBarHeight + 46;
    if (slideType === handler.SlideType.LeftSlide) { // 向左滑动处理
      let x = this.turnPixel('trip', trip) * -1;
      handler.callbackHandel(callbackFunction, handler.Event.LeftSlide, page, startEvent, endEvent, tripTop, tripLeft, x);
      handler.moveOnhorizontalHandel(page, tripTop, tripLeft, x, startEvent, endEvent, callbackFunction);
      handler.callbackHandel(callbackFunction, handler.Event.LeftSlideMoved, page, startEvent, endEvent, tripTop, tripLeft, x);
    } else if (slideType === handler.SlideType.RightSlide) { // 向右滑动处理
      let x = this.turnPixel('trip', trip);
      handler.callbackHandel(callbackFunction, handler.Event.RightSlide, page, startEvent, endEvent, tripTop, tripLeft, x);
      handler.moveOnhorizontalHandel(page, tripTop, tripLeft, x, startEvent, endEvent, callbackFunction);
      handler.callbackHandel(callbackFunction, handler.Event.RightSlideMoved, page, startEvent, endEvent, tripTop, tripLeft, x);
    }
  };

  /**
   * 返回原点处理
   *
   * @para page                页面对象
   * @para startEvent          开始滑动的事件
   * @para endEvent            结束滑动的事件
   */
  this.returnToOriginHandel = function (page, startEvent, endEvent) {
    let handler = this;
    let animation = wx.createAnimation({
      duration: 100,
      // timingFunction: 'cubic-bezier(.8,.2,.1,0.8)'
    });
    animation.left(0).top(handler.options.systemInfo.statusBarHeight + 46).step({
      duration: 100,
      timingFunction: 'ease'
    });
    page.setData({
      animationData: animation.export()
    });
    setTimeout(function () {
      page.setData({
        animationData: {}
      });
    }, 100);
  };

  /**
   * 水平移动处理
   *
   * @para page                页面对象
   * @para startEvent          开始滑动的事件
   * @para endEvent            结束滑动的事件
   * @para top                 上边距
   * @para left                左边距
   * @para x                   水平滑动行程
   * @para callbackFunction    执行动画完成后回调函数。返回 Argument{
   *                                                           handleEvent // 处理事件
   *                                                           page // 页面对象
   *                                                           startEvent // 手指滑动开始事件
   *                                                           endEvent // 手指滑动结束事件
   *                                                           top // 元素上边距
   *                                                           left // 元素左边距
   *                                                           x // 元素移动距离
   *                                                      }
   */
  this.moveOnhorizontalHandel = function (page, top, left, x, startEvent, endEvent, callbackFunction) {
    if (verbose == true) {
      console.log("TouchMoveHandler.moveOnhorizontalHandel(page, top, left, x, startEvent, endEvent, callbackFunction)", page, startEvent, endEvent, top, left, x);
    }
    let handler = this;
    let animation = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear'
      // timingFunction: 'cubic-bezier(.8,.2,.1,0.8)'
    });
    animation.left(left).top(top).translateX(x).translateY(0).step({
      duration: 150,
      timingFunction: 'linear'
    });
    let __cardsModelData = page.data.cards_img;
    __cardsModelData.shift();
    page.setData({
      __cardsModelData: __cardsModelData,
      animationData: animation.export()
    });
    setTimeout(function () {
      if (page.data.__cardsModelData.length > 0) {
        page.setData({
          'cards_img[0]': page.data.__cardsModelData[0],
          animationData: {}
        });
      } else {
        page.setData({
          animationData: {}
        });
      }
      setTimeout(function () {
        let backupAnimation = wx.createAnimation({
          duration: 0,
          // timingFunction: 'cubic-bezier(.8,.2,.1,0.8)'
        });
        backupAnimation.left(0).top(handler.options.systemInfo.statusBarHeight + 46).translateX(0).translateY(0).step({
          duration: 0,
          timingFunction: 'step-start',
          // timingFunction: 'ease-out',
          // transformOrigin: '100% 0 0'
        });
        page.setData({
          animationData: backupAnimation.export()
        });
        setTimeout(function () {
          if (page.data.__cardsModelData.length >= 3) {
            page.setData({
              'cards_img[1]': page.data.__cardsModelData[1],
              'cards_img[2]': page.data.__cardsModelData[2],
              animationData: {}
            });
          } else {
            // let cards_img = page.data.cards_img;
            // cards_img.splice(1, 1);
            page.setData({
              cards_img: page.data.__cardsModelData,
              animationData: {}
            });
          }
          if (verbose == true) {
            console.log("TouchMoveHandler.moveOnhorizontalHandel(page, top, left, x, startEvent, endEvent, callbackFunction)#setTimeout", page.data.cards_img, page.data.__cardsModelData);
          }
          if (page.data.__cardsModelData.length <= 3) {
            handler.callbackHandel(callbackFunction, handler.Event.InsufficientData, page, startEvent, endEvent, top, left, x);
          }
        }, 0);
      }, 200);
    }, 150);
  };

  /**
   * 回调处理
   *
   * @para callback            执行动画完成后回调函数
   * @para handleEvent         处理事件
   * @para page                页面对象
   * @para startEvent          开始滑动的事件
   * @para endEvent            结束滑动的事件
   * @para top                 上边距
   * @para left                左边距
   * @para x                   水平滑动行程
   */
  this.callbackHandel = function (callback, handleEvent, page, startEvent, endEvent, top, left, x) {
    let handler = this;
    if (typeof (callback) != 'function') {
      return;
    }
    callback(handleEvent, page, startEvent, endEvent, top, left, x);
  }
};
module.exports.TouchMoveHandler = TouchMoveHandler;

const createCanvasContext = (canvasContext) => {
  /**
   * 绘制单行文本，由于文字比较多，这里我们写了一个函数处理
   * 在此方法前，执行setFillStyle为字体着色
   * 
   * @param str          字符串
   * @param fontSize     文字大小
   * @param left         左边距
   * @param top          上边距
   * @param canvasWidth  文本最大宽度
   * @param lineHeight   行高
   * @return y 上边距 
   */
  canvasContext.drawOneLineText = function (str, fontSize, left, top, canvasWidth, lineHeight, isCenter) {
    // // console.log('utils.createCanvasContext.drawOneLineText', str, fontSize, left, top, canvasWidth, lineHeight);
    // let lineWordCount = parseInt(canvasWidth / fontSize);
    // this.setFontSize(fontSize);
    // if (typeof (lineHeight) != 'number') { lineHeight = fontSize; }
    // top += lineHeight;
    // if (lineWordCount >= str.length) {
    //   let _left = left;
    //   if (isCenter == true) {
    //     _left += (canvasWidth - this.measureText(str).width) / 2;
    //   }
    //   this.fillText(str, _left, top);
    //   // this.fillText(str, left + 115 - this.measureText(str).width / 2, top);
    //   return top;
    // }
    // let lineString = '', printString = '', cutOffset = 0;
    // do {
    //   cutOffset++;
    //   lineString = str.substring(0, lineWordCount - cutOffset);
    //   printString = lineString + '...';
    // } while (canvasWidth - this.measureText(printString).width <= fontSize);
    // let _left = left;
    // if (isCenter == true) {
    //   _left += (canvasWidth - this.measureText(str).width) / 2;
    // }
    // this.fillText(printString, _left, top);
    // // this.fillText(printString, left + 115 - this.measureText(printString).width / 2, top);
    // return top;
    return this.__drawMultiLineText(str, fontSize, left, top, canvasWidth, lineHeight, isCenter, 1, 1);
  };
  /**
   * 绘制多行文本，由于文字比较多，这里我们写了一个函数处理
   * 在此方法前，执行setFillStyle为字体着色
   * 
   * @param str          字符串
   * @param fontSize     文字大小
   * @param left         左边距
   * @param top          上边距
   * @param canvasWidth  文本最大宽度
   * @param lineHeight   行高
   * @param isCenter     是否水平居中显示
   * @param lineCount    显示行数
   * @return y 上边距 
   */
  canvasContext.drawMultiLineText = function (str, fontSize, left, top, canvasWidth, lineHeight, isCenter, lineCount) {
    return this.__drawMultiLineText(str, fontSize, left, top, canvasWidth, lineHeight, isCenter, 1, lineCount);
  };
  /**
   * 绘制多行文本，由于文字比较多，这里我们写了一个函数处理
   * 在此方法前，执行setFillStyle为字体着色
   * 
   * @param str          字符串
   * @param fontSize     文字大小
   * @param left         左边距
   * @param top          上边距
   * @param canvasWidth  文本最大宽度
   * @param lineHeight   行高
   * @param isCenter     是否水平居中显示
   * @param lineNo       行号
   * @param lineCount    显示行数
   * @return y 上边距 
   */
  canvasContext.__drawMultiLineText = function (str, fontSize, left, top, canvasWidth, lineHeight, isCenter, lineNo, lineCount) {
    // console.log('utils.createCanvasContext.drawMultiLineText', str, fontSize, left, top, canvasWidth, lineHeight);
    let lineWordCount = parseInt(canvasWidth / fontSize);
    this.setFontSize(fontSize);
    if (typeof (lineHeight) != 'number') { lineHeight = fontSize; }
    if (lineWordCount >= str.length) {
      top += lineHeight;
      let _left = left;
      if (isCenter == true) {
        _left += (canvasWidth - this.measureText(str).width) / 2;
      }
      this.fillText(str, _left, top);
      // this.fillText(str, left + 115 - this.measureText(str).width / 2, top);
      return top;
    }
    let lineString = '';
    do {
      lineString = str.substring(0, lineWordCount);
      lineWordCount++;
    } while (canvasWidth - this.measureText(lineString).width > fontSize);
    while (canvasWidth < this.measureText(lineString).width) {
      lineWordCount--;
      lineString = str.substring(0, lineWordCount);
    }
    top += lineHeight;
    if (typeof (lineNo) == 'number' && typeof (lineCount) == 'number' && lineNo >= lineCount) {
      let printString = '', cutOffset = 0;
      do {
        cutOffset++;
        lineString = str.substring(0, lineWordCount - cutOffset);
        printString = lineString + '...';
      } while (canvasWidth - this.measureText(printString).width <= fontSize);
      let _left = left;
      if (isCenter == true) {
        _left += (canvasWidth - this.measureText(printString).width) / 2;
      }
      this.fillText(printString, _left, top);
      return top;
    }
    let _left = left;
    if (isCenter == true) {
      _left += (canvasWidth - this.measureText(lineString).width) / 2;
    }
    this.fillText(lineString, _left, top);
    // this.fillText(lineString, left + 115 - this.measureText(lineString).width / 2, top);
    return this.__drawMultiLineText(str.substring(lineString.length), fontSize, left, top, canvasWidth, lineHeight, isCenter, ++lineNo, lineCount);
  };
  /**
   * 以矩形剪切图片。
   * 等比缩放图片，以短边显示全。
   * 
   * @param imageResource   所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载）
   * @param dx              imageResource的左上角在目标 canvas 上 x 轴的位置
   * @param dy              imageResource的左上角在目标 canvas 上 y 轴的位置
   * @param dWidth          在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放
   * @param dHeight         在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
   */
  canvasContext.drawImageAspectFill = function (imageResource, dx, dy, dWidth, dHeight) {
    let ctx = this;
    ctx.save();
    // console.log('utils.createCanvasContext.drawImageAspectFill', imageResource, dx, dy, dWidth, dHeight);
    let __objectPictureWidth = imageResource.width, __objectPictureHeight = imageResource.height, __pictureWidth = 0, __pictureHeight = 0;
    let __pictureWidthRatio = __objectPictureWidth / dWidth, __pictureHeightRatio = __objectPictureHeight / dHeight, __x = 0, __y = 0;
    if (__pictureWidthRatio > __pictureHeightRatio) {
      __pictureWidth = dWidth * __pictureHeightRatio;
      __pictureHeight = __objectPictureHeight;
      __x = __objectPictureWidth / 2 - __pictureWidth / 2; __y = 0;
    } else {
      __pictureWidth = __objectPictureWidth;
      __pictureHeight = dHeight * __pictureWidthRatio;
      __x = 0; __y = __objectPictureHeight / 2 - __pictureHeight / 2;
    }
    ctx.drawImage(imageResource.path, __x, __y, __pictureWidth, __pictureHeight, dx, dy, dWidth, dHeight);
    ctx.restore();
  };
  /**
   * 以圆形剪切图片。
   * 等比缩放图片，以短边显示全。
   * 
   * @param imageResource   所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载）
   * @param dx              imageResource的左上角在目标 canvas 上 x 轴的位置
   * @param dy              imageResource的左上角在目标 canvas 上 y 轴的位置
   * @param dWidth          在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放
   * @param dHeight         在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
   * @param radius          圆角的半径。相对于缩放后。
   */
  canvasContext.drawImageCircular = function (imageResource, dx, dy, dWidth, dHeight, radius) {
    let ctx = this;
    ctx.save();
    // console.log('utils.createCanvasContext.drawImageArc', imageResource, dx, dy, dWidth, dHeight);
    let __objectPictureWidth = imageResource.width, __objectPictureHeight = imageResource.height, __pictureWidth = 0, __pictureHeight = 0;
    let __pictureWidthRatio = __objectPictureWidth / dWidth, __pictureHeightRatio = __objectPictureHeight / dHeight, __x = 0, __y = 0;
    let __r = null;
    if (__pictureWidthRatio > __pictureHeightRatio) {
      __pictureWidth = dWidth * __pictureHeightRatio;
      __pictureHeight = __objectPictureHeight;
      __x = __objectPictureWidth / 2 - __pictureWidth / 2; __y = 0;
    } else {
      __pictureWidth = __objectPictureWidth;
      __pictureHeight = dHeight * __pictureWidthRatio;
      __x = 0; __y = __objectPictureHeight / 2 - __pictureHeight / 2;
    }
    if (typeof (radius) == 'number') {
      ctx.beginPath();
      ctx.arc(dx + dWidth / 2, dy + dHeight / 2, radius, 0, Math.PI * 2, false);
      ctx.clip();
    }
    ctx.drawImage(imageResource.path, __x, __y, __pictureWidth, __pictureHeight, dx, dy, dWidth, dHeight);
    ctx.restore();
  };
  canvasContext.drawImageArc = canvasContext.drawImageCircular;
  /**
   * 以圆角矩形剪切图片。
   * 等比缩放图片，以短边显示全。
   * 
   * @param imageResource   所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载）
   * @param dx              imageResource的左上角在目标 canvas 上 x 轴的位置
   * @param dy              imageResource的左上角在目标 canvas 上 y 轴的位置
   * @param dWidth          在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放
   * @param dHeight         在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
   * @param radius          圆角的半径。相对于缩放后。
   */
  canvasContext.drawImageRoundedRect = function (imageResource, dx, dy, dWidth, dHeight, radius) {
    let ctx = this;
    ctx.save();
    // console.log('utils.createCanvasContext.drawImageArc', imageResource, dx, dy, dWidth, dHeight);
    let __objectPictureWidth = imageResource.width, __objectPictureHeight = imageResource.height, __pictureWidth = 0, __pictureHeight = 0;
    let __pictureWidthRatio = __objectPictureWidth / dWidth, __pictureHeightRatio = __objectPictureHeight / dHeight, __x = 0, __y = 0;
    let __r = null;
    if (__pictureWidthRatio > __pictureHeightRatio) {
      __pictureWidth = dWidth * __pictureHeightRatio;
      __pictureHeight = __objectPictureHeight;
      __x = __objectPictureWidth / 2 - __pictureWidth / 2; __y = 0;
    } else {
      __pictureWidth = __objectPictureWidth;
      __pictureHeight = dHeight * __pictureWidthRatio;
      __x = 0; __y = __objectPictureHeight / 2 - __pictureHeight / 2;
    }
    if (typeof (radius) == 'number') {
      /**
       * 方法一
       */
      // ctx.beginPath();
      // // ctx.setLineWidth(1);
      // // ctx.setStrokeStyle('#000000');
      // ctx.moveTo(dx + radius, dy);// 创建开始点
      // ctx.lineTo(dx + dWidth - radius, dy);// 绘制上边
      // ctx.arc(dx + dWidth - radius, dy + radius, radius, Math.PI / -2, 0);// 绘制右上角
      // ctx.lineTo(dx + dWidth, dy + dHeight - radius);// 绘制右边
      // ctx.arc(dx + dWidth - radius, dy + dHeight - radius, radius, 0, Math.PI / 2); // 绘制右下角
      // ctx.lineTo(dx + radius, dy + dHeight);// 绘制下边
      // ctx.arc(dx + radius, dy + dHeight - radius, radius, Math.PI / 2, Math.PI);// 绘制左下角
      // ctx.lineTo(dx, dy + radius);// 绘制左边
      // ctx.arc(dx + radius, dy + radius, radius, Math.PI, Math.PI / -2);// 绘制左上角
      // // ctx.stroke();// 这个具体干什么用的？
      // ctx.clip();


      /**
       * 方法二
       */
      ctx.beginPath();
      ctx.moveTo(dx + radius, dy);
      ctx.arcTo(dx + dWidth, dy, dx + dWidth, dy + radius, radius); // draw top side and top-right corner 
      ctx.arcTo(dx + dWidth, dy + dHeight, dx + dWidth - radius, dy + dHeight, radius); // draw right side and bottom-right corner 
      ctx.arcTo(dx, dy + dHeight, dx, dy + dHeight - radius, radius); // draw bottom side and bottom-left corner 
      ctx.arcTo(dx, dy, dx + radius, dy, radius); // draw left side and top-left corner 
      ctx.clip();
    }
    ctx.drawImage(imageResource.path, __x, __y, __pictureWidth, __pictureHeight, dx, dy, dWidth, dHeight);
    ctx.restore();
  };
  /**
   * 以圆角矩形剪切图片。
   * 等比缩放图片，以短边显示全。
   * 
   * @param imageResource   所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载）
   * @param dx              imageResource的左上角在目标 canvas 上 x 轴的位置
   * @param dy              imageResource的左上角在目标 canvas 上 y 轴的位置
   * @param dWidth          在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放
   * @param dHeight         在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
   * @param radius          圆角的半径。相对于缩放后。
   */
  canvasContext.drawImageRoundedRectAllCorner = function (imageResource, dx, dy, dWidth, dHeight, topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner) {
    let ctx = this;
    ctx.save();
    // console.log('utils.createCanvasContext.drawImageArc', imageResource, dx, dy, dWidth, dHeight);
    let __objectPictureWidth = imageResource.width, __objectPictureHeight = imageResource.height, __pictureWidth = 0, __pictureHeight = 0;
    let __pictureWidthRatio = __objectPictureWidth / dWidth, __pictureHeightRatio = __objectPictureHeight / dHeight, __x = 0, __y = 0;
    let __r = null;
    if (__pictureWidthRatio > __pictureHeightRatio) {
      __pictureWidth = dWidth * __pictureHeightRatio;
      __pictureHeight = __objectPictureHeight;
      __x = __objectPictureWidth / 2 - __pictureWidth / 2; __y = 0;
    } else {
      __pictureWidth = __objectPictureWidth;
      __pictureHeight = dHeight * __pictureWidthRatio;
      __x = 0; __y = __objectPictureHeight / 2 - __pictureHeight / 2;
    }
    // if (typeof (radius) == 'number') {
    ctx.beginPath();
    ctx.moveTo(dx + topLeftCorner, dy);
    ctx.arcTo(dx + dWidth, dy, dx + dWidth, dy + topRightCorner, topRightCorner); // draw top side and top-right corner 
    ctx.arcTo(dx + dWidth, dy + dHeight, dx + dWidth - bottomRightCorner, dy + dHeight, bottomRightCorner); // draw right side and bottom-right corner 
    ctx.arcTo(dx, dy + dHeight, dx, dy + dHeight - bottomLeftCorner, bottomLeftCorner); // draw bottom side and bottom-left corner 
    ctx.arcTo(dx, dy, dx + topLeftCorner, dy, topLeftCorner); // draw left side and top-left corner 
    ctx.clip();
    // }
    ctx.drawImage(imageResource.path, __x, __y, __pictureWidth, __pictureHeight, dx, dy, dWidth, dHeight);
    ctx.restore();
  };
  /**
   * 绘制圆角矩形。
   * 
   * @param x              矩形的左上角在目标 canvas 上 x 轴的位置
   * @param y              矩形的左上角在目标 canvas 上 y 轴的位置
   * @param width          在目标画布上绘制矩形的宽度
   * @param height         在目标画布上绘制矩形的高度
   * @param radius         矩形圆角半径
   * @param fill           是否填充
   * @param stroke         是否描边
   */
  canvasContext.drawRoundedRect = function (x, y, width, height, radius, fill, stroke) {
    let ctx = this;
    ctx.save(); ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius); // draw top side and top-right corner 
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // draw right side and bottom-right corner 
    ctx.arcTo(x, y + height, x, y + height - radius, radius); // draw bottom side and bottom-left corner 
    ctx.arcTo(x, y, x + radius, y, radius);// draw left side and top-left corner 
    if (fill) { ctx.fill(); }
    if (stroke) { ctx.stroke(); }
    ctx.restore();
  }
  return canvasContext;
};
module.exports.createCanvasContext = createCanvasContext;