/**
 * Description : 공지사항 목록
 * Author      : atom
 * Date        : 2020.07.15
 */
var notiListApp = new Vue({
    el: "#noticeList",
    data: {
        // 아규먼트정보
        argVo: {
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

        // 공지사항목록
        notiList: []
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 공지사항 목록 조회
            this.selectNotiList();
        },

        /**
         * 공지사항 목록 조회
         */
        selectNotiList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/notice/selectNotiList",
                param: {
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
                    $this.notiList     = response.data;
                }
            });
        },

        /**
         * 공지사항 상세 이동
         */
        onNotiReadMove: function(noticeSeq) {
            var reqUrl = "/community/notice/read?noticeSeq=" + noticeSeq;
            reqUrl += this.getParam();

            window.location.href = reqUrl;
        },

        /**
         * 파라미터 구하기
         */
        getParam: function(mode) {
            var result = "&curPage=" + this.argVo.curPage + "&schTpCd=" + this.argVo.schTpCd;

            if (WebUtil.isNotNull(this.argVo.schKwd)) {
                result += "&schKwd=" + encodeURIComponent(this.argVo.schKwd);
            }

            return result;
        }
    },
    mounted: function() {
        // 아규먼트정보
        this.argVo.curPage = WebUtil.nvl(DocUtil.getElId("argCurPage").value, 1);
        this.argVo.schTpCd = WebUtil.nvl(DocUtil.getElId("argSchTpCd").value, "01");
        this.argVo.schKwd  = WebUtil.nvl(DocUtil.getElId("argSchKwd").value, "");

        // 페이지 초기화
        this.initPage();
    }
});
