using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Catalogo.Infrastructure.Data;
using CatalogoApp.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;



namespace Catalogo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrosController:ControllerBase
    {
        private readonly AppDbContext _context;

        public RegistrosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Registro>>> GetRegistros()
        {
            return await _context.Registros.ToListAsync();
        }

       
        [HttpPost]
        public async Task<ActionResult<Registro>> PostRegistro(Registro registro)
        {

            var usuarioExistente = await _context.Registros
            .AnyAsync(r => r.Nombre == registro.Nombre);

            if(usuarioExistente)
            {
                return Conflict("El usuario ya existe.");
            }

            _context.Registros.Add(registro);
            await _context.SaveChangesAsync();


            return CreatedAtAction(nameof(GetRegistros),new{id = registro.Id},registro);
        }

  
  

  
  
  
    }








}
