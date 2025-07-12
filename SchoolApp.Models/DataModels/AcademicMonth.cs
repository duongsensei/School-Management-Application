using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models.DataModels
{
    [Table("AcademicMonth")]
    public class AcademicMonth
    {
        [Key]
        public int MonthId { get; set; }

        [Required(ErrorMessage = "Tên tháng không được để trống")]
        [MaxLength(50, ErrorMessage = "Tên tháng không được vượt quá 50 ký tự")]
        public string MonthName { get; set; } = string.Empty;

        // FK nếu có
        public int? MonthlyPaymentId { get; set; }

        [ForeignKey("MonthlyPaymentId")]
        public MonthlyPayment? MonthlyPayment { get; set; }
    }
}