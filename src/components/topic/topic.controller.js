const topicSchema = require('./topic.schema');
const { success, errors } = require('../../utils').response
const upload=require('../../utils/upload')
function topicController() {
    const methods = {
    allTopics: async (req, res) => {
            try{
                let topics= await topicSchema.find();
                if(!topics){
                    return errors(res,400,"Topics not found!");
                }
                return success(
                    res,
                    200,
                    {topics},
                    "Topics fetched successfully"
                    );
            }catch(e){
               return  errors(res,500,e);
            }
        },
    //Create topic
    createTopic: async (req, res) => {
        let uploadFun = upload.fileUpload.single('topicImage');
        uploadFun(req, res, function (err) {
            console.log(err);
            if(err) { 
                // Error occurred due 
                // to uploading image of size greater than 
                // 1MB or uploading different file type) 
                return  errors(res,500,err);
            }
            //File uploaded successfully
            //Create topic in DB 
            //Check for the topic
            topicSchema.findOne({'name':req.body.name.trim().toLowerCase()}).then((topic)=>{
                if(topic==null){
                    //Create topic only if not exist
                    let newTopicData={name:req.body.name.trim().toLowerCase(),image:req.file.path};
                    topicSchema.create(newTopicData).then((newTopic)=>{
                        return success(res, 200, {
                            message: "Topic created successfully"
                        });
                    }).catch((err)=>{
                        return errors(res, 500,err);
                    });
                }else{
                    return errors(res, 500,"Topic already exist"); 
                }
            }); 
        })
    },
    //Update topic
    updateTopic: async (req, res) => {
            
    },
    //Get one topic by id
    getOneTopic: async (req, res) => {
        try{
            let id = req.params.id;
            if (!id) {
            return errors(res, 400, "id path param is missing");
            }
            let topic= await topicSchema.findOne({_id:id});
            if(!topic){
                return errors(res,400,"Topics not found!");
            }
            return success(
                res,
                200,
                {topic},
                "Topics fetched successfully"
                );
        }catch(e){
           return  errors(res,500,e);
        }
    },
    }
    return Object.freeze(methods);    
}

module.exports = topicController();
