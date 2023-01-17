using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Entities;

public class Tasks
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    public String TaskName { get; set; }

    [ForeignKey("UserId")]
    public Users? UserName { get; set; }

    public Guid UserId { get; set; }

    public Tasks(
        string taskName
    )
    {
        TaskName = taskName;
    }
}