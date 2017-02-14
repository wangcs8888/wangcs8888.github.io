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

function Chain(opt) {
    if(!opt){
        throw new Error("参数为空");
    }
    if(!opt.bigX || !opt.bigY) throw new Error("请传递大圆的圆心坐标");

    //存储了相关参数的默认值
    var _defaultOpt={
        bigRadius:50,
        smallRadius:5,
        beginRadian:0
    };

    //运算规则：首先将_defaultOpt中的数据复制到this中，再次将opt中的数据复制到this
    $.extend(this,_defaultOpt,opt);

    //入口方法
    this.drawChain();
}

Chain.prototype = {
    constructor: Chain,
    /**
     * 绘制链子的入口函数
     */
    drawChain: function () {

        var self=this;
        self.bindEvents();

        self.animate(20);


    },
    //进行事件绑定：实现鼠标进入动画变慢，鼠标移出动画变快
    bindEvents:function(){
        var self=this;
        canvas.addEventListener("mouseenter",function(){
            self.animate(50);
        });
        canvas.addEventListener("mouseleave",function(){
            self.animate(20);
        });
    },

    animate:function(rate){
        var self=this;
        clearInterval(self.timer);
        self.timer=setInterval(function(){
            //清空画布
            ctx.clearRect(0,0,canvas.width,canvas.height);
            self.beginRadian+=0.01*Math.PI;

            //绘制大圆
            self.drawBigCircle();
            //绘制若干个小圆
            self.drawSmallCircles();
        },rate);
    },




    //1、绘制大圆
    drawBigCircle: function () {
        //绘制大圆
        var ctx=this.ctx;
        ctx.beginPath();
        ctx.arc(this.bigX, this.bigY, this.bigRadius, 0, 2 * Math.PI);
        ctx.stroke();
    },
    //2、绘制单个小圆
    drawSmallCircle: function (radian,color) {
        var ctx=this.ctx;

        var h = this.bigRadius * Math.sin(radian);
        var b = this.bigRadius * Math.cos(radian);

        //小圆的圆心坐标
        var smallX = this.bigX + b, smallY = this.bigY + h;

        ctx.save();

        ctx.beginPath();
        ctx.arc(smallX, smallY, this.smallRadius, 0, 2 * Math.PI);
        ctx.fillStyle=color;
        ctx.fill();

        ctx.restore();
    },
    /**
     * 3、绘制若干个小圆
     * @param bigX 大圆的圆心x
     * @param bigY 大圆的圆心y
     * @param bigRadius 大圆的半径
     * @param smallRadius 小圆的半径
     * @param num 小圆的个数——————>计算出相邻小圆之间的弧度差
     * @param beginRadian 第一个小圆位于大圆的弧度
     */
    drawSmallCircles: function () {
        //设置小圆的参数

        var singleRadian = 2 * Math.PI / this.num;//相邻小圆之间的弧度差

        for (var i = 0; i < this.num; i++) {
            //切记：先绘制小圆再绘制文字，如果两者顺序相反，那么文字就被小圆覆盖了
            //1、绘制小圆
            this.drawSmallCircle(this.beginRadian + i * singleRadian,colors[i+15]);
            //2、绘制文字
            this.drawText(this.texts[i],this.beginRadian + i * singleRadian);
        }
    },

    /**
     * @param text 文字的内容
     * @param radian 文字的坐标位于大圆的弧度
     */
    drawText:function(text,radian){
        var ctx=this.ctx;

        var h = this.bigRadius * Math.sin(radian);
        var b = this.bigRadius * Math.cos(radian);

        //小圆的圆心坐标
        var smallX = this.bigX + b, smallY = this.bigY + h;

        ctx.save();

        ctx.beginPath();
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="black";
        ctx.font="20px 微软雅黑";
        ctx.fillText(text,smallX,smallY);

        ctx.restore();
    }
};