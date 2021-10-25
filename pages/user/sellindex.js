// pages/user/sellindex.js
/**
 * 注册用户首页 [品鉴酒]
 */


Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      exchangerecord: [{
        img: '/images/icon/FFFFFF_horn.png',
        msg: 'a'
      }, {
        img: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg',
        msg: 'b'
      }],
      taskList: [{
        "task_id": "5",
        "task_name": "\u7535\u89c6\u5f00\u673a",
        "img_url": "http:\/\/oss.littlehotspot.com\/media\/resource\/MrBd3KM2Xt.png",
        "desc": "\u5728\u7528\u9910\u65f6\u95f4\u5c06\u7535\u89c6\u5f00\u673a\uff0c\u6bcf\u5f00\u673a1\u5c0f\u65f6\u53ef\u83b7\u5f9725\u79ef\u5206\u7684\u5956\u52b1\u3002\u5348\u9910\u65f6\u95f4\uff1a11:00-14:00\uff1b\u665a\u9910\u65f6\u95f4\uff1a18:00-21:00\u3002\uff08\u5348\u9910\u4e0e\u665a\u9910\u4e24\u4e2a\u65f6\u6bb5\u9700\u8981\u5206\u522b\u5728\u9996\u9875\u8fdb\u884c\u5305\u95f4\u7b7e\u5230\u4e4b\u540e\u60a8\u624d\u53ef\u83b7\u5f97\u6536\u76ca\u54e6\uff5e\uff09",
        "is_shareprofit": "0",
        "integral": 0,
        "progress": "\u4eca\u65e5\u83b7\u5f97\u79ef\u5206"
      }, {
        "task_id": "82",
        "task_name": "\u8bc4\u8bba\u79ef\u5206",
        "img_url": "http:\/\/oss.littlehotspot.com\/media\/resource\/PwQHme8xat.jpeg",
        "desc": "",
        "is_shareprofit": "0",
        "integral": 0,
        "progress": "\u4eca\u65e5\u83b7\u5f97\u79ef\u5206"
      }],
      saleDetailWindowDesc: '<div class="rich-text"><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">奖励规则：</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">1.</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">领取任务即可获得100积分奖励；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">2.</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每个销售人员有3次邀请客人试饮的机会，</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每位客人</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">试饮</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">将</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">奖励对应</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">发起人员100积分；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动说明：</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第1步.您需要点击“邀请客人试饮“来发起；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第2步.发起后您需要选择对应的包间并填写可领取的数量；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第3步.电视出现后活动二维码后邀请客人扫码领取；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">第4步.为领取成功的客人倒试饮酒100ml；</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">注：</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">每瓶赖茅酒500ml，供4人试饮用（每人100ml），</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">剩余部分的酒可以自行处理。</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="1" style="font-family:PingFangSC; font-weight:700; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">活动有效时间：</span><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;">2021年10月15日--2021年11月15日</span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p><p style="line-height:0; margin-bottom:5px;"><span class="--mb--rich-text" data-boldtype="0" style="font-family:PingFangSC; font-weight:400; font-size:14px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; line-height:20px; text-decoration:none;"><br></span></p></div>',
      saleDetailWindowShow: true,
      judgeWindowShow: true
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
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