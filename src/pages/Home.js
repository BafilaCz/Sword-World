import "./Home.css"


const Home = () => {
  return (
    <div className="home">
      {/* PŘIDAT IMG S BANNER OBRAZKEM Z DATABAZE */}
      <h1 className="welcome">Vítej na Sword Worldu</h1>

      <p>Sword World je maturitní práce, která představuje funkční webový obchod specializující se na prodej mečů. Aplikace je vyvinuta v Reactu, moderní JavaScriptové knihovně pro tvorbu uživatelských rozhraní, která umožňuje vytvářet dynamické a responzivní webové stránky. Cílem projektu bylo vytvořit plnohodnotný e-shop, který je přehledný pro co nejvíce uživatelů.</p>

      <p>
        Důvodem proč jsem si vybral zrovna toto téma pro svou maturitní práci je především, má záliba v programování. Rozhodl jsem se tímto způsobem naučit práci s různými technologiemi, jako např. API map, databáze, či mnoho funkcí reaktu nebo javascriptu. Důvodem proč se stránka zaměřuje na prodej mečů je má záliba v nich. Rozhodl jsem se tedy spojit 2 věci, ke kterým mám blízko, abych zkusil vytvořit komplecní projekt. 
      </p>

      <p> Webová stránka je rozdělena do několika sekcí, včetně stránky s nabídkou zboží, detailů jednotlivých produktů, nákupního košíku, uživatelského profilu, či formuláře pro recenze a další. Uživatelé mohou procházet katalog mečů, filtrovat je podle kategorií nebo vyhledávat konkrétní produkty pomocí vyhledávacího pole. Každý meč je doplněn podrobným popisem, cenou a fotografií, což uživatelům usnadňuje rozhodování.</p>

      <p> Nákupní proces je navržen tak, aby byl co nejjednodušší. Uživatelé mohou přidávat produkty do košíku, upravovat jejich množství a následně přejít k platbě, kde vyplní své údaje, zvolí způsob platby a dopravy. Aplikace také zahrnuje základní validaci formulářů, aby byla zajištěna správnost zadaných údajů.</p>

      <p> Celý projekt byl vytvořen s důrazem na responzivní design, aby byl web plně funkční na zařízeních různých velikostí, od počítačů po mobilní telefony. Kód je strukturován a komentován, aby byl snadno pochopitelný a udržovatelný. Součástí práce je také dokumentace, která popisuje architekturu aplikace, použité technologie a postupy při vývoji.</p>

      <p>Tato maturitní práce demonstruje nejen schopnost pracovat s moderními webovými technologiemi, ale také porozumění principům tvorby e-shopů, včetně správy produktů, uživatelského rozhraní a bezpečnosti. Projekt by mohl sloužit jako solidní základ pro další rozšíření, například integraci platební brány nebo přidání pokročiléjších funkcí</p>
      <img src="https://i.pinimg.com/originals/07/ac/fc/07acfc8a22dd8182985a41642e98a5dc.jpg" 
      referrerPolicy="no-referrer" className="cat"></img>

        
    </div>
  )
}

export default Home

// #121212