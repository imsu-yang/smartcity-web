/**
 * Description : 회원 비밀번호 재설정
 * Author      : atom
 * Date        : 2020.07.16
 */
var memPwdRstApp = new Vue({
    el: "#memberPasswordReset",
    data: {
        mbrPwd: "",
        mbrPwdChk: ""
    },
    methods: {
        /**
         * 확인 클릭
         */
        onCfrmClick: function() {
            // 비밀번호 체크
            var $this = this;
            var num = this.mbrPwd.search(/[0-9]/g);
            var eng = this.mbrPwd.search(/[a-z]/gi);
            var spe = this.mbrPwd.search(/[~!@#$%^&*()_+|<>?:{}\-]/);
            var blank = this.mbrPwd.search(/\s/);
            var mbrPwdLen = this.mbrPwd.length;

            if (mbrPwdLen < 8 || mbrPwdLen > 18 || num < 0 || eng < 0 || spe < 0 || blank > -1) {
                LayerUtil.alert({
                    msg: "비밀번호는 영문,숫자 및 특수문자 조합 8~18자를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrPwd").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.mbrPwdChk)) {
                LayerUtil.alert({
                    msg: "비밀번호 확인을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrPwdChk").focus();
                    }
                });
                return false;
            }

            if (this.mbrPwd != this.mbrPwdChk) {
                LayerUtil.alert({
                    msg: "비밀번호가 다릅니다. 다시 확인해 주세요.",
                    callback: function() {
                        $this.mbrPwdChk = "";
                        DocUtil.getElId("mbrPwdChk").focus();
                    }
                });
                return false;
            }

            LayerUtil.confirm({
                msg: "비밀번호를 재설정 하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        // 비밀번호 재설정 처리
                        AjaxUtil.post({
                            url: "/member/rest/procPwdRst",
                            param: {
                                mbrId: "",
                                mbrPwd: $this.mbrPwd
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "비밀번호가 재설정되었습니다.",
                                    callback: function() {
                                        window.location.href = "/member/login";
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    },
    mounted: function() {
        // 비밀번호 포커스
        DocUtil.getElId("mbrPwd").focus();
    }
});
