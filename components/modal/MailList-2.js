// components/modal/MailList-2.js

/**
 * 通讯录
 * 使用方法：
 * <MailList-2 show="Boolean:显示弹窗" mailList-data="Array:列表数据" enable-backup="Boolean:开启返回按钮" search-placeholder="String:搜索框提示文本" top-tips-show="Boolean:头部提示显示" topTipsList="Array:头部提示列表" click-item-close-page="Boolean:点击条目关闭页面" bindonClickItem="点击条目事件" />
 *
属性说明：
  show：              控制modal显示与隐藏
  mailListData:       展示数据。数据格式：[{id: "1", region: "A", items: [{id: "A-MING", name: "阿明", ...}]}]
  enableBackup:       开启返回按钮
  searchPlaceholder:  搜索框提示文本
  topTipsShow:        头部提示显示
  topTipsList:        头部提示列表
  clickItemClosePage: 点击条目关闭页面

事件说明：
  bindonClickItem:  点击条目触发的回调函数


使用模块：
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: { type: Boolean, value: false },
    enableBackup: { type: Boolean, value: true },
    searchPlaceholder: { type: String, value: '请输入' },
    mailListData: { type: Array, value: [] },
    topTipsShow: { type: Boolean, value: true },
    topTipsList: { type: Array, value: [] },
    clickItemClosePage: { type: Boolean, value: true }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    isActive: null,
    listMain: [],
    listTitles: [],
    listSearch: [],
    fixedTitle: null,
    toView: 'inToView0',
    oHeight: [],
    scroolHeight: 0,
    isSearch: false,
    inToViewSpaceHeight: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击右侧字母导航定位触发
    scrollToViewFn: function (e) {
      var that = this;
      var _id = e.target.dataset.id;
      for (var index = 0; index < that.data.listMain.length; ++index) {
        if (that.data.listMain[index].id === _id) {
          that.setData({
            isActive: _id,
            toView: 'inToView' + _id
          });
          break;
        }
      }
    },
    // 页面滑动时触发
    onPageScroll: function (e) {
      this.setData({ scroolHeight: e.detail.scrollTop });
      for (let index in this.data.oHeight) {
        if (e.detail.scrollTop < this.data.oHeight[index].height) {
          this.setData({
            isActive: this.data.oHeight[index].key,
            fixedTitle: this.data.oHeight[index].name
          });
          return false;
        }
      }
    },
    // 搜索框输入内容时触发
    searchItems: function (e) {
      let that = this;
      let listSearch = [];
      let searchKey = e.detail.value;
      if (typeof (searchKey) == 'string' && searchKey != '') {
        if (!(that.data.listMain instanceof Array) || that.data.listMain.length < 1) {
          return;
        }
        for (let index = 0; index < that.data.listMain.length; index++) {
          let items = that.data.listMain[index].items;
          if (!(items instanceof Array) || items.length < 1) {
            continue;
          }
          for (let bIndex = 0; bIndex < items.length; bIndex++) {
            let item = items[bIndex];
            if (typeof (item) != 'object' || typeof (item.name) != 'string' || item.name.indexOf(searchKey) < 0) {
              continue;
            }
            listSearch.push(item);
          }
        }
        var topTipsList = [];
        topTipsList[0] = '共'+listSearch.length+'个客户';
        that.setData({
          isSearch: true,
          listSearch: listSearch,
          topTipsList : topTipsList
        });
      } else {
        that.setData({
          isSearch: false
        });
      }
    },
    // 点击条目时触发
    clickItem: function (e) {
      let that = this;
      if (that.data.clickItemClosePage === true) {
        that.setData({
          show: false,
          isSearch: false
        });
      }
      let hotel = e.currentTarget.dataset;
      
      let bean = null;
      for (let index = 0; index < that.data.listMain.length; index++) {
        let items = that.data.listMain[index].items;
        if (!(items instanceof Array) || items.length < 1) {
          continue;
        }
        for (let bIndex = 0; bIndex < items.length; bIndex++) {
          let item = items[bIndex];
          if (typeof (item) != 'object' || typeof (item.id) != 'string' || item.id != hotel.id) {
            continue;
          }
          bean = item;
        }
      }
      // hotel.bean = bean;
      that.triggerEvent('onClickItem', bean);
    },
    // 点击返回按钮进触发
    closeModal: function (e) {
      let that = this;
      that.setData({
        show: false,
        isSearch: false
      });
    },
    /**
     * 装载通讯录格式的数据
     * @para pageContext  页面对象上下文
     * @para mailListData 通讯录格式的数据
     */
    loadingMailListData: function (pageContext, mailListData) {
      //赋值给列表值
      pageContext.setData({
        listMain: mailListData
      });
      //赋值给当前高亮的isActive
      pageContext.setData({
        isActive: pageContext.data.listMain[0].id,
        fixedTitle: pageContext.data.listMain[0].region
      });
      //计算分组高度,wx.createSelectotQuery()获取节点信息
      let number = 0;
      let lastHeight = 0;
      for (let index = 0; index < pageContext.data.listMain.length; ++index) {
        wx.createSelectorQuery().in(pageContext).select('#inToView' + pageContext.data.listMain[index].id).boundingClientRect(function (rect) {
          lastHeight = rect.height;
          number = lastHeight + number;
          let newArry = [{
            'height': number,
            'key': rect.dataset.id,
            "name": pageContext.data.listMain[index].region
          }]
          pageContext.setData({
            oHeight: pageContext.data.oHeight.concat(newArry)
          })
        }).exec();
      };
      wx.createSelectorQuery().in(pageContext).select('#mail_list_group').boundingClientRect(function (rect) {
        pageContext.setData({
          inToViewSpaceHeight: rect.height - lastHeight
        })
      }).exec();
    }
  },
  observers: {
    'mailListData': function (mailListData) {
      let com = this;
      // console.log('MailList.js', 'observers.mailListData', mailListData);
      if (typeof (mailListData) == 'object' && mailListData != null) {
        com.loadingMailListData(com, mailListData);
      }
    },
    'show': function (show) {
      let com = this;
      // console.log('MailList.js', 'observers.show', show);
      // console.log('MailList.js', com, com.getTabBar());
      let customTabBar = com.getTabBar();
      if (typeof (customTabBar) != 'object' || customTabBar === null) {
        return;
      }
      if (!(customTabBar instanceof Array)) {
        customTabBar.setData({
          showTabBar: !show
        });
      } else {
        if (show == true) {
          wx.hideTabBar();
        } else {
          wx.showTabBar();
        }
      }
    }
  },

  lifetimes: {
    attached: function () {
      let com = this;
      // console.log('MailList.js', 'lifetimes.attached');
    },
    detached: function () {
      let com = this;
      // console.log('MailList.js', 'lifetimes.detached');
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function () {
    let com = this;
    // console.log('MailList.js', 'attached');
  },
  detached: function () {
    let com = this;
    // console.log('MailList.js', 'detached');
  },
  pageLifetimes: {
    show: function () {
      let com = this;
      // console.log('MailList.js', 'pageLifetimes.show');
    },
    hide: function () {
      let com = this;
      // console.log('MailList.js', 'pageLifetimes.hide');
    },
    resize: function (size) {
      let com = this;
      // console.log('MailList.js', 'pageLifetimes.resize');
    }
  }
})
