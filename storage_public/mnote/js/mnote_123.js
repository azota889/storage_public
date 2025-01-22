$("textarea").each(function() {
    this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;")
}).on("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px"
});
var globalInitMnote = !1;

function getOs() {
    var a = navigator.userAgent.toLowerCase(),
        c = /iphone|ipod|ipad/.test(a),
        b = /android/.test(a);
    /safari/.test(a);
    return b ? "android" : c ? "ios" : "web"
}

function replaceTV(a) {
    return a.replace(/\u00e0|\u00e1|\u1ea1|\u1ea3|\u00e3|\u00e2|\u1ea7|\u1ea5|\u1ead|\u1ea9|\u1eab|\u0103|\u1eb1|\u1eaf|\u1eb7|\u1eb3|\u1eb5/g, "a").replace(/ /g, "-").replace(/\u0111/g, "d").replace(/\u0111/g, "d").replace(/\u1ef3|\u00fd|\u1ef5|\u1ef7|\u1ef9/g, "y").replace(/\u00f9|\u00fa|\u1ee5|\u1ee7|\u0169|\u01b0|\u1eeb|\u1ee9|\u1ef1|\u1eed|\u1eef/g, "u").replace(/\u00f2|\u00f3|\u1ecd|\u1ecf|\u00f5|\u00f4|\u1ed3|\u1ed1|\u1ed9|\u1ed5|\u1ed7|\u01a1|\u1edd|\u1edb|\u1ee3|\u1edf|\u1ee1.+/g,
        "o").replace(/\u00e8|\u00e9|\u1eb9|\u1ebb|\u1ebd|\u00ea|\u1ec1|\u1ebf|\u1ec7|\u1ec3|\u1ec5.+/g, "e").replace(/\u00ec|\u00ed|\u1ecb|\u1ec9|\u0129/g, "i")
}

function showLoading() {
    $(".loading").css("display", "block")
}



function hideLoading() {
    $(".loading").css("display", "none")
}
var roundedPoly = function(a, c, b) {
    var e, d = function(u, v, p) {
        p.x = v.x - u.x;
        p.y = v.y - u.y;
        p.len = Math.sqrt(p.x * p.x + p.y * p.y);
        p.nx = p.x / p.len;
        p.ny = p.y / p.len;
        p.ang = Math.atan2(p.ny, p.nx)
    };
    var f = {};
    var g = {};
    var k = c.length;
    var l = c[k - 1];
    for (e = 0; e < k; e++) {
        var h = c[e % k];
        var m = c[(e + 1) % k];
        d(h, l, f);
        d(h, m, g);
        l = f.nx * g.ny - f.ny * g.nx;
        var n = f.nx * g.nx - f.ny * -g.ny;
        var q = Math.asin(l);
        l = 1;
        var t = !1;
        0 > n ? 0 > q ? q = Math.PI + q : (q = Math.PI - q, l = -1, t = !0) : 0 < q && (l = -1, t = !0);
        n = q / 2;
        var r = Math.abs(Math.cos(n) * b / Math.sin(n));
        r > Math.min(f.len / 2, g.len / 2) ?
            (r = Math.min(f.len / 2, g.len / 2), q = Math.abs(r * Math.sin(n) / Math.cos(n))) : q = b;
        n = h.x + g.nx * r;
        r = h.y + g.ny * r;
        n += -g.ny * q * l;
        r += g.nx * q * l;
        a.arc(n, r, q, f.ang + Math.PI / 2 * l, g.ang - Math.PI / 2 * l, t);
        l = h;
        h = m
    }
    a.closePath()
};
window.addEventListener("message", function(a) {
    a.data && (a.data.cmd && "initMNote" == a.data.cmd && a.data.pages && !window.globalInitMnote && (window.globalInitMnote = !0, (mnote = MNote.getInstance()) && null == mnote.mnotedata && mnote.initNote(a.data)), a.data.cmd && "MNoteStaticText" == a.data.cmd && (mnote = MNote.getInstance(), mnote.staticTextConfig = JSON.parse(a.data.data), localStorage && localStorage.setItem("staticTextConfig", JSON.stringify(mnote.staticTextConfig))), a.data.cmd && "getMNoteJson" == a.data.cmd && (a = mnote.exportJSON(),
        console.log("data : " + JSON.stringify(a)), parent.postMessage({
            cmd: "MNoteJson",
            data: a
        }, "*")))
});

function drawArrowhead(a, c, b, e) {
    var d = b.x,
        f = b.y;
    a.save();
    a.fillStyle = a.strokeStyle;
    a.beginPath();
    c = Math.atan2(b.y - c.y, b.x - c.x);
    b = e * Math.cos(c) + d;
    var g = e * Math.sin(c) + f;
    a.moveTo(b, g);
    c += 1 / 3 * 2 * Math.PI;
    b = e * Math.cos(c) + d;
    g = e * Math.sin(c) + f;
    a.lineTo(b, g);
    c += 1 / 3 * 2 * Math.PI;
    b = e * Math.cos(c) + d;
    g = e * Math.sin(c) + f;
    a.lineTo(b, g);
    a.closePath();
    a.fill();
    a.restore()
}
parent.postMessage("MNoteLoadComplete", "*");

function is_touch_device() {
    return "ontouchstart" in window || navigator.msMaxTouchPoints
}

function isDomVisile(a) {
    return "none" == $(a).css("display") ? !1 : !0
}

function dragMoveListener(a) {
    var c = a.target,
        b = (parseFloat(c.getAttribute("data-x")) || 0) + a.dx;
    a = (parseFloat(c.getAttribute("data-y")) || 0) + a.dy;
    c.style.webkitTransform = c.style.transform = "translate(" + b + "px, " + a + "px)";
    c.setAttribute("data-x", b);
    c.setAttribute("data-y", a)
}
window.dragMoveListener = dragMoveListener;

function initNote(a) {
    mnote.addPages(a)
}

function exportJSON() {
    var a = mnote.exportJSON();
    console.log("data : " + JSON.stringify(a));
    parent.postMessage({
        cmd: "MNoteJson",
        data: a
    }, "*")
}

function exportPdf() {
    MNote.getInstance().exportPdf()
}

function exportPdf_() {
    MNote.getInstance().exportPdf_()
}
$(window).on("load", function() {});

function initPanZoom(a) {
    var c = document.querySelector("#mnote_pages");
    panzoom(c, {
        beforeWheel: function(b) {
            return !b.altKey
        },
        bounds: !0,
        boundsPadding: .05,
        maxZoom: 3,
        minZoom: 1,
        pinchSpeed: 3,
        initialX: 0,
        initialY: 0,
        initialZoom: a
    })
}
var MNote_instance = cc.Class.extend({
        appWidth: 900,
        appHeight: 1120,
        pageWidth: 750,
        pageHeight: 1120,
        pages: [],
        pageCount: 0,
        pageScale: 1,
        maxLineWidth: 25,
        minLineWidth: 1,
        maxTextSize: 60,
        minTextSize: 20,
        isDrawingMode: !1,
        currDrawStyle: null,
        currTextStyle: null,
        currBrush: "pen",
        lastTouchX: -1,
        lastTouchY: -1,
        lastTouchDown: !1,
        BRUSH_MOVE: "move",
        BRUSH_PEN: "pen",
        BRUSH_ERASE: "erase",
        BRUSH_TEXT: "text",
        BRUSH_POLYGON: "polygon",
        BRUSH_LINE: "line",
        BRUSH_RECTANGLE: "rangle",
        BRUSH_CIRCLE: "circle",
        BRUSH_ARROW: "arrow",
        canvasTouchStartX: -1,
        canvasTouchStartY: -1,
        canvasTouchStartTime: -1,
        canvasTapCount: 0,
        aldreadyDelete: !1,
        mode: "mode_normal",
        MODE_NORMAL: "mode_normal",
        MODE_DRAWRING: "mode_drawing",
        MODE_ENTER_TEXT: "mode_enter_text",
        MODE_EDIT_TEXT: "mode_edit_text",
        countRight: 0,
        countWrong: 0,
        arrImg: [],
        mnotedata: null,
        staticTextConfig: null,
        desktopZoom: 1,
        ctor: function() {
            var a = this,
                c = this;
            this.note_pages = document.getElementById("mnote_pages");
            this.note_content = document.getElementById("mnote_content");
            this.note_container = document.getElementById("mnote_container");
            this.onresize(window.innerWidth, window.innerHeight);
            window.addEventListener("resize", function() {
                a.onresize(window.innerWidth, window.innerHeight)
            });
            setTimeout(function() {
                a.onresize(window.innerWidth, window.innerHeight, !0)
            }, 2700);
            is_touch_device() && (this.panzoom = panzoom(this.note_container, {
                beforeWheel: function(d) {
                    return !d.altKey
                },
                onTouch: function(d) {
                    return "edit" == c.mnotedata.mode ? !1 : !0
                },
                smoothScroll: !0,
                bounds: !0,
                boundsPadding: .5,
                maxZoom: 4,
                minZoom: 1
            }), this.panzoom.on("transform", function(d) {
                a.mode ==
                    a.MODE_NORMAL && (d = document.getElementById("mnote_mark"), parseInt($(d).css("top")) > c.appHeight && d.getBoundingClientRect())
            }));
            $("#mnote_help").css("display", "block");
            $(".help_text").css("float", "left");
            this.btnHoldDraw = document.getElementById("btn_hold_draw");
            $(this.btnHoldDraw).on("touchend mouseup", function(d) {
                a.setMode(a.MODE_DRAWRING);
                d.preventDefault()
            });
            this.btnDrawFinish = document.getElementById("btn_draw_finish");
            this.btnDrawErase = document.getElementById("btn_draw_erase");
            this.btnDrawPen = document.getElementById("btn_draw_pen");
            this.btnDrawColor = document.getElementById("btn_draw_color");
            this.btnDrawText = document.getElementById("btn_draw_text");
            this.btnDrawMove = document.getElementById("btn_draw_move");
            $(this.btnDrawFinish).on("touchend mouseup", function(d) {
                a.setMode(a.MODE_NORMAL);
                d.preventDefault()
            });
            $(this.btnDrawErase).on("touchend mouseup", function(d) {
                a.currBrush == a.BRUSH_ERASE ? a.showMenuColor() : a.setBrushDraw(a.BRUSH_ERASE)
            });
            $(this.btnDrawText).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_TEXT);
                a.exportJSON()
            });
            $(this.btnDrawMove).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_MOVE)
            });
            $(this.btnDrawPen).on("touchend mouseup", function(d) {
                a.currBrush == a.BRUSH_PEN || a.currBrush == a.BRUSH_LINE || a.currBrush == a.BRUSH_RECTANGLE || a.currBrush == a.BRUSH_CIRCLE || a.currBrush == a.BRUSH_ARROW ? a.showMenuColor() : a.setBrushDraw(a.BRUSH_PEN)
            });
            this.mnote_menu_color = document.getElementById("mnote_menu_color");
            this.menu_color_content = document.getElementById("menu_color_content");
            $(this.mnote_menu_color).on("touchend mouseup",
                function(d) {
                    a.hideMenuColor();
                    d.stopPropagation()
                });
            $(this.menu_color_content).on("touchend mouseup", function(d) {
                d.stopPropagation()
            });
            this.currDrawStyle = {
                alpha: 1,
                lineWidth: 6,
                strokeStyle: "red",
                fillStyle: "red"
            };
            this.currTextStyle = {
                font: "font_chu_dep",
                size: 20,
                align: "left",
                color: "red",
                fill: !1
            };
            is_touch_device() ? ($("#mnote_app").css("overflow", "hidden"), $("#mnote_content").css("overflow", "hidden"), $("#bt_trash").css("left", window.innerWidth / 2 - 30 + "px"), $("#bt_trash").css("top", "0px"), this.currDrawStyle.lineWidth =
                6) : ($("body").attr("spellcheck", !1), $("#mnote_content").css("overflow", "scroll"), $("#menu_text_font").css("transform", "scale(1)"), $("#bt_trash").css("left", "0px"), $("#mnote_setting_zoom_out").css("display", "block"), $("#mnote_setting_zoom_in").css("display", "block"), $("#bt_trash").css("top", window.innerHeight / 2 + "px"), this.currDrawStyle.lineWidth = 2, this.minTextSize = 10);
            try {
                if (localStorage) {
                    var b = localStorage.getItem("textStyle"),
                        e = localStorage.getItem("drawStyle");
                    "" != e && void 0 != e && null != e && (this.currDrawStyle =
                        JSON.parse(e));
                    "" != b && void 0 != b && null != b && (this.currTextStyle = JSON.parse(b))
                }
            } catch (d) {
                console.log("exception " + d.toString())
            }
            this.initMenuBottom();
            this.initMenuText();
            this.initMarkUI();
            this.setBrushDraw(this.BRUSH_MOVE);
            this.contentBushPen = document.getElementById("content_brush_pen");
            this.contentBushLine = document.getElementById("content_brush_line");
            this.contentBushRect = document.getElementById("content_brush_rectangle");
            this.contentBushCircle = document.getElementById("content_brush_circle");
            this.contentBushArrow =
                document.getElementById("content_brush_arrow");
            $(this.contentBushPen).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_PEN);
                d.preventDefault();
                d.stopPropagation()
            });
            $(this.contentBushLine).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_LINE);
                d.preventDefault();
                d.stopPropagation()
            });
            $(this.contentBushRect).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_RECTANGLE);
                d.preventDefault();
                d.stopPropagation()
            });
            $(this.contentBushCircle).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_CIRCLE);
                d.preventDefault();
                d.stopPropagation()
            });
            $(this.contentBushArrow).on("touchend mouseup", function(d) {
                a.setBrushDraw(a.BRUSH_ARROW);
                d.preventDefault();
                d.stopPropagation()
            });
            this.thickSliderInput = document.getElementById("thick_slider_input");
            $(this.thickSliderInput).on("input", function(d) {
                a.setDrawStyle({
                    lineWidth: parseInt($(a.thickSliderInput).val())
                })
            });
            $(".btn-content-color").on("mouseup", function(d) {
                c.setDrawStyle({
                    strokeStyle: $(this).attr("data")
                });
                d.preventDefault();
                d.stopPropagation()
            });
            c = this;
            $("#thick_slider").on("touchstart", function(d) {
                c.sliderThickTouch(d);
                d.preventDefault();
                d.stopPropagation()
            });
            $("#thick_slider").on("touchmove", function(d) {
                c.sliderThickTouch(d);
                d.preventDefault();
                d.stopPropagation()
            });
            this.setDrawStyle(this.currDrawStyle);
            this.setTextStyle(this.currTextStyle);
            $("#color_content_close").on("touchend mouseup", function() {
                a.hideMenuColor()
            });
            $(".help_text").on("touchend mouseup", function() {
                $(this).css("display", "none")
            });
            window.addEventListener("mouseup", function(d) {
                a.lastTouchDown = !1;
                var f = $(".obj_down");
                0 < f.length && a._endObj(f[0], d);
                $(".obj_down").removeClass("obj_down");
                a.inactiveAllObj();
                if (!is_touch_device())
                    for (d = 0; d < a.pages.length; d++) a.onCanvasEnd(document.getElementById("canvas_" + d));
                document.getElementById("slider_text_size").isMouseDown = !1;
                $("#mnote_menu_edit_bg").css("display", "none")
            });
            window.addEventListener("mousemove", function(d) {
                var f = $(".obj_down");
                0 < f.length && a._moveObj($(f[0]).get(0), d)
            });
            window.addEventListener("mousedown", function(d) {});
            document.getElementById("capture").addEventListener("change",
                function(d) {
                    if (d = document.getElementById("capture").files[0]) {
                        var f = new FileReader;
                        f.onload = function(g) {
                            a.addPage({
                                backgroundImage: g.target.result
                            })
                        };
                        f.readAsDataURL(d)
                    }
                });
            $("#btn_save_data").on("touchstart mousedown", function(d) {
                d.preventDefault()
            });
            $("#btn_save_data").on("touchend mouseup", function(d) {
                var f = a.exportJSON();
                console.log("data : " + JSON.stringify(f));
                parent.postMessage({
                    cmd: "MNoteJson",
                    data: f
                }, "*");
                d.preventDefault()
            });
            $("#mnote_mark_result").on("touchstart mousedown", function(d) {
                d.preventDefault()
            });
            b = document.createElement("style");
            b.type = "text/css";
            b.innerHTML = "@font-face {font-family: handwriting_font_z;src: url(css/HP0015HB.ttf);}";
            document.getElementsByTagName("head")[0].appendChild(b);
            $("#mark_comment_txt").css("font-family", "handwriting_font_z");
            this.initStaticTextSetting();
            $("#setting_menu_static_text").click(function() {
                "none" == $("#setting_static_text").css("display") ? a.showStaticTextSetting() : a.hideStaticTextSetting()
            });
            $("#setting_menu_mathtype").click(function() {
                a.showMathEditor()
            });
            b = document.querySelectorAll(".dropdown-trigger");
            M.Dropdown.init(b, {
                alignment: "bottom",
                hover: !1
            });
            this.initMathEditor();
            $("#btn_resubmit").click(function() {
                parent.postMessage({
                    cmd: "MNoteReSubmit",
                    data: {}
                }, "*")
            });
            $("#mnote_setting_zoom_out").click(function() {
                a.setDesktopZoom(a.desktopZoom - .4)
            });
            $("#mnote_setting_zoom_in").click(function() {
                a.setDesktopZoom(a.desktopZoom + .4)
            });
            $("#mnote_menu_edit_bg_rotate").click(function(d) {
                $("#mnote_menu_edit_bg").css("display", "none");
                var f = $("#mnote_menu_edit_bg").attr("data");
                a.rotateBgPage(f);
                d.preventDefault();
                d.stopPropagation()
            });
            $("#mnote_menu_edit_bg_moveup").click(function(d) {
                $("#mnote_menu_edit_bg").css("display", "none");
                var f = $("#mnote_menu_edit_bg").attr("data");
                a.moveUpPage(f);
                d.preventDefault();
                d.stopPropagation()
            });
            $("#mnote_menu_edit_bg_movedown").click(function(d) {
                $("#mnote_menu_edit_bg").css("display", "none");
                var f = $("#mnote_menu_edit_bg").attr("data");
                a.moveDownPage(f);
                d.preventDefault();
                d.stopPropagation()
            });
            $("#btn_comment_font").click(function() {
                "block" ==
                $("#txtCommnetFont").css("display") ? $("#txtCommnetFont").css("display", "none") : $("#txtCommnetFont").css("display", "block")
            });
            c = this;
            $(".txtCommnetFont").click(function(d) {
                $("#mark_comment_txt").css("font-family", $(this).attr("value"));
                $("#txtCommnetFont").css("display", "none");
                if (c.staticTextConfig && (c.staticTextConfig.txtCommentFont = $(this).attr("value"), localStorage)) try {
                    localStorage.setItem("staticTextConfig", JSON.stringify(c.staticTextConfig))
                } catch (f) {}
            });
            this.recognizing = !1;
            this.final_transcript =
                ""
        },
        setButtonVoiceToText: function(a) {
            a ? ($("#bt_voice_text").removeClass("green"), $("#bt_voice_text").addClass("red pulse")) : ($("#bt_voice_text").removeClass("red pulse"), $("#bt_voice_text").addClass("green"))
        },
        linebreak: function(a) {
            return a.replace(/\n\n/g, "<p></p>").replace(/\n/g, "<br>")
        },
        capitalize: function(a) {
            return a.replace(/\S/, function(c) {
                return c.toUpperCase()
            })
        },
        setupVoiceToText: function() {
            this.recognition = new webkitSpeechRecognition;
            this.recognition.lang = "vi-VN";
            this.recognition.continuous = !0;
            this.recognition.interimResults = !0;
            var a = this;
            this.recognition.onstart = function() {
                a.recognizing = !0;
                a.setButtonVoiceToText(!0)
            };
            this.recognition.onerror = function(c) {
                "no-speech" == c.error && console.log("voice to text error no-speech");
                "audio-capture" == c.error && console.log("voice to text error audio-capture");
                "not-allowed" == c.error && console.log("voice to text error not-allowed");
                a.recognizing = !1;
                a.setButtonVoiceToText(!1)
            };
            this.recognition.onend = function() {
                a.recognizing = !1;
                a.setButtonVoiceToText(!1)
            };
            this.recognition.onresult = function(c) {
                for (var b = "", e = c.resultIndex; e < c.results.length; ++e) c.results[e].isFinal ? a.final_transcript += c.results[e][0].transcript : b += c.results[e][0].transcript;
                console.log("transcript " + a.final_transcript + ":" + b);
                $("#mark_comment_txt").val(a.final_transcript + ":" + b);
                a.resizeTxtComment()
            }
        },
        sliderThickTouch: function(a) {
            if (!(1 > a.touches.length)) {
                var c = a.touches[a.touches.length - 1],
                    b = document.getElementById("thick_slider"),
                    e = b.getBoundingClientRect();
                c = (c.clientX - e.left) / e.width;
                c = 0 > c ? 0 : c;
                c = 1 < c ? 1 : c;
                $(this.thickSliderInput).val(Math.floor(2 + 33 * c));
                b = $(b).find(".thumb")[0];
                $(b).css("left", Math.floor(c * e.width - 5) + "px");
                this.setDrawStyle({
                    lineWidth: parseInt($(this.thickSliderInput).val())
                });
                a.preventDefault();
                a.stopPropagation()
            }
        },
        setDesktopZoom: function(a) {
            .6 <= a && 8 >= a && (this.desktopZoom = a, $("#mnote_container").css("transform", "scale(" + this.desktopZoom + ")"))
        },
        initNote: function(a) {
            var c = this;
            try {
                var b = JSON.stringify(a);
               /* b = b.replaceAll("<div>", "_div");
                b = b.replaceAll("</div>", "div_");
                b = b.replaceAll("&lt;", "");
               // b = b.replaceAll("<", "");*/
                b = b.replaceAll("_divbrdiv_","_divdiv_");
                //b = xssFilters.inHTMLData(b);
                b = b.replaceAll("_div", "<div>");
                b = b.replaceAll("div_", "</div>");
                //console.log("initNode : " + b);*/
                b=filterXSS(b);
                a = JSON.parse(b);
            } catch (d) {
                alert("D\u1eef li\u1ec7u \u0111\u1ea7u v\u00e0o kh\u00f4ng h\u1ee3p l\u1ec7 !");
                return
            }
            this.mnotedata = a;
            this.mnotedata.fullname = "hoten";
            this.mnotedata.classname = "lop";
            this.mnotedata.homework = "baitap";
            this.mnotedata.homeworkTime = "0000_00_00";
            a.staticTextConfig && (this.staticTextConfig = JSON.parse(a.staticTextConfig));
            a.student_obj && a.student_obj.fullName && ($("#mnote_user_name").html("H\u1ecd v\u00e0 t\u00ean : " + a.student_obj.fullName), this.mnotedata.fullname = replaceTV(a.student_obj.fullName));
            a.classroom_obj && a.classroom_obj.name && ($("#mnote_user_class").html("L\u1edbp : " + a.classroom_obj.name), this.mnotedata.classname = replaceTV(a.classroom_obj.name));
            a.homework_obj && a.homework_obj.deadline && (b = a.homework_obj.deadline.split("T")[0], b = b.split("-"), $("#mnote_user_time").html("Ng\u00e0y " + b[2] + " th\u00e1ng " + b[1] +
                " n\u0103m " + b[0]), this.mnotedata.homeworkTime = b[2] + "_" + b[1] + "_" + b[0]);
            a.homework_obj && a.homework_obj.content && ($("#mnote_user_homework").html(a.homework_obj.content), this.mnotedata.homework = replaceTV(a.homework_obj.name.substr(0, 50)));
            for (b = 0; b < a.pages.length; b++) void 0 == a.pages[b].id && (a.pages[b].id = b);
            this.addPages(a.pages);
            a.comment && ($("#mark_comment_txt").val(a.comment), document.getElementById("mark_comment_txt").style.height = document.getElementById("mark_comment_txt").scrollHeight + "px");
            a.point &&
                (b = a.point.toString(), "1000" == b ? b = "\u0110" : "1001" == b ? b = "C\u0110" : "2000" == b ? b = "HT" : "2001" == b ? b = "CHT" : "3000" == b && (b = "HTT"), $("#mark_number_txt").val(b));
            this.resizeTxtComment();
            a.commentEmoji && this.addCommentEmoji(a.commentEmoji);
            if ("edit" == this.mnotedata.mode) {
                a = !1;
                if (void 0 != this.mnotedata.hideMark && null != this.mnotedata.hideMark) a = this.mnotedata.hideMark;
                else try {
                    localStorage && (a = "true" == localStorage.getItem("hideMark") ? !0 : !1)
                } catch (d) {}
                a ? this.hideMark(!0) : this.showMark(!0);
                try {
                    "exam" == this.mnotedata.context &&
                        $("#mnote_mark").css("display", "none")
                } catch (d) {}
            } else is_touch_device() || ($("#mark_comment_txt").attr("disabled", ""), $("#mark_number_txt").attr("disabled", "")), $("#mnote_mark_chose").css("display", "none"), $("#btn_save_data").css("display", "none"), $("#mnote_hold_bt").css("display", "none"), $("#mnote_mark").css("top", "0px"), $("#hide_mark").css("display", "none"), $("#mnote_mark_hide").css("display", "none"), a = $("#mnote_mark_point").height() - 10, $("#mnote_pages").css("padding-top", a + "px"), $("#mnote_user_info").css("display",
                "none"), $("#mnote_mark").on("touchend mousedown", function(d) {}), $("#mnote_mark_result").css("display", "none"), $("#mnote_setting_bt").css("display", "none"), $("#mnote_setting_zoom_in").css("display", "none"), $("#mnote_setting_zoom_out").css("display", "none"), $("#mnote_mark_emoji_bt").css("display", "none"), $("#mnote_help").css("display", "none"), $("#mnote_mark_emoji_bt").css("display", "none"), $(".bt-edit-bg").css("display", "none"), 1 == this.mnotedata.hideMark && this.hideMark();
            if (this.staticTextConfig && this.staticTextConfig.txtCommentFont) $("#mark_comment_txt").css("font-family",
                this.staticTextConfig.txtCommentFont);
            else try {
                if (localStorage) {
                    var e = localStorage.getItem("staticTextConfig");
                    e && (this.staticTextConfig = JSON.parse(e), this.staticTextConfig.txtCommentFont && $("#mark_comment_txt").css("font-family", this.staticTextConfig.txtCommentFont))
                }
            } catch (d) {}
            setTimeout(function() {
                "edit" == c.mnotedata.mode && $("#mnote_hold_bt").css("display", "flex")
            }, 500)
        },
        resetNote: function() {
            this.removeAllPage()
        },
        addPages: function(a) {
            for (var c = 0; c < a.length; c++) this.addPage(a[c])
        },
        addPage: function(a) {
            var c =
                this,
                b = $('<div data="' + a.id + '" id="page_' + a.id + '" class="page"></div>');
            $(b).css("margin-top", "5px");
            $(this.note_pages).append($(b));
            $(b).width(this.pageWidth - 200);
            var e = $('<div class="page_bg"></div>');
            $(b).append($(e));
            var d = $('<div class="page_canvas_draw"></div>');
            $(b).append($(d));
            var f = $('<div class="page_objs_layer"></div>');
            $(b).append($(f));
            $(f).css("pointer-events", "none");
            f = $('<i data="rotate" class="material-icons bt-edit-bg waves-effect waves-light" style="font-size:35px">crop_rotate</i>');
            var g = $('<i data="moveup" class="material-icons bt-edit-bg waves-effect waves-light" style="right:50px;font-size:35px">arrow_upward</i>');
            $(b).append($(f));
            $(b).append($(g));
            b = document.createElement("canvas");
            b.id = "canvas_" + a.id;
            b.index = a.id;
            b.pageid = a.id;
            b.style = "position:absolute";
            $(b).addClass("canvas_draw");
            this.addCanvasEventListener(b);
            f = document.createElement("canvas");
            f.id = "canvasDraw_" + a.id;
            f.pageid = a.id;
            f.style = "position:absolute";
            $(d).append(f);
            $(d).append(b);
            d = !1;
            g = a.backgroundImage.length;
            var k = a.backgroundImage.toLowerCase();
            k.indexOf(".mp4") >= g - 5 || k.indexOf(".mov") >= g - 5 || k.indexOf(".wmv") >= g - 5 || k.indexOf(".webm") >= g - 5 || k.indexOf(".mp3") >= g - 5 || k.indexOf(".m4a") >= g - 5 || 0 <= k.indexOf("player.vimeo") || 0 <= k.indexOf("mega.nz") ? (d = !0, b.pagetype = 1) : b.pagetype = 0;
            isNaN(a.width) || isNaN(a.height) || c.resizePage(a.id, a.width, a.height);
            if (a.backgroundImage)
                if (d) 0 <= a.backgroundImage.indexOf("player.vimeo") || 0 <= a.backgroundImage.indexOf("mega.nz") ? $(e).html('<iframe src="' + a.backgroundImage + '" width="100%" height=450 style="border:none"></iframe>') :
                    0 > a.backgroundImage.indexOf("wewiin.nyc3.cdn") ? ($(e).html('<video id="video_' + a.id + '" class="video-js vjs-big-play-centered" controls preload="auto" width="100%" height="450" style="width:100%;height:450px"><source src="' + a.backgroundImage + '" type="video/mp4" /></video>'), videojs("video_" + a.id, {
                        controls: !0,
                        autoplay: !1,
                        preload: "auto"
                    })) : $(e).html(" Ch\u1ee9c n\u0103ng video \u0111ang t\u1ea1m kho\u00e1 , vui l\u00f2ng th\u1eed l\u1ea1i sau ! "), c.resizePage(a.id, c.pageWidth, 450, null), f.style.pointerEvents =
                    "none", b.style.pointerEvents = "none", $(b.parentNode).css("pointer-events", "none");
                else {
                    var l = new Image;
                    $(e).append(l);
                    this.arrImg.push(l);
                    $(l).attr("pageid", a.id);
                    $(l).attr("id", "image_bg_" + a.id);
                    $(l).attr("nl", "1");
                    l.crossOrigin = "anonymous";
                    l.onload = function() {
                        if ($(this).parent()) {
                            id = parseInt($(this).attr("pageid"));
                            var m = c.pageWidth < l.width ? c.pageWidth : l.width,
                                n = Math.floor(l.height * m / l.width);
                            l.width = m;
                            l.height = n;
                            c.resizePage(id, c.pageWidth, n, l)
                        }
                    };
                    l.onerror = function() {
                        if (4 > Number($(this).attr("nl"))) {
                            console.log("on load image error");
                            var m = $(this).attr("src");
                            0 <= m.indexOf("https://azotacdn.studybymusic.com") && (m = m.replace("https://azotacdn.studybymusic.com", "https://wewiin.nyc3.cdn.digitaloceanspaces.com"));
                            var n = this;
                            setTimeout(function() {
                                console.log("load image :" + $(n).attr("src"));
                                $(n).attr("src", m + "?time=" + (new Date).getTime())
                            }, 400)
                        }
                        $(this).attr("nl", Number($(this).attr("nl")) + 1)
                    };
                    setTimeout(function() {
                        0 <= a.backgroundImage.indexOf("https://nextcdn.studybymusic.com") && (a.backgroundImage = a.backgroundImage.replace("https://nextcdn.studybymusic.com",
                            "https://239444185.e.cdneverest.net"));
                        l.src = a.backgroundImage
                    }, 400 * Number(this.pageCount))
                }
            else e = c.pageWidth, c.resizePage(a.id, e, 4 * e / 3, null);
            if (a.draw) {
                var h = new Image;
                $(h).attr("pageid", a.id);
                $(h).attr("nl", "1");
                h.onload = function(m) {
                    if (m = document.getElementById("canvas_" + parseInt($(l).attr("pageid")))) m.setAttribute("hasDraw", !0), m.getContext("2d").drawImage(h, 0, 0)
                };
                h.onerror = function() {
                    if (4 > Number($(this).attr("nl"))) {
                        console.log("on load image draw error");
                        var m = $(this).attr("src");
                        0 <= m.indexOf("https://azotacdn.studybymusic.com") &&
                            (m = m.replace("https://azotacdn.studybymusic.com", "https://wewiin.nyc3.cdn.digitaloceanspaces.com"));
                        var n = this;
                        setTimeout(function() {
                            console.log("load image draw :" + $(n).attr("src"));
                            $(n).attr("src", m + "?time=" + (new Date).getTime())
                        }, 400)
                    }
                    $(this).attr("nl", Number($(this).attr("nl")) + 1)
                };
                h.crossOrigin = "anonymous";
                setTimeout(function() {
                        0 <= a.draw.indexOf("https://nextcdn.studybymusic.com") && (a.draw = a.draw.replace("https://nextcdn.studybymusic.com", "https://239444185.e.cdneverest.net"));
                        h.src = a.draw
                    },
                    400 * Number(this.pageCount))
            } else(b = document.getElementById("canvas_" + parseInt($(l).attr("pageid")))) && b.setAttribute("hasDraw", !1);
            if (a.staticText && 0 < a.staticText.length)
                for (e = 0; e < a.staticText.length; e++) this.addStaticText(a.id, a.staticText[e].value, a.staticText[e].x, a.staticText[e].y);
            if (a.objText && 0 < a.objText.length)
                for (e = 0; e < a.objText.length; e++) this._addText(a.id, a.objText[e].value, a.objText[e].x, a.objText[e].y, a.objText[e].textStyle);
            this.pageCount++;
            this.pages.push(a)
        },
        exportJSON: function() {
            var a = {},
                c = [];
            a.pages = c;
            var b = $(".page");
            $(b).each(function(d) {
                d = {};
                var f = $(this).find(".canvas_draw")[0];
                d.width = f.width;
                d.height = f.height;
                d.id = Number($(this).attr("data"));
                console.log("export page " + f.pagetype + ":" + d.id + ":" + f.pageid);
                if (0 == f.pagetype) {
                    var g = $(this).find("img")[0];
                    d.backgroundImage = $(g).attr("src");
                    d.rotation = parseInt($(g).attr("rotation"))
                } else if (g = $(this).find("iframe")[0]) d.backgroundImage = g.src;
                else if (g = $(this).find("video")[0]) d.backgroundImage = g.src;
                var k = $(this).find(".page_objs_layer")[0],
                    l = $(k).find(".obj_static_text");
                d.staticText = [];
                for (g = 0; g < l.length; g++) {
                    var h = {};
                    h.x = parseInt($(l[g]).css("left"));
                    h.y = parseInt($(l[g]).css("top"));
                    $(l[g]).hasClass("wrong") ? h.value = "wrong" : h.value = "correct";
                    d.staticText.push(h)
                }
                k = $(k).find(".obj_text");
                d.objText = [];
                for (g = 0; g < k.length; g++) l = {}, l.x = parseInt($(k[g]).css("left")), l.y = parseInt($(k[g]).css("top")), l.value = $(k[g]).html(), l.textStyle = JSON.parse($(k[g]).attr("styleText").replaceAll("'", '"')), d.objText.push(l);
                if (0 == f.pagetype) try {
                    "true" ==
                    f.getAttribute("hasDraw").toString() && (d.draw = f.toDataURL("image/png"))
                } catch (m) {}
                c.push(d)
            });
            a.staticTextConfig = JSON.stringify(this.staticTextConfig);
            try {
                localStorage.setItem("staticTextConfig", JSON.stringify(this.staticTextConfig))
            } catch (d) {}
            a.comment = $("#mark_comment_txt").val();
            a.commentEmoji = [];
            b = $(".comment_emoji");
            for (var e = 0; e < b.length; e++) a.commentEmoji.push($(b[e]).attr("src"));
            b = $("#mark_number_txt").val();
            "\u0110" == b.trim() ? a.point = "1000" : "C\u0110" == b.trim() ? a.point = "1001" : "HT" == b.trim() ?
                a.point = "2000" : "CHT" == b.trim() ? a.point = "2001" : "HTT" == b.trim() ? a.point = "3000" : a.point = b;
            a.point = a.point.replaceAll(",", ".");
            if (void 0 == a.point || null == a.point || "" == a.point || isNaN(Number(a.point))) a.point = 0;
            a.hideMark = this.mnotedata.hideMark;
            cc.log("EXPORT JSON " + JSON.stringify(a));
            b = JSON.stringify(a);
            b=filterXSS(b);
           // b = b.replaceAll("<div>", "_div");
          //  b = b.replaceAll("</div>", "div_");
          //  b = b.replaceAll("<", "");
          //  b = b.replaceAll(">", "");
            try {
                a = JSON.parse(b);
            } catch (d) {
                return alert("D\u1eef li\u1ec7u b\u1ea1n nh\u1eadp kh\u00f4ng h\u1ee3p l\u1ec7 !"),
                    null
            }
            return a
        },
        updateSaveImageSuccess: function(a, c) {},
        updateSaveImage: function(a) {},
        updateAllImage: function() {},
        removeAllPage: function(a) {
            this.pageCount = 0;
            this.pages = [];
            $("mnote_pages").empty()
        },
        removePage: function(a) {},
        moveUpPage: function(a) {
            for (var c = document.getElementById("mnote_pages"), b = c.childNodes, e = -1, d = 0; d < b.length; d++) b[d].id == "page_" + a && (e = d);
            1 < e && (a = b[e - 1], b = b[e], $(a).hasClass("page") && c.insertBefore(b, a))
        },
        moveDownPage: function(a) {
            for (var c = document.getElementById("mnote_pages"), b = c.childNodes,
                    e = -1, d = 0; d < b.length; d++) b[d].id == "page_" + a && (e = d);
            e < b.length - 1 && (a = b[e + 1], b = b[e], $(a).hasClass("page") && c.insertBefore(a, b))
        },
        resizePage: function(a, c, b, e) {
            var d = $("#page_" + a);
            $("#page_" + a).css("width", c + "px");
            $("#page_" + a).css("height", b + "px");
            var f = document.getElementById("canvas_" + a),
                g = document.getElementById("canvasDraw_" + a);
            1 != f.isUpdateSize && (f.width = c, f.height = b, g.width = c, g.height = b, f.isUpdateSize = !0);
            if (Math.floor(f.height) != Math.floor(b) && (f.width = c, f.height = b, g.width = c, g.height = b, this.mnotedata.pages[a].draw)) {
                f =
                    this.mnotedata.pages[a].draw;
                f = f.replaceAll("https://cdn.azota.vn/api/download_public", "https://wewiin.nyc3.cdn.digitaloceanspaces.com");
                var k = new Image;
                $(k).attr("nl", "1");
                k.onload = function(h) {
                    (h = document.getElementById("canvas_" + a)) && h.getContext("2d").drawImage(k, 0, 0)
                };
                k.onerror = function() {
                    if (4 > Number($(this).attr("nl"))) {
                        console.log("on load image draw error");
                        var h = $(this).attr("src");
                        0 <= h.indexOf("https://azotacdn.studybymusic.com") && (h = h.replace("https://azotacdn.studybymusic.com", "https://wewiin.nyc3.cdn.digitaloceanspaces.com"));
                        0 <= h.indexOf("https://nextcdn.studybymusic.com") && (h = h.replace("https://nextcdn.studybymusic.com", "https://239444185.e.cdneverest.net"));
                        var m = this;
                        setTimeout(function() {
                            console.log("load image draw :" + $(m).attr("src"));
                            $(m).attr("src", h + "?time=" + (new Date).getTime())
                        }, 400)
                    }
                    $(this).attr("nl", Number($(this).attr("nl")) + 1)
                };
                k.crossOrigin = "anonymous";
                k.src = f
            }
            "edit" == this.mnotedata.mode && $("#mnote_mark").css("top", $(this.note_pages).height() + 40 + "px");
            0 <= navigator.userAgent.toLowerCase().indexOf("ipad") ?
                $(this.note_container).height($(this.note_pages).height() * this.pageScale + 1.5 * window.innerHeight + 500) : $(this.note_container).height($(this.note_pages).height() * this.pageScale + 1.5 * window.innerHeight);
            "edit" == this.mnotedata.mode && "web" == getOs() && $(this.note_container).height($(this.note_container).height() + 300);
            f = null;
            for (g = 0; g < this.mnotedata.pages.length; g++) this.mnotedata.pages[g].id == a && (f = this.mnotedata.pages[g]);
            g = 0;
            f && (g = isNaN(Number(f.rotation)) ? 0 : Number(f.rotation));
            d = $(d).find(".bt-edit-bg");
            $(d).css("display", "none");
            if (null != e) {
                $(e).attr("imgwidth", c);
                $(e).attr("imgheight", b);
                $(e).attr("rotation", g);
                this.rotateBgImage(e, g);
                "edit" == this.mnotedata.mode && $(d).css("display", "block");
                var l = this;
                $(d).on("touchend mouseup", function(h) {
                    "rotate" == $(this).attr("data") ? l.rotateBgPage(Number($(this).parent().attr("data"))) : l.moveUpPage(Number($(this).parent().attr("data")));
                    h.preventDefault();
                    h.stopPropagation()
                })
            }
        },
        rotateBgPage: function(a) {
            a = document.getElementById("image_bg_" + a);
            var c = parseInt($(a).attr("rotation"));
            c -= 90; - 360 >= c && (c = 0);
            this.rotateBgImage(a, c)
        },
        rotateBgImage: function(a, c) {
            var b = parseInt($(a).attr("imgwidth")),
                e = parseInt($(a).attr("imgheight"));
            $(a).css("transform", "rotate(" + c + "deg)");
            $(a).attr("rotation", c); - 90 == c || -270 == c ? e > b ? (a.height = b, a.width = Math.floor(b / (e / b))) : (a.width = e, a.height = Math.floor(e / (b / e))) : (a.width = b, a.height = e)
        },
        addCanvasEventListener: function(a) {
            var c = this;
            "edit" == this.mnotedata.mode && (is_touch_device() ? (a.addEventListener("touchstart", function(b) {
                    c.onCanvasTouchStart(b)
                }),
                a.addEventListener("touchmove", function(b) {
                    c.onCanvasTouchMove(b)
                }, !1), a.addEventListener("touchend", function(b) {
                    c.onCanvasTouchEnd(b)
                })) : (a.addEventListener("mousedown", function(b) {
                c.onCanvasTouchStart(b)
            }), a.addEventListener("mousemove", function(b) {
                c.onCanvasTouchMove(b)
            }, !1)))
        },
        onCanvasTouchStart: function(a) {
            cc.log("touch start");
            var c = a.currentTarget,
                b = this.getCoorTouchEvent(c, a);
            c.downing = !0;
            c.downx = b.x;
            c.downy = b.y;
            c.downclientx = b.clientX;
            c.downclienty = b.clientY;
            c.lastmoveclientx = b.clientX;
            c.lastmoveclienty =
                b.clientY;
            c.lastmovex = b.x;
            c.lastmovey = b.y;
            c.lastmovex1 = b.x;
            c.lastmovey1 = b.y;
            c.downtime = (new Date).getTime();
            c.movefar = !1;
            this.mode == this.MODE_NORMAL ? a.preventDefault() : this.mode == this.MODE_DRAWRING ? (b = c.getContext("2d"), b.moveTo(c.lastmovex, c.lastmovey), b.beginPath(), this.currBrush != this.BRUSH_MOVE && this.currBrush != this.BRUSH_TEXT && ($(".obj_text").css("pointer-events", "none"), $(".obj_static_text").css("pointer-events", "none")), a.preventDefault()) : this.mode == this.MODE_ENTER_TEXT ? a.preventDefault() :
                this.mode == this.MODE_EDIT_TEXT && a.preventDefault()
        },
        onCanvasTouchMove: function(a) {
            var c = a.currentTarget,
                b = document.getElementById("canvasDraw_" + c.pageid),
                e = this.getCoorTouchEvent(c, a);
            c.downing && (30 < Math.abs(e.x - c.downx) || 30 < Math.abs(e.y - c.downy)) && (c.movefar = !0);
            if (this.mode == this.MODE_NORMAL) c.lastmovex = e.x, c.lastmovey = e.y, c.lastmoveclientx = e.clientX, c.lastmoveclienty = e.clientY;
            else if (this.mode == this.MODE_DRAWRING) {
                var d = !1;
                a.touches && 1 < a.touches.length && (d = !0);
                this.currBrush != this.BRUSH_MOVE &&
                    this.currBrush != this.BRUSH_TEXT && c.downing && !d && (1 < Math.abs(e.x - c.lastmovex) || 1 < Math.abs(e.y - c.lastmovey)) && (ctx = this.currBrush == this.BRUSH_PEN || this.currBrush == this.BRUSH_ERASE ? c.getContext("2d") : b.getContext("2d"), ctx.lineCap = "round", ctx.lineJoin = "round", ctx.strokeMiterLimit = 1, ctx.globalAlpha = this.currDrawStyle.alpha, ctx.strokeStyle = this.currDrawStyle.strokeStyle, ctx.lineWidth = this.currDrawStyle.lineWidth, this.currBrush == this.BRUSH_PEN && (ctx.globalCompositeOperation = "source-over"), this.currBrush ==
                        this.BRUSH_ERASE && (ctx.globalCompositeOperation = "destination-out", ctx.lineWidth = 10 * this.currDrawStyle.lineWidth, ctx.lineWidth = 30 > ctx.lineWidth ? 30 : ctx.lineWidth), this.currBrush == this.BRUSH_PEN || this.currBrush == this.BRUSH_ERASE ? (ctx.beginPath(), is_touch_device() ? (ctx.moveTo(c.lastmovex1, c.lastmovey1), ctx.lineTo(e.x, e.y)) : (ctx.moveTo(c.lastmovex, c.lastmovey), ctx.quadraticCurveTo(c.lastmovex1, c.lastmovey1, (c.lastmovex1 + e.x) / 2, (c.lastmovey1 + e.y) / 2)), ctx.stroke()) : (ctx.clearRect(0, 0, c.width, c.height), this.currBrush ==
                            this.BRUSH_LINE && (ctx.beginPath(), ctx.moveTo(c.downx, c.downy), ctx.lineTo(e.x, e.y), ctx.stroke()), this.currBrush == this.BRUSH_RECTANGLE && (ctx.beginPath(), a = Math.min(c.downx, e.x), b = Math.min(c.downy, e.y), ctx.rect(a, b, Math.max(c.downx, e.x) - a, Math.max(c.downy, e.y) - b), ctx.stroke()), this.currBrush == this.BRUSH_CIRCLE && (ctx.beginPath(), ctx.arc(c.downx, c.downy, Math.floor(Math.sqrt((c.downx - e.x) * (c.downx - e.x) + (c.downy - e.y) * (c.downy - e.y))), 0, 2 * Math.PI), ctx.stroke()), this.currBrush == this.BRUSH_ARROW && (ctx.beginPath(),
                                ctx.moveTo(c.downx, c.downy), ctx.lineTo(e.x, e.y), ctx.stroke(), drawArrowhead(ctx, {
                                    x: c.downx,
                                    y: c.downy
                                }, {
                                    x: e.x,
                                    y: e.y
                                }, 3 * ctx.lineWidth))), c.lastmovex = c.lastmovex1, c.lastmovey = c.lastmovey1, c.lastmovex1 = e.x, c.lastmovey1 = e.y, c.lastmoveclientx = e.clientX, c.lastmoveclienty = e.clientY)
            } else this.mode == this.MODE_ENTER_TEXT ? (c.lastmovex = e.x, c.lastmovey = e.y, c.lastmoveclientx = e.clientX, c.lastmoveclienty = e.clientY, a.preventDefault()) : this.mode == this.MODE_EDIT_TEXT && a.preventDefault()
        },
        onCanvasTouchEnd: function(a) {
            cc.log("touch end");
            var c = a.currentTarget;
            this.mode == this.MODE_NORMAL ? (this.onCanvasEnd(c), a.preventDefault()) : this.mode == this.MODE_DRAWRING ? (this.onCanvasEnd(c), a.preventDefault()) : this.mode == this.MODE_ENTER_TEXT ? (this.onCanvasEnd(c), a.preventDefault(), a.stopPropagation()) : this.mode == this.MODE_EDIT_TEXT && (this.onCanvasEnd(c), a.preventDefault())
        },
        onCanvasEnd: function(a) {
            var c = this,
                b = (new Date).getTime();
            if (a.downing) {
                cc.log("onCanvasEnd " + a.lastmovex + ":" + a.downx + ":" + a.lastmovey + ":" + a.downy + ":" + this.mode + ":" + this.currBrush);
                cc.log("onCanvasEnd " + a.lastmoveclientx + ":" + a.downclientx + ":" + a.lastmoveclienty + ":" + a.downclienty + ":" + this.mode + ":" + this.currBrush);
                var e = !0,
                    d = this.mode;
                d == this.MODE_ENTER_TEXT && (is_touch_device() ? this.checkIsTouchTapCanvas(a) && (this.blurText(), this.setMode(this.MODE_DRAWRING), this.setBrushDraw(this.BRUSH_MOVE)) : (this.blurText(), this.setMode(this.MODE_DRAWRING)), e = !1);
                if (d == this.MODE_DRAWRING) {
                    this.currBrush == this.BRUSH_TEXT && (is_touch_device() ? this.checkIsTouchTapCanvas(a) && this.addText(a.index,
                        a.lastmovex, a.lastmovey) : this.addText(a.index, a.lastmovex, a.lastmovey), e = !1);
                    this.currBrush == this.BRUSH_ERASE && (e = !1);
                    this.currBrush == this.BRUSH_PEN && (e = !1, a.setAttribute("hasDraw", !0));
                    var f = document.getElementById("canvasDraw_" + a.pageid);
                    d = a.getContext("2d");
                    f.getContext("2d").clearRect(0, 0, a.width, a.height);
                    d.lineCap = "round";
                    d.lineJoin = "round";
                    d.strokeMiterLimit = 10;
                    d.shadowColor = "rgba(0,0,0,.5)";
                    d.globalAlpha = this.currDrawStyle.alpha;
                    d.strokeStyle = this.currDrawStyle.strokeStyle;
                    d.lineWidth = this.currDrawStyle.lineWidth;
                    d.globalCompositeOperation = "source-over";
                    this.currBrush == this.BRUSH_LINE && (d.beginPath(), d.moveTo(a.downx, a.downy), d.lineTo(a.lastmovex1, a.lastmovey1), d.stroke(), a.setAttribute("hasDraw", !0), e = !1);
                    this.currBrush == this.BRUSH_RECTANGLE && (d.beginPath(), e = Math.min(a.downx, a.lastmovex1), f = Math.min(a.downy, a.lastmovey1), d.rect(e, f, Math.max(a.downx, a.lastmovex1) - e, Math.max(a.downy, a.lastmovey1) - f), d.stroke(), a.setAttribute("hasDraw", !0), e = !1);
                    this.currBrush == this.BRUSH_CIRCLE && (d.beginPath(), d.arc(a.downx,
                        a.downy, Math.floor(Math.sqrt((a.downx - a.lastmovex1) * (a.downx - a.lastmovex1) + (a.downy - a.lastmovey1) * (a.downy - a.lastmovey1))), 0, 2 * Math.PI), d.stroke(), a.setAttribute("hasDraw", !0));
                    this.currBrush == this.BRUSH_ARROW && (d.beginPath(), d.moveTo(a.downx, a.downy), d.lineTo(a.lastmovex1, a.lastmovey1), d.stroke(), drawArrowhead(d, {
                        x: a.downx,
                        y: a.downy
                    }, {
                        x: a.lastmovex1,
                        y: a.lastmovey1
                    }, 3 * d.lineWidth), a.setAttribute("hasDraw", !0));
                    $(".obj_text").css("pointer-events", "all");
                    $(".obj_static_text").css("pointer-events", "all")
                }
                e &&
                    (d = !1, is_touch_device() ? 150 > b - a.downtime && 0 < a.downy && 0 < a.downx && 0 < a.lastmovex && 0 < a.lastmovey && 13 > Math.abs(a.lastmoveclientx - a.downclientx) && 13 > Math.abs(a.lastmoveclienty - a.downclienty) && (d = !0) : d = !0, d ? void 0 != a.endtime ? 200 > b - a.endtime ? (a.tapCount++, cc.log(a.tapCount + " multi click canvas " + a.index + ":" + a.endx + ":" + a.endy), 2 == a.tapCount && this.doubleClickCanvas(a)) : a.tapCount = 1 : a.tapCount = 1 : a.tapCount = 0, 1 == a.tapCount && setTimeout(function() {
                        1 == a.tapCount && c.clickCanvas(a)
                    }, 200));
                a.endtime = b;
                a.endx = a.lastmovex;
                a.endy = a.lastmovey;
                a.endmovefar = a.movefar;
                a.downing = !1;
                a.downx = -1;
                a.downy = -1;
                a.lastmovex = -1;
                a.lastmovey = -1;
                a.downtime = 0;
                a.movefar = !1
            }
        },
        checkIsTouchTapCanvas: function(a) {
            return 150 > (new Date).getTime() - a.downtime && 0 < a.downy && 0 < a.downx && 0 < a.lastmovex && 0 < a.lastmovey && 13 > Math.abs(a.lastmoveclientx - a.downclientx) && 13 > Math.abs(a.lastmoveclienty - a.downclienty) ? !0 : !1
        },
        clickCanvas: function(a) {
            cc.log("click canvas " + a.index + ":" + a.endx + ":" + a.endy + ":" + this.staticTextConfig.correctWidth / 2);
            this.mode == this.MODE_NORMAL &&
                this.addStaticText(a.index, "correct", a.endx - 30, a.endy - this.staticTextConfig.correctHeight / 2);
            this.mode == this.MODE_DRAWRING && (this.currBrush == this.BRUSH_TEXT || a.endmovefar || this.addStaticText(a.index, "correct", a.endx - 30, a.endy - this.staticTextConfig.correctHeight / 2))
        },
        doubleClickCanvas: function(a) {
            cc.log("double click canvas " + a.index + ":" + a.endx + ":" + a.endy);
            this.mode == this.MODE_NORMAL && this.addStaticText(a.index, "wrong", a.endx - 30, a.endy - this.staticTextConfig.wrongHeight / 2);
            this.mode == this.MODE_DRAWRING &&
                (this.currBrush == this.BRUSH_TEXT || a.endmovefar || this.addStaticText(a.index, "wrong", a.endx - 30, a.endy - this.staticTextConfig.wrongHeight / 2))
        },
        getCoorTouchCanvas: function(a, c) {
            var b = c.clientX,
                e = c.clientY,
                d = a.getBoundingClientRect();
            b = Math.floor((b - d.left) * ($(a).width() / d.width));
            e = Math.floor((e - d.top) * ($(a).height() / d.height));
            return {
                x: b,
                y: e
            }
        },
        getCoorTouchEvent: function(a, c) {
            if (c.touches) {
                if (1 > c.touches.length) return {
                    x: 0,
                    y: 0
                };
                var b = c.touches[c.touches.length - 1],
                    e = b.clientX;
                b = b.clientY;
                var d = a.getBoundingClientRect(),
                    f = Math.floor((e - d.left) * ($(a).width() / d.width));
                d = Math.floor((b - d.top) * ($(a).height() / d.height))
            } else e = c.clientX, b = c.clientY, d = a.getBoundingClientRect(), f = Math.floor((e - d.left) * ($(a).width() / d.width)), d = Math.floor((b - d.top) * ($(a).height() / d.height));
            return {
                clientX: e,
                clientY: b,
                x: f,
                y: d
            }
        },
        getCoorTouch: function(a) {
            if (a.touches && 1 == a.touches.length) {
                var c = a.touches[a.touches.length - 1].clientX;
                a = a.touches[a.touches.length - 1].clientY
            } else c = a.clientX, a = a.clientY;
            return {
                clientX: c,
                clientY: a,
                x: c,
                y: a
            }
        },
        showMenuNormal: function() {
            $("#mnote_hold_bt").css("display",
                "flex");
            $("#mnote_setting_bt").css("display", "block");
            $("#mnote_help").css("display", "block");
            $(".help_text").css("display", "block")
        },
        hideMenuNormal: function() {
            $("#mnote_hold_bt").css("display", "none");
            $("#mnote_setting_bt").css("display", "none");
            $(".help_text").css("display", "none")
        },
        setMode: function(a) {
            a != this.mode && (this.hideMenuDraw(), this.hideMenuText(), this.hideMenuNormal(), a == this.MODE_NORMAL && (this.showMenuNormal(), this.blurText(), is_touch_device() || $("#mnote_pages").css("cursor", "default")),
                a == this.MODE_ENTER_TEXT && this.showMenuText(), a == this.MODE_DRAWRING && this.showMenuDraw(), this.mode = a)
        },
        enterDrawingMode: function() {
            this.isDrawingMode = !0;
            this.mode = this.MODE_DRAWRING;
            this.showMenuDraw()
        },
        exitDrawingMode: function() {
            this.isDrawingMode = !1;
            this.mode = this.MODE_NORMAL;
            $(".help_text").css("display", "block");
            this.hideMenuDraw();
            $("#mnote_hold_bt").css("display", "flex")
        },
        showMenuDraw: function() {
            is_touch_device() ? $("#mnote_menu_bottom").css("display", "block") : ($("#mnote_menu_draw").find("span").first(),
                $("#mnote_menu_draw").css("display", "flex"), gsap.fromTo(".btn-menu-draw", {
                    scale: 1
                }, {
                    scale: 1,
                    duration: .1,
                    ease: "expo.out"
                }), this.currBrush == this.BRUSH_MOVE && this.setBrushDraw(this.BRUSH_PEN));
            this.currBrush == this.BRUSH_TEXT && this.setBrushDraw(this.BRUSH_MOVE)
        },
        hideMenuDraw: function() {
            is_touch_device() ? $("#mnote_menu_bottom").css("display", "none") : (clearInterval(this.ivtInvisibleSpanMenuDraw), $("#mnote_menu_draw").css("display", "none"))
        },
        setBrushDraw: function(a) {
            this.currBrush = a;
            is_touch_device() || (a ==
                this.BRUSH_PEN || a == this.BRUSH_LINE || a == this.BRUSH_RECTANGLE || a == this.BRUSH_CIRCLE || a == this.BRUSH_ARROW ? $("#mnote_pages").css("cursor", "url('images/pen.png') 0 20, auto") : a == this.BRUSH_ERASE ? $("#mnote_pages").css("cursor", "url('images/erase.png') 0 20, auto") : a == this.BRUSH_TEXT ? $("#mnote_pages").css("cursor", "url('images/text.png') 0 20, auto") : $("#mnote_pages").css("cursor", "default"));
            this.setDrawStyle(this.currDrawStyle)
        },
        showMenuColor: function() {
            $(this.mnote_menu_color).css("display", "block");
            gsap.fromTo(this.menu_color_content, {
                scale: .1
            }, {
                scale: 1,
                duration: .15,
                ease: "expo.out"
            })
        },
        hideMenuColor: function() {
            $(this.mnote_menu_color).css("display", "none")
        },
        setDrawStyle: function(a) {
            cc.log("setDrawStyle " + JSON.stringify(a));
            a.lineWidth && (this.currDrawStyle.lineWidth = a.lineWidth);
            a.strokeStyle && (this.currDrawStyle.strokeStyle = a.strokeStyle);
            a.alpha && (this.currDrawStyle.alpha = a.alpha);
            cc.log("setDrawStyle " + JSON.stringify(this.currDrawStyle) + ":" + this.currBrush);
            $("#btn_thick_preview").css("opacity",
                this.currDrawStyle.alpha);
            var c = this;
            $(".btn-content-color").each(function(b) {
                $(this).empty();
                $(this).attr("data") == c.currDrawStyle.strokeStyle && $(this).append($('<i class="material-icons">check</i>'))
            });
            $("#btn_draw_color").find("svg").css("fill", this.currDrawStyle.strokeStyle);
            $("#btn_thick_preview").css("background-color", this.currDrawStyle.strokeStyle);
            $(this.thickSliderInput).val(this.currDrawStyle.lineWidth);
            $("#btn_thick_preview").css("width", this.currDrawStyle.lineWidth + 5 + "px");
            $("#btn_thick_preview").css("height",
                this.currDrawStyle.lineWidth + 5 + "px");
            this.setActiveButton(this.btnDrawPen, !1);
            this.setActiveButton(this.btnDrawErase, !1);
            this.setActiveButton(this.btnDrawText, !1);
            this.setActiveButton(this.btnDrawMove, !1);
            this.setActiveButton(this.contentBushPen, !1);
            this.setActiveButton(this.contentBushLine, !1);
            this.setActiveButton(this.contentBushRect, !1);
            this.setActiveButton(this.contentBushCircle, !1);
            this.setActiveButton(this.contentBushArrow, !1);
            $(".btn-option-draw").css("background-color", "black");
            $(".btn-option-draw").find("svg").css("fill",
                "#888888");
            $(".btn-option-draw").find("svg").css("color", "#888888");
            $(".btn-option-draw").find("i").css("color", "#888888");
            $("#option_brush").css("display", "none");
            this.currBrush == this.BRUSH_PEN && (this.setActiveButton(this.btnDrawPen, !0, this.currDrawStyle.strokeStyle), this.setActiveButton(this.contentBushPen, !0, this.currDrawStyle.strokeStyle), $("#btn_option_pen").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_pen").find("svg").css("fill", "white"), $("#btn_option_pen").find("i").css("color",
                "white"), $("#option_brush").css("display", "block"), $("#btn_option_brush_pen").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_brush_pen").find("svg").css("fill", "white"), $("#btn_option_brush_pen").find("svg").css("color", "white"), $("#btn_option_brush_pen").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_LINE && (this.setActiveButton(this.btnDrawPen, !0, this.currDrawStyle.strokeStyle), this.setActiveButton(this.contentBushLine, !0, this.currDrawStyle.strokeStyle), $("#btn_option_pen").css("background-color",
                this.currDrawStyle.strokeStyle), $("#btn_option_pen").find("svg").css("fill", "white"), $("#btn_option_pen").find("i").css("color", "white"), $("#option_brush").css("display", "block"), $("#btn_option_brush_line").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_brush_line").find("svg").css("fill", "white"), $("#btn_option_brush_line").find("svg").css("color", "white"), $("#btn_option_brush_line").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_RECTANGLE && (this.setActiveButton(this.btnDrawPen,
                !0, this.currDrawStyle.strokeStyle), this.setActiveButton(this.contentBushRect, !0, this.currDrawStyle.strokeStyle), $("#btn_option_pen").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_pen").find("svg").css("fill", "white"), $("#btn_option_pen").find("i").css("color", "white"), $("#option_brush").css("display", "block"), $("#btn_option_brush_rect").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_brush_rect").find("svg").css("fill", "white"), $("#btn_option_brush_rect").find("svg").css("color",
                "white"), $("#btn_option_brush_rect").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_CIRCLE && (this.setActiveButton(this.btnDrawPen, !0, this.currDrawStyle.strokeStyle), this.setActiveButton(this.contentBushCircle, !0, this.currDrawStyle.strokeStyle), $("#btn_option_pen").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_pen").find("svg").css("fill", "white"), $("#btn_option_pen").find("i").css("color", "white"), $("#option_brush").css("display", "block"), $("#btn_option_brush_circle").css("background-color",
                this.currDrawStyle.strokeStyle), $("#btn_option_brush_circle").find("svg").css("fill", "white"), $("#btn_option_brush_circle").find("svg").css("color", "white"), $("#btn_option_brush_circle").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_ARROW && (this.setActiveButton(this.btnDrawPen, !0, this.currDrawStyle.strokeStyle), this.setActiveButton(this.contentBushArrow, !0, this.currDrawStyle.strokeStyle), $("#btn_option_pen").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_pen").find("svg").css("fill",
                "white"), $("#btn_option_pen").find("i").css("color", "white"), $("#option_brush").css("display", "block"), $("#btn_option_brush_arrow").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_brush_arrow").find("svg").css("fill", "white"), $("#btn_option_brush_arrow").find("svg").css("color", "white"), $("#btn_option_brush_arrow").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_ERASE && (this.setActiveButton(this.btnDrawErase, !0, this.currDrawStyle.strokeStyle), $("#btn_option_erase").css("background-color",
                this.currDrawStyle.strokeStyle), $("#btn_option_erase").find("svg").css("fill", "white"), $("#btn_option_erase").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_TEXT && (this.setActiveButton(this.btnDrawText, !0, this.currDrawStyle.strokeStyle), $("#btn_option_text").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_text").find("svg").css("fill", "white"), $("#btn_option_text").find("i").css("color", "white"));
            this.currBrush == this.BRUSH_MOVE && (this.setActiveButton(this.btnDrawMove,
                !0, this.currDrawStyle.strokeStyle), $("#btn_option_move").css("background-color", this.currDrawStyle.strokeStyle), $("#btn_option_move").find("svg").css("fill", "white"), $("#btn_option_move").find("i").css("color", "white"));
            $("#thick_slider").find(".thumb").css("display", "block");
            $("#thick_slider").find(".thumb").css("opacity", .7);
            $("#thick_slider").find(".thumb").css("background-color", this.currDrawStyle.strokeStyle);
            $("#color_preview").css("background-color", this.currDrawStyle.strokeStyle);
            $("#color_preview").css("opacity",
                this.currDrawStyle.alpha);
            $("#color_preview").css("width", this.currDrawStyle.lineWidth + 5 + "px");
            $("#color_preview").css("height", this.currDrawStyle.lineWidth + 5 + "px");
            $("#btn_hold_draw").css("background-color", this.currDrawStyle.strokeStyle);
            $("#mnote_hold_bt").find("span").css("color", this.currDrawStyle.strokeStyle);
            $(this.btnDrawFinish).css("color", this.currDrawStyle.strokeStyle);
            a = this.currDrawStyle.lineWidth;
            $("#preview_draw_bt").css("width", 3 + a + "px");
            $("#preview_draw_bt").css("height", 3 + a + "px");
            $("#preview_draw_bt").css("background-color", this.currDrawStyle.strokeStyle);
            c = this;
            $(".btn-color-bottom-small").each(function(b) {
                $(this).empty();
                $(this).parent().css("border", "none");
                $(this).attr("data") == c.currDrawStyle.strokeStyle && ($(this).append($('<i class="material-icons">check</i>')), $(this).parent().css("border", "solid 1px #CCCCCC"))
            });
            try {
                localStorage && localStorage.setItem("drawStyle", JSON.stringify(this.currDrawStyle))
            } catch (b) {}
        },
        setActiveButton: function(a, c, b) {
            c ? ($(a).removeClass($(a).attr("activeColor")),
                $(a).addClass(b), $(a).find("svg").css("fill", "white"), $(a).find("svg").css("color", "white"), $(a).find("i").css("color", "white"), $(a).attr("activeColor", b)) : ($(a).removeClass($(a).attr("activeColor")), $(a).addClass("white"), $(a).find("svg").css("fill", "#666666"), $(a).find("svg").css("color", "#666666"), $(a).find("i").css("color", "#666666"), $(a).attr("activeColor", "white"))
        },
        lastXStaticTextAdded: -1,
        lastYStaticTextAdded: -1,
        addStaticText: function(a, c, b, e) {
            var d = document.getElementById("canvas_" + a).height,
                f = document.getElementById("canvas_" + a).width;
            b = Math.abs(b);
            e = Math.abs(e);
            0 > b || 0 > e || b > f - 40 || e > d - 40 || 2 > Math.abs(b - this.lastXStaticTextAdded) && 2 > Math.abs(e - this.lastYStaticTextAdded) || (d = "", "wrong" == c.toLowerCase() ? this.staticTextConfig.useWrongText && (d = this.staticTextConfig.textWrong) : this.staticTextConfig.useCorrectText && (d = this.staticTextConfig.textCorrect), d = $("<span pageid=" + a + ' class="obj_static_text"><span>' + d + "</span></span>"), f = $("#page_" + a).find(".page_objs_layer")[0], $(f).append(d), $(d).css("position",
                "absolute"), $(d).attr("pageid", a), $(d).css("font-family", this.staticTextConfig.fontText), $(d).css("font-size", this.staticTextConfig.fontSize + "px"), $(d).css("text-align", "center"), $(d).css("font-weight", "bold"), $(d).css("min-width", "50px"), $(d).css("min-height", "50px"), $(d).css("text-shadow", "1px 1px 1px #827e7e"), $(d).css("left", Math.floor(b) + "px"), $(d).css("top", Math.floor(e) + "px"), this.lastXStaticTextAdded = b, this.lastYStaticTextAdded = e, "wrong" == c.toLowerCase() ? (this.countWrong++, $(d).addClass("wrong"),
                a = this.staticTextConfig.fontColor, c = $('<img class="wrong_img" src="' + this.staticTextConfig.urlImgWrong + '" width="30" height="30"/>'), $(d).append($(c)), this.staticTextConfig.useWrongText ? ($(c).css("display", "none"), $(d).find("span").css("display", "block")) : ($(c).css("display", "block"), $(d).find("span").css("display", "none"))) : (this.countRight++, $(d).addClass("correct"), a = this.staticTextConfig.fontColor, c = $('<img class="correct_img" src="' + this.staticTextConfig.urlImgCorrect + '" width="30" height="30" />'),
                $(d).append($(c)), this.staticTextConfig.useCorrectText ? ($(c).css("display", "none"), $(d).find("span").css("display", "block")) : ($(c).css("display", "block"), $(d).find("span").css("display", "none"))), this.updateMark(), $(d).css("color", a), "edit" == this.mnotedata.mode && $(d).css("pointer-events", "all"), this.moveable(d))
        },
        moveable: function(a) {
            if ("edit" == this.mnotedata.mode) {
                var c = this;
                $(a).on("touchstart mousedown", function(b) {
                    if (!(b.touches && 1 < b.touches.length)) {
                        var e = c.getCoorTouch(b);
                        $(this).attr("downx",
                            Math.floor(e.x));
                        $(this).attr("downy", Math.floor(e.y));
                        $(this).attr("clientx", Math.floor(e.clientX));
                        $(this).attr("clienty", Math.floor(e.clientY));
                        $(this).attr("lastx", Math.floor(e.x));
                        $(this).attr("lasty", Math.floor(e.y));
                        $(this).attr("downtime", (new Date).getTime());
                        $(".obj_down").removeClass("obj_down");
                        $(this).addClass("obj_down");
                        c.mode != c.MODE_ENTER_TEXT && ($("#bt_trash").css("display", "block"), $("#bt_trash").css("opacity", .7));
                        $(a).hasClass("obj_static_text") && (b.preventDefault(), b.stopPropagation(),
                            c.setObjsActive(this))
                    }
                });
                $(a).on("touchmove", function(b) {
                    b.touches && 1 < b.touches.length || (c.getCoorTouch(b), c._moveObj(b.currentTarget, b), b.preventDefault(), b.stopPropagation())
                });
                $(a).on("touchend mouseup", function(b) {
                    c._endObj(this, b);
                    b.preventDefault();
                    b.stopPropagation()
                })
            }
        },
        _moveObj: function(a, c) {
            if ("true" == $(a).hasClass("obj_down").toString()) {
                var b = this.getCoorTouch(c),
                    e = parseInt($(a).attr("downx")),
                    d = parseInt($(a).attr("downy"));
                if (5 < Math.abs(b.x - e) || 5 < Math.abs(b.y - d)) {
                    var f = this.getCoorTouchEvent(a.parentNode,
                        c);
                    $(a).css("left", Math.floor(f.x - $(a).width() / 2) + "px");
                    $(a).css("top", Math.floor(f.y - $(a).height() / 2) + "px")
                }
                $(a).attr("lastx", b.x);
                $(a).attr("lasty", b.y);
                (10 < Math.abs(b.clientX - e) || 10 < Math.abs(b.clientY - d)) && $(a).attr("movefar", !0);
                $(a).attr("clientx", Math.floor(b.clientX));
                $(a).attr("clienty", Math.floor(b.clientY));
                b = parseInt($(a).attr("clientx"));
                e = parseInt($(a).attr("clienty"));
                b > self.appWidth / 2 - 30 && b < self.appWidth / 2 + 30 && 70 > e ? $("#bt_trash").css("opacity", 1) : $("#bt_trash").css("opacity", .7)
            }
        },
        _endObj: function(a, c) {
            if ("true" == $(a).hasClass("obj_down").toString()) {
                parseInt($(a).attr("downx"));
                parseInt($(a).attr("downy"));
                parseInt($(a).attr("lastx"));
                var b = parseInt($(a).attr("lasty")),
                    e = parseInt($(a).attr("clientx")),
                    d = parseInt($(a).attr("clienty"));
                if ("true" != $(a).attr("movefar") && ($(a).hasClass("obj_text") && !$(a).hasClass("focusing") && (this.focusText(a), c.preventDefault(), c.stopPropagation()), $(a).hasClass("obj_static_text") && $(a).hasClass("correct"))) {
                    $(a).removeClass("correct");
                    $(a).addClass("wrong");
                    $(a).find("span").html(this.staticTextConfig.textWrong);
                    var f = $(a).find("img");
                    0 < f.length && ($(f[0]).attr("src", this.staticTextConfig.urlImgWrong), $(f[0]).removeClass("correct_img"), $(f[0]).addClass("wrong_img"));
                    this.staticTextConfig.useWrongText ? ($(a).find("span").css("display", "block"), $(a).find("img").css("display", "none")) : ($(a).find("span").css("display", "none"), $(a).find("img").css("display", "block"));
                    this.countRight--;
                    this.countWrong++;
                    this.updateMark()
                }
                $(a).attr("movefar", !1);
                $("#bt_trash").css("display",
                    "none");
                cc.log("pos up " + e + ":" + d + ":" + this.appWidth + ":" + this.appHeight / 2 + ":" + b);
                if (is_touch_device()) {
                    if (e > this.appWidth / 2 - 30 && e < this.appWidth / 2 + 30 && 70 > d) {
                        $(a).remove();
                        this.updateMark();
                        c.preventDefault();
                        c.stopPropagation();
                        return
                    }
                } else if (0 < e && 80 > e && d < this.appHeight / 2 + 30 && d > this.appHeight / 2 - 30) {
                    $(a).remove();
                    this.updateMark();
                    c.preventDefault();
                    c.stopPropagation();
                    return
                }
                b = parseInt($(a).css("left"));
                e = parseInt($(a).css("top"));
                d = document.getElementById("canvas_" + parseInt($(a).attr("pageid"))).height;
                if (0 > b || 0 > e || b > this.pageWidth - 40 || e > d - 40) $(a).remove(), this.updateMark(), c.preventDefault(), c.stopPropagation();
                b = parseInt($(a).attr("lastTouchTime"));
                if ($(a).hasClass("obj_static_text")) {
                    var g = (new Date).getTime();
                    if (!isNaN(b) && (e = is_touch_device() ? 300 : 700, g - b < e)) {
                        $(a).hasClass("wrong") ? this.countWrong-- : this.countRight--;
                        $(a).remove();
                        this.updateMark();
                        c.preventDefault();
                        c.stopPropagation();
                        return
                    }
                    this.inactiveAllObj()
                }
                $(a).attr("lastTouchTime", g);
                $(".obj_down").removeClass("obj_down")
            }
        },
        setObjsActive: function(a) {
            this.inactiveAllObj();
            $(a).addClass("obj_active");
            $(a).css("border", "2px dashed")
        },
        inactiveAllObj: function() {
            $(".obj_active").css("border", "none");
            $(".obj_active").removeClass("obj_active")
        },
        initMenuBottom: function() {
            var a = "green red purple #3f51b5 teal #03a9f4 yellow #cddc39 cyan #ffc107 #795548 #424242".split(" ");
            $("#menu_bottom_2_content").empty();
            for (var c = 0; c < a.length; c++) {
                var b = $('<div class="btn-color-bottom"><div data="' + a[c] + '" class="btn-color-bottom-small  btn-small btn-floating btn-flat waves-effect waves-light" style="background-color:' +
                    a[c] + '"></div></div>');
                $("#menu_bottom_2_content").append($(b))
            }
            var e = this;
            $(".btn-color-bottom-small").click(function(d) {
                e.setDrawStyle({
                    strokeStyle: $(this).attr("data")
                })
            });
            this.canvas_slider = document.getElementById("canvas_slider");
            this.createCanvasSlider($("#menu_bottom_slider"), "#888888", this.minLineWidth, this.maxLineWidth, this.currDrawStyle.lineWidth);
            $(".btn-option-draw").click(function(d) {
                d = $(this).attr("data");
                "pen" == d && e.setBrushDraw(e.BRUSH_PEN);
                "erase" == d && e.setBrushDraw(e.BRUSH_ERASE);
                "move" == d && e.setBrushDraw(e.BRUSH_MOVE);
                "text" == d && e.setBrushDraw(e.BRUSH_TEXT);
                "line" == d && e.setBrushDraw(e.BRUSH_LINE);
                "rect" == d && e.setBrushDraw(e.BRUSH_RECTANGLE);
                "circle" == d && e.setBrushDraw(e.BRUSH_CIRCLE);
                "arrow" == d && e.setBrushDraw(e.BRUSH_ARROW)
            });
            $("#menu_bottom_close").on("touchstart mouseup", function(d) {
                e.setMode(e.MODE_NORMAL);
                d.stopPropagation();
                d.preventDefault()
            });
            $("#mnote_menu_bottom").on("touchstart", function(d) {})
        },
        createCanvasSlider: function(a, c, b, e, d) {
            var f = this,
                g = $(a).find("canvas");
            if (!(1 > g.length)) {
                var k = g[0];
                g = $(a).find(".thumb");
                if (!(1 > g.length)) {
                    var l = g[0];
                    g = k.getContext("2d");
                    g.strokeStyle = c;
                    g.lineWidth = 4;
                    k.min = b;
                    k.max = e;
                    g.fillStyle = c;
                    g.moveTo(4, canvas_slider.height / 2);
                    g.beginPath();
                    g.lineCap = "round";
                    g.strokeMiterLimit = 2;
                    g.lineTo(k.width, Math.floor(k.height / 2 - 5));
                    g.lineTo(k.width, Math.floor(k.height / 2 + 5));
                    g.lineTo(4, k.height / 2);
                    g.closePath();
                    g.fill();
                    g.stroke();
                    this.setCanvasSliderValue(a, d);
                    is_touch_device() ? (k.addEventListener("touchstart", function(h) {
                        f._updateThumbSlider(a,
                            h);
                        h.stopPropagation();
                        h.preventDefault()
                    }), k.addEventListener("touchmove", function(h) {
                        f._updateThumbSlider(a, h)
                    }), $(l).on("touchstart", function(h) {
                        f._updateThumbSlider(a, h);
                        h.stopPropagation();
                        h.preventDefault()
                    }), $(l).on("touchmove", function(h) {
                        f._updateThumbSlider(a, h);
                        h.stopPropagation();
                        h.preventDefault()
                    })) : (k.addEventListener("mousedown", function(h) {
                        k.isMouseDown = !0;
                        f._updateThumbSlider(a, h);
                        h.stopPropagation();
                        h.preventDefault()
                    }), k.addEventListener("mousemove", function(h) {
                        1 == k.isMouseDown &&
                            f._updateThumbSlider(a, h)
                    }), k.addEventListener("mouseup", function(h) {
                        k.isMouseDown = !1;
                        $(l).attr("mousedown", "false")
                    }), $(l).css("pointer-events", "none"))
                }
            }
        },
        setCanvasSliderValue: function(a, c) {
            var b = $(a).find("canvas");
            if (!(1 > b.length)) {
                b = b[0];
                var e = $(a).find(".thumb");
                if (!(1 > e.length)) {
                    e = e[0];
                    c > b.max && (c = max);
                    c < b.min && (c = min);
                    var d = (c - b.min) / (b.max - b.min),
                        f = 3 + 20 * d;
                    $(e).css("width", f + "px");
                    $(e).css("height", f + "px");
                    $(e).css("top", Math.floor(b.height - f) / 2 + "px");
                    $(e).css("left", Math.floor(b.width * d) -
                        f / 2 + "px");
                    b.value = c;
                    b == this.canvas_slider && this.setDrawStyle({
                        lineWidth: c
                    });
                    b == this.slider_text_size && this.setTextStyle({
                        size: c
                    })
                }
            }
        },
        _updateThumbSlider: function(a, c) {
            var b = $(a).find("canvas");
            if (!(1 > b.length)) {
                b = b[0];
                var e;
                if (e = is_touch_device() ? c.touches[0] : {
                        clientX: c.clientX
                    }) {
                    var d = b.getBoundingClientRect();
                    e = e.clientX - d.left;
                    0 > e && (e = 0);
                    e > b.width && (e = b.width);
                    this.setCanvasSliderValue(a, Math.floor(b.min + (b.max - b.min) * e / b.width))
                }
            }
        },
        initMenuText: function() {
            var a = "green red purple #3f51b5 teal #03a9f4 yellow #cddc39 cyan #ffc107 #795548 #424242".split(" ");
            $("#menu_text_color_content").empty();
            for (var c = 0; c < a.length; c++) {
                var b = $('<div class="btn-color-text"><div data="' + a[c] + '" class="btn-color-text-small  btn-small btn-floating btn-flat waves-effect waves-light" style="background-color:' + a[c] + '"></div></div>');
                $("#menu_text_color_content").append($(b))
            }
            this.slider_text_size = document.getElementById("slider_text_size");
            this.createCanvasSlider("#menu_text_slider", "black", this.minTextSize, this.maxTextSize, this.currTextStyle.size);
            var e = this;
            is_touch_device() ?
                ($(".btn-color-text-small").on("touchstart", function(d) {
                        1 < d.touches.length || ($(this).attr("downx", d.touches[0].clientX), $(this).attr("downy", d.touches[0].clientY), $(this).attr("movex", d.touches[0].clientX), $(this).attr("movey", d.touches[0].clientY))
                    }), $(".btn-color-text-small").on("touchmove", function(d) {
                        1 < d.touches.length || ($(this).attr("movex", d.touches[0].clientX), $(this).attr("movey", d.touches[0].clientY))
                    }), $(".btn-color-text-small").on("touchend", function(d) {
                        var f = parseInt($(this).attr("downx")),
                            g = parseInt($(this).attr("downy")),
                            k = parseInt($(this).attr("movex")),
                            l = parseInt($(this).attr("movey"));
                        13 > Math.abs(f - k) && 13 > Math.abs(g - l) && e.setTextStyle({
                            color: $(this).attr("data")
                        });
                        d.stopPropagation();
                        d.preventDefault()
                    }), $("#btn_option_align").on("touchend", function(d) {
                        "left" == e.currTextStyle.align ? e.setTextStyle({
                            align: "center"
                        }) : "center" == e.currTextStyle.align ? e.setTextStyle({
                            align: "right"
                        }) : "right" == e.currTextStyle.align ? e.setTextStyle({
                            align: "left"
                        }) : (d.stopPropagation(), d.preventDefault())
                    }),
                    $("#btn_option_fill").on("touchend", function(d) {
                        e.currTextStyle.fill ? e.setTextStyle({
                            fill: !1
                        }) : e.setTextStyle({
                            fill: !0
                        });
                        d.stopPropagation();
                        d.preventDefault()
                    }), $("#btn_option_font").on("touchend", function(d) {
                        isDomVisile(document.getElementById("menu_text_font")) ? $("#menu_text_font").css("display", "none") : $("#menu_text_font").css("display", "block");
                        d.stopPropagation();
                        d.preventDefault()
                    }), $(".font_chu").on("touchstart", function(d) {
                        e.setTextStyle({
                            font: $(this).attr("data")
                        });
                        d.stopPropagation();
                        d.preventDefault()
                    }),
                    $("#menu_text_option").on("touchstart mousedown", function(d) {
                        d.preventDefault()
                    }), $("#mnote_menu_text").on("touchend mouseup", function(d) {
                        d.stopPropagation();
                        d.preventDefault()
                    }), $("#menu_text_close").on("touchend", function(d) {
                        e.blurText();
                        e.setMode(e.MODE_DRAWRING);
                        d.stopPropagation();
                        d.preventDefault()
                    }), $("#btn_text_size").on("touchend", function(d) {
                        isDomVisile(document.getElementById("menu_text_slider")) ? $("#menu_text_slider").css("display", "none") : $("#menu_text_slider").css("display", "flex");
                        d.stopPropagation();
                        d.preventDefault()
                    }), $("#menu_text_color").on("touchstart", function(d) {
                        d.stopPropagation()
                    })) : ($(".btn-color-text-small").on("mousedown", function(d) {
                    e.setTextStyle({
                        color: $(this).attr("data")
                    });
                    d.stopPropagation();
                    d.preventDefault()
                }), $("#btn_option_align").on("mousedown", function(d) {
                    d.stopPropagation();
                    d.preventDefault();
                    "left" == e.currTextStyle.align ? e.setTextStyle({
                            align: "center"
                        }) : "center" == e.currTextStyle.align ? e.setTextStyle({
                            align: "right"
                        }) : "right" == e.currTextStyle.align &&
                        e.setTextStyle({
                            align: "left"
                        })
                }), $("#btn_option_fill").on("mousedown", function(d) {
                    e.currTextStyle.fill ? e.setTextStyle({
                        fill: !1
                    }) : e.setTextStyle({
                        fill: !0
                    });
                    d.stopPropagation();
                    d.preventDefault()
                }), $("#btn_text_size").on("mousedown", function(d) {
                    isDomVisile(document.getElementById("menu_text_slider")) ? $("#menu_text_slider").css("display", "none") : $("#menu_text_slider").css("display", "flex");
                    d.stopPropagation();
                    d.preventDefault()
                }), $("#btn_option_font").on("mousedown", function(d) {
                    isDomVisile(document.getElementById("menu_text_font")) ?
                        $("#menu_text_font").css("display", "none") : $("#menu_text_font").css("display", "block");
                    d.stopPropagation();
                    d.preventDefault()
                }), $(".font_chu").on("mousedown", function(d) {
                    e.setTextStyle({
                        font: $(this).attr("data")
                    });
                    d.stopPropagation();
                    d.preventDefault()
                }), $("#menu_text_color").on("mousedown", function(d) {
                    d.stopPropagation()
                }), $("#menu_text_color").css("overflow-x", "hidden"))
        },
        showMenuText: function() {
            $("#mnote_menu_text").css("display", "block");
            $("#mnote_setting_zoom_out").css("display", "none");
            $("#mnote_setting_zoom_in").css("display",
                "none")
        },
        hideMenuText: function() {
            $("#mnote_menu_text").css("display", "none");
            $("#menu_text_slider").css("display", "none");
            $("#menu_text_font").css("display", "none");
            is_touch_device() || ($("#mnote_setting_zoom_out").css("display", "block"), $("#mnote_setting_zoom_in").css("display", "block"))
        },
        _addText: function(a, c, b, e, d) {
            var f = is_touch_device() ? 200 : 80;
            b = b + f > this.pageWidth ? this.pageWidth - f : b;
            c = $('<div pageid="' + a + '" class="obj_text" style="padding:10px" contenteditable="true">' + c + "</div>");
            a = $("#page_" +
                a).find(".page_objs_layer")[0];
            $(a).append(c);
            $(c).css("position", "absolute");
            $(c).css("font-family", d.font);
            $(c).css("text-align", d.align);
            $(c).css("left", b + "px");
            $(c).css("top", e + "px");
            $(c).css("min-width", f + "px");
            $(c).css("letter-spacing", "3px");
            $(c).css("font-size", d.size + "px");
            $(c).css("font-weight", "bold");
            d.fill ? ($(c).css("color", "white"), $(c).css("background-color", d.color)) : ($(c).css("color", d.color), $(c).css("background-color", "tranparent"));
            "edit" == this.mnotedata.mode && $(c).css("pointer-events",
                "all");
            $(c).css("border-radius", "8px");
            $(c).attr("styleText", JSON.stringify(d).replaceAll('"', "'"));
            var g = this;

            $(c)[0].addEventListener('paste', function (e){
                e.preventDefault()
                var text = e.clipboardData.getData('text/plain');
                $(this).css("max-width", (3*g.pageWidth/4) + "px");
                this.innerHTML+=text;
            })

            $(c).blur(function() {
                cc.log("on text lost focus");
                $(this).removeClass("focusing");
                $(this).css("border", "none");

                "" == $(this).html().trim() && $(this).remove();
                g.setMode(g.MODE_DRAWRING)
            });
            $(c).focus(function(k) {
                cc.log("on text focus");
                $(this).addClass("focusing");
                $(this).css("border", "dashed 2px");
                g.setTextStyle(JSON.parse($(this).attr("styleText").replaceAll("'", '"')));
                g.setMode(g.MODE_ENTER_TEXT)
            });
            $(c).on("input", function(k) {
                k = parseInt($(this).css("left"));
                k + $(this).width() > g.pageWidth - 15 && (k = g.pageWidth - $(this).width() - 15, $(this).css("left", k + "px"))
            });
            this.moveable(c);
            return $(c)
        },
        addText: function(a, c, b) {
            a = this._addText(a, "", c, b, this.currTextStyle);
            this.focusText($(a));
            this.setMode(this.MODE_ENTER_TEXT)
        },
        focusText: function(a) {
            this.blurText();
            $(".focusing").removeClass("focusing");
            $(a).focus();
            var c = $(a).get(0).getBoundingClientRect(),
                b = 0;
            c.top > this.appHeight / 4 - 50 && (b = c.top - (this.appHeight /
                4 - 50));
            this.panzoom && "android" == getOs() && this.panzoom.moveBy(0, -b);
            b = $(a).get(0);
            if ("" != $(a).html()) {
                a = document.createRange();
                c = window.getSelection();
                if (void 0 != b.childNodes) {
                    b = b.childNodes[b.childNodes.length - 1];
                    if (3 == b.nodeType) {
                        var e = b.length;
                        a.setStart(b, e)
                    }
                    1 == b.nodeType && (e = b.firstChild.length, a.setStart(b.firstChild, e))
                } else b = b.firstChild, a.setStart(b, b.length);
                a.collapse(!0);
                c.removeAllRanges();
                c.addRange(a)
            }
        },
        blurText: function() {
            $(".focusing").blur();
            $(".focusing").each(function(a) {
                $(this).removeClass("focusing");
                $(this).css("border", "none");
                "" == $(this).html().trim() && $(this).remove()
            })
        },
        setTextStyle: function(a) {
            a.font && (this.currTextStyle.font = a.font);
            a.color && (this.currTextStyle.color = a.color);
            a.size && (this.currTextStyle.size = a.size);
            void 0 != a.fill && (this.currTextStyle.fill = a.fill);
            a.align && (this.currTextStyle.align = a.align);
            a = this.currTextStyle.size;
            $("#btn_text_size").find("span").html(a);
            $("#slider_text_thumb").css("background-color", this.currTextStyle.color);
            var c = this;
            $(".btn-color-text-small").each(function(b) {
                $(this).empty();
                $(this).parent().css("border", "none");
                $(this).attr("data") == c.currTextStyle.color && ($(this).append($('<i class="material-icons">check</i>')), $(this).parent().css("border", "solid 1px #CCCCCC"))
            });
            "left" == this.currTextStyle.align && $("#btn_option_align").find("i").html("format_align_left");
            "right" == this.currTextStyle.align && $("#btn_option_align").find("i").html("format_align_right");
            "center" == this.currTextStyle.align && $("#btn_option_align").find("i").html("format_align_center");
            this.currTextStyle.fill ?
                $("#btn_option_fill").find("i").html("font_download") : $("#btn_option_fill").find("i").html("format_color_text");
            $(".focusing").css("font-family", this.currTextStyle.font);
            $(".focusing").css("font-size", this.currTextStyle.size);
            $(".focusing").css("text-align", this.currTextStyle.align);
            this.currTextStyle.fill ? ($(".focusing").css("color", "white"), $(".focusing").css("background-color", this.currTextStyle.color)) : ($(".focusing").css("color", this.currTextStyle.color), $(".focusing").css("background-color",
                "transparent"));
            $(".focusing").attr("styleText", JSON.stringify(this.currTextStyle).replaceAll('"', "'"));
            try {
                localStorage && localStorage.setItem("textStyle", JSON.stringify(this.currTextStyle))
            } catch (b) {}
        },
        addTouchTap: function(a, c) {
            $(a).on("touchstart", function(b) {
                1 < b.touches.length || ($(this).attr("downx", b.touches[0].clientX), $(this).attr("downy", b.touches[0].clientY), $(this).attr("movex", b.touches[0].clientX), $(this).attr("movey", b.touches[0].clientY), b.preventDefault())
            });
            $(a).on("touchmove", function(b) {
                1 <
                    b.touches.length || ($(this).attr("movex", b.touches[0].clientX), $(this).attr("movey", b.touches[0].clientY))
            });
            $(a).on("touchend", function(b) {
                var e = parseInt($(this).attr("downx")),
                    d = parseInt($(this).attr("downy")),
                    f = parseInt($(this).attr("movex")),
                    g = parseInt($(this).attr("movey"));
                13 > Math.abs(e - f) && 13 > Math.abs(d - g) && c && c();
                b.preventDefault()
            });
            $(a).on("mouseup", function(b) {
                c && c()
            })
        },
        updateMark: function(a) {
            this.countWrong = $(".wrong").length;
            this.countRight = $(".correct").length;
            this.countWrong = 0 > this.countWrong ?
                0 : this.countWrong;
            this.countRight = 0 > this.countRight ? 0 : this.countRight;
            var c = this.countRight + this.countWrong;
            this.point = 0;
            if (0 < c) {
                var b = (10 * this.countRight / c).toFixed(1),
                    e = 1 == this.mnotedata.hideMark ? "" : " = " + b + " \u0110i\u1ec3m ";
                $("#mnote_mark_result").html("Tr\u1ea3 l\u1eddi \u0111\u00fang " + this.countRight + " / " + c + e + '.    <span style="color: green;margin-left: 20px;">\u0111 : ' + this.countRight + ' </span> <span style="color: red;margin-left:20px ;">s : ' + this.countWrong + "</span>");
                this.point = void 0 !=
                    a && null != a ? a : b
            } else $("#mnote_mark_result").html("Ch\u01b0a c\u00f3 s\u1ed1 c\u00e2u \u0111\u00fang , c\u00e2u sai "), this.point = a;
            isNaN(this.point) && (this.point = 0);
            1E3 == this.point ? $("#mark_number_txt").val("\u0110") : 1001 == this.point ? $("#mark_number_txt").val("C\u0110") : 2E3 == this.point ? $("#mark_number_txt").val("HT") : 2001 == this.point ? $("#mark_number_txt").val("CHT") : 3E3 == this.point ? $("#mark_number_txt").val("HTT") : $("#mark_number_txt").val(this.point);
            var d = this;
            $(".btn-mark-chose-bt").each(function() {
                $(this).css("background-color",
                    "#e0e0e0");
                $(this).find("span").css("color", "#444444");
                parseInt($(this).attr("data")) == Math.round(d.point) && ($(this).css("background-color", "red"), $(this).find("span").css("color", "white"))
            })
        },
        initMarkUI: function() {
            var a = this;
            $(".mnote_mark_point_txt").focus(function() {
                var d = $("#mnote_mark").get(0).getBoundingClientRect(),
                    f = 0;
                100 < d.top && (f = d.top - 100);
                a.panzoom && a.panzoom.moveBy(0, -f);
                a.markTxtFocus = !0;
                a.setMode(a.MODE_NORMAL)
            });
            $(".mnote_mark_point_txt").blur(function() {
                a.markTxtFocus = !1
            });
            var c =
                this;
            $("#mark_comment_txt").on("input", function(d) {
                c.resizeTxtComment()
            });
            var b = $('<div class="btn-mark-chose"><div data="1000" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444">\u0110</span></div></div>');
            $("#mnote_mark_chose").append($(b));
            b = $('<div class="btn-mark-chose"><div data="1001" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444;left:22px">C\u0110</span></div></div>');
            $("#mnote_mark_chose").append($(b));
            b = $('<div class="btn-mark-chose"><div data="2000" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444;left:28px">HT</span></div></div>');
            $("#mnote_mark_chose").append($(b));
            b = $('<div class="btn-mark-chose"><div data="2001" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444;left:15px;font-size:50px">CHT</span></div></div>');
            $("#mnote_mark_chose").append($(b));
            b = $('<div class="btn-mark-chose"><div data="3000" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444;left:15px;font-size:50px">HTT</span></div></div>');
            $("#mnote_mark_chose").append($(b));
            for (b = 10; 0 <= b; b--) {
                var e = $('<div class="btn-mark-chose"><div data="' + b + '" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444">' + b +
                    "</span></div></div>");
                $("#mnote_mark_chose").append($(e));
                10 == b && $(e).find("span").css("left", "30px")
            }
            $("#mnote_mark_chose").on("touchstart", function(d) {
                d.preventDefault()
            });
            $(".btn-mark-chose-bt").each(function() {
                var d = this;
                c.addTouchTap($(this), function() {
                    c.updateMark(parseInt($(d).attr("data")))
                })
            });
            $("#mnote_mark_hide").on("mouseup touchend", function(d) {
                1 == c.mnotedata.hideMark ? c.showMark() : c.hideMark();
                c.updateMark();
                d.preventDefault()
            });
            b = $("#switch_hide_mark").find("input")[0];
            $(b).on("change",
                function(d) {
                    this.checked ? c.showMark() : c.hideMark();
                    d.stopPropagation();
                    d.preventDefault()
                });
            $("#mark_number_txt").on("input", function() {
                var d = Math.floor($("#mark_number_txt").val());
                isNaN(d) || $(".btn-mark-chose-bt").each(function() {
                    $(this).css("background-color", "#e0e0e0");
                    $(this).find("span").css("color", "#444444");
                    parseInt($(this).attr("data")) == d && ($(this).css("background-color", "red"), $(this).find("span").css("color", "white"))
                })
            });
            $("#mark_comment_txt").on("touchstart", function(d) {});
            $("#mnote_mark_emoji_bt").click(function() {
                if ("block" ==
                    $("#emoji_chosen").css("display")) $("#emoji_chosen").css("display", "none");
                else if ($("#emoji_chosen").css("display", "block"), 0 == $(".emoji_chosen").length) {
                    for (var d = 1; 20 > d; d++) {
                        var f = $("<img class='emoji_chosen' src='images/emoji/emoji" + d + ".gif' width='80' height='80'/>");
                        $("#emoji_chosen_container").append($(f));
                        $(f).css("cursor", "pointer")
                    }
                    $("#emoji_chosen_container").width(80 * (d + 1) + "px");
                    $(".emoji_chosen").click(function() {
                        a.addCommentEmoji([$(this).attr("src")])
                    })
                }
            })
        },
        hideMark: function(a) {
            this.mnotedata.hideMark = !0;
            $("#switch_hide_mark").find("input")[0].checked = !1;
            $("#mnote_mark_number").css("display", "none");
            $("#mnote_mark_comment").css("width", "100%");
            $("#mnote_mark_chose").css("display", "none");
            this.mnotedata.point = 0;
            if (!a) try {
                localStorage.setItem("hideMark", "true")
            } catch (c) {}
        },
        showMark: function(a) {
            this.mnotedata.hideMark = !1;
            $("#switch_hide_mark").find("input")[0].checked = !0;
            $("#mnote_mark_number").css("display", "block");
            $("#mnote_mark_comment").css("width", "65%");
            $("#mnote_mark_chose").css("display",
                "block");
            if (!a) try {
                localStorage.setItem("hideMark", "false")
            } catch (c) {}
        },
        resizeTxtComment: function() {
            var a = document.getElementById("mark_comment_txt");
            a = $(a).height();
            a = (200 > a ? 200 : a) + 130 + $("#mnote_mark_emoji").height();
            this.mnotedata && "view" == this.mnotedata.mode && (a += 80);
            $("#mnote_mark_point").css("height", a + "px");
            $("#mark_number_txt").css("margin-top", (a - 68 - 150) / 2 + "px");
            a = $("#mnote_mark_emoji_container").height() - 50;
            a = 0 > a ? 0 : a;
            $("#mnote_mark_emoji_bt").css("margin-top", a + "px")
        },
        addCommentEmoji: function(a) {
            for (var c =
                    0; c < a.length; c++) {
                var b = $('<img class="comment_emoji" src="' + a[c] + '" width="120" height="120"/>');
                $("#mnote_mark_emoji_container").append($(b));
                var e = this;
                $(b).css("cursor", "pointer");
                $(b).click(function(d) {
                    "edit" == e.mnotedata.mode && ($(this).remove(), e.resizeTxtComment())
                })
            }
            this.resizeTxtComment()
        },
        initStaticTextSetting: function() {
            var a = this;
            this.staticTextConfig = {
                urlImgCorrect: "images/rightwrong/right1.png",
                urlImgWrong: "images/rightwrong/wrong1.png",
                textCorrect: "\u0111",
                textWrong: "s",
                useCorrectText: !0,
                useWrongText: !0,
                correctWidth: 50,
                correctHeight: 50,
                wrongWidth: 50,
                wrongHeight: 50,
                fontText: "font_chu_dep",
                fontSize: 30,
                fontColor: "red"
            };
            $("#setting_static_text_size").on("input", function() {
                $(".setting_text").css("font-size", $("#setting_static_text_size").val() + "px")
            });
            $("#setting_static_text_font").on("change", function() {
                $(".setting_text").css("font-family", $("#setting_static_text_font").val())
            });
            $("#setting_static_text_close").click(function() {
                a.hideStaticTextSetting()
            });
            $("#static_text_txt_menu").click(function() {
                $("#mnote_static_text_txt").css("display",
                    "block");
                $("#mnote_static_text_img").css("display", "none")
            });
            $("#static_text_img_menu").click(function() {
                $("#mnote_static_text_txt").css("display", "none");
                $("#mnote_static_text_img").css("display", "block");
                a.initStaticTextImageChosen()
            });
            this.resizeTxtComment();
            $("select").formSelect();
            $("#setting_static_text_submit").click(function() {
                var c = $("#setting_text_correct").html().trim();
                "" == c && (c = "\u0111");
                a.staticTextConfig.textCorrect = c;
                a.staticTextConfig.useCorrectText = !0;
                c = $("#setting_text_wrong").html().trim();
                "" == c && (c = "s");
                a.staticTextConfig.textWrong = c;
                a.staticTextConfig.useWrongText = !0;
                a.staticTextConfig.fontText = $("#setting_static_text_font").val();
                a.staticTextConfig.fontSize = $("#setting_static_text_size").val();
                a.staticTextConfig.correctWidth = $("#setting_text_correct").width();
                a.staticTextConfig.correctHeight = $("#setting_text_correct").height();
                a.staticTextConfig.wrongWidth = $("#setting_text_wrong").width();
                a.staticTextConfig.wrongHeight = $("#setting_text_wrong").height();
                $(".wrong").css("font-family",
                    a.staticTextConfig.fontText);
                $(".wrong").css("font-size", a.staticTextConfig.fontSize);
                $(".wrong").find("span").html(a.staticTextConfig.textWrong);
                $(".correct").css("font-family", a.staticTextConfig.fontText);
                $(".correct").css("font-size", a.staticTextConfig.fontSize);
                $(".correct").find("span").html(a.staticTextConfig.textCorrect);
                $(".wrong").find("span").css("display", "block");
                $(".wrong").find("img").css("display", "none");
                $(".correct").find("span").css("display", "block");
                $(".correct").find("img").css("display",
                    "none");
                try {
                    localStorage.setItem("staticTextConfig", JSON.stringify(a.staticTextConfig))
                } catch (b) {}
                a.hideStaticTextSetting()
            });
            $("#setting_static_img_submit").click(function() {
                a.staticTextConfig.useCorrectText = !1;
                a.staticTextConfig.useWrongText = !1;
                a.staticTextConfig.correctWidth = 50;
                a.staticTextConfig.correctHeight = 50;
                a.staticTextConfig.wrongWidth = 50;
                a.staticTextConfig.wrongHeight = 50;
                a.staticTextConfig.urlImgCorrect = $("#static_img_corect").attr("src");
                a.staticTextConfig.urlImgWrong = $("#static_img_wrong").attr("src");
                $(".correct_img").attr("src", a.staticTextConfig.urlImgCorrect);
                $(".wrong_img").attr("src", a.staticTextConfig.urlImgWrong);
                $(".wrong").find("span").css("display", "none");
                $(".wrong").find("img").css("display", "block");
                $(".correct").find("span").css("display", "none");
                $(".correct").find("img").css("display", "block");
                try {
                    localStorage.setItem("staticTextConfig", JSON.stringify(a.staticTextConfig))
                } catch (c) {}
                a.hideStaticTextSetting()
            })
        },
        showStaticTextSetting: function() {
            $("#setting_static_text").css("display",
                "block");
            $("#setting_text_correct").html(this.staticTextConfig.textCorrect);
            $("#setting_text_wrong").html(this.staticTextConfig.textWrong);
            $(".setting_text").css("font-size", this.staticTextConfig.fontSize + "px");
            $(".setting_text").css("font-family", this.staticTextConfig.fontText);
            $("#setting_static_text_size").val(this.staticTextConfig.fontSize);
            $("#setting_static_text_font").val(this.staticTextConfig.fontText);
            $("select").formSelect();
            "" == this.staticTextConfig.urlImgCorrect && (this.staticTextConfig.urlImgCorrect =
                "images/rightwrong/right1.png");
            "" == this.staticTextConfig.urlImgWrong && (this.staticTextConfig.urlImgWrong = "images/rightwrong/wrong1.png");
            $("#static_img_corect").attr("src", this.staticTextConfig.urlImgCorrect);
            $("#static_img_wrong").attr("src", this.staticTextConfig.urlImgWrong);
            this.staticTextConfig.useCorrectText ? ($("#mnote_static_text_txt").css("display", "block"), $("#mnote_static_text_img").css("display", "none")) : ($("#mnote_static_text_txt").css("display", "none"), $("#mnote_static_text_img").css("display",
                "block"), this.initStaticTextImageChosen())
        },
        hideStaticTextSetting: function() {
            $("#setting_static_text").css("display", "none")
        },
        initStaticTextImageChosen: function() {
            if (0 == $(".static_img_correct").length) {
                for (var a = 1; 6 > a; a++) {
                    var c = $("<img class='static_img_correct' src='images/rightwrong/right" + a + ".png' width='30' height='30'/>");
                    $("#static_img_corect_container").append($(c));
                    c = $("<img class='static_img_wrong' src='images/rightwrong/wrong" + a + ".png' width='30' height='30'/>");
                    $("#static_img_wrong_container").append($(c))
                }
                $(".static_img_correct").click(function() {
                    $("#static_img_corect").attr("src",
                        $(this).attr("src"))
                });
                $(".static_img_wrong").click(function() {
                    $("#static_img_wrong").attr("src", $(this).attr("src"))
                })
            }
        },
        initMathEditor: function() {
            var a = this;
            is_touch_device() && ($("#math_editor").css("height", window.innerHeight - 60), $("#math_editor").css("top", "60"));
            $("#math_editor_close").click(function() {
                a.hideMathEditor()
            });
            $("#math_editor_submit").click(function() {});
            this.myEditor = new MathEditor("mathquill_editor");
            this.myEditor.styleMe({
                textarea_background: "#FFFFFF",
                textarea_foreground: "#FF0000",
                textarea_border: "#000000",
                toolbar_background: "#FFFFFF",
                toolbar_foreground: "#000000",
                toolbar_border: "#000000",
                button_background: "#FFFFFF",
                button_border: "#000000"
            })
        },
        showMathEditor: function() {
            $("#math_editor").css("display", "block");
            this.myEditor.setLatex("")
        },
        hideMathEditor: function() {
            $("#math_editor").css("display", "none")
        },
        convertCoordGlobalToLocal: function(a, c) {
            var b = {
                x: a,
                y: c
            };
            b.x = a * this.pageScale;
            b.y = c * this.pageScale;
            var e = 0;
            is_touch_device() || (e = document.getElementById("mnote_content").scrollTop);
            b.y += e;
            return b
        },
        exportPdf: function() {
            var a = this;
            showLoading();
            this.zipExport = new JSZip;
            $(".bt-edit-bg").css("display", "none");
            setTimeout(function() {
                a.exportPdfPage(0)
            }, 300)
        },
        exportPdfPage: function(a) {
            var c = this;
            0 > a && (a = 0);
            a >= this.pageCount ? html2canvas(document.querySelector("#mnote_mark_point"), {
                useCORS: !0
            }).then(function(b) {
                b = b.toDataURL("image/jpeg", 70);
                b = b.substr(23);
                c.zipExport.file("diem_loiphe.jpg", b, {
                    base64: !0
                });
                var e = c.mnotedata.classname + "_" + c.mnotedata.fullname + "_" + c.mnotedata.homeworkTime +
                    "_" + c.mnotedata.homework;
                c.zipExport.generateAsync({
                    type: "blob"
                }).then(function(d) {
                    hideLoading();
                    $(".bt-edit-bg").css("display", "block");
                    saveAs(d, e + ".zip")
                })
            }) : html2canvas(document.querySelector("#page_" + a), {
                useCORS: !0
            }).then(function(b) {
                b = b.toDataURL("image/jpeg", 70);
                b = b.substr(23);
                c.zipExport.file("trang_" + a + ".jpg", b, {
                    base64: !0
                });
                c.exportPdfPage(a + 1)
            })
        },
        exportPdf_: function() {
            showLoading();
            $("#mnote_mark_chose").css("display", "none");
            $("#btn_save_data").css("display", "none");
            $("#mnote_hold_bt").css("display",
                "none");
            $("#mnote_setting_bt").css("display", "none");
            $("#hide_mark").css("display", "none");
            var a = $("#mnote_mark").css("top");
            $("#mnote_mark").css("top", "36px");
            $("#mnote_mark_hide").css("display", "none");
            var c = $("#mnote_mark_point").height() + 20;
            $("#mnote_pages").css("padding-top", c + "px");
            c = $("#mnote_user_info").height() - 10;
            $("#mnote_pages").css("margin-top", c + "px");
            $("#mnote_mark_result").css("display", "none");
            $("#mnote_mark_emoji_bt").css("display", "none");
            $("#mnote_help").css("display", "none");
            $("#mnote_mark_emoji_bt").css("display", "none");
            $("#mnote_user_info").css("display", "block");
            $(".bt-edit-bg").css("display", "none");
            $("#emoji_chosen").css("display", "none");
            var b = this.mnotedata.classname + "_" + this.mnotedata.fullname + "_" + this.mnotedata.homeworkTime + "_" + this.mnotedata.homework;
            setTimeout(function() {
                html2canvas(document.querySelector("#mnote_container"), {
                    useCORS: !0
                }).then(function(e) {
                    var d = document.createElement("a");
                    d.download = b + ".jpg";
                    d.href = e.toDataURL("image/jpeg", .9);
                    d.click();
                    $("#mnote_mark_chose").css("display",
                        "block");
                    $("#btn_save_data").css("display", "block");
                    $("#mnote_hold_bt").css("display", "block");
                    $("#mnote_setting_bt").css("display", "block");
                    $("#hide_mark").css("display", "flex");
                    $("#mnote_mark").css("top", a);
                    $("#mnote_mark_hide").css("display", "block");
                    $("#mnote_pages").css("padding-top", "0px");
                    $("#mnote_pages").css("margin-top", "0px");
                    $("#mnote_mark_result").css("display", "flex");
                    $("#mnote_mark_emoji_bt").css("display", "block");
                    $("#mnote_help").css("display", "block");
                    $("#mnote_mark_emoji_bt").css("display",
                        "block");
                    $("#mnote_user_info").css("display", "none");
                    $(".bt-edit-bg").css("display", "block");
                    hideLoading()
                })
            }, 1E3)
        },
        isPanzoomEnable: function() {
            return this.mode == this.MODE_DRAWRING && (this.currBrush == this.BRUSH_PEN || this.currBrush == this.BRUSH_ERASE || this.currBrush == this.BRUSH_LINE || this.currBrush == this.BRUSH_RECTANGLE || this.currBrush == this.BRUSH_CIRCLE || this.currBrush == this.BRUSH_ARROW) || this.mode == this.MODE_ENTER_TEXT || 1 == this.markTxtFocus ? !1 : !0
        },
        onresize: function(a, c, b) {
            var e = this;
            is_touch_device() &&
                this.appWidth == a && this.appHeight < c && 0 < this.appHeight && (this.blurText(), $(".mnote_mark_point_txt").blur());
            0 == this.appHeight && b && is_touch_device() && 200 > c && setTimeout(function() {
                e.onresize(window.innerWidth, window.innerHeight)
            }, 3E3);
            this.appWidth = a;
            this.appHeight = c;
            $("#mnote_app").css("height", c + "px");
            $(this.note_content).css("height", c + "px");
            $(this.note_pages).width(this.pageWidth);
            this.pageScale = $(this.note_content).width() / this.pageWidth;
            $(this.note_pages).css("transform", "scale(" + this.pageScale +
                ")");
            0 <= navigator.userAgent.toLowerCase().indexOf("ipad") ? $(this.note_container).height($(this.note_pages).height() * this.pageScale + 1.5 * window.innerHeight + 500) : $(this.note_container).height($(this.note_pages).height() * this.pageScale + 1.5 * window.innerHeight)
        }
    }),
    MNote = function() {
        var a;
        return {
            getInstance: function() {
                a || (a = new MNote_instance);
                return a
            },
            releaseInst: function() {
                a = null
            },
            inst: function() {
                return this.getInstance()
            }
        }
    }();

function loadCss() {
    var a = document.getElementsByTagName("head")[0],
        c = document.createElement("link");
    document.createElement("img");
    var b = "css/mnote_u.css?t=" + (new Date).getTime();
    c.href = b;
    c.rel = "stylesheet";
    a.appendChild(c);
    startApp()
}

function startApp() {
    $("#root").css("display", "block");
    mnote = MNote.getInstance();
  //  var arrPage=[{"width":750,"height":1334,"id":1,"backgroundImage":"images/test1.jpg","rotation":0,"staticText":[],"objText":[{"x":406,"y":454,"value":"Vbjutg<div>Vhhjj</div>","textStyle":{"font":"handwriting_font","size":40,"align":"left","color":"red","fill":false}},{"x":225,"y":942,"value":"Ghhrt<div>Ghhj</div>","textStyle":{"font":"handwriting_font","size":40,"align":"center","color":"red","fill":true}}]},{"width":750,"height":1334,"id":0,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[{"x":363,"y":808,"value":"correct"},{"x":485,"y":663,"value":"correct"},{"x":451,"y":837,"value":"correct"},{"x":324,"y":1026,"value":"correct"},{"x":476,"y":976,"value":"wrong"},{"x":544,"y":831,"value":"wrong"},{"x":439,"y":1140,"value":"wrong"},{"x":88,"y":836,"value":"wrong"},{"x":256,"y":594,"value":"wrong"},{"x":242,"y":748,"value":"correct"}],"objText":[]},{"width":750,"height":1334,"id":3,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":2,"backgroundImage":"images/test3.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":4,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":5,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]}];
   // var arrPage=[{"width":750,"height":1334,"id":1,"backgroundImage":"images/test1.jpg","rotation":0,"staticText":[{"x":254,"y":1003,"value":"correct"},{"x":402,"y":974,"value":"correct"},{"x":449,"y":1109,"value":"correct"},{"x":602,"y":1188,"value":"correct"},{"x":369,"y":1188,"value":"correct"}],"objText":[]},{"width":750,"height":450,"id":0,"backgroundImage":"https://player.vimeo.com/video/606881153","staticText":[],"objText":[]}];
   /* var mnotedata={
        pages:arrPage,
        commentEmoji:["images/emoji/emoji2.gif","images/emoji/emoji3.gif","images/emoji/emoji4.gif","images/emoji/emoji5.gif"],
        mode:"edit"
    }*/

  //  var mnotedata={"pages":[{"width":750,"height":1334,"id":1,"backgroundImage":"images/test1.jpg","rotation":0,"staticText":[],"objText":[{"x":202,"y":729,"value":"VbjutgVhhjjJOB TITLE/COMPANYDates From – ToThink about the size of the team you led, the number of projects you balanced, or the number of articles you wrote.JOB TITLE/COMPANYDates From – ToThink about the size of the team you led, the number of projects you balanced, or the number of articles you wrote.","textStyle":{"font":"handwriting_font","size":40,"align":"left","color":"#3f51b5","fill":false}},{"x":79,"y":1000,"value":"GhhrtGhhjOBJECTIVETo get started, click placeholder text and start typing. Be brief: one or two sentences.<script> hsocsjcs</script><span>JOB TITLE/COMPANYDates From – ToThink about the size of the team you led, the number of projects you balanced, or the number of articles you wrote.hsiocjscs</span>","textStyle":{"font":"font_chu_in","size":40,"align":"center","color":"red","fill":true}}]},{"width":750,"height":1334,"id":0,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[{"x":363,"y":808,"value":"correct"},{"x":485,"y":663,"value":"correct"},{"x":451,"y":837,"value":"correct"},{"x":324,"y":1026,"value":"correct"},{"x":476,"y":976,"value":"wrong"},{"x":544,"y":831,"value":"wrong"},{"x":439,"y":1140,"value":"wrong"},{"x":88,"y":836,"value":"wrong"},{"x":256,"y":594,"value":"wrong"},{"x":242,"y":748,"value":"correct"}],"objText":[]},{"width":750,"height":1334,"id":3,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":2,"backgroundImage":"images/test3.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":4,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":5,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]}],"staticTextConfig":"{\"urlImgCorrect\":\"images/rightwrong/right1.png\",\"urlImgWrong\":\"images/rightwrong/wrong1.png\",\"textCorrect\":\"đ\",\"textWrong\":\"s\",\"useCorrectText\":true,\"useWrongText\":true,\"correctWidth\":50,\"correctHeight\":50,\"wrongWidth\":50,\"wrongHeight\":50,\"fontText\":\"font_chu_dep\",\"fontSize\":30,\"fontColor\":\"red\",\"txtCommentFont\":\"font_chu_in\"}","comment":"","commentEmoji":["images/emoji/emoji2.gif","images/emoji/emoji3.gif","images/emoji/emoji4.gif","images/emoji/emoji5.gif"],"point":"5.0","hideMark":false};
  //  mnote.initNote(mnotedata);
}
loadCss();