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
    mainScoreLabel: cc.Label,
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
    this.currentAddedScore = 0
    this.mainScoreLabel.node.active = false
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
  instantiateScore(self, num, pos) {
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
    this.mainScoreLabel.node.active = true
    this.mainScoreLabel.node.x = 0
    this.mainScoreLabel.node.y = 0
    this.mainScoreLabel.node.scale = 1
    if (this.chainTimer) {
      clearTimeout(this.chainTimer)
    }
    this.chainTimer = setTimeout(() => {
      let action = cc.spawn(cc.moveTo(0.2, 0, 355), cc.scaleTo(0.2, 0.4)).easing(cc.easeBackOut())
      let seq = cc.sequence(action, cc.callFunc(() => {
        this.score += this.currentAddedScore
        this.progressBar.init(this.score, 20000)
        this.chain = 1
        this.currentAddedScore = 0
        this.mainScoreLabel.node.active = false
      }, this))
      this.mainScoreLabel.node.runAction(seq)
    }, 300)
    this.currentAddedScore += this._controller.config.json.scoreBase * (this.chain > 10 ? 10 : this.chain)
    this.mainScoreLabel.string = this.currentAddedScore
    this.instantiateScore(this, this._controller.config.json.scoreBase * (this.chain > 10 ? 10 : this.chain), pos)
    this.chain++
  },
});