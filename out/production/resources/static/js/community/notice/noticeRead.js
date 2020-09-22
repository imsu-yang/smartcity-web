/**
 * Description : 공지사항 상세
 * Author      : atom
 * Date        : 2020.07.15
 */
var notiReadApp = new Vue({
    el: "#noticeRead",
    data: {
        // 아규먼트정보
        argVo: {
            noticeSeq: null,
            curPage: null,
            schTpCd: null,
            schKwd: null
        },

        // 회원아이디
        mbrId: "",

        // 공지사항정보
        notiVo: {}
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 공지사항 정보 조회
            this.selectNotiInfo();
        },

        // 아규먼트 초기화
        initArg: function() {
            this.argVo.noticeSeq = WebUtil.nvl(DocUtil.getElId("argNoticeSeq").value, null);
            this.argVo.curPage   = WebUtil.nvl(DocUtil.getElId("argCurPage").value, "");
            this.argVo.schTpCd   = WebUtil.nvl(DocUtil.getElId("argSchTpCd").value, "");
            this.argVo.schKwd    = WebUtil.nvl(DocUtil.getElId("argSchKwd").value, "");

            // 회원아이디
            this.mbrId = SessionUtil.getMbrId();
        },

        /**
         * 공지사항 정보 조회
         */
        selectNotiInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/notice/selectNotiReadInfo",
                param: {
                    noticeSeq: this.argVo.noticeSeq,
                    mbrId: this.mbrId
                },
                success: function(response) {
                    $this.notiVo = response.data;
                },
                error: function(msg) {
                    LayerUtil.alert({
                        msg: msg,
                        callback: function() {
                            $this.onNotiListMove();
                        }
                    });
                }
            });
        },

        /**
         * 파라미터 구하기
         */
        getParam: function() {
            var result = "";

            if (WebUtil.isNotNull(this.argVo.curPage)) {
                result += "&curPage=" + this.argVo.curPage;
            }

            if (WebUtil.isNotNull(this.argVo.schTpCd)) {
                result += "&schTpCd=" + this.argVo.schTpCd;
            }

            if (WebUtil.isNotNull(this.argVo.schKwd)) {
                result += "&schKwd=" + encodeURIComponent(this.argVo.schKwd);
            }

            if (WebUtil.isNotNull(result) && result.charAt(0) == "&") {
                result = "?" + result.substring(1);
            }

            return result;
        },

        /**
         * 공지사항 목록 이동
         */
        onNotiListMove: function() {
            window.location.href = "/community/notice/list" + this.getParam();
        },

        /**
         * 이전 공지사항 이동
         */
        onNotiPrevMove: function() {
            if (WebUtil.isNotNull(this.notiVo.prevSeq)) {
                window.location.href = "/community/notice/read?noticeSeq=" + this.notiVo.prevSeq;
            }
        },

        /**
         * 다음 공지사항 이동
         */
        onNotiNextMove: function() {
            if (WebUtil.isNotNull(this.notiVo.nextSeq)) {
                window.location.href = "/community/notice/read?noticeSeq=" + this.notiVo.nextSeq;
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
