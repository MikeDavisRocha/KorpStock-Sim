using KorpStockSim.Api.Data;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KorpStockSim.Api.Features.Products;

public static class DeleteProductEndpoint
{
    public static IEndpointRouteBuilder MapDeleteProductEndpoint(this IEndpointRouteBuilder builder)
    {
        builder.MapDelete("/api/products/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] ISender sender) =>
        {
            var command = new DeleteProduct.Command(id);
            var result = await sender.Send(command);

            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteProduct")
        .WithTags("Products");

        return builder;
    }
}

public static class DeleteProduct
{
    // Command: Representa a intenção de excluir um produto, contendo apenas seu ID.
    public record Command(Guid Id) : IRequest<bool>;

    // Handler: Contém a lógica de negócio para a exclusão.
    // Retorna 'true' se a exclusão foi bem-sucedida, 'false' se o produto não foi encontrado.
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
            var product = await _dbContext.Products
                .FindAsync(new object[] { request.Id }, cancellationToken);

            // 2. Se o produto não for encontrado, retorna 'false'.
            if (product is null)
            {
                return false;
            }

            // 3. Remove a entidade do DbContext.
            _dbContext.Products.Remove(product);

            // 4. Salva as alterações, efetivando a exclusão no banco.
            await _dbContext.SaveChangesAsync(cancellationToken);

            // 5. Retorna 'true' para indicar sucesso.
            return true;
        }
    }
}