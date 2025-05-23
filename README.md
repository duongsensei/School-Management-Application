# School Management System

Hệ thống quản lý trường học được xây dựng với ASP.NET Core 8.0 Web API và Angular 17.

## 📋 Mô tả dự án

Đây là một hệ thống quản lý trường học toàn diện bao gồm:
- Quản lý học sinh, giáo viên và nhân viên
- Quản lý lớp học và khóa học
- Hệ thống điểm danh
- Quản lý điểm số và báo cáo
- Hệ thống xác thực và phân quyền với JWT
- Giao diện người dùng hiện đại với Angular Material và Syncfusion

## 🏗️ Kiến trúc hệ thống

### Backend (.NET 8.0)
- **SchoolApiService**: ASP.NET Core Web API
- **SchoolApp.DAL**: Data Access Layer với Entity Framework Core
- **SchoolApp.Models**: Domain Models và Entity classes

### Frontend (Angular 17)
- **SchoolAppClient.NG**: Angular application với Material Design

### Database
- SQL Server LocalDB
- Entity Framework Core với Code First approach

## 🛠️ Yêu cầu hệ thống

### Phần mềm cần thiết:
1. **Visual Studio 2022** (Community Edition trở lên) hoặc **Visual Studio Code**
2. **.NET 8.0 SDK** - [Tải về](https://dotnet.microsoft.com/download/dotnet/8.0)
3. **Node.js** (phiên bản 18.x trở lên) - [Tải về](https://nodejs.org/)
4. **Angular CLI** phiên bản 17
5. **SQL Server LocalDB** (thường đi kèm với Visual Studio)
6. **Git** - [Tải về](https://git-scm.com/)

### Kiểm tra phiên bản:
```bash
# Kiểm tra .NET SDK
dotnet --version

# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra Angular CLI
ng version
```

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone dự án
```bash
git clone https://github.com/blanatole/School-Management-Application.git
cd SchoolManagementSystem
```

### Bước 2: Cài đặt Backend

#### 2.1. Restore các package NuGet
```bash
# Tại thư mục gốc của solution
dotnet restore
```

#### 2.2. Cài đặt Entity Framework CLI (nếu chưa có)
```bash
dotnet tool install --global dotnet-ef
```

#### 2.3. Cập nhật database
```bash
# Di chuyển đến thư mục SchoolApiService
cd SchoolApiService

# Tạo/cập nhật database
dotnet ef database update --project ../SchoolApp.DAL
```

### Bước 3: Cài đặt Frontend

#### 3.1. Di chuyển đến thư mục Angular
```bash
cd SchoolAppClient.NG
```

#### 3.2. Cài đặt Angular CLI (nếu chưa có)
```bash
npm install -g @angular/cli@17
```

#### 3.3. Cài đặt các dependencies
```bash
npm install
```

## 🏃‍♂️ Cách chạy ứng dụng

### Phương pháp 1: Chạy từ Visual Studio

#### Backend:
1. Mở file `SchoolManagementSystem.sln` trong Visual Studio
2. Set `SchoolApiService` làm startup project
3. Nhấn `F5` hoặc click `Start Debugging`
4. API sẽ chạy tại: `https://localhost:7125` hoặc `http://localhost:5125`

#### Frontend:
1. Mở Terminal trong Visual Studio hoặc Command Prompt
2. Di chuyển đến thư mục `SchoolAppClient.NG`
3. Chạy lệnh:
```bash
npm start
```
4. Angular app sẽ chạy tại: `http://127.0.0.1:4200`

### Phương pháp 2: Chạy từ Command Line

#### Backend:
```bash
# Tại thư mục SchoolApiService
cd SchoolApiService
dotnet run
```

#### Frontend:
```bash
# Tại thư mục SchoolAppClient.NG
cd SchoolAppClient.NG
npm start
```

### Phương pháp 3: Chạy toàn bộ solution

#### Với Visual Studio:
1. Right-click vào Solution trong Solution Explorer
2. Chọn "Properties"
3. Chọn "Multiple startup projects"
4. Set cả `SchoolApiService` và `SchoolAppClient.NG` thành "Start"
5. Nhấn `F5`

## 🗄️ Cấu hình Database

### Connection Strings có sẵn trong appsettings.json:

1. **LocalDbConnection**: Sử dụng SQL Server LocalDB (mặc định)
2. **SqlServerConnection**: Sử dụng SQL Server Express
3. **PortableLocalDb**: Sử dụng file database di động

### Thay đổi connection string:
1. Mở file `SchoolApiService/appsettings.json`
2. Sửa đổi connection string phù hợp với môi trường của bạn
3. Cập nhật lại database:
```bash
dotnet ef database update --project ../SchoolApp.DAL
```

## 🔐 Xác thực và phân quyền

Hệ thống sử dụng JWT Token cho authentication:
- **JWT Issuer**: IDB
- **JWT Audience**: DITC
- Token có thời hạn và cần refresh khi hết hạn

## 📝 API Documentation

Khi chạy backend, bạn có thể truy cập Swagger UI tại:
- `https://localhost:7125/swagger` (HTTPS)
- `http://localhost:5125/swagger` (HTTP)

## 🎨 Frontend Features

- **Angular Material Design**: Giao diện hiện đại và responsive
- **Syncfusion Components**: Datagrid, charts, và các component nâng cao
- **FontAwesome Icons**: Bộ icon phong phú
- **Bootstrap 5**: Framework CSS responsive

## 📁 Cấu trúc thư mục

```
SchoolManagementSystem/
├── SchoolApiService/              # ASP.NET Core Web API
│   ├── Controllers/               # API Controllers
│   ├── Services/                  # Business Logic Services
│   ├── ViewModels/               # DTOs và ViewModels
│   ├── Reports/                  # Report templates
│   └── wwwroot/                  # Static files
├── SchoolApp.DAL/                # Data Access Layer
│   ├── SchoolContext/            # DbContext và configurations
│   ├── Migrations/               # EF Core migrations
│   └── SecurityModels/           # Identity models
├── SchoolApp.Models/             # Domain Models
├── SchoolAppClient.NG/           # Angular Frontend
│   ├── src/
│   │   ├── app/                  # Angular components
│   │   ├── assets/               # Static assets
│   │   └── environments/         # Environment configs
│   └── package.json              # Node.js dependencies
└── README.md                     # File hướng dẫn này
```

## 🐛 Xử lý sự cố thường gặp

### 1. Lỗi Database Connection
```bash
# Kiểm tra SQL Server LocalDB service
sqllocaldb info

# Start LocalDB nếu cần
sqllocaldb start MSSQLLocalDB
```

### 2. Lỗi khi restore NuGet packages
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore lại
dotnet restore
```

### 3. Lỗi Angular dependencies
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài đặt lại
npm install
```

### 4. Lỗi CORS khi gọi API từ Frontend
- Kiểm tra cấu hình CORS trong `Program.cs`
- Đảm bảo frontend chạy đúng port được cấu hình

### 5. Lỗi SSL Certificate
```bash
# Trust HTTPS development certificate
dotnet dev-certs https --trust
```

## 📊 Các tính năng chính

### Quản lý học sinh:
- Thêm, sửa, xóa thông tin học sinh
- Tìm kiếm và lọc học sinh
- Quản lý ảnh đại diện
- Báo cáo học sinh

### Quản lý giáo viên:
- Quản lý thông tin cá nhân giáo viên
- Phân công giảng dạy
- Lịch làm việc

### Quản lý lớp học:
- Tạo và quản lý lớp học
- Phân bổ học sinh vào lớp
- Thời khóa biểu

### Hệ thống báo cáo:
- Báo cáo điểm số
- Báo cáo điểm danh
- Export PDF với FastReport


