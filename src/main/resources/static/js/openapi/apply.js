
var openApiApp = new Vue({
    el: "#apply",
    data: {
        mbrId: SessionUtil.getMbrId(),
        token: ''
    },
    methods: {
        apply: function() {
            var $this = this;
            AjaxUtil.post({
                url: GblVar.apiUrl+"/api/open-api/apply",
                param: {
                    cretrId: this.mbrId
                },
                reqType: "json",
                success: function(response) {

                    $this.token = response.data;
                    console.log(response.data);
                }
            });
        }
    },
    mounted: function() {
    }
});
