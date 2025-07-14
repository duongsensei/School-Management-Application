using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("DueBalance")]
    public class DueBalance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DueBalanceId { get; set; }

        [Required(ErrorMessage = "Mã học sinh không được để trống")]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "Số tiền còn nợ không được để trống")]
        [Range(0, double.MaxValue, ErrorMessage = "Số tiền còn nợ phải >= 0")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal DueBalanceAmount { get; set; }

        public DateTime LastUpdate { get; set; } = DateTime.Now;

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }
}
