const PriceDisplay = ({ amount }) => {
  const formattedPrice = amount.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP'
  })

  return (
    <span>{formattedPrice}</span>
  )
}

export default PriceDisplay
