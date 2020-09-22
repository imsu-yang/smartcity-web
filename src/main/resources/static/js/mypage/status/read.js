
var statusReadApp = new Vue({
    el: "#statusRead",
    data: {
        regstSeq: null,
        comment: '',
        content: '',
        commentList: []
    },
    methods: {
        initPage: function() {
            this.getContent();
            this.getComments();
        },

        getContent: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/comregst/"+this.regstSeq,
                success: function(res) {
                    console.log("-------- content ---------");
                    console.log(res.data);
                    $this.content = res.data;

                }
            });
        },
        getComments: function() {
            var $this = this;

            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/comregstDtlList",
                param: { regstSeq: this.regstSeq},
                reqType: "json",
                success: function(res) {
                    console.log("-------- comments ---------");
                    console.log(res.data.contents);
                    $this.commentList = res.data.contents;

                }
            });
        },
        writeComment: function() {
            var $this = this;

            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/comregstDtl",
                param: { regstSeq: this.regstSeq, cretrId: SessionUtil.getMbrId(), revwOpn: $this.comment},
                reqType: "json",
                success: function(res) {
                    $this.comment = '';
                    $this.getComments();
                }
            });
        },
        toList: function() {
            window.location.href = "/mypage/status/list";
        }
    },
    mounted: function() {
        this.regstSeq = WebUtil.nvl(DocUtil.getElId("argRegstSeq").value, null);

        this.initPage();


    }
});
