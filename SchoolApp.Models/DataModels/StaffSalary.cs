using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("StaffSalary")]
    public class StaffSalary
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StaffSalaryId { get; set; }

        [Required(ErrorMessage = "Tên nhân viên là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên không được vượt quá 100 ký tự")]
        public string StaffName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lương cơ bản là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Lương cơ bản phải >= 0")]
        public decimal? BasicSalary { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Thưởng lễ phải >= 0")]
        public decimal? FestivalBonus { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phụ cấp phải >= 0")]
        public decimal? Allowance { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phụ cấp y tế phải >= 0")]
        public decimal? MedicalAllowance { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phụ cấp nhà ở phải >= 0")]
        public decimal? HousingAllowance { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phụ cấp đi lại phải >= 0")]
        public decimal? TransportationAllowance { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Quỹ tiết kiệm phải >= 0")]
        public decimal? SavingFund { get; set; } = 0;

        [Range(0, double.MaxValue, ErrorMessage = "Thuế phải >= 0")]
        public decimal? Taxes { get; set; } = 0;

        [Range(0, double.MaxValue, ErrorMessage = "Lương ròng phải >= 0")]
        public decimal? NetSalary { get; set; }
    }
}



    

