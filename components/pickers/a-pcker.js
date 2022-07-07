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

    attached: function () {
        let self = this;
        //动画
        self.animation = wx.createAnimation({ duration: 300 });
        //500rpx转成px
        let dialoghpx = 500 / 750 * wx.getSystemInfoSync().windowWidth;
        self.setData({ dialogh: dialoghpx });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickPickerView: function (e) {
            // 不做任何处理
        },
        onChangePickerView: function (e) {
            let self = this;
            let val = e.detail.value;
            self.setData({ value: val });
        },
        showPickerView: function (e) {
            let self = this;
            self.animation.translateY(self.data.dialogh).translateY(0).step();
            self.setData({ isShowPickerView: true, animation: self.animation.export() });
        },
        cancel() {
            let self = this;
            //绑定cancel事件
            self.triggerEvent("cancel");
            self.dimsss();
        },
        dimsss() {
            let self = this;
            //从原位向下移动dailog高度，形成从上向下的收起效果
            self.animation.translateY(self.data.dialogh).step();
            self.setData({ animation: self.animation.export(), value: [0] }, function () {
                //动画结束后蒙层消失
                self.setData({ isShowPickerView: false });
            });
        },
        esc() {
            let self = this;
            //绑定lefttap事件
            self.triggerEvent("esc");
            self.dimsss();
        },
        ok() {
            let self = this;
            //绑定righttap事件
            self.triggerEvent("change", { value: self.data.value });
            self.dimsss();
        }
    }
})
