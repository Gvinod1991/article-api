const articleSchema = require('./article.schema');
const { success, errors } = require('../../utils').response
const async = require('async');
function articleController() {
    const methods = {
    //get all articles
    allArticles: async (req, res) => {
            let sortOrder = req.query.sortOrder ?   req.query.sortOrder : 'asc';
            try{
                let articles=await articleSchema.find().sort({createdAt: sortOrder === 'desc' ?  -1 : 1 });
                if(!articles){
                    return errors(res,400,"Articles not found!");
                }
                return success(
                    res,
                    200,
                    {articles},
                    "Articles fetched successfully"
                    );
            }catch(e){
               return  errors(res,500,e);
            }
        },
        //Open article
        allFeaturedArticles: async (req, res) => {
            let isFeatured = true;
            let sortOrder = req.query.sortOrder ?   req.query.sortOrder : 'asc';
            try{
                let articles= await articleSchema.find({isFeatured:isFeatured}).sort({createdAt: sortOrder === 'desc' ?  -1 : 1 });
                if(!articles){
                    return errors(res,400,"Articles not found!");
                }
                //Update the fetch count only is User is not admin 
                if(req.user.is_user && articles.length > 0){
                    async.eachSeries(articles, function updateObject (obj, done) {
                        articleSchema.update({ _id: obj._id }, { $set : { fetchCount: obj.fetchCount ? obj.fetchCount+1: 1 }}, done);
                    }, function allDone (err) {
                        if(err){
                            return errors(res,400,"Articles fetch update!");
                        }
                    });
                }
                return success(
                    res,
                    200,
                    {articles},
                    "Articles fetched successfully"
                    );
            }catch(e){
                return  errors(res,500,e);
            }
        },
        allOpenFeaturedArticles: async (req, res) => {
            let isFeatured = false;
            let sortOrder = req.query.sortOrder ?   req.query.sortOrder : 'asc';
            try{
                let articles= await articleSchema.find({isFeatured:isFeatured}).sort({createdAt: sortOrder === 'desc' ?  -1 : 1 });
                if(!articles){
                    return errors(res,400,"Articles not found!");
                }
                //Update the fetch count only is User is not admin 
                if(articles.length > 0){
                    async.eachSeries(articles, function updateObject (obj, done) {
                        articleSchema.update({ _id: obj._id }, { $set : { fetchCount: obj.fetchCount ? obj.fetchCount+1: 1 }}, done);
                    }, function allDone (err) {
                        if(err){
                            return errors(res,400,"Articles fetch update!");
                        }
                    });
                }
                return success(
                    res,
                    200,
                    {articles},
                    "Articles fetched successfully"
                    );
            }catch(e){
                return  errors(res,500,e);
            }
        },
    //Create article
    createArticle: async (req, res) => {  
        //Check for the article
        if(!req.file){
            return errors(res, 500,"Article image required should be less then 1MB"); 
        }
        try{
        let article=await articleSchema.findOne({'title':req.body.title});
            if(article==null){
                //Create article only if not exist
                let newArticleData={
                    title:req.body.title,
                    image:req.file.path,
                    content:req.body.content,
                    isFeatured:req.body.isFeatured,
                    topic_id:req.body.topic_id,
                    tags:req.body.tags ? req.body.tags.split(',') : []
                    };
                await articleSchema.create(newArticleData)
                return success(res, 200, {
                    message: "Article created successfully"
                });
            }else{
                return errors(res, 500,"Article already exist"); 
            }
        }catch(err){
            return errors(res,500,err)
        }
    },
    //Update article
    updateArticle: async (req, res) => {
        let id = req.params.id;
        if (!id) {
        return errors(res, 400, "id path param is missing");
        }
        try{
                req.body.tags= req.body.tags ? req.body.tags.split(',') : [];
                await articleSchema.update(req.body).where({_id:id})
                return success(res, 200, {
                    message: "Article updated successfully"
                });
            }
        catch(err){
                return errors(res,500,err)
            }
    },
    //Get one article by id
    getOneArticle: async (req, res) => {
        try{
            let id = req.params.id;
            if (!id) {
            return errors(res, 400, "id path param is missing");
            }
            let article= await articleSchema.findOne({_id:id});
            if(!article){
                return errors(res,400,"Topics not found!");
            }
            //Update the fetch count only is User is not admin 
            if(req.user.is_user){
                let count=1;
                count = article.fetchCount ? article.fetchCount+1: count;
                article.fetchCount=count;
                await articleSchema.update({fetchCount:count}).where({_id:id})
            }
            return success(
                res,
                200,
                {article},
                "Article fetched successfully"
                );
        }catch(e){
           return  errors(res,500,e);
        }
    },
    //Get one article by id
    getOpenArticle: async (req, res) => {
        try{
            let id = req.params.id;
            if (!id) {
            return errors(res, 400, "id path param is missing");
            }
            let article= await articleSchema.findOne({_id:id});
            if(!article){
                return errors(res,400,"Topics not found!");
            }
            //Update the fetch count only is User is not admin 
            let count=1;
            count = article.fetchCount ? article.fetchCount+1: count;
            article.fetchCount=count;
            await articleSchema.update({fetchCount:count}).where({_id:id})
            return success(
                res,
                200,
                {article},
                "Article fetched successfully"
                );
        }catch(e){
           return  errors(res,500,e);
        }
    },
    articleByTopic: async (req, res) => {
        try{
            let topic_id = req.params.topic_id;
            let sortOrder = req.query.sortOrder ?   req.query.sortOrder : 'asc';
            if (!topic_id) {
            return errors(res, 400, "id path param is missing");
            }
            let articles= await articleSchema.findOne({topic_id:topic_id}).sort({createdAt: sortOrder === 'desc' ?  -1 : 1 });
            if(!articles){
                return errors(res,400,"Article not found!");
            }
            //Update the fetch count only is User is not admin 
            if(req.user.is_user && articles.length > 0){
                async.eachSeries(articles, function updateObject (obj, done) {
                    articleSchema.update({ _id: obj._id }, { $set : { fetchCount: obj.fetchCount ? obj.fetchCount+1: 1 }}, done);
                }, function allDone (err) {
                    if(err){
                        return errors(res,400,"Articles fetch update!");
                    }
                });
            }
            return success(
                res,
                200,
                {article},
                "Article fetched successfully"
                );
        }catch(e){
           return  errors(res,500,e);
        }
    },
    articlesByTagName: async (req, res) => {
        try{
            let tagName = req.query.tagName;
            let sortOrder = req.query.sortOrder ?   req.query.sortOrder : 'asc';
            if (!tagName) {
            return errors(res, 400, "tagName query param is missing");
            }
            let articles= await articleSchema.find({tags:tagName}).sort({createdAt: sortOrder === 'desc' ?  -1 : 1 });
            if(!articles){
                return errors(res,400,"Article not found!");
            }
            //Update the fetch count only is User is not admin 
            if(req.user && req.user.is_user && articles.length > 0){
                async.eachSeries(articles, function updateObject (obj, done) {
                    articleSchema.update({ _id: obj._id }, { $set : { fetchCount: obj.fetchCount ? obj.fetchCount+1: 1 }}, done);
                }, function allDone (err) {
                    if(err){
                        return errors(res,400,"Articles fetch update!");
                    }
                });
            }
            return success(
                res,
                200,
                {articles},
                "Article fetched successfully"
                );
        }catch(e){
           return  errors(res,500,e);
        }
    },
    }
    return Object.freeze(methods);    
}

module.exports = articleController();
