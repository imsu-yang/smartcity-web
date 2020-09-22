
var statusListApp = new Vue({
    el: "#statusList",
    data: {
        page: 0,
        size: 5,
        pagination: {
            previousPage: '',
            nextPage: '',
            firstPage: '',
            lastPage: '',
            page: '',
            pages: [],
            hasPreviousPage: '',
            hasNextPage: '',
            contents: []
        }
    },
    methods: {
        getComregstList: function() {
            var $this = this;
            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/mypage/comregstList",
                param: { page: this.page, size: this.size, cretrId: SessionUtil.getMbrId(), userNm: SessionUtil.getMbrNm()},
                reqType: "json",
                success: function(res) {
                    console.log(res.data);
                    $this.pagination = res.data;
                }
            });
        },
        goPage: function(page) {
          console.log("------ goPage: "+ page+" ------");
          this.page = page - 1;
          this.getComregstList();
        },
        toRead: function(regstSeq) {
            window.location.href = "/mypage/status/read?regstSeq=" + regstSeq;
        }

    },
    mounted: function() {
        this.getComregstList();
    },
    watch: {

    }
});
