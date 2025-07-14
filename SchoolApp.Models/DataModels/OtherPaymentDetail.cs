using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models.DataModels
{
    [Table("OtherPaymentDetail")]
    public class OtherPaymentDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentDetailId { get; set; }

        [Required]
        public int OthersPaymentId { get; set; }

        [ForeignKey("OthersPaymentId")]
        public OthersPayment? OthersPayment { get; set; }

        [Required(ErrorMessage = "Tên khoản phí không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên khoản phí không vượt quá 100 ký tự")]
        public string FeeName { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Số tiền phải >= 0")]
        public decimal FeeAmount { get; set; }
    }
}
