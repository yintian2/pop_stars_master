cc.Class({
  extends: cc.Component,

  properties: {
    levelUp1: dragonBones.ArmatureDisplay,
    levelUp2: dragonBones.ArmatureDisplay,
    character: dragonBones.ArmatureDisplay,
    fail: dragonBones.ArmatureDisplay,
    dbArray: [dragonBones.DragonBonesAsset],
    textureArr: [dragonBones.DragonBonesAtlasAsset]
  },
  start() {
    this.loadRes()
    // this.character.debugBones = true
  },
  loadRes() {
    var self = this
    for (let i = 0; i < 15; i++) {
      let nameSke = "db/sanxiao" + (i + 1 + '') + "_ske"
      let nameTex = "db/sanxiao" + (i + 1 + '') + "_tex.json"
      cc.loader.loadRes(nameSke, dragonBones.DragonBonesAsset, (err, assert) => {
        this.dbArray[i] = assert
      })
      cc.loader.loadRes(nameTex, dragonBones.DragonBonesAtlasAsset, (err, texture) => {
        this.textureArr[i] = texture
      })
    }
    console.log(this.textureArr)
  },
  onWalk(target) {
    target.playAnimation('walk', -1)
  },
  onLevelUp() {
    this.character.playAnimation('jump', -1)
  },
  onSuccessDialog(level) {
    this.showCharacter(level - 1, this.levelUp1)
    this.showCharacter(level, this.levelUp2)
  },
  onLevelUpBtn(level) {
    //  this.dbArray[level - 2].destory()
    //this.dragonAtlasAsset[level - 2].destory()
    this.showCharacter(level, this.character)
  },
  onFail(level) {
    this.showCharacter(level, this.fail)
  },


  showCharacter(level, target) {
    target = target || this.character
    target.dragonAsset = this.dbArray[level - 1]
    target.dragonAtlasAsset = this.textureArr[level - 1]
    target.armatureName = 'Armatrue'
    target.animationName = 'walk'
    this.onWalk(target)
  },
});