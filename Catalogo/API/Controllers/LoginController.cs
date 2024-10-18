using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Catalogo.Infrastructure.Data;
using CatalogoApp.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Catalogo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try{

           
            var user = await _context.Registros
                .FirstOrDefaultAsync(r => r.Nombre == loginRequest.Nombre && r.Contraseña == loginRequest.Contraseña);

            if (user == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                 new Claim("Id", user.Id.ToString()),
                 new Claim("User Name", user.Nombre),
                new Claim(ClaimTypes.Name, user.Nombre),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
               
            }),
            Expires = DateTime.UtcNow.AddHours(1), 
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };


            // Generar el token JWT
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var response = new
            {
                Nombre = user.Nombre,

                Token = tokenString 

            };

            return Ok(response);
             }catch(Exception ex)
             {
                Console.WriteLine($"Error en el login: {ex.Message}");
                return StatusCode(500,"Ocurrio un error en el servidor");
             }
        }

        
    }

    public class LoginRequest
    {
        public string Nombre { get; set; }
        public string Contraseña { get; set; }
    }
}
