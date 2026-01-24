from typing import Dict, Any

class FinanceAgent:
    """
    Validates transaction economics.
    """
    def review_budget(self, transaction_context: Dict) -> Dict[str, Any]:
        """
        Checks if the deal fits the budget.
        """
        price = transaction_context.get("price", 0)
        budget = transaction_context.get("budget", 1000)
        
        print(f"[FinanceAgent] Reviewing: ${price} vs Budget: ${budget}")
        
        if price <= budget:
            return {
                "status": "APPROVED", 
                "reason": "Within budget limits."
            }
        else:
            return {
                "status": "FLAGGED", 
                "reason": f"Over budget by ${price - budget}. Requires Human Approval."
            }

finance_agent = FinanceAgent()
