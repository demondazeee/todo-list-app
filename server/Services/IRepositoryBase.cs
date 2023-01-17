using System.Linq.Expressions;

namespace WebAPI.Services;

public interface IRepositoryBase<T>
{
    Task Create(T entity);

    Task Delete(T entity);
    
    Task<IEnumerable<T>> GetValuesByExpression(Expression<Func<T, bool>> expression);
    Task<T?> GetValueByExpression(Expression<Func<T, bool>> expression);

    Task<IEnumerable<T>> GetValues();

    Task SaveChangesAsync();
}