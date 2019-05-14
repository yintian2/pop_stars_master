/**
 * @author uu
 */
cc.Class({
  extends: cc.Component,
  properties: {
    container: cc.Node,
    avatar: cc.node
  },
  init(c) {
    this._controller = c
    if (c.social.node.active) {
      let highLevel = c.social.getHighestLevel()
      if (highLevel) {
        this.showAvatar()
      } else {
        this.avatar.active = false
      }
    } else {
      this.avatar.active = false
    }
  },
  showAvatar(level) {
    let data = this._controller.gameData.json.levelData[level]
    let heightScore = this._controller.social.getHighestScore()
    this.avatar.getChildByName('name').getComponent(cc.Label).string = '历史最高:' + data.getChildByName
    this.avatar.getChildByName('score').getComponent(cc.Label).string = '分数' + heightScore
    this._controller.scoreMgr.characterMgr.showCharacter(level,this.avatar.getChildByName('db'),)
  },
  
});