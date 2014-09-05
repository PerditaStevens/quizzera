/**
 * TagController
 *
 * @description :: Server-side logic for managing Tags
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    /**
     * @methodtags 
     * @route tags/
     *
     * Query all tags with the following optional query parameters
     *
     * @param {boolean}  count    counts the results if ?count=true (ignores pagination!)
     * @param {string}   search   text search in tags' text
     * @param {int}      page     return paginated results
     * @param {int}      limit    return paginated results
     *
     * @return {Array<Tag>}  tags that match query
     * @return {count: int}       if count=true was supplied
     */

    tags: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE: wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            if(params.count){
                query = Tag.count();
            } else {
                query = Tag.find();
            }

            query = restQueryBuilder.textSearchHook(query, params, 'tag');
            if(!params.count){
                //query = restQueryBuilder.populateDefaultAttributesHook(query, params, 'quiz');
                //query = restQueryBuilder.populateAttributes(query, params.populate, 'quiz');
                query = restQueryBuilder.paginationHook(query, params);
                query = restQueryBuilder.sortHook(query, params, {createdAt: 'desc'});
            }
            return query;
        })

        .tap(function(data){
            // TODO: link users to tags?

            // add count of how often tag was used
            var promises = _.map(data, function(tag){
                return Tag.queryTimesUsed(tag).then(function(count){
                    tag.timesUsed = count;
                    return tag;
                });
            });
            return Promise.all(promises);
        })

        .then(function(data){
            if(_.isFinite(data)){
                data = {count: data};
            }
            res.json(data);
        })

        .catch(function(err){
            sails.log.error(__filefn+err);
            res.json(err);
        });
    }

};

