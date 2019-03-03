/**
 * @author uu
 * @file 游戏控制
 */
cc.Class({
  extends: cc.Component,
  properties: {
    _status: 0, //0 未开始 1 游戏开始 2 游戏暂停 3 游戏结束
    blockPrefab: cc.Prefab,
  },
  init(c) {
    this._controller = c
  },
  start() {
    this.bindNode()
    this.generatePool()
  },
  generatePool() {
    this.blockPool = new cc.NodePool()
    for (let i = 0; i < Math.pow(this.rowNum, 2); i++) {
      let block = cc.instantiate(this.blockPrefab)
      this.blockPool.put(block)
    }
  },
  mapSet(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('200 OK');
      }, 5000)
    })
  },
  // 动态获取需要动态控制的组件
  bindNode() {
    this.leftStepLabel = this.node.getChildByName('leftStepNode').getChildByName('Label').getComponent(cc.Label)
    this.scoreLabel = this.node.getChildByName('scoreNode').getChildByName('Label').getComponent(cc.Label)
    this.playerSprite = this.node.getChildByName('playerNode').getChildByName('Sprite').getComponent(cc.Sprite)
    this.blocksContainer = this.node.getChildByName('map')
  },
  gameStart() {

    // 实例化方框
    this.mapSet(this.rowNum || 8).then((result) => {
      console.log('游戏状态改变', result)
      this._status = 1
    })
  },
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
    block.getComponent('Cell').init(self, data)
  },
  recoveryAllBlocks() {
    let childrens = this.blocksContaine.childrens
    if (childrens.length != 0) {
      let length = childrens.length
      for (let i = 0; i < length; i++) {
        this.blockPool.put(childrens[i])
      }
    }
  }
});