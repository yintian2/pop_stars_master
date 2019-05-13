/**
 * @author uu
 * @file  音乐控制组件
 */
cc.Class({
  extends: cc.Component,
  properties: {
    volume: 1,
    audios: [cc.AudioSource],
    audioPrefab: cc.Prefab,
    bgMusic: cc.AudioSource,
    winAudio: cc.AudioSource,
    doubleAudio: cc.AudioSource,
    boomAudio: cc.AudioSource,
    magicAudio: cc.AudioSource,
    //audioSource: cc.AudioSource,
  },
  init() {
    this.audio = []
    this.instanceAudio()
    this.createMusicPool()
  },
  createMusicPool() {
    // this.musicPool = new cc.NodePool()
    // for (let i = 0; i < 20; i++) {
    //   let music = cc.instantiate(this.audioPrefab)
    //   this.musicPool.put(music)
    // }
  },
  instanceAudio() {

  },
  changeVol(vol) {
    this.volume = vol
    this.audios.forEach((item, index) => {
      // item.volume = vol
      this.audios[index].volume = vol
    })
  },
  onPlayAudio(num) {
    let self = this
    if (!this.audios[num] || this.audios[num].isPlaying) {
      if (this.audios[num + 1]) {
        self.onPlayAudio(num + 1)
      } else {
        //console.log('创建新的音乐实例')
        let music = null
        if (self.musicPool && self.musicPool.size() > 0) {
          music = self.musicPool.get()
        } else {
          music = cc.instantiate(self.audioPrefab)
        }
        music.parent = self.node
        this.audios[num + 1] = music.getComponent(cc.AudioSource)
        music.getComponent(cc.AudioSource).play()
      }
      // if (num < this.audios.length) {
      //   this.audios[num].stop()
      //   this.audios[num].rewind()
      //   this.audios[num].play()
      // }
    } else {
      // console.log('使用旧的音乐')
      this.audios[num].rewind()
      this.audios[num].play()
    }
  },
  pauseBg() {
    this.bgMusic.pause()
  },
  resumeBg() {
    this.bgMusic.resume()
  },
  start() {
    // this.onPlayAudio(1);
  },
  checkBg() {

  },
  onWin() {
    this.winAudio.rewind()
    this.winAudio.play()
  },

  onDouble() {
    this.doubleAudio.rewind()
    this.doubleAudio.play()
  },

  onBoom() {
    this.boomAudio.rewind()
    this.boomAudio.play()
  },
  onMagic() {
    this.magicAudio.rewind()
    this.magicAudio.play()
  },
});