/**
 * Created by dyf on 2017/5/12.
 */

window.mjd = {};

/* 自定义一个tap事件 */
/*
* 1.touchup到touchend之间200ms
* 2.只要涉及到了touchmove事件,就排除是tap
* 3.obj参数是触发tap的标签,callback是tap的响应function
* */

mjd.tap = function (obj, callback) {

    // 1.确定常量
    var startTime = Date.now();
    var duration = 200;
    var isMove = false;

    // 2.自定义tap

    // 2.1 点击开始
    obj.addEventListener('touchstart', function (e) {
        startTime = Date.now();
    });
    obj.addEventListener('touchmove', function (e) {
        // 若产生了滑动手势,则取消tap事件
        isMove = true;
    });
    obj.addEventListener('touchend', function (e) {
        // 条件判断(条件1,条件2)
        if (isMove == false && (Date.now() - startTime < duration)){
            if (callback){
                callback(e);
            }
        }

        // 不满足条件,手势结束时,isMove属性重置
        isMove = false;
    })
}

/* shortcut的展示 */
function shortcutDisplay() {
    // 1.拿到标签
    var c_header = document.getElementsByClassName('jd_c_header')[0];
    var icon_shortcut = c_header.getElementsByClassName('icon_shortcut')[0];
    var shortcut = c_header.getElementsByClassName('shortcut')[0];
    var c_main = document.getElementsByClassName('jd_c_main')[0];
    var oriPaddingTop = parseInt(c_main.style.paddingTop);
    var changePT = oriPaddingTop + 57;
    // console.log(oriPaddingTop, changePT);

    mjd.tap(icon_shortcut, function (e) {
        if (shortcut.style.display == 'table'){
            shortcut.style.display = 'none';
            if (document.title == '京东商品分类'){
                c_main.style.paddingTop = oriPaddingTop +'px';
            }
        }else if(shortcut.style.display == 'none'){
            shortcut.style.display = 'table';
            if (document.title == '京东商品分类'){
                c_main.style.paddingTop = changePT +'px';
            }
        }
        // console.log(oriPaddingTop, changePT);
    });
}