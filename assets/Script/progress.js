cc.Class({
  extends: cc.Component,

  properties: {
    usualNode: cc.Node,
    currentLabel: cc.Label,
    maxLabel: cc.Label,
    progress: cc.ProgressBar,
    nameLabel: cc.Label,
    levelLabel: cc.Label,
    limitNode: cc.Node,
    limitScore: cc.Label
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(current, data, level) {
    if (level < 15) {
      this.limitNode.active = false
      this.usualNode.active = true
      this.maxLabel.string = data.score
      this.currentLabel.string = current
    //  this.nameLabel.string = data.name
      this.progress.progress = current / data.score
      this.levelLabel.string = "lv" + (level + '')
    } else {
      this.limitNode.active = true
      this.usualNode.active = false
      this.limitScore.string = current
      this.progress.progress = 1
    }

  }

  // update (dt) {},
});