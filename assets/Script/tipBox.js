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
      '黄沙百战穿金甲，不破楼兰终不还',
      '纸上得来终觉浅，绝知此事要躬行',
      '君子坦荡荡，小人长戚戚',
      '穷则独善其身，达则兼济天下',
      '盛年不重来，一日难再晨',
      '人生若只如初见，何事秋风悲画扇',
      '行到水穷处，坐看云起时',
      '天生我材必有用，千金散尽还复来',
      '大鹏一日同风起，扶摇直上九万里',
      '遥望齐州九点烟，一泓海水杯中泻',
      '人世几回伤往事，山形依旧枕寒流',
      '但使龙城飞将在，不教胡马度阴山',
      '十年一觉扬州梦，赢得青楼薄幸名',
      '沧海月明珠有泪，蓝田日暖玉生烟',
      '世间无限丹青手，一片伤心画不成',
      '男儿何不带吴钩，收取关山五十州',
      '苟利国家生死以，岂因祸福避趋之',
      '夜阑卧听风吹雨，铁马冰河入梦来',
      '人生自古谁无死？留取丹心照汗青'
    ]
  },
  init(s, type) { //传type是道具触发 不传是随机触发
    this._score = s
    this.label.string = type >= 0 ? this.tip[type] : this.otherTip[Math.ceil(Math.random() * this.otherTip.length)]
    this.openTipBox()
    if (this.gapTimer) {
      clearInterval(this.gapTimer)
    }
    this.gapTimer = setInterval(() => {
      this.init(this._score, -1)
    }, 5000)
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
    this.closeTimer = setTimeout(() => {
      this.closeTioBox()
    }, 2000)
  },
  closeTioBox() {
    let action = cc.scaleTo(0.3, 0)
    let sq = cc.sequence(action, cc.callFunc(() => {
      this.isOpen = false
    }))
    this.node.runAction(sq)
    // if (this.openTimer) {
    //   clearTimeout(this.closeTimer)
    // }
    //this.openTimer = setTimeout(this.init(this._score, null), this._score.level * 2000)
  },
  // update (dt) {},
});