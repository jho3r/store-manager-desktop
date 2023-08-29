'use client'
import { useState, useEffect } from 'react'
import FloatingActionButton from '@/components/common/FloatingActionButton/FloatingActionButton'
import Toast from '@components/common/Toast/Toast'
import styles from './container.module.css'
import SaleModal from '@components/home/SaleModal/SaleModal'
import SalesTable from '@components/home/SalesTable/SalesTable'
import HomeHeader from '@components/home/HomeHeader/HomeHeader'
import HomeFooter from '@components/home/HomeFooter/HomeFooter'
import config from '@config/config'

const HomeContainer = () => {
  const [products, setProducts] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [notification, setNotification] = useState(null)
  const [salesDate, setSalesDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )
  const [sales, setSales] = useState([])
  const [total, setTotal] = useState(0)
  const [owed, setOwed] = useState(0)

  useEffect(() => {
    const getProducts = async () => {
      const { data: storedProducts = [], error } = await window.electronApi?.getProducts()
      if (error) {
        setNotification({
          title: 'Products Load',
          message: `Error cargando productos: ${error}`,
          level: 'error',
          show: true
        })
        return
      }
      const otherProduct = {
        id: 0,
        barcode: '0',
        name: 'Otro',
        price: 0,
        stock: 0
      }
      setProducts([otherProduct, ...storedProducts])
    }

    const handleProductsLoad = (event, data) => {
      if (!data.error) {
        getProducts()
      }

      setNotification({
        title: 'Products Load',
        message: data.error
          ? `Error cargando productos: ${data.error}`
          : 'Los productos se cargaron correctamente',
        level: data.error ? 'error' : 'success',
        show: true
      })
    }

    getProducts()
    window.electronApi?.onProductsLoaded(handleProductsLoad)

    return () => {
      window.electronApi?.removeListener(
        config.productLoadTopic,
        handleProductsLoad
      )
    }
  }, [])

  useEffect(() => {
    const getSales = async () => {
      const { data: storedSales = [], error } = await window.electronApi?.getSales(salesDate)
      console.log('storedSales', storedSales, error)
      if (error) {
        setNotification({
          title: 'Sales Load',
          message: `No se pudieron cargar las ventas del dia: ${error}`,
          level: 'warning',
          show: true
        })
      }
      const total = storedSales.reduce((acc, sale) => {
        const partial = (sale.owed || sale.deleted) ? 0 : sale.total
        return acc + partial
      }, 0)

      const owed = storedSales.reduce((acc, sale) => {
        const partial = (sale.owed && !sale.deleted) ? sale.total : 0
        return acc + partial
      }, 0)

      setSales(storedSales)
      setTotal(total)
      setOwed(owed)
    }

    getSales()
  }, [salesDate])

  const handleFloatingButtonClick = () => {
    setShowSaleModal(true)
  }

  const handleSaleModalClose = () => {
    setShowSaleModal(false)
  }

  /**
   * @param {Object} sale
   * @param {Object} sale.product
   * @param {Number} sale.product.id
   * @param {String} sale.product.barcode
   * @param {String} sale.product.name
   * @param {Number} sale.product.price
   * @param {Number} sale.product.stock
   * @param {Number} sale.quantity
   * @param {String} sale.comment
   * @param {String} sale.hiddenComment
   * @param {Number} sale.price
   * @param {Date} sale.time
   * @param {Boolean} sale.owed
   * @param {String} sale.debtor
   */
  const handleAddSale = async (sale) => {
    const newSaleObj = {
      barcode: sale.product.barcode,
      name: sale.product.name,
      quantity: sale.quantity,
      price: sale.price,
      time: sale.time,
      total: sale.price * sale.quantity,
      owed: sale.owed,
      comment: sale.comment,
      hiddenComment: sale.hiddenComment,
      productID: sale.product.id,
      deleted: false,
      debtor: sale.debtor
    }
    const { data: newSale, error } = await window.electronApi?.addSale(newSaleObj, salesDate)
    if (error) {
      setNotification({
        title: 'Add Sale',
        message: `Error agregando venta: ${error}`,
        level: 'error',
        show: true
      })
      return
    }
    setSales(prevSales => [...prevSales, newSale])
    const newTotal = sale.owed ? total : newSale.total + total
    const newOwed = sale.owed ? owed + newSale.total : owed
    setOwed(newOwed)
    setTotal(newTotal)
  }

  const handleDateChange = (value) => {
    console.log('handleDateChange', value)
    setSalesDate(value)
  }

  return (
    <div className={styles.container}>
      <HomeHeader salesDate={salesDate} onDateChange={handleDateChange}/>
      <SalesTable sales={sales} />
      <HomeFooter total={total} owed={owed} />
      <FloatingActionButton onClick={handleFloatingButtonClick} />
      <SaleModal
        products={products}
        onClose={handleSaleModalClose}
        onSave={handleAddSale}
        show={showSaleModal}
      />
      <Toast
        title={notification?.title}
        message={notification?.message}
        show={notification?.show}
        level={notification?.level}
        onClose={() => setNotification(null)}
      />
    </div>
  )
}

export default HomeContainer
