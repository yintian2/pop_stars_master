/**
 * @author uu
 */
cc.Class({
  extends: cc.Component,
  properties: {
    container: cc.Node,
    avatar: cc.Node,
    prefab: cc.Prefab,
  },
  init(c) {
    this._controller = c
    if (c.social.node.active) {
      let highLevel = c.social.getHighestLevel()
      if (highLevel) {
        this.showAvatar(highLevel)
        this.loadContainer(highLevel)
      } else {
        this.avatar.active = false
      }
    } else {
      this.avatar.active = false
    }
  },
  showAvatar(level) {
    this.avatar.active = true
    let data = this._controller.gameData.json.levelData[level]
    let heightScore = this._controller.social.getHighestScore()
    this.avatar.getChildByName('name').getComponent(cc.Label).string = '历史最高:' + data.getChildByName
    this.avatar.getChildByName('score').getComponent(cc.Label).string = '分数' + heightScore
    this._controller.scoreMgr.characterMgr.showCharacter(level, this.avatar.getChildByName('db'), 0)
  },
  loadContainer(level) {
    let data = this._controller.gameData.json.levelData
    for (let i = 0; i < data.length; i++) {
      let card = cc.instantiate(this.prefab)
      card.parent = this.container
      this.initCard(card, data[i], level > i + 1, level)
    }
  },
  initCard(card, info, type, level) {
    if (type) {
      card.getChildByName('name').getComponent(cc.Label).string = info.name
      card.getChildByName('score').getComponent(cc.Label).string = "得分:" + info.score
      card.getChildByName('giftStep').getComponent(cc.Label).string = "开局奖励" + info.giftStep + "步"
    }
    this._controller.scoreMgr.characterMgr.showCharacter(level, card.getChildByName('db'), 0)
  }
});