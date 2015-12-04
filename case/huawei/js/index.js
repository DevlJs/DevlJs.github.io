var contralVar = false;
var scrollLock = false;
var i = 16;
var User = {
  nickname: "-",
  avatar: "",
  Orientation: 0
};
var intervalId;

function changeLockState() {
  if (!scrollLock) {
    scrollLock = true;
    $.fn.fullpage.moveSectionDown();
    scrollLock = false;
  }
}

function changeLockStateBack() {
  if (!scrollLock) {
    scrollLock = true;
    $.fn.fullpage.moveSectionUp();
    scrollLock = false;
  }
}

function watchShow() {
  if (i == 1) {
    var myVideo = document.getElementById("music");
    myVideo.play();
    $(".co,.name,.mes,.font").addClass("ss");
    window.clearInterval(intervalId);
    window.setTimeout(function() {
      $("#music").remove();
    }, 2000);
    return false;
  }
  i--;
  $("#indexPart .watch").eq(i).hide();
}

function confirmImage(event) {
  html2canvas(document.getElementById("preview"), {
    onrendered: function(canvas) {
      var imgSrc = document.getElementById("canvasId").toDataUrl("image/png");
      $("#LvJing").html("");
      $("#LvJing").html(canvas);
    },
  });
}

$(document).ready(function() {
  window.setTimeout(function() {

    $("#div_loading").fadeOut();
  }, 8000);
  intervalId = window.setInterval(function() {
    watchShow();
  }, 150);

  $(".submit").click(function() {
    $("#reqFrom").serializeSubmie();
  });

  $.dragImg();
  $('#drag-and-drop-zone').dmUploader({
    url: '',
    dataType: 'json',
    allowedTypes: 'image/*',
    onNewFile: function(id, file) {
      $.danidemo.addFile('#demo-files', id, file);
      if (typeof FileReader !== "undefined") {
        var reader = new FileReader();
        reader.onload = function(e) {
          User.avatar = e.target.result;
          $.dragImg();
        }
        reader.readAsDataURL(file);

        changeLockState();

        EXIF.getData(file, function() {
          EXIF.getAllTags(this);
          //alert(EXIF.getTag(this, 'Orientation'));
          User.Orientation = EXIF.getTag(this, 'Orientation');
        //alert(User.Orientation);
        //return;
        });
      }
    }
  });

  initAnimate($);

  reSetCss();

  $('#dowebok').fullpage({
    sectionsColor: ['#000', '#000', 'transparnet', '#000'],
    verticalCentered: false,
    resize: true,
    continuousVertical: false,
    onLeave: function(index, nextIndex, direction) {

      if (scrollLock == false) {
        return false;
      }
      return true;
    },
    onSlideLeave: function(index, nextIndex, direction) {}
  });
  $(".lujinPart img").click(function() {
    var src = $(this).attr("data-bgsrc");
    $(".cover").css("background-image", "url('./images/bg/" + src + ".png')");
    changeLockState();
    $("#photo").fadeIn();
  });
  $("#LvJing .confrimPhoto").click(function() {
    changeLockState();
  });
  $(".no").click(function() {
    changeLockStateBack();
  });
  $(".sharebtn").click(function() {
    var sharePart = $(".share");
    sharePart.fadeIn();
  });
  $(".share").click(function() {
    $(".share").fadeOut();
  });

  $(".save").click(function() {
    $(".notice").show();
    html2canvas($("#preview"), {
      allowTaint: true,
      taintTest: false,
      onrendered: function(canvas) {
        canvas.id = "mycanvas";
        //document.body.appendChild(canvas);
        //生成base64图片数据
        var dataUrl = canvas.toDataURL();
        var newImg = document.createElement("img");
        newImg.src = dataUrl;
        $("#preview").html("");
        $("#preview").html(newImg);
      }
    });
  });
});

function reSetCss() {
  var removeAnimate = function() {
    var content = $(".section");

    content.find('.slide-up').not(function() {
      return $(this).hasClass('be-show')
    }).addClass('slideUp');

    var domlist = content.find('[anim-data]');

    domlist.each(function(idx, dom) {

      var dom = $(dom);

      dom.removeClass('play_' + dom.attr('anim-class'));
    });

    var domlist = content.find('[delay-class]');

    domlist.each(function(idx, dom) {

      var dom = $(dom);

      var dtime = parseFloat(dom.attr('delay-time')) + parseFloat(dom.attr('duration-time'));

      setTimeout(function() {

        dom.removeClass(dom.attr('delay-class'));

      }, dtime * 1005);
    });
    var addAnimate = function() {

      var content = $("body");

      content.find('.slide-up').not(function() {
        return $(this).hasClass('be-show')
      }).addClass('slideUp');

      var domlist = content.find('[anim-data]');

      domlist.each(function(idx, dom) {

        var dom = $(dom);

        dom.addClass('play_' + dom.attr('anim-class'));
      });

      var domlist = content.find('[delay-class]');

      domlist.each(function(idx, dom) {

        var dom = $(dom);

        var dtime = parseFloat(dom.attr('delay-time')) + parseFloat(dom.attr('duration-time'));

        setTimeout(function() {

          dom.addClass(dom.attr('delay-class'));

        }, dtime * 1005);
      });
    }
    setTimeout(function() {
      addAnimate()
    }, 500);
  }
  setTimeout(function() {
    removeAnimate()
  }, 100);
}

(function($) {
  $.extend({
    "dragImg": function() {
      var v = 0,
        w = 430,
        x = 672,
        p = false,
        k = 0,
        l = undefined,
        g = true,
        b = 672,
        c = 1.4883720930232558,
        d = undefined,
        D = null,
        P = 430,
        y = new Image,
        S = {},
        newImg = new Image;
      y.src = User.avatar;

      y.onload = function() {
        v = k = 0, P = this.naturalWidth, x = this.naturalHeight, P / x > 430 / 672 && (w = Math.ceil(572 * P / x), v = (430 - w) / 2), b = w * x / P;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 430;
        canvas.height = 672;
        ctx.drawImage(this, 0, 0, 430, 672);
        //alert(canvas.width + ',' + canvas.height);
        alert(User.Orientation);
        var base64 = null;
        var mpImg = new MegaPixImage(y);
        mpImg.render(canvas, {
          maxWidth: 430,
          maxHeight: 672,
          quality: 0.8,
          orientation: User.Orientation
        });

        base64 = canvas.toDataURL("image/jpeg", 0.8);

        //uploadImage(base64);
        newImg.src = base64;
        s();
      //旋转
      //Img.rotate("photo", 90);
      };



      var C = $("#photo").get(0);
      T = C.getContext("2d");
      C.width = w, C.height = b, T.fillStyle = "#FFFFFF";
      var S, _,
        I = new Hammer.Manager(C);
      $(".close").click(function() {
        $("#canvassPage").hide()
      });
      I.add(new Hammer.Pan),
      I.add(new Hammer.Pinch),
      I.on("panstart", function(a) {
        S = {
          x: v,
          y: k
        }
      }).on("panmove", function(a) {
        v = S.x + a.deltaX,
        k = S.y + a.deltaY,
        s()
      }).on("pinchstart", function(a) {
        _ = {
          width: w,
          height: b
        },
        S = {
          x: v,
          y: k
        }
      }).on("pinchmove", function(a) {
        w = Math.max(430, _.width * a.scale),
        b = w * x / P,
        v = S.x + (_.width - w) / 3,
        k = S.y + (_.height - b) / 2,
        s()
      });

      function s() {
        if (newImg) {
          T.fillRect(0, 0, 430, 672),
          T.drawImage(newImg, 0, 0, P, x, v, k, w, b)
        }
      }
    }
  });
}($))
