"""
Management command to seed the database with initial data.
Loads data from the existing JSON files and populates all models.
"""

import json
import os
from datetime import date
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User

from core.models import (
    Service, ProcessStep, Advantage, Certification,
    FAQ, Testimonial, AcceptedItemCategory, ImpactStat, SiteStat
)
from centers.models import Center
from bookings.models import Booking, BookingItem
from blog.models import Article
from calculator.models import RecyclableItem, ServiceOption
from accounts.models import UserProfile


class Command(BaseCommand):
    help = 'Seed the database with initial E-Zero data'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            self._clear_all()

        self.stdout.write(self.style.NOTICE('[SEED] Seeding E-Zero database...'))

        self._seed_site_stats()
        self._seed_services()
        self._seed_process_steps()
        self._seed_advantages()
        self._seed_certifications()
        self._seed_faqs()
        self._seed_testimonials()
        self._seed_accepted_items()
        self._seed_impact_stats()
        self._seed_calculator_items()
        self._seed_articles()
        self._seed_centers()
        self._seed_users()

        self.stdout.write(self.style.SUCCESS('[OK] Database seeded successfully!'))

    def _clear_all(self):
        for model in [Service, ProcessStep, Advantage, Certification,
                       FAQ, Testimonial, AcceptedItemCategory, ImpactStat,
                       SiteStat, Center, Article, RecyclableItem, ServiceOption,
                       Booking, BookingItem]:
            model.objects.all().delete()

    def _seed_site_stats(self):
        stats = [
            {'icon': 'fas fa-recycle', 'value': '50,000+', 'label': 'Tons E-Waste Recycled', 'order': 1},
            {'icon': 'fas fa-building', 'value': '500+', 'label': 'Corporate Clients', 'order': 2},
            {'icon': 'fas fa-map-marker-alt', 'value': '25+', 'label': 'Processing Facilities', 'order': 3},
            {'icon': 'fas fa-award', 'value': '15+', 'label': 'Years Experience', 'order': 4},
        ]
        for s in stats:
            SiteStat.objects.get_or_create(label=s['label'], defaults=s)
        self.stdout.write(f'  [+] {len(stats)} site stats')

    def _seed_services(self):
        services = [
            {
                'name': 'IT Asset Disposal',
                'icon': 'fas fa-server',
                'description': 'Secure disposal of computers, servers, network equipment, and data storage devices with certified data destruction and complete asset tracking.',
                'features': ['Complete asset inventory', 'Secure data wiping', 'Certificate of destruction', 'Asset value recovery'],
                'order': 1,
            },
            {
                'name': 'Data Destruction',
                'icon': 'fas fa-shield-alt',
                'description': 'NIST-compliant data sanitization and physical destruction services ensuring your sensitive data is completely irrecoverable.',
                'features': ['On-site shredding available', 'DOD 5220.22-M standard', 'Video documentation', 'Destruction certificate'],
                'order': 2,
            },
            {
                'name': 'Corporate Recycling',
                'icon': 'fas fa-industry',
                'description': 'Tailored recycling programs for enterprises with scheduled pickups, dedicated account management, and ESG reporting support.',
                'features': ['Customized pickup schedule', 'Dedicated account manager', 'Quarterly sustainability reports', 'EPR compliance support'],
                'order': 3,
            },
            {
                'name': 'Residential Pickup',
                'icon': 'fas fa-home',
                'description': 'Free doorstep collection for households. Responsibly recycle your old phones, laptops, TVs, and household electronics.',
                'features': ['Free doorstep pickup', 'All electronics accepted', 'Same-day scheduling', 'Reward points earned'],
                'order': 4,
            },
            {
                'name': 'Battery Recycling',
                'icon': 'fas fa-battery-half',
                'description': 'Specialized handling of lithium-ion, lead-acid, and other battery types with safe processing and material recovery.',
                'features': ['All battery types accepted', 'Hazmat certified handling', 'Material recovery report', 'Safe transportation'],
                'order': 5,
            },
            {
                'name': 'Compliance Services',
                'icon': 'fas fa-file-alt',
                'description': 'Complete documentation for E-Waste Management Rules compliance, EPR fulfillment, and CSR reporting requirements.',
                'features': ['E-waste certificates', 'EPR compliance support', 'Audit-ready documentation', 'CSR impact reports'],
                'order': 6,
            },
        ]
        for s in services:
            Service.objects.get_or_create(name=s['name'], defaults=s)
        self.stdout.write(f'  [+] {len(services)} services')

    def _seed_process_steps(self):
        steps = [
            {'number': '01', 'title': 'Request & Assessment', 'description': 'Contact us with your requirements. Our team assesses the volume, type of e-waste, and provides a tailored quote.', 'icon': 'fas fa-phone-alt', 'order': 1},
            {'number': '02', 'title': 'Scheduled Collection', 'description': 'Our certified team arrives at your location with proper documentation. All items are inventoried and packed securely.', 'icon': 'fas fa-truck', 'order': 2},
            {'number': '03', 'title': 'Data Destruction', 'description': 'All data-bearing devices undergo secure data sanitization or physical destruction as per your requirements.', 'icon': 'fas fa-shield-alt', 'order': 3},
            {'number': '04', 'title': 'Certified Processing', 'description': 'E-waste is dismantled, segregated, and processed at our government-authorized facilities with zero landfill policy.', 'icon': 'fas fa-recycle', 'order': 4},
            {'number': '05', 'title': 'Documentation', 'description': 'Receive comprehensive compliance certificates, destruction certificates, and sustainability impact reports.', 'icon': 'fas fa-file-alt', 'order': 5},
        ]
        for s in steps:
            ProcessStep.objects.get_or_create(number=s['number'], defaults=s)
        self.stdout.write(f'  [+] {len(steps)} process steps')

    def _seed_advantages(self):
        advantages = [
            {'title': 'Government Certified', 'description': 'Authorized by CPCB and state pollution control boards with all required licenses and permits.', 'icon': 'fas fa-certificate', 'order': 1},
            {'title': '100% Data Security', 'description': 'NIST 800-88 compliant data destruction with video proof and destruction certificates.', 'icon': 'fas fa-lock', 'order': 2},
            {'title': 'Zero Landfill Policy', 'description': 'Every component is responsibly processed. Nothing ends up in landfills or informal sectors.', 'icon': 'fas fa-leaf', 'order': 3},
            {'title': 'Pan-India Coverage', 'description': 'Pickup services available across all major cities with our network of 25+ processing facilities.', 'icon': 'fas fa-truck', 'order': 4},
            {'title': 'Complete Compliance', 'description': 'All documentation for E-Waste Rules 2016, EPR obligations, and CSR requirements provided.', 'icon': 'fas fa-file-invoice', 'order': 5},
        ]
        for a in advantages:
            Advantage.objects.get_or_create(title=a['title'], defaults=a)
        self.stdout.write(f'  [+] {len(advantages)} advantages')

    def _seed_certifications(self):
        certs = [
            {'name': 'ISO 14001:2015', 'icon': 'fas fa-globe-americas', 'order': 1},
            {'name': 'CPCB Authorized', 'icon': 'fas fa-university', 'order': 2},
            {'name': 'R2 Certified', 'icon': 'fas fa-recycle', 'order': 3},
            {'name': 'OHSAS 18001', 'icon': 'fas fa-hard-hat', 'order': 4},
        ]
        for c in certs:
            Certification.objects.get_or_create(name=c['name'], defaults=c)
        self.stdout.write(f'  [+] {len(certs)} certifications')

    def _seed_faqs(self):
        faqs = [
            {'question': 'What types of e-waste do you accept?', 'answer': 'We accept a wide range of electronic waste including computers, laptops, monitors, printers, mobile phones, tablets, servers, networking equipment, batteries, UPS systems, cables, and other electronic devices. Both working and non-working devices are accepted.', 'order': 1},
            {'question': 'Is my data secure during the recycling process?', 'answer': 'Absolutely! Data security is our top priority. We offer NIST-compliant data destruction services including DOD 5220.22-M standard wiping, degaussing, and physical shredding. All data destruction is documented with certificates of destruction and video proof available on request.', 'order': 2},
            {'question': 'Do you provide pickup services?', 'answer': 'Yes! We offer free pickup services for bulk quantities (10+ items). For smaller quantities, a nominal pickup fee applies. We also have drop-off centers across major cities. Pickup can be scheduled online or by calling our toll-free number.', 'order': 3},
            {'question': 'What certifications do you have?', 'answer': 'We are fully certified including: CPCB Authorization, ISO 14001:2015 (Environmental Management), R2 Certification (Responsible Recycling), OHSAS 18001, and state-level SPCB permits for all our processing facilities.', 'order': 4},
            {'question': 'How long does the entire process take?', 'answer': 'Standard pickup is scheduled within 3-5 business days. Express pickup (within 24 hours) is available for an additional fee. Processing and certificate generation typically takes 7-10 business days after collection.', 'order': 5},
            {'question': 'Can I get paid for my e-waste?', 'answer': 'Yes! We offer competitive prices for working and non-working electronics. Use our online pricing calculator for instant estimates. Payment is made via bank transfer or reward points within 7 days of processing.', 'order': 6},
        ]
        for f in faqs:
            FAQ.objects.get_or_create(question=f['question'], defaults=f)
        self.stdout.write(f'  [+] {len(faqs)} FAQs')

    def _seed_testimonials(self):
        testimonials = [
            {'content': 'E-Zero has been our trusted partner for IT asset disposal for over 5 years. Their professionalism, documentation, and commitment to data security is unmatched in the industry.', 'author_name': 'Rajesh Sharma', 'author_role': 'IT Director, Fortune 500 Company', 'author_initials': 'RS', 'rating': 5, 'order': 1},
            {'content': 'The compliance documentation they provide is incredibly thorough. It made our audit process seamless and reduced our compliance overhead by 60%.', 'author_name': 'Priya Mehta', 'author_role': 'Compliance Manager, Banking Sector', 'author_initials': 'PM', 'rating': 5, 'order': 2},
            {'content': 'Their pan-India presence and quick response time helped us manage e-waste across all our 50+ branches efficiently. Outstanding service!', 'author_name': 'Amit Kumar', 'author_role': 'Operations Head, Retail Chain', 'author_initials': 'AK', 'rating': 5, 'order': 3},
        ]
        for t in testimonials:
            Testimonial.objects.get_or_create(author_name=t['author_name'], defaults=t)
        self.stdout.write(f'  [+] {len(testimonials)} testimonials')

    def _seed_accepted_items(self):
        items = [
            {'name': 'Computers & IT', 'icon': 'fas fa-desktop', 'description': 'Desktops, laptops, monitors, CPUs, keyboards, mice, and peripherals.', 'order': 1},
            {'name': 'Mobile Devices', 'icon': 'fas fa-mobile-alt', 'description': 'Smartphones, feature phones, tablets, chargers, power banks, and wearables.', 'order': 2},
            {'name': 'Servers & Networking', 'icon': 'fas fa-server', 'description': 'Rack servers, switches, routers, modems, and data center equipment.', 'order': 3},
            {'name': 'Office Equipment', 'icon': 'fas fa-print', 'description': 'Printers, scanners, photocopiers, shredders, fax machines, and projectors.', 'order': 4},
            {'name': 'Consumer Electronics', 'icon': 'fas fa-tv', 'description': 'LED TVs, home theater systems, cameras, gaming consoles, and speakers.', 'order': 5},
            {'name': 'Batteries & UPS', 'icon': 'fas fa-battery-full', 'description': 'Li-ion batteries, Lead-acid batteries, UPS units, inverters, and power supplies.', 'order': 6},
            {'name': 'Cables & Wires', 'icon': 'fas fa-plug', 'description': 'All types of power cables, data cables, Ethernet, HDMI, chargers, and adapters.', 'order': 7},
            {'name': 'Storage Devices', 'icon': 'fas fa-hdd', 'description': 'Hard drives (HDD), SSDs, USB drives, memory cards, and tape drives.', 'order': 8},
        ]
        for item in items:
            AcceptedItemCategory.objects.get_or_create(name=item['name'], defaults=item)
        self.stdout.write(f'  [+] {len(items)} accepted item categories')

    def _seed_impact_stats(self):
        stats = [
            {'icon': 'fas fa-cloud', 'target_value': 45000, 'unit': 'Tons', 'label': 'CO2 Emissions Prevented', 'equivalent_text': 'Equal to 9,800 cars off road for a year', 'equivalent_icon': 'fas fa-car', 'order': 1},
            {'icon': 'fas fa-tree', 'target_value': 125000, 'unit': 'Trees', 'label': 'Equivalent Trees Saved', 'equivalent_text': 'Covering 250 hectares of forest', 'equivalent_icon': 'fas fa-mountain', 'order': 2},
            {'icon': 'fas fa-trash-alt', 'target_value': 68000, 'unit': 'Tons', 'label': 'Landfill Waste Diverted', 'equivalent_text': 'Saved space for 45+ years', 'equivalent_icon': 'fas fa-dumpster', 'order': 3},
            {'icon': 'fas fa-gem', 'target_value': 8500, 'unit': 'Kg', 'label': 'Precious Metals Recovered', 'equivalent_text': 'Gold, Silver, Copper & more', 'equivalent_icon': 'fas fa-coins', 'order': 4},
        ]
        for s in stats:
            ImpactStat.objects.get_or_create(label=s['label'], defaults=s)
        self.stdout.write(f'  [+] {len(stats)} impact stats')

    def _seed_calculator_items(self):
        items = [
            {'name': 'Laptop', 'slug': 'laptop', 'icon': 'fas fa-laptop', 'price_per_unit': 500, 'unit': 'unit', 'category': 'Computers', 'order': 1},
            {'name': 'Desktop', 'slug': 'desktop', 'icon': 'fas fa-desktop', 'price_per_unit': 400, 'unit': 'unit', 'category': 'Computers', 'order': 2},
            {'name': 'Monitor', 'slug': 'monitor', 'icon': 'fas fa-tv', 'price_per_unit': 200, 'unit': 'unit', 'category': 'Computers', 'order': 3},
            {'name': 'Smartphone', 'slug': 'smartphone', 'icon': 'fas fa-mobile-alt', 'price_per_unit': 150, 'unit': 'unit', 'category': 'Mobile', 'order': 4},
            {'name': 'Printer', 'slug': 'printer', 'icon': 'fas fa-print', 'price_per_unit': 250, 'unit': 'unit', 'category': 'Office', 'order': 5},
            {'name': 'Server', 'slug': 'server', 'icon': 'fas fa-server', 'price_per_unit': 2000, 'unit': 'unit', 'category': 'Enterprise', 'order': 6},
            {'name': 'UPS / Inverter', 'slug': 'ups', 'icon': 'fas fa-car-battery', 'price_per_unit': 300, 'unit': 'unit', 'category': 'Power', 'order': 7},
            {'name': 'Cables (per kg)', 'slug': 'cables', 'icon': 'fas fa-plug', 'price_per_unit': 50, 'unit': 'kg', 'category': 'Accessories', 'order': 8},
            {'name': 'Hard Drive', 'slug': 'hdd', 'icon': 'fas fa-hdd', 'price_per_unit': 100, 'unit': 'unit', 'category': 'Storage', 'order': 9},
            {'name': 'Router / Switch', 'slug': 'router', 'icon': 'fas fa-wifi', 'price_per_unit': 80, 'unit': 'unit', 'category': 'Networking', 'order': 10},
        ]
        for item in items:
            RecyclableItem.objects.get_or_create(slug=item['slug'], defaults=item)

        svc_options = [
            {'name': 'Data Destruction Certificate', 'description': 'NIST-compliant data destruction with video and certificate', 'price': 500, 'order': 1},
            {'name': 'Priority Pickup (24hr)', 'description': 'Express pickup within 24 hours', 'price': 299, 'order': 2},
            {'name': 'On-Site Shredding', 'description': 'Physical destruction of hard drives at your location', 'price': 1000, 'order': 3},
        ]
        for svc in svc_options:
            ServiceOption.objects.get_or_create(name=svc['name'], defaults=svc)
        self.stdout.write(f'  [+] {len(items)} calculator items + {len(svc_options)} service options')

    def _seed_articles(self):
        articles = [
            {
                'title': 'E-Waste Management Rules 2022: Complete Compliance Guide',
                'slug': 'e-waste-management-rules-2022',
                'category': 'regulations',
                'image_url': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
                'summary': 'Understanding the latest amendments to India\'s e-waste regulations and what they mean for businesses and consumers.',
                'content': '<p>The E-Waste Management Rules 2022 represent a significant evolution in India\'s approach to electronic waste management...</p>',
                'read_time': '5 min read',
                'published_date': date(2026, 1, 15),
            },
            {
                'title': 'Why Secure Data Destruction is Critical for Your Business',
                'slug': 'secure-data-destruction-critical',
                'category': 'security',
                'image_url': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
                'summary': 'Learn about the risks of improper data disposal and how to protect your sensitive information during IT asset retirement.',
                'content': '<p>In today\'s digital landscape, data security doesn\'t end when a device is decommissioned...</p>',
                'read_time': '4 min read',
                'published_date': date(2026, 1, 10),
            },
            {
                'title': 'Corporate ESG Goals: Integrating E-Waste Recycling',
                'slug': 'corporate-esg-e-waste-recycling',
                'category': 'sustainability',
                'image_url': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
                'summary': 'How proper e-waste management contributes to your organization\'s sustainability objectives and ESG reporting.',
                'content': '<p>Environmental, Social, and Governance (ESG) reporting has become a critical aspect of corporate responsibility...</p>',
                'read_time': '6 min read',
                'published_date': date(2026, 1, 5),
            },
        ]
        for a in articles:
            Article.objects.get_or_create(slug=a['slug'], defaults=a)
        self.stdout.write(f'  [+] {len(articles)} articles')

    def _seed_centers(self):
        # Try to load from existing JSON file
        json_path = os.path.join(settings.BASE_DIR.parent, 'data', 'centers.json')
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            centers = data if isinstance(data, list) else data.get('centers', [])
            count = 0
            for c in centers:
                Center.objects.get_or_create(
                    name=c.get('name', ''),
                    city=c.get('city', ''),
                    defaults={
                        'latitude': c.get('lat', 0),
                        'longitude': c.get('lng', 0),
                        'address': c.get('address', ''),
                        'accepts': c.get('accepts', []),
                        'verified': c.get('verified', True),
                        'rating': c.get('rating', 4.0),
                        'contact': c.get('contact', ''),
                        'hours': c.get('hours', '9:00 AM - 6:00 PM'),
                        'services': c.get('services', []),
                        'reviews_count': c.get('reviews', 0),
                        'center_type': c.get('type', 'E-Zero'),
                    }
                )
                count += 1
            self.stdout.write(f'  [+] {count} centers (from centers.json)')
        else:
            self.stdout.write(self.style.WARNING('  [!] centers.json not found, skipping centers'))

    def _seed_users(self):
        # Try to load from existing JSON file
        json_path = os.path.join(settings.BASE_DIR.parent, 'data', 'users.json')
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            users = data if isinstance(data, list) else data.get('users', [])
            count = 0
            for u in users:
                name_parts = u.get('name', 'User').split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                username = u.get('email', '').split('@')[0] or f"user_{u.get('id', count)}"

                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'email': u.get('email', ''),
                        'first_name': first_name,
                        'last_name': last_name,
                    }
                )
                if created:
                    user.set_password('EZero@2024')
                    user.save()

                    profile = user.profile
                    profile.phone = u.get('phone', '')
                    profile.wallet_points = u.get('walletPoints', 0)
                    profile.level = u.get('level', 1)
                    profile.achievements = u.get('achievements', [])
                    profile.save()
                    count += 1
            self.stdout.write(f'  [+] {count} users (from users.json)')
        else:
            self.stdout.write(self.style.WARNING('  [!] users.json not found, skipping users'))

        # Always create superuser
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@ezero.in',
                password='EZero@2024',
                first_name='Admin',
                last_name='E-Zero',
            )
            self.stdout.write(self.style.SUCCESS('  [+] Superuser created (admin / EZero@2024)'))
