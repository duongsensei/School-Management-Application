using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("OthersPayment")]
    public class OthersPayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OthersPaymentId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal AmountPaid { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal AmountRemaining { get; set; }

        [DataType(DataType.Date)]
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        // Nếu bạn thực sự muốn liên kết đến Fee (danh mục khoản thu), thì giữ lại
        public ICollection<Fee> Fees { get; set; } = new List<Fee>();

        public ICollection<OtherPaymentDetail> OtherPaymentDetails { get; set; } = new List<OtherPaymentDetail>();
    }
}
