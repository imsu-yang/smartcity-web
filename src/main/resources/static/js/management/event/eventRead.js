/**
 * Description : 이벤트 읽기
 * Author      : atom
 * Date        : 2020.07.31
 */
var evtReadApp = new Vue({
    el: "#eventRead",
    data: {
        // 이벤트정보
        evtVo: {},

        // 측정목록
        obsList: [],

        // 로그목록
        logList: [],

        // 로그정보
        logVo: {
            // 행번호
            rowNum: 0,

            // 행수
            rowCnt: 5,

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
        }
    },
    mixins: [evtCdMixin, evtDtlMixin],
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 이벤트 읽기 정보 조회
            this.selectEvtReadInfo();

            // 이벤트 로그 조회
            this.selectEvtLogList();
        },

        /**
         * 이벤트 읽기 정보 조회
         */
        selectEvtReadInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/event/selectEvtReadInfo",
                param: {
                    evntId: this.argVo.evntId,
                    mbrSeq: this.mbrSeq
                },
                success: function(response) {
                    $this.evtVo   = response.data.evtInfo;
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
         * 이벤트 로그 목록 조회
         */
        selectEvtLogList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/event/selectEvtLogList",
                param: {
                    evntId: this.argVo.evntId,
                    curPage: this.logVo.curPage,
                    dispPage: this.logVo.dispPage,
                    rowCnt: this.logVo.rowCnt
                },
                success: function(response) {
                    $this.logVo.rowNum       = response.param.rowNum;
                    $this.logVo.totCnt       = response.param.totCnt;
                    $this.logVo.totPage      = response.param.totPage;
                    $this.logVo.prevPage     = response.param.prevPage;
                    $this.logVo.nextPage     = response.param.nextPage;
                    $this.logVo.naviPageList = response.param.naviPageList;
                    $this.logList            = response.data;
                }
            });
        },

        /**
         * 이벤트 수정 이동
         */
        onEvtUptMove: function() {
            window.location.href = "/management/event/write?" + this.getParam("writ");
        },

        /**
         * 로그 페이지 이동
         */
        onLogPageMove: function(page) {
            if (page > 0 && page <= this.logVo.totPage) {
                this.logVo.curPage = page;
                this.selectEvtLogList();
            }
        },

        /**
         * 이벤트 삭제
         */
        deleteEvt: function() {
            var $this = this;

            LayerUtil.confirm({
                msg: "삭제하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/management/event/deleteEvt",
                            param: {
                                evntId: $this.argVo.evntId,
                                mbrSeq: $this.mbrSeq,
                                mbrId: $this.mbrId
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "삭제되었습니다.",
                                    callback: function() {
                                        $this.onEvtListMove();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    },
    mounted: function() {
        // 아규먼트 초기화
        this.initArg();

        // 페이지 초기화
        this.initPage();
    }
});
