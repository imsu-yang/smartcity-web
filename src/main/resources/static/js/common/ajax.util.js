/**
 * File Name   : ajax.util.js
 * Description : 아작스 유틸 자바스크립트
 * Author      : atom
 * Date        : 2020.07.15
 */

var AjaxUtil = {

    /**
     * GET 방식
     */
    get: function(opt) {
        // 응답 유형
        opt.resType = WebUtil.nvl(opt.resType, "json");

        // 호출 유형
        var callType = "get";

        if (opt.callType === "delete") {
            callType = opt.callType;
        }

        // 로그여부
        var loadYn = WebUtil.nvl(opt.loadYn, true);

        // 로딩바 열기
        this.openLoadBar(loadYn);

        // ajax 호출
        return axios({
            method: callType,
            url: opt.url,
            params: opt.param,
            headers: { "X-Requested-With": "XMLHttpRequest" },
            responseType: opt.resType
        }).then(function(response) {
            AjaxUtil.successHandler(opt, response.data, response.headers);
        }).catch(function(error) {
            AjaxUtil.errorHandler(opt.error, error);
        }).then(function() {
            // 로딩바 닫기
            AjaxUtil.closeLoadBar(loadYn);

            if (typeof opt.complete === "function") {
                opt.complete();
            }
        });
    },

    /**
     * DELETE 방식
     */
    "delete": function(opt) {
        opt.callType = "delete";
        this.get(opt);
    },

    /**
     * POST 방식
     */
    post: function(opt) {
        var param = null;
        var reqType = WebUtil.nvl(opt.reqType, "json");
        var contType = "application/x-www-form-urlencoded; charset=UTF-8";
        var async = WebUtil.nvl(opt.async, true);
        var loadYn = WebUtil.nvl(opt.loadYn, true);

        // 파라미터 json 설정
        if (reqType == "json") {
            param = JSON.stringify(opt.param);
            contType = "application/json; charset=UTF-8";
        } else {
            param = WebUtil.getParamUrl(opt.param);
        }

        // 응답 유형
        opt.resType = WebUtil.nvl(opt.resType, "json");

        // 호출 유형
        var callType = "post";

        if (opt.callType === "put") {
            callType = opt.callType;
        }

        // 로딩바 열기
        this.openLoadBar(loadYn);

        // ajax 호출
        return axios({
            method: callType,
            url: opt.url,
            data: param,
            headers: {
                "Content-Type": contType,
                "X-Requested-With": "XMLHttpRequest"
            },
            responseType: opt.resType
        }).then(function(response) {
            AjaxUtil.successHandler(opt, response.data, response.headers);
        }).catch(function(error) {
            AjaxUtil.errorHandler(opt.error, error);
        }).then(function() {
            // 로딩바 닫기
            AjaxUtil.closeLoadBar(loadYn);

            if (typeof opt.complete === "function") {
                opt.complete();
            }
        });
    },

    /**
     * PUT 방식
     */
    put: function(opt) {
        opt.callType = "put";
        this.post(opt);
    },

    /**
     * FormData 방식
     */
    form: function(opt) {
        // FormData 체크
        if ((opt.param instanceof FormData) === false) {
            alert("FormData 파라미터를 설정해주세요.");
            return false;
        }

        // 응답 유형
        opt.resType = "json";

        // 로그여부
        var loadYn = WebUtil.nvl(opt.loadYn, true);

        // 로딩바 열기
        this.openLoadBar(loadYn);

        // ajax 호출
        return axios({
            method: "post",
            url: opt.url,
            data: opt.param,
            headers: { "X-Requested-With": "XMLHttpRequest" },
            responseType: opt.resType
        }).then(function(response) {
            AjaxUtil.successHandler(opt, response.data, response.headers);
        }).catch(function(error) {
            AjaxUtil.errorHandler(opt.error, error);
        }).then(function() {
            // 로딩바 닫기
            AjaxUtil.closeLoadBar(loadYn);

            if (typeof opt.complete === "function") {
                opt.complete();
            }
        });
    },

    /**
     * 로딩바 열기
     */
    openLoadBar: function(loadYn) {
        var loadBarElmt = DocUtil.getElId("loadingBar");

        if (loadYn && WebUtil.isNull(loadBarElmt.style.opacity)) {
            // body 클래스 추가
            // DocUtil.addClass(document.body, "layer_activated");

            // 활성화
            loadBarElmt.style.display = "";
            loadBarElmt.style.opacity = 1;
        }
    },

    /**
     * 로딩바 닫기
     */
    closeLoadBar: function(loadYn) {
        var loadBarElmt = DocUtil.getElId("loadingBar");

        if (loadYn && loadBarElmt.style.opacity == 1) {
            // fade out
            DocUtil.fadeOut(loadBarElmt, function() {
                // body 클래스 제거
                // DocUtil.removeClass(document.body, "layer_activated");

                // 초기화
                loadBarElmt.style.opacity = "";
            });
        }
    },

    /**
     * 성공 핸들러
     */
    successHandler: function(opt, resData, resHeader) {
        if (typeof opt.success === "function") {
            if (opt.resType == "json") {
                if (resData.status === true) {
                    try {
                        opt.success(resData, resHeader);
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    var errMsg = "서버에 일시적인 문제가 생겼습니다.<br />잠시후에 다시 이용해주세요.";

                    /*
                    if (WebUtil.isNotNull(resData.message)) {
                        errMsg = resData.message;
                    }
                    errMsg = WebUtil.replaceAll(errMsg, "\n", "<br />");
                    */

                    if (typeof opt.error === "function") {
                        try {
                            opt.error(errMsg, resData);
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        LayerUtil.alert({ msg: errMsg });
                    }
                }
            } else {
                opt.success(resData, resHeader);
            }
        }
    },

    /**
     * 에러 핸들러
     */
    errorHandler: function(callback, error) {
        var errMsg = "서버에 일시적인 문제가 생겼습니다.\n잠시후에 다시 이용해주세요.";

        if (error.response) {
            var resData = error.response.data;

            // 사용자 에러 체크
            if (WebUtil.isObject(resData) && resData.code === 999 && WebUtil.isNotNull(resData.message)) {
                errMsg = resData.message;
            }

        } else if (error.request) {
            var resTxt = error.request.responseText;

            if (WebUtil.isNotNull(resTxt)) {
                var resData = JSON.parse(resTxt);

                // 사용자 에러 체크
                if (WebUtil.isObject(resData) && resData.code === 999 && WebUtil.isNotNull(resData.message)) {
                    errMsg = resData.message;
                }
            }
        } else {
            // console.log("error", error.message);
        }

        errMsg = WebUtil.replaceAll(errMsg, "\\\\n", "\n");

        if (typeof callback === "function") {
            try {
                callback(errMsg);
            } catch (e) {
                console.error(e);
            }
        } else {
            errMsg = WebUtil.replaceAll(errMsg, "\n", "<br />");
            LayerUtil.alert({ msg: errMsg });
        }
    }

};
