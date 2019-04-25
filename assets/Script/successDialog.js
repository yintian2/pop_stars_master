cc.Class({
  extends: cc.Component,

  properties: {
    nameLabelBefore: cc.Label,
    nameLabelNow: cc.Label,
    stepLabel: cc.Label,
    scoreLabel: cc.Label,
  },

  init(s, level, data, score) {
    this.nameLabelBefore.string = data[level - 2].name
    this.nameLabelNow.string = data[level - 1].name
    this.stepLabel.string = "+" + data[level - 2].step + "步"
    this.scoreLabel.string = "分数：" + score
  },
  // update (dt) {},
});