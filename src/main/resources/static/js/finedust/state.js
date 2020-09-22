/**
 * Description : 디바이스 상태
 * Author      : atom
 * Date        : 2020.07.26
 */
var fineDustStatApp = new Vue({
    el: "#fineDustState",
    data: {
        // 회원순번
        mbrSeq: null,

        // 파라미터정보
        paramVo: {
            // 디바이스아이디
            devId: "",

            // 시작일자
            strDt: null,

            // 종료일자
            endDt: null
        },

        // 합계정보
        totVo: {
            succCnt: 0,
            failCnt: 0,
            totCnt: 0,
            totHour: 0,
            oprtHour: 0,
            noprHour: 0
        },

        // 이벤트정보
        evtVo: {
            conCnt: 0,
            obsCnt: 0,
            totCnt: 0
        },

        // 이벤트측정목록
        evtObsList: [],

        // 이벤트로그목록
        evtLogList: [],

        // 이벤트로그정보
        evtLogVo: {
            // 행번호
            rowNum: 0,

            // 행수
            rowCnt: 10,

            // 전체건수
            totCnt: 0,

            // 전체페이지
            totPage: 0,

            // 현재페이지
            curPage: 1,

            // 노출 페이지
            dispPage: 5,

            // 이전페이지
            prevPage: 0,

            // 다음페이지
            nextPage: 0,

            // 내비페이지목록
            naviPageList: []
        },

        // 차트정보
        chrtVo: {
            totApp: null,
            oprtApp: null,
            evtApp: null,
            evtObsApp: null
        },

        // 코드정보
        codeVo: {
            // 디바이스목록
            devList: [],

            // 이벤트측정목록
            evtObsList: []
        }
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            var $this = this;
            var authMbrSeq = this.mbrSeq;

            if (SessionUtil.getAdminYn()) {
                authMbrSeq = "";
            }

            // 디바이스 코드 목록 조회
            var pro1 = CodeUtil.selectDevCdList(authMbrSeq, function(resList) {
                $this.codeVo.devList = resList;

                if ($this.codeVo.devList.length > 0) {
                    $this.onDevClick(0);
                }
            });

            // 이벤트 측정 목록 조회
            var pro2 = CodeUtil.selectComCdList("EOBS", function(resList) {
                $this.codeVo.evtObsList = resList;
            });

            // 기간 설정
            this.paramVo.strDt = WebUtil.getDateByMonth(-1);
            this.paramVo.endDt = WebUtil.getDateByMonth(0);

            // 검색
            Promise.all([pro1, pro2]).then(function() {
                if (WebUtil.isNotNull($this.paramVo.devId)) {
                    $this.onSearch();
                }
            });
        },

        /**
         * 검색
         */
        onSearch: function() {
            if (!this.idValidParam()) {
                return false;
            }

            // 디바이스 상태 정보 조회
            this.selectDevStatInfo();

            // 디바이스 상태 이벤트 로그 목록 조회
            this.selectDevStatEvtLogList();
        },

        /**
         * 파라미터 유효성 체크
         */
        idValidParam: function() {
            var $this = this;

            // 디바이스 ID 체크
            if (WebUtil.isNull(this.paramVo.devId)) {
                LayerUtil.alert({ msg: "디바이스를 선택해주세요." });
                return false;
            }

            // 시작일자 체크
            if (WebUtil.isNull(this.paramVo.strDt)) {
                LayerUtil.alert({
                    msg: "시작일자를 선택해주세요.",
                    callback: function() {
                        $this.$refs.strDt.focus();
                    }
                });
                return false;
            }

            // 종료일자 체크
            if (WebUtil.isNull(this.paramVo.endDt)) {
                LayerUtil.alert({
                    msg: "종료일자를 선택해주세요.",
                    callback: function() {
                        $this.$refs.endDt.focus();
                    }
                });
                return false;
            }

            // 기간 유효성 체크
            var strDtVal = this.paramVo.strDt.replace(/[^0-9]+/g, "");
            var endDtVal = this.paramVo.endDt.replace(/[^0-9]+/g, "");

            if (parseInt(strDtVal, 10) > parseInt(endDtVal, 10)) {
                LayerUtil.alert({
                    msg: "종료일자는 시작일자보다 크거나 같아야 합니다.",
                    callback: function() {
                        $this.$refs.endDt.focus();
                    }
                });
                return false;
            }

            return true;
        },

        /**
         * 디바이스 상태 정보 조회
         */
        selectDevStatInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/finedust/statistics/selectDevStatInfo",
                param: this.paramVo,
                success: function(response) {
                    $this.totVo      = response.data.totInfo;
                    $this.evtVo      = response.data.evtInfo;
                    $this.evtObsList = response.data.evtObsList;

                    // 차트 생성
                    $this.createTotChart();
                    $this.createOprtChart();
                    $this.createEvtChart();
                    $this.createEvtObsChart();
                }
            });
        },

        /**
         * 디바이스 상태 이벤트 로그 목록 조회
         */
        selectDevStatEvtLogList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/finedust/statistics/selectDevStatEvtLogList",
                param: {
                    devId: this.paramVo.devId,
                    strDt: this.paramVo.strDt,
                    endDt: this.paramVo.endDt,
                    curPage: this.evtLogVo.curPage,
                    dispPage: this.evtLogVo.dispPage,
                    rowCnt: this.evtLogVo.rowCnt
                },
                success: function(response) {
                    $this.evtLogVo.rowNum       = response.param.rowNum;
                    $this.evtLogVo.totCnt       = response.param.totCnt;
                    $this.evtLogVo.totPage      = response.param.totPage;
                    $this.evtLogVo.prevPage     = response.param.prevPage;
                    $this.evtLogVo.nextPage     = response.param.nextPage;
                    $this.evtLogVo.naviPageList = response.param.naviPageList;
                    $this.evtLogList            = response.data;
                }
            });
        },

        /**
         * 디바이스 클릭
         */
        onDevClick: function(index) {
            var itemCnt = this.codeVo.devList.length;

            if (itemCnt > 0) {
                var m = 0;

                for (m = 0; m < itemCnt; m++) {
                    if (m == index) {
                        this.codeVo.devList[m].actYn = true;
                        this.paramVo.devId = this.codeVo.devList[m].devId;
                    } else {
                        this.codeVo.devList[m].actYn = false;
                    }
                }
            }
        },

        /**
         * 이벤트 로그 페이지 이동
         */
        onEvtLogPageMove: function(page) {
            if (page > 0 && page <= this.evtLogVo.totPage) {
                this.evtLogVo.curPage = page;
                this.selectDevStatEvtLogList();
            }
        },

        /**
         * 이벤트 로그 엑셀 다운로드 클릭
         */
        onEvtLogExclDwldClick: function() {
            if (this.evtLogVo.totCnt == 0) {
                return false;
            }

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/finedust/statistics/exclDwldlDevStatEvtLogList",
                param: {
                    devId: this.paramVo.devId,
                    strDt: this.paramVo.strDt,
                    endDt: this.paramVo.endDt
                },
                resType: "blob",
                success: function(resData, resHeader) {
                    try {
                        var fileNm = "이벤트발생이력.xls";
                        var fileBlob = new Blob([resData], { type: resHeader["content-type"] });

                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(fileBlob, fileNm);
                        } else {
                            var fileUrl = window.URL.createObjectURL(fileBlob);
                            var fileLink = document.createElement("a");
                            fileLink.href = fileUrl;
                            fileLink.setAttribute("download", fileNm);
                            document.body.appendChild(fileLink);
                            fileLink.click();
                            document.body.removeChild(fileLink);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        },

        /**
         * 합계 차트 생성
         */
        createTotChart: function() {
            var option = {
                color: ["#4897e7", "#404f71"],
                title: {
                    text: "성공율(건)",
                    left: "58%",
                    bottom: 35,
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: 30,
                    bottom: 35,
                    labels: {
                        fontSize: 18
                    },
                    data: ["성공", "실패"]
                },
                series: [
                    {
                        name: "성공율(건)",
                        type: "pie",
                        radius: ["30%", "70%"],
                        center: ["65%", "45%"],
                        avoidLabelOverlap: false,
                        label: {
                            position: "inner",
                            textStyle: {
                                color: "#fff",
                                fontSize: 16
                            },
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.totVo.succCnt, name: "성공" },
                            { value: this.totVo.failCnt, name: "실패" }
                        ]
                    }
                ]
            };

            // 차트 초기화
            if (this.chrtVo.totApp != null) {
                this.chrtVo.totApp.clear();
            }

            // 차트 생성
            this.chrtVo.totApp = echarts.init(document.getElementById("graph_totalData"));
            this.chrtVo.totApp.setOption(option);
            this.chrtVo.totApp.resize();
        },

        /**
         * 가동 차트 생성
         */
        createOprtChart: function() {
            var option = {
                color: ["#ea9214", "#fdedd5"],
                title: {
                    text: "가동율(시간)",
                    left: "58%",
                    bottom: 35
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: 30,
                    bottom: 35,
                    labels: {
                        fontSize: 18
                    },
                    data: ["가동", "비가동"],
                },
                series: [
                    {
                        name: "가동율(시간)",
                        type: "pie",
                        radius: ["30%", "70%"],
                        center: ["65%", "45%"],
                        avoidLabelOverlap: false,
                        label: {
                            position: "inner",
                            textStyle: {
                                color: "black",
                                fontSize: 16
                            },
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.totVo.oprtHour, name: "가동" },
                            { value: this.totVo.noprHour, name: "비가동" }
                        ]
                    }
                ]
            };

            // 차트 초기화
            if (this.chrtVo.oprtApp != null) {
                this.chrtVo.oprtApp.clear();
            }

            // 차트 생성
            this.chrtVo.oprtApp = echarts.init(document.getElementById("graph_upTime"));
            this.chrtVo.oprtApp.setOption(option);
            this.chrtVo.oprtApp.resize();
        },

        /**
         * 이벤트 차트 생성
         */
        createEvtChart: function() {
            // 차트 옵션
            var option = {
                color: ["#5371b7", "#e5ebf9"],
                title: {
                    text: "이벤트(건)",
                    left: "58%",
                    bottom: 35
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: 30,
                    bottom: 35,
                    labels: {
                        fontSize: 18
                    },
                    data: ["디바이스연결상태", "디바이스측정"],
                },
                series: [
                    {
                        name: "이벤트(건)",
                        type: "pie",
                        radius: ["30%", "70%"],
                        center: ["65%", "45%"],
                        avoidLabelOverlap: false,
                        label: {
                            position: "inner",
                            textStyle: {
                                color: "black",
                                fontSize: 16
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.evtVo.conCnt, name: "디바이스연결상태" },
                            { value: this.evtVo.obsCnt, name: "디바이스측정" }
                        ]
                    }
                ]
            };

            // 차트 초기화
            if (this.chrtVo.evtApp != null) {
                this.chrtVo.evtApp.clear();
            }

            // 차트 생성
            this.chrtVo.evtApp = echarts.init(document.getElementById("graph_Event"));
            this.chrtVo.evtApp.setOption(option);
            this.chrtVo.evtApp.resize();
        },

        /**
         * 이벤트 측정 차트 생성
         */
        createEvtObsChart: function() {
            var titList = [];
            var itemList = [];
            var xAxisList = [];
            var mstList = this.evtObsList;
            var mstCnt = this.evtObsList.length;
            var cdCnt = this.codeVo.evtObsList.length;
            var m = 0;
            var k = 0;
            var c = 0;

            for (m = 0; m < cdCnt; m++) {
                // 타이틀 목록
                titList.push(this.codeVo.evtObsList[m].txt);

                // 아이템 목록
                itemList.push({
                    id: this.codeVo.evtObsList[m].key,
                    name: this.codeVo.evtObsList[m].txt,
                    type: "scatter",
                    data: []
                });
            }

            for (m = 0; m < mstCnt; m++) {
                // 상세 목록
                dtlList = mstList[m].dtlList;
                dtlCnt = dtlList.length;

                for (k = 0; k < dtlCnt; k++) {
                    // 차트 측정값
                    for (c = 0; c < cdCnt; c++) {
                        if (itemList[c].id == dtlList[k].evtObsCd) {
                            itemList[c].data.push(dtlList[k].logCnt);
                            break;
                        }
                    }
                }

                // 차트 x축 목록
                xAxisList.push(mstList[m].evtDt);
            }

            var option = {
                color: ["#5d646f", "#ca1919", "#0747dd", "#9fe6b8"],
                legend: {
                    bottom: "40px",
                    align: "auto",
                    labels: {
                        fontSize: 18
                    },
                    data: titList
                },
                grid: {
                    left: "2%",
                    right: "2%",
                    bottom: "65px",
                    top: "10%",
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: "none",
                            title: {
                                zoom: "Area zooming",
                                back: "Restore area zooming"
                            }
                        },
                        restore: {
                            title: "Reset",
                        },
                        saveAsImage: {
                            show: true,
                            type: "png",
                            name: "이벤트발생현황",
                            title: "Save as Image",
                            pixelRatio: 1
                        }
                    }
                },
                tooltip: {
                    trigger: "axis",
                    backgroundColor: "#44acee",
                    color: "#fff",
                    axisPointer: {
                        type: "cross",
                        backgroundColor: "#44acee"
                    }
                },
                dataZoom: [
                    {
                        type: "inside",
                        start: 0,
                        end: 100
                    },
                    {
                        start: 0,
                        end: 100,
                        handleIcon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                        handleSize: "80%",
                        handleStyle: {
                            color: "#fff",
                            shadowBlur: 3,
                            shadowColor: "rgba(0, 0, 0, 0.6)",
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }
                ],
                xAxis: {
                    type: "category",
                    boundaryGap: true,
                    name: "",
                    axisLabel: {
                        textStyle: {
                            color: "#333",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 16
                        },
                    },
                    data: xAxisList
                },
                yAxis: {
                    type: "value",
                    name: "",
                    axisLabel: {
                        textStyle: {
                            color: "#666",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 14
                        }
                    }
                },
                series: itemList
            };

            // 차트 초기화
            if (this.chrtVo.evtObsApp != null) {
                this.chrtVo.evtObsApp.clear();
            }

            // 차트 생성
            this.chrtVo.evtObsApp = echarts.init(document.getElementById("graph_evenToccurrence"));
            this.chrtVo.evtObsApp.setOption(option);
            this.chrtVo.evtObsApp.resize();
        },

        /**
         * 차트 리사이즈
         */
        onChrtResize: function() {
            var $this = this;

            // 차트 리사이즈 이벤트
            window.addEventListener("resize", function() {
                if ($this.chrtVo.totApp != null) {
                    $this.chrtVo.totApp.resize();
                }

                if ($this.chrtVo.oprtApp != null) {
                    $this.chrtVo.oprtApp.resize();
                }

                if ($this.chrtVo.evtApp != null) {
                    $this.chrtVo.evtApp.resize();
                }

                if ($this.chrtVo.evtObsApp != null) {
                    $this.chrtVo.evtObsApp.resize();
                }
            }, false);
        }
    },
    mounted: function() {
        // 회원순번
        this.mbrSeq = WebUtil.nvl(DocUtil.getElId("authMbrSeq").value, "");

        // 페이지 초기화
        this.initPage();

        // 차트 리사이즈
        this.onChrtResize();
    }
});
