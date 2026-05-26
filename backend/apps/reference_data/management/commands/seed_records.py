import random
import uuid
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.tenants.models import Tenant
from apps.normalization.models import NormalizedRecord, RawRecord
from apps.ingestion.models import SourceSystem, IngestionJob
from apps.reference_data.models import EmissionFactor

class Command(BaseCommand):
    help = 'Seeds the database with mock NormalizedRecords for testing dashboards and reports.'

    def handle(self, *args, **kwargs):
        tenants = Tenant.objects.all()
        if not tenants.exists():
            self.stdout.write(self.style.ERROR('No tenants found. Please run seed_users first.'))
            return

        for tenant in tenants:
            self.stdout.write(f"Seeding records for tenant: {tenant.name}...")
            
            # Fetch available source systems
            sources = list(SourceSystem.objects.filter(tenant=tenant))
            if not sources:
                self.stdout.write(self.style.WARNING(f"No source systems found for {tenant.name}. Skipping."))
                continue

            # Fetch emission factors
            efs = list(EmissionFactor.objects.all())
            ef_ids = [str(ef.id) for ef in efs] if efs else ["EF_TEST_01", "EF_TEST_02"]

            # Generate 150 random records spread across the last 12 months
            now = timezone.now()
            records_created = 0
            
            scopes = ['scope_1', 'scope_2', 'scope_3']
            statuses = [
                NormalizedRecord.Status.PENDING_REVIEW,
                NormalizedRecord.Status.APPROVED,
                NormalizedRecord.Status.APPROVED,
                NormalizedRecord.Status.APPROVED,
                NormalizedRecord.Status.SUSPICIOUS,
                NormalizedRecord.Status.FAILED
            ]
            activities = ["Electricity", "Natural Gas", "Fleet Fuel", "Business Travel", "Waste", "Water"]
            
            # Create a mock job
            job = IngestionJob.objects.create(
                tenant=tenant,
                source_system=sources[0],
                file_name="mock_seed_data.csv",
                status=IngestionJob.Status.COMPLETED
            )
            
            for i in range(150):
                # Random date within the last 365 days
                days_ago = random.randint(0, 365)
                activity_date = (now - timedelta(days=days_ago)).date()
                
                amount = round(random.uniform(10.0, 5000.0), 2)
                normalized_amount = round(amount * random.uniform(0.5, 2.5), 2)
                status = random.choice(statuses)
                source = random.choice(sources)
                
                errors = []
                if status == NormalizedRecord.Status.FAILED:
                    errors = [{"field": "unit", "message": "Unknown unit 'gallon'"}]
                
                raw_record = RawRecord.objects.create(
                    ingestion_job=job,
                    raw_payload={"mock": "data", "amount": float(amount), "date": str(activity_date)},
                    raw_payload_hash=str(uuid.uuid4())
                )

                NormalizedRecord.objects.create(
                    tenant=tenant,
                    source_system=source,
                    raw_record=raw_record,
                    activity_type=random.choice(activities),
                    activity_date=activity_date,
                    amount=amount,
                    unit="kWh",
                    normalized_amount=normalized_amount,
                    normalized_unit="kgCO2e",
                    emission_category=random.choice(activities),
                    scope=random.choice(scopes),
                    emission_factor_id=random.choice(ef_ids),
                    suspicious_flag=(status == NormalizedRecord.Status.SUSPICIOUS),
                    validation_errors=errors,
                    status=status,
                    approval_status=status if status in [NormalizedRecord.Status.APPROVED, NormalizedRecord.Status.REJECTED] else NormalizedRecord.Status.PENDING_REVIEW,
                    edit_source=NormalizedRecord.EditSource.INGESTION
                )
                records_created += 1

            self.stdout.write(self.style.SUCCESS(f'Successfully seeded {records_created} records for {tenant.name}.'))

        self.stdout.write(self.style.SUCCESS('Finished seeding records for all tenants!'))
