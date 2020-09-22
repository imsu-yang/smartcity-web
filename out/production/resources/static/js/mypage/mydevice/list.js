
var myDeviceListApp = new Vue({
    el: "#myDeviceList",
    data: {
        page: 0,
        size: 8,
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
        getDeviceList: function() {
            var $this = this;
            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/management/devices",
                param: { page: this.page, size: this.size, cretrId: SessionUtil.getMbrId()},
                reqType: "json",
                success: function(res) {
                    console.log(res.data);
                    $this.pagination = res.data;
                }
            });
        },
        goMyDevice: function(devId) {
          window.location.href = "/management/device/read?devId="+devId;
        },
        goPage: function(page) {
          console.log("------ goPage: "+ page+" ------");
          this.page = page - 1;
          this.getDeviceList();
        },
        toWrite: function() {
            if (SessionUtil.getMbrYn()) {
                window.location.href = "/management/device/write";
            } else {
                WebUtil.goLogin();
            }
        },

        toRead: function(devId) {
            window.location.href = "/management/device/read?devId=" + devId;
        }


    },
    mounted: function() {
        this.getDeviceList();
    },
    watch: {

    }
});
