namespace SE_II.Server.Models{
    public class ValidationRule<T>{
        private readonly Func<T,bool> _rule;
        public string ErrorMessage{get;}

        public ValidationRule(Func<T,bool> rule,string errorMessage){
            _rule=rule;
            ErrorMessage=errorMessage;
        }

        public bool Validate(T value){
            return _rule(value);
        }
    }
}