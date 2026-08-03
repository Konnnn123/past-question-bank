import audit from "../../data/architect-person-audit-final.json";
import type { ArchitectLearningCard } from "@/types/history-learning-card";

const l = (ja: string, zh: string, en?: string) => en ? ({ ja, zh, en }) : ({ ja, zh });

const AUDIT_ONE_ENGLISH = {
  name: "Abraham Darby III",
  period: "1750–1791",
  summary: "English ironmaster and industrial entrepreneur whose Coalbrookdale works enabled cast iron to be used at an unprecedented architectural and engineering scale.",
  lifeSummary: "Darby III directed the Coalbrookdale ironworks during the Industrial Revolution and supplied the cast-iron components for the Iron Bridge.",
  designPrinciple: "Apply the capabilities of cast iron to structural members while coordinating fabrication, assembly, and long-span construction.",
  recurringFeature: "Prefabricated cast-iron ribs, repeated members, jointing adapted from timber construction, and an explicit expression of structural material.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Iron Bridge at Coalbrookdale, designed by Thomas Farnolls Pritchard and executed under Darby III, was completed in 1779 as the first major bridge made of cast iron and a landmark of industrial construction.",
};

const AUDIT_TWO_ENGLISH = {
  name: "Giles Gilbert Scott",
  period: "1880–1960",
  summary: "English architect who combined monumental masonry, modern engineering, and a restrained Gothic-derived civic language in major twentieth-century public and industrial works.",
  lifeSummary: "Scott practiced during the transition from late historicism to modern construction, designing churches, civic infrastructure, and power stations in Britain.",
  designPrinciple: "Give modern programs and structural systems a durable public presence through carefully proportioned mass, brickwork, and vertical accents.",
  recurringFeature: "Monumental brick facades, simplified Gothic verticality, prominent chimneys or towers, and industrial interiors organized by large-span engineering.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Battersea Power Station in London, designed with J. Theo Halliday, used a monumental brick envelope and four chimneys to transform an industrial power plant into a lasting metropolitan landmark.",
};

const AUDIT_THREE_ENGLISH = {
  name: "Fritz Hoger",
  period: "1877–1949",
  summary: "German architect known for Brick Expressionism, in which fired brick, vertical massing, and sculptural detail gave commercial architecture a powerful urban identity.",
  lifeSummary: "Hoger practiced chiefly in northern Germany during the interwar period, when brick construction became a principal medium of regional modern expression.",
  designPrinciple: "Use the constructive and ornamental capacities of brick to make large commercial buildings read as sculpted urban masses.",
  recurringFeature: "Dark clinker brick, sharply faceted corners, vertical piers, stepped silhouettes, and richly modeled masonry details.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Chilehaus in Hamburg, completed in 1924, is an iconic Brick Expressionist office building whose sharp prow-like corner and intricate brickwork made it a landmark of interwar commercial architecture.",
};

const AUDIT_FOUR_ENGLISH = {
  name: "Andre Le Notre",
  period: "1613–1700",
  summary: "French landscape architect who gave the formal garden its most influential Baroque expression through long axes, controlled vistas, water, and terrain modeling.",
  lifeSummary: "Le Notre worked for Louis XIV and transformed royal landscape design into an instrument of ceremonial movement, visual control, and political representation.",
  designPrinciple: "Organize architecture, garden, water, and horizon as a single axial composition extending royal order into the landscape.",
  recurringFeature: "Long central axes, parterres, radial paths, canals, reflecting pools, clipped bosquets, and perspectival manipulation of terrain.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The gardens of the Palace of Versailles established the French formal garden as a model of Baroque landscape planning, joining the palace to a vast system of axes, water, and ceremonial views.",
};

const AUDIT_FIVE_ENGLISH = {
  name: "Vitruvius",
  period: "1st century BCE",
  summary: "Roman architect, engineer, and theorist whose treatise De architectura provided the most influential surviving account of classical building, proportion, and the architectural orders.",
  lifeSummary: "Writing in the age of Augustus, Vitruvius brought together Greek and Roman knowledge of construction, machinery, urban health, temples, and proportion.",
  designPrinciple: "Ground architecture in firmitas, utilitas, and venustas: structural soundness, practical usefulness, and beauty.",
  recurringFeature: "Proportional orders, modular measurement, anthropomorphic analogy, tectonic clarity, and attention to climate, orientation, and civic use.",
  phaseLabel: "Treatise and influence",
  phaseDescription: "De architectura codified the Roman orders and classical architectural theory; its rediscovery in the Renaissance made Vitruvius a fundamental authority for architects and theorists from Alberti onward.",
};

const AUDIT_SIX_ENGLISH = {
  name: "Elias of Dereham",
  period: "c. 1180–1246",
  summary: "English cleric and building administrator associated with the construction of Salisbury Cathedral, one of the clearest expressions of Early English Gothic architecture.",
  lifeSummary: "Elias of Dereham served the cathedral chapter and is documented as a leading organizer and overseer of the Salisbury building campaign in the thirteenth century.",
  designPrinciple: "Coordinate liturgical planning, disciplined proportion, and Gothic structural practice to produce a unified cathedral ensemble.",
  recurringFeature: "Pointed arches, lancet windows, clustered shafts, a long coherent nave, restrained Early English detailing, and close integration of church and precinct.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Salisbury Cathedral, begun in 1220, is a landmark of Early English Gothic for its unusually unified campaign, lancet-rich elevation, and later central spire, the tallest in Britain.",
};

const AUDIT_SEVEN_ENGLISH = {
  name: "Gerhard von Rile",
  period: "c. 1210–1271",
  summary: "German master builder traditionally identified as the first architect of Cologne Cathedral, who introduced the French High Gothic cathedral system to the Rhineland on an exceptional scale.",
  lifeSummary: "Gerhard directed the initial medieval campaign for Cologne Cathedral after 1248, adapting French Rayonnant construction to the ambitions of the Cologne chapter and pilgrimage city.",
  designPrinciple: "Use a skeletal Gothic system of pointed arches, rib vaults, buttresses, and traceried elevations to unite height, light, and structural clarity.",
  recurringFeature: "Tall nave elevations, clustered piers, flying buttresses, extensive tracery, radiant chapels, and a rigorously articulated stone skeleton.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Cologne Cathedral began under Gerhard von Rile in 1248 and became the most ambitious German reception of the French High Gothic cathedral, influencing medieval construction in the Rhineland.",
};

const AUDIT_EIGHT_ENGLISH = {
  name: "Dominique Perrault",
  period: "1953–",
  summary: "French architect whose civic projects use abstract geometry, metal and glass envelopes, and landscape to redefine the symbolic presence of public institutions.",
  lifeSummary: "Perrault gained international prominence with the Bibliotheque nationale de France commission under Francois Mitterrand's Grands Projets program.",
  designPrinciple: "Create institutional identity through elemental massing, carefully controlled emptiness, and the tension between transparent enclosure and protected interior.",
  recurringFeature: "Four-part compositions, glass and metal facades, large civic voids, sunken landscapes, and precise infrastructural circulation.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Bibliotheque nationale de France, often called the Francois Mitterrand Library, arranges four L-shaped glass towers around a sunken forest and became a major late-twentieth-century French civic project.",
};

const AUDIT_NINE_ENGLISH = {
  name: "Jaume Fabre",
  period: "c. 1285–1346",
  summary: "Catalan Gothic master builder associated with the early construction campaign of Barcelona Cathedral, where Mediterranean Gothic combined wide spatial bays with austere vertical form.",
  lifeSummary: "Fabre worked in fourteenth-century Barcelona as a master of ecclesiastical construction and is credited with initiating the cathedral's major Gothic campaign.",
  designPrinciple: "Adapt Gothic structural discipline to the broad, measured proportions and restrained material character of the Catalan urban church.",
  recurringFeature: "Wide bays, robust piers, pointed arches, rib vaults, restrained ornament, and an integrated cloister and cathedral precinct.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Barcelona Cathedral, begun in 1298 with Jaume Fabre associated with its early Gothic design, is a principal monument of Catalan Gothic ecclesiastical architecture.",
};

const AUDIT_TEN_ENGLISH = {
  name: "Pierre Bullet",
  period: "1639–1716",
  summary: "French architect whose work belongs to the late seventeenth- and early eighteenth-century Parisian tradition of aristocratic residences and refined interior decoration.",
  lifeSummary: "Bullet worked in Paris at a time when the hotel particulier developed increasingly elaborate ceremonial rooms and decorative schemes for elite patrons.",
  designPrinciple: "Coordinate architecture, ornament, and the sequence of reception rooms to give domestic interiors a coherent ceremonial character.",
  recurringFeature: "Measured classical planning, richly articulated boiseries, mirrors, stucco ornament, and carefully framed salon interiors.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Summer Room at the Hotel de Soubise belongs to the celebrated Parisian tradition of aristocratic interior decoration, where architecture and ornament frame an intimate ceremonial space.",
};

const AUDIT_ELEVEN_ENGLISH = {
  name: "Friedrich von Gartner",
  period: "1791–1847",
  summary: "German architect who shaped nineteenth-century Munich through a learned historicism, using Italian Renaissance and Rundbogenstil sources for major civic institutions.",
  lifeSummary: "As court architect to Ludwig I of Bavaria, Gartner directed major public works and helped give Munich a monumental cultural and administrative identity.",
  designPrinciple: "Adapt historical architectural languages to modern public programs, urban ensembles, and the cultural ambitions of the Bavarian state.",
  recurringFeature: "Round arches, arcades, symmetrical civic facades, polychrome detail, Italianate Renaissance references, and carefully ordered urban fronts.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Bavarian State Library in Munich is a major nineteenth-century institutional building, demonstrating Gartner's use of historicist form to express scholarship, state patronage, and urban monumentality.",
};

const AUDIT_TWELVE_ENGLISH = {
  name: "Buscheto and Rainaldo",
  period: "11th–12th centuries",
  summary: "Italian master builders associated with successive campaigns for Pisa Cathedral, a Romanesque monument that combined classical spolia, striped marble, and a strong basilican order.",
  lifeSummary: "Buscheto is traditionally credited with the cathedral's initial design, while Rainaldo led later work that developed its facade and established appearance.",
  designPrinciple: "Unite basilican planning, classical columns, arcades, and colored stone into a ceremonially legible Romanesque ensemble.",
  recurringFeature: "Alternating marble courses, blind arcades, columned galleries, broad transepts, basilican volume, and a strong relation to the Piazza dei Miracoli.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Pisa Cathedral, begun under Buscheto and developed by Rainaldo, became the central monument of Pisan Romanesque and established the architectural language of the Piazza dei Miracoli.",
};

const AUDIT_THIRTEEN_ENGLISH = {
  name: "Jan Blazej Santini-Aichel",
  period: "1677–1723",
  summary: "Bohemian architect who fused Gothic structural memory with Baroque spatial invention in a distinctive style often called Baroque Gothic.",
  lifeSummary: "Santini-Aichel worked for ecclesiastical patrons in Bohemia, reinterpreting medieval forms through the geometry, movement, and symbolism of the late Baroque.",
  designPrinciple: "Transform Gothic precedent into dynamic central geometries that unite symbolic number, light, structure, and pilgrimage ritual.",
  recurringFeature: "Star plans, interlocking curves, pointed arches recast in Baroque form, complex vaults, radiant windows, and highly symbolic geometry.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Pilgrimage Church of St John of Nepomuk at Zelena Hora is Santini-Aichel's best-known Baroque Gothic work, organized around a five-pointed star and a pilgrimage circuit.",
};

const AUDIT_FOURTEEN_ENGLISH = {
  name: "Justinian I and Anthemius of Tralles",
  period: "6th century CE",
  summary: "Byzantine emperor and mathematician-architect associated with the rebuilding of Hagia Sophia, where imperial patronage and advanced dome construction created a new model of sacred space.",
  lifeSummary: "Justinian commissioned Hagia Sophia after the Nika revolt; Anthemius of Tralles, with Isidore of Miletus, devised its unprecedented centralized and basilican structural system.",
  designPrinciple: "Use pendentives, piers, semi-domes, and light to make an imperial Christian interior appear unified, expansive, and immaterial.",
  recurringFeature: "A vast pendentive dome, cascading semi-domes, ring windows, massive piers, marble revetment, and a luminous centralized nave.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Hagia Sophia in Constantinople became the defining monument of Byzantine architecture and a long-standing reference for Orthodox, Ottoman, and later domed sacred buildings.",
};

const AUDIT_FIFTEEN_ENGLISH = {
  name: "Johann Bernhard Fischer von Erlach",
  period: "1656–1723",
  summary: "Austrian architect and theorist who gave Habsburg Baroque architecture its most ambitious synthesis of Roman, French, and imperial precedents.",
  lifeSummary: "Fischer von Erlach worked for the Habsburg court in Vienna and used architecture and historical scholarship to project imperial universality.",
  designPrinciple: "Fuse diverse historical prototypes into a dramatic yet ordered monument capable of expressing dynastic, religious, and urban authority.",
  recurringFeature: "Colossal orders, domes, triumphal columns, curving masses, theatrical approaches, and learned quotation of ancient and Baroque forms.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Karlskirche in Vienna combines a domed church, Roman-style triumphal columns, and a monumental urban facade, making it a central statement of Habsburg Baroque architecture.",
};

const AUDIT_SIXTEEN_ENGLISH = {
  name: "Josef Hoffmann",
  period: "1870–1956",
  summary: "Austrian architect and designer who moved Viennese Secession design toward severe geometric order and total works of art across architecture, interiors, furnishings, and craft.",
  lifeSummary: "A co-founder of the Wiener Werkstatte, Hoffmann joined design education, artisanal production, and refined domestic architecture in early twentieth-century Vienna.",
  designPrinciple: "Coordinate every scale of design through proportion, geometry, material precision, and the integration of craft.",
  recurringFeature: "Square grids, simplified volumes, black-and-white contrasts, custom furnishings, rich materials, and meticulously composed interiors.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Second Moll House demonstrates Hoffmann's controlled domestic geometry and total-design method, which helped move Viennese design from Secession ornament toward early modern abstraction.",
};

const AUDIT_SEVENTEEN_ENGLISH = {
  name: "Joseph Maria Olbrich",
  period: "1867–1908",
  summary: "Austrian architect who designed the Secession Building as the public manifesto of Vienna's break with academic art institutions and historicist convention.",
  lifeSummary: "Olbrich was a leading member of the Vienna Secession and later worked at the Darmstadt Artists' Colony, linking exhibition architecture, graphic identity, and new domestic design.",
  designPrinciple: "Give a new artistic community a clear public identity through geometric form, symbolic ornament, and integrated visual design.",
  recurringFeature: "White cubic masses, a gilded laurel dome, planar facades, stylized inscriptions, and abstracted floral ornament.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Secession Building in Vienna served as the exhibition hall and emblem of the Vienna Secession, marking a decisive turn from historicism toward geometric modern design.",
};

const AUDIT_EIGHTEEN_ENGLISH = {
  name: "Jorn Utzon", period: "1918–2008",
  summary: "Danish architect who joined additive geometry, marine imagery, and prefabricated concrete shells in an architecture of monumental public assembly.",
  lifeSummary: "Utzon won the 1957 competition for the Sydney Opera House and developed its shell roofs through an extended collaboration with engineers and fabricators.",
  designPrinciple: "Generate form from repeatable geometric systems while giving civic spaces a strong relation to landscape, horizon, and procession.",
  recurringFeature: "Segmental shell roofs, elevated podiums, tiled surfaces, modular geometry, dramatic approaches, and layered public terraces.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Sydney Opera House transformed precast concrete shell construction into a global cultural landmark and remains a seminal work of postwar expressive modernism.",
};
const AUDIT_NINETEEN_ENGLISH = {
  name: "Richard Norman Shaw", period: "1831–1912",
  summary: "English architect who developed the Queen Anne Revival and a picturesque domestic language that combined vernacular references with modern middle-class life.",
  lifeSummary: "Shaw's houses and urban work helped redefine British domestic architecture in the late nineteenth century and influenced the Arts and Crafts movement.",
  designPrinciple: "Compose domestic buildings as informal, site-responsive groupings of familiar materials, varied rooflines, and crafted detail.",
  recurringFeature: "Red brick, gables, tall chimneys, sash windows, asymmetrical plans, roughcast surfaces, and picturesque silhouettes.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Kate Greenaway's Home and Studio, also known as the Studio House, exemplifies Shaw's picturesque Queen Anne Revival approach to the artist's house and studio.",
};
const AUDIT_TWENTY_ENGLISH = {
  name: "Richard Rogers", period: "1933–2021",
  summary: "British architect who made structure, circulation, and services visible to create adaptable public buildings identified with High-Tech architecture.",
  lifeSummary: "Rogers co-designed major cultural and civic projects with Renzo Piano and later developed a practice centered on flexible, environmentally responsive urban buildings.",
  designPrinciple: "Place servicing and circulation at the edge of the building to free adaptable interior space and make technical systems legible.",
  recurringFeature: "Exoskeletal frames, external service ducts, color-coded components, transparent facades, large-span floors, and public circulation devices.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Centre Pompidou in Paris, designed with Renzo Piano, externalized structure and services to create an open cultural interior and became the emblem of High-Tech architecture.",
};
const AUDIT_TWENTY_ONE_ENGLISH = {
  name: "Lluis Domenech i Montaner", period: "1850–1923",
  summary: "Catalan architect who combined structural innovation, craft, and regional cultural symbolism in the major public works of Catalan Modernisme.",
  lifeSummary: "Domenech i Montaner was an architect, teacher, and political figure who used architecture to articulate a modern Catalan civic culture.",
  designPrinciple: "Unite modern structure with ceramics, mosaic, sculpture, stained glass, and regional iconography in a total civic work of art.",
  recurringFeature: "Exposed iron, brick piers, polychrome ceramics, stained glass, sculptural ornament, and richly lit assembly spaces.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Palau de la Musica Catalana integrates iron structure and elaborate Catalan craft into a luminous concert hall, making it a masterwork of Catalan Modernisme.",
};
const AUDIT_TWENTY_TWO_ENGLISH = {
  name: "Louis Le Vau", period: "1612–1670",
  summary: "French Baroque architect who established the early architectural form of Versailles and helped define the grand classical language of Louis XIV's court.",
  lifeSummary: "Le Vau served royal and aristocratic patrons in seventeenth-century France, working with Andre Le Notre and Charles Le Brun on integrated palace and landscape projects.",
  designPrinciple: "Use ordered classical composition, ceremonial planning, and controlled enlargement to give royal power a clear architectural expression.",
  recurringFeature: "Symmetrical facades, mansard roofs, rhythmic classical orders, ceremonial suites, courtyards, and strong connections to garden axes.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Le Vau's early enlargement of the Palace of Versailles established the architectural framework later extended by Jules Hardouin-Mansart, becoming the model of the French royal palace.",
};
const AUDIT_TWENTY_THREE_ENGLISH = {
  name: "Luciano Laurana", period: "c. 1420–1479",
  summary: "Dalmatian-born Italian Renaissance architect whose work at the Ducal Palace in Urbino established a refined language of proportion, perspective, and courtly spatial sequence.",
  lifeSummary: "Laurana worked for Federico da Montefeltro at Urbino, where humanist learning and princely representation made the palace a laboratory for early Renaissance design.",
  designPrinciple: "Use measured classical proportion, perspectival order, and carefully graded circulation to make the palace an instrument of cultivated court life.",
  recurringFeature: "Arcaded courtyards, restrained orders, perspectival interiors, delicate stone detailing, and a sequence from public court to private studiolo.",
  phaseLabel: "Representative work and attribution",
  phaseDescription: "Laurana's principal work is the Ducal Palace at Urbino. The audit-linked Palazzo Rucellai is conventionally associated with Leon Battista Alberti's design and Bernardo Rossellino's execution, rather than Laurana.",
};
const AUDIT_TWENTY_FOUR_ENGLISH = {
  name: "Renzo Piano", period: "1937–",
  summary: "Italian architect who combines advanced engineering, light structure, and precise detailing with an interest in adaptable public space and urban repair.",
  lifeSummary: "Piano gained international recognition through the Centre Pompidou collaboration and developed a practice spanning museums, cultural buildings, infrastructure, and urban regeneration.",
  designPrinciple: "Make technical systems, daylight, and flexible space work together as a finely engineered civic framework.",
  recurringFeature: "Lightweight metal structures, transparent envelopes, exposed services, daylight roofs, modular components, and carefully calibrated public circulation.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Centre Pompidou, designed with Richard Rogers, established a radically open cultural building in which services and circulation are externalized to free the interior for changing exhibitions.",
};
const AUDIT_TWENTY_FIVE_ENGLISH = {
  name: "Robert van 't Hoff", period: "1887–1979",
  summary: "Dutch architect whose early experiments in reinforced concrete and abstract composition anticipated central concerns of De Stijl architecture.",
  lifeSummary: "Van 't Hoff worked in the Netherlands during the emergence of modernist and De Stijl ideas, exploring how new construction could dissolve the conventional closed house.",
  designPrinciple: "Use reinforced concrete and independent planes to open domestic space and reduce form to an abstract structural composition.",
  recurringFeature: "Cantilevers, flat roofs, white volumes, horizontal window bands, free corners, and interlocking planes.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Villa Henny at Huis ter Heide is an early Dutch concrete house whose planar composition and open corners anticipated the spatial experiments of De Stijl.",
};
const AUDIT_TWENTY_SIX_ENGLISH = {
  name: "Robert de Luzarches", period: "13th century",
  summary: "French master mason traditionally associated with the initial campaign of Amiens Cathedral, a defining monument of High Gothic verticality and structural refinement.",
  lifeSummary: "Although medieval attributions remain partly uncertain, Robert de Luzarches is conventionally named among the early masters of the Amiens building campaign begun in 1220.",
  designPrinciple: "Push the skeletal Gothic system toward exceptional height and light through rigorous coordination of vaults, piers, buttresses, and traceried openings.",
  recurringFeature: "Soaring nave elevations, pointed arches, clustered piers, flying buttresses, large clerestory windows, and an attenuated vertical rhythm.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Amiens Cathedral is one of the culminating achievements of French High Gothic, renowned for its height, coherent structural system, and expansive luminous interior.",
};
const AUDIT_TWENTY_SEVEN_ENGLISH = {
  name: "Walter Gropius and Adolf Meyer", period: "1883–1969; 1881–1929",
  summary: "German architects who collaborated on early modern industrial and exhibition buildings, using glass, steel, and structural clarity to recast the factory as a public image of production.",
  lifeSummary: "Before the Bauhaus, Gropius and Meyer worked together on influential industrial projects that established the visual vocabulary of European modernism.",
  designPrinciple: "Make industrial production visible through rational structure, daylight, standardized components, and a clear separation of enclosing skin from frame.",
  recurringFeature: "Glass curtain walls, steel frames, repetitive bays, expressed stair towers, open workshops, and carefully organized circulation.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Their Model Factory at the 1914 Cologne Werkbund Exhibition publicized a new industrial architecture of glass and frame, extending ideas developed in the Fagus Factory.",
};
const AUDIT_TWENTY_EIGHT_ENGLISH = {
  name: "Kenjiro Maeda", period: "1892–1975",
  summary: "Japanese architect associated with the institutional architecture of the early Showa period, in which modern planning was combined with monumental civic representation.",
  lifeSummary: "Maeda worked on public commissions during Japan's interwar modernization, when museums and civic buildings became key instruments of urban cultural policy.",
  designPrinciple: "Give public cultural institutions clear circulation, durable construction, and a dignified civic presence.",
  recurringFeature: "Symmetrical planning, formal entrances, robust masonry or concrete massing, restrained historicist detail, and carefully scaled galleries.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Kyoto City Museum of Art, now the Kyoto City KYOCERA Museum of Art, is a major early Showa civic museum whose monumental composition anchored Okazaki's cultural district.",
};
const AUDIT_TWENTY_NINE_ENGLISH = {
  name: "Tetsuro Yoshida", period: "1894–1956",
  summary: "Japanese architect and postal engineer who developed a rational, materially precise modernism for communications facilities in the interwar and postwar periods.",
  lifeSummary: "Yoshida worked for Japan's communications administration and used public infrastructure projects to explore a restrained synthesis of modern construction and Japanese spatial sensibility.",
  designPrinciple: "Express institutional efficiency through clear structure, proportion, light, and carefully controlled material detail.",
  recurringFeature: "Brick and stone surfaces, rational openings, restrained ornament, orderly facades, and efficient circulation for public service buildings.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Kyoto Central Telephone Office Kamigyo Branch demonstrates Yoshida's disciplined approach to communications architecture and helped establish the modern public-building language of the postal service.",
};
const AUDIT_THIRTY_ENGLISH = {
  name: "Junzo Masuzawa", period: "1925–2016",
  summary: "Japanese architect who explored compact modern housing through structural rationality, standardized components, and flexible spatial organization.",
  lifeSummary: "Masuzawa's postwar domestic work addressed the need for economical, adaptable housing while engaging debates on industrialization and the minimum dwelling.",
  designPrinciple: "Concentrate services and structure to free the dwelling for flexible daily use.",
  recurringFeature: "Compact timber or steel frames, service cores, open living areas, modular planning, light construction, and economical detailing.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "House with a Core for Mr. H is a key postwar experiment in concentrating domestic services within a core to make a small house adaptable and spatially open.",
};
const AUDIT_THIRTY_ONE_ENGLISH = {
  name: "Yoshikuni Okuma", period: "1871–1944",
  summary: "Japanese architect and government engineer associated with the long Imperial Diet Building project, which gave national government a monumental modern institutional form.",
  lifeSummary: "Okuma worked within the state building administration during the late Meiji and Taisho periods, when the Diet building was developed through extended professional and governmental debate.",
  designPrinciple: "Represent national institutions through durable construction, formal hierarchy, and a monumental yet ordered composition.",
  recurringFeature: "Symmetrical massing, central towers, axial planning, stone cladding, classical abstraction, and large ceremonial interiors.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Imperial Diet Building in Tokyo, completed in 1936, gave the Japanese parliament a monumental national image and became a defining work of prewar state architecture.",
};
const AUDIT_THIRTY_TWO_ENGLISH = {
  name: "Shinichiro Okada", period: "1883–1932",
  summary: "Japanese architect who used modern structural planning and historical reference to create major civic buildings in early twentieth-century Japan.",
  lifeSummary: "Okada worked during the expansion of municipal public architecture, designing cultural and civic facilities that negotiated international historicism and modern urban programs.",
  designPrinciple: "Organize public assembly and civic ceremony through clear plan, robust structure, and a formally legible urban facade.",
  recurringFeature: "Monumental entries, symmetrical facades, masonry expression, auditorium planning, and restrained historicist composition.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Osaka City Central Public Hall is a landmark civic assembly building whose auditorium, public rooms, and monumental facade made it an enduring symbol of Osaka's modern municipal culture.",
};
const AUDIT_THIRTY_THREE_ENGLISH = {
  name: "Roku Iwamoto", period: "1877–1966",
  summary: "Japanese architect and communications engineer associated with the early modern development of telephone buildings in Kyoto.",
  lifeSummary: "Iwamoto worked during the expansion of national communications infrastructure, when public service buildings combined technical functions with prominent urban facades.",
  designPrinciple: "Integrate evolving communications technology with orderly planning and a durable civic architectural presence.",
  recurringFeature: "Rational floor layouts, regular window rhythms, robust masonry or concrete construction, and restrained public-facing detail.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Kyoto Central Telephone Office Nishijin Branch represents the modernization of Japanese communications architecture and the expansion of telephone service into historic urban districts.",
};
const AUDIT_THIRTY_FOUR_ENGLISH = {
  name: "Nikken Sekkei", period: "1900–present",
  summary: "Japanese architecture and engineering practice that has shaped large-scale corporate, civic, and urban projects through integrated professional design.",
  lifeSummary: "Originating from the architectural office of Sumitomo, Nikken Sekkei became one of Japan's leading design organizations during postwar reconstruction and metropolitan growth.",
  designPrinciple: "Coordinate architecture, engineering, urban context, and long-term adaptability at the scale of complex institutional projects.",
  recurringFeature: "Large structural frames, modular planning, carefully managed circulation, urban-scale facades, and integrated building services.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Palace Side Building in Tokyo is a major postwar office complex whose long horizontal frame and urban relationship to the Imperial Palace helped define Japanese corporate modernism.",
};
const AUDIT_THIRTY_FIVE_ENGLISH = {
  name: "Sone Chujo Architects", period: "1908–",
  summary: "Japanese architectural practice founded by Tatsuzo Sone and Seiichiro Chujo, known for major commercial and institutional works during the modernization of early twentieth-century Japan.",
  lifeSummary: "The office combined professional organization with advanced structural and planning knowledge to serve banks, companies, schools, and public institutions.",
  designPrinciple: "Give modern institutions durable, legible form through orderly plans, robust structure, and carefully controlled public facades.",
  recurringFeature: "Symmetrical composition, masonry or stone facades, formal entrances, rational offices, and a balance of historicist dignity with modern construction.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Tokyo Marine Building demonstrates Sone Chujo Architects' role in establishing a professional language for modern Japanese commercial architecture.",
};
const AUDIT_THIRTY_SIX_ENGLISH = {
  name: "Tatsuzo Sone and Seiichiro Chujo", period: "1853–1937; 1887–1968",
  summary: "Japanese architects whose partnership joined advanced engineering, institutional planning, and a disciplined architectural language for modern educational and commercial buildings.",
  lifeSummary: "Their practice became a major force in early twentieth-century Japanese architecture, serving private institutions and corporate clients during rapid national modernization.",
  designPrinciple: "Organize modern institutions through durable construction, clear circulation, and an appropriate civic image.",
  recurringFeature: "Ordered facades, masonry construction, formal entrances, modular interiors, and a blend of historical reference with modern planning.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "Keio University's Fiftieth Anniversary Memorial Library is an important academic building that illustrates the Sone Chujo office's contribution to university architecture in modern Japan.",
};
const AUDIT_THIRTY_SEVEN_ENGLISH = {
  name: "Seigo Motono", period: "1882–1944",
  summary: "Japanese architect and educator who explored modern spatial composition and regional material expression in the architecture of interwar Kyoto.",
  lifeSummary: "Motono taught and practiced in Kyoto, where he addressed the relation between modern building types, local industry, and the city's craft traditions.",
  designPrinciple: "Use modern structural and spatial methods while giving regional materials and local production a clear architectural role.",
  recurringFeature: "Expressive brickwork, rational frames, daylighted exhibition areas, clear circulation, and a dialogue between industrial program and urban context.",
  phaseLabel: "Representative work and influence",
  phaseDescription: "The Nishijin Textile Hall connected Kyoto's textile industry to modern exhibition and commercial architecture, demonstrating Motono's engagement with regional production and modern design.",
};
const AUDIT_THIRTY_EIGHT_ENGLISH = { name: "Takamitsu Azuma", period: "1933–2006", summary: "Japanese architect who used compact urban sites to test radical vertical domestic space in postwar Tokyo.", lifeSummary: "Azuma worked amid rapid metropolitan growth, when small plots and new lifestyles prompted experiments in dense private architecture.", designPrinciple: "Turn the constraints of the narrow city lot into a concentrated sequence of open vertical spaces.", recurringFeature: "Exposed concrete, stacked floors, narrow footprints, roof terraces, split levels, and direct engagement with the street.", phaseLabel: "Representative work and influence", phaseDescription: "Tower House in Tokyo is a canonical small urban dwelling, demonstrating how vertical section and exposed concrete could make a tiny plot architecturally expansive." };
const AUDIT_THIRTY_NINE_ENGLISH = { name: "Kiyoshi Seike", period: "1918–2005", summary: "Japanese architect who developed light, flexible postwar houses through timber construction, open planning, and close attention to everyday life.", lifeSummary: "Seike's teaching and domestic work helped establish a human-scaled Japanese modernism after the Second World War.", designPrinciple: "Use simple structure and adaptable rooms to support changing domestic patterns without losing a connection to garden and climate.", recurringFeature: "Light timber frames, sliding partitions, deep eaves, open living spaces, modular planning, and careful transitions to outdoors.", phaseLabel: "Representative work and influence", phaseDescription: "The House for Assistant Professor Saito is an important early postwar experiment in flexible domestic planning and helped shape the discourse on modern Japanese housing." };
const AUDIT_FORTY_ENGLISH = { name: "Kisuke Shimizu", period: "1820–1890", summary: "Japanese master builder who helped introduce Western-style commercial and financial architecture during the early Meiji period.", lifeSummary: "Working at the transition from late Edo building practice to Meiji modernization, Shimizu adapted imported forms and construction methods to new institutional programs.", designPrinciple: "Translate Western institutional form into buildable structures suited to Japanese craft, materials, and emerging commercial needs.", recurringFeature: "Brick or stone-like facades, classical openings, regular bays, formal entrances, and hybrid Western-Japanese construction techniques.", phaseLabel: "Representative work and influence", phaseDescription: "The First National Bank was an early Meiji financial institution whose Western-style architectural image helped establish the public language of modern banking in Japan." };
const AUDIT_FORTY_ONE_ENGLISH = { name: "Jin Watanabe", period: "1887–1973", summary: "Japanese architect who gave major public and cultural institutions a monumental modern form through disciplined planning and historically inflected facades.", lifeSummary: "Watanabe worked in the late Taisho and early Showa periods, when museums and state institutions were used to project national culture and administrative authority.", designPrinciple: "Combine modern institutional planning with a monumental, legible public image appropriate to cultural collections.", recurringFeature: "Symmetrical facades, stone or concrete massing, central entrances, formal galleries, restrained ornament, and carefully staged public approaches.", phaseLabel: "Representative work and influence", phaseDescription: "The Tokyo Imperial Museum, now the Tokyo National Museum Honkan, became a defining example of prewar Japanese museum architecture and its modernized imperial style." };
const AUDIT_FORTY_TWO_ENGLISH = { name: "Arata Isozaki", period: "1931–2022", summary: "Japanese architect and theorist who moved from Metabolist-era megastructure to historically conscious postmodernism and globally influential cultural architecture.", lifeSummary: "Isozaki emerged from postwar debates on reconstruction and urban growth, then became a leading interpreter and critic of Japanese architecture on the international stage.", designPrinciple: "Use architecture as a critical apparatus that can shift between technology, history, urban scale, and cultural reference.", recurringFeature: "Geometric fragmentation, monumental plazas, exposed structural systems, layered historical allusion, and complex civic circulation.", phaseLabel: "Representative work and influence", phaseDescription: "Tsukuba Center Building staged a postmodern civic center through classical references, urban axes, and fragmented geometry, making it a major work of Japanese postmodernism." };
const AUDIT_FORTY_THREE_ENGLISH = { name: "Kiyoshige Tateishi", period: "19th century", summary: "Japanese master builder associated with early Meiji educational architecture, where Western-style construction was adapted to local carpentry and civic instruction.", lifeSummary: "Tateishi worked during the first decades of Japan's modernization, when new schools used architecture to signal public education and technological reform.", designPrinciple: "Adapt imported Western forms to familiar timber construction, practical climate response, and the public role of the school.", recurringFeature: "Timber framing, verandas, symmetrical facades, Western-style columns, painted surfaces, and hybrid construction details.", phaseLabel: "Representative work and influence", phaseDescription: "The Former Kaichi School in Matsumoto is one of the best-known surviving examples of early Meiji giyofu architecture, combining Western motifs with Japanese building practice." };
const AUDIT_FORTY_FOUR_ENGLISH = { name: "Zokei-shudan", period: "1970–present", summary: "Japanese collaborative architecture practice known for participatory, climate-responsive, and materially expressive public buildings rooted in local communities.", lifeSummary: "Zokei-shudan emerged from post-1960s critiques of centralized professional practice and developed projects through close engagement with place, users, and regional culture.", designPrinciple: "Make public architecture grow from local climate, collective use, craft, and the everyday life of its community.", recurringFeature: "Deep eaves, shaded outdoor rooms, layered circulation, exposed materials, participatory planning, and strong ties to landscape.", phaseLabel: "Representative work and influence", phaseDescription: "Nago City Hall in Okinawa uses deep shading, open terraces, and concrete structure to create a climate-responsive civic building rooted in local public life." };
const AUDIT_FORTY_FIVE_ENGLISH = { name: "Arata Endo", period: "1889–1951", summary: "Japanese architect and former associate of Frank Lloyd Wright who adapted organic planning and decorative craftsmanship to major hotels and institutions in Japan.", lifeSummary: "Endo worked in the Taisho and early Showa periods, carrying lessons from Wright's Imperial Hotel into an independent Japanese practice.", designPrinciple: "Integrate structure, ornament, landscape, and guest circulation into a unified spatial experience.", recurringFeature: "Layered terraces, textured masonry, geometric ornament, low horizontal massing, carefully framed approaches, and integrated interiors.", phaseLabel: "Representative work and influence", phaseDescription: "Koshien Hotel is Endo's major work, translating Wrightian spatial and ornamental ideas into a resort hotel that became an important landmark of Japanese modern architecture." };
const AUDIT_FORTY_SIX_ENGLISH = { name: "Magoichi Noguchi", period: "1869–1915", summary: "Japanese architect who contributed to the modernization of public architecture through libraries and civic buildings in the late Meiji period.", lifeSummary: "Noguchi practiced as Japan developed professional architectural institutions and commissioned new public facilities for education, administration, and urban culture.", designPrinciple: "Give public knowledge institutions rational planning, durable construction, and an appropriately dignified civic presence.", recurringFeature: "Masonry facades, formal entrances, reading-room organization, regular structural bays, and restrained historicist detailing.", phaseLabel: "Representative work and influence", phaseDescription: "Osaka Library is an important early modern public library building, illustrating the development of civic cultural infrastructure in Meiji Japan." };
const AUDIT_FORTY_SEVEN_ENGLISH = { name: "Kanekichi Takahashi", period: "Meiji period", summary: "Japanese builder associated with early modern local-government architecture, in which Western-style public form was adapted to regional construction methods.", lifeSummary: "Takahashi worked during the Meiji transformation of prefectural and county administration, when new offices made governmental authority visible in provincial towns.", designPrinciple: "Combine practical local construction with a legible Western-influenced public image for new administrative institutions.", recurringFeature: "Timber structure, symmetrical elevation, verandas, Western-style columns, regular window rhythms, and hybrid decorative detail.", phaseLabel: "Representative work and influence", phaseDescription: "The Former Nishitagawa County Office is a surviving example of regional Meiji public architecture and documents the spread of Western-influenced administrative building across Japan." };

type AuditRow = {
  nameJa: string;
  status: string;
  buildings: { buildingId: string; buildingNameJa: string }[];
};

const candidates = (audit.rows as AuditRow[]).filter(
  (row) => row.status === "architect-card-candidate"
);

export const FINAL_AUDIT_ARCHITECT_CARDS: ArchitectLearningCard[] = candidates.map((row, index) => {
  const works = row.buildings.map((building) => building.buildingNameJa).join("・");
  const english = [AUDIT_ONE_ENGLISH, AUDIT_TWO_ENGLISH, AUDIT_THREE_ENGLISH, AUDIT_FOUR_ENGLISH, AUDIT_FIVE_ENGLISH, AUDIT_SIX_ENGLISH, AUDIT_SEVEN_ENGLISH, AUDIT_EIGHT_ENGLISH, AUDIT_NINE_ENGLISH, AUDIT_TEN_ENGLISH, AUDIT_ELEVEN_ENGLISH, AUDIT_TWELVE_ENGLISH, AUDIT_THIRTEEN_ENGLISH, AUDIT_FOURTEEN_ENGLISH, AUDIT_FIFTEEN_ENGLISH, AUDIT_SIXTEEN_ENGLISH, AUDIT_SEVENTEEN_ENGLISH, AUDIT_EIGHTEEN_ENGLISH, AUDIT_NINETEEN_ENGLISH, AUDIT_TWENTY_ENGLISH, AUDIT_TWENTY_ONE_ENGLISH, AUDIT_TWENTY_TWO_ENGLISH, AUDIT_TWENTY_THREE_ENGLISH, AUDIT_TWENTY_FOUR_ENGLISH, AUDIT_TWENTY_FIVE_ENGLISH, AUDIT_TWENTY_SIX_ENGLISH, AUDIT_TWENTY_SEVEN_ENGLISH, AUDIT_TWENTY_EIGHT_ENGLISH, AUDIT_TWENTY_NINE_ENGLISH, AUDIT_THIRTY_ENGLISH, AUDIT_THIRTY_ONE_ENGLISH, AUDIT_THIRTY_TWO_ENGLISH, AUDIT_THIRTY_THREE_ENGLISH, AUDIT_THIRTY_FOUR_ENGLISH, AUDIT_THIRTY_FIVE_ENGLISH, AUDIT_THIRTY_SIX_ENGLISH, AUDIT_THIRTY_SEVEN_ENGLISH, AUDIT_THIRTY_EIGHT_ENGLISH, AUDIT_THIRTY_NINE_ENGLISH, AUDIT_FORTY_ENGLISH, AUDIT_FORTY_ONE_ENGLISH, AUDIT_FORTY_TWO_ENGLISH, AUDIT_FORTY_THREE_ENGLISH, AUDIT_FORTY_FOUR_ENGLISH, AUDIT_FORTY_FIVE_ENGLISH, AUDIT_FORTY_SIX_ENGLISH, AUDIT_FORTY_SEVEN_ENGLISH][index];
  return {
    id: `architect-audit-${index + 1}`,
    kind: "architect",
    name: l(row.nameJa, row.nameJa, english?.name),
    aliases: [],
    period: l("年代は作品カードを参照", "年代请参见作品卡", english?.period),
    regions: ["global"],
    summary: l(
      `${works}の設計者・設計組織として建築データベースで確認された人物・組織。`,
      `作为${works}的设计者或设计组织，已在建筑数据库中确认。`,
      english?.summary
    ),
    lifeSummary: l(
      "設計者としての関係は確認済み。人物史の詳細は今後の出典補強で更新する。",
      "其设计者关系已确认；人物经历细节将在后续补充来源时更新。",
      english?.lifeSummary
    ),
    designPrinciples: [l("代表作品との関係を起点に学習する。", "从与代表作品的关系开始学习。", english?.designPrinciple)],
    recurringFeatures: [l("作品カード・真題証拠との双方向リンク。", "与作品卡和真题证据双向关联。", english?.recurringFeature)],
    careerPhases: [{
      label: l("収録作品", "已收录作品", english?.phaseLabel),
      description: l(works, works, english?.phaseDescription),
      buildingIds: row.buildings.map((building) => building.buildingId),
    }],
    keywords: [],
    relatedBuildingIds: row.buildings.map((building) => building.buildingId),
    relatedPersonIds: [],
    relatedCardIds: [],
    influencedByIds: [],
    influencedIds: [],
    examEvidence: [],
    reviewStatus: "draft",
  };
});
