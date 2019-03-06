/**
 * @author uu
 * @file 单个方块控制
 */
cc.Class({
  extends: cc.Component,
  properties: {
    _status: 0, //1为可触发点击 2为已经消失
  },
  init(g, data, width) {
    this._game = g
    this._controller = g._controller
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
    if (color.type) {
      console.log('方块位置', this.iid, this.jid)
      this._game._score.onStep(-1)
      color = this.color
      if (this._status == 1 && this._game._status == 1 && this.color == color) {
        this.playDieAction().then(() => {
          this.onBlockPop(color)
        })
      }
    } else {
      if (this._status == 1 && this._game._status == 5 && this.color == color) {
        this.playDieAction().then(() => {
          this.onBlockPop(color)
        })
      }
    }

  },
  onBlockPop(color) {
    let self = this
    self._game.checkNeedFall()
    self._game._status = 5
    self._controller.musicMgr.onPlayAudio(0)
    self._game._score.addScore(cc.v2(this.node.x, this.node.y - this.node.width + this._game.gap))
    if (self.iid - 1 >= 0) {
      self._game.map[self.iid - 1][self.jid].getComponent('cell').onTouched(color)
    }
    if (self.iid + 1 < this._game.rowNum) {
      self._game.map[self.iid + 1][self.jid].getComponent('cell').onTouched(color)
    }
    if (self.jid - 1 >= 0) {
      self._game.map[self.iid][self.jid - 1].getComponent('cell').onTouched(color)
    }
    if (self.jid + 1 < this._game.rowNum) {
      self._game.map[self.iid][self.jid + 1].getComponent('cell').onTouched(color)
    }
  },
  playFallAction(y, data) { //下降了几个格子
    this._status = 0
    this.iid = data.y
    this.jid = data.x
    let action = cc.moveBy(0.3 * y / this._game.animationSpeed, 0, -y * (this._game.gap + this._game.blockWidth))
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
    let action = cc.scaleTo(0.2 / this._game.animationSpeed, 1, 1)
    let seq = cc.sequence(action, cc.callFunc(() => {
      this._status = 1
    }, this))
    // 如果有延迟时间就用延迟时间
    if (this.startTime) {
      setTimeout(() => {
        this.node.runAction(seq)
      }, this.startTime)
    } else {
      this.node.runAction(seq)
    }
  },
  playDieAction() {
    let self = this
    this._status = 2
    this.node.scaleX = 1
    this.node.scaleY = 1
    return new Promise((resolve, reject) => {
      let action = cc.scaleTo(0.2 / self._game.animationSpeed, 0, 0)
      let seq = cc.sequence(action, cc.callFunc(() => {
        resolve('')
      }, this))
      self.node.runAction(seq)
    });
  }
});