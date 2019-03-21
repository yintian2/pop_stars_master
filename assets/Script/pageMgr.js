/**
 * @author uu
 * @file  通用页面控制器和适配
 */
var AC = require('action')
cc.Class({
  extends: cc.Component,
  properties: {
    status: 0, //页面状态
    pages: [cc.Node],
  },
  // 0 开始游戏页面
  // 1 游戏页面
  // 2 UI页面
  // 3 过关页面
  // 4 失败页面
  // 5 复活页面
  // 6 排行榜页面

  start() {
    this.lateStart()
  },
  lateStart() {
    this.width = cc.director.getWinSizeInPixels().width
    window.width = this.width
    this.height = cc.director.getWinSizeInPixels().height
    window.height = this.height
    // 存为全局变量
    this.adoptCanvas()
  },
  // 适配解决方案
  adoptCanvas() {
    let canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas)
    // 设计分辨率比
    let rateR = canvas.designResolution.height / canvas.designResolution.width;
    // 显示分辨率比
    let rateV = this.height / this.width;
    if (rateV > rateR) {
      canvas.fitHeight = false;
      canvas.fitWidth = true;
    } else {
      canvas.fitHeight = true;
      canvas.fitWidth = false;
    }
  },

  onOpenPage(num, callFun) {
    this.closeAllPages()
    this.pages[num].active = true
    if (callFun) {
      this.callFun();
    }
  },
  addPage(num, callFun) {
    this.pages[num].scale = 0.5
    this.pages[num].active = true
    this.pages[num].runAction(AC.popOut(0.5))
    if (callFun) {
      this.callFun();
    }
  },
  removePage(num, callFun) {
    this.pages[num].runAction(cc.sequence(AC.popIn(0.5),cc.callFunc(()=>{
      this.pages[num].active = false
    },this)))
    if (callFun) {
      this.callFun();
    }
  },
  onButtonOpenPage(event, cust) {
    this.onOpenPage(cust);
  },
  onButtonAddPage(event, cust) {
    this.addPage(cust);
  },
  onButtonRemovePage(event, cust) {
    this.removePage(cust);
  },
  closeAllPages() {
    this.pages.forEach(element => {
      element.active = false
    });
  },
});