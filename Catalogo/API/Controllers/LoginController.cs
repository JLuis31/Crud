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
        private string _currentAccessToken;
        private DateTime _accessTokenExpiration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                var user = await _context.Registros
                    .FirstOrDefaultAsync(r => r.Nombre == loginRequest.Nombre
                                               && r.Contraseña == loginRequest.Contraseña);

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
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Nombre),
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"]
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                var refreshToken = GenerateRefreshToken();
                SaveRefreshToken(user.Id, refreshToken);

                var response = new
                {
                    Nombre = user.Nombre,
                    AccessToken = tokenString,
                    RefreshToken = refreshToken
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el login: {ex.Message}");
                return StatusCode(500, "Ocurrio un error en el servidor");
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest tokenRequest)
        {
            if (tokenRequest == null || string.IsNullOrEmpty(tokenRequest.RefreshToken))
            {
                return BadRequest("Petición inválida");
            }

            var user = await _context.Registros.FirstOrDefaultAsync(u => u.RefreshToken == tokenRequest.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized("El RefreshToken es inválido o ha expirado");
            }


            if (IsAccessTokenValid())
            {
                return Ok(new
                {
                    Message = "El Access Token sigue siendo válido",
                    AccessToken = GetCurrentAccessToken(),
                    RefreshToken = user.RefreshToken
                });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Nombre),  }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var newAccessToken = tokenHandler.CreateToken(tokenDescriptor);
            var accessTokenString = tokenHandler.WriteToken(newAccessToken);


            return Ok(new
            {
                AccessToken = accessTokenString,
                RefreshToken = user.RefreshToken
            });
        }


        private void SaveRefreshToken(int userId, string refreshToken)
        {
            var user = _context.Registros.Find(userId);
            if (user != null)
            {
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddHours(1);
                _context.SaveChanges();
            }
        }

        private bool IsAccessTokenValid()
        {
            return !string.IsNullOrEmpty(_currentAccessToken) && _accessTokenExpiration > DateTime.UtcNow;
        }


        private string GetCurrentAccessToken()
        {

            return _currentAccessToken;
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }

    public class LoginRequest
    {
        public string Nombre { get; set; }
        public string Contraseña { get; set; }
    }

    public class TokenRequest
    {
        public string RefreshToken { get; set; }
    }
}
