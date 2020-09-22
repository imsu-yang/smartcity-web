/**
 * Description : 회원 찾기 mixin
 * Author      : atom
 * Date        : 2020.08.10
 */
var mbrFindMixin = {

    data: function() {
        return {
            // 인증유형코드 - MAIL, SMS
            authTpCd: "",

            // 메일정보
            mailVo: {
                mbrId:  "",
                userNm:  "",
                email: "",
                authKey: "",
                authSendYn: false
            },

            // sms정보
            smsVo: {
                mbrId:  "",
                userNm:  "",
                mphonNo: "",
                authKey: "",
                authSendYn: false
            }
        };
    },

    watch: {
        /**
         * 인증유형코드
         */
        authTpCd: function(newVal, oldVal) {
            if (newVal == "MAIL") {
                this.smsVo.mbrId = "";
                this.smsVo.userNm = "";
                this.smsVo.mphonNo = "";
                this.smsVo.authKey = "";
                this.smsVo.authSendYn = false;
            } else if (newVal == "SMS") {
                this.mailVo.mbrId = "";
                this.mailVo.userNm = "";
                this.mailVo.email = "";
                this.mailVo.authKey = "";
                this.mailVo.authSendYn = false;
            }
        }
    },

    methods: {
        /**
         * 메일 인증 클릭
         */
        onMailAuthClick: function() {
            if (this.authTpCd != "MAIL") {
                return false;
            }

            if (DocUtil.getElId("mailMbrId") != null) {
                if (WebUtil.isNull(this.mailVo.mbrId)) {
                    LayerUtil.alert({
                        msg: "아이디를 입력해주세요.",
                        callback: function() {
                            DocUtil.getElId("mailMbrId").focus();
                        }
                    });
                    return false;
                }
            }

            if (WebUtil.isNull(this.mailVo.userNm)) {
                LayerUtil.alert({
                    msg: "이름을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mailUserNm").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.mailVo.email)) {
                LayerUtil.alert({
                    msg: "이메일을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mailEmail").focus();
                    }
                });
                return false;
            }

            if (!WebUtil.isValidEmail(this.mailVo.email)) {
                LayerUtil.alert({
                    msg: "이메일을 형식에 맞게 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mailEmail").focus();
                    }
                });
                return false;
            }

            var $this = this;

            // 메일 인증키 발송
            AjaxUtil.post({
                url: "/member/rest/sendMailAuthKey",
                param: {
                    mbrId: this.mailVo.mbrId,
                    userNm: this.mailVo.userNm,
                    email: this.mailVo.email
                },
                reqType: "url",
                success: function(response) {
                    LayerUtil.alert({
                        msg: "이메일로 인증번호가 발송되었습니다.",
                        callback: function() {
                            $this.mailVo.authSendYn = true;
                            $this.$nextTick(function() {
                                DocUtil.getElId("mailAuthKey").focus();
                            });
                        }
                    });
                }
            });
        },

        /**
         * sms 인증 클릭
         */
        onSmsAuthClick: function() {
            if (this.authTpCd != "SMS") {
                return false;
            }

            if (DocUtil.getElId("smsMbrId") != null) {
                if (WebUtil.isNull(this.smsVo.mbrId)) {
                    LayerUtil.alert({
                        msg: "아이디를 입력해주세요.",
                        callback: function() {
                            DocUtil.getElId("smsMbrId").focus();
                        }
                    });
                    return false;
                }
            }

            if (WebUtil.isNull(this.smsVo.userNm)) {
                LayerUtil.alert({
                    msg: "이름을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("smsUserNm").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.smsVo.mphonNo)) {
                LayerUtil.alert({
                    msg: "휴대전화를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("smsMphonNo").focus();
                    }
                });
                return false;
            }

            // sms 인증키 발송
            AjaxUtil.post({
                url: "/member/rest/sendSmsAuthKey",
                param: {
                    mbrId: this.smsVo.mbrId,
                    userNm: this.smsVo.userNm,
                    mphonNo: this.smsVo.mphonNo
                },
                reqType: "url",
                success: function(response) {
                    LayerUtil.alert({
                        msg: "휴대폰으로 인증번호가 발송되었습니다.",
                        callback: function() {
                            $this.smsVo.authSendYn = true;
                            $this.$nextTick(function() {
                                DocUtil.getElId("smsAuthKey").focus();
                            });
                        }
                    });
                }
            });
        },

        /**
         * 메일 유효성 체크
         */
        isValidMail: function(callback) {
            if (!this.mailVo.authSendYn) {
                LayerUtil.alert({
                    msg: "이메일 인증을 진행해주세요.",
                    callback: function() {
                        DocUtil.getElId("mailEmail").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.mailVo.authKey)) {
                LayerUtil.alert({
                    msg: "인증번호를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mailAuthKey").focus();
                    }
                });
                return false;
            }

            return true;
        },

        /**
         * SMS 유효성 체크
         */
        isValidSms: function(callback) {
            if (!this.smsVo.authSendYn) {
                LayerUtil.alert({
                    msg: "휴대폰 인증을 진행해주세요.",
                    callback: function() {
                        DocUtil.getElId("smsMphonNo").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.smsVo.authKey)) {
                LayerUtil.alert({
                    msg: "인증번호를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("smsAuthKey").focus();
                    }
                });
                return false;
            }

            return true;
        }
    }

};
