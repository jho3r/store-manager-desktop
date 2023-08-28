import PriceDisplay from '@/components/common/PriceDisplay/PriceDisplay'

import styles from './HomeFooter.module.css'

const HomeFooter = ({ total, owed }) => {
  return (
    <div className={styles.footer}>
      <div className="row">
        <div className="col-3">
          <h2 className={styles.price}>
            Total: <PriceDisplay key="total" amount={total} />
          </h2>
        </div>
        <div className="col-3">
          <h2 className={styles.price}>
            Debe: <PriceDisplay key="owed" amount={owed} />
          </h2>
        </div>
      </div>
    </div>
  )
}

export default HomeFooter
