from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

app = FastAPI(title="GLOBAL FINANCE AI API", version="1.0.0")

# Development-only CORS. Restrict origins before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

Market = Literal["global", "cn", "us", "hk", "crypto"]

class MarketItem(BaseModel):
    symbol: str
    name: str
    market: Market
    value: float | None = None
    change_pct: float | None = None
    currency: str | None = None
    status: Literal["pending", "live", "delayed", "close"] = "pending"
    source: str | None = None
    timestamp: str | None = None
    timezone: str | None = None

class OverviewResponse(BaseModel):
    as_of: str
    status: str
    note: str
    items: list[MarketItem]

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "global-finance-ai-api"}

@app.get("/api/markets/overview", response_model=OverviewResponse)
def market_overview(market: Market = "global"):
    # Placeholder records only. Real values must come from a licensed provider.
    universe = [
        MarketItem(symbol="SPX", name="S&P 500", market="us"),
        MarketItem(symbol="NDX", name="NASDAQ 100", market="us"),
        MarketItem(symbol="000001", name="上证指数", market="cn"),
        MarketItem(symbol="399006", name="创业板指", market="cn"),
        MarketItem(symbol="HSI", name="恒生指数", market="hk"),
        MarketItem(symbol="BTC-USD", name="Bitcoin", market="crypto"),
        MarketItem(symbol="ETH-USD", name="Ethereum", market="crypto"),
    ]
    items = universe if market == "global" else [x for x in universe if x.market == market]
    return OverviewResponse(
        as_of=datetime.now(timezone.utc).isoformat(),
        status="pending",
        note="Market-data provider not configured. No live or delayed prices are being represented.",
        items=items,
    )
