cc.Class({
  extends: cc.Component,

  properties: {
    particle: cc.ParticleSystem,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(s, pos, time) {
    this._score = s
    this.node.x = pos.x
    this.node.y = pos.y
    this.node.active = true
    // this.particle.resetSystem()
    this.node.scale = 1
    setTimeout(() => {
        this.node.active = false
        this.particle.stopSystem()
        //  s.scoreParticlePool.put(this.node)
      }, time / 1
      //(cc.game.getFrameRate() / 60)
    )
  }

  // update (dt) {},
});