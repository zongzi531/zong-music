//app.js
App({
  onLaunch: function () {
    wx.request({
      url: 'http://localhost:3000/personalized/newsong',
      success: res => {
        let { result } = res.data
        this.globalData.newsong = result
      }
    })
  },
  globalData: {
    newsong: [],
    nowPlay: 0
  }
})