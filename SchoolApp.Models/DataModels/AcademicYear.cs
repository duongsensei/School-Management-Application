using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolApp.Models.DataModels
{

    [Table("AcademicYear")]
    public class AcademicYear
    {
        [Key]
        public int AcademicYearId { get; set; }

        [Required(ErrorMessage = "Tên năm học không được để trống")]
        [MaxLength(50, ErrorMessage = "Tên năm học không được vượt quá 50 ký tự")]
        public required string Name { get; set; }
    }
}
