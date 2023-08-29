import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

const Toast = ({ title, message, show, level, onClose }) => {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (show) {
      if (timer) {
        clearTimeout(timer)
      }
      setTimer(
        setTimeout(() => {
          if (!isMouseOver) {
            handleClose()
          }
        }, 5000)
      )
    }
  }, [show, isMouseOver])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleMouseEnter = () => {
    setIsMouseOver(true)
  }

  const handleMouseLeave = () => {
    setIsMouseOver(false)
  }

  return (
    <div className="toast-container position-fixed bottom-0 start-0 p-3">
      <div
        id="liveToast"
        className={`toast ${show ? styles.show : styles.hide}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
