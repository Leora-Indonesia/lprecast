#!/bin/bash

# LPrecast Deployment Script
# Deploys Supabase Edge Functions and Database Migrations

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  LPrecast Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check if logged in
echo -e "\n${YELLOW}Checking Supabase authentication...${NC}"
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}Please login to Supabase CLI:${NC}"
    supabase login
fi

# Link project
echo -e "\n${YELLOW}Linking to Supabase project...${NC}"
supabase link --project-ref mgjtlmuqsgkhiopwzeni

# Push migrations
echo -e "\n${YELLOW}Pushing database migrations...${NC}"
supabase db push

# Deploy Edge Functions
echo -e "\n${YELLOW}Deploying Edge Functions...${NC}"
cd supabase/functions/send-email
supabase functions deploy send-email
cd ../../..

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Set SMTP secrets in Supabase:"
echo "   supabase secrets set SMTP_HOST=mail.yourdomain.com"
echo "   supabase secrets set SMTP_PORT=587"
echo "   supabase secrets set SMTP_USER=noreply@yourdomain.com"
echo "   supabase secrets set SMTP_PASS=your_password"
echo "   supabase secrets set SMTP_FROM=noreply@yourdomain.com"
echo "   supabase secrets set SMTP_FROM_NAME=LPrecast"
echo "   supabase secrets set SMTP_REPLY_TO=support@yourdomain.com"
echo ""
echo "2. Test the email function:"
echo "   supabase functions serve send-email --local"
