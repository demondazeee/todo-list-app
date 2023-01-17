using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class UpdateTaskDto
{
    [Required]
    public String TaskName { get; set; } = string.Empty; 
}