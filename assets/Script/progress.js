cc.Class({
  extends: cc.Component,

  properties: {
    currentLabel: cc.Label,
    maxLabel: cc.Label,
    progress: cc.ProgressBar,
    nameLabel: cc.Label,
    levelLabel: cc.Label,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(current, data, level) {
    this.currentLabel.string = current // + '/' + max
    this.maxLabel.string = data.score
    this.nameLabel.string = data.name
    this.progress.progress = current / data.score
    this.levelLabel.string = "lv" + (level + '')
  }

  // update (dt) {},
});