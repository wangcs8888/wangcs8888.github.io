/**
 *
 * Created by ChengXiancheng on 2017/2/11.
 */

var colors=(function(){
    return ( "aliceblue,antiquewhite,aqua,aquamarine,azure,beige,bisque,black,blanchedalmond,blue," +
    "blueviolet,brown,burlywood,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk," +
    "crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkgrey,darkkhaki,darkmagenta," +
    "darkolivegreen,darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray," +
    "darkslategrey,darkturquoise,darkviolet,deeppink,deepskyblue,dimgray,dimgrey,dodgerblue,firebrick," +
    "floralwhite,forestgreen,fuchsia,gainsboro,ghostwhite,gold,goldenrod,gray,green,greenyellow,grey," +
    "honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,lavenderblush,lawngreen,lemonchiffon," +
    "lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgray,lightgreen,lightgrey,lightpink," +
    "lightsalmon,lightseagreen,lightskyblue,lightslategray,lightslategrey,lightsteelblue,lightyellow," +
    "lime,limegreen,linen,magenta,maroon,mediumaquamarine,mediumblue,mediumorchid,mediumpurple," +
    "mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue," +
    "mintcream,mistyrose,moccasin,navajowhite,navy,oldlace,olive,olivedrab,orange,orangered,orchid," +
    "palegoldenrod,palegreen,paleturquoise,palevioletred,papayawhip,peachpuff,peru,pink,plum,powderblue," +
    "purple,rebeccapurple,red,rosybrown,royalblue,saddlebrown,salmon,sandybrown,seagreen,seashell,sienna," +
    "silver,skyblue,slateblue,slategray,slategrey,snow,springgreen,steelblue,tan,teal,thistle,transparent," +
    "tomato,turquoise,violet,wheat,white,whitesmoke,yellow,yellowgreen" ).split(',');
})();

function Chain(opts){
    if(!opts){
        throw new Error("参数为空");
    }
    if(!opts.bigX || !opts.bigY) throw new Error("请传递大圆的圆心坐标");
    //存储了相关参数的默认值
    var _defaultOpt={
        bigRadius:50,
        smallRadius:5,
        beginRadian:0
    }

    $.extend(this,_defaultOpt,opts);
    this.drawChain();
};
Chain.prototype={
    constructor:Chain,
    //入口函数
    drawChain:function(){
        //var self=this;
        this.bindEvents();
        this.animate(50);
    },
    //绑定事件,鼠标进入转动变慢,鼠标离开转动变快
    bindEvents:function(){
        var self=this;
        canvas.addEventListener("mouseover",function(){
            self.animate(150);
        });
        canvas.addEventListener("mouseleave",function(){
            self.animate(50);
        });
    },
    //画大圆
    drawBigCircle:function(){
        ctx.save();

        ctx.beginPath();
        ctx.arc(this.bigX,this.bigY,this.bigRadius,0,2*Math.PI);
        ctx.stroke();

        ctx.restore()
    },
    //画单个小圆
    drawSmallCircle:function(radian,color){
        var h=this.bigRadius*Math.sin(radian);
        var b=this.bigRadius*Math.cos(radian);

        var x=this.bigX+b;
        var y=this.bigY+h;

        ctx.save();

        ctx.beginPath();
        ctx.arc(x,y,this.smallRadius,0,2*Math.PI);
        ctx.fillStyle=color;
        ctx.fill();

        ctx.restore();
    },
    //画多个小圆
    drawSmallCircles:function(){
        //每一个小圆的弧度
        var everyRadian=2*Math.PI/this.num;

        for(var i=0;i<this.num;i++){
            this.drawSmallCircle(this.beginRadian+everyRadian*i,colors[i+10]);
            this.drawText(this.beginRadian+everyRadian*i,this.texts[i]);
        }

    },
    //画文字
    drawText:function(radian,text){
        var h=this.bigRadius*Math.sin(radian);
        var b=this.bigRadius*Math.cos(radian);

        var x=this.bigX+b;
        var y=this.bigY+h;
        ctx.save();

        ctx.beginPath();
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="black";
        ctx.font="20px 微软雅黑";
        ctx.fillText(text,x,y);

        ctx.restore();
    },
    //动画
    animate:function(rate){
        var self=this;

        clearInterval(self.timer);
        self.timer=setInterval(function(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            self.beginRadian+=0.01*Math.PI;

            self.drawBigCircle();
            self.drawSmallCircles();
        },rate);
    }

}
