let request = require('request')
let productos = []

function searchProduct(id) {
  return new Promise((resolve, reject) => {
    let options = {
      uri: 'https://api.mercadolibre.com/items/'+id,
      method: 'GET',
      json: true
    }
    request(options, (error, response, body)=> {
      if (error) {
        return reject({message:'Error al realizar consulta.',error})
      }
      else if (response.statusCode >= 400) {
        reject('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body)
      }
      else {
        let pictures = []
        for (const picture of body.pictures) {
          pictures.push({url: picture.url})
        }
        productos.push({
          id: body.id,
          title: body.title,
          price: body.price,
          currency_id: body.currency_id,
          permalink: body.permalink,
          thumbnail: body.thumbnail,
          pictures,
          descriptions: body.descriptions
        })
        resolve(productos)
      }
    })
  })
}

module.exports = (app,express) => {
  let apiRouter = express.Router()
  apiRouter.route('/productos')
  .post((req,res)=> {
    searchProduct(req.body.id)
    .then(
      succ => res.status(201).json({message:'Exito al guardar el producto', succ}),
      err => res.status(400).json(err)
    )
  })
  .get((req,res)=> {
    return res.status(200).json(productos)
  })

  apiRouter.route('/productos/:id')
  .get((req, res) => {
    for (const producto of productos) {
      if (producto.id === req.params.id) {
        return res.status(200).json(producto)
      }
    }
    return res.status(400).json({message:'No se encontró el elemento.'})
  })
  .delete((req, res)=> {
    for (let i = 0; i < productos.length; i++) {
      if(productos[i].id === req.params.id) {
        productos.splice(i,1)
        return res.status(200).json({message:'Éxito al eliminar'})
      }
    }
    return res.status(400).json({message: 'No se encontró elemento a eliminar'})
  })

  return apiRouter;
}
