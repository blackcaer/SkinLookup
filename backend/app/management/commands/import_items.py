import json
import os
from django.core.management.base import BaseCommand
from app.models import Item
from datetime import datetime


class Command(BaseCommand):
    help = 'Import items from a JSON file'

    def add_arguments(self, parser):
        # Dodanie argumentu dla ścieżki do pliku
        parser.add_argument(
            '--file',
            type=str,
            help='Path to the JSON file containing item data',
            required=True,
        )

    def handle(self, *args, **options):
        file_path = options['file']

        # Sprawdzenie, czy plik istnieje
        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                items_imported = 0

                for entry in data:
                    try:
                        time_accepted = datetime.strptime(entry['timeAccepted'], '%d/%m/%Y').date()
                    except ValueError:
                        self.stderr.write(self.style.ERROR(f"Invalid date format for {entry['name']}"))
                        continue

                    item_data = {
                        'nameId': entry['nameId'],
                        'appId': entry['appId'],
                        'itemType': entry['itemType'],
                        'itemCollection': entry['itemCollection'],
                        'name': entry['name'],
                        'previewUrl': entry['previewUrl'],
                        'supplyTotalEstimated': entry['supplyTotalEstimated'],
                        'timeAccepted': time_accepted,  # Używamy przekształconej daty
                        'storePrice': entry['storePrice']
                    }

                    # Użycie update_or_create, aby zaktualizować istniejący obiekt lub utworzyć nowy
                    item, created = Item.objects.update_or_create(
                        nameId=entry['nameId'],  # Warunek szukania istniejącego obiektu
                        defaults=item_data  # Dane do aktualizacji lub utworzenia
                    )

                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Created new item: {item.name}'))
                    else:
                        self.stdout.write(self.style.SUCCESS(f'Updated item: {item.name}'))

                    items_imported += 1

                self.stdout.write(self.style.SUCCESS(f'Successfully imported {items_imported} items from {file_path}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error: {e}'))
