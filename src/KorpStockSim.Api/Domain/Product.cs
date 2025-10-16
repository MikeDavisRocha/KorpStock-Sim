namespace KorpStockSim.Api.Domain;

public class Product
{
    // Usamos Guid como chave primária para evitar conflitos em sistemas distribuídos.
    public Guid Id { get; private set; } = Guid.NewGuid();

    // SKU (Stock Keeping Unit) é um código único para identificar o produto.
    public string Sku { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public int QuantityInStock { get; private set; }

    public DateTime LastUpdated { get; private set; }

    // Construtor privado para ser usado pelo Entity Framework e pelo método de criação.
    private Product() { }

    // Método de fábrica estático (Factory Method) para garantir que um produto
    // seja sempre criado em um estado válido.
    public static Product Create(string sku, string name, string description, int initialStock)
    {
        // Aqui poderiam entrar validações de negócio (ex: SKU não pode ser nulo, etc.)
        return new Product
        {
            Sku = sku,
            Name = name,
            Description = description,
            QuantityInStock = initialStock,
            LastUpdated = DateTime.UtcNow
        };
    }

    public void Update(string sku, string name, string description, int quantityInStock)
    {
        // Aqui poderiam entrar validações (ex: quantityInStock não pode ser negativo)
        Sku = sku;
        Name = name;
        Description = description;
        QuantityInStock = quantityInStock;
        LastUpdated = DateTime.UtcNow;
    }
}