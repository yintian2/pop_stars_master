
cc.Class({
    extends: cc.Component,

    properties: {
        label_1: {
            default: null,
            type: cc.Label
        },
        label_2: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text_1: 0,
        text_2: 0,
        //初始点
        posStart: new cc.Vec2(-305, 0),
        size:90,
        cellnumbers:8,
        //生成星星profeb数组
        cellAry: {
            default: []  ,
            type: cc.Prefab
        },
        //需要销毁的星星profeb数组
        
        delCellAry:{
            default: []  ,
            type: cc.Prefab
        },
        cellPrefab:cc.Prefab,
        
    },
    // use this for initialization
    onLoad: function () {
        // console.log(this.label_1.string)
        this.label_1.string = "步数"+":"+this.text_1;
        this.label_2.string = "分数"+":"+this.text_2;
        this.label_2.HorizontalAlign="left";
        this.mapset();
        // this.delete_cell(touchCell);
        // console.log(touchCell)
        },
    
    //生成地图
    mapset: function(){
        for(let i=1;i<this.cellnumbers+1;i++){
            for(let j=1;j<this.cellnumbers+1;j++){
                this.add_cell
                (
                    j+8*(i-1),
                    new cc.Vec2(this.posStart.x+(j-1)*this.size,this.posStart.y-(i-1)*this.size),
                    Math.ceil(Math.random()*4))
                ;
            }   
        }
    },
    //生成星星在每个地图点上生成包含颜色的星星数组
    add_cell:function(tag,site,color){
            //生成prefab
            var newCell = cc.instantiate(this.cellPrefab);
            this.node.addChild(newCell);
            //获取信息
            newCell.cellTag = tag;//编号
            newCell.cellColor = color;//颜色
            newCell.setPosition(site);//位置
            var cellCmt = newCell.getComponent('cell');
            cellCmt.init(this);
            newCell.getComponent(cc.Sprite).spriteFrame = cellCmt.colorlist[newCell.cellColor-1].iconSF;
            //生成数组
            this.cellAry[tag-1]=newCell;
        },
        
    //监控玩家点击的cell，并且放大cell
    // delete_cell:function(){
    //     this.node.on("click",(event) => {
    //         console.log(event);
    //     })
        // //寻找cell
        // this.node.on('touchstart',  (event) =>{
        //     var x1= event.LocationX();
        //     var y1= event.LocationY();
        //     console.log(event);
        //     if(this.node.children.name=="map"){
        //         //找到map的坐标
        //         touchCell=this.cellAry[(Math.ceil(x1-posStart.x)/90)+((Math.ceil(y1-posStart.y)/90)-1)*this.cellnumbers]
        //         console.log(touchCell)
        //         //找到cell，并且放大cell

        //     }
        //     else return;
        // })


    // called every frame
    update: function (dt) {

    },
});
