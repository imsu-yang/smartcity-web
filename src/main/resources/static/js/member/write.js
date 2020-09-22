/**
 * Description : 회원 등록
 * Author      : atom
 * Date        : 2020.07.16
 */
var memWritApp = new Vue({
    el: "#memberWrite",
    data: {
        // 회원정보
        mbrVo: {
            joinAgreYn: "N",    /* 가입약관동의여부 */
            plcyAgreYn: "N",    /* 개인정보취급방침동의여부 */
            mbrId: "",          /* 아이디 */
            mbrIdChkYn: false,  /* 아이디중복여부 */
            userNm: "",         /* 이름 */
            mbrPwd: "",         /* 비밀번호 */
            mbrPwdChk: "",      /* 비밀번호확인 */
            email: "",
            emailId: "",        /* 이메일주소(앞) */
            emailDomn: "",      /* 이메일주소(뒤) */
            mphonNo: "",        /* 휴대폰번호(full) */
            mphonNo1: "010",    /* 휴대폰번호(앞) */
            mphonNo2: "",       /* 휴대폰번호(가운데) */
            mphonNo3: "",       /* 휴대폰번호(뒤) */
            emailRecptnYn: "N", /* 이메일수신허용 */
            smsRecptnYn: "N"    /* sms수신허용 */
        }
    },
    watch: {
        "mbrVo.mbrId": function(newVal, oldVal) {
            this.mbrVo.mbrIdChkYn = false;
        }
    },
    methods: {
        /**
         * 회원 아이디 중복 클릭
         */
        onMbrIdDupClick: function() {
            var $this = this;

            if (WebUtil.isNull(this.mbrVo.mbrId)) {
                LayerUtil.alert({
                    msg: "아이디를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrId").focus();
                    }
                });
                return false;
            }

            // 회원 중복 건수 조회
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/member/selectMbrDupCount",
                param: { mbrId: this.mbrVo.mbrId },
                success: function(response) {
                    if (response.data === 0) {
                        LayerUtil.alert({ msg: "사용가능한 아이디입니다." });
                        $this.mbrVo.mbrIdChkYn = true;
                    } else {
                        LayerUtil.alert({ msg: "중복된 아이디입니다." });
                        $this.mbrVo.mbrIdChkYn = false;
                    }
                }
            });
        },

        /**
         * 취소버튼 클릭시 처리
         */
        onCnclClick: function() {
            window.history.back();
        },

        /**
         * 확인버튼 클릭시 처리
         */
        procJoin: function() {
            if (this.isValidForm()) {
                var $this = this;

                LayerUtil.confirm({
                    msg: "회원가입 하시겠습니까?",
                    callback: function(resYn) {
                        if (resYn) {
                            // 회원 등록
                            AjaxUtil.post({
                                url: GblVar.apiUrl + "/api/member/insertMbr",
                                param: $this.mbrVo,
                                reqType: "url",
                                success: function(response) {
                                    LayerUtil.alert({
                                        msg: "회원가입이 완료되었습니다.",
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

        /**
         * 폼 유효성 체크
         */
        isValidForm: function() {
            var $this = this;

            if (this.mbrVo.joinAgreYn == "N") {
                LayerUtil.alert({
                    msg: "회원가입약관에 동의해주세요.",
                    callback: function() {
                        DocUtil.getElId("joinAgreYnLabel").scrollIntoView();
                    }
                });
                return false;
            }

            if (this.mbrVo.plcyAgreYn == "N") {
                LayerUtil.alert({
                    msg: "개인정보취급방침에 동의해주세요.",
                    callback: function() {
                        DocUtil.getElId("plcyAgreYnLabel").scrollIntoView();
                    }
                });
                return false;
            }

            // 아이디 체크
            var regex = /^[a-z]+[a-z0-9]{5,11}$/;

            if (!regex.test(this.mbrVo.mbrId)) {
                LayerUtil.alert({
                    msg: "아이디는 영문,숫자 조합 6~12자리를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrId").focus();
                    }
                });
                return false;
            }

            // 아이디 중복 체크
            if (this.mbrVo.mbrIdChkYn === false) {
                LayerUtil.alert({ msg: "아이디 중복을 확인해주세요." });
                return false;
            }

            if (WebUtil.isNull(this.mbrVo.userNm)) {
                LayerUtil.alert({
                    msg: "이름을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("userNm").focus();
                    }
                });
                return false;
            }

            // 비밀번호 체크
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

            // 이메일 체크
            if (WebUtil.isNull(this.mbrVo.emailId) || WebUtil.isNull(this.mbrVo.emailDomn)) {
                LayerUtil.alert({
                    msg: "이메일을 입력해주세요.",
                    callback: function() {
                        if (WebUtil.isNull($this.mbrVo.emailId)) {
                            DocUtil.getElId("emailId").focus();
                        } else {
                            DocUtil.getElId("emailDomn").focus();
                        }
                    }
                });
                return false;
            }

            this.mbrVo.email = this.mbrVo.emailId + "@" + this.mbrVo.emailDomn;

            if (!WebUtil.isValidEmail(this.mbrVo.email)) {
                LayerUtil.alert({
                    msg: "이메일을 형식에 맞게 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("emailId").focus();
                    }
                });
                return false;
            }

            // 휴대폰번호 체크
            if (WebUtil.isNull(this.mbrVo.mphonNo1) || WebUtil.isNull(this.mbrVo.mphonNo2) || WebUtil.isNull(this.mbrVo.mphonNo3)) {
                LayerUtil.alert({
                    msg: "핸드폰번호를 입력해주세요.",
                    callback: function() {
                        if (WebUtil.isNull($this.mbrVo.mphonNo1)) {
                            DocUtil.getElId("mphonNo1").focus();
                        } else if (WebUtil.isNull($this.mbrVo.mphonNo2)) {
                            DocUtil.getElId("mphonNo2").focus();
                        } else {
                            DocUtil.getElId("mphonNo3").focus();
                        }
                    }
                });
                return false;
            }

            this.mbrVo.mphonNo = this.mbrVo.mphonNo1 + this.mbrVo.mphonNo2 + this.mbrVo.mphonNo3;
            var phonRegex = /(01[0|1|6|9|7])(\d{3}|\d{4})(\d{4}$)/g;

            if (!phonRegex.test(this.mbrVo.mphonNo)) {
                LayerUtil.alert({
                    msg: "핸드폰번호 형식에 맞게 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mphonNo1").focus();
                    }
                });
            }

            return true;
        },

        /**
         * 이메일 도메인 변경
         */
        onEmilDomnChange: function(domn) {
            this.mbrVo.emailDomn = domn;

            if(domn == ""){
                $("#emailDomn").removeAttr("readonly");
            }else{
                $("#emailDomn").attr("readonly", "readonly");
            }
        },

        /**
         *  전화번호 앞자리 변경
         */
        onMphonNo1Change: function(val) {
            this.mbrVo.mphonNo1 = val;
        }
    },
    mounted: function() {
        window.addEventListener("load", function() {
            DocUtil.getElId("memberWrite").reset();
        }, false);
    }
});
