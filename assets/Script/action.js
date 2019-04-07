/**
 * @author uu
 * @file 所有的简单动作集合
 */

// 震动动作 0.1效果比较好
function shackAction(time, range) {
  let action1 = cc.moveBy(time, range, range)
  let action2 = cc.moveBy(time, -range, -range)
  let action3 = cc.moveBy(time * 0.8, range * 0.8, range * 0.8)
  let action4 = cc.moveBy(time * 0.8, -range * 0.8, -range * 0.8)
  let action5 = cc.moveBy(time * 0.6, range * 0.6, range * 0.6)
  let action6 = cc.moveBy(time * 0.6, -range * 0.6, -range * 0.6)
  let action7 = cc.moveBy(time * 0.4, range * 0.4, range * 0.4)
  let action8 = cc.moveBy(time * 0.4, -range * 0.4, -range * 0.4)
  let action9 = cc.moveBy(time * 0.2, range * 0.2, range * 0.2)
  let action10 = cc.moveBy(time * 0.2, -range * 0.2, -range * 0.2)
  let sq = cc.sequence(action1, action2, action3, action4, action5, action6, action7, action8, action9, action10)
  return sq
}
// 晃动动作
function rockAction(time, range) {
  let action1 = cc.rotateBy(time, range, range)
  let action2 = cc.rotateBy(time, -2 * range, -2 * range)
  let action3 = cc.rotateBy(time * 0.8, 2 * range * 0.8, 2 * range * 0.8)
  let action6 = cc.rotateBy(time * 0.6, -2 * range * 0.6, -2 * range * 0.6)
  let action7 = cc.rotateBy(time * 0.4, 2 * range * 0.4, 2 * range * 0.4)
  let action10 = cc.rotateTo(time * 0.2, 0, 0)
  let sq = cc.sequence(action1, action2, action3, action6, action7, action10)
  return sq
}

// 弹出效果
function popOut(time) {
  return cc.scaleTo(time, 1).easing(cc.easeBackOut(2.0))
}
// 收入效果
function popIn(time) {
  return cc.scaleTo(time, 0.5).easing(cc.easeBackIn(2.0))
}

function heartBeat() {
  let action1 = cc.scaleTo(0.2, 1.2).easing(cc.easeElasticInOut())
  let action2 = cc.scaleTo(0.2, 1).easing(cc.easeElasticInOut())
  let action3 = cc.rotateTo(0.1, 45)
  let action4 = cc.rotateTo(0.2, -45)
  let action5 = cc.rotateTo(0.1, 0)
}
//翻页效果 前两个传node type传数字 左右旋转的
function pageTurning(pageUp, pageDown, typeA) {
  switch (typeA) {
    case 0:
      pageUp.runAction(cc.fadeOut(0.6));
      pageDown.runAction(cc.delayTime(0.6), cc.fadeIn(0.6), cc.sequence(cc.callFunc(() => {
        pageUp.active = false;
      }, this, pageUp)));
      break;
    case 1:
      pageDown.scaleX = 0;
      pageUp.runAction(cc.scaleTo(0.6, 0, 1))
      pageDown.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(() => {
        pageUp.active = false;
      }, this, pageUp), cc.scaleTo(0.6, 1, 1), ))
      break;
    case 2:
      break;
  }
}
//移动到屏幕外 并且隐藏  0123 上右下左 会移动一个屏幕的距离 然后直接消失
function getMoveOutofScreenActive(typeA, winWidth, winHeight, delTime) {
  switch (typeA) {
    case 0:
      return cc.moveBy(delTime, 0, winHeight)
    case 1:
      return cc.moveBy(delTime, winWidth, 0)
    case 2:
      return cc.moveBy(delTime, 0, -winHeight)
    case 3:
      return cc.moveBy(delTime, -winWidth, 0)
  }
}
//从屏幕外进入 上右下左
function getMoveInScreenActive(typeA, winWidth, winHeight, delTime) {
  switch (typeA) {
    case 0:
      return cc.moveBy(delTime, 0, -winHeight)
    case 1:
      return cc.moveBy(delTime, -winWidth, 0)
    case 2:
      return cc.moveBy(delTime, 0, winHeight)
    case 3:
      return cc.moveBy(delTime, winWidth, 0)
  }
}
//闪烁动作
function blinkAction(delTime) {
  return cc.repeatForever(cc.sequence(cc.fadeOut(delTime), cc.fadeIn(delTime)))
}
module.exports = {
  shackAction: shackAction,
  blinkAction: blinkAction,
  pageTurning: pageTurning,
  heartBeat: heartBeat,
  getMoveOutofScreenActive: getMoveOutofScreenActive,
  popOut: popOut,
  popIn: popIn,
  getMoveInScreenActive: getMoveInScreenActive,
  rockAction: rockAction
}