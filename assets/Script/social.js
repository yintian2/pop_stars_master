/**
 * @author uu
 * @file  排行榜组件
 * @description 用户点击查看排行榜才检查授权,如果此时用户没有授权则进入授权界面
 */
cc.Class({
  extends: cc.Component,
  properties: {
    display: cc.Sprite,
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
    if (highLevel) {
      highLevel = parseInt(highLevel)
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
      this.display.node.getComponent(cc.WXSubContextView).update()
    }
  },
  onReviveButton() {
    // 广告位
    let self = this
    let videoAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-19675012c3def3dd'
    })
    videoAd.onClose((res) => {
      console.log('videoAd res:', res)
      if (res.isEnded) {
        //   self._controller.player.onRevive()
      }
    })
    videoAd.load()
      .then(() => videoAd.show())
      .catch(err => console.log('reviveBanner res:', err.errMsg))
  },

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