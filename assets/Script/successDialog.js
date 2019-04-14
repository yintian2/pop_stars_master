cc.Class({
  extends: cc.Component,

  properties: {
    nameLabelBefore: cc.Label,
    nameLabelNow: cc.Label,
    stepLabel: cc.Label,
    scoreLabel: cc.Label,
  },

  init(s, level, data) {
    this.nameLabelBefore.string = data[level - 2].name
    this.nameLabelNow.string = data[level - 1].name
    this.stepLabel.string = "+" + data[level - 2].step + "步"
    this.scoreLabel.string = "分数：" + data[level - 2].score
  },
  // update (dt) {},
});