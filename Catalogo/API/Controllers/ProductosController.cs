using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Catalogo.Infrastructure.Data;
using System.Threading.Tasks;
using CatalogoApp.Domain.Entities;
using CatalogoApp.Dtos;
using System;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;



namespace Catalogo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;  

        public ProductosController(AppDbContext context) 
        {
            _context = context;
        }


        
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            if(!string.IsNullOrEmpty(producto.Fecha.ToString()))
            {
                 var fechaFormateada = DateTime.ParseExact(
                    producto.Fecha.ToString("dd/MM/yyyy"), 
                    "dd/MM/yyyy", 
                    CultureInfo.InvariantCulture);
                
                producto.Fecha = fechaFormateada;
            }

             
             
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
    {
        Console.WriteLine("UserId es null"); 
        return Unauthorized(); 
    }
           
             producto.UserId = userId; 
            
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            
    

            

            return CreatedAtAction(nameof(GetProducto), new {id = producto.Id},producto);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProductos()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var productos = await _context.Productos
            .Where(p => p.UserId == userId) 
            .ToListAsync();
    
            return Ok(productos);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
           var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
           var producto = await _context.Productos
          .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId); 
    
               if (producto == null)
                {
                return NotFound();
                }

                return producto;
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Producto>> DeleteProducto(int id)
        {
             var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
             var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
    
             if (producto == null)
             {
                 return NotFound();
             }
    
             _context.Productos.Remove(producto);
             await _context.SaveChangesAsync();

              return NoContent();
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateProductoDto dto)
        {
             var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
             var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId); 

            if (producto == null)
             {
              return NotFound();
             }

              producto.Nombre = dto.Nombre;
              producto.Precio = dto.Precio;
              producto.Descripcion = dto.Descripcion;

              if (!string.IsNullOrEmpty(dto.Fecha.ToString()))
                {
                 var fechaFormateada = DateTime.ParseExact(
                 dto.Fecha.ToString("dd/MM/yyyy"),
                 "dd/MM/yyyy",
                CultureInfo.InvariantCulture
                );

                 producto.Fecha = fechaFormateada;
    }

                _context.Productos.Update(producto);
                 await _context.SaveChangesAsync();
                return NoContent();
            

            
        }

      


    }



}
