import styles from './Toast.module.css'

const Toast = ({ title, message, show, level, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="toast-container position-fixed bottom-0 start-0 p-3">
      <div
        id="liveToast"
        className={`toast ${show ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <svg
            className="bd-placeholder-img rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <rect className={styles[level]} width="100%" height="100%"></rect>
          </svg>
          <strong className="me-auto">{title}</strong>
          <small>1 min ago</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  )
}

export default Toast
