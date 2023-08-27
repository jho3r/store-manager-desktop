import styles from './FloatingActionButton.module.css'

const FloatingActionButton = ({ onClick }) => {
  const handleButtonClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return (
        <button className={`btn btn-primary btn-lg ${styles.fab}`} onClick={handleButtonClick}>
            <i className="bi-plus-lg"></i>
        </button>
  )
}

export default FloatingActionButton
