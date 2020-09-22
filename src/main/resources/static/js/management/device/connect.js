
var deviceConnectApp = new Vue({
    el: "#deviceConnect",
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
        getDeviceList: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/devices",
                param: { page: this.page, size: this.size},
                reqType: "url",
                success: function(res) {
                    console.log(res.data);
                    $this.pagination = res.data;
                }
            });
        },
        goPage: function(page) {
          console.log("------ goPage: "+ page+" ------");
          this.page = page - 1;
          this.getDeviceList();
        },
        toggleLiveStatus: function(idx, status) {
            console.log("toggle: "+idx+", "+status);
            var device = this.pagination.contents[idx];
            var $this = this;
            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/management/device/"+device.devId+"/liveStatus/"+status,
                reqType: "url",
                success: function(res) {
                    $this.pagination.contents[idx].liveStatus = status;
                }
            });

        }



    },
    mounted: function() {
        this.getDeviceList();
    },
    watch: {

    }
});
