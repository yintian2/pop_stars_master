var Role = cc.Class({
    name: 'Role',
    properties: {
        roleLevel: 1,
        iconLevel: cc.SpriteFrame,
        expLevel:0
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        role_list:{
            default:[],
            type:Role
        }
    },


    onLoad () {},

    start () {

    },

    update (dt) {},
});
