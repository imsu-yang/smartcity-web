/**
 * File Name   : web.util.js
 * Description : 웹 유틸 자바스크립트
 * Author      : atom
 * Date        : 2020.07.15
 */

var WebUtil = {

    /**
     * null 체크
     * str : 문자열
     */
    isNull: function(str) {
        var type = typeof str;

        if (type === "undefined" || str === null) {
            return true;
        }

        if (type === "string" && this.trim(str) == "") {
            return true;
        }

        return false;
    },

    /**
     * not null 체크
     * str : 문자열
     */
    isNotNull: function(str) {
        return !this.isNull(str);
    },

    /**
     * object 체크
     * obj : 오브젝트
     */
    isObject: function(obj) {
        if (obj !== null && typeof obj === "object") {
            return true;
        }

        return false;
    },

    /**
     * 숫자 체크 체크
     * num : 숫자
     */
    isNumber: function(num) {
        var regex = /^[0-9]+$/;
        return regex.test(num);
    },

    /**
     * 좌우 공백제거
     * str : 문자열
     */
    trim: function(str) {
        if (typeof str === "string") {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }

        return str;
    },

    /**
     * null 값 바꾸기
     * str : 문자열
     * val : null 대체값
     */
    nvl: function(str, val) {
        if (this.isNull(str)) {
            return val;
        }

        return this.trim(str);
    },

    /**
     * 전체 치환
     * str     : 문자열
     * pattern : 패턴
     * re      : 치환될 문자
     */
    replaceAll: function(str, pattern, re) {
        var type = typeof str;

        if (type === "string" || type === "number") {
            var temp = this.trim(str) + "";

            if (temp != "") {
                return temp.replace(new RegExp(pattern, "g"), re);
            }
        }

        return str;
    },

    /**
     * 천단위 콤마 추가
     * str : 숫자, 문자열
     */
    addThousandComma: function(str) {
        var type = typeof str;

        if (type === "string" || type === "number") {
            var temp = this.trim(str) + "";

            if (temp != "") {
                return temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }

        return str;
    },

    /**
     * 이메일 체크
     * str : 문자열
     */
    isValidEmail: function(str) {
        if (typeof str === "string") {
            var pattern = /^[0-9a-z]([-_\.]?[0-9a-z])*@[0-9a-z]([-_\.]?[0-9a-z])*\.[a-z]{2,3}$/i;

            if (pattern.test(str)) {
                return true;
            }
        }

        return false;
    },

    /**
     * 엔터 BR 변환
     * str : 문자열
     */
    enterToBr: function(str) {
        if (typeof str === "string") {
            return str.replace(/(?:\r\n|\r|\n)/g, "<br />");
        }

        return str;
    },

    /**
     * 파라미터 URL 구하기
     */
    getParamUrl: function(obj) {
        var result = "";

        if (this.isObject(obj)) {
            var m = 0;

            for (var key in obj) {
                if (m > 0) {
                    result += "&"
                }

                result += key + "=" + encodeURIComponent(obj[key]);

                m++;
            }
        }

        return result;
    },

    /**
     * 홈 이동
     */
    goHome: function() {
        window.location.href = "/";
    },

    /**
     * 로그인 이동
     */
    goLogin: function() {
        window.location.href = "/member/login";
    },

    /**
     * 현재 기준 월 구하기
     */
    getDateByMonth: function(val) {
        var now   = new Date();
        now.setMonth(now.getMonth() + val);
        var year  = now.getFullYear();
        var month = now.getMonth() + 1;
        var day   = now.getDate();

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) {
            day = "0" + day;
        }

        return year + "-" + month + "-" + day;
    },

    /**
     * 0 채우기
     */
    zeroPad: function(val, num) {
        val = val + "";
        var len = val.length;

        if (len >= num) {
            return val;
        }

        return new Array(num - len + 1).join("0") + val;
    }

};
