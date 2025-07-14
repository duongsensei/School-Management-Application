using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("Fee")]
    public class Fee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FeeId { get; set; }

        [Required(ErrorMessage = "FeeTypeId không được để trống")]
        public int FeeTypeId { get; set; }

        [Required(ErrorMessage = "StandardId không được để trống")]
        public int StandardId { get; set; }

        [Required(ErrorMessage = "Tần suất thanh toán là bắt buộc")]
        [EnumDataType(typeof(Frequency))]
        public Frequency PaymentFrequency { get; set; }

        [Required(ErrorMessage = "Số tiền là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Ngày đến hạn là bắt buộc")]
        [DataType(DataType.Date)]
        public DateTime DueDate { get; set; }

        [ForeignKey("StandardId")]
        public Standard? Standard { get; set; }

        [ForeignKey("FeeTypeId")]
        public FeeType? FeeType { get; set; }

        public MonthlyPayment? MonthlyPayment { get; set; }

        public OthersPayment? OthersPayment { get; set; }
    }

    public enum Frequency
    {
        Monthly,
        Yearly,
        Quarterly,
        Semesterly,
        Biannually,
        Custom
    }

}
