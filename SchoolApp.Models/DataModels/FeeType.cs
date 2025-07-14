using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{
    [Table("FeeType")]
    public class FeeType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FeeTypeId { get; set; }

        [Required(ErrorMessage = "Tên loại phí không được để trống")]
        [MaxLength(100, ErrorMessage = "Tên loại phí không vượt quá 100 ký tự")]
        public string TypeName { get; set; } = string.Empty;

        public virtual ICollection<Fee> Fees { get; set; } = new List<Fee>();
    }
}
