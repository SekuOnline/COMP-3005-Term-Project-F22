// const { order } = require("../../routes");

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add_to_cart').addEventListener('click', addToCart);
    document.getElementById('place_order').addEventListener('click', placeOrder)
})

function addToCart(){
    let ISBN = document.getElementById('cart_ISBN_text').value.trim()
    let quantity = document.getElementById('cart_quantity_text').value.trim()
    
   
    if(ISBN === '') {
        return alert('Please enter an ISBN')
    }
    if(quantity === '') {
        return alert('Please enter a Quantity')
    }

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText) 
            let bookObj = JSON.parse(response);
            console.log(bookObj)   
            
            let cart = document.getElementById("cartBody");
            let length = cart.rows.length;
            cart.innerHTML+="<tr title='"+length+"'> " + "<td>"+ISBN+"</td><td>"+quantity+'</td><td>'+bookObj.Price+'</td><td><button id="deleteBtn'+length+'" value="Remove"></button></tr>'
            

      }
    }
    xhr.open('GET', `/getBook?ISBN=${ISBN}`, true)
    xhr.send()
  }

function placeOrder(){
    let orderTable = document.getElementById("cartBody");
    let orderObj = {}
    let ISBN;
    let quantity;
    if(orderTable.rows.length > 0){
        let xhr = new XMLHttpRequest()
        for(let i = 1; i < orderTable.rows.length; i++){
            if(orderTable.rows[i].innerHTML != ''){
                ISBN = Number(orderTable.rows[i].cells[0].innerHTML);
                if (orderObj[ISBN]){
                    
                    orderObj[ISBN].quantity = Number(orderObj[ISBN].quantity) + Number(orderTable.rows[i].cells[1].innerHTML)
                    orderObj[ISBN].price = Number(orderObj[ISBN].price) + Number(orderTable.rows[i].cells[2].innerHTML)
                }
                else{
                    
                    orderObj[ISBN] =  {quantity: orderTable.rows[i].cells[1].innerHTML}
                   orderObj[ISBN].price = Number(orderTable.rows[i].cells[2].innerHTML) *  orderObj[ISBN].quantity
                }
                }
        }
        console.log(JSON.stringify(orderObj));
    xhr.open('POST', `/sendOrder`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(orderObj))
    }
    else{
        alert("Problem with order")
    }
    
}

document.body.addEventListener( 'click', function ( event ) {
    if(event.target.id.startsWith('deleteBtn')) {
      let cart = document.getElementById("cartBody");
      let number = event.target.id.replace('deleteBtn', '')

      cart.rows[number].innerHTML = ''
    };
  });
