var Product=require('../models/product');
var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/shop', {useNewUrlParser: true});
var products=[new Product(
{
 imagePath:'https://static1.squarespace.com/static/52fc05c9e4b08fc45bd99090/t/5ca392fbe4966bd365870db7/1554223873227/mgot-aftermath-poster.jpg',
 title:'game of thrones',
 description:'song of ice and fire ',
 price:10
}),
new Product(
    {
     imagePath:'https://static1.squarespace.com/static/52fc05c9e4b08fc45bd99090/t/5ca392fbe4966bd365870db7/1554223873227/mgot-aftermath-poster.jpg',
     title:'game of thrones',
     description:'song of ice and fire ',
     price:10
    }),
    new Product(
        {
         imagePath:'https://static1.squarespace.com/static/52fc05c9e4b08fc45bd99090/t/5ca392fbe4966bd365870db7/1554223873227/mgot-aftermath-poster.jpg',
         title:'game of thrones',
         description:'song of ice and fire ',
         price:10
        }),
        new Product(
            {
             imagePath:'https://static1.squarespace.com/static/52fc05c9e4b08fc45bd99090/t/5ca392fbe4966bd365870db7/1554223873227/mgot-aftermath-poster.jpg',
             title:'game of thrones',
             description:'song of ice and fire ',
             price:10
            })
        ];
      var da=0;
        for(var i=0;i<products.length;i++)
        {
            da++;
            products[i].save(function(err,res){
            if(da===products.length)
            {
                mongoose.disconnect();
            }
        });
        }