/**
 * Description : 회원 정보
 * Author      : atom
 * Date        : 2020.07.18
 */
var mypageEditApp = new Vue({
    el: "#mypageEdit",
    data: {
        // 회원정보
        mbrVo: {
            mbrId: SessionUtil.getMbrId(),
            userNm: "",
            mbrPwd: "",
            mbrPwdChk: "",
            email: "",
            mphonNo: "",
            emailRecptnYn: "N",
            smsRecptnYn: "N"
        }
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            var $this = this;

            // 회원 정보 조회
            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/member/selectMbrInfo",
                param: { mbrId: this.mbrVo.mbrId },
                reqType: "url",
                success: function(response) {
                    $this.mbrVo.userNm        = response.data.userNm;
                    $this.mbrVo.email         = response.data.email;
                    $this.mbrVo.mphonNo       = response.data.mphonNo;
                    $this.mbrVo.emailRecptnYn = response.data.emailRecptnYn;
                    $this.mbrVo.smsRecptnYn   = response.data.smsRecptnYn;
                },
                error: function(msg) {
                    LayerUtil.alert({
                        msg: msg,
                        callback: function() {
                            WebUtil.goHome();
                        }
                    });
                }
            });
        },

        /**
         * 회원 수정
         */
        procEdit: function() {
            if (this.isValidForm()) {
                var $this = this;

                LayerUtil.confirm({
                    msg: "회원정보를 수정하시겠습니까?",
                    callback: function(resYn) {
                        if (resYn) {
                            // 회원 등록
                            AjaxUtil.post({
                                url: GblVar.apiUrl + "/api/member/updateMbr",
                                param: $this.mbrVo,
                                reqType: "url",
                                success: function(response) {
                                    LayerUtil.alert({
                                        msg: "회원정보가 수정되었습니다.",
                                        callback: function() {
                                            window.location.reload(true);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        },

        /**
         * 폼 유효성 체크
         */
        isValidForm: function() {
            var $this = this;

            // 비밀번호 체크
            if (WebUtil.isNotNull(this.mbrVo.mbrPwd) || WebUtil.isNotNull(this.mbrVo.mbrPwdChk)) {
                var num = this.mbrVo.mbrPwd.search(/[0-9]/g);
                var eng = this.mbrVo.mbrPwd.search(/[a-z]/gi);
                var spe = this.mbrVo.mbrPwd.search(/[~!@#$%^&*()_+|<>?:{}\-]/);
                var blank = this.mbrVo.mbrPwd.search(/\s/);
                var mbrPwdLen = this.mbrVo.mbrPwd.length;

                if (mbrPwdLen < 8 || mbrPwdLen > 18 || num < 0 || eng < 0 || spe < 0 || blank > -1) {
                    LayerUtil.alert({
                        msg: "비밀번호는 영문,숫자 및 특수문자 조합 8~18자를 입력해주세요.",
                        callback: function() {
                            DocUtil.getElId("mbrPwd").focus();
                        }
                    });
                    return false;
                }

                if (WebUtil.isNull(this.mbrVo.mbrPwdChk)) {
                    LayerUtil.alert({
                        msg: "비밀번호 확인을 입력해주세요.",
                        callback: function() {
                            DocUtil.getElId("mbrPwdChk").focus();
                        }
                    });
                    return false;
                }

                if (this.mbrVo.mbrPwd != this.mbrVo.mbrPwdChk) {
                    LayerUtil.alert({
                        msg: "비밀번호가 다릅니다. 다시 확인해 주세요.",
                        callback: function() {
                            $this.mbrVo.mbrPwdChk = "";
                            DocUtil.getElId("mbrPwdChk").focus();
                        }
                    });
                    return false;
                }
            }

            return true;
        }
    },
    mounted: function() {
        // 페이지 초기화
        this.initPage();
    }
});
