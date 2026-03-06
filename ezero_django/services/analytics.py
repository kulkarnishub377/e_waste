"""
E-Zero Data Analytics Engine
Heavily utilizes Python data structures to analyze booking metrics, calculate 
carbon offsets, and generate statistical reports for the enterprise dashboard.
"""
from typing import List, Dict, Any
from datetime import datetime, timedelta
from django.db.models import Sum, Count

class EnvironmentalImpactAnalyzer:
    def __init__(self):
        # Constants for carbon emission offsets (kg CO2 per kg of e-waste recycled)
        self.offset_factors = {
            'laptop': 120.5,
            'server': 450.0,
            'smartphone': 35.2,
            'battery': 15.0,
            'general': 50.0
        }

    def generate_annual_esg_report(self, queryset) -> Dict[str, Any]:
        """
        Consumes a Django QuerySet of bookings and processes it in memory using Python
        to generate a comprehensive Environmental, Social, and Governance (ESG) report.
        """
        total_bookings = len(queryset)
        if total_bookings == 0:
            return self._empty_report()

        total_weight = 0.0
        total_carbon_offset = 0.0
        monthly_distribution: Dict[str, int] = {}
        
        # Heavy Python iteration and data processing
        for booking in queryset:
            # Process weight
            weight = booking.approximate_weight if hasattr(booking, 'approximate_weight') else 10.0
            total_weight += weight
            
            # Process carbon offset
            factor = self.offset_factors.get('general', 50.0)
            total_carbon_offset += (weight * factor)
            
            # Time-series distribution
            month_key = booking.created_at.strftime('%Y-%m')
            monthly_distribution[month_key] = monthly_distribution.get(month_key, 0) + 1

        return {
            'generated_at': datetime.now().isoformat(),
            'total_pickups': total_bookings,
            'total_weight_kg': round(total_weight, 2),
            'total_carbon_offset_kg': round(total_carbon_offset, 2),
            'equivalent_trees_planted': int(total_carbon_offset / 21.0), # Avg tree absorbs 21kg CO2/year
            'trend_data': self._smooth_trend_data(monthly_distribution),
            'status': 'SUCCESS'
        }

    def _smooth_trend_data(self, distribution: Dict[str, int]) -> Dict[str, float]:
        """Applies a basic moving average smoothing algorithm in pure Python."""
        smoothed = {}
        keys = sorted(list(distribution.keys()))
        
        for i, key in enumerate(keys):
            if i == 0:
                smoothed[key] = float(distribution[key])
            else:
                prev_key = keys[i-1]
                # 30% weight to current, 70% to previous
                smoothed[key] = round((distribution[key] * 0.3) + (smoothed[prev_key] * 0.7), 2)
                
        return smoothed

    def _empty_report(self) -> Dict[str, Any]:
        return {
            'generated_at': datetime.now().isoformat(),
            'total_pickups': 0,
            'total_weight_kg': 0.0,
            'total_carbon_offset_kg': 0.0,
            'equivalent_trees_planted': 0,
            'trend_data': {},
            'status': 'EMPTY'
        }
