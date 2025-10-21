import { useState, useEffect } from "react"
import { db } from '../data/db.js'

export const useCart = () => {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const max_items = 5
  const min_items = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {

    const itemExist = cart.findIndex(guitar => guitar.id === item.id)

    if(itemExist >= 0) {

      if(cart[itemExist].quantity >= max_items) return

      let updatedCart = [...cart]
      updatedCart[itemExist].quantity++
      setCart(updatedCart)
    } else {
      item.quantity = 1
      setCart([...cart, item])
    }

  }

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map( item => {
      if (item.id === id && item.quantity < max_items) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })

    setCart(updatedCart)
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > min_items) {
        return {
          ...item,
          quantity: item.quantity -1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

    // State Derivado
  const isEmpty = () => cart.length === 0
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0)

  return {
    data, 
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    setCart,
    isEmpty,
    cartTotal
  }
}