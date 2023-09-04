import styles from './FloatingActionButton.module.css'

const FloatingActionButton = ({ onClick, show = true }) => {
  const handleButtonClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return (
        <button className={`btn btn-primary btn-lg ${styles.fab}`} onClick={handleButtonClick} hidden={!show}>
            <i className="bi-plus-lg"></i>
        </button>
  )
}

export default FloatingActionButton
