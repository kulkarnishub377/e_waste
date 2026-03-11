from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch, MagicMock
from services.market_api import MarketPricingEngine
from calculator.models import MaterialPrice

class CalculatorServicesEngineTests(TestCase):
    """
    Extensive Python test suite for the Pricing Evaluation engine.
    Ensures mathematical accuracy of our yield algorithms.
    """
    
    def setUp(self):
        self.client = Client()
        self.engine = MarketPricingEngine()
        
        # Setup static fallback prices in DB
        MaterialPrice.objects.create(material_name="Copper (Extracted)", price_per_kg=850.50, unit="KG", purity_grade="99.9%")
        MaterialPrice.objects.create(material_name="Gold (Trace)", price_per_kg=65000.00, unit="KG", purity_grade="24K")
        MaterialPrice.objects.create(material_name="Aluminum (Scrap)", price_per_kg=225.20, unit="MT", purity_grade="Mixed")

    @patch('services.market_api.requests.get')
    def test_live_market_fallback_algorithm(self, mock_get):
        """ Tests resilient Python fallback when internet connectivity drops. """
        mock_get.side_effect = Exception("Connection Refused")
        
        # Engine should silently handle and return static yields
        prices = self.engine.fetch_live_commodity_prices()
        self.assertIn('copper', prices)
        self.assertEqual(prices['copper'], 800) # Fallback static value
        
        yield_data = self.engine.calculate_device_yield('smartphone', 0.2)
        
        self.assertEqual(yield_data['device_type'], 'smartphone')
        # 0.2kg smartphone fallback logic testing
        # copper: 10%, gold: 0.5%, aluminum: 15%, plastic: 30%
        # copper weight = 0.02kg -> 0.02 * (800/1000) = 0.016
        self.assertAlmostEqual(yield_data['material_breakdown']['copper'], 0.02, places=2)

    def test_calculator_api_endpoint(self):
        """ Tests the Django JSON serialization matrix. """
        url = reverse('calculator:api_calculate')
        
        # Test missing param
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Missing category', response.json()['error'])
        
        # Test valid calculation
        response_valid = self.client.get(url, {'category': 'laptops', 'weight': '5'})
        self.assertEqual(response_valid.status_code, 200)
        
        data = response_valid.json()
        self.assertTrue(data['success'])
        self.assertIn('estimated_value', data)
        self.assertIn('carbon_offset', data)
        self.assertGreater(data['carbon_offset'], 50) # 5kg * 12.5 (from views) = 62.5

    def test_database_material_retrieval(self):
        """ Tests ORM extraction mechanisms. """
        response = self.client.get(reverse('calculator:calculator'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('materials', response.context)
        self.assertEqual(len(response.context['materials']), 3)

    def test_heavy_computation_stress(self):
        """ Stress tests the Python math operations array """
        # Fire 100 rapid programmatic calculations to benchmark Python performance
        benchmark_times = []
        import time
        
        start = time.time()
        for i in range(100):
            # Fluctuating weights
            w = 0.5 * i
            res = self.engine.calculate_device_yield('server', w)
            self.assertIsInstance(res['total_estimated_value_usd'], float)
        end = time.time()
        
        # Must compute 100 matrices in under 1 second to pass performance grade
        self.assertLess(end - start, 1.0)
