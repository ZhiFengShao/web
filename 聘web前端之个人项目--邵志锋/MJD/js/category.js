/**
 * Created by dyf on 2017/5/12.
 */

window.onload = function () {
    shortcutDisplay();
    tableViewInteraction();
}



// 设置tableView的交互(滚动与cell点击)
function tableViewInteraction() {

    /*  ----滚动----  */
    // 1.拿到标签
    var tableBgView = document.getElementsByClassName('main_left_table')[0];
    var tableView = tableBgView.getElementsByTagName('ul')[0];

    // 2.拿到父标签高度以及子标签高度
    var bgH = tableBgView.offsetHeight;
    var tableViewH = tableView.offsetHeight;
    console.log('div.main_left_table_h:' + bgH + ';ul.tableViewH:' + tableViewH);

    // 3.求出滚动时,tableView的originY的变化区间
    var maxY = 0; // tableView的originY,最大就是0,此时显示头部完整,尾部在屏幕外
    var minY = bgH - tableViewH; // tableView的最小值,此时显示尾部完整,头部在屏幕外(屏幕上方,所以Y值为负)

    // 4.确定合理的缓冲区间(弹簧效果区间),3个cell的高度
    var buffer = 150;

    // 5.设置过渡  清除过渡  改变位置
    var setTransition = function () {
        tableView.style.transition = 'all .2s ease';
        tableView.style.webkitTransition = 'all .2s ease';
    }
    var removeTransition = function () {
        tableView.style.transition = 'none';
        tableView.style.webkitTransition = 'none';
    }
    var changeTranslateY = function (y) {
        tableView.style.transform = 'translateY('+ y +'px)';
        tableView.style.webkitTransform = 'translateY('+ y +'px)';
    }

    // 6.添加table的滚动事件

    //  6.1 设置记录属性
    var startY,curY,movedY;
    startY = 0;
    curY = 0;
    movedY = 0;

    var tableView_cur_oriY = 0; // 记录tableVieworiY值在end时的变化

    //  6.2 开始触摸
    tableView.addEventListener('touchstart', function (e) {
        // 记录触摸起始点
        startY = e.touches[0].clientY;
    });
    //  6.3 开始跟随手势滑动table
    tableView.addEventListener('touchmove', function (e) {
        // 拿到当前位置,得出移动距离
        curY = e.touches[0].clientY;
        movedY = curY - startY;

        // 滑动时,tableY需要跟随变化,变化的值就是移动的值: nowY = oriY+movedY
        var nowY = tableView_cur_oriY + movedY;

        // 确认合理的滚动区间,也就是 minY-buffer < nowY < maxY+buffer
        if (nowY > minY - buffer && nowY < maxY + buffer){
            removeTransition();
            changeTranslateY(nowY);
        }
    });
    //  6.4 结束手势
    tableView.addEventListener('touchend', function (e) {
        // 记录手势结束后,tableY需要跟随变化后的值
        tableView_cur_oriY += movedY;

        // 弹簧效果过滤
        if (tableView_cur_oriY > maxY) tableView_cur_oriY = maxY;
        if (tableView_cur_oriY < minY) tableView_cur_oriY = minY;
        setTransition();
        changeTranslateY(tableView_cur_oriY);

        // 用完的属性还原(optional)
        startY = 0;
        curY = 0;
        movedY = 0;
    });

    /*----------cell点击----------*/
    // 7.点击
    mjd.tap(tableView, function (e) {
        // 7.1拿到cell数组
        var cells = tableView.getElementsByTagName('li');

        // 7.2清除选中
        for (var i = 0; i < cells.length; i++){ // 清除选中的css样式即可
            cells[i].className = '';
            cells[i].index = i; // 绑定索引
        }

        // 7.3拿到点击的cell,设置selected
        var selCell = e.target.parentNode; // ul>li>a, event.target是a标签,parentNode是li
        selCell.className = 'current';

        // 7.4tableView过渡滚动
        tableView_cur_oriY = selCell.index * -50; // 看oriY的变化即可,也就是当前ul的Y值变成了啥
        // tableView_changed_oriY值需要设置界限
        if (tableView_cur_oriY < minY) tableView_cur_oriY = minY;
        setTransition(); // 设置过渡
        changeTranslateY(tableView_cur_oriY);

    });
}