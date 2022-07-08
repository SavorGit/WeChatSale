// components/pickers/a-pcker.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        range: {
            type: Array,
            value: []
        },
        value: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShowPickerView: false,
        value: [0],//设置picker-view默认哪项选中
        dialogh: 0
    },
    // observers: {
    //     'value': function (value) {
    //         console.log('observers.value', value)
    //     }
    // },
    attached: function () {
        let self = this;
        //动画
        self.animation = wx.createAnimation({ duration: 300 });
        //500rpx转成px
        let dialoghpx = 600 / 750 * wx.getSystemInfoSync().windowWidth;
        self.setData({ dialogh: dialoghpx });
    },

    pageLifetimes: {
        show: function () {
            let self = this;
            self.value = this.data.value;
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 点击PickerView时的事件处理方法。
         * @param {Event} e 事件
         */
        onClickPickerView: function (e) {
            // 不做任何处理
        },
        /**
         * PickerView的值发生改变时的事件处理方法。
         * @param {Event} e 事件
         */
        onChangePickerView: function (e) {
            let self = this;
            let val = e.detail.value;
            self.setData({ value: val });
        },
        /**
         * 点击Picker弹出PickerView时，触发的事件处理方法。
         * @param {Event} e 事件
         */
        showPickerView: function (e) {
            let self = this;
            self.reset(e);
        },
        /**
         * 点击蒙层取消操作。
         * @param {Event} e 事件
         */
        cancel: function (e) {
            let self = this;
            //绑定cancel事件
            self.triggerEvent("cancel");
            self.dimsss(e);
        },
        /**
         * 点击“取消”按钮的事件处理方法。
         * @param {Event} e 事件
         */
        esc: function (e) {
            let self = this;
            //绑定lefttap事件
            self.triggerEvent("esc");
            self.dimsss(e);
        },
        /**
         * 点击“确认”按钮的事件处理方法。
         * @param {Evnet} e 
         */
        ok: function (e) {
            let self = this;
            //绑定righttap事件
            self.triggerEvent("change", { value: self.data.value });
            self.value = self.data.value;
            self.dimsss(e);
        },
        reset(e) {
            let self = this;
            self.animation.translateY(self.data.dialogh).translateY(0).step();
            self.setData({ value: self.value, isShowPickerView: true, animation: self.animation.export() });
        },
        dimsss(e) {
            let self = this;
            //从原位向下移动dailog高度，形成从上向下的收起效果
            self.animation.translateY(self.data.dialogh).step();
            self.setData({ animation: self.animation.export(), value: [0] }, function () {
                //动画结束后蒙层消失
                self.setData({ isShowPickerView: false });
            });
        }
    }
})
