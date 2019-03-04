/**
 * @author uu
 * @file 单个方块控制
 */
cc.Class({
  extends: cc.Component,
  properties: {
    _status: 0, //1为可触发点击
  },
  init(g, data, width) {
    this._game = g
    // 计算宽
    this.node.width = this.node.height = width
    this.startTime = data.startTime
    this.iid = data.y
    this.jid = data.x
    // console.log('生成方块位置', data.y, data.x)
    this.node.x = -(730 / 2 - g.gap - width / 2) + data.x * (width + g.gap)
    this.node.y = (730 / 2 - g.gap - width / 2) - data.y * (width + g.gap)
    this.color = Math.ceil(Math.random() * 4)
    this.bindEvent()
    this.playStartAction()
  },
  bindEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this)
    this.getComponent(cc.Sprite).spriteFrame = this._game.blockSprite[this.color - 1]
  },
  onTouched(color) {
    console.log('方块位置', this.iid, this.jid)
    color = color.type ? this.color : color
    let self = this
    if (this._status == 1 && this._game._status == 1 && this.color == color) {
      this.playDieAction().then(() => {
        self._game.checkNeedFall()
        if (self.iid - 1 >= 0) {
          self._game.map[self.iid - 1][self.jid].getComponent('cell').onTouched(color)
        } else {
          // console.log('上方没有东西:', self.iid, self.jid)
        }
        if (self.iid + 1 < this._game.rowNum) {
          self._game.map[self.iid + 1][self.jid].getComponent('cell').onTouched(color)
        } else {
          //  console.log('下方没有东西', self.iid, self.jid)
        }
        if (self.jid - 1 >= 0) {
          self._game.map[self.iid][self.jid - 1].getComponent('cell').onTouched(color)
        } else {
          //  console.log('左边没有东西', self.iid, self.jid)
        }
        if (self.jid + 1 < this._game.rowNum) {
          self._game.map[self.iid][self.jid + 1].getComponent('cell').onTouched(color)
        } else {
          //  console.log('右边没有东西', self.iid, self.jid)
        }
      })
    }
  },
  playFallAction(y, data) { //下降了几个格子
    this._status = 0
    this.iid = data.y
    this.jid = data.x
    let action = cc.moveBy(0.2 * y, 0, -y * (this._game.gap + this._game.blockWidth))
    let seq = cc.sequence(action, cc.callFunc(() => {
      this._status = 1
      this._game.checkNeedGenerator()
    }, this))
    this.node.runAction(seq)

  },
  playStartAction() {
    this._status = 0
    this.node.scaleX = 0
    this.node.scaleY = 0
    let action = cc.scaleTo(0.2, 1, 1)
    // let seq = cc.sequence(action)
    // 如果有延迟时间就用延迟时间
    this.startTime ? setTimeout(() => {
      this.node.runAction(action)
      this._status = 1
    }, this.startTime) : this.node.runAction(action)

  },
  playDieAction() {
    let self = this
    this._status = 0
    this.node.scaleX = 1
    this.node.scaleY = 1
    return new Promise((resolve, reject) => {
      let action = cc.scaleTo(0.2, 0, 0)
      // let seq = cc.sequence(action, resolve(''))
      self.node.runAction(action)
      setTimeout(() => {
        resolve('')
      }, 200);
    });
  }
});