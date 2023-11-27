// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabBar: {
      type: Object,
      value: {
        color: "#000000",
        selectedColor: "#999999",
        backgroundColor: "#FFFFFF",
        borderStyle: "white",
        list: []
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTabBar: true,
    selected: 0,
    color: "#999999",
    selectedColor: "#333333",
    backgroundColor: "#FFFFFF",
    borderStyle: "white",
    list: [{
      "pagePath": "/pages/user/sellindex",
      "text": "我的任务",
      "iconPath": "/images/icon/999999_sale.png",
      "selectedIconPath": "/images/icon/333333_sale.png"
      },
      {
        "pagePath": "/pages/index/index",
        "text": "电视互动",
        "iconPath": "/images/icon/999999_interact.png",
        "selectedIconPath": "/images/icon/333333_interact.png"
      },
      {
        "pagePath": "/pages/menu/index",
        "text": "配菜",
        "iconPath": "/images/icon/999999_interact.png",
        "selectedIconPath": "/images/icon/333333_interact.png"
      },
      {
        "pagePath": "/pages/mine/index",
        "text": "个人信息",
        "iconPath": "/images/icon/999999_mine.png",
        "selectedIconPath": "/images/icon/333333_mine.png"
      }
    ]
  },
  attached() {
    let tabBar = this;
    // console.log(tabBar);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url});
      this.setData({
        selected: data.index
      });
    }
  }
})