
var productReadApp = new Vue({
    el: "#productRead",
    data: {
        prdtSeq: null,
        commentList: [],
        cretrId: SessionUtil.getMbrId(),
        prdtCommentContent: '',
        product: ''
    },
    methods: {
        initPage: function() {
            this.getProduct();
            this.getCommentList();
        },

        getProduct: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/product/"+this.prdtSeq,
                success: function(res) {
                    console.log("-------- product ---------");
                    console.log(res.data);
                    $this.product = res.data;

                }
            });
        },

        getCommentList: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/product/comments/"+this.prdtSeq,
                reqType: "url",
                success: function(res) {
                    // console.log(JSON.stringify(res.data));
                    console.log("------ comments ------");
                    $this.commentList = res.data;


                    $this.commentList.forEach(function (item, index) {

                        if (item.cretrId == SessionUtil.getMbrId()) {
                            item.myComment = true;
                        } else {
                            item.myComment = false;
                        }
                    });

                    console.log($this.commentList);
                }
            });
        },
        deleteComment: function(prdtCommentSeq) {
            var $this = this;
            AjaxUtil.delete({
                url: GblVar.apiUrl + "/api/community/product/comments/"+$this.prdtSeq+"/"+prdtCommentSeq,
                reqType: "json",
                success: function(res) {
                    $this.getCommentList();
                }
            });
        },
        toggleComment: function(prdtCommentSeq) {
            if ($("#prdtCmtUptWrap" + prdtCommentSeq).css("display") == "none") {
                $("#prdtCmtUptWrap" + prdtCommentSeq).show();
                $("#prdtCmtTxtWrap" + prdtCommentSeq).hide();
                $("#prdtCmtToggleBtn" + prdtCommentSeq).text("취소")
            } else {
                $("#prdtCmtUptWrap" + prdtCommentSeq).hide();
                $("#prdtCmtTxtWrap" + prdtCommentSeq).show();
                $("#prdtCmtToggleBtn" + prdtCommentSeq).text("수정")
            }
        },
        modifyComment: function(prdtCommentSeq) {

            var prdtCommentContent = $("#prdtCmtUptCont"+prdtCommentSeq).val();

            var $this = this;
            AjaxUtil.put({
                url: GblVar.apiUrl + "/api/community/product/comment",
                param: { prdtSeq: $this.prdtSeq, prdtCommentParent:0, prdtCommentSeq: prdtCommentSeq, prdtCommentContent: prdtCommentContent, cretrId: SessionUtil.getMbrId()},
                reqType: "json",
                success: function(res) {
                    console.log(res.data);
                    $this.getCommentList();
                    $this.toggleComment(prdtCommentSeq);
                }
            });


        },
        writeComment: function() {

            console.log("session: {}", SessionUtil.getMbrYn());

            if (SessionUtil.getMbrYn()) {

                var $this = this;
                AjaxUtil.post({
                    url: GblVar.apiUrl + "/api/community/product/comment",
                    param: { prdtSeq: this.prdtSeq, prdtCommentParent:0, prdtCommentContent: this.prdtCommentContent, cretrId: this.cretrId},
                    reqType: "json",
                    success: function(res) {
                        console.log(res.data);
                        $this.prdtCommentContent = '';
                        $this.getCommentList();


                    }
                });

            } else {
                WebUtil.goLogin();
            }

        },
        modifyProduct: function() {
            if (SessionUtil.getMbrYn()) {

                window.location.href = "/community/product/write?prdtSeq=" + this.prdtSeq

            } else {
                WebUtil.goLogin();
            }
        },
        deleteProduct: function() {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                if (SessionUtil.getMbrId() != $this.product.cretrId) {
                    console.log(SessionUtil.getMbrId()+", "+$this.product.cretrId);
                    LayerUtil.alert("게시글 작성자만 삭제할 수 있습니다.");
                } else {

                    LayerUtil.confirm({
                        msg: "해당 게시글을 삭제하시겠습니까?",
                        callback: function (resYn) {
                            if (resYn) {
                                AjaxUtil.delete({
                                    url: GblVar.apiUrl + "/api/community/product/" + $this.prdtSeq,
                                    reqType: "json",
                                    success: function (res) {
                                        window.location.href = "/community/product/list";
                                    }
                                });
                            }
                        }
                    });
                }


            } else {
                WebUtil.goLogin();
            }
        },
        toWriteProduct: function() {
            if (SessionUtil.getMbrYn()) {
                window.location.href = "/community/product/write";
            } else {
                WebUtil.goLogin();

            }
        },
        toProductList: function() {
            window.location.href = "/community/product/list";
        }
    },
    mounted: function() {
        this.prdtSeq = WebUtil.nvl(DocUtil.getElId("argPrdtSeq").value, null);

        this.initPage();
    }
});
