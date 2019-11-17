const express = require('express');

const { verificarToken, verificarAmin_Role } =  require('../middlewares/autenticacion');


let app = express();

let Categoria = require('../models/categoria');

//=============================================
//  Mostrar todas las categorias
//=============================================
app.get('/categoria', verificarToken, ( req, res)=>{
    
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario',' nombre email')
    .exec(( err, categorias)=>{
         if(err){
             return res.status(500).json({
               ok:false,
               err
             });
         }
         res.json({
           ok:true,
           categorias  
         })
    });
});

//=============================================
//  Mostrar una categoria por ID
//=============================================
app.get('/categoria/:id', verificarToken, ( req, res)=>{
    
      let id = req.params.id;

     //Categoria.findById(.....)
     Categoria.findById(id, (err, categoriaDB)=>{
           
        if(err){
            return res.status(500).json({
              ok:false,
              err
            });
        }
        if(!categoriaDB){
            return res.status(500).json({
              ok:false,
              err:{
                  message:'El ID no es correcto'
              }
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        });


     });
   
});

//=============================================
//  Crear una nueva categoria
//=============================================

app.post('/categoria',verificarToken ,( req, res)=>{

    //Regresa la nueva categoria
    //req.usuario._id
   let body = req.body;
   let categoria = new Categoria({
       descripcion: body.descripcion,
       usuario: req.usuario._id
   });

   categoria.save((err, categoriaDB)=>{
        
    if(err){
        return res.status(500).json({
             ok:false,
             err
        });
    }
    if(!categoriaDB){
        return res.status(400).json({
             ok:false,
             err
        });
    }
    res.json({
        ok:true,
        categoria:categoriaDB
    })

   });

});

//=============================================
//  Actualizar una categoria
//=============================================

app.put('/categoria/:id',verificarToken , ( req, res)=>{
    let id = req.params.id;
    let  body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
        ///1 parametro el id  2 lo queremos actualizar  3 configuraciones 4
    Categoria.findByIdAndUpdate( id, descCategoria, { new:true, runValidators: true},(err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                 ok:false,
                 err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                 ok:false,
                 err
            });
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    });
    
});

//=============================================
//  ¿Eliminar una categoria
//=============================================

app.delete('/categoria/:id',[verificarToken, verificarAmin_Role], ( req, res)=>{
    //Solo un administrador puede borrar categorias
    //Categoria.findByIdandRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                 ok:false,
                 err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                 ok:false,
                 err:{
                     message:'El id no existe'
                 }
            });
        }


        res.json({
            ok:true,
            message: 'Categoria borrada'
        });
    });
    
});







module.exports = app;