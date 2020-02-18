// pages/user/register.js
var mta = require('../../utils/mta_analysis.js')
const utils = require('../../utils/util.js')
const app = getApp()
var openid;
var sms_time_djs;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRegisterSuccessPopWindow:false,

    cityArray: ['北京'],
    objectCityArray: [],
    cityIndex: 0,

    areaArray: [],
    objectAreaArray: [],
    areaIndex: 0,

    cuisineArray: [],
    objectCuisineArray: [],
    cuisineIndex: 0,
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //获取菜品列表
    utils.PostRequest(api_url + '/Smallapp21/FoodStyle/getList', {
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data)
      that.setData({
        cuisineArray: data.result.food_name_list,
        objectCuisineArray: data.result.food_list
      })
    })
    //获取城市列表
    utils.PostRequest(api_url + '/Smallapp21/Area/getAreaList', {
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data)
      that.setData({
        cityArray: data.result.city_name_list,
        objectCityArray: data.result.city_list
      })
    }) 
  },
  //城市切换 
  bindCityPickerChange: function (e) {
    var that = this;
    var city_list = that.data.objectCityArray;
    var picCityIndex = e.detail.value //切换之后城市key
    var cityIndex = that.data.cityIndex; //切换之前城市key
    if (picCityIndex != cityIndex) {
      that.setData({
        cityIndex: picCityIndex,
        areaIndex: 0
      })
      //获取当前城市的区域
      var area_id = city_list[picCityIndex].id;

      //获取城市列表
      utils.PostRequest(api_url + '/Smallapp21/Area/getSecArea', {
        area_id:area_id
      }, (data, headers, cookies, errMsg, statusCode) => {
        console.log(data)
        that.setData({
          areaArray: data.result.area_name_list,
          objectAreaArray: data.result.area_list
        })
      }) 
    }
  },
  //切换区域
  bindAreaPickerChange: function (e) {
    var that = this;
    var area_list = that.data.objectAreaArray;
    var areaIndex = e.detail.value;
    that.setData({
      areaIndex: e.detail.value
    })



  },
  //切换菜系
  bindCuiPickerChange: function (e) {
    var that = this;
    var cui_list = that.data.objectCuisineArray;
    var cuisineIndex = e.detail.value
    that.setData({
      cuisineIndex: cuisineIndex
    })
    //获取城市列表
    wx.request({
      url: api_url + '/Smallapp21/Area/getAreaList',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          cityArray: res.data.result.city_name_list,
          objectCityArray: res.data.result.city_list
        })
      }
    })
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