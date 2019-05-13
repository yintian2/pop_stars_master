cc.Class({
  extends: cc.Component,

  properties: {
    levelUp1: cc.Node,
    levelUp2: cc.Node,
    character: cc.Node,
    fail: cc.Node,
    dbArray: [dragonBones.DragonBonesAsset],
    textureArr: [dragonBones.DragonBonesAtlasAsset]
  },
  start() {
    this.loadRes()
  },
  loadRes() {
    var self = this
    for (let i = 0; i < 15; i++) {
      let nameSke = "db/sanxiao" + (i + 1 + '') + "_ske"
      let nameTex = "db/sanxiao" + (i + 1 + '') + "_tex"
      cc.loader.loadRes(nameSke, dragonBones.DragonBonesAsset, (err, assert) => {
        this.dbArray[i] = assert
      })
      cc.loader.loadRes(nameTex, dragonBones.DragonBonesAtlasAsset, (err, texture) => {
        this.textureArr[i] = texture
      })
    }
   // console.log(this.textureArr)
  },
  onWalk(target) {
    target.playAnimation('walk', -1)
  },
  onLevelUp() {
    //this.levelUp2.getComponent(dragonBones.ArmatureDisplay).playAnimation('jump', -1)
  },
  onSuccessDialog(level) {
    // this.showCharacter(level - 1, this.levelUp1)
    this.showCharacter(level, this.levelUp2, true)

  },
  onLevelUpBtn(level) {
    this.showCharacter(level)
  },
  onFail(level) {
    this.showCharacter(level, this.fail)
  },

  initStartPage(){

  },

  showCharacter(level, target, jump) {
    target = target || this.character
    let assert = target.getComponent(dragonBones.ArmatureDisplay)
  //  cc.log("before", assert)
    assert.destroy()

    let main = target.addComponent(dragonBones.ArmatureDisplay)
    main.dragonAsset = this.dbArray[level - 1]
    main.dragonAtlasAsset = this.textureArr[level - 1]
    main.armatureName = "Armature"
    main.timeScale = 0.5
   // console.log("after", main)
    main.playAnimation(jump ? "jump" : "walk", -1)
    //this.onWalk(main)
  },
});