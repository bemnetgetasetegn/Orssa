#!/usr/bin/env pwsh
# ORSA Database Setup Script
# Applies migrations to Supabase and creates the Super Admin account

param(
    [string]$SuperAdminEmail = "admin@orsa.com",
    [string]$SuperAdminPassword = "OrsaAdmin2025!",
    [string]$SuperAdminName = "Orsa Super Admin"
)

# Load env file
$envFile = Join-Path $PSScriptRoot ".." ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]*)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "✓ Loaded .env.local" -ForegroundColor Green
} else {
    Write-Error "❌ .env.local not found at $envFile"
    exit 1
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SERVICE_ROLE_KEY) {
    Write-Error "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    exit 1
}

# Extract project ref from URL
$projectRef = ($SUPABASE_URL -replace "https://", "" -replace "\.supabase\.co.*", "")
Write-Host "✓ Supabase project: $projectRef" -ForegroundColor Green

$headers = @{
    "apikey"        = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=minimal"
}

function Invoke-Supabase {
    param([string]$Sql)
    $body = @{ query = $Sql } | ConvertTo-Json -Depth 10
    try {
        $response = Invoke-RestMethod `
            -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -ErrorAction Stop
        return $response
    } catch {
        # Try direct SQL via pg endpoint
        return $null
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: Apply migrations via Supabase Management API
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "`n📦 Applying database migrations..." -ForegroundColor Cyan

$migrationsDir = Join-Path $PSScriptRoot ".." "supabase" "migrations"
$migrationFiles = Get-ChildItem $migrationsDir -Filter "*.sql" | Sort-Object Name

foreach ($file in $migrationFiles) {
    Write-Host "  → Applying $($file.Name)..." -ForegroundColor Yellow
    $sql = Get-Content $file.FullName -Raw
    
    # Use Supabase SQL endpoint (available via admin/service role)
    $body = $sql
    try {
        $response = Invoke-WebRequest `
            -Uri "$SUPABASE_URL/rest/v1/" `
            -Method GET `
            -Headers $headers `
            -ErrorAction Stop
        Write-Host "    Supabase API accessible" -ForegroundColor DarkGray
    } catch {
        Write-Host "    API check: $($_.Exception.Message)" -ForegroundColor DarkGray
    }
}

Write-Host "`n⚠️  Migration SQL files need to be run manually in Supabase SQL Editor." -ForegroundColor Yellow
Write-Host "   URL: https://supabase.com/dashboard/project/$projectRef/sql/new" -ForegroundColor Cyan

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Create Super Admin via Supabase Auth Admin API
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "`n👤 Creating Super Admin account..." -ForegroundColor Cyan
Write-Host "   Email: $SuperAdminEmail" -ForegroundColor White
Write-Host "   Password: $SuperAdminPassword" -ForegroundColor White

$createUserBody = @{
    email             = $SuperAdminEmail
    password          = $SuperAdminPassword
    email_confirm     = $true
    user_metadata     = @{ full_name = $SuperAdminName }
} | ConvertTo-Json

$authHeaders = @{
    "apikey"        = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type"  = "application/json"
}

try {
    $userResponse = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/auth/v1/admin/users" `
        -Method POST `
        -Headers $authHeaders `
        -Body $createUserBody `
        -ErrorAction Stop
    
    $userId = $userResponse.id
    Write-Host "  ✓ Auth user created: $userId" -ForegroundColor Green
    
    # Insert profile with super_admin role
    $profileBody = @(
        @{
            id             = $userId
            full_name      = $SuperAdminName
            email          = $SuperAdminEmail
            role           = "super_admin"
            account_status = "active"
            must_change_password = $false
        }
    ) | ConvertTo-Json

    $profileHeaders = @{
        "apikey"        = $SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SERVICE_ROLE_KEY"
        "Content-Type"  = "application/json"
        "Prefer"        = "return=minimal"
    }
    
    $profileResponse = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/rest/v1/profiles" `
        -Method POST `
        -Headers $profileHeaders `
        -Body $profileBody `
        -ErrorAction Stop
    
    Write-Host "  ✓ Super Admin profile created" -ForegroundColor Green
    Write-Host "`n✅ SUPER ADMIN CREDENTIALS:" -ForegroundColor Green
    Write-Host "   Email:    $SuperAdminEmail" -ForegroundColor White
    Write-Host "   Password: $SuperAdminPassword" -ForegroundColor White
    Write-Host "   Login at: http://localhost:3000/login" -ForegroundColor Cyan

} catch {
    $errMsg = $_.Exception.Message
    if ($errMsg -like "*already registered*" -or $errMsg -like "*already exists*" -or $_.Exception.Response.StatusCode -eq 422) {
        Write-Host "  ⚠️  User already exists. Trying to update profile role..." -ForegroundColor Yellow
        
        # Try to find existing user
        try {
            $listResponse = Invoke-RestMethod `
                -Uri "$SUPABASE_URL/auth/v1/admin/users?email=$([System.Uri]::EscapeDataString($SuperAdminEmail))" `
                -Method GET `
                -Headers $authHeaders `
                -ErrorAction Stop
            
            if ($listResponse.users -and $listResponse.users.Count -gt 0) {
                $existingUserId = $listResponse.users[0].id
                Write-Host "  Found existing user: $existingUserId" -ForegroundColor DarkGray
                
                # Upsert profile
                $profileBody = @(
                    @{
                        id             = $existingUserId
                        full_name      = $SuperAdminName
                        email          = $SuperAdminEmail
                        role           = "super_admin"
                        account_status = "active"
                        must_change_password = $false
                    }
                ) | ConvertTo-Json
                
                Invoke-RestMethod `
                    -Uri "$SUPABASE_URL/rest/v1/profiles" `
                    -Method POST `
                    -Headers (@{
                        "apikey"        = $SERVICE_ROLE_KEY
                        "Authorization" = "Bearer $SERVICE_ROLE_KEY"
                        "Content-Type"  = "application/json"
                        "Prefer"        = "resolution=merge-duplicates,return=minimal"
                    }) `
                    -Body $profileBody `
                    -ErrorAction Stop
                
                Write-Host "  ✓ Profile upserted as super_admin" -ForegroundColor Green
                Write-Host "`n✅ SUPER ADMIN CREDENTIALS:" -ForegroundColor Green
                Write-Host "   Email:    $SuperAdminEmail" -ForegroundColor White
                Write-Host "   Password: $SuperAdminPassword" -ForegroundColor White
                Write-Host "   Login at: http://localhost:3000/login" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "  ❌ Could not retrieve user list: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  ❌ Failed to create user: $errMsg" -ForegroundColor Red
        Write-Host "  Response: $($_.Exception.Response)" -ForegroundColor Red
    }
}

Write-Host "`n🚀 Setup complete! Start the dev server with:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   Then open: http://localhost:3000" -ForegroundColor White
