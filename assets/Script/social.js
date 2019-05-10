/**
 * @author uu
 * @file  排行榜组件
 * @description 用户点击查看排行榜才检查授权,如果此时用户没有授权则进入授权界面
 */
cc.Class({
  extends: cc.Component,
  properties: {
    display: cc.Sprite,
    groupDisplay: cc.Sprite,
    _isShow: false,
    // score: 0
  },
  init(c) {
    this._controller = c
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.onShareAppMessage(function () {
      return {
        title: "开局只是个农民，现在已经做到宰相",
        // imageUrlId: 'oxEwGvClT0uldQ470pM84w',
        imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9icErxW6RFibaibf7zckgXNuicVytxTjiaVom2RkuUg5nDw8oC8jhDulBgfD/0'
      }
    })
    // this.display.node.width = window.width
    //this.display.node.height = window.height
    //this.display.node.getComponent(cc.WXSubContextView).enabled = false;
    //   this.tex = new cc.Texture2D();
    //TODO: 微信小游戏导致音乐自动关闭 处理失败
    // 监听
    wx.onAudioInterruptionEnd(() => {
      c.musicMgr.pauseBg()
      c.musicMgr.resumeBg()
    })
    wx.onShow((options) => {
      console.log(options)
      if (options.scene == 1044) {
        wx.postMessage({
          message: 'group',
          shareTicket: options.shareTicket
        })
        c.openGroupRank()
        this.display.node.active = false
        c.totalRank.active = false
      }
      cc.director.resume()
    })
    wx.onHide(() => {
      cc.director.pause()
    })
  },
  // --------------- share ----------------
  onShareButton() {
    var self = this;
    wx.shareAppMessage({
      title: "开局只是个农民，现在已经做到宰相",
      // imageUrlId: 'oxEwGvClT0uldQ470pM84w',
      imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9icErxW6RFibaibf7zckgXNuicVytxTjiaVom2RkuUg5nDw8oC8jhDulBgfD/0'
    })
  },
  onShakePhone() {
    wx.vibrateShort()
  },
  // ---------------分数上传---------------
  onGameOver(level, score) {
    //上传分数
    //打开开放域
    this.score = score
    let highLevel = level
    let highScore = score
    let self = this
    highLevel = wx.getStorageSync('highLevel')
    highLevel = parseInt(highLevel)
    if (highLevel) {
      highLevel = highLevel < level ? level : highLevel
    } else {
      highLevel = level
    }
    highScore = wx.getStorageSync('highScore')
    if (highScore) {
      highScore = parseInt(highScore)
      highScore = highScore < score ? score : highScore
    } else {
      highScore = score
    }
    var highLevelName = this._controller.gameData.json.levelData[highLevel - 1].name
    wx.setStorageSync('highLevel', highLevel + '')
    wx.setStorageSync('highScore', highScore + '')
    self._controller.scoreMgr.failHighScore.string = "您的最高分:" + (highScore + '')
    var kvDataList = new Array()
    kvDataList.push({
      key: "highLevel",
      value: highLevelName,
    }, {
      key: "highScore",
      value: highScore + '',
    })
    wx.setUserCloudStorage({
      "KVDataList": kvDataList,
      success: () => {
        //  self.showRank()
      },
      fail: (res) => {
        //   console.log(res)
      }
    })
  },
  showRank() {
    wx.postMessage({
      message: 'Show'
    })
    this.display.node.active = true
    this._isShow = true
  },
  // switchRankType() {
  //   wx.postMessage({
  //     message: 'switchRank'
  //   })
  //   this._isShow = true
  // },
  closeRank() {
    this.display.node.active = false
    wx.postMessage({
      message: 'Hide'
    })
    this._isShow = false
  },
  showGroupRank() {
    wx.postMessage({
      message: 'Show'
    })
    this.groupDisplay.node.active = true
    this._isShow = true
  },
  // switchRankType() {
  //   wx.postMessage({
  //     message: 'switchRank'
  //   })
  //   this._isShow = true
  // },
  closeGroupRank() {
    this.groupDisplay.node.active = false
    wx.postMessage({
      message: 'Hide'
    })
    this._isShow = false
  },
  createImage(sprite, url) {
    let image = wx.createImage();
    image.onload = function () {
      let texture = new cc.Texture2D();
      texture.initWithElement(image);
      texture.handleLoadedTexture();
      sprite.spriteFrame = new cc.SpriteFrame(texture);
    };
    image.src = url;
  },
  update() {
    if (this._isShow) {
      if (this.display.node.active) {
        this.display.node.getComponent(cc.WXSubContextView).update()
      }
      if (this.groupDisplay.node.active) {
        this.groupDisplay.node.getComponent(cc.WXSubContextView).update()
      }
    }
  },
  onReviveButton() {
    // 广告位
    let self = this
    let videoAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-482148cfeb243378'
    })
    videoAd.show().catch(() => {
      // 失败重试
      videoAd.load()
        .then(() => videoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败', err.errMsg)
          self._controller.game.onSkipRevive()
        })
    })
    videoAd.onError(err => {
      self._controller.game.onSkipRevive()
    })
    videoAd.onClose((res) => {
      if (res && res.isEnded || res === undefined) {
        self._controller.game.showReviveSuccess()
      } else {
        self._controller.game.askRevive()
      }
    })
  },
  onAdvDouble() {
    // 广告位
    let self = this
    let videoAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-2397b0bff501b49b'
    })
    videoAd.show().catch(() => {
      // 失败重试
      videoAd.load()
        .then(() => videoAd.show())
        .catch(err => {
          self._controller.scoreMgr.onLevelUpButton()
        })
    })
    videoAd.onError(err => {
      self._controller.scoreMgr.onLevelUpButton()
    })
    videoAd.onClose((res) => {
      if (res && res.isEnded || res === undefined) {
        self._controller.scoreMgr.onLevelUpButton(2)
      }
    })
  },
  openBannerAdv() {
    // 创建 Banner 广告实例，提前初始化
    let screenWidth = wx.getSystemInfoSync().screenWidth
    let bannerHeight = screenWidth / 350 * 105
    let screenHeight = wx.getSystemInfoSync().screenHeight - bannerHeight
    if (this.bannerAd) {
      this.bannerAd.destroy()
    }
    this.bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-4020bb9ea439e6a5',
      style: {
        left: 0,
        top: screenHeight,
        width: screenWidth,
      }
    })
    // 在适合的场景显示 Banner 广告
    this.bannerAd.onLoad(() => {
      console.log('banner 广告加载成功')
    })

    this.bannerAd.show()
      .then(() => console.log('banner 广告显示'))
  },
  closeBannerAdv() {
    this.bannerAd.hide()
  }
  // -------------- rank 刷新------------------
  // _updateSubDomainCanvas() {
  //   if (!this.tex) {
  //     return;
  //   }
  //   this.tex.initWithElement(sharedCanvas);
  //   this.tex.handleLoadedTexture();
  //   this.display.spriteFrame = new cc.SpriteFrame(this.tex);
  // },
  // update(dt) {
  //   if (this._isShow == true) {
  //     this._updateSubDomainCanvas();
  //   }
  // },
});