/**
 * File Name   : session.util.js
 * Description : 세션 유틸 자바스크립트
 * Author      : atom
 * Date        : 2020.07.21
 */

var SessionUtil = {

    /**
     * 회원여부
     */
    getMbrYn: function() {
        if (document.getElementById("gblMbrYn") != null && document.getElementById("gblMbrYn").value == "Y") {
            return true;
        }

        return false;
    },

    /**
     * 회원아이디
     */
    getMbrId: function() {
        if (document.getElementById("gblMbrId") != null) {
            return document.getElementById("gblMbrId").value;
        }

        return "";
    },

    /**
     * 회원명
     */
    getMbrNm: function() {
        if (document.getElementById("gblMbrNm") != null) {
            return document.getElementById("gblMbrNm").value;
        }

        return "";
    },

    /**
     * 관리자여부
     */
    getAdminYn: function() {
        if (document.getElementById("gblMbrClas") != null && document.getElementById("gblMbrClas").value == "ROLE_ADMIN") {
            return true;
        }

        return false;
    },

    /**
     * 회원기본 회원일련번호
     */
    getMbrSeq: function() {
        if (document.getElementById("gblMbrSeq") != null) {
            return document.getElementById("gblMbrSeq").value;
        }

        return "";
    }

};