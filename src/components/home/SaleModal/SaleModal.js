import { useEffect, useState } from 'react'
import Modal from '@components/common/Modal/Modal'
import styles from './SaleModal.module.css'

const SaleModal = ({ products, show, onClose, onSave, sale = null }) => {
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filterString, setFilterString] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [comment, setComment] = useState('')
  const [price, setPrice] = useState(0)
  const [hiddenComment, setHiddenComment] = useState({})
  const [allowSave, setAllowSave] = useState(false)
  const [blockEntries, setBlockEntries] = useState(true)
  const [owed, setOwed] = useState(false)
  const [commentNeeded, setCommentNeeded] = useState(false)
  const [debtor, setDebtor] = useState('')

  useEffect(() => {
    if (show) {
      setFilteredProducts([])
      setSelectedProduct(null)
      setFilterString('')
      setShowDropdown(false)
      setQuantity(1)
      setComment('')
      setPrice(0)
      setHiddenComment({})
      setAllowSave(false)
      setOwed(false)
      setBlockEntries(true)
      setCommentNeeded(false)
      setDebtor('')
    }

    if (sale) {
      const product = products.find((product) => product.id === sale.productId)
      setSelectedProduct(product)
      setQuantity(sale.quantity)
      setComment(sale.comment)
      setPrice(sale.price)
      setAllowSave(true)
      setOwed(sale.owed)
      setDebtor(sale.debtor)
      setBlockEntries(false)
    }
  }, [show, sale, products])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSave = () => {
    let saleToSave = {}

    if (sale) {
      saleToSave = {
        ...sale,
        quantity: Number(quantity),
        comment,
        hiddenComment,
        price: Number(price),
        owed,
        debtor,
        updatedAt: new Date(),
        total: Number(price) * Number(quantity)
      }
    } else {
      saleToSave = {
        product: selectedProduct,
        quantity: Number(quantity),
        comment,
        hiddenComment,
        price: Number(price),
        createdAt: new Date(),
        updatedAt: new Date(),
        owed,
        debtor
      }
    }
    if (quantity < 1 || price < 1) {
      return
    }

    if (owed && !debtor) {
      return
    }

    if (Number(price) !== Number(selectedProduct.price) && !comment) {
      setCommentNeeded(true)
      return
    }

    if (onSave) {
      onSave(saleToSave)
    }
    handleClose()
  }

  const handleFilterChange = (event) => {
    const value = event.target.value
    setFilterString(value)
    if (value) {
      // either filter by name or barcode
      setFilteredProducts(
        products.filter((product) => {
          return (
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.barcode.includes(value)
          )
        })
      )
      if (!showDropdown) {
        setShowDropdown(true)
      }
    } else {
      setFilteredProducts([])
      if (showDropdown) {
        setShowDropdown(false)
      }
    }
  }

  const handleSelectProduct = (event) => {
    const value = event.target.value

    const product = products.find((product) => product.id === Number(value))

    setSelectedProduct(product)
    setShowDropdown(false)
    setFilterString('')
    setFilteredProducts([])
    setPrice(product.price)
    setAllowSave(true)
    setBlockEntries(false)
  }

  const handleCommentChange = (event) => {
    const value = event.target.value
    setComment(value)
  }

  const handleDebtorChange = (event) => {
    const value = event.target.value
    setDebtor(value)
  }

  const handleHiddenCommentChange = (type, value) => {
    const commentObj = {}
    switch (type) {
      case 'price':
        if (Number(value) !== Number(selectedProduct.price)) {
          commentObj.price = `Precio original: $${selectedProduct.price}`
        } else {
          commentObj.price = ''
        }
        break
      default:
        break
    }
    setHiddenComment((prev) => ({ ...prev, ...commentObj }))
  }

  const handlePriceChange = (event) => {
    const value = event.target.value
    handleHiddenCommentChange('price', value)
    setPrice(value)
  }

  const handleQuantityChange = (event) => {
    const value = event.target.value
    setQuantity(value)
  }

  const handleOwedChange = (event) => {
    const value = event.target.checked
    setOwed(value)
  }

  return (
    <Modal
      onAction={handleSave}
      onClose={handleClose}
      show={show}
      title="Nueva venta"
      allowSave={allowSave}
    >
      <form className={styles.container}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="filterInput"
            placeholder="Buscar producto"
            value={filterString}
            onChange={handleFilterChange}
            disabled={!!sale}
          />
          <label htmlFor="filterInput">Buscar producto</label>
        </div>
        <select
          size="4"
          className={`form-select ${showDropdown ? styles.show : styles.hide}`}
          aria-label="Select product"
          onChange={handleSelectProduct}
        >
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name.substr(0, 25)}... - {product.barcode} - $
              {product.price}
            </option>
          ))}
        </select>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="nameInput"
            placeholder="Nombre del producto"
            value={selectedProduct?.name || ''}
            readOnly
          />
          <label htmlFor="nameInput">Nombre</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="BarcodeInput"
            placeholder="Código de barras"
            value={selectedProduct?.barcode || ''}
            readOnly
          />
          <label htmlFor="BarcodeInput">Código de barras</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="number"
            className={`form-control ${price < 1 ? 'is-invalid' : ''}`}
            id="priceInput"
            placeholder="Precio"
            value={price}
            onChange={handlePriceChange}
            disabled={blockEntries}
            aria-describedby="priceInputFeedback"
          />
          <label htmlFor="priceInput">Precio</label>
          <div id="priceInputFeedback" className="invalid-feedback">
            Precio mayor a 0
          </div>
        </div>
        <div className="form-floating mb-3">
          <input
            type="number"
            className={`form-control ${quantity < 1 ? 'is-invalid' : ''}`}
            id="quantityInput"
            placeholder="Cantidad"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={blockEntries}
            aria-describedby="quantityInputFeedback"
          />
          <label htmlFor="quantityInput">Cantidad</label>
          <div id="quantityInputFeedback" className="invalid-feedback">
            Cantidad mayor a 0
          </div>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="totalInput"
            placeholder="Total"
            value={price * quantity}
            readOnly
          />
          <label htmlFor="totalInput">Total</label>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="owedInput"
            placeholder="Comentario"
            checked={owed}
            onChange={handleOwedChange}
            disabled={blockEntries}
          />
          <label htmlFor="owedInput" className="form-check-label">
            Debe
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${owed && !debtor ? 'is-invalid' : ''}`}
            id="debtorInput"
            placeholder="Deudor"
            value={debtor}
            onChange={handleDebtorChange}
            disabled={!owed || blockEntries}
            aria-describedby="debtorInputFeedback"
          />
          <label htmlFor="debtorInput">Deudor</label>
          <div id="debtorInputFeedback" className="invalid-feedback">
            Quien debe ?
          </div>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${
              commentNeeded && !comment ? 'is-invalid' : 'is-valid'
            }`}
            id="commentInput"
            placeholder="Comentario"
            value={comment}
            onChange={handleCommentChange}
            disabled={blockEntries}
            aria-describedby="commentInputFeedback"
          />
          <label htmlFor="commentInput">Comentario</label>
          <div id="commentInputFeedback" className="invalid-feedback">
            Por que se cambio el precio ?
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SaleModal
