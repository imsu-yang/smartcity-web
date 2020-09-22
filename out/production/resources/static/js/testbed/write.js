
var testbedWriteApp = new Vue({
    el: "#testbedWrite",
    data: {
        regstSeq: null,
        regstDt: '',
        cretrId: SessionUtil.getMbrId(),
        regstName: '',
        rphonNo: '',
        rEmail: '',
        companyName: '',
        usePurpose: ''
    },
    methods: {

        initPage: function() {
            jQuery.datetimepicker.setLocale('ko');	 //언어 선언
            $('.cal_box input').datetimepicker({
                timepickerScrollbar:true,
                scrollMonth:false,
            });
        },
        write: function () {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                if (this.isValidForm()) {

                    AjaxUtil.post({
                        url: GblVar.apiUrl + "/api/comregst",
                        param: {
                            cretrId: SessionUtil.getMbrId(),
                            regstDt: $("#regstDt").val(),
                            // regstDt: $this.regstDt,
                            regstName: $this.regstName,
                            email: $this.rEmail,
                            rphonNo: $this.rphonNo,
                            companyName: $this.companyName,
                            usePurpose: $this.usePurpose
                        },
                        reqType: "json",
                        success: function(response) {
                            LayerUtil.confirm({
                                msg: "컨설팅 신청이 완료되었습니다. 마이페이지 > 예약현황 화면으로 이동합니다.",
                                callback: function(resYn) {
                                    if (resYn) {
                                        window.location.href = "/mypage/status/list";
                                    }
                                }
                            });
                        }
                    });

                }
            } else {
                WebUtil.goLogin();
            }

        },
        isValidForm: function() {

            if (WebUtil.isNull($("#regstDt").val())) {
                LayerUtil.alert({
                    msg: "날짜를 입력해주세요.",
                    callback: function () {
                    }
                });
                return false;
            }


            if (WebUtil.isNull(this.rphonNo)) {
                LayerUtil.alert({
                    msg: "핸드폰 번호를 입력해주세요.",
                    callback: function () {
                        DocUtil.getElId("rphonNo").focus();
                    }
                });
                return false;
            }

            var phonRegex = /(01[0|1|6|9|7])(\d{3}|\d{4})(\d{4}$  )/g;

            if (!phonRegex.test(this.rphonNo)) {
                LayerUtil.alert({
                    msg: "핸드폰번호는 숫자만 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("rphonNo").focus();
                    }
                });

                return false;s
            }

            if (!WebUtil.isValidEmail(this.rEmail)) {
                LayerUtil.alert({
                    msg: "이메일을 형식에 맞게 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("rEmail").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.usePurpose)) {
                LayerUtil.alert({
                    msg: "이용목적을 입력해주세요.",
                    callback: function () {
                        DocUtil.getElId("usePurpose").focus();
                    }
                });
                return false;
            }






            return true;
        }
    },
    mounted: function() {

        this.initPage();


    }

});
