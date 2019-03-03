var Color = cc.Class({
  name: 'Color',
  properties: {
    colorid: 0,
    iconSF: cc.SpriteFrame
  }
});

cc.Class({
  extends: cc.Component,

  properties: {

    colorlist: {
      default: [],
      type: Color
    },
    touchCellId: 0,
    touchColor: 0,
    gameCtr: null

  },
  init: function (gameCtr) {
    this.gameCtr = gameCtr;
  },
  onLoad: function () {
    this.node.on(cc.Node.EventType.TOUCH_START, () => {
      this.touchCellId = this.node.cellTag;
      this.touchColor = this.node.cellColor;
      this.delete_cell(this.touchCellId);
      this.gameCtr.text_1 = this.gameCtr.text_1 + 1;
      this.gameCtr.label_1.string = "步数" + ":" + this.gameCtr.text_1;

      // for (let i = 1; i < 65; i++) {
      //   this.fall_cell(i);
      // }

      // console.log(this.gameCtr.cellAry[this.touchCellId-1].cellColor);
      // console.log(this.touchCellId)
      // add_newcellAry(this.node.cellTag);
    })
  },
  init: function (gameCtr) {
    this.gameCtr = gameCtr;
  },

  delete_cell: function (touchCellId) {
    // var y1;
    // (touchCellId%8==0)?y1=8:y1=touchCellId%8;
    // var x1=Math.ceil(touchCellId/8);
    if (this.gameCtr.cellAry[touchCellId - 1].active === true) {
      if (this.gameCtr.cellAry[touchCellId - 1].cellColor === this.touchColor) { //判断颜色一致
        // this.node.runAction(cc.scaleTo(0.5, 0, 0))
        // let self=this
        //setTimeout(() => {
        this.gameCtr.cellAry[touchCellId - 1].destroy();
        // }, 500);
        this.gameCtr.text_2 = this.gameCtr.text_2 + 100;
        this.gameCtr.label_2.string = "分数" + ":" + this.gameCtr.text_2;
        // if(touchCellId-8>0){this.delete_cell(touchCellId-8)} else return;
        // if(touchCellId+8>0){this.delete_cell(touchCellId-8)} else return;
        //判断上下左右在格子，则对该格子进行递归函数
        switch (true) {
          case touchCellId === 1:
            {
              this.delete_cell(touchCellId + 8);
              this.delete_cell(touchCellId + 1);
              return;
            }
          case touchCellId === 64:
            {
              this.delete_cell(touchCellId - 8);
              this.delete_cell(touchCellId - 1);
              return;
            }
          case touchCellId === 8:
            {
              this.delete_cell(touchCellId + 8);
              this.delete_cell(touchCellId - 1);
              return;
            }
          case touchCellId === 57:
            {
              this.delete_cell(touchCellId - 8);
              this.delete_cell(touchCellId + 1);
              return;
            }
          case touchCellId < 8 && touchCellId > 1 && touchCellId !== 64 && touchCellId !== 1 && touchCellId !== 8 && touchCellId !== 57:
            {
              this.delete_cell(touchCellId + 8);
              this.delete_cell(touchCellId - 1);
              this.delete_cell(touchCellId + 1);
              return;
            }
          case touchCellId < 64 && touchCellId > 57 && touchCellId !== 64 && touchCellId !== 1 && touchCellId !== 8 && touchCellId !== 57:
            {
              this.delete_cell(touchCellId - 8);
              this.delete_cell(touchCellId - 1);
              this.delete_cell(touchCellId + 1);
              return;
            }
          case touchCellId % 8 === 0 && touchCellId !== 64 && touchCellId !== 1 && touchCellId !== 8 && touchCellId !== 57:
            {
              this.delete_cell(touchCellId - 8);
              this.delete_cell(touchCellId - 1);
              this.delete_cell(touchCellId + 8);
              return;
            }
          case touchCellId % 8 === 1 && touchCellId !== 64 && touchCellId !== 1 && touchCellId !== 8 && touchCellId !== 57:
            {
              this.delete_cell(touchCellId - 8);
              this.delete_cell(touchCellId + 1);
              this.delete_cell(touchCellId + 8);
              return;
            }
          default:
            {
              this.delete_cell(touchCellId - 8);
              this.delete_cell(touchCellId - 1);
              this.delete_cell(touchCellId + 8);
              this.delete_cell(touchCellId + 1);
              return;
            }
        }
      }
      //颜色不一致，停止
      else return;;
    }
    //空单位，执行掉落
    else return;
  },

  //掉落函数
  fall_cell: function (touchCellId) {
    if (this.gameCtr.cellAry[touchCellId - 1].active === false)
    //如果是空对象，看位置
    {
      //是最上一排的话就生成新函数
      if (touchCellId < 9) {
        var site = new cc.Vec2(-315 + (touchCellId - 1) * this.gameCtr.size, 315);
        this.gameCtr.add_cell(touchCellId, site, Math.ceil(Math.random() * 4));
        // this.scheduleOnce(function(){new1();},0.2);        
        // var site=new cc.Vec2(-315+(touchCellId-1)*this.gameCtr.size,315);
        ;
      }
      //否则，判断上层是否为空
      else {
        //上层为空，向上递归
        if (this.gameCtr.cellAry[touchCellId - 9].active === false) {
          this.fall_cell(touchCellId - 8);
        } else {
          //上层不为空，执行掉落
          //找到位置
          let site = new cc.Vec2(this.gameCtr.cellAry[touchCellId - 9].position.x, this.gameCtr.cellAry[touchCellId - 9].position.y - this.gameCtr.size);
          //在对应位置，生成上层的cell
          this.gameCtr.add_cell(touchCellId, site, this.gameCtr.cellAry[touchCellId - 9].cellColor);
          //删除上层
          this.gameCtr.cellAry[touchCellId - 9].destroy();
          this.fall_cell(touchCellId - 8);




        };
      }
    } else return;
  },
  update: function (dt) {

  },
});