/**
 * File Name   : code.util.js
 * Description : 코드 유틸 자바스크립트
 * Author      : atom
 * Date        : 2020.08.02
 */

var CodeUtil = {

    /**
     * 공통코드 목록 조회
     */
    selectComCdList: function(grpCd, callback, loadYn) {
        return AjaxUtil.get({
            url: GblVar.apiUrl + "/api/common/code/selectComCdList",
            param: { cdGroupId: grpCd },
            loadYn: loadYn,
            success: function(response) {
                // 콜백함수
                if (typeof callback === "function") {
                    callback(response.data);
                }
            }
        });
    },

    /**
     * 디바이스 코드 목록 조회
     */
    selectDevCdList: function(mbrSeq, callback) {
        return AjaxUtil.post({
            url: GblVar.apiUrl + "/api/management/device/selectDevCdList",
            param: { mbrSeq: mbrSeq },
            reqType: "url",
            success: function(response) {
                // 콜백함수
                if (typeof callback === "function") {
                    callback(response.data);
                }
            }
        });
    },

    /**
     * 비교 디바이스 코드 목록 조회
     */
    selectCmprDevCdList: function(devId, callback) {
        return AjaxUtil.get({
            url: GblVar.apiUrl + "/api/management/device/selectCmprDevCdList",
            param: { devId: devId },
            success: function(response) {
                // 콜백함수
                if (typeof callback === "function") {
                    callback(response.data);
                }
            }
        });
    },

    /**
     * 디바이스 측정 코드 목록 조회
     */
    selectDevObsCdList: function(devId, callback) {
        return AjaxUtil.get({
            url: GblVar.apiUrl + "/api/management/device/selectDevObsCdList",
            param: { devId: devId },
            success: function(response) {
                if (typeof callback === "function") {
                    callback(response.data);
                }
            }
        });
    }

};
