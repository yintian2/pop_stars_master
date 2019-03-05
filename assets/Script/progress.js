cc.Class({
  extends: cc.Component,

  properties: {
    label: cc.Label,
    progress: cc.ProgressBar,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(current, max) {
    this.label.string = current // + '/' + max
    this.progress.progress = current / max
  }

  // update (dt) {},
});