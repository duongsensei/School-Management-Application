using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("PaymentMonth")]
    public class PaymentMonth
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentMonthId { get; set; }

        [Required]
        public int MonthlyPaymentId { get; set; }

        [ForeignKey("MonthlyPaymentId")]
        public MonthlyPayment? MonthlyPayment { get; set; }

        [Required(ErrorMessage = "Tên tháng không được để trống")]
        [MaxLength(20, ErrorMessage = "Tên tháng không vượt quá 20 ký tự")]
        public string MonthName { get; set; } = string.Empty;
    }
}
