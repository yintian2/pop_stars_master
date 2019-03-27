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
    this.map = g.map
    this.mapLength = g.rowNum
    for (let i = 0; i < mapLength; i++) { //行
      for (let j = 0; j < mapLength; j++) { //列
        // map[i][j].getComponent('cell').growInit() //全部初始化
      }
    }
    for (let i = 0; i < mapLength; i++) { //行
      for (let j = 0; j < mapLength; j++) { //列
        this.checkSideColor(map[i][j], i, j)
      }
    }
  },
  checkSideColor(target, i, j) { //用于判断一个方块四个方向上的方块颜色是否一样 如果一样则加入组 如果组长度小于1则返回false?
    groups[i][j] = []
    target.getComponent('cell').isPush = true
    groups[i][j].push(target)
    if (i - 1 >= 0) {
      this.checkColor(map[i][j], map[i - 1][j], 1)
    }
    if (i + 1 < mapLength) {
      this.checkColor(map[i][j], map[i + 1][j], 2)
    }
    if (j - 1 >= 0) {
      this.checkColor(map[i][j], map[i][j - 1], 3)
    }
    if (j + 1 < mapLength) {
      this.checkColor(map[i][j], map[i][j + 1], 4)
    }
  }
});