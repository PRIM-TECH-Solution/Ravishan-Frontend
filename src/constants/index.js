import {
  imprimante1,
  pdf1,
  IMPRIMANTE_PANTUM_CP2200DW,
  
} from "../assets/images/index";

import "./style.css";


// =================== NavBarList Start here ====================
export const navBarList = [
  {
    _id: 1001,
    title: "Home",
    link: "/",
  },
  {
    _id: 1002,
    title: "Events",
    link: "/shop",
  },
  {
    _id: 1003,
    title: "About",
    link: "/about",
  },
  {
    _id: 1004,
    title: "Contact",
    link: "contact",
  },
  {
    _id: 1005,
    title: "Login",
    link: "/signin",
  },
];
// =================== NavBarList End here ======================
// =================== Special Offer data Start here ============
export const SplOfferData = [
  {
    _id: "201",
    img: imprimante1,
    productName: "imprimante",
    price: "35.00",
    color: "Blank and White",
    badge: true,
    des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
    cat: "imprimante",
  },
  
];
// =================== Special Offer data End here ==============

// =================== PaginationItems Start here ===============

export const paginationItems = [

  
  {
    _id: "201",
    img: IMPRIMANTE_PANTUM_CP2200DW,
    productName: "Imprimante PANTUM CP2200DW",
    price: "35.00",
    color: "Blanc",
    badge: true,
    brand: "Pantum",
    des: "Imprimante Laser PANTUM Couleur - Fonctions: Impression  - Technologie d'impression: Laser - Format Papier: A4 - Vitesse d’impression(Couleur/N&B): 24 ppm (A4) / 26 ppm (Lettre) - Résolution d'impression: 600 x 600 dpi - Sortie papier: 100 page - Mémoire: Double cœur, 1 GHz - Impression recto verso: Automatique - Heure de la première impression: Moins de 11s  - Connecteurs: USB 2.0 haut débit Ethernet 10/100/1000 BaseTX (RJ-45) 802.11b/g/n Sans fil - Dimensions: 411.2 x 394.1 x 243.7mm - Poids: 16,1 kg - Couleur: Blanc",
    cat: "Imprimante",
    pdf: pdf1,
    ficheTech: [
      { label: "Technology ", value: "Electrophotographic monochrome laser " },
      { label: "Print speed ", value: "22 ppm (A4)/23 ppm (Letter)" },

      { label: "First print out time ", value: "Less than 7.8s       " },
      { label: "Maximum Monthly Duty Cycle", value: "15,000 pages " },
      {
        label: "Recommended monthly volume Resolution(dpi) ",
        value: "700 pages ",
      },
      { label: "Printer language Duplex Mode ", value: "Max. 1,200×1,200 " },
      { label: "Printer  ", value: "Max. 1,2   " },
      { label: "galass  ", value: "Max. 1,2   " },
    ],
  },
  
];
