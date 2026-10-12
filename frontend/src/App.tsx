import { useMemo, useState } from 'react'

type Product = {
  id: number
  name: string
  category: string
  price: number
  oldPrice: number
  unit: string
  image: string
  badge?: string
  description: string
}

type CartItem = {
  product: Product
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Premium Wheat Seeds',
    category: 'Seeds',
    price: 850,
    oldPrice: 999,
    unit: '5 kg pack',
    image:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80',
    badge: 'Bestseller',
    description: 'Quality wheat seeds for your next farming season.',
  },
  {
    id: 2,
    name: 'Paddy Rice Seeds',
    category: 'Seeds',
    price: 650,
    oldPrice: 750,
    unit: '5 kg pack',
    image:
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    description: 'Rice seeds selected for reliable crop establishment.',
  },
  {
    id: 3,
    name: 'Organic Fertilizer',
    category: 'Fertilizers',
    price: 450,
    oldPrice: 520,
    unit: '10 kg bag',
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80',
    description: 'Organic soil nutrition for responsible farming.',
  },
  {
    id: 4,
    name: 'Crop Protection Spray',
    category: 'Pesticides',
    price: 380,
    oldPrice: 420,
    unit: '500 ml',
    image:
      'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    description: 'Choose crop protection products according to the crop and pest.',
  },
  {
    id: 5,
    name: 'Garden Water Sprayer',
    category: 'Tools',
    price: 599,
    oldPrice: 699,
    unit: '1 piece',
    image:
      'https://images.unsplash.com/photo-1599685315640-1ec6b2b4e3c2?auto=format&fit=crop&w=700&q=80',
    description: 'A practical spraying tool for agricultural applications.',
  },
  {
    id: 6,
    name: 'Soil Care Nutrients',
    category: 'Fertilizers',
    price: 320,
    oldPrice: 380,
    unit: '5 kg bag',
    image:
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80',
    description: 'Nutrients for soil management and plant growth.',
  },
  {
    id: 7,
    name: 'Farm Irrigation Pipe',
    category: 'Tools',
    price: 720,
    oldPrice: 850,
    unit: '10 metres',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
    description: 'Irrigation equipment for everyday farm use.',
  },
  {
    id: 8,
    name: 'Mustard Seeds',
    category: 'Seeds',
    price: 540,
    oldPrice: 620,
    unit: '5 kg pack',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
    description: 'Mustard seeds for seasonal agricultural needs.',
  },
]

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#edf5e9"/><path d="M0 470 Q180 390 350 470 T800 450 V600 H0Z" fill="#b9d7a9"/><path d="M0 520 Q200 440 400 520 T800 500 V600 H0Z" fill="#7eaf70"/><g fill="#477c42"><path d="M400 420 C330 330 340 250 400 180 C460 250 470 330 400 420Z"/><path d="M395 380 C300 360 260 300 250 240 C330 250 390 300 395 380Z"/><path d="M405 350 C500 330 540 270 550 210 C470 220 410 270 405 350Z"/></g><text x="400" y="555" font-family="Arial,sans-serif" font-size="28" text-anchor="middle" fill="#315b2c">KrishiMartPro</text></svg>',
  )

const categories = [
  { name: 'All Products', icon: '🛍️', color: 'mint' },
  { name: 'Seeds', icon: '🌱', color: 'green' },
  { name: 'Fertilizers', icon: '🌿', color: 'yellow' },
  { name: 'Pesticides', icon: '🛡️', color: 'pink' },
  { name: 'Tools', icon: '🚜', color: 'blue' },
]

const money = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Products')
  const [cart, setCart] = useState<CartItem[]>([])
  const [page, setPage] = useState('Home')
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [notice, setNotice] = useState('')

  // Search across all useful product fields. While a search term exists,
  // do not let a previously selected category hide matching products.
 const filteredProducts = useMemo(() => {
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('en-IN')
      .trim()

  const term = normalize(search)

  return products.filter((product) => {
    // Search hone par purani category ko ignore karein
    const matchesCategory =
      term !== '' ||
      category === 'All Products' ||
      product.category === category

    // Product ki saari useful information mein search karein
    const searchableText = normalize(
      [
        product.name,
        product.category,
        product.description,
        product.unit,
        product.badge ?? '',
        String(product.price),
        String(product.oldPrice),
      ].join(' '),
    )

    const matchesSearch =
      term === '' || searchableText.includes(term)

    return matchesCategory && matchesSearch
  })
}, [search, category])
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id,
      )

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { product, quantity: 1 }]
    })

    setNotice(`${product.name} added to cart`)
    window.setTimeout(() => setNotice(''), 2500)
  }

  function changeQuantity(productId: number, change: number) {
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

  function selectCategory(name: string) {
    setCategory(name)
    setSearch('')
    setPage('Home')
    setMobileMenu(false)
    window.setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
  }

  function navigate(name: string) {
    setPage(name)
    setMobileMenu(false)
    setCartOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('Demo UI only: login backend is not connected yet.')
    setLoginOpen(false)
    window.setTimeout(() => setNotice(''), 3500)
  }

  const pageTitle: Record<string, string> = {
    Orders: 'My Orders',
    Farmer: 'Farmer Dashboard',
    Retailer: 'Retailer Dashboard',
    Admin: 'Admin Dashboard',
    Profile: 'My Profile',
  }

  return (
    <div className="app-shell">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>🌾 किसान की तरक्की, हमारी प्राथमिकता</span>
          <span>Serving farmers across Satna, Madhya Pradesh</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <button
            className="brand"
            onClick={() => navigate('Home')}
            aria-label="KrishiMartPro home"
          >
            <span className="brand-mark">🌾</span>
            <span className="brand-text">
              <strong>KrishiMart<span>Pro</span></strong>
              <small>Kisan ka digital bazaar</small>
            </span>
          </button>

          <label className="search-box">
            <span>⌕</span>
            <input
              aria-label="Search products"
              placeholder="Search seeds, fertilizers, tools..."
              value={search}
              onChange={(event) => {
                const value = event.target.value
                setSearch(value)
                if (value.trim()) setCategory('All Products')
                setPage('Home')
              }}
              onFocus={() => setPage('Home')}
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => { setSearch(''); setCategory('All Products') }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <div className="header-actions">
            <button
              className="location-button"
              onClick={() => setNotice('Delivery location: Satna, Madhya Pradesh')}
            >
              <span className="location-icon">⌖</span>
              <span>
                <small>Delivering to</small>
                <strong>Satna, MP</strong>
              </span>
            </button>

            <button
              className="account-button"
              onClick={() => setLoginOpen(true)}
            >
              <span className="account-icon">♙</span>
              <span>Login</span>
            </button>

            <button
              className="cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <span>🛒</span>
              <strong>Cart</strong>
              <span className="cart-count">{cartCount}</span>
            </button>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`}>
          <div className="container nav-inner">
            <button
              className={page === 'Home' ? 'nav-link active' : 'nav-link'}
              onClick={() => navigate('Home')}
            >
              Home
            </button>
            <button
              className="nav-link"
              onClick={() => {
                selectCategory('All Products')
                document.getElementById('products')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              Shop All
            </button>
            <button
              className="nav-link"
              onClick={() => navigate('Orders')}
            >
              My Orders
            </button>
            <button
              className="nav-link"
              onClick={() => navigate('Farmer')}
            >
              Farmer Zone
            </button>
            <button
              className="nav-link"
              onClick={() => navigate('Retailer')}
            >
              Retailer
            </button>
            <button
              className="nav-link"
              onClick={() => navigate('Admin')}
            >
              Admin
            </button>
            <span className="nav-spacer" />
            <span className="nav-promise">✓ Trusted farming essentials</span>
          </div>
        </nav>
      </header>

      <main>
        {page === 'Home' ? (
          <>
            <section className="container hero-section">
              <div className="hero-content">
                <span className="eyebrow">
                  <span className="eyebrow-dot" />
                  A smarter way to farm
                </span>
                <h1>
                  Better farming
                  <br />
                  starts <span>right here.</span>
                </h1>
                <p>
                  Quality seeds, trusted crop care and essential farming
                  supplies—all in one convenient place.
                </p>
                <div className="hero-buttons">
                  <button
                    className="primary-button"
                    onClick={() => {
                      selectCategory('All Products')
                      document.getElementById('products')?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }}
                  >
                    Explore products <span>→</span>
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => navigate('Farmer')}
                  >
                    Farmer services
                  </button>
                </div>
                <div className="hero-trust">
                  <span>✓ Carefully selected products</span>
                  <span>✓ Convenient shopping</span>
                </div>
              </div>

              <div className="hero-visual">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85"
                  alt="Green agricultural fields"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = FALLBACK_IMAGE
                  }}
                />
                <div className="hero-image-overlay" />
                <div className="hero-floating-card">
                  <span className="floating-icon">🌱</span>
                  <span>
                    <strong>Grow with confidence</strong>
                    <small>Essentials for every season</small>
                  </span>
                </div>
                <div className="hero-season-tag">Made for Indian farmers</div>
              </div>
            </section>

            <section className="container benefits-strip">
              <div className="benefit-item">
                <span className="benefit-icon">🌱</span>
                <div>
                  <strong>Quality essentials</strong>
                  <small>Carefully selected supplies</small>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🚚</span>
                <div>
                  <strong>Local convenience</strong>
                  <small>Designed for your region</small>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🤝</span>
                <div>
                  <strong>Farmer-first approach</strong>
                  <small>Simple, helpful shopping</small>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💬</span>
                <div>
                  <strong>Need assistance?</strong>
                  <small>Support information coming soon</small>
                </div>
              </div>
            </section>

            <section className="container category-section">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Shop by need</span>
                  <h2>Everything your farm needs</h2>
                  <p>Find the right essentials for your next season.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => selectCategory('All Products')}
                >
                  View all products →
                </button>
              </div>

              <div className="category-grid">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    className={`category-card category-${item.color} ${
                      category === item.name ? 'category-selected' : ''
                    }`}
                    onClick={() => selectCategory(item.name)}
                  >
                    <span className="category-art">{item.icon}</span>
                    <strong>{item.name}</strong>
                    <span className="category-arrow">↗</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="products-section" id="products">
              <div className="container">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">Our selection</span>
                    <h2>
                      {search
                        ? `Results for "${search}"`
                        : category === 'All Products'
                          ? 'Popular farm essentials'
                          : category}
                    </h2>
                    <p>Explore products for your farming needs.</p>
                  </div>
                  <span className="product-count">
                    {filteredProducts.length} products
                  </span>
                </div>

                <div className="filter-row">
                  {categories.map((item) => (
                    <button
                      key={item.name}
                      className={`filter-chip ${
                        category === item.name ? 'filter-active' : ''
                      }`}
                      onClick={() => selectCategory(item.name)}
                    >
                      {item.icon} {item.name}
                    </button>
                  ))}
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="product-grid">
                    {filteredProducts.map((product) => (
                      <article className="product-card" key={product.id}>
                        <button
                          className="product-image-button"
                          onClick={() => setSelectedProduct(product)}
                          aria-label={`View ${product.name}`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.onerror = null
                              event.currentTarget.src = FALLBACK_IMAGE
                            }}
                          />
                          {product.badge && (
                            <span className="product-badge">
                              {product.badge}
                            </span>
                          )}
                          <span className="product-quick-view">
                            View details ↗
                          </span>
                        </button>

                        <div className="product-info">
                          <span className="product-category">
                            {product.category}
                          </span>
                          <button
                            className="product-name"
                            onClick={() => setSelectedProduct(product)}
                          >
                            {product.name}
                          </button>
                          <span className="product-unit">{product.unit}</span>
                          <p className="product-description">
                            {product.description}
                          </p>
                          <div className="product-bottom">
                            <div className="product-prices">
                              <strong>{money(product.price)}</strong>
                              <del>{money(product.oldPrice)}</del>
                            </div>
                            <button
                              className="add-button"
                              onClick={() => addToCart(product)}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span>🔎</span>
                    <h3>No matching products found</h3>
                    <p>Try another product name, category, or keyword.</p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        setSearch('')
                        setCategory('All Products')
                      }}
                    >
                      Show all products
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="container farmer-banner">
              <div className="farmer-banner-icon">🌿</div>
              <div>
                <span className="section-kicker">For your farm</span>
                <h2>Every season deserves a smarter start.</h2>
                <p>
                  Explore farming essentials and stay informed about upcoming
                  digital farmer services.
                </p>
              </div>
              <button
                className="primary-button"
                onClick={() => navigate('Farmer')}
              >
                Explore farmer zone →
              </button>
            </section>
          </>
        ) : (
          <section className="container dashboard-page">
            <span className="section-kicker">KrishiMartPro account</span>
            <h1>{pageTitle[page] || page}</h1>
            <p className="dashboard-intro">
              This screen is ready for the next integration stage. Account
              information and order data will be loaded from the backend after
              authentication is implemented.
            </p>

            {page === 'Orders' && (
              <div className="dashboard-panel">
                <span className="dashboard-large-icon">📦</span>
                <h2>Your orders will appear here</h2>
                <p>
                  Sign-in and order APIs are not connected yet. Your real order
                  history will be displayed after backend integration.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setLoginOpen(true)}
                >
                  Login / Register
                </button>
              </div>
            )}

            {page === 'Profile' && (
              <div className="dashboard-panel">
                <span className="dashboard-large-icon">👤</span>
                <h2>Your farmer profile</h2>
                <p>Profile information will be available after login.</p>
                <button
                  className="primary-button"
                  onClick={() => setLoginOpen(true)}
                >
                  Login
                </button>
              </div>
            )}

            {['Farmer', 'Retailer', 'Admin'].includes(page) && (
              <div className="dashboard-grid">
                {(page === 'Farmer'
                  ? [
                      ['🌱', 'Browse products', 'Explore farming essentials.'],
                      ['📦', 'My orders', 'View your purchases after login.'],
                      ['🌦️', 'Farm assistance', 'Future crop-support features.'],
                    ]
                  : page === 'Retailer'
                    ? [
                        ['📦', 'Manage products', 'Add and update inventory.'],
                        ['🧾', 'Manage orders', 'Review customer orders.'],
                        ['📊', 'Sales overview', 'View sales after integration.'],
                      ]
                    : [
                        ['👥', 'User management', 'Manage authorized accounts.'],
                        ['🛍️', 'Product oversight', 'Review the product catalog.'],
                        ['📈', 'Platform overview', 'Monitor platform activity.'],
                      ]
                ).map(([icon, title, description]) => (
                  <div className="dashboard-card" key={title}>
                    <span>{icon}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <small>Backend integration pending</small>
                  </div>
                ))}
              </div>
            )}

            <button
              className="secondary-button dashboard-back"
              onClick={() => navigate('Home')}
            >
              ← Back to home
            </button>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">🌾</span>
              <span className="brand-text">
                <strong>KrishiMart<span>Pro</span></strong>
                <small>Kisan ka digital bazaar</small>
              </span>
            </div>
            <p>
              A farmer-focused digital marketplace for agricultural essentials
              in Satna and beyond.
            </p>
          </div>

          <div className="footer-column">
            <h3>Shop</h3>
            <button onClick={() => selectCategory('Seeds')}>Seeds</button>
            <button onClick={() => selectCategory('Fertilizers')}>
              Fertilizers
            </button>
            <button onClick={() => selectCategory('Pesticides')}>
              Pesticides
            </button>
            <button onClick={() => selectCategory('Tools')}>Farm tools</button>
          </div>

          <div className="footer-column">
            <h3>My account</h3>
            <button onClick={() => setLoginOpen(true)}>Login</button>
            <button onClick={() => navigate('Orders')}>My orders</button>
            <button onClick={() => navigate('Profile')}>My profile</button>
            <button onClick={() => navigate('Farmer')}>Farmer zone</button>
          </div>

          <div className="footer-column">
            <h3>Information</h3>
            <span>Satna, Madhya Pradesh</span>
            <span>Support details coming soon</span>
            <span>Secure checkout integration pending</span>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 KrishiMartPro. All rights reserved.</span>
            <span>Built with farmers in mind 🌱</span>
          </div>
        </div>
      </footer>

      {cartOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false)
          }}
        >
          <section className="cart-drawer" aria-label="Shopping cart">
            <div className="drawer-heading">
              <div>
                <span className="section-kicker">Your selection</span>
                <h2>Shopping Cart ({cartCount})</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state cart-empty">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some farming essentials to get started.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setCartOpen(false)
                    navigate('Home')
                    document.getElementById('products')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                >
                  Browse products
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.product.id}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = FALLBACK_IMAGE
                        }}
                      />
                      <div className="cart-item-info">
                        <strong>{item.product.name}</strong>
                        <span>{money(item.product.price)}</span>
                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              changeQuantity(item.product.id, -1)
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              changeQuantity(item.product.id, 1)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <strong>
                        {money(item.product.price * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                  <div>
                    <span>Delivery</span>
                    <strong>Calculated later</strong>
                  </div>
                  <div className="cart-total">
                    <span>Total before delivery</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                  <button
                    className="primary-button checkout-button"
                    onClick={() => {
                      setCartOpen(false)
                      navigate('Checkout')
                    }}
                  >
                    Continue to checkout →
                  </button>
                  <p className="demo-note">
                    Demo cart only. Orders are not submitted to a server.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {page === 'Checkout' && (
        <div className="modal-backdrop">
          <section className="login-modal">
            <button
              className="close-button modal-close"
              onClick={() => navigate('Home')}
              aria-label="Close checkout"
            >
              ×
            </button>
            <span className="dashboard-large-icon">📦</span>
            <h2>Checkout</h2>
            <p>
              Your cart total is {money(cartTotal)}. Address validation, order
              creation and payment will be connected after backend integration.
            </p>
            <button
              className="primary-button full-button"
              onClick={() => setLoginOpen(true)}
            >
              Login to continue
            </button>
          </section>
        </div>
      )}

      {selectedProduct && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProduct(null)
            }
          }}
        >
          <section className="product-modal">
            <button
              className="close-button modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              ×
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = FALLBACK_IMAGE
              }}
            />
            <div className="product-modal-content">
              <span className="section-kicker">
                {selectedProduct.category}
              </span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <strong className="modal-price">
                {money(selectedProduct.price)}
              </strong>
              <span className="product-unit">{selectedProduct.unit}</span>
              <button
                className="primary-button full-button"
                onClick={() => {
                  addToCart(selectedProduct)
                  setSelectedProduct(null)
                }}
              >
                Add to cart
              </button>
            </div>
          </section>
        </div>
      )}

      {loginOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLoginOpen(false)
          }}
        >
          <section className="login-modal">
            <button
              className="close-button modal-close"
              onClick={() => setLoginOpen(false)}
              aria-label="Close login"
            >
              ×
            </button>
            <span className="dashboard-large-icon">🌾</span>
            <span className="section-kicker">Welcome to KrishiMartPro</span>
            <h2>Login / Register</h2>
            <p>Enter your details to preview the account interface.</p>
            <form onSubmit={submitLogin}>
              <label>
                Mobile number or email
                <input
                  type="text"
                  placeholder="Enter mobile number or email"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter password"
                  minLength={6}
                  required
                />
              </label>
              <button className="primary-button full-button" type="submit">
                Continue
              </button>
            </form>
            <p className="demo-note">
              Demo only. Authentication is not connected. Do not enter a real
              password.
            </p>
          </section>
        </div>
      )}

      {notice && (
        <div className="toast-message" role="status">
          <span>✓</span> {notice}
        </div>
      )}
    </div>
  )
}

export default App