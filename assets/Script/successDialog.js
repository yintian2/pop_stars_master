cc.Class({
  extends: cc.Component,

  properties: {
    spriteBefore: cc.Sprite,
    spriteNow: cc.Sprite,
    nameLabelBefore: cc.Label,
    nameLabelNow: cc.Label,
    stepLabel: cc.Label,
  },

  init(s, level, data) {
    // this.spriteBefore.spriteFrame = s.avatarSpriteArr[level - 2]
    // this.spriteNow.spriteFrame = s.avatarSpriteArr[level - 1]
    // this.nameLabelBefore.string = data[level - 2].name
    // this.nameLabelNow.string = data[level - 1].name
    // this.stepLabel.string = data[level - 1].step
  },

  start() {

  },

  // update (dt) {},
});