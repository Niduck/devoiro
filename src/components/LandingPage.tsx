import { useNavigate } from "react-router-dom";
import activityGraphism from "../assets/illustrations/devoiros/activity-graphisme.svg";
import activityReading from "../assets/illustrations/devoiros/activity-lecture.svg";
import activityWriting from "../assets/illustrations/devoiros/activity-ecriture.svg";
import graphismScreenshot from "../assets/screenshots/graphisme-maternelle.png";
import writingScreenshot from "../assets/screenshots/ecriture-cp.png";
import { routes } from "../app/routes";
import { DevoirosAvatar } from "./DevoirosAvatar";

const FEATURES = [
  {
    image: activityReading,
    title: "Lire à voix haute",
    text: "Un mot ou une phrase s’affiche, l’enfant le lit et le micro essaie de le reconnaître. S’il hésite ou si le micro ne reconnaît pas le mot, on peut activer les aides ou valider à sa place.",
  },
  {
    image: activityWriting,
    title: "Préparer une fiche d’écriture",
    text: "Je choisis un mot ou une phrase, et Devoiro prépare une page Seyès à imprimer avec un modèle à repasser puis une ligne libre.",
  },
  {
    image: activityGraphism,
    title: "Travailler un peu chaque jour",
    text: "On peut lancer un exercice rapide quand on a cinq minutes, ou suivre un petit parcours quotidien avec plusieurs étapes.",
  },
];

const LEVELS = [
  {
    level: "Maternelle",
    detail: "PS · MS · GS",
    title: "Découvrir avant de vraiment lire",
    text: "Les couleurs et les formes dès la petite section, puis les lettres au hasard ou en chanson, leur son, l’alphabet à repasser et des fiches de graphisme.",
  },
  {
    level: "CP",
    detail: "Début · milieu · fin d’année",
    title: "Passer des mots aux petites phrases",
    text: "Lecture à voix haute, sons complexes, découpage en syllabes si nécessaire, exercices chronométrés ou libres et premières fiches d’écriture cursive.",
  },
  {
    level: "CE1",
    detail: "Début · milieu · fin d’année",
    title: "Gagner en fluidité",
    text: "Des mots plus longs, davantage de phrases et des exercices d’écriture pour continuer à travailler sans transformer les devoirs en marathon.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return <main className="landing-page">
    <header className="landing-header">
      <div className="landing-brand"><span className="brand-mark" aria-hidden="true">D</span><span>Devoiro</span></div>
      <button className="landing-space-button" onClick={() => navigate(routes.profiles)}>Mon espace</button>
    </header>

    <section className="landing-hero">
      <div className="landing-copy">
        <span className="landing-kicker">Pensé pour les devoirs à la maison</span>
        <h1>Un outil pour faire les devoirs ensemble.</h1>
        <p>D’abord créé pour aider mes enfants à lire, Devoiro s’est ensuite ouvert à l’écriture et au graphisme. L’idée reste simple : proposer aux parents des outils concrets pour accompagner les apprentissages à la maison.</p>        <div className="landing-actions">
          <button className="primary-button" onClick={() => navigate(routes.profiles)}>Accéder à mon espace</button>
          <button className="landing-discover-button" onClick={() => document.getElementById("decouvrir")?.scrollIntoView()}>Voir ce qu’on peut faire</button>
        </div>
        <small>Gratuit · sans compte · sans publicité · aucune donnée envoyée</small>
      </div>

      <div className="landing-visual" aria-label="Aperçu des activités Devoiro">
        <div className="landing-word-card"><small>Lis à voix haute</small><strong>papillon</strong><span>Bravo !</span></div>
        <DevoirosAvatar id="devoiros-1" className="landing-character main" />
        <DevoirosAvatar id="devoiros-3" className="landing-character friend" />
        <i className="landing-shape shape-one" /><i className="landing-shape shape-two" />
      </div>
    </section>

    <section className="landing-features" id="decouvrir">
      <div className="landing-section-heading"><span>Concrètement</span><h2>Ce qu’on peut faire avec Devoiro</h2><p>J’essaie de garder chaque activité simple : une consigne claire, peu de réglages et quelque chose d’utilisable tout de suite.</p></div>
      <div className="landing-feature-grid">{FEATURES.map((feature) => <article key={feature.title}>
        <img src={feature.image} alt="" />
        <h3>{feature.title}</h3>
        <p>{feature.text}</p>
      </article>)}</div>
    </section>

    <section className="landing-levels">
      <div className="landing-section-heading"><span>Par niveau</span><h2>Les exercices suivent les apprentissages</h2><p>Pour le moment, Devoiro va jusqu’au CE1 parce que le contenu suit simplement l’âge et les besoins de mes enfants.</p></div>
      <div className="landing-level-grid">{LEVELS.map((item) => <article key={item.level}>
        <div><strong>{item.level}</strong><small>{item.detail}</small></div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </article>)}</div>
    </section>

    <section className="landing-showcase">
      <div className="landing-section-heading"><span>Les fiches à imprimer</span><h2>Le parent prépare, l’enfant travaille sur papier</h2><p>L’écran sert uniquement à composer la fiche. Ensuite, on imprime une vraie page A4.</p></div>
      <article className="landing-showcase-row">
        <div><span>CP · CE1</span><h3>Une fiche d’écriture personnalisée</h3><p>On peut mélanger des mots et des phrases sur une même page, choisir les capitales ou la cursive, puis ajouter jusqu’à quatre exercices.</p></div>
        <img src={writingScreenshot} alt="Configurateur Devoiro préparant une fiche d’écriture Seyès pour le CP" />
      </article>
      <article className="landing-showcase-row reverse">
        <div><span>Maternelle</span><h3>Des gestes graphiques à repasser</h3><p>Le parent choisit la section et les tracés à travailler. Devoiro génère une fiche claire avec des formes en pointillés.</p></div>
        <img src={graphismScreenshot} alt="Configurateur Devoiro préparant une fiche de graphisme pour la maternelle" />
      </article>
    </section>

    <section className="landing-trust">
      <div><strong>Je ne voulais ni compte, ni serveur, ni données à récupérer.</strong><p>Les profils et la progression restent dans le navigateur. Le site est hébergé gratuitement sur GitHub Pages et le projet n’a aucun modèle économique prévu.</p></div>
      <button className="primary-button" onClick={() => navigate(routes.profiles)}>Commencer avec mon enfant</button>
    </section>

    <footer className="landing-footer"><span>Devoiro</span><small>Un projet familial, non commercial et sans publicité.</small></footer>
  </main>;
}
