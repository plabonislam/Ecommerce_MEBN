module.exports= function Cart(oldCart)
{ 
    //this 3 property a card should have
    this.items=oldCart.items || {};
    this.totalQty=oldCart.totalQty || 0;
    this.totalPrice=oldCart.totalPrice || 0;
//if get new item then add it.so we write  add it.. ..then we wanna know the item & id
    this.add=function(item,id){
        //this.items[id] check if item group exist  
        var storeItem=this.items[id];
        //if not exist then create one
        if(!storeItem)
        {
          //item will be providing item
          //price and quantity upadte later  

          //this.items tells item are stored as key consider here id
            storeItem=this.items[id]={item:item,qty:0,price:0};
        }
        storeItem.qty++;
        storeItem.price=storeItem.item.price*storeItem.qty;
        this.totalQty++;
        this.totalPrice = this.totalPrice + storeItem.item.price;
    }

    this.reduceByOne=function(id){
    
    this.items[id].qty--;
    this.items[id].price -=this.items[id].item.price
       this.totalQty--;
       this.totalPrice -= this.items[id].item.price;

       if(this.items[id].qty <= 0)
       {
        delete this.items[id];
       }
    
      }


      this.reduceByAll=function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];

      }

  this.generateArray=function(){
  var arr=[];
  for(var id in this.items)
  {
      arr.push(this.items[id]);
  }
return arr;
  };

}




