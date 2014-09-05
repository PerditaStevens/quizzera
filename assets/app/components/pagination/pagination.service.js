
angular.module('app')
.factory('Pagination', function(_, $q){
    var paginations = {};

    function Pagination(name){
        this.name = name;       // some identifying name (TODO: currently unique not ensured)
        this.pageChangeListeners = [];

        this.page = 1;          // page range [1...P]
        //this.limit = 9999;         // TODO: limit = 0 should be unlimited!
        this.limit = 10;         // TODO: limit = 0 should be unlimited!
        this.totalItems = 0;    // needs to be provided on initialization
        // this.totalPages = 0; // only available via getter

        this.cache = {};

    }
    Pagination.prototype = {

        refresh: function(){
            this.validateCurrentPage();
        },
        updateTotalCount: function(count){
            var self = this;
            $q.when(count).then(function(count){
                // accept either number or object with count attribute
                self.totalItems = _.find([count, count.count], _.isFinite);
                self.refresh();
            });
        },


        // queries
        isOnPage: function(n){
            return (this.page == n);
        },
        isFirstPage: function(){
            return (this.page == 1);
        },
        isLastPage: function(){
            return (this.page == this.getTotalPages());
        },
        getTotalPages: function(){
            if(!this.limit){
                return 1;
            }
            var total = Math.ceil(this.totalItems/this.limit);
            return total? total : 1;    // prevent 0
        },

        // navigation
        setPage: function(n){
            if(n < 1){
                this.page = 1;
            }
            else if( n > this.getTotalPages()){
                this.page = this.getTotalPages();
            }
            else if(this.page === n){
                return;
            }
            else {
                this.page = n;
            }
            this.handleChange();
        },
        next: function(){
            if(!this.isLastPage()){
                this.setPage(this.page+1);
            }
        },
        previous: function(){
            if(!this.isFirstPage()){
                this.setPage(this.page-1);
            }
        },
        first: function(){
            if(!this.isFirstPage()){
                this.setPage(1);
            }
        },
        last: function(){
            if(!this.isLastPage()){
                this.setPage(this.getTotalPages());
            }
        },


        // management
        init: function(promiseReturningConfig){
            var self = this;
            return $q.when(promiseReturningConfig).then(function(config){
                angular.extend(self, config);
                self.announceCollectionChange();
            });
        },


        // listenerCallback is function
        //      if it return promise or array,
        //      the data will be cached for the corresponding page
        //      until an announceCollectionChange() is triggered
        // 
        onChange: function(listenerCallback){
            this.pageChangeListeners.push(listenerCallback);
        },

        // calls all onChange listeners with
        //      > pagination information {page, limit, totalPages}
        //      and
        //      > cached data for corresponding page (if available)
        // 
        handleChange: function(){
            var promises = [];
            var self = this;
            var page = this.page;   // cache current page for use in promises

            _.each(this.pageChangeListeners, function(listenerCallback){
                promises.push(
                    // call listenerCallbacks and store promises
                    listenerCallback({
                    page: this.page,
                    limit: this.limit,
                    totalPages: this.getTotalPages()
                }, this.cache[page]));
            }, this);

            $q.all(promises).then(function(results){
                results.reverse(); // last callback that provided data wins
                var data = _.find(results, function(result){
                    return _.isArray(result);
                });
                if(data){
                    self.cache[page] = data;
                }
            });
        },
        // can be triggered to trigger cache clear
        // and onChange listeners
        announceCollectionChange: function(){
            this.cache = {};
            this.doItemCountUpdate();
        },


        // returns array of indexes; allows for later adaption to only show specific ranges
        // like [<<][<][1][2]...[11](12)[13]...[34][35][>][>>]
        getPageList: function(){
            return _.range(1,this.getTotalPages()+1);
        },
        set: function(config){
            _.each(config, function(val, key){
                this[key] = val;
            }, this);
            this.validateCurrentPage();
        },

        doItemCountUpdate: function(){
            // this function will be overwritten by providing itemCountUpdate with
            // a promise that resolve to a number
            this.totalItems = 0;
        },

        itemCountUpdate: function(promise){
            // TODO: only trigger onCollectionChange
            // which in turn could be triggered from controller that uses paginator
            var self = this;

            if(!promise){
                return;
            }

            this.doItemCountUpdate = _.bind(function(){
                $q.when(promise()).then(function(count){
                    self.totalItems = count;
                    self.validateCurrentPage();
                    self.handleChange();
                });
            }, this);
        },

        validateCurrentPage: function(){
            this.setPage(this.page);
        }

    };


    function getOrCreatePagination(collectionName, opts){
        var pg = paginations[collectionName] = paginations[collectionName]
                                               || new Pagination(collectionName);
        pg.set(opts);
        return pg;
    }


    return {
        getOrCreate: getOrCreatePagination
    };
});
