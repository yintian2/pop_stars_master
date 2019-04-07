cc.Class({
  extends: cc.Component,

  properties: {
    nameLabelBefore: cc.Label,
    nameLabelNow: cc.Label,
    stepLabel: cc.Label,
  },

  init(s, level, data) {
    this.nameLabelBefore.string = data[level - 2].name
    this.nameLabelNow.string = data[level - 1].name
    this.stepLabel.string = "奖励步数+" + data[level - 2].step
  },
  // update (dt) {},
});