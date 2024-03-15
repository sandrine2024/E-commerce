import { env } from "../config/index.js";
import ModelUser from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


export const signup = async (req, res, next) => {
  // Début du bloc try pour la gestion des erreurs
  try {
    // Hashage du mot de passe avec bcrypt, 
    // "10" est le nombre de tours de salage
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // Création d'un nouvel utilisateur dans la base de données 
		// avec les informations reçues et le mot de passe haché
    await ModelUser.create({ 
		// '...req.body' est une syntaxe de 
		// décomposition (spread syntax).
    // Elle permet de créer une copie 
		// de toutes les propriétés 
		// de 'req.body' et de les ajouter à l'objet 
		// en cours de création.
      ...req.body,
      password: hashedPassword
     });

    // Envoi d'une réponse avec le statut 201 (créé) 
		// et un message de confirmation
    res.status(201).json("User has been created!");
  } catch (error) {
    // Si une erreur se produit, passez-la au prochain 
		// middleware pour la gestion des erreurs
    next(error);
  }
};




// En résumé, les tokens, aussi appelés « jetons » en français, sont des unités de valeur numériques correspondants à des actifs spécifiques au sein d’un système informatique. …

export const sign = async (req, res,next) => {
  try{
    // Recherche l'utilisateur dans 
		// la base de données par son email
    const user = await ModelUser.findOne({ email: req.body.email })
    // si l'utilisateur n'est pas trouvé, 
		// renvoie une erreur 404.
    if(!user) return res.status(404).json("User not found!");

    // Compare le mot de passe fourni dans la requête 
		// avec le mot de passe de l'utilisateur (qui est dans la bdd)
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    )

		// Si le mot de passe est incorrect, 
		// renvoie une erreur 400.
    if(!comparePassword) return res.status(400).json("Wrong Credentials!")
    //  traduction wrong credentials=Mauvaises informations d'identification

    // Crée un jeton JWT pour l'utilisateur avec son ID, 
		// expire après 24 heures
    const token = jwt.sign(
		// Le premier argument est la charge utile du token. 
		// Ici, nous incluons l'ID de l'utilisateur
		{ id: user._id}, 
		// Le deuxième argument est la clé secrète, 
		// qui est utilisée pour signer le token. 
	  // Nous la récupérons à partir 
		// des variables d'environnement
		env.token, 
	  // Le troisième argument est un objet 
		// contenant les options du token. 
	  // Ici, nous définissons une durée 
		// d'expiration de 24 heures pour le token
		{ expiresIn: "24h"})
    
    // Supprime le mot de passe de l'utilisateur 
		// pour des raisons de sécurité.
		// Ce code utilise la destructuration pour extraire 
		// la propriété password de user._doc. 
		// Toutes les autres propriétés sont regroupées 
		// dans un nouvel objet appelé others. 
		// C’est une pratique courante lorsque 
		// vous voulez exclure certaines propriétés d’un objet. 
    const { password, ...others } = user._doc
    
    // Envoie le jeton (token) JWT sous forme de cookie HTTPOnly
    res.cookie('access_token', token, { httpOnly: true })
    .status(200)
    .json(others) // .json(others) Renvoie les données d'utilisateur 
									// en réponse (à l'exeption du mot de passe)
  }catch(error){
    next(error)
  }
} 

export const getUsers = async (req, res) => {
  try {
    const users = await ModelUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await ModelUser.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  checkId(req, res)  
  try{
    const userDeleted = await ModelUser.findByIdAndDelete(req.params.id)
    if(!userDeleted) return res.status(404).json("User not found !")    
    res.status(200).json('userDeleted')
  }catch(error){
    console.log(error);
  }
}
export const updateUser = async (req,res) =>{
  checkId(req, res)
  try{
    const updateUser= await ModelUser.findByIdAndUpdate(req.params.id,
      {$set: req.body},
      {new: true}
      )
    if (!updateUser) return res.status(404).json('User not found')
    res.status(200).json({
      message:"User updated",
      updateUser
})
  }catch(error){
    console.log(error);
  }
}
const checkId = (req,res)=>{
  const lengthId = req.params.id.length
  if(lengthId > 24 || lengthId < 24 ) return res.status(404).json("User not found !")
}