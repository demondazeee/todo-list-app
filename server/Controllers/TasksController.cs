using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.Services;

[Authorize]
[ApiController]
[Route("/tasks")]
public class TasksController : ControllerBase
{
    public IMapper mapper { get; set; }
    public IUsersRepository userRepo { get; set; }
    public ITaskRepository taskRepo { get; set; }
    public TasksController(
        IMapper mapper,
        ITaskRepository taskRepo,
        IUsersRepository userRepo
    )
    {
        this.mapper = mapper;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks() {
        var userId = userRepo.GetAuthUser();
        if (userId == null) {
            return NotFound();
        }
        var task = await taskRepo.GetValuesByExpression(v => v.UserId == new Guid(userId));
        
        var mappedTasks = mapper.Map<IEnumerable<TaskDto>>(task);

        return Ok(mappedTasks);
    }

    [HttpGet("{taskId}", Name = "GetTask")]
    public async Task<ActionResult<TaskDto>> GetTask(
        string taskId
    ) {
        var userId = userRepo.GetAuthUser();
        if (userId == null) {
            return NotFound();
        }

        var task = await taskRepo.GetValueByExpression(v => v.UserId == new Guid(userId) && v.Id == new Guid(taskId));

        if(task == null) {
            return NotFound();
        }

        return Ok(mapper.Map<TaskDto>(task));
    }

    [HttpPost]
    public async Task<ActionResult> CreateTask (
        CreateTaskDto taskDto
    ){
        var userId = userRepo.GetAuthUser();
        if (userId == null) {
            return NotFound();
        }

        var user = await userRepo.GetValueByExpression(v => v.Id == new Guid(userId));

        if(user == null){
            return NotFound();
        }

        var mappedTasks = mapper.Map<Tasks>(taskDto);

        user.Tasks.Add(mappedTasks);

        await userRepo.SaveChangesAsync();

        var result = mapper.Map<TaskDto>(mappedTasks);

        return CreatedAtRoute("GetTask", new {
            taskId = result.Id
        }, result);
    }

    [HttpPatch("{taskId}")]
    public async Task<ActionResult> UpdateTask(
        string taskId,
        JsonPatchDocument<UpdateTaskDto> taskDto
    ) {
        var userId = userRepo.GetAuthUser();
        if (userId == null) {
            return NotFound();
        }


        var task = await taskRepo.GetValueByExpression(v => v.UserId == new Guid(userId) && v.Id == new Guid(taskId));
        if(task == null) {
            return NotFound();
        }
        var mappedTasks = mapper.Map<UpdateTaskDto>(task);
        taskDto.ApplyTo(mappedTasks, ModelState);

        if(!TryValidateModel(mappedTasks)){
            return BadRequest(ModelState);
        }

        if(!ModelState.IsValid) {
            return BadRequest(ModelState);
        }

        var result = mapper.Map(mappedTasks, task);

        await taskRepo.SaveChangesAsync();

        return Ok(mapper.Map<TaskDto>(result));
    }

    [HttpDelete("{taskId}")]
    public async Task<ActionResult> DeleteTask(
        string taskId
    ) {
        var userId = userRepo.GetAuthUser();
        if (userId == null) {
            return NotFound();
        }

        var task = await taskRepo.GetValueByExpression(v => v.UserId == new Guid(userId) && v.Id == new Guid(taskId));
        if(task == null) {
            return NotFound();
        }
        await taskRepo.Delete(task);

        return Ok(
            new {
                message = "Task Deleted"
            }
        );
    }
}