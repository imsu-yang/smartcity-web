/**
 * Description : 커뮤니티 > 포럼 mixin
 * Author      : atom
 * Date        : 2020.07.21
 */
var frumMixin = {

    data: function() {
        return {
            // 아규먼트정보
            argVo: {
                forumGroupSeq: null,
                forumSeq: null,
                curPage: null,
                schTpCd: null,
                schKwd: null
            },

            // 회원아이디
            mbrId: ""
        };
    },

    methods: {
        // 아규먼트 초기화
        initArg: function() {
            this.argVo.forumGroupSeq = WebUtil.nvl(DocUtil.getElId("argForumGroupSeq").value, "");
            this.argVo.forumSeq      = WebUtil.nvl(DocUtil.getElId("argForumSeq").value, "");
            this.argVo.curPage       = WebUtil.nvl(DocUtil.getElId("argCurPage").value, "");
            this.argVo.schTpCd       = WebUtil.nvl(DocUtil.getElId("argSchTpCd").value, "");
            this.argVo.schKwd        = WebUtil.nvl(DocUtil.getElId("argSchKwd").value, "");

            // 회원아이디
            this.mbrId = SessionUtil.getMbrId();
        },

        /**
         * 파라미터 구하기
         */
        getParam: function(mode) {
            var result = "forumGroupSeq=" + this.argVo.forumGroupSeq;

            if (WebUtil.isNotNull(this.argVo.forumSeq) && mode == "read") {
                result += "&forumSeq=" + this.argVo.forumSeq;
            }

            if (WebUtil.isNotNull(this.argVo.curPage)) {
                result += "&curPage=" + this.argVo.curPage;
            }

            if (WebUtil.isNotNull(this.argVo.schTpCd)) {
                result += "&schTpCd=" + this.argVo.schTpCd;
            }

            if (WebUtil.isNotNull(this.argVo.schKwd)) {
                result += "&schKwd=" + encodeURIComponent(this.argVo.schKwd);
            }

            return result;
        },

        /**
         * 포럼 목록 이동
         */
        onFrumListMove: function() {
            window.location.href = "/community/forum/list?" + this.getParam("list");
        },

        /**
         * 포럼 초기 이동
         */
        onFrumInitMove: function() {
            window.location.href = "/community/forum/list?forumGroupSeq=" + this.argVo.forumGroupSeq;
        }
    }

};
