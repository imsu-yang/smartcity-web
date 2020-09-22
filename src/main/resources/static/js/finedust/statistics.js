/**
 * Description : 측정값 통계
 * Author      : atom
 * Date        : 2020.07.26
 */
var fineDustStscApp = new Vue({
    el: "#fineDustStatistics",
    data: {
        // 회원순번
        mbrSeq: null,

        // 공통정보
        comVo: {
            // 기준디바이스ID
            stdDevId: "",

            // 디바이스목록
            devList: [],

            // 비교디바이스목록
            cmprDevList: []
        },

        // 파라미터정보
        paramVo: {
            // 디바이스목록
            devList: [],

            // 시작일자
            strDt: "",

            // 종료일자
            endDt: "",

            // 측정항목ID
            obsItemId: "",

            // 측정항목명
            obsItemNm: "",

            // 통계항목코드
            stscItemCd: "",

            // 통계일시코드
            stscDtmCd: ""
        },

        // 차트정보
        chrtVo: {
            app: null,
            titList: [],
            xAxisList: [],
            itemList: []
        },

        // 코드정보
        codeVo: {
            // 테스트디바이스목록
            testDevList: [],

            // 비교디바이스목록
            cmprDevList: [],

            // 디바이스측정목록
            devObsList: [],

            // 통계항목목록
            stscItemList: [],

            // 통계일시목록
            stscDtmList: [  //202009016 추가 , 현재 초단위 데이터는 없어 분, 시 단위 통계는 낼 수가 없다
                {
                    key: "MIN",
                    txt: "분",
                    actYn: false
                },
                {
                    key: "HOUR",
                    txt: "시",
                    actYn: false
                },
                {
                    key: "DAY",
                    txt: "일",
                    actYn: false
                },
                {
                    key: "MONTH",
                    txt: "월",
                    actYn: false
                }
            ]
        },

        // 탭아이디
        tabId: "chart",

        // 탭목록
        tabList: [
            { id: "chart", head: "tabHead1", body: "tabCont1" },
            { id: "table", head: "tabHead2", body: "tabCont2" }
        ],

        // 측정통계목록
        obsStscList: []
    },
    watch: {
        /**
         * 공통 기준디바이스ID
         */
        "comVo.stdDevId": function(newVal, oldVal) {
            if (WebUtil.isNotNull(newVal) && WebUtil.isNotNull(oldVal)) {
                var $this = this;
                this.paramVo.obsItemId = "";
                this.paramVo.obsItemNm = "";

                // 비교 디바이스 코드 목록 조회
                CodeUtil.selectCmprDevCdList(newVal, function(resList) {
                    $this.codeVo.cmprDevList = resList;
                });

                // 디바이스 측정 코드 목록 조회
                CodeUtil.selectDevObsCdList(newVal, function(resList) {
                    $this.codeVo.devObsList = resList;
                });
            }
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

            var pro1 = new Promise(function(resolve, reject) {
                // 디바이스 코드 목록 조회
                CodeUtil.selectDevCdList(authMbrSeq, function(resList) {
                    $this.codeVo.testDevList = resList;

                    if ($this.codeVo.testDevList.length > 0) {
                        $this.onTestDevClick(0);

                        // 비교 디바이스 코드 목록 조회
                        CodeUtil.selectCmprDevCdList($this.comVo.stdDevId, function(resList) {
                            $this.codeVo.cmprDevList = resList;

                            if ($this.codeVo.cmprDevList.length > 0) {
                                $this.onCmprDevClick(0);
                            }

                            // 디바이스 측정 코드 목록 조회
                            CodeUtil.selectDevObsCdList($this.comVo.stdDevId, function(resList) {
                                $this.codeVo.devObsList = resList;

                                if ($this.codeVo.devObsList.length > 0) {
                                    $this.onDevObsClick(0);
                                }

                                // 프라미스 리턴
                                resolve();
                            });
                        });
                    }
                });
            });

            // 통계 항목 목록 조회
            var pro2 = CodeUtil.selectComCdList("STATCODE", function(resList) {
                $this.codeVo.stscItemList = resList;

                if ($this.codeVo.stscItemList.length > 0) {
                    $this.onStscItemClick(0);
                }
            });

            // 통계일시
            this.onStscDtmClick(0);

            // 기간 설정
            this.paramVo.strDt = WebUtil.getDateByMonth(-1);
            this.paramVo.endDt = WebUtil.getDateByMonth(0);

            // 검색
            Promise.all([pro1, pro2]).then(function() {
                $this.onSearch(false);
            });
        },

        /**
         * 검색
         */
        onSearch: function(btnYn) {
            if (!this.idValidParam(btnYn)) {
                return false;
            }

            // 변수 초기화 및 설정
            this.comVo.devList = [];
            this.chrtVo.titList = [];
            this.chrtVo.itemList = [];
            var testDevCnt = this.codeVo.testDevList.length;
            var m = 0;

            // 기준 디바이스 추가
            for (m = 0; m < testDevCnt; m++) {
                if (this.codeVo.testDevList[m].devId == this.comVo.stdDevId) {
                    // 공통 디바이스 목록
                    this.comVo.devList.push({
                        devId: this.codeVo.testDevList[m].devId,
                        devNm: this.codeVo.testDevList[m].devNm
                    });

                    // 차트 타이틀 목록
                    this.chrtVo.titList.push(this.codeVo.testDevList[m].devNm);

                    // 차트 아이템 목록
                    this.chrtVo.itemList.push({
                        id: this.codeVo.testDevList[m].devId,
                        name: this.codeVo.testDevList[m].devNm,
                        type: "line",
                        data: []
                    });
                    break;
                }
            }

            // 비교 디바이스 목록
            var cmprDevCnt = this.codeVo.cmprDevList.length;

            for (m = 0; m < cmprDevCnt; m++) {
                if (this.codeVo.cmprDevList[m].actYn) {
                    // 공통 디바이스 목록
                    this.comVo.devList.push({
                        devId: this.codeVo.cmprDevList[m].devId,
                        devNm: this.codeVo.cmprDevList[m].devNm
                    });

                    // 차트 타이틀 목록
                    this.chrtVo.titList.push(this.codeVo.cmprDevList[m].devNm);

                    // 차트 아이템 목록
                    this.chrtVo.itemList.push({
                        id: this.codeVo.cmprDevList[m].devId,
                        name: this.codeVo.cmprDevList[m].devNm,
                        type: "line",
                        data: []
                    });
                }
            }

            // 파라미터 디바이스 목록
            this.paramVo.devList = [];
            var comDevCnt = this.comVo.devList.length;

            for (m = 0; m < comDevCnt; m++) {
                this.paramVo.devList.push(this.comVo.devList[m].devId);
            }

            // 디바이스 측정 통계 목록 조회
            var $this = this;

            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/finedust/statistics/selectDevObsStscList",
                param: this.paramVo,
                success: function(response) {
                    var mstList = response.data;
                    var mstCnt = mstList.length;
                    var dtlList = null;
                    var dtlCnt = 0;
                    var obsStscRow = null;
                    var m = 0;
                    var k = 0;
                    var c = 0;
                    $this.chrtVo.xAxisList = [];
                    $this.obsStscList = [];

                    for (m = 0; m < mstCnt; m++) {
                        // 상세 목록
                        dtlList = mstList[m].dtlList;
                        dtlCnt = dtlList.length;

                        // 측정 통계 행
                        obsStscRow = {
                            obsTime: mstList[m].obsTime,
                            obsItemNm: $this.paramVo.obsItemNm
                        };

                        for (k = 0; k < dtlCnt; k++) {
                            // 차트 통계값
                            for (c = 0; c < comDevCnt; c++) {
                                if ($this.chrtVo.itemList[c].id == dtlList[k].devId) {
                                    $this.chrtVo.itemList[c].data.push(dtlList[k].obsItemValue);
                                    break;
                                }
                            }

                            // 측정 통계값
                            obsStscRow[dtlList[k].devId] = dtlList[k].obsItemValue;
                        }

                        // 차트 x축 목록
                        $this.chrtVo.xAxisList.push(mstList[m].obsTime);

                        // 측정 통계 목록
                        $this.obsStscList.push(obsStscRow);
                    }

                    // 차트 생성
                    $this.createChart();
                }
            });
        },

        /**
         * 파라미터 유효성 체크
         */
        idValidParam: function(btnYn) {
            var $this = this;

            // 기준 디바이스 ID 체크
            if (WebUtil.isNull(this.comVo.stdDevId)) {
                if (btnYn) {
                    LayerUtil.alert({ msg: "디바이스(테스트)를 선택해주세요." });
                }
                return false;
            }

            // 비교 디바이스 체크
            if (this.comVo.cmprDevList.length == 0) {
                if (btnYn) {
                    LayerUtil.alert({ msg: "디바이스(비교)를 선택해주세요." });
                }
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

            // 측정항목 체크
            if (WebUtil.isNull(this.paramVo.obsItemId)) {
                if (btnYn) {
                    LayerUtil.alert({ msg: "측정항목을 선택해주세요." });
                }
                return false;
            }

            // 통계항목 체크
            if (WebUtil.isNull(this.paramVo.stscItemCd)) {
                LayerUtil.alert({ msg: "통계항목을 선택해주세요." });
                return false;
            }

            // 통계시간 체크
            if (WebUtil.isNull(this.paramVo.stscDtmCd)) {
                LayerUtil.alert({ msg: "기준을 선택해주세요." });
                return false;
            }

            return true;
        },

        /**
         * 테스트 디바이스 클릭
         */
        onTestDevClick: function(index) {
            var itemCnt = this.codeVo.testDevList.length;

            if (itemCnt > 0) {
                var m = 0;

                for (m = 0; m < itemCnt; m++) {
                    if (m == index) {
                        this.codeVo.testDevList[m].actYn = true;
                        this.comVo.stdDevId = this.codeVo.testDevList[m].devId;
                    } else {
                        this.codeVo.testDevList[m].actYn = false;
                    }
                }
            }
        },

        /**
         * 비교 디바이스 클릭
         */
        onCmprDevClick: function(index) {
            // 토글 설정
            this.codeVo.cmprDevList[index].actYn = !this.codeVo.cmprDevList[index].actYn;

            // 비교 디바이스 목록 추가
            if (this.codeVo.cmprDevList[index].actYn) {
                this.comVo.cmprDevList.push(this.codeVo.cmprDevList[index].devId);

            // 비교 디바이스 목록 제거
            } else {
                var idx = this.comVo.cmprDevList.indexOf(this.codeVo.cmprDevList[index].devId);

                if (idx > -1) {
                    this.comVo.cmprDevList.splice(idx, 1);
                }
            }
        },

        /**
         * 측정 항목 클릭
         */
        onDevObsClick: function(index) {
            var itemCnt = this.codeVo.devObsList.length;

             if (itemCnt > 0) {
                 var m = 0;

                 for (m = 0; m < itemCnt; m++) {
                     if (m == index) {
                         this.codeVo.devObsList[m].actYn = true;
                         this.paramVo.obsItemId = this.codeVo.devObsList[m].obsItemId;
                         this.paramVo.obsItemNm = this.codeVo.devObsList[m].obsItemNm;
                     } else {
                         this.codeVo.devObsList[m].actYn = false;
                     }
                 }
             }
        },

        /**
         * 통계 항목 클릭
         */
        onStscItemClick: function(index) {
            var itemCnt = this.codeVo.stscItemList.length;

            if (itemCnt > 0) {
                var m = 0;

                for (m = 0; m < itemCnt; m++) {
                    if (m == index) {
                        this.codeVo.stscItemList[m].actYn = true;
                        this.paramVo.stscItemCd = this.codeVo.stscItemList[m].key;
                    } else {
                        this.codeVo.stscItemList[m].actYn = false;
                    }
                }
            }
        },

        /**
         * 통계 일시 클릭
         */
        onStscDtmClick: function(index) {
            var itemCnt = this.codeVo.stscDtmList.length;

            if (itemCnt > 0) {
                var m = 0;

                for (m = 0; m < itemCnt; m++) {
                    if (m == index) {
                        this.codeVo.stscDtmList[m].actYn = true;
                        this.paramVo.stscDtmCd = this.codeVo.stscDtmList[m].key;
                    } else {
                        this.codeVo.stscDtmList[m].actYn = false;
                    }
                }
            }
        },

        /**
         * 탭 클릭
         */
        onTabClick: function(tid) {
            if (this.tabId != tid) {
                var $this = this;

                this.tabList.forEach(function(tabRow) {
                    if (tabRow.id == tid) {
                        DocUtil.getElId(tabRow.head).className = "active";
                        DocUtil.getElId(tabRow.body).style.display = "block";

                        // 차트 리사이즈
                        if (tid == "chart" && $this.chrtVo.app != null) {
                            $this.chrtVo.app.resize();
                        }
                    } else {
                        DocUtil.getElId(tabRow.head).className = "";
                        DocUtil.getElId(tabRow.body).style.display = "none";
                    }
                });

                this.tabId = tid;
            }
        },

        /**
         * 차트 생성
         */
        createChart: function() {
            var option = {
                color: ["#ff9125", "#3395d4", "#9fe6b8", "#fb7293", "#8378ea", "#e7bcf3", "#37a2da"],
                legend: {
                    align: "left",
                    labels: {
                        fontSize: 16
                    },
                    data: this.chrtVo.titList
                },
                grid: {
                    left: "5%",
                    right: "5%",
                    bottom: "45px",
                    top: "5%",
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
                            name: "측정값통계",
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
                    boundaryGap: false,
                    // name: "",
                    axisLabel: {
                        textStyle: {
                            color: "#666",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 16
                        }
                    },
                    data: this.chrtVo.xAxisList
                },
                yAxis: {
                    type: "value",
                    // splitNumber: 10,
                    // name: "",
                    // data: ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
                    axisLabel: {
                        textStyle: {
                            color: "#666",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 16
                        }
                    }
                },
                series: this.chrtVo.itemList
            };

            // 차트 초기화
            if (this.chrtVo.app != null) {
                this.chrtVo.app.clear();
            }

            // 차트 생성
            this.chrtVo.app = echarts.init(document.getElementById("statistics_graph"));
            this.chrtVo.app.setOption(option);
            this.chrtVo.app.resize();
        },

        /**
         * 차트 리사이즈
         */
        onChrtResize: function() {
            var $this = this;

            // 차트 리사이즈 이벤트
            window.addEventListener("resize", function() {
                if ($this.chrtVo.app != null) {
                    $this.chrtVo.app.resize();
                }
            }, false);
        },

        /**
         * 엑셀 다운로드 클릭
         */
        onExclDwldClick: function() {
            // 측정 통계 건수
            var obsStscCnt = this.obsStscList.length;

            if (obsStscCnt == 0) {
                return false;
            }

            // 헤더 목록
            var headList = ["시간", "측정항목"].concat(this.chrtVo.titList);

            // 바디 목록
            var bodyList = [];
            var dataList = null;
            var comDevCnt = this.comVo.devList.length;
            var m = 0;
            var k = 0;

            for (m = 0; m < obsStscCnt; m++) {
                dataList = [this.obsStscList[m].obsTime, this.obsStscList[m].obsItemNm];

                for (k = 0; k < comDevCnt; k++) {
                    dataList.push(this.obsStscList[m][this.comVo.devList[k].devId]);
                }

                bodyList.push(dataList);
            }

            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/finedust/statistics/exclDwldlDevObsStscList",
                param: {
                    headList: headList,
                    bodyList: bodyList
                },
                resType: "blob",
                success: function(resData, resHeader) {
                    try {
                        var fileNm = "측정값통계.xls";
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
