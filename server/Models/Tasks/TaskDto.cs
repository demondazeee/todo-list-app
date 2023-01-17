using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class TaskDto
{   
    [Required]
    public Guid Id { get; set; }

    [Required]
    public String TaskName { get; set; }
    
    public TaskDto(
        string taskName
    )
    {
        TaskName = taskName;
    }
}