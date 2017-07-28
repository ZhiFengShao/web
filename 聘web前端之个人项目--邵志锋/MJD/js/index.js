//noinspection JSAnnotator
/**
 * Created by dyf on 2017/5/3.
 */

window.onload = function () {

    changeHeaderBoxAlpha();

    setBannerActive();

    seckillCountdown();
};

// header透明度改变
function changeHeaderBoxAlpha() {
    // console.log('hahahah');
    // 1.拿到标签
    var headerBox = document.getElementsByClassName('jd_header_box')[0];
    var banner = document.getElementsByClassName('jd_banner')[0];

    // 2.获取banner高度
    var bannerH = banner.offsetHeight;

    window.onscroll = function () {
        // 3.拿到页面偏离头部的高度
        var scrollTopH = document.body.scrollTop;

        // 4.根据偏离度判断,并给透明度赋值

        // headerBox常规背景色 默认rgba(201, 21, 35, 0.85);
        var alpha = 0; // alpha默认为0
        if (scrollTopH < bannerH){
            alpha = scrollTopH/bannerH * 0.85;
        }else {
            alpha = 0.85;
        }


        // 5.透明度赋值
        headerBox.style.background = 'rgba(201, 21, 35, '+ alpha +')';
    }
};

// 焦点图无限滚动
function setBannerActive() {
    // 1.拿到标签
    var banner = document.getElementsByClassName('jd_banner')[0]; // 拿到banner
    var bannerW = banner.offsetWidth; // 拿到banner的宽
    var ul_imgBox = banner.getElementsByTagName('ul')[0]; // 也可以根据.clearfix拿到ul标签
    var ol_pageBox = banner.getElementsByTagName('ol')[0]; // 拿到ol标签
    var li_array_pages = ol_pageBox.getElementsByTagName('li'); // 拿到ol中的li数组

    // 2.设置过渡效果; 清除过渡效果; 位置改变
    //  2.1 过渡效果
    function setTransition() {
        ul_imgBox.style.transition = 'all .2s ease';
        ul_imgBox.style.webkitTransition = 'all .2s ease'; // 默认是all 0 ease 0
    }
    //  2.2 清除过渡效果
    function removeTransition() {
        ul_imgBox.style.transition = 'none';
        ul_imgBox.style.webkitTransition = 'none';
    }
    //  2.3 位置改变
    function changeTranslateX(x) {
        ul_imgBox.style.transform = 'translateX('+ x +'px)'; // 注意参数拼接
        ul_imgBox.style.webkitTransform = 'translateX('+ x +'px)';
    }

    // 3.让ul滚起来
    var index = 1; // 默认显示第二张图(首0尾9都是过渡效果页)
    var timer = null; // 创建定时器,使每1s(1000ms)执行一次scorllImg()方法
    timer = setInterval(scrollImg, 1000);
    function scrollImg() {
        // 索引+1
        index ++;

        // 图片滚动
        setTransition(); // 滚动过渡
        changeTranslateX(-index * bannerW);
        
        // page滚动(考虑到无限滚动,应该放在停止过渡的时候执行)
    }

    // 4.无限滚动 当图片过渡后,修改index值
    function keepIndexSafe() {
        if (index >= 9){ // 在0-9 这10个索引中,0和9是只是用来过渡的
            index = 1;
        }else if (index <= 0){
            index = 8;
        }

        // 图片滚动
        removeTransition(); // 此时是非过渡滚动
        changeTranslateX(-index * bannerW);

        // 改变指示器
        scrollPage();
    }
    ul_imgBox.addEventListener('transitionEnd', keepIndexSafe);
    ul_imgBox.addEventListener('webkitTransitionEnd', keepIndexSafe);

    // 5.ol跟随滚动
    function scrollPage() {
        // 5.1 清除默认选中样式(类名清空即可)
       for (var i = 0; i< li_array_pages.length; i++){
           li_array_pages[i].className = '';
       }

       // 5.2 重新确定选定样式
        var pageIndex = index - 1;
        if (pageIndex >= 8) pageIndex = 0;
        if (pageIndex < 0) pageIndex = 7;

        li_array_pages[pageIndex].className = 'current';
    }

    // 6.监听手势滑动

    var startX = 0;
    var currentX = 0;
    var movedX = 0;
    // 6.1 手指触屏
    ul_imgBox.addEventListener('touchstart', function (e) {
        // 6.1.1 停止定时器
        clearInterval(timer);
        // 6.1.2 拿到起始位置x
        startX = e.touches[0].clientX;
    })
    // 6.2 手指在屏幕滑动
    ul_imgBox.addEventListener('touchmove', function (e) {
        // 6.2.1 阻止默认滑动手势事件
        e.preventDefault();
        // 6.2.2 拿到当前位置
        currentX = e.touches[0].clientX;
        // 6.2.3 拿到水平方向上的改变距离
        movedX = currentX - startX;
        // 6.2.4 图片位置联动
        removeTransition(); // 此时是逐帧动改变,所以不需要过渡效果
        changeTranslateX(-index*bannerW + movedX);
    })
    // 6.3 手指离开屏幕
    ul_imgBox.addEventListener('touchend', function (e) {
        // 6.3.1 判断当前图片是否翻页,若未翻页,小于1/3回到本页,超过1/3翻页
        (Math.abs(movedX) <= bannerW * 0.34)? index--: index++;
        // 6.3.2 重启定时器
        timer = setInterval(scrollImg, 1000)
        // 6.3.3 起始位置/当前位置/移动距离 清零
        startX = 0;
        currentX = 0;
        movedX = 0;
    })
}

/* 秒杀倒计时 */
function seckillCountdown() { // 假设京东每天3场秒杀 00:00, 8:00, 16:00
    // 1.拿到元素
    var seckill_left = document.getElementsByClassName('seckill-left-link')[0];
    var seckill_nth = seckill_left.getElementsByTagName('em')[0];
    var seckill_timer = seckill_left.getElementsByClassName('seckill-timer')[0];
    var spans = seckill_timer.getElementsByTagName('span'); // 获取span数组

    // 2.根据当前时间判断处于哪个场次,以及倒计时总时间
    function leftTime() {
        var now = new Date();
        var nowH = now.getHours();
        var nowm = now.getMinutes();
        var nows = now.getSeconds();
        var leftH = 0;
        var leftm = 0;
        var lefts = 0;
        if (nowH >= 0 && nowH < 8){
            seckill_nth.innerHTML = 0;
            leftH = (nowm == 0 && nows == 0) ? 8 - nowH: 7 - nowH; // 01:00:00
        }else if(nowH >= 8 && nowH < 16){
            seckill_nth.innerHTML = 8;
            leftH = (nowm == 0 && nows == 0) ? 16 - nowH: 15 - nowH; // 01:00:00
        }else {
            seckill_nth.innerHTML = 16;
            leftH = (nowm == 0 && nows == 0) ? 24 - nowH: 23 - nowH; // 01:00:00
        }
        // 时间显示

        leftm = (nows == 0) ? 60 - nowm: 59 - nowm; // 01:00
        lefts = 59 - nows; // 毫秒太少

        spans[1].innerHTML = leftH;
        spans[3].innerHTML = Math.floor(leftm / 10);
        spans[4].innerHTML = leftm % 10;
        spans[6].innerHTML = Math.floor(lefts / 10);
        spans[7].innerHTML = lefts % 10;
    }

    // 3.启动倒计时
    setInterval(leftTime, 1000);
}