
var mywriteListApp = new Vue({
    el: "#mywriteList",
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
        getMyWriteList: function() {
            var $this = this;
            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/comregstList",
                param: { page: this.page, size: this.size, cretrId: SessionUtil.getMbrId()},
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
          this.getMyWriteList();
        }


    },
    mounted: function() {
        this.getMyWriteList();
    },
    watch: {

    }
});
