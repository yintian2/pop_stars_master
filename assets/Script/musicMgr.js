/**
 * @author uu
 * @file  音乐控制组件
 * @todo 
 */
cc.Class({
  extends: cc.Component,
  properties: {
    volume: 1,
   // audios: [cc.AudioClip],
    audioPrefab: cc.Prefab,
    audioSource: cc.AudioSource,
  },
  init() {
    this.audio = []
    this.instanceAudio()
  },
  lateInit() {

  },
  instanceAudio() {
    let parent=this.node
  },
  changeVol(vol) {
    this.volume = vol
    this.audio.forEach((item, index) => {
      // item.volume = vol
      this.audio[index].volume = vol
    })
  },
  onPlayAudio(num) {
    if (this.audio[num].isPlaying) {
      this.audios[num].stop()
      this.audios[num].rewind()
      this.audios[num].play()
    } else {
      this.audios[num].play()
    }
  },
  start() {
   // this.onPlayAudio(1);
  },
});