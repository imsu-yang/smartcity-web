/**
 * Description : 모니터링 mixin
 * Author      : atom
 * Date        : 2020.08.08
 */
var mntrMixin = {
    data: function() {
        return {
            // 차트정보
            chrtVo: {
                app: null,
                titList: [],
                xAxisList: [],
                itemList: []
            }
        };
    },

    methods: {
        /**
         * 디바이스 측정 통계 목록 조회
         */
        selectDevObsStscList: function() {
            // 디바이스 체크
            if (!WebUtil.isObject(this.device) || WebUtil.isNull(this.device.devId) || WebUtil.isNull(this.device.updateTime))
                return false;

            // 측정항목, 비교디바이스 체크
            if (WebUtil.isNull(this.selObsItemId) || WebUtil.isNull(this.selCompareDeviceId))
                return false;

            // 수정일자
            var uptDtArr = this.device.updateTime.split(" ");
            var dateArr  = uptDtArr[0].split("-");
            var year     = parseInt(dateArr[0], 10);
            var mth      = parseInt(dateArr[1], 10) - 4;
            var day      = parseInt(dateArr[2], 10);

            // 이전일자 - 수정일자 이전 3개월
            var prevDt = new Date(year, mth, day);
            year = prevDt.getFullYear();
            mth  = WebUtil.zeroPad(prevDt.getMonth() + 1, 2);
            day  = WebUtil.zeroPad(prevDt.getDate(), 2);

            // 파라미터
            var $this = this;
            var devList = [this.device.devId, this.selCompareDeviceId];
            var strDt = year + "-" + mth + "-" + day + " " + uptDtArr[1];
            var endDt = this.device.updateTime;

            // 측정항목ID
            var obsItemId = this.selObsItemId;

            // 통계항목코드 - 평균
            var stscItemCd = "STATCODE001";

            // 통계일시코드
            var stscDtmCd = "HOUR_PARAM_DTM";

            // 공통 디바이스 목록
            var comDevList = [{
                devId: this.device.devId,
                devNm: this.device.devName
            }];

            // 비교 디바이스 추가
            var cmprDevList = this.compareDevices;
            var cmprDevCnt = cmprDevList.length;
            var m = 0;

            for (m = 0; m < cmprDevCnt; m++) {
                if (cmprDevList[m].devId === this.selCompareDeviceId) {
                    comDevList.push({
                        devId: cmprDevList[m].devId,
                        devNm: cmprDevList[m].devName
                    });
                    break;
                }
            }

            // 차트 정보 설정
            this.chrtVo.titList = [];
            this.chrtVo.itemList = [];
            var comDevCnt = comDevList.length;

            for (m = 0; m < comDevCnt; m++) {
                // 차트 타이틀 목록
                this.chrtVo.titList.push(comDevList[m].devNm);

                // 차트 아이템 목록
                this.chrtVo.itemList.push({
                    id: comDevList[m].devId,
                    name: comDevList[m].devNm,
                    type: "line",
                    data: []
                });
            }

            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/finedust/statistics/selectDevObsStscList",
                param: {
                    devList: devList,
                    strDt: strDt,
                    endDt: endDt,
                    obsItemId: obsItemId,
                    stscItemCd: stscItemCd,
                    stscDtmCd: stscDtmCd
                },
                /**
                 * responseData: [
                 *     {
                 *         dtlList: [
                 *             {
                 *                 devId: 디바이스 ID,
                 *                 obsItemId: 측정 항목 ID,
                 *                 obsItemValue: 측정값
                 *             },
                 *             ...
                 *         ],
                 *         obsTime: 측정 시간
                 *     },
                 *     ...
                 * ]
                 * */
                success: function(response) {
                    var mstList = response.data;
                    var mstCnt = mstList.length;
                    var dtlList = null;
                    var dtlCnt = 0;
                    var m = 0;
                    var k = 0;
                    var c = 0;
                    $this.chrtVo.xAxisList = [];
                    $this.obsStscList = [];

                    for (m = 0; m < mstCnt; m++) {
                        // 상세 목록
                        dtlList = mstList[m].dtlList;
                        dtlCnt = dtlList.length;

                        for (k = 0; k < dtlCnt; k++) {
                            // 차트 통계값
                            for (c = 0; c < comDevCnt; c++) {
                                if ($this.chrtVo.itemList[c].id == dtlList[k].devId) {
                                    $this.chrtVo.itemList[c].data.push(dtlList[k].obsItemValue);
                                    break;
                                }
                            }
                        }

                        // 차트 x축 목록
                        $this.chrtVo.xAxisList.push(mstList[m].obsTime);
                    }

                    // 차트 생성
                    $this.createChart();
                }
            });
        },

        /**
         * 차트 생성
         */
        createChart: function() {
            var option = {
                color: ["#ff9125", "#3395d4", "#9fe6b8", "#fb7293", "#8378ea", "#e7bcf3", "#37a2da"],
                legend: {
                    left: "35px",
                    align: "left",
                    labels: {
                        fontSize: 14
                    },
                    data: this.chrtVo.titList
                },
                grid: {
                    left: "5%",
                    right: "5%",
                    bottom: "40px",
                    top: "30px",
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
                // 커서 말풍선
                tooltip: {
                    trigger: "axis",
                    backgroundColor: "#44acee",
                    color: "#fff",
                    axisPointer: {
                        type: "cross",
                        backgroundColor: "#44acee"
                    }
                },
                // 차트 특정 영역 확대 설정
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
                    axisLabel: {
                        textStyle: {
                            color: "#666",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 14
                        }
                    },
                    data: this.chrtVo.xAxisList
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        textStyle: {
                            color: "#666",
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 14
                        }
                    }
                },
                // 차트에 그릴 데이터 리스트
                series: this.chrtVo.itemList
            };

            // 차트 초기화
            if (this.chrtVo.app != null) {
                this.chrtVo.app.clear();
            }

            // 차트 생성
            this.chrtVo.app = echarts.init(document.getElementById("graph_box"));
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
        }
    }

};
