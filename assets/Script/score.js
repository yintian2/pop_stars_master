/**
 * @author uu
 * @file  UI 分数控制器
 */
var AC = require('action')

cc.Class({
  extends: cc.Component,
  properties: {
    scorePrefab: cc.Prefab,
    scoreParticlePrefab: cc.Prefab,
    mainScoreLabel: cc.Label,
    successDialog: require('successDialog'),
    characterMgr: require('character'),
    failDialog: cc.Node,
    multPropPrefab: cc.Prefab,
    // progressBar: require('progress'),
    // leftStepLabel: cc.Label,
    chainSpriteFrameArr: [cc.SpriteFrame],
    stepAniLabel: cc.Label,

    //提示小框
    tipBox: require('tipBox')
  },
  init(g) {
    this._game = g
    this._controller = g._controller
    this.score = 0
    this.leftStep = this._controller.config.json.originStep
    this.chain = 1
    this.level = 1
    this.reviveTime = 0
    this.closeMultLabel()
    this.levelData = g._controller.gameData.json.levelData
    this.nameLabel.string = "农民"
    this.progressBar.init(0, this.levelData[this.level - 1], this.level)
    this.leftStepLabel.string = this.leftStep
    this.stepAniLabel.node.runAction(cc.hide())
    this.scoreTimer = []
    this.currentAddedScore = 0
    this.mainScoreLabel.node.active = false
    this.characterMgr.showCharacter(this.level)
    this.hideChainSprite()

    this.tipBox.init(this, 0)
    if (this._controller.social.node.active) {
      let height = this._controller.social.getHighestLevel()
      if (height) {
        this.onStep(this.levelData[+height - 1].giftStep)
      }
    }
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
    this.multPropPool = new cc.NodePool()
    for (let i = 0; i < 3; i++) {
      let multProp = cc.instantiate(this.multPropPrefab)
      this.multPropPool.put(multProp)
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
    this.scoreContainer = this.node.getChildByName('UI').getChildByName('scoreGroup')
    this.multLabel = this.mainScoreLabel.node.getChildByName('mult').getComponent(cc.Label)
    this.nameLabel = this.node.getChildByName('UI').getChildByName('scoreNode').getChildByName('progressBar').getChildByName('name').getComponent(cc.Label)
    // 失败时更新失败UI
    this.chainSprite = this.node.getChildByName('UI').getChildByName('chainSprite').getComponent(cc.Sprite)
    this.failScore = this.failDialog.getChildByName('info').getChildByName('score').getComponent(cc.Label)
    this.failName = this.failDialog.getChildByName('info').getChildByName('level').getComponent(cc.Label)
    this.failSprite = this.failDialog.getChildByName('info').getChildByName('sprite').getComponent(cc.Sprite)
    this.failHighScore = this.failDialog.getChildByName('info').getChildByName('highScore').getComponent(cc.Label)
  },
  //--------------------- 分数控制 ---------------------
  // 增加 减少步数并且刷新UI
  onStep(num) {
    this.leftStep += num
    return new Promise((resolve, reject) => {
      if (this.leftStep < 0) {
        this.leftStep = 0
        this.onGameOver()
        resolve(false)
      } else {
        resolve(true)
      }
      this.leftStepLabel.string = this.leftStep
      if (num > 0) {
        this.showStepAni(num)
      }
    })
  },

  //增加分数总控制 获取连击
  addScore(pos, score) {
    score = score || this._controller.config.json.scoreBase
    // 一次消除可以叠chain
    if (this.chainTimer) {
      clearTimeout(this.chainTimer)
    }
    this.initCurrentScoreLabel()
    this.chainTimer = setTimeout(() => {
        this.onCurrentScoreLabel(this.currentAddedScore, {
          x: -60,
          y: 355
        }, cc.callFunc(() => {
          this.score += this.currentAddedScore * this.multiple
          this.checkLevelUp()
          this.chain = 1
          this.closeMultLabel()
          this.hideChainSprite()
          this.currentAddedScore = 0
          this.mainScoreLabel.node.active = false
        }, this))
      }, 500 / 1
      // (cc.game.getFrameRate() / 60)
    )
    let addScore = score == this._controller.config.json.scoreBase ? (score + (this.chain > 16 ? 16 : (this.chain - 1)) * 10) : score
    // let addScore = score == 10 ? score * (this.chain > 10 ? 10 : this.chain) : score
    this.currentAddedScore += addScore
    this.mainScoreLabel.string = this.currentAddedScore
    this.instantiateScore(this, addScore, pos)
    this.chain++
    this.checkChain()
  },
  // 判断连击
  checkChain() {
    if (this.checkChainTimer) {
      clearTimeout(this.checkChainTimer)
    }
    this.checkChainTimer = setTimeout(() => {
      let config = this._controller.config.json.chainConfig
      for (let i = 0; i < config.length; i++) {
        if (this.chain <= config[i].max && this.chain >= config[i].min) {
          //  console.log(config[i].text)
          this.showChainSprite(i)
          return
        }
      }
    }, 200)
  },
  showChainSprite(id) {
    this.chainSprite.spriteFrame = this.chainSpriteFrameArr[id]
    this.chainSprite.node.scale = 0.5
    this.chainSprite.node.active = true
    this.chainSprite.node.runAction(AC.popOut(0.3))
  },
  hideChainSprite() {
    this.chainSprite.node.active = false
  },
  checkLevelUp() {
    if (this.level < this.levelData.length && this.score >= this.levelData[this.level - 1].score) {
      this.level++
      this.level > (this.levelData.length + 1) ? this.levelLimit() : this.onLevelUp()
    }
    this.progressBar.init(this.score, this.levelData[this.level - 1], this.level)
  },
  // 增加倍数
  addMult(color, pos) {
    //TODO: 动态生成一个图片 移动到multLabel上 有bug
    // if (this.multPropPool.size() > 0) {
    //   let multProp = this.multPropPool.get()
    //   multProp.parent = this.mainScoreLabel.node
    //   multProp.x = pos.x
    //   multProp.y = pos.y
    //   multProp.getComponent(cc.Sprite).spriteFrame = this._game.propSpriteFrame[color - 1]
    //   multProp.runAction(cc.sequence(cc.moveTo(0.2, 187, 0), cc.callFunc(() => {
    //     this.multPropPool.put(multProp)
    //   })))
    // }
    if (this.multiple < this._controller.config.json.maxMultiple) {
      this.multiple *= 2
      this.showMultLabel()
    }
  },
  // 关闭倍数的数字显示
  closeMultLabel() {
    this.multiple = 1
    this.multLabel.node.active = false
  },
  showMultLabel() {
    this.multLabel.node.scale = 0.5
    this.multLabel.string = this.multiple
    this.multLabel.node.active = true
    this.multLabel.node.runAction(AC.popOut(0.3))
  },
  // 增加分数倍数
  initCurrentScoreLabel() {
    this.mainScoreLabel.node.active = true
    this.mainScoreLabel.node.x = 0
    this.mainScoreLabel.node.y = 0
    this.mainScoreLabel.node.scale = 1
  },
  // 生成小的分数节点
  onCurrentScoreLabel(num, pos, callback) {
    // TODO: 增加一个撒花特效
    this.mainScoreLabel.string = num
    let action = cc.spawn(cc.moveTo(0.2, pos.x, pos.y), cc.scaleTo(0.2, 0.4)).easing(cc.easeBackOut())
    let seq = cc.sequence(action, callback)
    this.mainScoreLabel.node.runAction(seq)
  },
  // 升级
  onLevelUp() {
    this._controller.pageMgr.addPage(2)
    this._controller.pageMgr.addPage(3)
    this._controller.musicMgr.onWin()
    this.successDialog.init(this, this.level, this.levelData, this.score) //升级之后的等级
    this.characterMgr.onLevelUp()
    this.characterMgr.onSuccessDialog(this.level)
    this._game._status = 2
    if (this._controller.social.node.active) {
      this._controller.social.openBannerAdv()
    }
  },
  // 等级限制
  levelLimit() {
    //console.log('等级达到上限')
    this.hideNextLevelData()
  },
  // 点击升级按钮
  onLevelUpButton(double) {
    console.log(double)
    if (this.isLevelUp) {
      return
    } else {
      this.isLevelUp = true
    }
    setTimeout(() => {
      this.isLevelUp = false
    }, 500)
    if (double && double.currentTarget) {
      double = 1
    } else {
      double = double || 1
    }
    this._controller.pageMgr.onOpenPage(1)
    this.initCurrentScoreLabel()
    this.mainScoreLabel.string = this.levelData[this.level - 2].step * double
    this.characterMgr.onLevelUpBtn(this.level)
    this.nameLabel.string = this.levelData[this.level - 1].name
    setTimeout(() => {
      this.onCurrentScoreLabel(this.levelData[this.level - 2].step * double, {
        x: -248,
        y: 350
      }, cc.callFunc(() => {
        // this.tipBox.init(this) 每次升级就咏诗
        this.onStep(this.levelData[this.level - 2].step * double).then()
        this._game._status = 1
        this.mainScoreLabel.node.active = false
      }))
    }, 300);
    this.showNextLevelData()
    this.checkLevelUp()
  },
  // todo: 新增一个 动画 数字上浮和缩放
  showStepAni(num) {
    this.stepAniLabel.string = '+' + (num + '')
    this.stepAniLabel.node.x = -248
    this.stepAniLabel.node.y = 400
    this.stepAniLabel.node.runAction(cc.sequence(cc.toggleVisibility(), cc.moveBy(0.6, 0, 60), cc.toggleVisibility()))
    let action = cc.sequence(cc.scaleTo(0.2, 0.8), AC.popOut(0.8))
    this.leftStepLabel.node.parent.runAction(action)
  },
  // 游戏结束
  // todo 复活
  onGameOver(isTrue) {
    isTrue = isTrue || 0
    if (this._game._status != 3 && (isTrue || this.reviveTime >= 3)) {
      this._game.gameOver()
      this.updateFailPage()
      if (this._controller.social.node.active) {
        // 仅上传分数
        this._controller.social.onGameOver(this.level, this.score)
      }
    } else if (!isTrue) {
      this._game.askRevive()
    }
  },
  onDoubleStepBtn() {
    if (this._controller.social.node.active) {
      this._controller.social.onReviveButton(0)
    } else {
      this.onLevelUpButton(2)
    }
  },
  onDoubleStep() {
    this.onLevelUpButton(2)
  },
  onRevive() {
    this.reviveTime += 1
    this.onStep(5).then()
  },
  // 展示下一级的信息
  showNextLevelData() {
    let nextLevelData = this.levelData[this.level]
  },
  // 达到最高级之后 隐藏
  hideNextLevelData() {

  },
  updateFailPage() {
    this.failScore.string = " " + (this.score + '')
    this.characterMgr.onFail(this.level)
    this.failName.string = this.levelData[this.level - 1].name
    //this.failHighScore.string = "正在获取您的最高分..."
  },

});