import styles from './HomeHeader.module.css'

const HomeHeader = ({ salesDate, onDateChange, total, owed }) => {
  const handleDateChange = (event) => {
    if (onDateChange) {
      onDateChange(event.target.value)
    }
  }

  return (
    <div className={styles.header}>
      <div className="row">
        <div className="col-8">
          <h1 className={styles.title}>Ventas Minimercado Luna</h1>
        </div>
        <div className="col-4 text-end">
          <input
            type="date"
            className="form-control"
            id="salesDate"
            value={salesDate}
            onChange={handleDateChange}
            min="2023-06-07"
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <div className="col-12">
          <hr />
        </div>
      </div>
    </div>
  )
}

export default HomeHeader
