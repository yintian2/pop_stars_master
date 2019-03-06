cc.Class({
  extends: cc.Component,

  properties: {
    label: cc.Label,
    //particle: cc.ParticleSystem,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(s, num, pos) {
    this._score = s
    this.node.x = pos.x
    this.node.y = pos.y
    this.label.string = num
    //this.particle.resetSystem()
    this.node.scale = 1
    this.label.node.x = 0
    this.label.node.y = 0
    this.label.node.scale = 1
    let action1 = cc.scaleTo(0.1, 1.2, 1.2)
    let action2 = cc.moveBy(0.1, 0, 30)
    let action3 = cc.moveTo(0.2, 0, 0)
    let action4 = cc.scaleTo(0.2, 0.5, 0.5)
    // let seq = cc.sequence(action1, cc.callFunc(() => {
    //   let seq2 = cc.sequence(action3, cc.moveBy(0.1, 0, 0), action4, cc.callFunc(() => {
    //     s.scorePool.put(this.node)
    //   }, this))
    //   this.node.runAction(seq2)
    // }, this))
    // this.label.node.runAction(seq)
    let spa1 = cc.spawn(action1, action2)
    let spa2 = cc.spawn(action3, action4)
    let seq = cc.sequence(spa1, spa2, cc.callFunc(() => {
      s.scorePool.put(this.node)
    }, this))
    this.node.runAction(seq)
  }

  // update (dt) {},
});