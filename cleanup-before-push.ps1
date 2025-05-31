# Script dọn dẹp project trước khi push lên GitHub
# Chạy script này sau khi đóng Visual Studio

Write-Host "=== Dọn dẹp project School Management System ===" -ForegroundColor Green

# 1. Xóa thư mục .vs (Visual Studio cache)
if (Test-Path ".vs") {
    Write-Host "Đang xóa thư mục .vs..." -ForegroundColor Yellow
    try {
        Remove-Item ".vs" -Recurse -Force -ErrorAction Stop
        Write-Host "✓ Đã xóa thư mục .vs" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠ Không thể xóa thư mục .vs (có thể Visual Studio đang chạy)" -ForegroundColor Red
        Write-Host "Vui lòng đóng Visual Studio và chạy lại script" -ForegroundColor Red
    }
}

# 2. Xóa các file database (nếu có)
$dbFiles = @("SchoolApp.DAL/Database/SchoolSystemDb.mdf", "SchoolApp.DAL/Database/SchoolSystemDb_log.ldf")
foreach ($file in $dbFiles) {
    if (Test-Path $file) {
        Write-Host "Đang xóa file database: $file..." -ForegroundColor Yellow
        Remove-Item $file -Force
        Write-Host "✓ Đã xóa $file" -ForegroundColor Green
    }
}

# 3. Xóa các file bin và obj trong toàn bộ project
Write-Host "Đang xóa thư mục bin và obj..." -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Directory -Name "bin","obj" | ForEach-Object {
    $path = Join-Path -Path . -ChildPath $_
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
        Write-Host "✓ Đã xóa $path" -ForegroundColor Green
    }
}

# 4. Xóa node_modules (nếu có)
if (Test-Path "SchoolAppClient.NG/node_modules") {
    Write-Host "Đang xóa node_modules..." -ForegroundColor Yellow
    Remove-Item "SchoolAppClient.NG/node_modules" -Recurse -Force
    Write-Host "✓ Đã xóa node_modules" -ForegroundColor Green
}

# 5. Xóa các file log khác
Write-Host "Tìm kiếm và xóa các file log..." -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Include "*.log" | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "✓ Đã xóa $($_.FullName)" -ForegroundColor Green
}

# 6. Hiển thị thống kê
Write-Host "`n=== Thống kê project ===" -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Số file thay đổi: $($gitStatus.Count)" -ForegroundColor Yellow
} else {
    Write-Host "Không có file nào thay đổi" -ForegroundColor Green
}

# 7. Kiểm tra kích thước project
$totalSize = (Get-ChildItem -Path . -Recurse -File | Measure-Object -Property Length -Sum).Sum
$sizeInMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "Kích thước project: $sizeInMB MB" -ForegroundColor Cyan

Write-Host "`n=== Hoàn thành dọn dẹp ===" -ForegroundColor Green
Write-Host "Project đã sẵn sàng để push lên GitHub!" -ForegroundColor Green
Write-Host "`nCác bước tiếp theo:" -ForegroundColor Cyan
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Clean up project and prepare for production'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White 