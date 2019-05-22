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
        this.loadContainer(+highLevel)
      } else {
        this.avatar.active = false
        this.loadContainer(1)
      }
    } else {
      this.avatar.active = false
    }
  },
  showAvatar(level) {
    this.avatar.active = true
    let data = this._controller.gameData.json.levelData[+level - 1]
    let heightScore = this._controller.social.getHighestScore()
    this.avatar.getChildByName('name').getComponent(cc.Label).string = '历史最高:' + data.name
    this.avatar.getChildByName('score').getComponent(cc.Label).string = '分数' + heightScore
    setTimeout(() => {
      this._controller.scoreMgr.characterMgr.showCharacter(+level, this.avatar.getChildByName('db'), false)
    }, 1000)
  },
  loadContainer(level) {
    let data = this._controller.gameData.json.levelData
    this.clearContainer()
    setTimeout(() => {
      for (let i = 0; i < data.length; i++) {
        let card = cc.instantiate(this.prefab)
        card.parent = this.container
        this.initCard(card, data[i], i, level)
      }
    }, 1000)
  },
  clearContainer() {
    this.container.children.map(item => {
      item.destroy()
    })
  },
  initCard(card, info, level, selfLevel) {
    if (level < selfLevel) {
      card.getChildByName('name').getComponent(cc.Label).string = info.name
      //card.getChildByName('score').getComponent(cc.Label).string = "得分:" + info.score
      card.getChildByName('db').color = cc.Color.WHITE
      card.getChildByName('giftStep').getComponent(cc.Label).string = "开局奖励" + info.giftStep + "步"
    } else {
      card.getChildByName('name').getComponent(cc.Label).string = '???'
      card.getChildByName('giftStep').getComponent(cc.Label).string = "开局奖励???步"
      card.getChildByName('db').color = cc.Color.BLACK
    }
    this._controller.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'), 0)
  }
});