
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import random

class FraudDetectionService:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self._train_initial_model()

    def _train_initial_model(self):
        # Synthetic training data for demonstration
        # Features: [Transaction Amount, Time of Day (0-24), Location Distance (km), Device Trust Score (0-1)]
        # 0 = Legitimate, 1 = Fraud
        
        X_train = np.array([
            [50.0, 14, 5, 0.9],   # Normal
            [2500.0, 3, 500, 0.1], # Fraud (High amount, weird time, far, low trust)
            [20.0, 10, 2, 0.95],   # Normal
            [10.0, 18, 1, 0.99],   # Normal
            [5000.0, 2, 1000, 0.05], # Fraud
            [100.0, 12, 10, 0.8],  # Normal
        ])
        y_train = np.array([0, 1, 0, 0, 1, 0])

        self.scaler.fit(X_train)
        self.model.fit(X_train, y_train)

    def predict_fraud_probability(self, amount: float, hour: int, distance_km: float, trust_score: float) -> float:
        """
        Predicts probability of a transaction being fraudulent.
        """
        features = np.array([[amount, hour, distance_km, trust_score]])
        scaled_features = self.scaler.transform(features)
        
        # Get probability of class 1 (Fraud)
        probability = self.model.predict_proba(scaled_features)[0][1]
        return float(probability)

fraud_service = FraudDetectionService()
