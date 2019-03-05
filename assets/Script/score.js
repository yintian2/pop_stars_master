/**
 * @author uu
 * @file  UI 分数控制器
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    scorePrefab: cc.Prefab,
    scoreParticlePrefab: cc.Prefab,
  },
  init(g) {
    this._game = g
    this._controller = g._controller
    this.score = 0
    this.leftStep = this._controller.config.json.originStep
    this.chain = 1
    // this.scoreLabel.string = "当前得分:" + this.score
    this.progressBar.init(0, 20000)
    this.leftStepLabel.string = "剩余步数:" + this.leftStep
    this.scoreTimer = []
  },
  start() {
    this.generatePool()
    this.bindNode()
  },
  generatePool() {
    this.scorePool = new cc.NodePool()
    for (let i = 0; i < 20; i++) {
      let score = cc.instantiate(this.scorePrefab)
      this.scorePool.put(score)
    }
    this.scoreParticlePool = new cc.NodePool()
    for (let i = 0; i < 20; i++) {
      let scoreParticle = cc.instantiate(this.scoreParticlePrefab)
      this.scoreParticlePool.put(scoreParticle)
    }
  },
  // 实例化单个方块
  instantiatescore(self, num, pos) {
    let score = null
    if (self.scorePool && self.scorePool.size() > 0) {
      score = self.scorePool.get()
    } else {
      score = cc.instantiate(self.scorePrefab)
    }
    score.parent = this.scoreContainer
    score.getComponent('scoreCell').init(self, num, pos)

    let scoreParticle = null
    if (self.scoreParticlePool && self.scoreParticlePool.size() > 0) {
      scoreParticle = self.scoreParticlePool.get()
    } else {
      scoreParticle = cc.instantiate(self.scoreParticlePrefab)
    }
    scoreParticle.parent = this.scoreContainer
    scoreParticle.getComponent('scoreParticle').init(self, pos, this._controller.config.json.scoreParticleTime)
  },
  bindNode() {
    this.leftStepLabel = this.node.getChildByName('UI').getChildByName('leftStepNode').getChildByName('Label').getComponent(cc.Label)
    this.progressBar = this.node.getChildByName('UI').getChildByName('scoreNode').getChildByName('progressBar').getComponent('progress')
    //  this.scoreLabel = this.node.getChildByName('UI').getChildByName('scoreNode').getChildByName('Label').getComponent(cc.Label)
    this.scoreContainer = this.node.getChildByName('UI').getChildByName('scoreGroup')
  },
  //--------------------- 分数控制 ---------------------

  onStep(num) {
    this.leftStep += num
    if (this.leftStep < 0) {
      this.leftStep = 0
      this._game.gameOver()
    }
    this.leftStepLabel.string = "剩余步数:" + this.leftStep
  },
  addScore(pos) {
    // 一次消除可以叠chain
    if (this.chainTimer) {
      clearTimeout(this.chainTimer)
    }
    this.chainTimer = setTimeout(() => {
      this.chain = 1
    }, 500)
    this.score += this._controller.config.json.scoreBase
    this.scoreTimer[this.chain] = setTimeout(() => {
      //this.scoreLabel.string = "当前得分:" + this.score
      this.progressBar.init(this.score, 20000)
    }, 600 + 250 * this.chain)
    this.instantiatescore(this, this.chain * this._controller.config.json.scoreBase, pos)
    this.chain++
  },
});