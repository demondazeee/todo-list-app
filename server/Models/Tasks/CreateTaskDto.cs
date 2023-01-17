using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class CreateTaskDto
{
    [Required]
    public String TaskName { get; set; } = string.Empty; 
}