/**
 * Description : 회원 아이디 찾기
 * Author      : atom
 * Date        : 2020.07.16
 */
var memIdFindApp = new Vue({
    el: "#memberIdFind",
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

                // 회원ID 찾기
                AjaxUtil.post({
                    url: "/member/rest/findMbrId",
                    param: {
                        userNm: this.mailVo.userNm,
                        email: this.mailVo.email,
                        authKey: this.mailVo.authKey
                    },
                    reqType: "url",
                    success: function(response) {
                        $this.mailVo.authKey = "";
                        $this.mailVo.authSendYn = false;

                        LayerUtil.alert({
                            msg: "인증이 완료되었습니다.<br />아이디 : " + response.data,
                            callback: function() {
                                WebUtil.goLogin();
                            }
                        });
                    }
                });
            } else {
                if (!this.isValidSms()) {
                    return false;
                }

                // 회원ID 찾기
                AjaxUtil.post({
                    url: "/member/rest/findMbrId",
                    param: {
                        userNm: this.smsVo.userNm,
                        mphonNo: this.smsVo.mphonNo,
                        authKey: this.smsVo.authKey
                    },
                    reqType: "url",
                    success: function(response) {
                        $this.smsVo.authKey = "";
                        $this.smsVo.authSendYn = false;

                        LayerUtil.alert({
                            msg: "인증이 완료되었습니다.<br />아이디 : " + response.data,
                            callback: function() {
                                WebUtil.goLogin();
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
