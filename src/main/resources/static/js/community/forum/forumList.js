/**
 * Description : 포럼 목록
 * Author      : atom
 * Date        : 2020.07.20
 */
var frumListApp = new Vue({
    el: "#forumList",
    data: {
        // 아규먼트정보
        argVo: {
            forumGroupSeq: null,
            curPage: 1,
            schTpCd: "",
            schKwd: ""
        },

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

        // 포럼그룹정보
        frumGrpVo: {},

        // 포럼목록
        frumList: []
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 포럼 그룹 정보 조회
            this.selectFrumGrpInfo();

            // 포럼 목록 조회
            this.selectFrumList();
        },

        /**
         * 포럼 그룹 정보 조회
         */
        selectFrumGrpInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/forum/selectFrumGrpInfo",
                param: { forumGroupSeq: this.argVo.forumGroupSeq },
                success: function(response) {
                    $this.frumGrpVo = response.data;
                },
                error: function(msg) {
                    LayerUtil.alert({
                        msg: msg,
                        callback: function() {
                            $this.onFrumIntrMove();
                        }
                    });
                }
            });
        },

        /**
         * 포럼 목록 조회
         */
        selectFrumList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/forum/selectFrumList",
                param: {
                    forumGroupSeq: this.argVo.forumGroupSeq,
                    schTpCd: this.argVo.schTpCd,
                    schKwd: this.argVo.schKwd,
                    curPage: this.argVo.curPage,
                    dispPage: this.dispPage,
                    rowCnt: this.rowCnt
                },
                success: function(response) {
                    $this.rowNum       = response.param.rowNum;
                    $this.totCnt       = response.param.totCnt;
                    $this.totPage      = response.param.totPage;
                    $this.prevPage     = response.param.prevPage;
                    $this.nextPage     = response.param.nextPage;
                    $this.naviPageList = response.param.naviPageList;
                    $this.frumList     = response.data;
                }
            });
        },

        /**
         * 페이지 이동
         */
        onPageMove: function(page) {
            if (page > 0 && page <= this.totPage) {
                this.argVo.curPage = page;
                this.selectFrumList();
            }
        },

        /**
         * 포럼 소개 이동
         */
        onFrumIntrMove: function() {
            window.location.href = "/community/forum/intro";
        },

        /**
         * 포럼 등록 이동
         */
        onFrumWritMove: function() {
            window.location.href = "/community/forum/write?forumGroupSeq=" + this.argVo.forumGroupSeq + this.getParam();
        },

        /**
         * 포럼 상세 이동
         */
        onFrumReadMove: function(forumSeq) {
            var reqUrl = "/community/forum/read?forumGroupSeq=" + this.argVo.forumGroupSeq + "&forumSeq=" + forumSeq;
            reqUrl += this.getParam();

            window.location.href = reqUrl;
        },

        /**
         * 파라미터 구하기
         */
        getParam: function() {
            var result = "&curPage=" + this.argVo.curPage + "&schTpCd=" + this.argVo.schTpCd;

            if (WebUtil.isNotNull(this.argVo.schKwd)) {
                result += "&schKwd=" + encodeURIComponent(this.argVo.schKwd);
            }

            return result;
        }
    },
    mounted: function() {
        // 아규먼트정보
        this.argVo.forumGroupSeq = WebUtil.nvl(DocUtil.getElId("argForumGroupSeq").value, null);
        this.argVo.curPage       = WebUtil.nvl(DocUtil.getElId("argCurPage").value, 1);
        this.argVo.schTpCd       = WebUtil.nvl(DocUtil.getElId("argSchTpCd").value, "01");
        this.argVo.schKwd        = WebUtil.nvl(DocUtil.getElId("argSchKwd").value, "");

        // 페이지 초기화
        this.initPage();
    }
});
