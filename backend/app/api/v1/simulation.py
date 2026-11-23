from fastapi import APIRouter
from ...services.mock_engine import mock_engine
from ...schemas.forecast import WhatIfRequest, WhatIfResponse

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/what-if", response_model=WhatIfResponse, summary="Simulate What-If Attack & Mitigation Scenarios")
def simulate_scenario(req: WhatIfRequest):
    """
    Interactive counterfactual inference sandbox: models the effect of traffic volume
    surges and rate-limiting scrubbers on anticipated attack probability and risk level.
    """
    return mock_engine.simulate_what_if(req)
