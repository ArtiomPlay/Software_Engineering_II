using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SE_II.Server.Data;
using SE_II.Server.Services;
using SE_II.Server.Interfaces;
using System.Data.Common;

namespace SE_II.Tests{
    public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class{
        protected override void ConfigureWebHost(IWebHostBuilder builder){
            base.ConfigureWebHost(builder);

            builder.ConfigureTestServices(services => {
                var dbContextDescriptor=services.SingleOrDefault(d => d.ServiceType==typeof(DbContextOptions<AppDbContext>));

                if(dbContextDescriptor!=null)
                    services.Remove(dbContextDescriptor);
                
                var dbConnectionDescriptor=services.SingleOrDefault(d => d.ServiceType==typeof(DbConnection));

                if(dbConnectionDescriptor!=null)
                    services.Remove(dbConnectionDescriptor);

                services.AddSingleton<DbConnection>(container => {
                    var connection=new SqliteConnection("DataSource=:memory:");
                    connection.Open();

                    return connection;
                });

                services.AddDbContext<AppDbContext>((container,options) => {
                    var connection=container.GetRequiredService<DbConnection>();
                    options.UseSqlite(connection);
                });
            });

            builder.UseEnvironment("Development");
        }
    }
}