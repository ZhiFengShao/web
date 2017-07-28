/**
 * Created by Administrator on 2017/5/14.
 */
$(function () {
     /*
        1. 根据尺寸更改图片的显示方式
      */
     $(window).on('resize', changeImgStyle);
     function changeImgStyle() {
         // 1.1 获取当前窗口的宽度
         var clientW = $(window).width();
         // console.log(clientW);

         // 1.2 大小图的显示
         var isShowLgImg = clientW > 790;

         // 1.3 获取所有的item
         var $items = $('#wjs_banner .item');

         // 1.4 遍历
         $items.each(function (index, value) {
             // 1.4.1 获取节点元素
             var $item = $(value);

             // 1.4.2 获取属性
             var attr = isShowLgImg ? $item.data('lg-img') : $item.data('sm-img');

             var src = 'url(' + attr + ')';

             $item.css({
                backgroundImage: src
             });

             // 1.4.3 当屏幕小于790,创建img标签放入
             if(!isShowLgImg){
                 var $img = '<img src="' + attr +'">';
                 // 先清空后添加
                 $item.empty().append($img);
             }else { // 屏幕大于 790
                 $item.empty();
             }

         });
     }


     /*
        2. 改变ul的尺寸
     */
     $(window).on('resize', changeUlWidth);
     function changeUlWidth() {
         // 1. 拿到ul
         var $ul = $('#wjs_product .nav');

         // 2. 拿到左边的所有的li标签
         var $leftLis = $('li[role="presentation"]', $ul);

         // 3. 求总宽度
         var totalLiLength = 0;
         $leftLis.each(function (index, item) {
             totalLiLength += $(item).width();
         });
         // console.log(totalLiLength);

         // 4. 求出父标签的宽度
         var parentWidth = $ul.parent().width();

         // 5. 判断
         if(totalLiLength >= parentWidth){
             $ul.css({
                 width: totalLiLength
             })
         }else {
             $ul.removeAttr('style');
         }


     }


     /*
      3. 初始化tip
     */
     $('[data-toggle="tooltip"]').tooltip();

     $(window).trigger('resize');
});
