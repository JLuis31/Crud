import "../Footer/footer.css";
import facebook from "../ImgComp/fb.png";
import twitter from "../ImgComp/twitter.png";
import linkedin from "../ImgComp/LK.png";
import github from "../ImgComp/github.png";
import googleplay from "../ImgComp/googleplay.png";
import apple from "../ImgComp/apple.png";

const Footer = function () {
  return (
    <footer>
      <div className="contenedorfooter">
        <div className="izqinfo">
          <p className="nombrepagina">CRUD</p>
          <div className="imagenesfooter">
            <img className="facebook" src={facebook} alt="Facebook"></img>
            <img src={twitter} alt="Twitter"></img>
            <a
              href="https://www.linkedin.com/in/jose-luis-garcia-martinez-b2ab76267/"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              <img src={linkedin} alt="linkedin"></img>
            </a>
            <a
              href="https://github.com/JLuis31"
              target="_blank"
              rel="noreferrer"
            >
              <img src={github} alt="github"></img>
            </a>
          </div>
          <div className="btnfooter">
            <button>
              {" "}
              <img src={apple} alt="apple"></img>
              <p>App store</p>
            </button>
            <button>
              {" "}
              <img src={googleplay} alt="apple"></img>
              <p>Google Play</p>
            </button>
          </div>
        </div>
        <div className="izqinfo derinfo">
          <div className="contlista contlista1">
            <ul className="listaf">
              <p>Crud</p>
              <li>Crea</li>
              <li>Lee</li>
              <li>Actualiza</li>
              <li>Elimina</li>
            </ul>
          </div>
          <div className="contlista contlista2">
            <ul className="listaf">
              <p>Legal</p>
              <li>Política de Privacidad</li>
              <li>Términos y Condiciones</li>
            </ul>{" "}
          </div>{" "}
          <div className="contlista contlista3">
            <ul className="listaf">
              <p>Contacto</p>
              <li>Soporte</li>
              <li>Contáctanos</li>
            </ul>{" "}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
