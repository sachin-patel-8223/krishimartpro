from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import engine
from models.product import Product
from schemas.product import ProductCreate, ProductResponse


# ==================================================
# 1. FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="KrishiMartPro API",
    description="Agriculture e-commerce platform for farmers",
    version="1.0.0",
)


# ==================================================
# 2. DATABASE DEPENDENCY
# ==================================================

def get_db():
    with Session(engine) as db:
        yield db


# ==================================================
# 3. HOME API
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to KrishiMartPro API",
        "status": "success",
    }


# ==================================================
# 4. HEALTH CHECK API
# ==================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KrishiMartPro Backend",
    }


# ==================================================
# 5. GET ALL ACTIVE PRODUCTS
# ==================================================

@app.get(
    "/api/products",
    response_model=list[ProductResponse],
)
def get_products(db: Session = Depends(get_db)):

    statement = (
        select(Product)
        .where(Product.is_active.is_(True))
        .order_by(Product.id)
    )

    products = db.scalars(statement).all()

    return products


# ==================================================
# PRODUCT CATEGORIES API
# ==================================================

@app.get("/api/categories", response_model=list[str])
def get_categories(db: Session = Depends(get_db)):

    statement = (
        select(Product.category)
        .where(Product.is_active.is_(True))
        .distinct()
        .order_by(Product.category)
    )

    categories = db.scalars(statement).all()

    return categories


# ==================================================
# 6. SEARCH PRODUCTS
# IMPORTANT: Keep this before /{product_id}
# ==================================================

@app.get(
    "/api/products/search",
    response_model=list[ProductResponse],
)
def search_products(
    q: str,
    db: Session = Depends(get_db),
):
    search_term = f"%{q.strip()}%"

    statement = (
        select(Product)
        .where(
            Product.is_active.is_(True),
            (
                Product.name.ilike(search_term)
                | Product.category.ilike(search_term)
            ),
        )
        .order_by(Product.name)
    )

    products = db.scalars(statement).all()

    return products


# ==================================================
# 7. GET SINGLE PRODUCT BY ID
# ==================================================

@app.get(
    "/api/products/{product_id}",
    response_model=ProductResponse,
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if product is None or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


# ==================================================
# 8. CREATE NEW PRODUCT
# ==================================================

@app.post(
    "/api/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
):
    product = Product(
        name=product_data.name,
        category=product_data.category,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        is_active=True,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


# ==================================================
# 9. UPDATE PRODUCT
# ==================================================

@app.patch(
    "/api/products/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: int,
    product_data: ProductCreate,
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if product is None or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    product.name = product_data.name
    product.category = product_data.category
    product.description = product_data.description
    product.price = product_data.price
    product.stock = product_data.stock

    db.commit()
    db.refresh(product)

    return product


# ==================================================
# 10. DEACTIVATE PRODUCT
# Soft delete: Keep record in database
# ==================================================

@app.delete("/api/products/{product_id}")
def deactivate_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if product is None or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    product.is_active = False

    db.commit()

    return {
        "message": "Product deactivated successfully",
        "product_id": product.id,
        "is_active": product.is_active,
    }