#!/bin/bash
# ============================================
# STEP 4: Export/Import Master Data (CSV)
# ============================================
# Script untuk export master_provinces dan master_cities
# dari database ERP dan import ke database LPrecast baru
#
# Usage:
#   1. Set environment variables atau edit connection strings
#   2. Run: bash supabase/migrations/export_import_master_data.sh
#
# Prerequisites:
#   - PostgreSQL client (psql) installed
#   - Access ke kedua database Supabase
# ============================================

# Configuration - EDIT INI SESUAI KEBUTUHAN
# ============================================

# Database ERP (lama) - connection string
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
OLD_DB_URL="${OLD_DB_URL}"

# Database LPrecast (baru) - connection string
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEW_DB_URL="${NEW_DB_URL}"

# Temp directory untuk CSV files
TEMP_DIR="supabase/migrations/temp"
mkdir -p "$TEMP_DIR"

# ============================================
# CHECK PREREQUISITES
# ============================================

echo "============================================"
echo "STEP 4: Export/Import Master Data"
echo "============================================"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql is not installed"
    echo "Install PostgreSQL client:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt install postgresql-client"
    exit 1
fi

# Check if connection strings are set
if [ -z "$OLD_DB_URL" ]; then
    echo "ERROR: OLD_DB_URL is not set"
    echo "Set it with: export OLD_DB_URL='postgresql://...'"
    exit 1
fi

if [ -z "$NEW_DB_URL" ]; then
    echo "ERROR: NEW_DB_URL is not set"
    echo "Set it with: export NEW_DB_URL='postgresql://...'"
    exit 1
fi

# ============================================
# EXPORT FROM OLD DATABASE (ERP)
# ============================================

echo ""
echo "Step 4.1: Exporting master_provinces from ERP..."
psql "$OLD_DB_URL" -c "\COPY (SELECT id, code, name, created_at FROM backup_master_provinces) TO STDOUT WITH CSV HEADER" > "$TEMP_DIR/master_provinces.csv"
if [ $? -eq 0 ]; then
    PROV_COUNT=$(wc -l < "$TEMP_DIR/master_provinces.csv")
    echo "  ✓ Exported $((PROV_COUNT-1)) provinces"
else
    echo "  ✗ Failed to export master_provinces"
    exit 1
fi

echo ""
echo "Step 4.2: Exporting master_cities from ERP..."
psql "$OLD_DB_URL" -c "\COPY (SELECT id, code, name, province_id, type, created_at FROM backup_master_cities) TO STDOUT WITH CSV HEADER" > "$TEMP_DIR/master_cities.csv"
if [ $? -eq 0 ]; then
    CITY_COUNT=$(wc -l < "$TEMP_DIR/master_cities.csv")
    echo "  ✓ Exported $((CITY_COUNT-1)) cities"
else
    echo "  ✗ Failed to export master_cities"
    exit 1
fi

# ============================================
# IMPORT TO NEW DATABASE (LPrecast)
# ============================================

echo ""
echo "Step 4.3: Importing master_provinces to LPrecast..."
psql "$NEW_DB_URL" -c "\COPY master_provinces(id, code, name, created_at) FROM STDIN WITH CSV HEADER" < "$TEMP_DIR/master_provinces.csv"
if [ $? -eq 0 ]; then
    echo "  ✓ Imported provinces"
else
    echo "  ✗ Failed to import master_provinces"
    echo "  Make sure the schema (003_lprecast_schema.sql) has been run first!"
    exit 1
fi

echo ""
echo "Step 4.4: Importing master_cities to LPrecast..."
psql "$NEW_DB_URL" -c "\COPY master_cities(id, code, name, province_id, type, created_at) FROM STDIN WITH CSV HEADER" < "$TEMP_DIR/master_cities.csv"
if [ $? -eq 0 ]; then
    echo "  ✓ Imported cities"
else
    echo "  ✗ Failed to import master_cities"
    exit 1
fi

# ============================================
# VERIFICATION
# ============================================

echo ""
echo "Step 4.5: Verification..."

echo "  Checking master_provinces count:"
psql "$NEW_DB_URL" -t -c "SELECT COUNT(*) FROM master_provinces;" | xargs

echo "  Checking master_cities count:"
psql "$NEW_DB_URL" -t -c "SELECT COUNT(*) FROM master_cities;" | xargs

echo "  Sample provinces:"
psql "$NEW_DB_URL" -c "SELECT code, name FROM master_provinces LIMIT 5;"

# ============================================
# CLEANUP
# ============================================

echo ""
echo "Cleaning up temp files..."
rm -rf "$TEMP_DIR"

echo ""
echo "============================================"
echo "✓ Master data migration completed!"
echo "============================================"
