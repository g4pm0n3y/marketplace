const deleteProduct = (btn) => {
  let productID = btn.parentNode.querySelector('[name=productID]').value;
  let csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  let productElement = btn.closest('div[id=productContainer]')
  console.log(productElement)

  fetch('/admin/product/' + productID, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
  .then(result => {
    return result.json()
  })
  .then(data => {
    console.log(data)
    productElement.parentNode.removeChild(productElement)
  })
  .catch(err => {
    console.log(err)
  })
} 