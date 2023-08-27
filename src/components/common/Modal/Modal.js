import styles from './Modal.module.css'

const Modal = ({
  children,
  show,
  title,
  allowSave = false,
  onClose,
  onAction
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleAction = () => {
    if (onAction) {
      onAction()
    }
  }
  return (
    <div className={`modal ${show ? styles.show : styles.hide} ${styles.modal}`}>
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fs-5">{title}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAction} disabled={!allowSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
