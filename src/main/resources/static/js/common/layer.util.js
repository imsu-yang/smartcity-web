/**
 * File Name   : layer.util.js
 * Description : 레이어 유틸 자바스크립트
 * Author      : atom
 * Date        : 2020.07.15
 */

var LayerUtil = {

    /**
     * alert
     */
    alert: function(opt) {
        // 텍스트 설정
        document.getElementById("alertLayerMsg").innerHTML = WebUtil.nvl(opt.msg, "");
        document.getElementById("alertLayerBtnOk").innerText = WebUtil.nvl(opt.btnOk, "확인");

        // body class 추가
        // DocUtil.addClass(document.body, "layer_full");

        // dispay 활성화
        DocUtil.fadeIn("alertLayerWrap", function() {
            document.getElementById("alertLayerBtnOk").focus();
        });

        // 확인 버튼 이벤트
        document.getElementById("alertLayerBtnOk").onclick = function(event) {
            event.preventDefault();

            // fade out
            DocUtil.fadeOut("alertLayerWrap", function() {
                // 초기화
                initAlert();

                // 콜백함수
                if (typeof opt.callback === "function") {
                    opt.callback();
                }
            });
        };

        /*
        // 닫기 버튼 이벤트
        document.getElementById("alertLayerBtnClose").onclick = function(event) {
            event.preventDefault();

            // fade out
            DocUtil.fadeOut("alertLayerWrap", function() {
                // 초기화
                initAlert();
            });
        };
        */

        // 초기화
        function initAlert() {
            // 초기화
            // DocUtil.removeClass(document.body, "layer_full");
            document.getElementById("alertLayerMsg").innerHTML = "";
            document.getElementById("alertLayerBtnOk").innerText = "확인";
        }
    },

    /**
     * confirm
     */
    confirm: function(opt) {
        // 텍스트 설정
        document.getElementById("confirmLayerMsg").innerHTML = WebUtil.nvl(opt.msg, "");
        document.getElementById("confirmLayerBtnOk").innerText = WebUtil.nvl(opt.btnOk, "확인");
        document.getElementById("confirmLayerBtnCncl").innerText = WebUtil.nvl(opt.btnCncl, "취소");

        // body class 추가
        // DocUtil.addClass(document.body, "layer_full");

        // dispay 활성화
        DocUtil.fadeIn("confirmLayerWrap", function() {
            document.getElementById("confirmLayerBtnCncl").focus();
        });

        // 확인 버튼
        document.getElementById("confirmLayerBtnOk").onclick = function(event) {
            event.preventDefault();

            // fade out
            DocUtil.fadeOut("confirmLayerWrap", function() {
                // 초기화
                initConfirm();

                // 콜백함수
                if (typeof opt.callback === "function") {
                    opt.callback(true);
                }
            });
        };

        // 취소 버튼
        document.getElementById("confirmLayerBtnCncl").onclick = function(event) {
            event.preventDefault();

            // fade out
            DocUtil.fadeOut("confirmLayerWrap", function() {
                // 초기화
                initConfirm();

                // 콜백함수
                if (typeof opt.callback === "function") {
                    opt.callback(false);
                }
            });
        };

        /*
        // 닫기 버튼 이벤트
        document.getElementById("confirmLayerBtnClose").onclick = function(event) {
            event.preventDefault();

            // fade out
            DocUtil.fadeOut("confirmLayerWrap", function() {
                // 초기화
                initConfirm();

                // 콜백함수
                if (typeof opt.callback === "function") {
                    opt.callback(false);
                }
            });
        };
        */

        // 초기화
        function initConfirm() {
            // 초기화
            // DocUtil.removeClass(document.body, "layer_full");
            document.getElementById("confirmLayerMsg").innerHTML = "";
            document.getElementById("confirmLayerBtnOk").innerText = "확인";
            document.getElementById("confirmLayerBtnCncl").innerText = "취소";
        }
    }

};
