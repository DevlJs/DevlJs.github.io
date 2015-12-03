function initAnimate($) {

    var styles = [],
    transtionMap = {
        'slide-y':'translateY({#})',
        'slide-x':'translateX({#})',
        'slide-z':'translateZ({#})',
        'zoom':'scale({#})',
        'rotate-x':'rotateX({#})',
        'rotate-y':'rotateY({#})',
        'rotate-z':'rotateZ({#})'
    },
    filterMap = {
        'blur':'blur({#})',
    };

    var buildCSSValue = function(animcfg,type){

        var values_b = [],values_e = [] ,map;

        if(type == 'transtion'){

            map = transtionMap;

        }else if(type == 'filter'){

            map = filterMap;
        }

        for(var k in animcfg){

            if(map[k]){

                var tempstr = map[k];

                values_b.push(tempstr.replace(/\{#\}/gi,animcfg[k][0]));

                values_e.push(tempstr.replace(/\{#\}/gi,animcfg[k][1]));
            }
        }

        return {'b':values_b.join(' '),'e':values_e.join(' ')};
    }

    var css_idx = 10 , css_str ,csspools = [];
    $('[anim-data]').each(function(idx,dom){
        var dom = $(dom) , animcfg = dom.attr('anim-data'),trans_val_b,filter_val_b;

        if(animcfg != null){

            css_idx++;

            animcfg = animcfg.replace(/\'/gi,'"');

            animcfg = JSON.parse(animcfg);

            filter_val = buildCSSValue(animcfg,'filter');

            trans_val = buildCSSValue(animcfg,'transtion');

            css_str = '.active .cls_'+css_idx+'{'
                    + (filter_val['b']?(';filter:'+filter_val['b']+';-webkit-filter:'+filter_val['b']):'')
                    + (trans_val['b']?(';transform:'+trans_val['b']+';-webkit-transform:'+trans_val['b']):'')
                    + (animcfg['opacity']?(';opacity:'+animcfg['opacity'][0]):'')
                    + (';transition-duration: 0s')
                    + (';-webkit-transition-duration:0s')
                    + (';transition-delay:0s')
                    + (';-webkit-transition-delay:0s')
                    /*
                    + (';transition-duration: '+dom.attr('duration-time')+'s')
                    + (';-webkit-transition-duration: '+dom.attr('duration-time')+'s')
                    + (';transition-delay:'+dom.attr('delay-time')+'s')
                    + (';-webkit-transition-delay:'+dom.attr('delay-time')+'s')
                    */
                    +';}';

            csspools.push(css_str);

            css_str = '.active .play_cls_'+css_idx+'{'
                    + (filter_val['e']?(';filter:'+filter_val['e']+';-webkit-filter:'+filter_val['e']):'')
                    + (trans_val['e']?(';transform:'+trans_val['e']+';-webkit-transform:'+trans_val['e']):'')
                    + (animcfg['opacity']?(';opacity:'+animcfg['opacity'][1]):'')
                    + (';transition-duration: '+dom.attr('duration-time')+'s')
                    + (';-webkit-transition-duration: '+dom.attr('duration-time')+'s')
                    + (';transition-delay:'+dom.attr('delay-time')+'s')
                    + (';-webkit-transition-delay:'+dom.attr('delay-time')+'s')
                    +';}';

            csspools.push(css_str);

            dom.attr('anim-class','cls_'+css_idx).addClass('cls_'+css_idx);
        }
    });

    $('head').append('<style id="slidepage_style">'+csspools.join('\n')+'</style>');


    var animate = function(){

        var content = $("body");

        content.find('.slide-up').not(function(){return $(this).hasClass('be-show')}).addClass('slideUp');

        var domlist = content.find('[anim-data]');

        domlist.each(function(idx,dom){

            var dom = $(dom);

            dom.addClass('play_'+dom.attr('anim-class'));
        });

        var domlist = content.find('[delay-class]');

        domlist.each(function(idx,dom){

            var dom = $(dom);

            var dtime = parseFloat(dom.attr('delay-time'))+parseFloat(dom.attr('duration-time'));

            setTimeout(function(){

                dom.addClass(dom.attr('delay-class'));

            },dtime*1005);
        });
    }

    setTimeout(function(){animate()},1000);
};