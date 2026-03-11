"""
Massive Integration and Unit Testing Suite for E-Zero Bookings and Services.
This ensures algorithmic integrity for the Market API, PDF Generator, and ML Models.
Heavy use of Python mocking, patching, and assertion logic.
"""

import json
from decimal import Decimal
from datetime import datetime
from unittest.mock import patch, MagicMock

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

from bookings.models import Booking, BookingItem
from services.market_api import MarketPricingEngine
from services.analytics import EnvironmentalImpactAnalyzer
from services.ml_predictor import PredictiveModelEngine, ESGVolumeForecaster

User = get_user_model()

class AdvancedServicesIntegrationTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='test_eco_warrior',
            email='test@ezero.com',
            password='securepassword123'
        )
        self.client = Client()
        self.client.login(username='test_eco_warrior', password='securepassword123')
        
        self.market_api = MarketPricingEngine()
        self.analytics = EnvironmentalImpactAnalyzer()
        self.ml_engine = PredictiveModelEngine()

    @patch('services.market_api.requests.get')
    def test_market_pricing_engine_algorithmic_yield(self, mock_get):
        """Tests the complex Python yield algorithm against simulated commodity markets."""
        # Mock successful API Response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'copper': 900.00,
            'gold': 68000.00,
            'aluminum': 250.00,
            'plastic': 50.00
        }
        mock_response.status_code = 200
        mock_get.return_value = mock_response

        # Calculate a 10kg Server yield
        result = self.market_api.calculate_device_yield('server', 10.0)
        
        self.assertIn('device_type', result)
        self.assertEqual(result['device_type'], 'server')
        self.assertEqual(result['input_weight_kg'], 10.0)
        self.assertIn('total_estimated_value_usd', result)
        
        breakdown = result['material_breakdown']
        self.assertIn('copper', breakdown)
        self.assertIn('gold', breakdown)
        
        # Test fallback static values
        mock_get.side_effect = Exception("API Timeout Simulation")
        fallback_result = self.market_api.calculate_device_yield('laptop', 2.0)
        self.assertGreater(fallback_result['total_estimated_value_usd'], 0)

    def test_environmental_analytics_processing(self):
        """Tests the in-memory Python processing of Django Querysets for ESG smoothing."""
        # Seed 50 bookings
        for i in range(50):
            Booking.objects.create(
                user=self.user,
                name="Corp Test", email="test@ezero.com", phone="1234567890",
                company="Test Inc", address="123 Street", city="Mumbai", pincode="400001",
                pickup_date=datetime.now().date(), status='COMPLETED'
            )
        
        qs = Booking.objects.all()
        # Mock approximate_weight property dynamically
        for b in qs:
            b.approximate_weight = 15.5
            
        report = self.analytics.generate_annual_esg_report(qs)
        
        self.assertEqual(report['status'], 'SUCCESS')
        self.assertEqual(report['total_pickups'], 50)
        self.assertGreater(report['total_carbon_offset_kg'], 1000)
        self.assertIn('equivalent_trees_planted', report)
        self.assertIsInstance(report['trend_data'], dict)

    def test_pure_python_machine_learning_engine(self):
        """
        Validates the Custom Linear Regression OLS Model.
        Tests covariance, variance, and R-Squared logic.
        """
        # Linear relationship dataset (y = 2x + 1)
        X = [1.0, 2.0, 3.0, 4.0, 5.0]
        y = [3.0, 5.0, 7.0, 9.0, 11.0]
        
        stats = self.ml_engine.fit_simple_linear_regression(X, y)
        self.assertTrue(self.ml_engine.is_trained)
        
        # OLS should perfectly find slope=2, intercept=1
        self.assertAlmostEqual(stats['slope'], 2.0, places=2)
        self.assertAlmostEqual(stats['intercept'], 1.0, places=2)
        
        # Test Predictions
        predictions = self.ml_engine.predict([6.0, 10.0])
        self.assertEqual(predictions, [13.0, 21.0])
        
        # Test R-Squared (Should be 1.0 for perfect correlation)
        r2 = self.ml_engine.calculate_r_squared(X, y)
        self.assertEqual(r2, 1.0)
        
    def test_ml_forecaster_wrapper(self):
        """Tests the higher-level ESG Volume forecaster parsing date strings."""
        forecaster = ESGVolumeForecaster()
        
        historical_corpus = {
            "2023-01": 1000.0,
            "2023-02": 1500.0,
            "2023-03": 2000.0,
            "2023-04": 2500.0
        }
        
        report = forecaster.generate_forecast_report(historical_corpus, months_to_predict=3)
        
        self.assertIn('model_metadata', report)
        self.assertEqual(report['model_metadata']['data_points_trained'], 4)
        
        # Check future payload
        future = report['future_forecast']
        self.assertEqual(len(future), 3)
        self.assertIn("2023-05", future)
        self.assertIn("2023-06", future)
        self.assertIn("2023-07", future)
        
        # Extrapolated values should continue linear trend (~3000, 3500, 4000)
        self.assertGreater(future["2023-05"], 2800.0)

class BookingViewsTestingArchitecture(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='api_tester',
            email='api@ezero.com',
            password='testpassword'
        )
        self.client.login(username='api_tester', password='testpassword')
        
    @patch('services.notifications.NotificationRouter.send_pickup_confirmation')
    def test_booking_api_creation_flow(self, mock_notify):
        """Tests the complex JSON payload handling and market DB population."""
        payload = {
            'name': 'API Bot',
            'email': 'bot@ezero.com',
            'phone': '9999999999',
            'company': 'Automated Tests Ltd',
            'address': '01x Memory Lane',
            'city': 'Cyber City',
            'pincode': '101010',
            'pickup_date': '2026-10-10',
            'items': [
                {'type': 'laptop', 'brand': 'Lenovo', 'quantity': 5},
                {'type': 'server', 'brand': 'Cisco', 'quantity': 2}
            ]
        }
        
        response = self.client.post(
            reverse('bookings:api_create'), 
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        resp_data = response.json()
        self.assertTrue(resp_data['success'])
        
        # Verify Database Integration
        booking_id = resp_data['booking_id']
        booking = Booking.objects.get(booking_id=booking_id)
        
        self.assertEqual(booking.name, 'API Bot')
        self.assertEqual(booking.user, self.user)
        
        items = BookingItem.objects.filter(booking=booking)
        self.assertEqual(items.count(), 2)
        
        # The MarketPricingEngine should have populated the estimated_value
        total_val = sum([item.estimated_value for item in items])
        self.assertGreater(total_val, Decimal('0.00'))
        
        # Ensure notifications fired
        self.assertTrue(mock_notify.called)

    def test_pdf_report_routing(self):
        """Tests the security and generation headers of the dynamic PDF builder."""
        booking = Booking.objects.create(
            user=self.user, name="PDF Test", email="pdf@tz.com", phone="12",
            address="a", city="b", pincode="c", pickup_date=datetime.now().date(),
            status='COMPLETED', compliance_certificate=True
        )
        
        url = reverse('bookings:download_certificate', kwargs={'booking_id': booking.booking_id})
        response = self.client.get(url)
        
        # Should return PDF byte stream
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn(booking.booking_id, response['Content-Disposition'])
        
        # Test Denial
        pending_booking = Booking.objects.create(
            user=self.user, name="Pending", email="x@x.com", phone="1",
            address="a", city="b", pincode="c", pickup_date=datetime.now().date(),
            status='PENDING', compliance_certificate=True
        )
        
        url_pending = reverse('bookings:download_certificate', kwargs={'booking_id': pending_booking.booking_id})
        resp_denied = self.client.get(url_pending)
        
        # Should redirect back to detail page if not completed
        self.assertEqual(resp_denied.status_code, 302)
