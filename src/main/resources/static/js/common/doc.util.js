/**
 * File Name   : doc.util.js
 * Description : document 유틸 자바스크립트
 * Author      : atom
 * Date        : 2020.07.15
 */

var DocUtil = {

    /**
     * 엘리먼트 구하기
     * elId : 엘리먼트 아이디
     */
    getElId: function(elId) {
        return document.getElementById(elId);
    },

    /**
     * 엘리먼트 객체 구하기
     * elId : 엘리먼트 아이디
     */
    getElObj: function(elId) {
        if ((elId instanceof Element) === true) {
            return elId;
        } else {
            return document.getElementById(elId);
        }
    },

    /**
     * class 체크
     * elId  : 엘리먼트 아이디
     * clsNm : 클래스명
     */
    hasClass: function(elId, clsNm) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            var re = new RegExp("\\b" + clsNm + "\\b");

            if (elmt.className.match(re) != null) {
                return true;
            }
        }

        return false;
    },

    /**
     * class 추가
     * elId  : 엘리먼트 아이디
     * clsNm : 클래스명
     */
    addClass: function(elId, clsNm) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            var re = new RegExp("\\b" + clsNm + "\\b");

            if (elmt.className.match(re) == null) {
                elmt.className = WebUtil.trim(elmt.className + " " + clsNm);
            }
        }
    },

    /**
     * class 제거
     * elId  : 엘리먼트 아이디
     * clsNm : 클래스명
     */
    removeClass: function(elId, clsNm) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            var re = new RegExp("(\\s|\\b)" + clsNm + "(\\s|\\b)");

            if (elmt.className.match(re) != null) {
                elmt.className = WebUtil.trim(elmt.className.replace(re, " "));
            }
        }
    },

    /**
     * fade in
     * elId     : 엘리먼트 아이디
     * callback : 콜백 함수
     */
    fadeIn: function(elId, callback) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            var reqObj = null;
            elmt.style.opacity = 0;
            elmt.style.display = "block";

            (function fade() {
                var val = parseFloat(elmt.style.opacity);

                if (!((val += 0.1) > 1)) {
                    elmt.style.opacity = val;
                    reqObj = reqAnimatFrame(fade);
                } else {
                    cnclAnimatFrame(reqObj);

                    // 콜백함수
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            })();
        }
    },

    /**
     * fade out
     * elId     : 엘리먼트 아이디
     * callback : 콜백 함수
     */
    fadeOut: function(elId, callback) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            var reqObj = null;
            elmt.style.opacity = 1;

            (function fade() {
                if ((elmt.style.opacity -= 0.1) < 0) {
                    elmt.style.display = "none";

                    cnclAnimatFrame(reqObj);

                    // 콜백함수
                    if (typeof callback === "function") {
                        callback();
                    }
                } else {
                    reqObj = reqAnimatFrame(fade);
                }
            })();
        }
    },

    /**
     * slide down
     * elId     : 엘리먼트 아이디
     * callback : 콜백 함수
     */
    slideDown: function(elId, callback) {
        var elmt = this.getElObj(elId);

        if (elmt != null && !DocUtil.hasClass(elmt, "active")) {
            // 활성화
            this.addClass(elmt, "active");
            elmt.style.display = "block";
            elmt.style.height = "auto";

            // 높이 초기화
            var height = elmt.clientHeight;
            elmt.style.height = "0";

            // 높이 설정
            setTimeout(function() {
                elmt.style.height = height + "px";
            }, 0);

            var reqObj = null;

            (function fade() {
                var strVal = DocUtil.getStyle(elmt, "height").replace("px", "");
                var intVal = parseInt(strVal, 10);

                if (intVal >= height) {
                    cnclAnimatFrame(reqObj);

                    // 콜백함수
                    if (typeof callback === "function") {
                        callback();
                    }
                } else {
                    reqObj = reqAnimatFrame(fade);
                }
            })();
        }
    },

    /**
     * slide up
     * elId     : 엘리먼트 아이디
     * callback : 콜백 함수
     */
    slideUp: function(elId, callback) {
        var elmt = this.getElObj(elId);

        if (elmt != null && DocUtil.hasClass(elmt, "active")) {
            elmt.style.height = "0";
            DocUtil.removeClass(elmt, "active");

            var reqObj = null;

            (function fade() {
                var strVal = DocUtil.getStyle(elmt, "height").replace("px", "");
                var intVal = parseInt(strVal, 10);

                // border 높이 때문에 5로 설정
                if (intVal <= 5) {
                    cnclAnimatFrame(reqObj);

                    elmt.style.display = "none";

                    // 콜백함수
                    if (typeof callback === "function") {
                        callback();
                    }
                } else {
                    reqObj = reqAnimatFrame(fade);
                }
            })();
        }
    },

    /**
     * 스타일 구하기
     * elId : 엘리먼트 아이디
     * prop : 프로퍼티
     */
    getStyle: function(elId, prop) {
        var result = "";
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            result = window.getComputedStyle(elmt).getPropertyValue(prop);
        }

        return result;
    },

    /**
     * offset
     * elId : 엘리먼트 아이디
     */
    offset: function(elId) {
        var elmt = this.getElObj(elId);

        if (elmt == null) {
            return { top: 0, left: 0 };
        }

        var rect = elmt.getBoundingClientRect();

        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    },

    /**
     * css
     * elId : 엘리먼트 아이디
     * key  : css 속성
     * val  : 값
     */
    css: function(elId, attr, val) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            // 오브젝트 체크
            if (WebUtil.isObject(attr)) {
                for (var key in attr) {
                    elmt.style[key] = attr[key];
                }
            } else {
                elmt.style[attr] = val;
            }
        }
    },

    /**
     * 보여주기
     * elId : 엘리먼트 아이디
     */
    show: function(elId) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            elmt.style.display = "";
        }
    },

    /**
     * 숨김
     * elId : 엘리먼트 아이디
     */
    hide: function(elId) {
        var elmt = this.getElObj(elId);

        if (elmt != null) {
            elmt.style.display = "none";
        }
    },

    /**
     * 준비
     * callback : 콜백함수
     */
    ready: function(callback) {
        if (typeof callback === "function") {
            if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
                // 콜백함수
                callback();
            } else {
                window.addEventListener("DOMContentLoaded", callback, false);
            }
        }
    }

};

/**
 * requestAnimationFrame
 */
var reqAnimatFrame = (function() {
    return window.requestAnimationFrame ||
           function(callback) {
               return window.setTimeout(callback, 1000 / 60);
           };
})();

/**
 * cancelAnimationFrame
 */
var cnclAnimatFrame = (function() {
    return window.cancelAnimationFrame ||
           function(id) {
               window.clearTimeout(id);
           };
})();

window.requestAnimationFrame = reqAnimatFrame;
window.cancelAnimationFrame = cnclAnimatFrame;
