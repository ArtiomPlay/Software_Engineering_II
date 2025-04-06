namespace SE_II.Server.Interfaces{
    public interface IValidator<T>{
        void AddRule(Func<T,bool> rule,string errorMessage);
        bool Validate(T entity);
    }
}