
import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type Product = {
  id: number
  name: string
  category: string
  price: number
  color: string
  image: string
  secondImage: string
  tag?: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'The Everyday Tote',
    category: 'Bags',
    price: 185,
    color: 'Espresso',
    tag: 'BESTSELLER',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Sculpted Knit',
    category: 'Clothing',
    price: 120,
    color: 'Oat',
    tag: 'NEW ARRIVAL',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Sunday Shoulder Bag',
    category: 'Bags',
    price: 210,
    color: 'Butter',
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'The Form Sandal',
    category: 'Shoes',
    price: 145,
    color: 'Chocolate',
    tag: 'LIMITED EDITION',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Soft Structure Shirt',
    category: 'Clothing',
    price: 98,
    color: 'Ivory',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Mini Weekend Bag',
    category: 'Bags',
    price: 165,
    color: 'Black',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 7,
    name: 'The Essential Sneaker',
    category: 'Shoes',
    price: 130,
    color: 'Cream',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 8,
    name: 'Everyday Sunglasses',
    category: 'Accessories',
    price: 75,
    color: 'Tortoise',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    secondImage:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',
  },
]

type CartItem = {
  product: Product
  quantity: number
}

const categories = ['All', 'Bags', 'Clothing', 'Shoes', 'Accessories']

const money = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

export default function App() {
  const [category, setCategory] = useState('All')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [notice, setNotice] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null,
  )
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category

      const matchesSearch =
        `${product.name} ${product.category} ${product.color}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesWishlist =
        !wishlistOpen || wishlist.includes(product.id)

      return matchesCategory && matchesSearch && matchesWishlist
    })

    if (sort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sort === 'name') {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
    }

    return result
  }, [category, search, sort, wishlist, wishlistOpen])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const addToCart = (product: Product, amount = 1) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id,
      )

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
      }

      return [...current, { product, quantity: amount }]
    })

    showNotice(`${product.name} added to your bag`)
  }

  const updateQuantity = (productId: number, change: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const toggleWishlist = (product: Product) => {
    const saved = wishlist.includes(product.id)

    setWishlist((current) =>
      saved
        ? current.filter((id) => id !== product.id)
        : [...current, product.id],
    )

    showNotice(
      saved ? 'Removed from your saved items' : 'Saved to your wishlist',
    )
  }

  const openProduct = (product: Product) => {
    setSelectedProduct(product)
    setSelectedImage(product.image)
    setQuantity(1)
  }

  const selectCategory = (value: string) => {
    setCategory(value)
    setWishlistOpen(false)
    setMobileOpen(false)
  }

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({
      behavior: 'smooth',
    })
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#24251f]">
      {/* Announcement */}
      <div className="flex min-h-9 items-center justify-center bg-[#272820] px-4 py-2 text-center text-[9px] uppercase tracking-[0.19em] text-white sm:text-[10px]">
        A little something extra — complimentary shipping over $200
        <ArrowUpRight className="ml-2 h-3 w-3" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-[#f8f7f3]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-[88px] lg:px-12">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <nav className="hidden items-center gap-7 lg:flex">
              {['New in', 'Bags', 'Clothing', 'Shoes'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    selectCategory(
                      item === 'New in' ? 'All' : item,
                    )
                    scrollToShop()
                  }}
                  className="text-[10px] uppercase tracking-[0.13em] transition-opacity hover:opacity-50"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => {
              setCategory('All')
              setWishlistOpen(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="absolute left-1/2 -translate-x-1/2 text-center"
            aria-label="MarketMuse home"
          >
            <span className="block text-[26px] font-semibold leading-none tracking-[-0.09em] sm:text-[32px]">
              marketmuse<span className="text-[#8b8b71]">.</span>
            </span>
            <span className="mt-1 hidden text-[7px] uppercase tracking-[0.35em] sm:block">
              Everyday, considered.
            </span>
          </button>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen)
                setWishlistOpen(false)
              }}
              className="transition-opacity hover:opacity-50"
              aria-label="Search products"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => {
                setWishlistOpen(!wishlistOpen)
                setSearchOpen(false)
                setCategory('All')
                setMobileOpen(false)
                document.getElementById('shop')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
              className="relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart
                className="h-[18px] w-[18px]"
                strokeWidth={1.5}
                fill={wishlistOpen ? 'currentColor' : 'none'}
              />
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c8d0b1] px-1 text-[9px]">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2"
              aria-label="Shopping bag"
            >
              <ShoppingBag
                className="h-[19px] w-[19px]"
                strokeWidth={1.5}
              />
              <span className="hidden text-[10px] uppercase tracking-[0.12em] sm:inline">
                Bag ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c8d0b1] px-1 text-[9px] sm:hidden">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-black/[0.06]"
            >
              <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-5">
                <Search className="h-5 w-5 shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setWishlistOpen(false)
                  }}
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#99998e]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    scrollToShop()
                  }}
                  className="text-[10px] uppercase tracking-widest"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-black/[0.07] bg-[#f8f7f3] lg:hidden"
            >
              <div className="flex flex-col px-6 pb-6 pt-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      selectCategory(item)
                      scrollToShop()
                    }}
                    className="flex items-center justify-between border-b border-black/[0.07] py-4 text-left text-sm"
                  >
                    {item === 'All' ? 'Shop everything' : item}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                ))}
                <button
                  onClick={() => {
                    setWishlistOpen(true)
                    setCategory('All')
                    setMobileOpen(false)
                    document.getElementById('shop')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                  className="flex items-center justify-between py-4 text-left text-sm"
                >
                  Saved items ({wishlist.length})
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <main>
        <section className="px-3 pt-3 sm:px-5 sm:pt-5">
          <div className="relative min-h-[560px] overflow-hidden bg-[#dedbd0] sm:min-h-[660px] lg:min-h-[690px]">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=90"
              alt="Contemporary fashion editorial"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-transparent" />

            <div className="relative flex min-h-[560px] flex-col justify-between p-6 text-white sm:min-h-[660px] sm:p-10 lg:min-h-[690px] lg:p-14">
              <div className="flex items-start justify-between">
                <span className="text-[9px] uppercase tracking-[0.22em] sm:text-[10px]">
                  The October Edit / No. 06
                </span>
                <span className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.18em] sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  A study in simplicity
                </span>
              </div>

              <div className="max-w-3xl pb-8 sm:pb-12">
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="mb-5 text-[10px] uppercase tracking-[0.22em] sm:text-xs"
                >
                  Less, but so much more.
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-6xl font-medium leading-[0.91] tracking-[-0.075em] sm:text-8xl lg:text-[118px]"
                >
                  A softer
                  <br />
                  kind of <span className="font-serif italic">style.</span>
                </motion.h1>

                <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-[300px] text-xs leading-6 text-white/85 sm:text-sm">
                    Thoughtful pieces. Beautiful materials. Everyday
                    essentials that make getting dressed feel different.
                  </p>

                  <button
                    onClick={scrollToShop}
                    className="group flex w-fit items-center gap-8 border-b border-white/60 pb-3 text-[10px] uppercase tracking-[0.17em] transition-colors hover:border-white"
                  >
                    Discover the collection
                    <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/30 pt-4 text-[9px] uppercase tracking-[0.17em]">
                <span>Designed for your everyday</span>
                <span>01 — 03</span>
              </div>
            </div>
          </div>
        </section>

        {/* Brand message */}
        <section className="mx-auto grid max-w-[1600px] gap-6 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:items-end lg:px-12 lg:py-28">
          <div>
            <span className="mb-5 block text-[9px] uppercase tracking-[0.2em] text-[#818173]">
              Our point of view
            </span>
            <h2 className="max-w-2xl text-4xl leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Good things.
              <br />
              <span className="font-serif italic">Kept forever.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:items-end">
            <p className="max-w-md text-sm leading-7 text-[#73736a] lg:text-base">
              We believe in buying less and loving more. MarketMuse is a
              considered collection of modern essentials, chosen to live
              with you, not just for a season.
            </p>
            <button
              onClick={scrollToShop}
              className="flex w-fit items-center gap-3 border-b border-[#24251f] pb-2 text-[10px] uppercase tracking-[0.16em]"
            >
              Meet your new favorites
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Category cards */}
        <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#818173]">
                A world of essentials
              </span>
              <h2 className="mt-2 text-3xl tracking-[-0.06em] sm:text-4xl">
                Find your feeling.
              </h2>
            </div>
            <button
              onClick={() => {
                setCategory('All')
                setWishlistOpen(false)
                scrollToShop()
              }}
              className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.13em] sm:flex"
            >
              All collections <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {[
              {
                name: 'Bags',
                count: 'Carry a little joy',
                image:
                  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
              },
              {
                name: 'Clothing',
                count: 'Made to be lived in',
                image:
                  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
              },
              {
                name: 'Shoes',
                count: 'One step at a time',
                image:
                  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
              },
              {
                name: 'Accessories',
                count: 'The finishing touch',
                image:
                  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
              },
            ].map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                onClick={() => {
                  selectCategory(item.name)
                  scrollToShop()
                }}
                className="group text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e4dc]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f7f3] transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-3">
                  <div>
                    <h3 className="text-sm sm:text-base">{item.name}</h3>
                    <p className="mt-1 text-[10px] text-[#89897f]">
                      {item.count}
                    </p>
                  </div>
                  <span className="pt-1 text-[9px] text-[#89897f]">
                    0{index + 1}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="shop" className="scroll-mt-24 bg-[#efeee8] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#818173]">
                  Curated for right now
                </span>
                <h2 className="mt-2 text-4xl tracking-[-0.07em] sm:text-5xl">
                  {wishlistOpen ? 'Your saved pieces.' : 'The good stuff.'}
                </h2>
                <p className="mt-3 text-xs text-[#818173]">
                  {wishlistOpen
                    ? 'A little collection of things you love.'
                    : 'Pieces worth making room for.'}
                </p>
              </div>

              <label className="flex items-center gap-3 border-b border-black/20 pb-2 text-[10px] uppercase tracking-[0.1em]">
                <span className="whitespace-nowrap">Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="max-w-[160px] cursor-pointer bg-transparent pr-2 outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name</option>
                </select>
                <ChevronDown className="h-3 w-3" />
              </label>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => selectCategory(item)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                    category === item && !wishlistOpen
                      ? 'border-[#272820] bg-[#272820] text-white'
                      : 'border-black/15 bg-transparent hover:border-black/50'
                  }`}
                >
                  {item}
                </button>
              ))}
              {wishlistOpen && (
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-[#272820] bg-[#272820] px-5 py-2.5 text-[10px] uppercase tracking-[0.12em] text-white"
                >
                  <Heart className="h-3 w-3" />
                  Saved
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] text-[#818173]">
                {filteredProducts.length} pieces to discover
              </span>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-[10px] underline underline-offset-4"
                >
                  Clear search: {search}
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
                {filteredProducts.map((product, index) => (
                  <motion.article
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.35, delay: index * 0.035 }}
                    className="min-w-0"
                  >
                    <div className="group relative aspect-[4/5] overflow-hidden bg-[#e5e2d9]">
                      <button
                        onClick={() => openProduct(product)}
                        className="absolute inset-0 z-0 h-full w-full"
                        aria-label={`View ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-0"
                        />
                        <img
                          src={product.secondImage}
                          alt={`${product.name}, alternate view`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                        />
                      </button>

                      {product.tag && (
                        <span className="pointer-events-none absolute left-2 top-2 z-10 bg-[#f8f7f3] px-2 py-1.5 text-[8px] tracking-[0.1em] sm:left-3 sm:top-3">
                          {product.tag}
                        </span>
                      )}

                      <button
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          wishlist.includes(product.id)
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                        }
                        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f7f3]/90 backdrop-blur sm:right-3 sm:top-3"
                      >
                        <Heart
                          className="h-4 w-4"
                          strokeWidth={1.5}
                          fill={
                            wishlist.includes(product.id)
                              ? '#24251f'
                              : 'none'
                          }
                        />
                      </button>

                      <button
                        onClick={() => addToCart(product)}
                        className="absolute bottom-0 left-0 right-0 z-10 flex translate-y-full items-center justify-between bg-[#f8f7f3] px-4 py-4 text-[9px] uppercase tracking-[0.13em] transition-transform duration-300 group-hover:translate-y-0 max-sm:hidden"
                      >
                        Quick add
                        <Plus className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => openProduct(product)}
                        className="absolute bottom-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f7f3] sm:hidden"
                        aria-label={`View ${product.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => openProduct(product)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-2 pt-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-xs sm:text-sm">
                            {product.name}
                          </h3>
                          <p className="mt-1.5 text-[10px] text-[#85857b]">
                            {product.color} / {product.category}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs">
                          {money(product.price)}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className="mt-3 w-full border border-black/15 py-2.5 text-[9px] uppercase tracking-[0.14em] transition-colors hover:bg-[#272820] hover:text-white sm:hidden"
                    >
                      Add to bag
                    </button>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <Search className="mb-4 h-7 w-7 text-[#9b9b90]" />
                <h3 className="text-xl tracking-tight">
                  Nothing here just yet.
                </h3>
                <p className="mt-2 text-sm text-[#85857b]">
                  Try another search or explore a different collection.
                </p>
                <button
                  onClick={() => {
                    setSearch('')
                    setCategory('All')
                    setWishlistOpen(false)
                  }}
                  className="mt-5 border-b border-black pb-1 text-[10px] uppercase tracking-widest"
                >
                  See all pieces
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Campaign section */}
        <section className="grid lg:grid-cols-2">
          <div className="relative min-h-[440px] overflow-hidden bg-[#d7d4c9] sm:min-h-[580px]">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85"
              alt="Modern autumn fashion"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <span className="absolute left-6 top-6 text-[9px] uppercase tracking-[0.2em] text-white sm:left-10 sm:top-10">
              In good company
            </span>
          </div>

          <div className="flex flex-col justify-center bg-[#d9ddcd] px-7 py-14 sm:px-14 sm:py-20 lg:px-20">
            <Sparkles className="mb-7 h-5 w-5" strokeWidth={1.3} />
            <span className="text-[9px] uppercase tracking-[0.2em]">
              A little more intentional
            </span>
            <h2 className="mt-5 text-5xl leading-[0.98] tracking-[-0.075em] sm:text-7xl">
              Wear what
              <br />
              <span className="font-serif italic">feels like you.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#64685a]">
              No passing trends. No complicated rules. Just considered
              pieces, chosen with care, that make your own style feel
              effortless.
            </p>
            <button
              onClick={scrollToShop}
              className="group mt-8 flex w-fit items-center gap-8 border-b border-[#272820] pb-3 text-[10px] uppercase tracking-[0.15em]"
            >
              Explore the edit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Newsletter */}
        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#818173]">
              A note from us to you
            </span>
            <h2 className="mt-5 text-4xl leading-tight tracking-[-0.065em] sm:text-6xl">
              Good things,
              <br />
              <span className="font-serif italic">occasionally.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-[#818173]">
              New collections, thoughtful stories, and the occasional
              little surprise. Only the good stuff.
            </p>

            {subscribed ? (
              <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 bg-[#e5e7db] px-5 py-4 text-sm">
                <Check className="h-4 w-4" />
                You're on the list. Talk soon!
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  if (email.trim()) {
                    setSubscribed(true)
                  }
                }}
                className="mx-auto mt-8 flex max-w-md border-b border-[#24251f] pb-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#99998e]"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em]"
                >
                  Sign me up
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
            <p className="mt-4 text-[9px] text-[#99998e]">
              By subscribing, you agree to receive our occasional updates.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#272820] px-5 pb-7 pt-12 text-[#f8f7f3] sm:px-8 sm:pt-16 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-4xl font-semibold tracking-[-0.09em]"
              >
                marketmuse<span className="text-[#c8d0b1]">.</span>
              </button>
              <p className="mt-4 max-w-xs text-xs leading-6 text-white/55">
                Everyday essentials, thoughtfully chosen. A little less
                noise, a little more you.
              </p>
            </div>

            {[
              {
                title: 'Explore',
                links: ['All products', 'Bags', 'Clothing', 'Shoes'],
              },
              {
                title: 'Here to help',
                links: ['Contact us', 'Shipping & returns', 'FAQs'],
              },
              {
                title: 'The details',
                links: ['Our story', 'Privacy policy', 'Terms'],
              },
            ].map((column) => (
              <div key={column.title}>
                <h3 className="mb-5 text-[9px] uppercase tracking-[0.2em] text-white/50">
                  {column.title}
                </h3>
                <div className="flex flex-col items-start gap-4">
                  {column.links.map((link) => (
                    <button
                      key={link}
                      onClick={() => {
                        if (
                          ['All products', 'Bags', 'Clothing', 'Shoes'].includes(
                            link,
                          )
                        ) {
                          selectCategory(
                            link === 'All products' ? 'All' : link,
                          )
                          scrollToShop()
                        } else {
                          showNotice(`${link} — coming soon`)
                        }
                      }}
                      className="text-left text-xs text-white/75 transition-colors hover:text-white"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 text-[9px] uppercase tracking-[0.12em] text-white/45 sm:flex-row sm:items-center">
            <span>© 2026 MarketMuse Studio</span>
            <span>Made for the everyday, and everything in between.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 self-start sm:self-auto"
            >
              Back to top <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* Product detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedProduct(null)
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-[#f8f7f3] sm:grid-cols-2"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f7f3]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative min-h-[320px] bg-[#e5e2d9] sm:min-h-[530px]">
                <img
                  src={selectedImage}
                  alt={selectedProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {[selectedProduct.image, selectedProduct.secondImage].map(
                    (image, index) => (
                      <button
                        key={image}
                        onClick={() => setSelectedImage(image)}
                        className={`h-14 w-12 overflow-hidden border-2 ${
                          selectedImage === image
                            ? 'border-[#272820]'
                            : 'border-transparent'
                        }`}
                        aria-label={`View product image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#818173]">
                  {selectedProduct.category} / MarketMuse essentials
                </span>
                <h2 className="mt-4 text-3xl leading-tight tracking-[-0.06em] sm:text-4xl">
                  {selectedProduct.name}
                </h2>
                <p className="mt-3 text-lg">
                  {money(selectedProduct.price)}
                </p>
                <p className="mt-6 text-sm leading-7 text-[#77776d]">
                  Meet your new everyday favorite. Thoughtfully selected
                  for its timeless look, versatile character, and effortless
                  place in your wardrobe.
                </p>

                <div className="mt-7 border-t border-black/10 pt-5">
                  <span className="text-[9px] uppercase tracking-[0.17em] text-[#818173]">
                    Color
                  </span>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <span className="h-4 w-4 rounded-full border border-black/10 bg-[#b5a18a]" />
                    {selectedProduct.color}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.17em]">
                    Quantity
                  </span>
                  <div className="flex items-center border border-black/15">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-8 text-center text-xs">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-3"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct, quantity)
                    setSelectedProduct(null)
                  }}
                  className="mt-7 flex w-full items-center justify-between bg-[#272820] px-5 py-4 text-[10px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#44453a]"
                >
                  Add to bag — {money(selectedProduct.price * quantity)}
                  <ShoppingBag className="h-4 w-4" />
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="mt-4 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-[0.12em]"
                >
                  <Heart
                    className="h-4 w-4"
                    fill={
                      wishlist.includes(selectedProduct.id)
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                  {wishlist.includes(selectedProduct.id)
                    ? 'Saved to wishlist'
                    : 'Save for later'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.button
              aria-label="Close shopping bag"
              className="fixed inset-0 z-[70] cursor-default bg-black/35 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-md flex-col bg-[#f8f7f3] shadow-2xl"
              aria-label="Shopping bag"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-6">
                <div>
                  <h2 className="text-xl tracking-[-0.05em]">
                    Your bag <span className="text-[#85857b]">({cartCount})</span>
                  </h2>
                  <p className="mt-1 text-[10px] text-[#85857b]">
                    Good choices, so far.
                  </p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <ShoppingBag className="h-8 w-8 text-[#85857b]" strokeWidth={1} />
                  <h3 className="mt-5 text-2xl tracking-[-0.05em]">
                    Room for something good.
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-[#85857b]">
                    Your bag is waiting for something you love.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false)
                      scrollToShop()
                    }}
                    className="mt-7 flex items-center gap-3 bg-[#272820] px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-white"
                  >
                    Explore the collection
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-black/10 px-6 py-4">
                    <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.1em]">
                      <span>Shipping progress</span>
                      <span>{subtotal >= 200 ? 'Unlocked!' : `${money(200 - subtotal)} to go`}</span>
                    </div>
                    <div className="h-1 overflow-hidden bg-[#e5e3db]">
                      <div
                        className="h-full bg-[#8e9679] transition-all"
                        style={{
                          width: `${Math.min(100, (subtotal / 200) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-[10px] text-[#85857b]">
                      {subtotal >= 200
                        ? 'Your order qualifies for complimentary shipping.'
                        : 'Complimentary shipping on orders over $200.'}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 border-b border-black/10 py-5"
                      >
                        <button
                          onClick={() => {
                            setCartOpen(false)
                            openProduct(item.product)
                          }}
                          className="h-32 w-24 shrink-0 bg-[#e5e2d9]"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </button>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm">{item.product.name}</h3>
                              <p className="mt-1 text-[10px] text-[#85857b]">
                                {item.product.color}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm">
                              {money(item.product.price * item.quantity)}
                            </span>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-4">
                            <div className="flex items-center border border-black/15">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, -1)
                                }
                                className="p-2"
                                aria-label="Decrease item quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-6 text-center text-xs">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, 1)
                                }
                                className="p-2"
                                aria-label="Increase item quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setCart((current) =>
                                  current.filter(
                                    (entry) =>
                                      entry.product.id !== item.product.id,
                                  ),
                                )
                              }}
                              className="text-[9px] uppercase tracking-[0.1em] text-[#85857b] underline underline-offset-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-black/10 px-6 pb-6 pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{money(subtotal)}</span>
                    </div>
                    <p className="mt-2 text-[10px] leading-5 text-[#85857b]">
                      Shipping and any applicable taxes are calculated at
                      checkout.
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false)
                        showNotice('Demo checkout — payment is not connected yet')
                      }}
                      className="mt-5 flex w-full items-center justify-between bg-[#272820] px-5 py-4 text-[10px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#44453a]"
                    >
                      Continue to checkout
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-4 flex w-full items-center justify-center gap-2 text-[10px] uppercase tracking-[0.1em]"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Continue shopping
                    </button>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 left-1/2 z-[100] flex w-max max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 bg-[#272820] px-5 py-4 text-xs text-white shadow-xl"
          >
            <Check className="h-4 w-4 text-[#c8d0b1]" />
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
