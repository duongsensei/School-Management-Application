using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("MonthlyPayment")]
    public class MonthlyPayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MonthlyPaymentId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalFeeAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Waver { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal PreviousDue { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal AmountPaid { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal AmountRemaining { get; set; }

        [DataType(DataType.Date)]
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public ICollection<Fee> Fees { get; set; } = new List<Fee>();
        public ICollection<AcademicMonth> AcademicMonths { get; set; } = new List<AcademicMonth>();
        public ICollection<PaymentMonth> PaymentMonths { get; set; } = new List<PaymentMonth>();
        public ICollection<PaymentDetail> PaymentDetails { get; set; } = new List<PaymentDetail>();
        public ICollection<DueBalance> DueBalances { get; set; } = new List<DueBalance>();
    }
}
