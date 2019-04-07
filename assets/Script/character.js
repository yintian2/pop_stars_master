cc.Class({
  extends: cc.Component,

  properties: {
    levelUp1:dragonBones,
    levelUp2:dragonBones,
    character:dragonBones,
  },



  showCharacter(target) {
    let db=target.getComponent()
  },
});