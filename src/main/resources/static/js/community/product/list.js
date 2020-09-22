
var productListApp = new Vue({
    el: "#productList",
    data: {
        disable: false,
        page: 0,
        size: 8,
        productList: [],
        options: {
            prdtType: 'all',
            prdtName: ''
        }

    },
    methods: {
        getProdcutList: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/products",
                param: { page: this.page++, size: this.size, prdtType: this.options.prdtType, prdtName: this.options.prdtName},
                reqType: "url",
                success: function(res) {
                    console.log(res.data);
                    res.data && ($this.productList = [...$this.productList, ...res.data])

                    // 스크롤 로더 중지
                    if (res.data.length < $this.size) {
                        $this.disable = true;
                    }
                }
            });
        },
        toWrite: function() {
            if (SessionUtil.getMbrYn()) {
                window.location.href = "/community/product/write";
            } else {
                WebUtil.goLogin();

                /*
                LayerUtil.confirm({
                    msg: "로그인 후 이용 가능합니다.<br />로그인 하시겠습니까?",
                    callback: function(resYn) {
                        if (resYn) {
                            WebUtil.goLogin();
                        }
                    }
                });
                */
            }
        },

        toRead: function(prdtSeq) {
            window.location.href = "/community/product/read?prdtSeq=" + prdtSeq;
        },

        showData: function() {
            console.log(JSON.stringify(productListApp.$data));
        },

        search: function () {
               this.page = 0;
               this.productList = [];
               this.getProdcutList();
        }
    },
    mounted: function() {
        this.getProdcutList();
    },
    watch: {
      page (value) {
        console.log("page: "+value);
        this.disable = value > 50
      }
    }
});
