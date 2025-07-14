using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("PaymentDetail")]
    public class PaymentDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentDetailId { get; set; }

        [Required]
        public int MonthlyPaymentId { get; set; }

        [ForeignKey("MonthlyPaymentId")]
        public MonthlyPayment? MonthlyPayment { get; set; }

        [Required(ErrorMessage = "Tên khoản phí không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên khoản phí không vượt quá 100 ký tự")]
        public string FeeName { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0, 9999999999, ErrorMessage = "Số tiền phải lớn hơn hoặc bằng 0")]
        public decimal FeeAmount { get; set; }
    }
}
