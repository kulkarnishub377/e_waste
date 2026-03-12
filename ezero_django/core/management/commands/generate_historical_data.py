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
from bookings.models import Booking, BookingItem, TimeSlot
from centers.models import Center
from contacts.models import ContactRequest
from market.models import Category, Product
from blog.models import QuizQuestion, QuizAnswer
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

        # Initialize TimeSlots if empty
        time_slots = list(TimeSlot.objects.all())
        if not time_slots:
            self.stdout.write("Initializing default TimeSlots...")
            TimeSlot.objects.create(start_time="09:00", end_time="11:00", capacity=20)
            TimeSlot.objects.create(start_time="11:00", end_time="13:00", capacity=20)
            TimeSlot.objects.create(start_time="14:00", end_time="16:00", capacity=20)
            TimeSlot.objects.create(start_time="16:00", end_time="18:00", capacity=20)
            time_slots = list(TimeSlot.objects.all())

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
                        pickup_time_slot=random.choice(time_slots),
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
        
        # --- SEED MARKETPLACE ---
        self.stdout.write(self.style.WARNING("Seeding Market Categories and Dummy Products..."))
        laptops_cat, _ = Category.objects.get_or_create(name='Laptops', slug='laptops', description='Refurbished & Used Laptops')
        smartphones_cat, _ = Category.objects.get_or_create(name='Smartphones', slug='smartphones', description='Certified pre-owned phones')
        hardware_cat, _ = Category.objects.get_or_create(name='Hardware Parts', slug='hardware-parts', description='CPUs, RAM, GPUs and components')

        market_products = [
            (laptops_cat, 'Dell XPS 13 (2022) - 16GB RAM/512GB SSD', 54999.00, 'like_new'),
            (laptops_cat, 'MacBook Pro 15" Mid-2015', 32500.00, 'good'),
            (smartphones_cat, 'iPhone 13 Pro - 256GB Graphite', 44000.00, 'good'),
            (smartphones_cat, 'Samsung Galaxy S22 Ultra', 51000.00, 'refurbished'),
            (hardware_cat, 'NVIDIA RTX 3070 8GB GPU', 28000.00, 'fair'),
            (laptops_cat, 'Lenovo ThinkPad T490 - Core i7', 26500.00, 'refurbished'),
        ]
        
        import uuid
        from django.utils.text import slugify
        for cat, title, price, condition in market_products:
            slug = f"{slugify(title)}-{str(uuid.uuid4())[:6]}"
            Product.objects.get_or_create(
                slug=slug,
                defaults={
                    'title': title,
                    'category': cat,
                    'description': f"This is an automatically generated listing for {title}. Fully tested and certified by E-Zero technicians. Great condition for the price.",
                    'price': price,
                    'condition': condition,
                    'status': 'approved',  # Instantly live on the storefront
                    'free_shipping': True
                }
            )

        self.stdout.write(self.style.SUCCESS('Storefront seeded successfully.'))

        # --- SEED QUIZ ---
        self.stdout.write(self.style.WARNING("Seeding Gamified Quiz..."))
        if not QuizQuestion.objects.exists():
            q1 = QuizQuestion.objects.create(
                text="Which of the following materials is commonly recovered from recycled smartphones?",
                difficulty='easy',
                points_reward=10,
                explanation="Gold is highly conductive and used in circuit boards."
            )
            QuizAnswer.objects.create(question=q1, text="Gold", is_correct=True)
            QuizAnswer.objects.create(question=q1, text="Titanium", is_correct=False)
            QuizAnswer.objects.create(question=q1, text="Uranium", is_correct=False)

            q2 = QuizQuestion.objects.create(
                text="What happens to the hazardous Lead (Pb) found in CRT monitors if left in a landfill?",
                difficulty='medium',
                points_reward=25,
                explanation="It leaches into the soil and contaminates groundwater, which is highly toxic."
            )
            QuizAnswer.objects.create(question=q2, text="It evaporates into the atmosphere.", is_correct=False)
            QuizAnswer.objects.create(question=q2, text="It rusts harmlessly.", is_correct=False)
            QuizAnswer.objects.create(question=q2, text="It leaches into groundwater.", is_correct=True)

            q3 = QuizQuestion.objects.create(
                text="On average, how many recycled phones does it take to recover 1 kg of Copper?",
                difficulty='hard',
                points_reward=50,
                explanation="Approximately 30,000 to 40,000 smartphones are needed to extract 1kg of pure copper."
            )
            QuizAnswer.objects.create(question=q3, text="10", is_correct=False)
            QuizAnswer.objects.create(question=q3, text="4,000", is_correct=False)
            QuizAnswer.objects.create(question=q3, text="40,000", is_correct=True)
            
            self.stdout.write(self.style.SUCCESS('Quiz questions seeded successfully.'))
        else:
            self.stdout.write("Quiz data already exists. Skipping.")
