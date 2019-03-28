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
    blockSprite: [cc.SpriteFrame], //todo: 换成动态生成
    warningSpriteFrame: [cc.SpriteFrame],
    propSpriteFrame: [cc.SpriteFrame],
    checkMgr: require("check")
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
      console.log('游戏状态改变', result)
      this._status = 1
    })
  },
  // 初始化地图
  mapSet(num) {
    this.map = new Array()
    let self = this
    return new Promise((resolve, reject) => {
      for (let i = 0; i < num; i++) { //行
        this.map[i] = new Array()
        for (let j = 0; j < num; j++) { //列
          self.map[i][j] = self.instantiateBlock(self, {
            x: j,
            y: i,
            width: self.blockWidth,
            startTime: (i + j + 1) * self._controller.config.json.startAnimationTime / num * 2
          }, self.blocksContainer, 0)
        }
      }
      this.checkMgr.init(this)
      setTimeout(() => {
          resolve('200 OK');
          //this.checkAll()
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
            y: -k - 1
          })
          this.map[k][j].getComponent('cell').playFallAction(canFall, null)
        }
      }
      console.log(this.map)
      this.checkMgr.init(this)
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
    this.checkMgr.check(this)
    this._status = 1
    // 暂时废弃该检验 改用checkMgr
    // this.checkAll().then(() => {
    //   this._status = 1
    // })
  },
  // 检查当前全部方块
  // checkAll() {
  //   return new Promise((resolve, reject) => {
  //     for (let i = 0; i < this.rowNum; i++) { //行
  //       for (let j = 0; j < this.rowNum; j++) { //列
  //         this.map[i][j].getComponent('cell').growInit()
  //         if ((i - 1) >= 0) {
  //           this.checkColor(this.map[i][j], this.map[i - 1][j], 1)
  //         }
  //         if ((i + 1) < this.rowNum) {
  //           this.checkColor(this.map[i][j], this.map[i + 1][j], 2)
  //         }
  //         if ((j - 1) >= 0) {
  //           this.checkColor(this.map[i][j], this.map[i][j - 1], 3)
  //         }
  //         if ((j + 1) < this.rowNum) {
  //           this.checkColor(this.map[i][j], this.map[i][j + 1], 4)
  //         }
  //       }
  //     }
  //     resolve()
  //   })
  // },
  // checkColor(origin, target, type) {
  //   if (origin.getComponent('cell').color == target.getComponent('cell').color) {
  //     //  origin.getComponent('cell').grow(type)
  //   }
  // },
  gameOver() {
    this._status = 3
    this._controller.pageMgr.addPage(2)
    this._controller.pageMgr.addPage(4)
  },
  restart() {
    this._controller.pageMgr.onOpenPage(1)
    this.recoveryAllBlocks().then(() => {
      this.gameStart()
    })
  },
  // -----------------道具相关---------------
  // 储存用户点击时的方块 用于生成道具
  onUserTouched(iid, jid, itemType, color, pos) {
    this.target = {
      i: iid,
      j: jid,
      color: color,
      itemType: itemType,
      x: pos.x,
      y: pos.y
    }
  },
  // 生成道具 type 1为双倍倍数 2为炸弹
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
      chain--
      // 判断当前是否是炸弹状态 如果是则把状态还原
      if (this.isPropChain) {
        this.isPropChain = false
        resolve()
        return
      }
      //  console.log(chain)
      // 判断chain的大小查看是否能生成道具
      let propData = this._controller.config.json.propConfig
      for (let i = 0; i < propData.length; i++) {
        if (chain <= propData[i].max && chain >= propData[i].min) {
          this.generatePropItem(propData[i].type).then(() => {
            resolve()
            return
          })
          //this.map[this.target.i][this.target.j].getComponent('cell').generateItem(propData[i].type)
        }
      }
      resolve()
    })
  },
  onItem(type, color) {
    switch (type) {
      case 1:
        // 分数翻倍 最高八倍
        this._score.addMult()
        break
      case 2:
        // 炸弹 消除同种颜色的
        this.node.runAction(AC.shackAction(0.1, 10))
        this.isPropChain = true
        for (let i = 0; i < this.rowNum; i++) { //行
          for (let j = 0; j < this.rowNum; j++) { //列
            if (this.map[i][j] && this.map[i][j].getComponent('cell').color == color) {
              this.map[i][j].getComponent('cell').onTouched(color, false, true)
            }
          }
        }
        break
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