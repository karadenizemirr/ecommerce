$(document).ready(function(){

  let card = []
  let total_price = 0

  $(function(){
    if (localStorage.card){
      card = JSON.parse(localStorage.card)
      renderCard()
      renderCardWithCheckout()
    }
  })

  function addToCard(){
    var price = $('#product_price').text()
    var name = $('#product_name').text()
    var img = $('#product_image').attr('src')
    var quantity = $('#quantity').text() || 1

    var product_data = {
      name: name,
      price: price,
      img: img,
      quantity: quantity
    }

    var existingProduct = card.find(function(item){
      return item.name === name
    })

    if (existingProduct){
      existingProduct.quantity += 1
      return
    }else{
      card.push(product_data)
    }
  }

  function saveCard(){
    if (window.localStorage){
      localStorage.setItem('card', JSON.stringify(card))
    }
  }

  function deleteCard(index){
    card.splice(index, 1)
    saveCard()
  }

  function renderCard(){
    var _card = $('#card-list')

    if (card.length <= 0){
      $('#card-list').html('<li><a href="#">Sepetinizde ürün bulunmamaktadır.</a></li>')
      $('#total_price span').text('0TL')
      $('#item_size').text(card.length)
    }

    for (var i in card){
      var item = card[i]
      total_price += parseInt(item.price)
      var _html = `
                          <li>
                        <a href="${item.name}">
                          <figure><img src="${item.img}" data-src="${item.img}" alt="" width="50" height="50" class="lazy"></figure>
                          <strong><span>${item.quantity} ${item.name}</span>${item.price}</strong>
                        </a>
                        <a class="action"  id="delete_card_item" ><i class="ti-trash"></i></a>
                      </li>
    `
      _card.append(_html)
      $('#total_price span').text(total_price + 'TL')

      $('#delete_card_item').on('click', function(){
        deleteCard(i)
        renderCard()
      })
    }
  }

  function renderCardWithCheckout(){
    var _card = $('#checkout_card')
    var _checkout_product = $('#checkout_product')

    for (var i in card){
      var item = card[i]
      total_price += parseInt(item.price)
      var _html = `
            <li class="clearfix"><em>${item.quantity} ${item.name}</em>  <span>${item.price}</span></li>
    `
      _checkout_product.append(_html)
      $('#checkout_total_price span').text(total_price + 'TL')
    }
  }

  $('#add_card').on('click', function(){
    addToCard()
    saveCard()
    renderCard()
  })
})