/**
 * @author uu
 * @file 检测组件
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    groups: [],
    map: [],
    mapLength: 8
  },
  init(g) {
    this._game = g
    this.map = g.map
    this.mapLength = g.rowNum
    for (let i = 0; i < this.mapLength; i++) { //行
      this.groups[i] = []
      for (let j = 0; j < this.mapLength; j++) { //列
        // this.map[i][j].getComponent('cell').growInit() //全部初始化
        if (!this.map[i][j]) {
          cc.log('报错x,y:', i, j)
        }
        this.map[i][j].getComponent('cell').warningInit()
        this.groups[i][j] = []
      }
    }
  },
  check(g) { //该函数主要用于检测一个区块能否形成道具等
    let propConfig = g._controller.config.json.propConfig
    this._game = g
    this.map = g.map
    this.mapLength = g.rowNum
    let min = 999
    for (let i = 0; i < propConfig.length; i++) {
      min = propConfig[i].min < min ? propConfig[i].min : min
    }
    for (let i = 0; i < this.mapLength; i++) { //行
      for (let j = 0; j < this.mapLength; j++) { //列
        this.pushPop(this.map[i][j], i, j)
        if (this.groups[i][j].length >= min) {
          for (let z = 0; z < propConfig.length; z++) {
            if (this.groups[i][j].length <= propConfig[z].max && this.groups[i][j].length >= propConfig[z].min) {
              this.warning(propConfig[z].type, this.groups[i][j])
            }
          }
        }
      }
    }
  },
  pushPop(target, i, j) { //用于判断一个方块四个方向上的方块颜色是否一样 如果一样则加入组 如果组长度小于1则返回false?
    // if (target.getComponent('cell').isPush==true) {
    //   return
    // }
    target.getComponent('cell').isPush = true
    this.groups[i][j].push(target)
    let x = target.getComponent('cell').iid
    let y = target.getComponent('cell').jid
    if ((x - 1) >= 0) {
      if (!this.map[x - 1][y].getComponent('cell').isPush && this.map[x - 1][y].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x - 1][y], i, j)
      }
    }
    if ((x + 1) < this.mapLength) {
      if (!this.map[x + 1][y].getComponent('cell').isPush && this.map[x + 1][y].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x + 1][y], i, j)
      }
    }
    if ((y - 1) >= 0) {
      if (!this.map[x][y - 1].getComponent('cell').isPush && this.map[x][y - 1].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x][y - 1], i, j)
      }
    }
    if ((y + 1) < this.mapLength) {
      if (!this.map[x][y + 1].getComponent('cell').isPush && this.map[x][y + 1].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x][y + 1], i, j)
      }
    }
  },
  warning(type, group) {
    group.map(item => {
      item.getComponent('cell').onWarning(type)
    })
  }
});