from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    category: str = Field(min_length=2, max_length=100)
    description: str | None = None
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    stock: int = Field(ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str | None
    price: Decimal
    stock: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)