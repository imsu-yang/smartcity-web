/**
 * Description : 이벤트 쓰기
 * Author      : atom
 * Date        : 2020.07.31
 */
var evtWriteApp = new Vue({
    el: "#eventWrite",
    data: {
        // 모드
        mode: "C",

        // 이벤트정보
        evtVo: {
            evntId: "",
            devId: "",
            evntOccrDiv: "",
            evntOccrCondDiv: "",
            evntOccrCondVal: "",
            andOrCode: "",
            recptnPhonNo: "",
            smsMsg: "",
            smsByte: 0
        },

        // 측정목록
        obsList: [],

        // 코드정보
        codeVo: {
            // 디바이스목록
            devList: [],

            // 디바이스측정목록
            devObsList: [],

            // 비교유형목록
            cmprTpList: []
        }
    },
    mixins: [evtCdMixin, evtDtlMixin],
    watch: {
        /**
         * 디바이스ID
         */
        "evtVo.devId": function(newVal, oldVal) {
            if (WebUtil.isNotNull(newVal)) {
                var $this = this;

                // 디바이스 측정 코드 목록 조회
                CodeUtil.selectDevObsCdList(newVal, function(resList) {
                    $this.codeVo.devObsList = resList;
                });
            }
        },

        /**
         * 이벤트발생구분
         */
        "evtVo.evntOccrDiv": function(newVal, oldVal) {
            // 디바이스측정
            if (newVal == "B" && this.obsList.length == 0) {
                this.obsList.push({
                    evntObsSeq: null,
                    obsItemId: "",
                    compareCode: "",
                    compareValue: ""
                });
            }
        },

        /**
         * SMS메세지
         */
        "evtVo.smsMsg": function(newVal, oldVal) {
            var pattern = /[\u0000-\u007f]|([\u0080-\u07ff]|(.))/g;
            this.evtVo.smsByte = newVal.replace(pattern, "$&$1$2").length;
        }
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            var $this = this;

            // 디바이스 목록 조회
            CodeUtil.selectDevCdList(this.mbrSeq, function(resList) {
                $this.codeVo.devList = resList;
            });

            // 비교 유형 목록 조회
            CodeUtil.selectComCdList("COMPCODE", function(resList) {
                $this.codeVo.cmprTpList = resList;
            });

            if (WebUtil.isNotNull(this.argVo.evntId)) {
                this.mode = "U";

                // 이벤트 상세 정보 조회
                this.selectEvtDtlInfo();
            }
        },

        /**
         * 이벤트 상세 정보 조회
         */
        selectEvtDtlInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/event/selectEvtDtlInfo",
                param: {
                    evntId: this.argVo.evntId,
                    mbrSeq: this.mbrSeq
                },
                success: function(response) {
                    $this.evtVo = response.data.evtInfo;
                    $this.obsList = response.data.obsList;
                },
                error: function(msg) {
                    LayerUtil.alert({
                        msg: msg,
                        callback: function() {
                            $this.onEvtInitMove();
                        }
                    });
                }
            });
        },

        /**
         * 이벤트 저장
         */
        saveEvt: function() {
            // 폼 유효성 체크
            if (!this.isValidForm()) {
                return false;
            }

            // 메세지
            var $this = this;
            var reqMsg = "등록하시겠습니까?";
            var cmptMsg = "등록되었습니다";

            if (this.mode == "U") {
                reqMsg = "수정하시겠습니까?";
                cmptMsg = "수정되었습니다";
            }

            LayerUtil.confirm({
                msg: reqMsg,
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/management/event/saveEvt",
                            param: {
                                evtInfo: $this.evtVo,
                                obsList: $this.obsList,
                                mode: $this.mode,
                                mbrSeq: $this.mbrSeq,
                                mbrId: $this.mbrId
                            },
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: cmptMsg,
                                    callback: function() {
                                        if ($this.mode == "U") {
                                            $this.onEvtListMove();
                                        } else {
                                            $this.onEvtInitMove();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 폼 유효성 체크
         */
        isValidForm: function() {
            if (WebUtil.isNull(this.evtVo.evntNm)) {
                LayerUtil.alert({
                    msg: "이벤트 이름을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("evntNm").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.evtVo.devId)) {
                LayerUtil.alert({
                    msg: "연관 디바이스를 선택해주세요.",
                    callback: function() {
                        DocUtil.getElId("devId").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.evtVo.evntOccrDiv)) {
                LayerUtil.alert({
                    msg: "이벤트 발생 구분을 선택해주세요.",
                    callback: function() {
                        DocUtil.getElId("evntOccrDivLabel").scrollIntoView();
                    }
                });
                return false;
            }

            // 디바이스연결성태
            if (this.evtVo.evntOccrDiv == "A") {
                if (WebUtil.isNull(this.evtVo.evntOccrCondVal)) {
                    LayerUtil.alert({
                        msg: "이벤트 발생 조건을 입력해주세요.",
                        callback: function() {
                            DocUtil.getElId("evntOccrCondVal").focus();
                        }
                    });
                    return false;
                }

                if (WebUtil.isNull(this.evtVo.evntOccrCondDiv)) {
                    LayerUtil.alert({
                        msg: "이벤트 발생 조건 구분을 선택해주세요.",
                        callback: function() {
                            DocUtil.getElId("evntOccrCondDiv").focus();
                        }
                    });
                    return false;
                }

            // 디바이스측정
            } else {
                if (!this.isValidDevObs()) {
                    return false;
                }
            }

            // SMS메시지 바이트 체크
            if (this.evtVo.smsByte > 90) {
                LayerUtil.alert({
                    msg: "SMS 메세지는 90bytes까지 입력 가능합니다.",
                    callback: function() {
                        DocUtil.getElId("smsMsg").focus();
                    }
                });
                return false;
            }

            return true;
        },

        /**
         * 디바이스 측정 유효성 체크
         */
        isValidDevObs: function() {
            var obsCnt = this.obsList.length;
            var m = 0;
            var k = 0;

            for (m = 0; m < obsCnt; m++) {
                if (WebUtil.isNull(DocUtil.getElId("obsItemId" + m).value)) {
                    LayerUtil.alert({
                        msg: "측정 항목을 선택해주세요.",
                        callback: function() {
                            DocUtil.getElId("obsItemId" + m).focus();
                        }
                    });
                    return false;
                }

                if (WebUtil.isNull(DocUtil.getElId("compareCode" + m).value)) {
                    LayerUtil.alert({
                        msg: "비교 코드를 선택해주세요.",
                        callback: function() {
                            DocUtil.getElId("compareCode" + m).focus();
                        }
                    });
                    return false;
                }

                if (WebUtil.isNull(DocUtil.getElId("compareValue" + m).value)) {
                    LayerUtil.alert({
                        msg: "비교 값을 입력해주세요.",
                        callback: function() {
                            DocUtil.getElId("compareValue" + m).focus();
                        }
                    });
                    return false;
                }

                // 중복 체크
                var dupYn = false;
                var dupIdx = 0;
                var dupMsg = "";

                for (k = 0; k < obsCnt; k++) {
                    if (k != m && this.obsList[k].obsItemId == this.obsList[m].obsItemId) {
                        dupYn = true;
                        dupIdx = k;
                        dupMsg = this.getDevObsItemNm(this.obsList[k].obsItemId) + " 측정항목이 중복되었습니다.";
                        break;
                    }
                }

                if (dupYn) {
                    LayerUtil.alert({
                        msg: dupMsg,
                        callback: function() {
                            DocUtil.getElId("obsItemId" + dupIdx).focus();
                        }
                    });
                    return false;
                }
            }

            if (WebUtil.isNull(this.evtVo.andOrCode)) {
                LayerUtil.alert({
                    msg: "AND/OR를 선택해주세요.",
                    callback: function() {
                        DocUtil.getElId("evntOccrCondLabel").scrollIntoView();
                    }
                });
                return false;
            }

            return true;
        },

        /**
         * 이벤트 취소
         */
        cnclEvt: function() {
            var $this = this;

            LayerUtil.confirm({
                msg: "이벤트 등록을 취소하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        $this.onEvtListMove();
                    }
                }
            });
        },

        /**
         * 디바이스 측정 아이템명 구하기
         */
        getDevObsItemNm: function(obsItemId) {
            var obsItemNm = "";
            var devObsCnt = this.codeVo.devObsList.length;
            var m = 0;

            for (m = 0;  m < devObsCnt; m++) {
                if (this.codeVo.devObsList[m].obsItemId == obsItemId) {
                    obsItemNm = this.codeVo.devObsList[m].obsItemNm;
                    break;
                }
            }

            return obsItemNm;
        },

        /**
         * and or 조건 클릭
         */
        onAndOrCondClick: function(cd) {
            this.evtVo.andOrCode = cd;
        },

        /**
         * 이벤트 발생 조건 추가 클릭
         */
        onEvtAccCondAddClick: function() {
            this.obsList.push({
                evntObsSeq: null,
                obsItemId: "",
                compareCode: "",
                compareValue: ""
            });
        },

        /**
         * 이벤트 발생 조건 삭제 클릭
         */
        onEvtAccCondDelClick: function(index) {
            if (this.obsList.length > 1) {
                // 배열 제거
                this.obsList.splice(index, 1);
            }
        }
    },
    mounted: function() {
        // 아규먼트 초기화
        this.initArg();

        // 페이지 초기화
        this.initPage();
    }
});
