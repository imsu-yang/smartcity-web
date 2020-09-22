/**
 * Description : 포럼 소개
 * Author      : atom
 * Date        : 2020.07.20
 */
var frumIntrApp = new Vue({
    el: "#forumIntro",
    data: {
        // 포럼그룹목록
        frumGrpList: [],

        // 포럼인기목록
        frumHitList: [],

        // 포럼추천목록
        frumRcmdList: []
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 포럼 소개 정보 조회
            var $this = this;

             AjaxUtil.get({
                 url: GblVar.apiUrl + "/api/community/forum/selectFrumIntrInfo",
                 param: null,
                 success: function(response) {
                     $this.frumGrpList  = response.data.frumGrpList;
                     $this.frumHitList  = response.data.frumHitList;
                     $this.frumRcmdList = response.data.frumRcmdList;
                 }
             });
        },

        /**
         * 포럼 목록 이동
         */
        onFrumListMove: function(forumGroupSeq) {
            if (WebUtil.isNotNull(forumGroupSeq)) {
                window.location.href = "/community/forum/list?forumGroupSeq=" + forumGroupSeq;
            } else {
                if (this.frumGrpList.length > 0) {
                    window.location.href = "/community/forum/list?forumGroupSeq=" + this.frumGrpList[0].forumGroupSeq;
                }
            }
        },

        /**
         * 포럼 상세 이동
         */
        onFrumReadMove: function(forumGroupSeq, forumSeq) {
            window.location.href = "/community/forum/read?forumGroupSeq=" + forumGroupSeq + "&forumSeq=" + forumSeq;
        }
    },
    mounted: function() {
        // 페이지 초기화
        this.initPage();
    }
});
