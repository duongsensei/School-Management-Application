using SchoolApp.Models.DataModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolApp.Models.DataModels.StaticModel;

namespace SchoolApp.Models.DataModels
{
    [Table("Staff")]
    public class Staff
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StaffId { get; set; }

        [Required]
        [MaxLength(100)]
        public string StaffName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? ImagePath { get; set; }

        [NotMapped]
        public ImageUpload? ImageUpload { get; set; }  // Chỉ dùng khi upload ảnh từ frontend

        [Required]
        public int UniqueStaffAttendanceNumber { get; set; } = 200;

        public Gender? Gender { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }

        [MaxLength(100)]
        public string? FatherName { get; set; }

        [MaxLength(100)]
        public string? MotherName { get; set; }

        [MaxLength(300)]
        public string? TemporaryAddress { get; set; }

        [MaxLength(300)]
        public string? PermanentAddress { get; set; }

        [Phone]
        [MaxLength(15)]
        public string? ContactNumber1 { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? Qualifications { get; set; }

        public DateTime? JoiningDate { get; set; } = DateTime.Now;

        public Designation? Designation { get; set; }

        [MaxLength(100)]
        public string? BankAccountName { get; set; }

        [MaxLength(30)]
        public string? BankAccountNumber { get; set; }  // đổi từ int sang string

        [MaxLength(100)]
        public string? BankName { get; set; }

        [MaxLength(100)]
        public string? BankBranch { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; } // Cân nhắc dùng enum

        public int? DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        public int? StaffSalaryId { get; set; }

        [ForeignKey("StaffSalaryId")]
        public StaffSalary? StaffSalary { get; set; }

        public ICollection<StaffExperience> StaffExperiences { get; set; } = new List<StaffExperience>();
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }

    public enum Designation
    {
        // School Leadership
        Superintendent,
        Headmaster,
        Headmistress,
        AssistantPrincipal,
        Dean,
        Director,

        // Academic Staff
        DepartmentChair,
        Professor,
        Instructor,
        Lecturer,
        TeachingAssistant,
        SpecialEducationTeacher,
        SubstituteTeacher,

        // Support Staff
        Counselor,
        Librarian,
        MediaSpecialist,
        LabTechnician,
        ITSpecialist,
        BusDriver,
        LunchAide,
        Custodian,

        // Administrative Staff
        Registrar,
        AdmissionsOfficer,
        BusinessManager,
        DevelopmentOfficer,
        HumanResourcesManager,
        Receptionist,

        // Other
        Coach,
        SecurityGuard,
        MaintenanceWorker,
        FoodServiceWorker,
        Other
    }

}
