using AutoMapper;
using WebAPI.Entities;
using WebAPI.Models;

public class TaskProfile : Profile
{
    public TaskProfile()
    {
        CreateMap<Tasks, TaskDto>();
        CreateMap<CreateTaskDto, Tasks>();
        CreateMap<Tasks, UpdateTaskDto>();
        CreateMap<UpdateTaskDto, Tasks>();
    }
}