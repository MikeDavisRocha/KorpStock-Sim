using KorpStockSim.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using static KorpStockSim.Api.Features.Products.GetProductById;

namespace KorpStockSim.Api.Features.Products;

public static class ListAllProductsEndpoint
{
    public static IEndpointRouteBuilder MapListAllProductsEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/api/products", async ([FromServices] ISender sender) =>
        {
            var query = new ListAllProducts.Query();
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("ListAllProducts")
        .WithTags("Products");

        return builder;
    }
}


public static class ListAllProducts
{
    // Query: Uma solicitação para buscar a lista de todos os produtos.
    // Não precisa de parâmetros para uma listagem simples.
    public record Query() : IRequest<IEnumerable<ProductResponse>>;

    // Handler: Contém a lógica de busca no banco de dados.
    internal sealed class Handler : IRequestHandler<Query, IEnumerable<ProductResponse>>
    {
        private readonly AppDbContext _dbContext;

        public Handler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<ProductResponse>> Handle(Query request, CancellationToken cancellationToken)
        {
            // 1. Acessa a tabela de produtos.
            var products = await _dbContext.Products
                .AsNoTracking() // Essencial para performance em consultas de leitura.
                .OrderBy(p => p.Name) // É uma boa prática ordenar a lista.
                .Select(p =>
                    // 2. Mapeia diretamente a entidade para o nosso DTO de resposta.
                    // Isso é eficiente, pois o EF Core só buscará as colunas necessárias no banco.
                    new ProductResponse(
                        p.Id,
                        p.Sku,
                        p.Name,
                        p.Description,
                        p.QuantityInStock,
                        p.LastUpdated)
                )
                .ToListAsync(cancellationToken);

            // 3. Retorna a lista de produtos.
            return products;
        }
    }
}