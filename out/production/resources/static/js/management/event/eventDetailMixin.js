/**
 * Description : 커뮤니티 > 상세 이벤트 mixin
 * Author      : atom
 * Date        : 2020.07.31
 */
var evtDtlMixin = {

    data: function() {
        return {
            // 아규먼트정보
            argVo: {
                evntId: null,
                curPage: null
            },

            // 회원순번
            mbrSeq: null,

            // 회원ID
            mbrId: null
        };
    },

    methods: {
        // 아규먼트 초기화
        initArg: function() {
            this.argVo.evntId  = WebUtil.nvl(DocUtil.getElId("argEvntId").value, "");
            this.argVo.curPage = WebUtil.nvl(DocUtil.getElId("argCurPage").value, "");

            // 회원순번
            this.mbrSeq = WebUtil.nvl(DocUtil.getElId("authMbrSeq").value, "");

            // 회원ID
            this.mbrId = SessionUtil.getMbrId();
        },

        /**
         * 파라미터 구하기
         */
        getParam: function(mode) {
            var result = "curPage=" + this.argVo.curPage;

            if (mode != "list") {
                result = "evntId=" + this.argVo.evntId + "&curPage=" + this.argVo.curPage;
            }

            return result;
        },

        /**
         * 이벤트 목록 이동
         */
        onEvtListMove: function() {
            window.location.href = "/management/event/list?" + this.getParam("list");
        },

        /**
         * 이벤트 초기 이동
         */
        onEvtInitMove: function() {
            window.location.href = "/management/event/list";
        }
    }

};
