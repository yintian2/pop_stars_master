/**
 * @author uu
 * @file 游戏控制
 */
cc.Class({
  extends: cc.Component,
  properties: {
    _status: 0, //0 未开始 1 游戏开始 2 游戏暂停 3 游戏结束
    blockPrefab: cc.Prefab,
    blockSprite: [cc.SpriteFrame] //todo: 换成动态生成
  },
  init(c) {
    this._controller = c
    this.bindNode()
    this.generatePool()
    this.rowNum = parseInt(c.config.json.rowNum)
    this.gap = parseInt(c.config.json.gap)
    this.blockWidth = (730 - (this.rowNum + 1) * this.gap) / this.rowNum
  },
  // 生成对象池
  generatePool() {
    this.blockPool = new cc.NodePool()
    for (let i = 0; i < Math.pow(this.rowNum, 2); i++) {
      let block = cc.instantiate(this.blockPrefab)
      this.blockPool.put(block)
    }
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
            startTime: (i * num + j + 1) * 80
          }, self.blocksContainer)
        }
      }
      setTimeout(() => {
        resolve('200 OK');
      }, 80 * Math.pow(num, 2))
    })
  },
  // 动态获取需要动态控制的组件
  bindNode() {
    this.leftStepLabel = this.node.getChildByName('leftStepNode').getChildByName('Label').getComponent(cc.Label)
    this.scoreLabel = this.node.getChildByName('scoreNode').getChildByName('Label').getComponent(cc.Label)
    this.playerSprite = this.node.getChildByName('playerNode').getChildByName('Sprite').getComponent(cc.Sprite)
    this.blocksContainer = this.node.getChildByName('map')
  },
  // 游戏开始
  gameStart() {
    this.mapSet(this.rowNum || 8).then((result) => {
      console.log('游戏状态改变', result)
      this._status = 1
    })
  },
  // 实例化单个方块
  instantiateBlock(self, data, parent) {
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
    block.getComponent('cell').init(self, data, this.blockWidth)
    return block
  },
  // 回收所有节点
  recoveryAllBlocks() {
    let childrens = this.blocksContainer.childrens
    if (childrens.length != 0) {
      let length = childrens.length
      for (let i = 0; i < length; i++) {
        this.blockPool.put(childrens[i])
      }
    }
  }
});