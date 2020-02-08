// components/slider/zy-slider.js
var utils = require('../../utils/util');

/**
 * 自定义modal浮层
 * 使用方法：
 *   
<zy-slider width="100%" left="0" min="0" max="100" step='1'  minValue='10' maxValue="70" blockSize="12" blockColor='#EDEDED' leftBackgroundColor="#B0C4DE" rightBackgroundColor="#00F0F0" selectedColor="#F6F2EE" bind:lowValueChange="lowValueChange" bind:heighValueChange="heighValueChange"/>
 
属性说明：
  width                 : String slider 组件宽度
  left                  : String slider 组件距左边距
  min                   : Number slider 最小值
  max                   : Number slider 最大值
  step                  : Number slider 步长，取值必须大于 0，并且可被(max - min)整除
  minValue              : Number slider 左边滑块初始位置
  maxValue              : Number slider 右边滑块初始位置
  blockSize             : Number slider 滑块的大小。取值：12-28
  blockColor            : String slider 圆形滑块颜色（默认 #19896f）
  leftBackgroundColor   : String slider 背景条的颜色（默认 #ddd）
  rightBackgroundColor  : String slider 背景条的颜色（默认 #ddd）
  selectedColor         : String slider 已选择部分的颜色（默认 #19896f）

事件说明：
  bind:lowValueChange   : function 左边滑块回调 {lowValue：lowValue}。e.detail.lowValue
  bind:heighValueChange : function 右边滑块回调 {heighValue：heighValue}。e.detail.heighValue
 
方法说明：
  reset() : 重置组件
  show()  : 显示组件
  hide()  : 隐藏组件

 
使用模块：
 场馆 -> 发布 -> 选择使用物品
 */
const RegExpRPX = new RegExp("\\d+rpx", "i"), RegExpPX = new RegExp("\\d+px", "i");
const SliderLock = { left: false, rigth: false };
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** slider 宽度 */
    width: {
      type: String,
      value: '100%'
    },
    /** slider 左边距 */
    left: {
      type: String,
      value: '0'
    },
    /** slider 最小值 */
    min: {
      type: Number,
      value: 0
    },
    /** slider 最大值 */
    max: {
      type: Number,
      value: 100
    },
    /** 步进 （没做，有时间再说，项目里没用到撒） */
    step: {
      type: Number,
      value: 1
    },
    /** 预选选择的小值*/
    minValue: {
      type: Number,
      value: 0
    },
    /** 预选选择的大值 */
    maxValue: {
      type: Number,
      value: 100
    },
    blockSize: {
      type: Number,
      value: 28
    },
    /** 滑块颜色 */
    blockColor: {
      type: String
    },
    /** 左侧未选择进度条颜色 */
    leftBackgroundColor: {
      type: String
    },
    /** 右侧未选择进度条颜色 */
    rightBackgroundColor: {
      type: String
    },
    /** 已选择进度条颜色 */
    selectedColor: {
      type: String
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    min: 0, // 最小范围
    max: 100, // 最大范围
    leftTrip: 0, // 左滑块行程
    rightTrip: 0, // 右滑块行程
    totalTrip: 0, // 总行程
    bigTrip: 0, //最大行程
    ratio: 0.5, // 像素转换率
    sliderSize: 0, // 滑块大小
    containerLeft: 0, //标识整个组件，距离屏幕左边的距离
    hideOption: '', //初始状态为显示组件
  },

  observers: {
    'min,minValue': function (min, minValue) {
      if (min > minValue) {
        this.setData({
          minValue: min
        });
      }
    },
    'max,maxValue': function (max, maxValue) {
      if (max < maxValue) {
        this.setData({
          maxValue: max
        });
      }
    },
    blockSize: function (blockSize) {
      if (blockSize > 28) {
        this.setData({
          blockSize: 28
        });
      } else if (blockSize < 12) {
        this.setData({
          blockSize: 12
        });
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 设置左边滑块的值
     */
    _propertyLeftValueChange: function () {
      let _min = parseInt(this.data.min);
      let _max = parseInt(this.data.max);
      let _step = parseInt(this.data.step);
      let _minValue = parseInt(this.data.minValue);
      let multiple = Math.round((_minValue - _min) / _step);
      if (multiple > 0) {
        _minValue = _min + multiple * _step;
      } else {
        _minValue = _min;
      }
      if (_min > _minValue) {
        _minValue = _min;
      }
      let leftTrip = (_minValue - _min) / (_max - _min) * this.data.bigTrip;
      this.setData({
        minValue: _minValue,
        leftTrip: leftTrip,
      });
    },

    /**
     * 设置右边滑块的值
     */
    _propertyRightValueChange: function () {
      let _min = parseInt(this.data.min);
      let _max = parseInt(this.data.max);
      let _step = parseInt(this.data.step);
      let _maxValue = parseInt(this.data.maxValue);
      let multiple = Math.round(1 + (_maxValue - _max) / _step) - 1;
      if (multiple < 0) {
        _maxValue = _max + multiple * _step;
      } else {
        _maxValue = _max;
      }
      if (_max < _maxValue) {
        _maxValue = _max;
      }
      let rightTrip = (_maxValue - _min) / (_max - _min) * this.data.bigTrip + this.data.sliderSize;
      this.setData({
        maxValue: _maxValue,
        rightTrip: rightTrip,
      });
    },

    /**
     * 左边滑块滑动
     */
    _minMove: function (e) {
      if (SliderLock.left == true) {
        return;
      }
      SliderLock.left = true;
      let pagex = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderSize / 2;
      let lastValue = e.target.dataset.lastleft;
      let stepValue = this.data.bigTrip * this.data.step / (this.data.max - this.data.min);
      if (Math.abs(pagex - lastValue) >= stepValue) {
        if (pagex > lastValue) {
          pagex = lastValue + stepValue;
        } else {
          pagex = lastValue - stepValue;
        }
        if (pagex + this.data.sliderSize >= this.data.rightTrip) {
          pagex = this.data.rightTrip - this.data.sliderSize;
        } else if (pagex <= 0) {
          pagex = 0;
        }

        this.setData({
          leftTrip: pagex
        });

        let lowValue = parseInt(pagex / this.data.bigTrip * parseInt(this.data.max - this.data.min) + this.data.min);
        var myEventDetail = {
          lowValue: lowValue
        };
        this.triggerEvent('lowValueChange', myEventDetail);
      }
      SliderLock.left = false;
    },

    /**
     * 右边滑块滑动
     */
    _maxMove: function (e) {
      if (SliderLock.rigth == true) {
        return;
      }
      SliderLock.rigth = true;
      let pagex = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderSize / 2;
      let lastValue = e.target.dataset.lastright;
      let stepValue = this.data.bigTrip * this.data.step / (this.data.max - this.data.min);
      if (Math.abs(pagex - lastValue) >= stepValue) {
        if (pagex > lastValue) {
          pagex = lastValue + stepValue;
        } else {
          pagex = lastValue - stepValue;
        }
        if (pagex <= this.data.leftTrip + this.data.sliderSize) {
          pagex = this.data.leftTrip + this.data.sliderSize;
        } else if (pagex >= this.data.totalTrip) {
          pagex = this.data.totalTrip;
        }

        this.setData({
          rightTrip: pagex
        });

        pagex = pagex - this.data.sliderSize;
        let heighValue = parseInt(pagex / this.data.bigTrip * (this.data.max - this.data.min) + this.data.min);

        var myEventDetail = {
          heighValue: heighValue
        };
        this.triggerEvent('heighValueChange', myEventDetail);
      }
      SliderLock.rigth = false;
    },

    /**
     * 隐藏组件
     */
    hide: function () {
      console.log('zy-slider', 'hide');
      this.setData({
        hideOption: 'hide'
      });
    },
    /**
     * 显示组件
     */
    show: function () {
      console.log('zy-slider', 'show');
      this.setData({
        hideOption: ''
      });
    },
    /**
     * 重置
     */
    reset: function () {
      console.log('zy-slider', 'reset');
      this.setData({
        rightTrip: this.data.totalTrip,
        leftTrip: 0
      });
    }
  },

  ready: function () {
    let that = this;
    // console.log('zy-slider', 'ready');
    // const getSystemInfo = utils.wxPromisify(wx.getSystemInfo);
    // const queryContainer = utils.wxPromisify(wx.createSelectorQuery().in(this).select(".container").boundingClientRect);
    utils.wxPromisify(wx.getSystemInfo)()
      .then(res => {
        let ratio = res.windowWidth / 750;
        that.setData({
          ratio: ratio
        });
      })
      .then(() => {
        var query = wx.createSelectorQuery().in(this);
        query.select(".container").boundingClientRect(function (res) {
          let containerWidth = res.width / that.data.ratio, containerLeft = res.left / that.data.ratio;
          if (containerWidth == 0) {
            let inputWidth = that.data.width;
            if (typeof (inputWidth) == 'number' && inputWidth > 0) {
              containerWidth = inputWidth;
            } else if (typeof (inputWidth) == 'string') {
              if (RegExpRPX.test(inputWidth)) {
                try { containerWidth = parseInt(inputWidth); } catch (error) { }
              } else if (RegExpPX.test(inputWidth)) {
                try { containerWidth = parseInt(inputWidth) / that.data.ratio; } catch (error) { }
              }
            }
          }
          if (containerLeft == 0) {
            let inputLeft = that.data.left;
            if (typeof (inputLeft) == 'number' && inputLeft > 0) {
              containerLeft = inputLeft;
            } else if (typeof (inputLeft) == 'string') {
              if (RegExpRPX.test(inputLeft)) {
                try { containerLeft = parseInt(inputLeft); } catch (error) { }
              } else if (RegExpPX.test(inputLeft)) {
                try { containerLeft = parseInt(inputLeft) / that.data.ratio; } catch (error) { }
              }
            }
          }
          that.setData({
            totalTrip: containerWidth - that.data.sliderSize,
            bigTrip: containerWidth - that.data.sliderSize * 2,
            rightTrip: containerWidth - that.data.sliderSize,
            containerLeft: containerLeft
          });

          /**
           * 设置初始滑块位置
           */
          that._propertyLeftValueChange();
          that._propertyRightValueChange();
        }).exec();
      });
  }
})