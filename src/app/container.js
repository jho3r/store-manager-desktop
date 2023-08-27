'use client'
import { useState, useEffect } from 'react'
import FloatingActionButton from '@/components/common/FloatingActionButton/FloatingActionButton'
import Toast from '@components/common/Toast/Toast'
import styles from './container.module.css'
import SaleModal from '@components/home/SaleModal/SaleModal'
import SalesTable from '@components/home/SalesTable/SalesTable'
import HomeHeader from '@components/home/HomeHeader/HomeHeader'
import config from '@config/config'

const HomeContainer = () => {
  const [products, setProducts] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [notification, setNotification] = useState(null)
  const [salesDate, setSalesDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [sales, setSales] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const getProducts = async () => {
      const storedProducts = await window.electronApi?.getProducts()
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
      setTimeout(() => {
        setNotification(null)
      }, 5000)
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

  const handleFloatingButtonClick = () => {
    setShowSaleModal(true)
  }

  const handleSaleModalClose = () => {
    setShowSaleModal(false)
  }

  const handleAddSale = () => {
    console.log('Sale added')
  }

  const handleDateChange = (value) => {
    setSalesDate(value)
  }

  return (
    <div className={styles.container}>
      <HomeHeader salesDate={salesDate} onDateChange={handleDateChange} total={total} />
      <SalesTable sales={sales} />
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
      />
    </div>
  )
}

export default HomeContainer
