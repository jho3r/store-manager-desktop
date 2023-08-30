import { useState } from 'react'
import Modal from '@/components/common/Modal/Modal'
import SaleModal from '@/components/home/SaleModal/SaleModal'
import styles from './SalesTable.module.css'

const SalesTable = ({
  sales,
  onSaleDelete,
  onSaleEdit,
  showActions = true,
  products
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saleDeleteCallback, setSaleDeleteCallback] = useState(null)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [saleToEdit, setSaleToEdit] = useState(null)

  const handleSaleDelete = (sale) => {
    const handleSaleDelete = (saleId) => {
      if (onSaleDelete) {
        setShowDeleteModal(false)
        onSaleDelete(saleId)
      }
    }
    setShowDeleteModal(true)
    setSaleDeleteCallback(() => () => handleSaleDelete(sale.id))
  }

  const handleSaleEdit = (sale) => {
    setSaleToEdit(sale)
    setShowSaleModal(true)
  }

  const handleSaleModalClose = () => {
    setShowSaleModal(false)
    setSaleToEdit(null)
  }

  const handleSaveSale = (sale) => {
    if (onSaleEdit) {
      onSaleEdit(sale)
    }
  }

  return (
    <div className={styles.table}>
      <div className="row m-1">
        <div className="col-12">
          <table className="table table-hover">
            <thead className="sticky-top">
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Precio unitario</th>
                <th scope="col">Precio total</th>
                <th scope="col">Deuda</th>
                <th scope="col">Comentario</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) =>
                sale.deleted
                  ? null
                  : (
                  <tr key={sale.id}>
                    <th scope="row">{sale.barcode}</th>
                    <td>{sale.name.substr(0, 18)}...</td>
                    <td>{sale.quantity}</td>
                    <td>${sale.price}</td>
                    <td>${sale.total}</td>
                    <td>{sale.owed ? 'Si' : 'No'}</td>
                    <td>{sale.comment}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => handleSaleEdit(sale)}
                        disabled={!showActions}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleSaleDelete(sale)}
                        disabled={!showActions}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                    )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        title="Eliminar venta"
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onAction={saleDeleteCallback}
        actionText="Eliminar"
        allowSave={true}
      >
        <p>¿Está seguro que desea eliminar esta venta?</p>
      </Modal>
      <SaleModal
        products={products}
        onClose={handleSaleModalClose}
        onSave={handleSaveSale}
        show={showSaleModal}
        sale={saleToEdit}
      />
    </div>
  )
}

export default SalesTable
