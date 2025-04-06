using SE_II.Server.Enums;
using SE_II.Server.Interfaces;

namespace SE_II.Server.Models{
    public class Account:IEquatable<Account>,IValidable{
        public Account(string username,string password, Role role=Role.User){
            Username=username;
            Password=password;
            this.role=role;
        }

        public string Username{get;set;}
        public string Password{get;set;}
        public Role role{get;set;}

        public bool Equals(Account other){
            return this.Username==other.Username;
        }

        public bool IsValid(){
            return !string.IsNullOrEmpty(Username) && !string.IsNullOrEmpty(Password);
        }
    }
}