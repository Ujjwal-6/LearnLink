#!/bin/bash

# Django Backend Run Script
cd "$(dirname "$0")"
source venv/bin/activate
python manage.py runserver 5001
