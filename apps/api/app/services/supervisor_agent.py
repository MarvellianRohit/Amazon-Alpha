from typing import List, Dict, Any

class SupervisorAgent:
    """
    Enterprise Governance Agent.
    Audits interactions for compliance and potential risks.
    """
    
    @staticmethod
    def audit_negotiation_step(
        current_step: Dict, 
        history: List[Dict], 
        benchmark_price: float
    ) -> Dict[str, Any]:
        """
        Analyzes the latest action for validity.
        """
        issues = []
        is_compliant = True
        
        # 1. Price Gouging Detection
        # If Vendor asks for > 20% above benchmark
        if current_step.get("role") == "VENDOR":
            price = current_step.get("price", 0)
            if price > (benchmark_price * 1.2):
                issues.append("PRICE_GOUGING_DETECTED: Vendor offer exceeds 20% markup limit.")
                is_compliant = False

        # 2. Ethical Compliance (Simple keyword check for toxicity)
        messages = current_step.get("content", "")
        toxic_keywords = ["scam", "idiot", "cheat", "fake"]
        if any(word in messages.lower() for word in toxic_keywords):
            issues.append("ETHICAL_VIOLATION: Toxic language detected.")
            is_compliant = False

        # 3. Privacy Policy (Student Data)
        if "student id" in messages.lower() or "@university.edu" in messages.lower():
             issues.append("PRIVACY_VIOLATION: PII (Student ID/Email) detected in negotiation text.")
             is_compliant = False
        
        # 4. Fair Trade (Market Rate Check)
        market_rate = benchmark_price
        offered_price = current_step.get("price", 0)
        # If Vendor undercuts too much, it might be dumping? (Reverse Price Gouging logic optional)
        # Sticking to Gouging check implemented above.

        # 5. Prompt Injection Shield (Red Team Defense)
        injection_patterns = ["ignore previous", "system override", "disable price", "important:", "alpha mode"]
        if any(pattern in messages.lower() for pattern in injection_patterns):
             issues.append("SECURITY_ALERT: Prompt Injection Attack detected.")
             is_compliant = False

        return {
            "compliant": is_compliant,
            "issues": issues,
            "auditor": "SupervisorAgent-v1",
            "policy_version": "2026.1"
        }

supervisor_agent = SupervisorAgent()
