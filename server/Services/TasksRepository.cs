using WebAPI.DBContext;
using WebAPI.Entities;

namespace WebAPI.Services;

public class TasksRepository : RepositoryBase<Tasks>, ITaskRepository
{
    public TasksRepository(DB context) : base(context)
    {
        
    }
}