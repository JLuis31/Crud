using Microsoft.EntityFrameworkCore;
using CatalogoApp.Domain.Entities;

namespace Catalogo.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; } 
        public DbSet<Registro>Registros{get;set;}
    }
}
