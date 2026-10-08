"""Request bodies for the RYVO API."""
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field

DomainId = Literal["emergency", "food", "upi"]


class RoundStart(BaseModel):
    domain: Optional[Literal["emergency", "food", "upi", "all"]] = None
    scenario: Optional[str] = Field(None, description="scenario name, e.g. 'Monsoon night'")
    attacks: Optional[list[str]] = Field(None, description="explicit experiments, e.g. ['kill_sms']")


class SafetyTest(BaseModel):
    domain: Optional[DomainId] = None


class Control(BaseModel):
    cmd: Literal["pause", "resume", "blue", "domain", "autoplay", "reset_learning", "scenario"]
    enabled: Optional[bool] = None
    domain: Optional[str] = None
    name: Optional[str] = None
    attacks: Optional[list[str]] = None


class ChatContext(BaseModel):
    page: Optional[str] = None
    domain: Optional[DomainId] = None
    round: Optional[int] = None
    chart: Optional[str] = None
    selectedService: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(..., max_length=500)
    context: ChatContext = ChatContext()


class ChatResponse(BaseModel):
    answer: str
    relatedData: list[dict[str, Any]] = []
    suggestedActions: list[str] = []
    intent: Optional[str] = None
    context: Optional[dict[str, Any]] = None
