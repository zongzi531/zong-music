let app = getApp()

const zero = 0

const thousand = 1000

Page({
  onReady: function (e) {
    this.playMusic()
    this.musicCtx = wx.createAudioContext('music')
  },
  data: {
    playControl: false,
    currentTime: 0,
    duration: 0,
    currentTimeText: '0:00',
    durationText: '0:00',
    url: '',
    blurPicUrl: '',
    name: '',
    artists: '',
    albumName: ''
  },
  sliderChange: function ({ detail }) {
    this.musicCtx.seek(detail.value)
  },
  timeupdate: function ({ detail }) {
    let { currentTime, duration } = detail
    this.setData({
      currentTime,
      duration,
      currentTimeText: this.timeFormat(currentTime),
      durationText: this.timeFormat(duration)
    })
  },
  init: function () {
    this.pause()
    this.musicCtx.seek(zero)
    this.setData({
      playControl: false,
      currentTime: 0,
      currentTimeText: '0:00'
    })
  },
  ended: function (e) {
    this.playMusic()
  },
  play: function () {
    this.setData({
      playControl: true
    })
    this.musicCtx.play()
  },
  pause: function () {
    this.setData({
      playControl: false
    })
    this.musicCtx.pause()
  },
  previousPlay: function () {
    this.nowPlayFormat(--app.globalData.nowPlay)
    this.init()
    this.playMusic().then(() => {
      // this.play()
    })
  },
  nextPlay: function () {
    this.nowPlayFormat(++app.globalData.nowPlay)
    this.init()
    this.playMusic().then(() => {
      // this.play()
    })
  },
  playMusic: function () {
    return new Promise((resolve, reject) => {
      let { id, name, album, duration } = app.globalData.newsong[app.globalData.nowPlay].song
      let artist = []
      for (let i of album.artists) {
        artist = [...artist, i.name]
      }
      let artists = artist[0] 
      for (let i = 1; i < artist.length; i++) {
        artists += `/${artist[i]}`
      }
      wx.request({
        url: `http://localhost:3000/music/url?id=${id}`,
        success: res => {
          this.setData({
            url: res.data.data['0'].url,
            blurPicUrl: album.blurPicUrl,
            duration: duration / thousand,
            durationText: this.timeFormat(duration / thousand),
            name,
            artists,
            albumName: album.name
          })
          resolve()
        }
      })
    })
  },
  timeFormat: function (time) {
    const s = 60
    const ssZero = 10
    const mm = Number.parseInt(time / s)
    const ss = Number.parseInt(time % s)
    if (ss < ssZero) {
      return `${mm}:0${ss}`
    } else {
      return `${mm}:${ss}`
    }
  },
  nowPlayFormat: function (value) {
    const index = app.globalData.newsong.length - 1
    const [ min, cover ] = [ 0, 1 ]
    const coverTag = index + cover
    if (value > index) {
      app.globalData.nowPlay = app.globalData.nowPlay - coverTag
    } else if (value < min) {
      app.globalData.nowPlay = app.globalData.nowPlay + coverTag
    }
  }
})