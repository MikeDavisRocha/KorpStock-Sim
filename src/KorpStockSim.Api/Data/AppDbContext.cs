using KorpStockSim.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace KorpStockSim.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Mapeia nossa entidade Product para uma tabela chamada "Products" no banco.
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Aqui podemos adicionar configurações mais detalhadas para nossas entidades
        // por exemplo, definir tamanho máximo de colunas, índices, etc.
        modelBuilder.Entity<Product>().HasKey(p => p.Id);
        modelBuilder.Entity<Product>().HasIndex(p => p.Sku).IsUnique(); // Garante que o SKU seja único
    }
}