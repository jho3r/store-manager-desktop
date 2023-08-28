import styles from './SalesTable.module.css'

const SalesTable = ({ sales, onSaleDelete, onSaleEdit }) => {
  const handleSaleDelete = (sale) => {
    if (onSaleDelete) {
      onSaleDelete(sale)
    }
  }

  const handleSaleEdit = (sale) => {
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
                    <td>{sale.name}</td>
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
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleSaleDelete(sale)}
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
    </div>
  )
}

export default SalesTable
