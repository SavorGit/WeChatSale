// store/pages/storein/index.js
/**
 * 入库 首页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores: [
      { name: "北京库房", selected: true },
      { name: "上海库房", selected: false },
      { name: "广州库房" },
      { name: "深圳库房" }
    ],
    doingList: [
      { id: 122, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", datetime: "2022/04/10 11:00", operator: "陈灵玉", status: 0 },
      { id: 121, name: "恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩", datetime: "2022/04/10 10:00", operator: "陈灵玉", status: 0 },
      { id: 120, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", datetime: "2022/04/10 09:00", operator: "陈灵玉", status: 0 }
    ],
    doneList: [
      { id: 119, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", datetime: "2022/04/10 11:00", operator: "陈灵玉", status: 2 },
      { id: 118, name: "恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩", datetime: "2022/04/10 10:00", operator: "陈灵玉", status: 2 },
      { id: 117, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", datetime: "2022/04/10 09:00", operator: "陈灵玉", status: 2 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})