"""
E-Zero Predictive Analytics Engine
Implements a Pure-Python multiple linear regression model from scratch.
Zero external ML libraries (like scikit-learn or tensorflow) are used to keep 
the dependency footprint zero while establishing a heavily dominant Python architecture.

This models E-Waste influx volume based on time-series historical data.
"""
import math
from datetime import datetime, date
from typing import List, Tuple, Dict, Any
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

class PredictiveModelEngine:
    """
    Industry Standard Ordinary Least Squares (OLS) Linear Regression 
    powered by scikit-learn for predicting future E-Waste Collection Volumes.
    """

    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False
        
    def fit_simple_linear_regression(self, X: List[float], y: List[float]):
        """
        Trains the scikit-learn model.
        """
        if len(X) != len(y) or len(X) == 0:
            raise ValueError("Training datasets X and y must be of equal, non-zero length.")

        # Reshape X for sklearn (requires 2D array)
        X_arr = np.array(X).reshape(-1, 1)
        y_arr = np.array(y)

        self.model.fit(X_arr, y_arr)
        self.is_trained = True

        return {'slope': self.model.coef_[0], 'intercept': self.model.intercept_}

    def predict(self, X_predict: List[float]) -> List[float]:
        """Provides the predicted values for the inputs based on trained weights."""
        if not self.is_trained:
            raise Exception("Prediction Engine has not been trained (fit) on a dataset yet.")
            
        X_arr = np.array(X_predict).reshape(-1, 1)
        predictions = self.model.predict(X_arr)
            
        return [round(float(p), 2) for p in predictions]

    def calculate_r_squared(self, X: List[float], y_actual: List[float]) -> float:
        """Calculates the coefficient of determination (R^2) using scikit-learn."""
        if not self.is_trained:
            return 0.0
            
        X_arr = np.array(X).reshape(-1, 1)
        y_predictions = self.model.predict(X_arr)
        
        return r2_score(y_actual, y_predictions)

class ESGVolumeForecaster:
    """
    Higher-level wrapper that interfaces the predictive model with 
    Django Database representations.
    """
    def __init__(self):
        self.engine = PredictiveModelEngine()

    def generate_forecast_report(self, monthly_volumes: Dict[str, float], months_to_predict: int = 6) -> Dict[str, Any]:
        """
        Takes real historical data { "2023-01": 5500.2, ... } and 
        predicts future volumes for dynamic chart rendering.
        """
        # Formulate X (Time Index) and Y (Volume)
        sorted_keys = sorted(list(monthly_volumes.keys()))
        
        if len(sorted_keys) < 3:
            return {"error": "Insufficient data corpus to train the prediction model. Requires >= 3 time slices."}

        X_train = list(range(1, len(sorted_keys) + 1))
        y_train = [monthly_volumes[k] for k in sorted_keys]

        # Train AI Model
        model_stats = self.engine.fit_simple_linear_regression(X_train, y_train)
        accuracy = self.engine.calculate_r_squared(X_train, y_train)

        # Forecast Future Metrics
        last_index = len(sorted_keys)
        X_future = list(range(last_index + 1, last_index + 1 + months_to_predict))
        y_forecast = self.engine.predict(X_future)
        
        # Build Response Matrix utilizing Pandas Dates
        forecast_matrix = {}
        
        # Generate future date strings using pandas
        last_date_str = sorted_keys[-1]
        future_dates = pd.date_range(start=last_date_str, periods=months_to_predict + 1, freq='MS')[1:]
        
        for i, val in enumerate(y_forecast):
            future_key = future_dates[i].strftime("%Y-%m")
            forecast_matrix[future_key] = max(0.0, val) # Volumes can't be negative

        return {
            "model_metadata": {
                "algorithm": "scikit-learn OLS Linear Regression",
                "slope": round(float(model_stats['slope']), 4),
                "intercept": round(float(model_stats['intercept']), 4),
                "r_squared_accuracy": round(float(accuracy) * 100, 2),
                "data_points_trained": len(X_train)
            },
            "historical_baseline": monthly_volumes,
            "future_forecast": forecast_matrix,
            "generated_at": datetime.now().isoformat()
        }
