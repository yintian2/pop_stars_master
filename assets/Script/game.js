/**
 * @author uu
 * @file 游戏控制
 */
var AC = require('action')
cc.Class({
  extends: cc.Component,
  properties: {
    _status: 0, //0 未开始 1 游戏开始 2 游戏暂停 3 游戏结束 4 下落状态 5无法触摸状态
    blockPrefab: cc.Prefab,
    blockSprite: [cc.SpriteFrame], //todo: 换成动态生成 暂不处理
    warningSpriteFrame: [cc.SpriteFrame],
    propSpriteFrame: [cc.SpriteFrame],
    checkMgr: require("check"),
    revivePage: cc.Node,
  },
  start() {
    this.bindNode()
    this.generatePool()
    this.loadRes()
  },
  loadRes() {

  },
  init(c) {
    this._controller = c
    this._score = c.scoreMgr
    this.rowNum = c.config.json.rowNum
    this.gap = c.config.json.gap
    this.animationSpeed = c.config.json.gap
    this.blockWidth = (730 - (this.rowNum + 1) * this.gap) / this.rowNum
    //console.log(this.gap)
    //console.log(this.blockWidth)
  },
  // 动态获取需要动态控制的组件
  bindNode() {
    this.blocksContainer = this.node.getChildByName('map')
  },
  //---------------- 游戏控制 ---------------------
  // 游戏开始
  gameStart() {
    this._score.init(this)
    this.mapSet(this.rowNum).then((result) => {
      // console.log('游戏状态改变', result)
      this._status = 1
    })
  },
  // 初始化地图
  mapSet(num) {
    this.map = new Array()
    let self = this
    // 生成两个随机的对象数组
    let a = Math.floor(Math.random() * num)
    let b = Math.floor(Math.random() * num)

    let c = Math.floor(1 + Math.random() * (num - 1)) - 1
    a == c ? c++ : ''
    let d = Math.floor(Math.random() * num)


    return new Promise((resolve, reject) => {
      for (let i = 0; i < num; i++) { //行
        this.map[i] = new Array()
        for (let j = 0; j < num; j++) { //列
          let itemType = (i == a && j == b) ? 1 : (i == c && j == d) ? 2 : 0
          self.map[i][j] = self.instantiateBlock(self, {
            x: j,
            y: i,
            width: self.blockWidth,
            startTime: (i + j + 1) * self._controller.config.json.startAnimationTime / num * 2
          }, self.blocksContainer, itemType)
        }
      }
      this.checkMgr.init(this)
      setTimeout(() => {
          resolve('200 OK');
          this.checkMgr.check(this)
        }, self._controller.config.json.startAnimationTime * num / 2 / 1
        //  (cc.game.getFrameRate() / 60)
      )
    })
  },
  //防抖动 判断是否需要检测下落
  checkNeedFall() {
    if (this.checkNeedFallTimer) {
      clearTimeout(this.checkNeedFallTimer)
    }
    this.checkNeedFallTimer = setTimeout(() => {
        if (this._status == 5) {
          this.onFall()
        }
      }, 300 / 1
      // (cc.game.getFrameRate() / 60)
    )
  },
  //方块下落
  onFall() {
    this.checkGenerateProp(this._score.chain).then(() => {
      let self = this
      this._status = 4
      let canFall = 0
      //从每一列的最下面一个开始往上判断
      //如果有空 就判断有几个空 然后让最上方的方块掉落下来
      for (let j = this.rowNum - 1; j >= 0; j--) {
        canFall = 0
        for (let i = this.rowNum - 1; i >= 0; i--) {
          if (this.map[i][j].getComponent('cell')._status == 2) {
            this.blockPool.put(this.map[i][j])
            this.map[i][j] = null
            canFall++
          } else {
            if (canFall != 0) {
              this.map[i + canFall][j] = this.map[i][j]
              this.map[i][j] = null
              this.map[i + canFall][j].getComponent('cell').playFallAction(canFall, {
                x: j,
                y: i + canFall,
              })
            }
          }
        }
        for (var k = 0; k < canFall; k++) {
          this.map[k][j] = this.instantiateBlock(this, {
            x: j,
            y: k,
            width: this.blockWidth,
            startTime: null
          }, this.blocksContainer, '', {
            x: j,
            y: -canFall + k
          })
          this.map[k][j].getComponent('cell').playFallAction(canFall, null)
        }
      }
      setTimeout(() => {
        this.checkMgr.init(this)
        this.checkMgr.check(this)
      }, 200)
      this._status = 1
    })
  },
  //防抖动 判断是否需要生成新方块
  checkNeedGenerator() {
    if (this.checkNeedGeneratorTimer) {
      clearTimeout(this.checkNeedGeneratorTimer)
    }
    this.checkNeedGeneratorTimer = setTimeout(() => {
        if (this._status == 4) {
          this.generateNewBlocks()
        }
      }, 300 / 1
      // (cc.game.getFrameRate() / 60)
    )
  },
  //生成新方块
  generateNewBlocks() {
    for (let i = 0; i < this.rowNum; i++) { //行
      for (let j = 0; j < this.rowNum; j++) { //列
        if (!this.map[i][j]) {
          this.map[i][j] = this.instantiateBlock(this, {
            x: j,
            y: i,
            width: this.blockWidth,
            startTime: null
          }, this.blocksContainer, 0)
        }
      }
    }
    this._status = 1
  },
  gameOver() {
    this._status = 3
    this._controller.pageMgr.addPage(2)
    this._controller.pageMgr.addPage(4)
  },
  // todo 复活
  askRevive() {
    this._controller.pageMgr.addPage(2)
    this._controller.pageMgr.addPage(5)
    this.revivePage.getChildByName('askRevive').active = true
    this.revivePage.getChildByName('successRevive').active = false
    let numLabel = this.revivePage.getChildByName('askRevive').getChildByName('numBg').getChildByName('num').getComponent(cc.Label)
    numLabel.string = 9
    this.reviveTimer = setInterval(() => {
      if (+numLabel.string > 0) {
        numLabel.string--
      } else {
        this.onSkipRevive()
      }
    }, 1000)
  },
  onReviveButton() {
    clearInterval(this.reviveTimer)
  },
  showReviveSuccess() {
    this.revivePage.getChildByName('askRevive').active = false
    this.revivePage.getChildByName('successRevive').active = true
  },
  onReviveCertainBtn() {
    this._controller.pageMgr.removePage(2)
    this._controller.pageMgr.removePage(5)
    this._status = 1
    this._score.onRevive()
  },
  onSkipRevive() {
    clearInterval(this.reviveTimer)
    this.revivePage.active = false
    this._score.onGameOver(true)
  },
  restart() {
    this._controller.pageMgr.onOpenPage(1)
    this.recoveryAllBlocks().then(() => {
      this.gameStart()
    })
  },
  // -----------------道具相关---------------
  // 储存用户点击时的方块 用于生成道具
  onUserTouched(iid, jid, itemType, color, warning, pos) {
    this.target = {
      i: iid,
      j: jid,
      color: color,
      itemType: itemType,
      x: pos.x,
      y: pos.y,
      warning: warning
    }
  },
  // 生成道具 type 1为双倍倍数 2为炸弹 3为加五百
  generatePropItem(type) {
    return new Promise((resolve, reject) => {
      // 是否做道具生成动画
      this.map[this.target.i][this.target.j] = this.instantiateBlock(this, {
        x: this.target.j,
        y: this.target.i,
        color: this.target.color,
        width: this.blockWidth,
        startTime: null
      }, this.blocksContainer, type)
      setTimeout(() => {
        resolve()
      }, 300)
    })
  },
  checkGenerateProp(chain) {
    return new Promise((resolve, reject) => {
      if (this.target.warning) {
        this.generatePropItem(this.target.warning).then(() => {
          resolve()
          return
        })
      }
      resolve()
    })
  },
  onItem(type, color, pos) {
    switch (type) {
      case 1:
        // 分数翻倍 最高八倍
        this._score.tipBox.init(this._score, 1)

        this._score.addMult(color, pos)
        this._controller.musicMgr.onDouble()
        for (let i = 0; i < this.rowNum; i++) { //行
          for (let j = 0; j < this.rowNum; j++) { //列
            if (this.map[i][j] && this.map[i][j].getComponent('cell')._status == 1) {
              let distance = Math.sqrt(Math.pow(pos.x - this.map[i][j].x, 2) + Math.pow(pos.y - this.map[i][j].y, 2))
              if (distance != 0) {
                this.map[i][j].getComponent('cell').surfaceAction(distance)
              }

            }
          }
        }
        break
      case 2:
        // 炸弹 消除同种颜色的
        this._score.tipBox.init(this._score, 2)
        this.node.runAction(AC.shackAction(0.1, 10))
        if (this._controller.social.node.avtive) {
          this._controller.social.onShakePhone()
        }
        this.isPropChain = true
        this._controller.musicMgr.onBoom()
        for (let i = 0; i < this.rowNum; i++) { //行
          for (let j = 0; j < this.rowNum; j++) { //列
            if (this.map[i][j] && this.map[i][j].getComponent('cell').color == color) {
              this.map[i][j].getComponent('cell').onTouched(color, false, true)
            } else {
              this.map[i][j].runAction(AC.rockAction(0.2, 10))
            }
          }
        }
        break
      case 3: //TODO:  500分道具 暂时屏蔽
        break;
    }
  },
  //--------------------- 预制体实例化---------------------
  // 生成对象池
  generatePool() {
    this.blockPool = new cc.NodePool()
    for (let i = 0; i < Math.pow(this.rowNum, 2); i++) {
      let block = cc.instantiate(this.blockPrefab)
      this.blockPool.put(block)
    }
  },
  // 实例化单个方块
  instantiateBlock(self, data, parent, itemType, pos) {
    itemType = itemType ? itemType : 0
    if (itemType != 0) {
      // console.log("道具节点数据", data, itemType)
    }
    let block = null
    if (self.blockPool && self.blockPool.size() > 0) {
      block = self.blockPool.get()
    } else {
      block = cc.instantiate(self.blockPrefab)
    }
    block.parent = parent
    block.scale = 1
    block.x = 0
    block.y = 0
    block.getComponent('cell').init(self, data, this.blockWidth, itemType, pos)
    return block
  },
  // 回收所有节点
  recoveryAllBlocks() {
    return new Promise((resolve, reject) => {
      let children = this.blocksContainer.children
      if (children.length != 0) {
        let length = children.length
        //   console.log(length)
        for (let i = 0; i < length; i++) {
          this.blockPool.put(children[0])
        }
        for (let i = 0; i < this.rowNum; i++) {
          for (let j = 0; j < this.rowNum; j++) {
            this.map[i][j] = null
          }
        }
      }
      resolve('')
    })
  },
});