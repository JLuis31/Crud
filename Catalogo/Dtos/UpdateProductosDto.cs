using System;

namespace CatalogoApp.Dtos
{
    public class UpdateProductoDto
    {
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
    }
}
