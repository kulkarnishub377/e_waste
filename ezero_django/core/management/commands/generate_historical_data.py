"""
Historical E-Waste Booking Generator
Simulates a multi-year dataset for ESG reporting and Analytics predictive modeling.
Designed for heavy backend data throughput and database indexing interactions.
"""

import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils import timezone
from bookings.models import Booking, BookingItem
from centers.models import Center
from contacts.models import ContactRequest
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class Command(BaseCommand):
    help = 'Generates 5 years of historical E-Waste Data for Analytics & Machine Learning Models.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--years',
            type=int,
            default=5,
            help='Number of historical years to simulate.',
        )
        parser.add_argument(
            '--volume',
            type=int,
            default=5000,
            help='Number of total historical bookings to generate.',
        )

    def handle(self, *args, **options):
        years = options['years']
        volume = options['volume']
        
        self.stdout.write(self.style.SUCCESS(f'Initializing Simulation Engine... Generating {volume} records over {years} years.'))

        # Core Simulation Utilities
        companies = [
            "TechNova Solutions", "Global Data Systems", "GreenTech Logistics", 
            "Apex Servers Inc.", "Quantum Computing Labs", "Cyberdyne Systems", 
            "Wayne Enterprises", "Stark Industries", "Massive Dynamic", "Initech"
        ]
        
        cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"]
        
        item_configs = {
            'laptop': {'weight': (1.5, 3.0), 'value': (500, 2500)},
            'server': {'weight': (10.0, 45.0), 'value': (5000, 45000)},
            'smartphone': {'weight': (0.1, 0.3), 'value': (100, 800)},
            'battery': {'weight': (2.0, 50.0), 'value': (500, 15000)},
            'desktop': {'weight': (5.0, 15.0), 'value': (800, 3000)},
            'networking_gear': {'weight': (2.0, 10.0), 'value': (1000, 15000)},
        }
        
        brands = ["Dell", "HP", "Lenovo", "Apple", "Cisco", "IBM", "Sun", "Generic OEM"]
        
        conditions = ["working", "broken", "scrap", "obsolete"]
        
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365 * years)

        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.WARNING("No Users found. Creating a generic Corporate Admin user..."))
            admin_user = User.objects.create_user(
                username='sysadmin_batch',
                email='batch@ezero.local',
                password='password123',
                first_name='System',
                last_name='BatchProcessor'
            )
            users.append(admin_user)

        self.stdout.write("Beginning Batch Ingestion Engine. This heavily utilizes Python DB cursors.")
        
        batch_size = 500
        total_created = 0
        
        # Heavy Python DB Insertion Pipeline
        for chunk_offset in range(0, volume, batch_size):
            chunk_limit = min(chunk_offset + batch_size, volume)
            current_batch_size = chunk_limit - chunk_offset
            
            with transaction.atomic():
                bookings_to_create = []
                for i in range(current_batch_size):
                    # Time Series Variance Algorithm
                    delta = end_date - start_date
                    random_days = random.randrange(delta.days)
                    sim_date = start_date + timedelta(days=random_days)
                    
                    user = random.choice(users)
                    company = random.choice(companies)
                    city = random.choice(cities)
                    
                    booking = Booking(
                        name=f"{user.first_name} {user.last_name}",
                        email=user.email,
                        phone=f"+91-{random.randint(9000000000, 9999999999)}",
                        company=company,
                        address=f"{random.randint(100, 9999)} Industrial Park, Phase {random.randint(1, 4)}",
                        city=city,
                        pincode=str(random.randint(400000, 420000)),
                        pickup_date=sim_date.date() + timedelta(days=random.randint(2, 14)),
                        pickup_time_slot=random.choice(['09:00-11:00', '11:00-13:00', '14:00-16:00']),
                        status='COMPLETED',  # Historical data is finished
                        data_destruction=random.choice([True, False]),
                        compliance_certificate=random.choice([True, False]),
                        user=user,
                    )
                    # We have to manipulate the created_at timestamp POST-save. 
                    # So we save immediately to get an ID.
                    booking.save()
                    
                    # Override auto-now-add field via queryset update to simulate history
                    Booking.objects.filter(pk=booking.pk).update(created_at=sim_date)
                    
                    # Generate Procedural Items
                    num_items = random.randint(1, 8)
                    for _ in range(num_items):
                        i_type = random.choice(list(item_configs.keys()))
                        cfg = item_configs[i_type]
                        qty = random.randint(1, 150)
                        
                        BookingItem.objects.create(
                            booking=booking,
                            item_type=i_type,
                            brand=random.choice(brands),
                            condition=random.choice(conditions),
                            quantity=qty,
                            estimated_value=Decimal(str(random.uniform(cfg['value'][0], cfg['value'][1]) * qty)).quantize(Decimal("0.01"))
                        )
                
            total_created += current_batch_size
            self.stdout.write(self.style.WARNING(f"Processed Batch Chunk -> {total_created}/{volume} records ingested."))

        self.stdout.write(self.style.SUCCESS(f'Successfully injected {total_created} historical datasets into E-Zero.'))
        self.stdout.write(self.style.SUCCESS('These raw matrices are now available to services/analytics.py and Machine Learning models.'))
