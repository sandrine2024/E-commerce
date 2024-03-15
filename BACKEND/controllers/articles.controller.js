import articleModel from "../models/article.model.js";

export const getArticles = async (req,res) => {
    try {
        const articles = await articleModel.find()
        res.status(200).json(articles)
        
    } catch (error) {
        console.log(error);
    }
}

export const addArticle = async (req, res) => {
  try {
    
    const newArticle = await articleModel.create({ ...req.body });
  
    res.status(201).json({ message: "article created", newArticle });
  } catch (error) {
    console.log(error);
  }
};




export const getArticleById = async (req, res) => {
    try {
      const article = await articleModel.findById(req.params.id);
      res.status(200).json(article);
    } catch (error) {
      console.log(error);
    }
  };
  export const deleteArticle = async (req, res) => {
    checkId(req, res)  
    try{
      const articleDeleted = await articleModel.findByIdAndDelete(req.params.id)
      if(!articleDeleted) return res.status(404).json("Article not found !")    
      res.status(200).json('articleDeleted')
    }catch(error){
      console.log(error);
    }
  }

  export const updateArticle = async (req,res) =>{
    checkId(req, res)
    try{
      const updateArticle= await articleModel.findByIdAndUpdate(req.params.id,
        {$set: req.body},
        {new: true}
        )
      if (!updateArticle) return res.status(404).json('Article not found')
      res.status(200).json({
        message:"Article updated",
        updateArticle
  })
    }catch(error){
      console.log(error);
    }
  }
  const checkId = (req,res)=>{
    const lengthId = req.params.id.length
    if(lengthId > 24 || lengthId < 24 ) return res.status(404).json("Article not found !")
  }