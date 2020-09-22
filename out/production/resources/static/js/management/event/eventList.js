/**
 * Description : 이벤트 목록
 * Author      : atom
 * Date        : 2020.07.31
 */
var evtListApp = new Vue({
    el: "#eventList",
    data: {
        // 아규먼트정보
        argVo: {
            curPage: 1
        },

        // 회원순번
        mbrSeq: null,

        // 회원ID
        mbrId: null,

        // 행번호
        rowNum: 0,

        // 행수
        rowCnt: 10,

        // 전체건수
        totCnt: 0,

        // 전체페이지
        totPage: 0,

        // 노출 페이지
        dispPage: 5,

        // 이전페이지
        prevPage: 0,

        // 다음페이지
        nextPage: 0,

        // 내비페이지목록
        naviPageList: [],

        // 이벤트목록
        evtList: [],

        // 전체체크여부
        allChkYn: false
    },
    mixins: [evtCdMixin],
    watch: {
        /**
         * 전체체크여부
         */
        allChkYn: function(newVal, oldVal) {
            var evtCnt = this.evtList.length;

            if (evtCnt > 0) {
                var m = 0;

                for (m = 0; m < evtCnt; m++) {
                    if (newVal) {
                        this.evtList[m].chkYn = true;
                    } else {
                        this.evtList[m].chkYn = false;
                    }
                }
            }
        }
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 이벤트 목록 조회
            this.selectEvtList();
        },

        /**
         * 이벤트 목록 조회
         */
        selectEvtList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/event/selectEvtList",
                param: {
                    curPage: this.argVo.curPage,
                    dispPage: this.dispPage,
                    rowCnt: this.rowCnt,
                    mbrSeq: this.mbrSeq
                },
                success: function(response) {
                    $this.rowNum       = response.param.rowNum;
                    $this.totCnt       = response.param.totCnt;
                    $this.totPage      = response.param.totPage;
                    $this.prevPage     = response.param.prevPage;
                    $this.nextPage     = response.param.nextPage;
                    $this.naviPageList = response.param.naviPageList;
                    $this.evtList      = response.data;
                }
            });
        },

        /**
         * 이벤트 상태 클릭
         */
        onEvtStatClick: function(index, statCd) {
            var $this = this;

            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/management/event/updateEvtStatYn",
                param: {
                    evntId: $this.evtList[index].evntId,
                    status: statCd,
                    mbrSeq: $this.mbrSeq,
                    mbrId: $this.mbrId
                },
                reqType: "url",
                success: function(response) {
                    $this.evtList[index].status = statCd;
                }
            });
        },

        /**
         * 이벤트 삭제 클릭
         */
        onEvtDelClick: function() {
            var chkList = [];
            var evtCnt = this.evtList.length;

            if (evtCnt > 0) {
                var m = 0;

                for (m = 0; m < evtCnt; m++) {
                    if (this.evtList[m].chkYn) {
                        chkList.push(this.evtList[m].evntId);
                    }
                }
            }

            if (chkList.length == 0) {
                LayerUtil.alert({ msg: "삭제할 이벤트를 선택해주세요." });
                return false;
            }

            var $this = this;

            LayerUtil.confirm({
                msg: "해당 이벤트를 삭제하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/management/event/deleteEvtMulti",
                            param: {
                                evtList: chkList,
                                mbrSeq: $this.mbrSeq,
                                mbrId: $this.mbrId
                            },
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "이벤트가 삭제되었습니다.",
                                    callback: function() {
                                        $this.selectEvtList();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 페이지 이동
         */
        onPageMove: function(page) {
            if (page > 0 && page <= this.totPage) {
                this.argVo.curPage = page;
                this.selectEvtList();
            }
        },

        /**
         * 이벤트 등록 이동
         */
        onEvtWritMove: function() {
            window.location.href = "/management/event/write?" + this.getParam();
        },

        /**
         * 이벤트 상세 이동
         */
        onEvtReadMove: function(evntId) {
            var reqUrl = "/management/event/read?evntId=" + evntId + "&" + this.getParam();;

            window.location.href = reqUrl;
        },

        /**
         * 파라미터 구하기
         */
        getParam: function() {
            var result = "curPage=" + this.argVo.curPage;

            return result;
        }
    },
    mounted: function() {
        // 회원순번
        this.mbrSeq = WebUtil.nvl(DocUtil.getElId("authMbrSeq").value, "");

        // 회원ID
        this.mbrId = SessionUtil.getMbrId();

        // 아규먼트정보
        this.argVo.curPage = WebUtil.nvl(DocUtil.getElId("argCurPage").value, 1);

        // 페이지 초기화
        this.initPage();
    }
});
