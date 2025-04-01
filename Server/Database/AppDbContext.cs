using Microsoft.EntityFrameworkCore;
using SE_II.Server.DTOs;
using SE_II.Server.Models;

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
            accountConfig.Property(c => c.role).HasColumnName("role").IsRequired();

            var aimTrainerScoreConfig=modelBuilder.Entity<AimTrainerScore>();
            aimTrainerScoreConfig.ToTable("aimTrainerScores");
            aimTrainerScoreConfig.HasKey(c => c.Id);
            aimTrainerScoreConfig.Property(c => c.score).HasColumnName("score").IsRequired();
            aimTrainerScoreConfig.HasOne(c => c.Account)
                .WithMany(u => u.AimTrainerScores)
                .HasForeignKey(c => c.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            var mathGameScoreConfig=modelBuilder.Entity<MathGameScore>();
            mathGameScoreConfig.ToTable("mathGameScores");
            mathGameScoreConfig.HasKey(c => c.Id);
            mathGameScoreConfig.Property(c => c.score).HasColumnName("score").IsRequired();
            mathGameScoreConfig.HasOne(c => c.Account)
                .WithMany(u => u.MathGameScores)
                .HasForeignKey(c => c.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            var seekerScoreConfig=modelBuilder.Entity<SeekerScore>();
            seekerScoreConfig.ToTable("seekerScores");
            seekerScoreConfig.HasKey(c => c.Id);
            seekerScoreConfig.Property(c => c.score).HasColumnName("score").IsRequired();
            seekerScoreConfig.HasOne(c => c.Account)
                .WithMany(u => u.SeekerScores)
                .HasForeignKey(c => c.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            var sequenceScoreConfig=modelBuilder.Entity<SequenceScore>();
            sequenceScoreConfig.ToTable("sequenceScores");
            sequenceScoreConfig.HasKey(c => c.Id);
            sequenceScoreConfig.Property(c => c.score).HasColumnName("score").IsRequired();
            sequenceScoreConfig.HasOne(c => c.Account)
                .WithMany(u => u.SequenceScores)
                .HasForeignKey(c => c.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            var typingScoreConfig=modelBuilder.Entity<TypingScore>();
            typingScoreConfig.ToTable("typingScores");
            typingScoreConfig.HasKey(c => c.Id);
            typingScoreConfig.Property(c => c.score).HasColumnName("score").IsRequired();
            typingScoreConfig.HasOne(c => c.Account)
                .WithMany(u => u.TypingScores)
                .HasForeignKey(c => c.AccountId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}