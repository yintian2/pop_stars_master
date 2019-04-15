/**
 * @author uu
 * @file 开始页面控制
 */
cc.Class({
  extends: cc.Component,
  properties: {
    bannerNode: cc.Node,
    labelNode: cc.Node,
  },
  start() {

  },

  onTouched() {

  },
  showAnimation() {
    return new Promise((resolve, rejects) => {
      let action1 = cc.scaleTo(0.5, 0, 0).easing(cc.easeBackIn())
      let action2 = cc.blink(0.5, 3)
      this.bannerNode.runAction(action1)
      let action = cc.sequence(action2, cc.callFunc(() => {
        resolve()
      }))
      this.labelNode.runAction(action)
    })
  },
});