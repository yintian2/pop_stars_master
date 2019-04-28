// 提示框
cc.Class({
  extends: cc.Component,

  properties: {
    label: cc.Label,
  },
  start() {
    this.tip = ['一次性大量消除可获得道具!', 'X2道具可以翻倍一次消除的分数', '炸弹道具可以消除全屏同色方块', '单个方块无法消除哦']
    this.otherTip = [
      '长风破浪会有时，直挂云帆济沧海',
      '衣带渐宽终不悔，为伊消得人憔悴',
      '纸上得来终觉浅，绝知此事要躬行',
      '君子坦荡荡，小人长戚戚',
      '穷则独善其身，达则兼济天下',
      '盛年不重来，一日难再晨'
    ]
  },
  init(s, type) { //传type是道具触发 不传是随机触发
    this._score = s
    this.label.string = text
    openTipBox()
  },
  openTipBox() {
    if (!this.isOpen) {
      // 动画 动画回掉
      let action = cc.scaleTo(0.3, 1).easing(cc.easeBackOut(2.0))
      let sq = cc.sequence(action, cc.callFunc(() => {
        this.isOpen = true
      }))
      this.node.runAction(sq)
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
    }
    this.closeTimer = setTimeout(this.closeTioBox(), this._score.level * 1000)
  },
  closeTioBox() {
    let action = cc.scaleTo(0.3, 0)
    let sq = cc.sequence(action, cc.callFunc(() => {
      this.isOpen = false
    }))
    this.node.runAction(sq)
  },
  // update (dt) {},
});