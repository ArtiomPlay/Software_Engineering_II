using Microsoft.EntityFrameworkCore;
using SE_II.Server.DTOs;

namespace SE_II.Server.Data{
    public class AppDbContext : DbContext{
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<AccountDTO> Accounts{get;set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder){
            var accountConfig=modelBuilder.Entity<AccountDTO>();
            accountConfig.ToTable("accounts");
            accountConfig.HasKey(c => c.Id);
            accountConfig.Property(c => c.Username).HasColumnName("username").IsRequired();
            accountConfig.Property(c => c.Password).HasColumnName("password").IsRequired();
        }
    }
}