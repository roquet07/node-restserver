const jwt = require('jsonwebtoken');

//===================================
// Verificar Token
//===================================

let verificarToken = ( req, res, next ) =>{
   
    let token = req.get('token');
    
    jwt.verify( token, process.env.SEED , (err, decoded) =>{
        
        if( err ){
            return res.status(401).json({
                   ok:false,
                   err:{
                       message:'Token no valido'
                   }
            });
        }
        req.usuario = decoded.usuario;
        next();
        
    });
};

//===================================
// Verificar Token
//===================================

let verificarAmin_Role = ( req, res, next ) =>{

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE' ){

        next();
    
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message:'No es administrador'
            }
     });
    }

}

//===================================
// Verificar Token en imagen
//===================================

let verificaTokenImg = ( req, res, next ) =>{
   
    let token = req.query.token

    jwt.verify( token, process.env.SEED , (err, decoded) =>{
        
        if( err ){
            return res.status(401).json({
                   ok:false,
                   err:{
                       message:'Token no valido'
                   }
            });
        }

        req.usuario = decoded.usuario;
        next();
        
    });


}


module.exports = {
    verificarToken,
    verificarAmin_Role,
    verificaTokenImg
}