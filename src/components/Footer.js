import "./Footer.css";
import { FaDiscord } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaSteam } from "react-icons/fa";
import { SiOsu } from "react-icons/si";
import { FaPhone } from "react-icons/fa6";
import { IoMailSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footerContent">

        <ul className="allFooterLinks">
          <li className="footerLink" id="Discord"><a href="https://www.google.com/search?sca_esv=b8c8c187ff72a731&sca_upv=1&sxsrf=ADLYWIJr4FHXj6juFH7us2Nm3r6pW4BTBQ:1722857667251&q=ID:+357871276108414986&source=lnms&fbs=AEQNm0Dg3jL7_nUV4_inb0jRKZuKZx2IIA0zQj2nIoYPgN35RKa7LgPYdXmO-7w1OLTfaHs0e0PUMHMXM8y8MgTph9v2jXkqUXMGmfW0QedMJNa_k-fXmsJqyOSeDNOZaoNj8CHBWubz26H4vdOu9mSQ5NloWI2KqOnAfOczMsnd8MGPZe_CgWxymGmLQrrINNriKFMhCpZ-&sa=X&ved=2ahUKEwj97IT64N2HAxX21gIHHZsIB6AQ0pQJegQIDBAB&biw=1536&bih=761&dpr=1.25" target="blank" className="footerLink"><FaDiscord /> Discord</a></li>
          <li className="footerLink" id="instagram"><a href="https://www.instagram.com/sevcukf" target="blank" className="footerLink"><FaInstagram /> Instagram</a></li>
          <li className="footerLink" id="youtube"><a href="https://www.youtube.com/channel/UCiLAusCaN8MJcB4uDXy3lcQ" target="blank" className="footerLink"><FaYoutube /> Youtube</a></li>
          <li className="footerLink" id="steam"><a href="https://steamcommunity.com/id/bafilacz/" target="blank" className="footerLink"><FaSteam /> Steam</a></li>
          <li className="footerLink" id="osu"><a href="https://osu.ppy.sh/users/30140635" target="blank" className="footerLink"><SiOsu /> OSU!</a></li>
        </ul>
        
        <div className="allFooterInfo">
          <p className="footerInfo"><FaPhone /> TEL: +420 775 491 802</p>
          <p className="footerInfo"><IoMailSharp /> E-MAIL: sevcfi421d@wigym.cz</p>
          <p className="footerInfo"><FaHome /> ADRESA: Matěje Kopeckého 513/4</p>
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;
