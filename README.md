# School Management System

Hệ thống quản lý trường học toàn diện được xây dựng với ASP.NET Core 8.0 Web API và Angular 17, sử dụng Entity Framework Core và SQL Server.

## 📋 Tổng quan dự án

### Tính năng chính
- 🎓 **Quản lý học sinh**: Thông tin cá nhân, lịch sử học tập, điểm số
- 👨‍🏫 **Quản lý giáo viên**: Hồ sơ, phân công giảng dạy, lương
- 📚 **Quản lý khóa học**: Môn học, lớp học, thời khóa biểu
- ✅ **Điểm danh**: Theo dõi tình hình đi học của học sinh
- 📊 **Báo cáo và thống kê**: Báo cáo học tập, tài chính
- 🔐 **Xác thực và phân quyền**: JWT Authentication với vai trò người dùng
- 💰 **Quản lý học phí**: Theo dõi thu chi, thông báo
- 📅 **Lịch thi**: Quản lý kỳ thi và kết quả

### Kiến trúc hệ thống
```
📦 SchoolManagementSystem
├── 🌐 SchoolApiService (ASP.NET Core 8.0 Web API)
├── 🗄️ SchoolApp.DAL (Data Access Layer - Entity Framework Core)
├── 📋 SchoolApp.Models (Domain Models)
└── 🎨 SchoolAppClient.NG (Angular 17 Frontend)
```

## 🔧 Yêu cầu hệ thống

### Phần mềm bắt buộc
1. **Visual Studio 2022** (Community, Professional hoặc Enterprise)
   - Workload: ASP.NET and web development
   - Workload: .NET desktop development
2. **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
3. **Node.js 18.x** hoặc cao hơn - [Download](https://nodejs.org/)
4. **SQL Server LocalDB** (đi kèm với Visual Studio)
5. **Git** - [Download](https://git-scm.com/)

### Kiểm tra cài đặt
Mở **Developer PowerShell** trong Visual Studio và chạy:
```powershell
# Kiểm tra .NET SDK
dotnet --version

# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra Git
git --version
```

## 🚀 Hướng dẫn cài đặt từ đầu

### Bước 1: Clone dự án từ GitHub
```powershell
# Mở Git Bash hoặc Command Prompt
git clone https://github.com/blanatole/School-Management-Application.git
cd SchoolManagementSystem
```

### Bước 2: Mở dự án trong Visual Studio

1. **Khởi động Visual Studio 2022**
2. Chọn **"Open a project or solution"**
3. Duyệt đến thư mục dự án và chọn file `SchoolManagementSystem.sln`
4. Nhấn **Open**

### Bước 3: Cấu hình Solution trong Visual Studio

#### 3.1 Kiểm tra Solution Explorer
Đảm bảo bạn thấy các project sau:
- 📁 **SchoolApiService** (ASP.NET Core Web API)
- 📁 **SchoolApp.DAL** (Class Library)
- 📁 **SchoolApp.Models** (Class Library)
- 📁 **SchoolAppClient.NG** (Angular Project)

#### 3.2 Restore NuGet Packages
1. **Right-click** vào Solution trong Solution Explorer
2. Chọn **"Restore NuGet Packages"**
3. Đợi quá trình hoàn tất (check Output window)

### Bước 4: Cấu hình Database

#### 4.1 Kiểm tra Connection String
1. Mở file `SchoolApiService/appsettings.json`
2. Kiểm tra connection string (mặc định sử dụng LocalDB):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SchoolManagementDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

#### 4.2 Cài đặt Entity Framework Tools
1. Mở **Package Manager Console** (View → Other Windows → Package Manager Console)
2. Chạy lệnh:
```powershell
dotnet tool install --global dotnet-ef
```

#### 4.3 Tạo Database
1. Trong **Package Manager Console**, đảm bảo **Default project** là `SchoolApp.DAL`
2. Chạy lệnh để tạo database:
```powershell
Update-Database
```

### Bước 5: Cấu hình Angular Frontend

#### 5.1 Mở Terminal trong Visual Studio
1. **Right-click** vào project `SchoolAppClient.NG`
2. Chọn **"Open in Terminal"**

#### 5.2 Cài đặt Angular CLI
```powershell
npm install -g @angular/cli@17
```

#### 5.3 Cài đặt Dependencies
```powershell
# Trong thư mục SchoolAppClient.NG
npm install
```

### Bước 6: Cấu hình Startup Projects

#### 6.1 Thiết lập Multiple Startup Projects
1. **Right-click** vào Solution trong Solution Explorer
2. Chọn **"Properties"**
3. Trong **Common Properties → Startup Project**
4. Chọn **"Multiple startup projects"**
5. Cấu hình như sau:
   - `SchoolApiService`: **Start**
   - `SchoolAppClient.NG`: **Start**
   - Các project khác: **None**
6. Nhấn **OK**

## 🏃‍♂️ Chạy ứng dụng

### Phương pháp 1: Chạy cả Backend và Frontend cùng lúc

1. Nhấn **F5** hoặc click **Start Debugging** trong Visual Studio
2. Visual Studio sẽ tự động:
   - Khởi động API Server tại `https://localhost:7125`
   - Khởi động Angular dev server tại `http://localhost:4200`
3. Trình duyệt sẽ tự động mở Angular application

### Phương pháp 2: Chạy riêng từng phần

#### Chạy Backend (API)
1. **Right-click** vào `SchoolApiService`
2. Chọn **"Set as Startup Project"**
3. Nhấn **F5**
4. API sẽ chạy tại `https://localhost:7125`
5. Swagger UI sẽ mở tại `https://localhost:7125/swagger`

#### Chạy Frontend (Angular)
1. **Right-click** vào `SchoolAppClient.NG`
2. Chọn **"Open in Terminal"**
3. Chạy lệnh:
```powershell
npm start
```
4. Angular app sẽ chạy tại `http://localhost:4200`

## 🔗 URLs quan trọng

- **Frontend**: http://localhost:4200
- **Backend API**: https://localhost:7125
- **Swagger Documentation**: https://localhost:7125/swagger
- **API Health Check**: https://localhost:7125/health

## 🗄️ Quản lý Database

### Xem Database trong Visual Studio
1. Mở **View → SQL Server Object Explorer**
2. Expand **(localdb)\MSSQLLocalDB**
3. Tìm database **SchoolManagementDB**

### Migrations và Schema Updates
```powershell
# Tạo migration mới
Add-Migration "TenMigration" -Project SchoolApp.DAL

# Áp dụng migration
Update-Database -Project SchoolApp.DAL

# Rollback migration
Update-Database "TenMigrationTruoc" -Project SchoolApp.DAL
```

### Reset Database hoàn toàn
```powershell
# Xóa database hiện tại
Drop-Database -Project SchoolApp.DAL

# Tạo lại từ đầu
Update-Database -Project SchoolApp.DAL
```

## 🛠️ Debugging và Development

### Debug Backend
1. Đặt breakpoint trong Controller hoặc Service
2. Nhấn **F5** để chạy với debugging
3. Gọi API từ frontend hoặc Swagger để trigger breakpoint

### Debug Frontend
1. Mở **Developer Tools** trong browser (F12)
2. Sử dụng **Sources tab** để debug TypeScript
3. Hoặc debug trực tiếp trong Visual Studio Code

### Live Reload
- **Backend**: Tự động reload khi save file .cs
- **Frontend**: Tự động reload khi save file .ts, .html, .css

## 📦 Quản lý Dependencies

### Backend Dependencies (NuGet)
- Microsoft.EntityFrameworkCore
- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools

### Frontend Dependencies (npm)
- @angular/core ^17.0.0
- @angular/material
- @syncfusion/ej2-angular-grids
- bootstrap
- font-awesome

### Cập nhật Dependencies
```powershell
# Backend - trong Package Manager Console
Update-Package

# Frontend - trong terminal
npm update
```

## 🔧 Troubleshooting

### Lỗi thường gặp và cách khắc phục

#### "Cannot connect to database"
```powershell
# Kiểm tra SQL Server LocalDB
sqllocaldb info
sqllocaldb start mssqllocaldb
```

#### "Port already in use"
1. Thay đổi port trong `launchSettings.json`
2. Hoặc kill process đang sử dụng port:
```powershell
netstat -ano | findstr :7125
taskkill /PID [PID_NUMBER] /F
```

#### "Node modules not found"
```powershell
cd SchoolAppClient.NG
rm -rf node_modules
npm install
```

#### "Migration pending"
```powershell
Update-Database -Project SchoolApp.DAL
```

## 📁 Cấu trúc Project chi tiết

```
SchoolManagementSystem/
├── 📁 SchoolApiService/           # ASP.NET Core Web API
│   ├── 📁 Controllers/            # API Controllers
│   │   ├── AuthController.cs      # Authentication
│   │   ├── StudentsController.cs  # Student management
│   │   ├── TeachersController.cs  # Teacher management
│   │   └── ...
│   ├── 📁 Services/               # Business Logic
│   ├── 📁 ViewModels/            # DTOs
│   ├── 📁 Reports/               # Report templates
│   ├── 📄 appsettings.json       # Configuration
│   └── 📄 Program.cs             # Entry point
│
├── 📁 SchoolApp.DAL/             # Data Access Layer
│   ├── 📁 SchoolContext/         # DbContext
│   ├── 📁 Migrations/            # EF Migrations
│   ├── 📁 SecurityModels/        # Identity models
│   └── 📁 Configurations/        # Entity configurations
│
├── 📁 SchoolApp.Models/          # Domain Models
│   ├── 📄 Student.cs
│   ├── 📄 Teacher.cs
│   ├── 📄 Course.cs
│   └── ...
│
└── 📁 SchoolAppClient.NG/        # Angular Frontend
    ├── 📁 src/
    │   ├── 📁 app/
    │   │   ├── 📁 components/     # Angular components
    │   │   ├── 📁 services/      # Angular services
    │   │   ├── 📁 models/        # TypeScript models
    │   │   └── 📁 guards/        # Route guards
    │   ├── 📁 assets/            # Static files
    │   └── 📁 environments/      # Environment configs
    ├── 📄 angular.json
    ├── 📄 package.json
    └── 📄 tsconfig.json
```

## 🎯 Tính năng chính của hệ thống

### Authentication & Authorization
- JWT Token authentication
- Role-based access control (Admin, Teacher, Student)
- Password hashing với bcrypt
- Session management

### Student Management
- Đăng ký học sinh mới
- Quản lý thông tin cá nhân
- Theo dõi lịch sử học tập
- Quản lý điểm số

### Teacher Management
- Hồ sơ giáo viên
- Phân công môn học
- Quản lý lương và phụ cấp
- Lịch giảng dạy

### Course & Class Management
- Tạo và quản lý khóa học
- Phân chia lớp học
- Thời khóa biểu
- Quản lý phòng học

### Attendance System
- Điểm danh hàng ngày
- Báo cáo vắng mặt
- Thông báo cho phụ huynh
- Thống kê tỷ lệ đi học

### Fee Management
- Quản lý học phí
- Theo dõi thanh toán
- Thông báo nộp phí
- Báo cáo tài chính

### Exam & Grading
- Tạo lịch thi
- Nhập điểm số
- Tính điểm trung bình
- Xếp loại học lực

## 🔐 Bảo mật

### API Security
- JWT Token với expiration
- CORS configuration
- Request validation
- SQL Injection prevention

### Frontend Security
- Route guards
- Token storage trong localStorage
- XSS protection
- Input sanitization

## 📊 Performance

### Backend Optimizations
- Entity Framework query optimization
- Caching với MemoryCache
- Async/await patterns
- Connection pooling

### Frontend Optimizations
- Lazy loading modules
- OnPush change detection
- TrackBy functions
- Image optimization

## 🚀 Deployment

### Development Environment
Môi trường phát triển với Visual Studio như hướng dẫn trên.

### Production Deployment
- Backend: Deploy to IIS hoặc Azure App Service
- Frontend: Build production và deploy to static hosting
- Database: SQL Server hoặc Azure SQL Database

### Build Commands
```powershell
# Backend
dotnet publish -c Release -o ./publish

# Frontend
ng build --prod
```

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt hoặc chạy dự án:

1. **Kiểm tra lại các bước cài đặt**
2. **Xem phần Troubleshooting**
3. **Kiểm tra Console/Terminal output để tìm lỗi cụ thể**
4. **Đảm bảo tất cả dependencies đã được cài đặt đúng**

---

**🎉 Chúc bạn thành công với School Management System!**

*Dự án này được xây dựng với mục tiêu tạo ra một hệ thống quản lý trường học hiện đại, dễ sử dụng và có thể mở rộng.*

```
MIT License

Copyright (c) 2024 School Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🎯 Roadmap

### Upcoming Features:
- [ ] **Real-time notifications** với SignalR
- [ ] **Mobile app** với .NET MAUI
- [ ] **Advanced reporting** với Power BI integration
- [ ] **Multi-tenant support** cho nhiều trường học
- [ ] **Offline mode** cho mobile app
- [ ] **AI-powered analytics** cho student performance
- [ ] **Integration APIs** với third-party systems

### Technical Debt:
- [ ] **Complete Syncfusion removal** và migration to open-source alternatives
- [ ] **Microservices architecture** refactoring
- [ ] **GraphQL API** implementation
- [ ] **Redis caching** implementation
- [ ] **Event sourcing** cho audit trails

---

## 🙏 Acknowledgments

- **Microsoft**: Cho .NET 8.0 và Entity Framework Core
- **Angular Team**: Cho Angular 17 framework
- **Syncfusion**: Cho UI components (trial version)
- **Material Design**: Cho design system
- **Community**: Cho feedback và contributions

---

<div align="center">
  <p><strong>⭐ Nếu project này hữu ích, hãy cho chúng tôi một star! ⭐</strong></p>
  <p>Built with ❤️ by School Management System Team</p>
</div>


