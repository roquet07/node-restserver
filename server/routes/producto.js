
const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//====================================
// Obtener todos los productos
//====================================

app.get('/productos',verificarToken, (req, res)=>{
   //Trae todos los productos
   //populate: usuario categoria
   //paginado
   let desde = req.query.desde || 0;
   desde = Number(desde);

   Producto.find({ disponible:true })
           .skip(desde)
           .limit(5)
           .populate('usuario', 'nombre email')
           .populate('Categoria', 'descripcion')
            .exec(( err, productos )=>{
                if(err){
                    return res.status(500).json({
                         ok:false,
                         err
                    });
                }
                res.json({
                  ok:true,
                  productos
                });
            });
   


});

//====================================
// Obtener todos los productos por ID
//====================================

app.get('/productos/:id',verificarToken ,(req, res)=>{
    //populate: usuario categoria
    //paginado

    let id = req.params.id;

    Producto.findById( id)
            .populate('usuario', 'nombre email')
            .populate('Categoria', 'nombre')
            .exec((err, productoDB)=>{
          
             if(err){
              return res.status(500).json({
                 ok:false,
                 err
              });
             }

             if(!productoDB){
                return res.status(400).json({
                   ok:false,
                   err:{
                       message:'ID no existe'
                   }
                });

               }

               res.json({
                   ok:true,
                  producto:productoDB
               });

    });
});

//====================================
// Buscar un producto
//====================================

app.get('/productos/buscar/:termino', verificarToken ,( req, res)=>{
     
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
            .populate('Categoria','nombre')
            .exec( (err, productos)=>{
               if(err){
                   return res.status(500).json({
                       ok:false,
                       err
                   });
               }

               res.json({
                  ok:true,
                  productos
               })
            });
});

//====================================
// crear un nuevo producto
//====================================

app.post('/productos',verificarToken,(req, res)=>{
    //grabar el usuario
    //grabar una categoria del listado
  
    let body = req.body;

    let producto = new Producto({
        
       usuario: req.usuario._id,
       nombre:body.nombre,
       precioUni:body.precioUni,
       descripcion: body.descripcion,
       disponible: body.disponible,
       categoria: body.categoria
      
    });
    
    producto.save((err, productoDB)=>{

        if(err){
            return res.status(500).json({
                 ok:false,
                 err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                 ok:false,
                 err
            });
        }
        res.status(201).json({
            ok:true,
            producto:productoDB
        });
    });
 
 });

//====================================
// Actualizar un producto
//====================================

app.put('/productos/:id',verificarToken ,(req, res)=>{
    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                 ok:false,
                 err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                 ok:false,
                 err:{
                     message:'El id no existe'
                 }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        

        productoDB.save( (err, productoGuardado )=>{
            if(err){
                return res.status(500).json({
                     ok:false,
                     err
                });
            }
            res.json({
                ok:true,
                producto:productoGuardado
            });
        });

    });
 
 });


 //====================================
// Borrar un producto
//====================================

app.delete('/productos/:id', (req, res)=>{
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;
     
    Producto.findById(id, (err, productoDB )=>{
        if(err){
            return res.status(500).json({
                 ok:false,
                 err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                 ok:false,
                 err:{
                     message:'El ID no existe'
                 }
            });
        }
        productoDB.disponible = false;
        
        productoDB.save( (err, productoBorrado)=>{
            if(err){
                return res.status(500).json({
                     ok:false,
                     err
                });
            }
            res.json({
                ok:true,
                producto: productoBorrado,
                message:'Producto borrado'
            });

        });
        
    });
 
 });



 module.exports = app;