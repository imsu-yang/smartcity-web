/**
 * Description : 회원 비밀번호 찾기
 * Author      : atom
 * Date        : 2020.07.16
 */
var memPwdFindApp = new Vue({
    el: "#memberPasswordFind",
    data: {},
    mixins: [mbrFindMixin],
    methods: {
        /**
         * 확인 클릭
         */
        onCfrmClick: function() {
            var $this = this;

            if (WebUtil.isNull(this.authTpCd)) {
                LayerUtil.alert({ msg: "인증유형을 선택해주세요." });
                return false;
            }

            if (this.authTpCd == "MAIL") {
                if (!this.isValidMail()) {
                    return false;
                }

                // 회원 비밀번호 찾기
                AjaxUtil.post({
                    url: "/member/rest/findMbrPwd",
                    param: {
                        mbrId: this.mailVo.mbrId,
                        userNm: this.mailVo.userNm,
                        email: this.mailVo.email,
                        authKey: this.mailVo.authKey
                    },
                    reqType: "url",
                    success: function(response) {
                        $this.mailVo.authKey = "";
                        $this.mailVo.authSendYn = false;

                        LayerUtil.alert({
                            msg: "인증이 완료되었습니다.",
                            callback: function() {
                                window.location.href = "/member/passwordReset";
                            }
                        });
                    }
                });
            } else {
                if (!this.isValidSms()) {
                    return false;
                }

                // 회원 비밀번호 찾기
                AjaxUtil.post({
                    url: "/member/rest/findMbrPwd",
                    param: {
                        mbrId: this.smsVo.mbrId,
                        userNm: this.smsVo.userNm,
                        mphonNo: this.smsVo.mphonNo,
                        authKey: this.smsVo.authKey
                    },
                    reqType: "url",
                    success: function(response) {
                        $this.smsVo.authKey = "";
                        $this.smsVo.authSendYn = false;

                        LayerUtil.alert({
                            msg: "인증이 완료되었습니다.",
                            callback: function() {
                                window.location.href = "/member/passwordReset";
                            }
                        });
                    }
                });
            }
        }
    },
    mounted: function() {
    }
});
