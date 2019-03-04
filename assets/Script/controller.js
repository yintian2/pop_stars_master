/**
 * @author uu
 * @file 主控制器
 */
cc.Class({
  extends: cc.Component,
  properties: {
    musicMgr: require('musicMgr'), //音乐控制组件
    game: require('game'), //主游戏控制器
    pageMgr: require('pageMgr'), //页面控制器
    social: require('social'), //排行榜、广告控制器
    config: cc.JsonAsset,
  },
  start() {
    this.game.init(this)
    // this.social.init(this)
    this.lateStart()
  },
  lateStart() {
    this.pageMgr.onOpenPage(0)
  },
  onGameStartButton() {
    this.pageMgr.onOpenPage(1)
    this.game.gameStart()
  },
});