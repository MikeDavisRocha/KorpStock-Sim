using KorpStockSim.Api.Data;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KorpStockSim.Api.Features.Products;

public static class UpdateProductEndpoint
{
    // DTO para os dados que vêm no corpo da requisição PUT.
    public record UpdateProductRequest(string Sku, string Name, string Description, int QuantityInStock);

    public static IEndpointRouteBuilder MapUpdateProductEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapPut("/api/products/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateProductRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new UpdateProduct.Command(
                id,
                request.Sku,
                request.Name,
                request.Description,
                request.QuantityInStock);

            var result = await sender.Send(command);

            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateProduct")
        .WithTags("Products");

        return builder;
    }
}

public static class UpdateProduct
{
    // Command: Agrupa todos os dados necessários para a operação.
    public record Command(
        Guid Id,
        string Sku,
        string Name,
        string Description,
        int QuantityInStock) : IRequest<bool>;

    // Handler: Contém a lógica de negócio.
    // Retorna 'true' se a atualização foi bem-sucedida, 'false' se o produto não foi encontrado.
    internal sealed class Handler : IRequestHandler<Command, bool>
    {
        private readonly AppDbContext _dbContext;

        public Handler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            // 1. Busca o produto no banco de dados.
            //    Diferente das queries, aqui NÃO usamos AsNoTracking(), pois precisamos que o EF Core rastreie as mudanças.
            var product = await _dbContext.Products
                .FindAsync(new object[] { request.Id }, cancellationToken);

            // 2. Se o produto não existe, retorna 'false'.
            if (product is null)
            {
                return false;
            }

            // 3. Chama o método de negócio na entidade para aplicar as atualizações.
            product.Update(
                request.Sku,
                request.Name,
                request.Description,
                request.QuantityInStock);

            // 4. Salva as alterações no banco.
            await _dbContext.SaveChangesAsync(cancellationToken);

            // 5. Retorna 'true' para indicar sucesso.
            return true;
        }
    }
}