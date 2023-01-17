using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WebAPI.DBContext;

namespace WebAPI.Services;

public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    protected readonly DB context;
    public RepositoryBase(DB context)
    {
        this.context = context;
    }
    public async Task Create(T entity)
    {
        await context.Set<T>().AddAsync(entity);

        await this.SaveChangesAsync();
    }

    public async Task Delete(T entity)
    {
        context.Set<T>().Remove(entity);

        await this.SaveChangesAsync();
    }

    public async Task<IEnumerable<T>> GetValues()
    {
        return await context.Set<T>().ToListAsync();
    }


    public async Task<IEnumerable<T>> GetValuesByExpression(Expression<Func<T, bool>> expression)
    {
        return await context.Set<T>().Where(expression).ToListAsync();
    }

    public async Task<T?> GetValueByExpression(Expression<Func<T, bool>> expression)
    {
        return await context.Set<T>().Where(expression).FirstOrDefaultAsync();
    }


    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}