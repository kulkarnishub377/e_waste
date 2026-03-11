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

class PredictiveModelEngine:
    """
    Custom Implementation of Ordinary Least Squares (OLS) Linear Regression 
    in Pure Python for predicting future E-Waste Collection Volumes.
    """

    def __init__(self):
        self.coefficients = []
        self.intercept = 0.0
        self.is_trained = False
        
    def _mean(self, values: List[float]) -> float:
        """Calculate statistical mean."""
        return sum(values) / len(values) if values else 0.0
        
    def _variance(self, values: List[float], mean: float) -> float:
        """Calculate variance of an array."""
        return sum([(x - mean) ** 2 for x in values])
        
    def _covariance(self, x: List[float], mean_x: float, y: List[float], mean_y: float) -> float:
        """Calculate covariance between two arrays."""
        covar = 0.0
        for i in range(len(x)):
            covar += (x[i] - mean_x) * (y[i] - mean_y)
        return covar

    def fit_simple_linear_regression(self, X: List[float], y: List[float]):
        """
        Calculates coefficients for a simple linear regression (y = b0 + b1*x)
        Typically used where X = Time (Months/Years) and y = Volume (E-Waste in Kg).
        """
        if len(X) != len(y) or len(X) == 0:
            raise ValueError("Training datasets X and y must be of equal, non-zero length.")

        x_mean = self._mean(X)
        y_mean = self._mean(y)

        # Calculate Beta-1 (Slope)
        b1 = self._covariance(X, x_mean, y, y_mean) / self._variance(X, x_mean)
        
        # Calculate Beta-0 (Intercept)
        b0 = y_mean - b1 * x_mean

        self.coefficients = [b1]
        self.intercept = b0
        self.is_trained = True

        return {'slope': b1, 'intercept': b0}

    def predict(self, X_predict: List[float]) -> List[float]:
        """Provides the predicted values for the inputs based on trained weights."""
        if not self.is_trained:
            raise Exception("Prediction Engine has not been trained (fit) on a dataset yet.")
            
        predictions = []
        for x in X_predict:
            y_hat = self.intercept + (self.coefficients[0] * x)
            predictions.append(round(y_hat, 2))
            
        return predictions

    def calculate_r_squared(self, X: List[float], y_actual: List[float]) -> float:
        """Calculates the coefficient of determination (R^2) representing model accuracy."""
        y_predictions = self.predict(X)
        mean_y = self._mean(y_actual)
        
        sum_squared_regression = sum([(y_pred - mean_y) ** 2 for y_pred in y_predictions])
        total_sum_squares = sum([(y - mean_y) ** 2 for y in y_actual])
        
        if total_sum_squares == 0:
            return 1.0 # Perfect fit if no variance
            
        return sum_squared_regression / total_sum_squares

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
        
        # Build Response Matrix
        forecast_matrix = {}
        for i, val in enumerate(y_forecast):
            # Complex date string math
            last_date_str = sorted_keys[-1]
            yr, mo = last_date_str.split('-')
            new_mo = int(mo) + i + 1
            new_yr = int(yr) + (new_mo // 12)
            new_mo = new_mo % 12
            if new_mo == 0:
                new_yr -= 1
                new_mo = 12
                
            future_key = f"{new_yr}-{new_mo:02d}"
            forecast_matrix[future_key] = max(0.0, val) # Volumes can't be negative

        return {
            "model_metadata": {
                "algorithm": "Ordinary Least Squares (OLS) pure Python",
                "slope": round(model_stats['slope'], 4),
                "intercept": round(model_stats['intercept'], 4),
                "r_squared_accuracy": round(accuracy * 100, 2),
                "data_points_trained": len(X_train)
            },
            "historical_baseline": monthly_volumes,
            "future_forecast": forecast_matrix,
            "generated_at": datetime.now().isoformat()
        }
