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

  check(g) { //该函数主要用于检测一个区块能否形成道具等
    this._game = g
    this.map = g.map
    this.mapLength = g.rowNum
    for (let i = 0; i < this.mapLength; i++) { //行
      this.groups[i] = []
      for (let j = 0; j < this.mapLength; j++) { //列
        // this.map[i][j].getComponent('cell').growInit() //全部初始化
        this.map[i][j].getComponent('cell').isPush = false
        this.groups[i][j] = []
      }
    }
    for (let i = 0; i < this.mapLength; i++) { //行
      for (let j = 0; j < this.mapLength; j++) { //列
        this.pushPop(this.map[i][j], i, j)
      }
    }
    this.dealGroups()
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
  dealGroups() {
    let propConfig = this._game._controller.config.json.propConfig
    cc.log("预判数组 是否能生成道具:", this.groups)
    for (let i = 0; i < this.mapLength; i++) { //行
      for (let j = 0; j < this.mapLength; j++) { //列
        // 判断数组长度是否满足生成道具的长度
        for (let i = 0; i < propConfig.length; i++) {
          if (this.groups[i][j].length <= propConfig[i].max && this.groups[i][j].length >= propConfig[i].min) {
            this.warning(propConfig[i].type, this.groups[i][j])
          }
        }
      }
    }
  },
  warning(type, group) {
    group.map(item => {
      item.getComponent('cell').onWarning(type)
    })
  }
});