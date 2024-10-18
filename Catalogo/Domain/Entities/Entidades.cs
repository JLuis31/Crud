using System;

namespace CatalogoApp.Domain.Entities
{
    public class Producto
    {
        public int Id { get; set; }
        public string UserId{get;set;}
        public string Nombre { get; set; }
        public decimal Precio { get; set; }

        public string Descripcion {get; set;}

        public DateTime Fecha {get;set;}

        
      
        
    }

    public class Registro{
        public int Id {get;set;}
        public string Nombre {get;set;}
        public string Contraseña {get;set;}
    }
}
