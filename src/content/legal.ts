/**
 * Legal notice (aviso legal, LSSI-CE art. 10) and privacy & cookie policy
 * (GDPR arts. 13–14, LOPDGDD, LSSI-CE art. 22.2).
 *
 * Facts used here were confirmed by the user or verified on 26 Nov 2026:
 * - Operator details: src/config/site.ts → site.legal.
 * - Live-site audit (clean browser): every request goes to scholteestates.com
 *   only; no analytics, advertising, embeds or external fonts. Cookies: only
 *   NEXT_LOCALE after a language switch. No local storage. Maps (MapLibre,
 *   OpenStreetMap tiles, label fonts) are served from /map on our own domain.
 *   Google Maps embed (property pages) loads only after the visitor clicks
 *   "Load Google Maps" (two-click consent); described in the cookie section. (The "Powered by
 *   Netlify" badge was switched off on 26 Nov 2026; re-checked on the live site.)
 * - Transfers: Netlify, Inc., Google LLC and Meta Platforms, Inc. are active
 *   participants in the EU-U.S. Data Privacy Framework (dataprivacyframework.gov).
 * Re-check all of this whenever a service, form or script is added.
 */
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";

export type Block =
  | { p: string }
  | { ul: string[] }
  | { dl: [string, string][] }
  | { table: { head: string[]; rows: string[][] } };

export interface LegalSection {
  id: string;
  h: string;
  blocks: Block[];
}

export interface LegalDoc {
  title: string;
  lead: string;
  updatedLabel: string;
  sections: LegalSection[];
}

const L = site.legal;
const months = L.enquiryRetentionMonths;
/** Analytics text appears only once a GA4 measurement ID is configured. */
const ga = Boolean(site.analytics.ga4MeasurementId);

const en = {
  legal: {
    title: "Legal notice",
    lead: "Information about the owner of this website, as required by Spanish law (Law 34/2002 on information society services, LSSI-CE).",
    updatedLabel: `Last updated: ${L.updated.en}`,
    sections: [
      {
        id: "owner",
        h: "Website owner",
        blocks: [
          {
            dl: [
              ["Owner", `${L.operator}, trading as ${L.tradingAs}`],
              ["Legal form", "Self-employed individual (autónomo), not a company"],
              ["NIF", L.nif],
              ["Address", L.address.join(", ")],
              ["", "Legal and correspondence address. No client reception."],
              ["Email", site.contact.email],
              ["Phone", site.contact.phoneDisplay],
              ["Website", site.domain],
            ],
          },
        ],
      },
      {
        id: "activity",
        h: "Activity",
        blocks: [
          {
            p: "Scholte Estates is an independent real estate agency based in Ciudad Quesada (Rojales, Alicante). It helps buyers find and purchase homes on the Costa Blanca. The registration of this real estate activity with the competent authority is being processed; its details will be published on this page once available.",
          },
        ],
      },
      {
        id: "example-homes",
        h: "Example homes on this website",
        blocks: [
          {
            p: "The homes currently shown on this website are fictional examples, marked “Demo”. Their names, descriptions, prices and images (generated with AI) illustrate how we present properties. They are not for sale and are not an offer. Neighbourhood images are illustrative scenes and do not show real places or distances.",
          },
        ],
      },
      {
        id: "use",
        h: "Use of the website",
        blocks: [
          {
            p: "The information on this website is general and for guidance only. It is not legal, tax or financial advice. Buyers should obtain advice from their own independent lawyer and other professionals before making decisions. We take care to keep the information accurate and up to date, but we cannot guarantee that it is complete or free of errors at all times.",
          },
          {
            p: "Links to external services (such as WhatsApp) lead to websites that we do not control. Their own terms and privacy policies apply there.",
          },
        ],
      },
      {
        id: "ip",
        h: "Intellectual property",
        blocks: [
          {
            p: "The texts, design and the Scholte Estates name and logo belong to Christian Scholte. You may not copy, reproduce or distribute them for commercial purposes without written permission. Sharing a link to a page is welcome.",
          },
        ],
      },
      {
        id: "law",
        h: "Applicable law",
        blocks: [
          {
            p: "This website is governed by Spanish law. If you are a consumer, you keep the protection given to you by the law and courts of your place of residence.",
          },
          { p: "Personal data is handled as described in our Privacy and cookie policy." },
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy and cookie policy",
    lead: "How we handle your personal data when you visit this website or contact us, and which cookies and similar technologies are used.",
    updatedLabel: `Last updated: ${L.updated.en}`,
    sections: [
      {
        id: "controller",
        h: "Who is responsible",
        blocks: [
          {
            dl: [
              ["Data controller", `${L.operator}, trading as ${L.tradingAs}`],
              ["NIF", L.nif],
              ["Address", `${L.address.join(", ")} (correspondence only, no client reception)`],
              ["Privacy contact", L.privacyEmail],
              ["Phone", site.contact.phoneDisplay],
            ],
          },
          { p: "We have not appointed a data protection officer; this is not required for a business of our size and activity." },
        ],
      },
      {
        id: "data",
        h: "What data we process",
        blocks: [
          { p: "This website has no contact forms, user accounts or newsletter. We only receive personal data when you choose to contact us:" },
          {
            ul: [
              "By email: your name, email address and whatever you write to us.",
              "By WhatsApp or phone: your name, phone number and the content of the conversation.",
              "During a property search: your requirements, budget, preferred areas and timing, and later the documents needed for a purchase.",
            ],
          },
          {
            p: "When you visit the website, our hosting provider Netlify automatically processes technical data needed to deliver the pages and keep them secure, such as your IP address, browser type and the pages requested (server logs). We do not use advertising tools." + (ga ? " If you accept analytics cookies, Google Analytics also measures how the website is used (see Cookies); we do not use it to identify you." : " We do not use analytics tools, and we do not create visitor profiles."),
          },
        ],
      },
      {
        id: "purposes",
        h: "Why we process it, and on what legal basis",
        blocks: [
          {
            table: {
              head: ["Purpose", "Legal basis (GDPR)"],
              rows: [
                ["Answering your questions and helping with your property search", "Steps taken at your request before a contract (art. 6.1.b)"],
                ["Providing our services if you instruct us", "Performance of a contract (art. 6.1.b)"],
                ["Identification and records required by law, for example anti-money-laundering and tax rules", "Legal obligation (art. 6.1.c)"],
                ["Delivering and protecting the website (server logs)", "Our legitimate interest in a secure, working website (art. 6.1.f)"],
                ...(ga ? [["Measuring how the website is used (Google Analytics), only if you accept", "Your consent (art. 6.1.a), which you can withdraw at any time under \u201cCookie settings\u201d in the footer"]] : []),
              ],
            },
          },
          { p: "You are not obliged to give us personal data, but without it we cannot answer your enquiry. We do not make automated decisions about you." },
        ],
      },
      {
        id: "retention",
        h: "How long we keep it",
        blocks: [
          {
            ul: [
              `Enquiries that do not lead to an assignment: while we are helping you, and deleted when you tell us you are no longer looking, or at the latest ${months} months after our last contact. Buying from abroad often takes time, so this lets us continue a search you started.`,
              "If we work together on a purchase or sale: for as long as the law requires, for example the identification records required by anti-money-laundering rules and the accounting and tax records required by Spanish law, and afterwards only as long as needed to deal with possible claims.",
              "Server logs: for the short period set by our hosting provider for security and operation.",
            ],
          },
          { p: "You can ask us to delete your data earlier at any time, unless the law requires us to keep it." },
        ],
      },
      {
        id: "recipients",
        h: "Who receives your data",
        blocks: [
          { p: "We do not sell your data or share it for marketing. We use these service providers:" },
          {
            ul: [
              "Netlify, Inc. (website hosting): processes server logs on our behalf.",
              ...(ga ? ["Google Ireland Limited (Google Analytics): if you accept analytics cookies, measures how the website is used, as our processor."] : []),
              "Google (Google Workspace, for our business email): stores the emails you send us, on our behalf.",
              "WhatsApp: if you message us on WhatsApp, the service is provided by WhatsApp Ireland Limited under its own terms and privacy policy, and it is responsible for its own processing.",
            ],
          },
          {
            p: "If a purchase goes ahead and you agree, we share the necessary details with the other parties involved, such as the seller or their agent, lawyers and the notary. Authorities receive data only where the law requires it.",
          },
        ],
      },
      {
        id: "transfers",
        h: "Transfers outside the European Economic Area",
        blocks: [
          {
            p: "Netlify, Google and WhatsApp may process data in the United States. Netlify, Inc., Google LLC and Meta Platforms, Inc. (WhatsApp's parent company) participate in the EU-U.S. Data Privacy Framework, which the European Commission has recognised as providing adequate protection (adequacy decision of 10 July 2023). You can check their status on dataprivacyframework.gov.",
          },
        ],
      },
      {
        id: "rights",
        h: "Your rights",
        blocks: [
          {
            p: `You can ask for access to your data, correction, deletion, restriction of processing, data portability, and you can object to processing. Write to ${L.privacyEmail} or to the address above. We may ask you to confirm your identity.`,
          },
          {
            p: "If you are not satisfied, you can complain to the Spanish Data Protection Agency (Agencia Española de Protección de Datos, www.aepd.es) or the data protection authority of your country.",
          },
        ],
      },
      {
        id: "cookies",
        h: "Cookies and similar technologies",
        blocks: [
          {
            p: (ga ? "We use analytics cookies only if you accept them in the cookie banner, and no advertising or social media cookies." : "We do not use analytics, advertising or social media cookies.") + " Fonts, images and our own maps are served from our own domain (map data © OpenStreetMap contributors). The website loads content from another company only when you ask for it: see Google Maps below. " + (ga ? "We use the following. Strictly necessary items need no consent; analytics cookies are set only after you press \u201cAccept\u201d:" : "Only the following cookie is set by us. It is strictly necessary for a function you request, so no consent banner is needed:"),
          },
          {
            table: {
              head: ["Name", "Type and provider", "Purpose", "Duration"],
              rows: [
                ["NEXT_LOCALE", "Cookie, Scholte Estates", "Remembers the language you chose. Set only when you switch language.", "1 year"],
                ...(ga
                  ? [
                      ["se-consent", "Local storage, Scholte Estates", "Remembers whether you accepted or rejected analytics cookies.", "Until you change it"],
                      ["_ga, _ga_*", "Cookies, Google Analytics", "Distinguish visitors and visits to produce usage statistics. Only if you accept.", "2 years"],
                    ]
                  : []),
              ],
            },
          },
          {
            p: "You can delete or block it in your browser settings; the website keeps working, but your language choice will not be remembered. The WhatsApp, email and phone links open other services only when you use them.",
          },
          {
            p: "Google Maps (optional): on property pages you can switch the map to Google Maps. Nothing is loaded from Google until you press \u201cLoad Google Maps\u201d; by pressing it you agree that the map loads from Google (Google Ireland Ltd / Google LLC). Google then receives your IP address and the page you are on, and may set its own cookies under its privacy policy (policies.google.com/privacy). The \u201cOpen in Google Maps\u201d link takes you to Google\u2019s website. Your choice applies only to that page view; reload the page to remove the Google map.",
          },
        ],
      },
      {
        id: "changes",
        h: "Changes",
        blocks: [{ p: "We will update this policy if our services or the way we handle data change. The date at the top shows the latest version." }],
      },
    ],
  },
} satisfies Record<"legal" | "privacy", LegalDoc>;

const es = {
  legal: {
    title: "Aviso legal",
    lead: "Información sobre el titular de este sitio web, conforme a la Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).",
    updatedLabel: `Última actualización: ${L.updated.es}`,
    sections: [
      {
        id: "owner",
        h: "Titular del sitio web",
        blocks: [
          {
            dl: [
              ["Titular", `${L.operator}, que opera como ${L.tradingAs}`],
              ["Forma jurídica", "Persona física, trabajador autónomo (no es una sociedad)"],
              ["NIF", L.nif],
              ["Domicilio", L.addressEs.join(", ")],
              ["", "Domicilio legal y de correspondencia. No se atiende al público."],
              ["Correo electrónico", site.contact.email],
              ["Teléfono", site.contact.phoneDisplay],
              ["Sitio web", site.domain],
            ],
          },
        ],
      },
      {
        id: "activity",
        h: "Actividad",
        blocks: [
          {
            p: "Scholte Estates es una inmobiliaria independiente con base en Ciudad Quesada (Rojales, Alicante) que ayuda a compradores a encontrar y adquirir viviendas en la Costa Blanca. La inscripción de esta actividad inmobiliaria ante la administración competente está en trámite; sus datos se publicarán en esta página cuando estén disponibles.",
          },
        ],
      },
      {
        id: "example-homes",
        h: "Viviendas de ejemplo en este sitio web",
        blocks: [
          {
            p: "Las viviendas que se muestran actualmente en este sitio web son ejemplos ficticios, marcados como «Demo». Sus nombres, descripciones, precios e imágenes (generadas con IA) ilustran cómo presentamos las propiedades. No están en venta ni constituyen una oferta. Las imágenes de los entornos son escenas ilustrativas y no muestran lugares ni distancias reales.",
          },
        ],
      },
      {
        id: "use",
        h: "Uso del sitio web",
        blocks: [
          {
            p: "La información de este sitio web es general y orientativa. No constituye asesoramiento jurídico, fiscal ni financiero. Antes de tomar decisiones, los compradores deben consultar a su propio abogado independiente y a otros profesionales. Procuramos que la información sea exacta y esté actualizada, pero no podemos garantizar que sea completa o esté libre de errores en todo momento.",
          },
          {
            p: "Los enlaces a servicios externos (como WhatsApp) llevan a sitios que no controlamos, en los que se aplican sus propias condiciones y políticas de privacidad.",
          },
        ],
      },
      {
        id: "ip",
        h: "Propiedad intelectual",
        blocks: [
          {
            p: "Los textos, el diseño y el nombre y logotipo de Scholte Estates pertenecen a Christian Scholte. No se permite copiarlos, reproducirlos ni distribuirlos con fines comerciales sin autorización por escrito. Compartir el enlace a una página está permitido.",
          },
        ],
      },
      {
        id: "law",
        h: "Legislación aplicable",
        blocks: [
          {
            p: "Este sitio web se rige por la legislación española. Si eres consumidor, conservas la protección que te otorgan la ley y los tribunales de tu lugar de residencia.",
          },
          { p: "Los datos personales se tratan según lo descrito en nuestra Política de privacidad y cookies." },
        ],
      },
    ],
  },
  privacy: {
    title: "Política de privacidad y cookies",
    lead: "Cómo tratamos tus datos personales cuando visitas este sitio web o te pones en contacto con nosotros, y qué cookies y tecnologías similares se utilizan.",
    updatedLabel: `Última actualización: ${L.updated.es}`,
    sections: [
      {
        id: "controller",
        h: "Responsable del tratamiento",
        blocks: [
          {
            dl: [
              ["Responsable", `${L.operator}, que opera como ${L.tradingAs}`],
              ["NIF", L.nif],
              ["Domicilio", `${L.addressEs.join(", ")} (solo correspondencia, no se atiende al público)`],
              ["Contacto de privacidad", L.privacyEmail],
              ["Teléfono", site.contact.phoneDisplay],
            ],
          },
          { p: "No hemos designado un delegado de protección de datos, ya que no es obligatorio para un negocio de nuestro tamaño y actividad." },
        ],
      },
      {
        id: "data",
        h: "Qué datos tratamos",
        blocks: [
          { p: "Este sitio web no tiene formularios de contacto, cuentas de usuario ni boletín. Solo recibimos datos personales cuando decides contactarnos:" },
          {
            ul: [
              "Por correo electrónico: tu nombre, tu dirección de correo y lo que nos escribas.",
              "Por WhatsApp o teléfono: tu nombre, tu número de teléfono y el contenido de la conversación.",
              "Durante la búsqueda de una vivienda: tus requisitos, presupuesto, zonas preferidas y plazos y, más adelante, la documentación necesaria para una compra.",
            ],
          },
          {
            p: "Al visitar el sitio web, nuestro proveedor de alojamiento, Netlify, trata automáticamente los datos técnicos necesarios para servir las páginas y protegerlas, como tu dirección IP, el tipo de navegador y las páginas solicitadas (registros del servidor). No utilizamos herramientas de publicidad." + (ga ? " Si aceptas las cookies de analítica, Google Analytics mide además cómo se usa el sitio web (consulta Cookies); no lo usamos para identificarte." : " No utilizamos herramientas de analítica y no elaboramos perfiles de los visitantes."),
          },
        ],
      },
      {
        id: "purposes",
        h: "Para qué los tratamos y con qué base jurídica",
        blocks: [
          {
            table: {
              head: ["Finalidad", "Base jurídica (RGPD)"],
              rows: [
                ["Responder a tus consultas y ayudarte en la búsqueda de vivienda", "Aplicación de medidas precontractuales a petición tuya (art. 6.1.b)"],
                ["Prestar nuestros servicios si nos los encargas", "Ejecución de un contrato (art. 6.1.b)"],
                ["Identificación y registros exigidos por ley, por ejemplo por la normativa de prevención del blanqueo de capitales y la fiscal", "Obligación legal (art. 6.1.c)"],
                ["Servir y proteger el sitio web (registros del servidor)", "Nuestro interés legítimo en un sitio web seguro y operativo (art. 6.1.f)"],
                ...(ga ? [["Medir cómo se usa el sitio web (Google Analytics), solo si lo aceptas", "Tu consentimiento (art. 6.1.a), que puedes retirar en cualquier momento en \u00abConfiguración de cookies\u00bb, en el pie de página"]] : []),
              ],
            },
          },
          { p: "No estás obligado a facilitarnos datos personales, pero sin ellos no podemos atender tu consulta. No tomamos decisiones automatizadas sobre ti." },
        ],
      },
      {
        id: "retention",
        h: "Cuánto tiempo los conservamos",
        blocks: [
          {
            ul: [
              `Consultas que no terminan en un encargo: mientras te estemos ayudando; se eliminan cuando nos indiques que ya no buscas o, como máximo, ${months} meses después de nuestro último contacto. Comprar desde el extranjero suele llevar tiempo, y así podemos retomar una búsqueda que iniciaste.`,
              "Si trabajamos juntos en una compra o venta: durante el tiempo que exige la ley, por ejemplo los registros de identificación de la normativa de prevención del blanqueo de capitales y la documentación contable y fiscal que exige la legislación española y, después, solo mientras sea necesario para atender posibles reclamaciones.",
              "Registros del servidor: durante el breve periodo fijado por nuestro proveedor de alojamiento por motivos de seguridad y funcionamiento.",
            ],
          },
          { p: "Puedes pedirnos en cualquier momento que eliminemos tus datos antes, salvo que la ley nos obligue a conservarlos." },
        ],
      },
      {
        id: "recipients",
        h: "Quién recibe tus datos",
        blocks: [
          { p: "No vendemos tus datos ni los cedemos con fines comerciales. Utilizamos estos proveedores de servicios:" },
          {
            ul: [
              "Netlify, Inc. (alojamiento web): trata los registros del servidor por cuenta nuestra.",
              ...(ga ? ["Google Ireland Limited (Google Analytics): si aceptas las cookies de analítica, mide cómo se usa el sitio web, como encargado del tratamiento."] : []),
              "Google (Google Workspace, para nuestro correo profesional): almacena los correos que nos envías, por cuenta nuestra.",
              "WhatsApp: si nos escribes por WhatsApp, el servicio lo presta WhatsApp Ireland Limited conforme a sus propias condiciones y política de privacidad, y es responsable de su propio tratamiento.",
            ],
          },
          {
            p: "Si una compra sigue adelante y estás de acuerdo, compartiremos los datos necesarios con las demás partes que intervienen, como el vendedor o su agente, los abogados y la notaría. Las autoridades solo reciben datos cuando la ley lo exige.",
          },
        ],
      },
      {
        id: "transfers",
        h: "Transferencias fuera del Espacio Económico Europeo",
        blocks: [
          {
            p: "Netlify, Google y WhatsApp pueden tratar datos en Estados Unidos. Netlify, Inc., Google LLC y Meta Platforms, Inc. (matriz de WhatsApp) participan en el Marco de Privacidad de Datos UE-EE. UU., que la Comisión Europea ha reconocido como garantía de un nivel de protección adecuado (decisión de adecuación de 10 de julio de 2023). Puedes comprobar su estado en dataprivacyframework.gov.",
          },
        ],
      },
      {
        id: "rights",
        h: "Tus derechos",
        blocks: [
          {
            p: `Puedes solicitar el acceso a tus datos, su rectificación, supresión, la limitación del tratamiento y la portabilidad, y oponerte al tratamiento. Escríbenos a ${L.privacyEmail} o a la dirección indicada. Podemos pedirte que acredites tu identidad.`,
          },
          {
            p: "Si no estás conforme, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) o ante la autoridad de protección de datos de tu país.",
          },
        ],
      },
      {
        id: "cookies",
        h: "Cookies y tecnologías similares",
        blocks: [
          {
            p: (ga ? "Solo utilizamos cookies de analítica si las aceptas en el aviso de cookies, y ninguna de publicidad ni de redes sociales." : "No utilizamos cookies de analítica, publicidad ni redes sociales.") + " Las fuentes, las imágenes y nuestros propios mapas se sirven desde nuestro propio dominio (datos del mapa © colaboradores de OpenStreetMap). El sitio web solo carga contenidos de otra empresa cuando lo pides: consulta Google Maps más abajo. " + (ga ? "Utilizamos lo siguiente. Lo estrictamente necesario no requiere consentimiento; las cookies de analítica solo se instalan después de pulsar \u00abAceptar\u00bb:" : "Solo instalamos la siguiente cookie. Es estrictamente necesaria para una función que solicitas, por lo que no se requiere un aviso de consentimiento:"),
          },
          {
            table: {
              head: ["Nombre", "Tipo y proveedor", "Finalidad", "Duración"],
              rows: [
                ["NEXT_LOCALE", "Cookie, Scholte Estates", "Recuerda el idioma que elegiste. Solo se crea al cambiar de idioma.", "1 año"],
                ...(ga
                  ? [
                      ["se-consent", "Almacenamiento local, Scholte Estates", "Recuerda si aceptaste o rechazaste las cookies de analítica.", "Hasta que lo cambies"],
                      ["_ga, _ga_*", "Cookies, Google Analytics", "Distinguen visitantes y visitas para elaborar estadísticas de uso. Solo si aceptas.", "2 años"],
                    ]
                  : []),
              ],
            },
          },
          {
            p: "Puedes eliminarla o bloquearla en la configuración de tu navegador; el sitio web seguirá funcionando, pero no se recordará tu idioma. Los enlaces de WhatsApp, correo y teléfono solo abren otros servicios cuando los utilizas.",
          },
          {
            p: "Google Maps (opcional): en las fichas de las viviendas puedes cambiar el mapa a Google Maps. No se carga nada de Google hasta que pulsas \u00abCargar Google Maps\u00bb; al pulsarlo aceptas que el mapa se cargue desde Google (Google Ireland Ltd / Google LLC). Google recibe entonces tu dirección IP y la página en la que estás, y puede instalar sus propias cookies según su política de privacidad (policies.google.com/privacy). El enlace \u00abAbrir en Google Maps\u00bb te lleva a la web de Google. Tu elección solo vale para esa visita a la página; recárgala para quitar el mapa de Google.",
          },
        ],
      },
      {
        id: "changes",
        h: "Cambios",
        blocks: [{ p: "Actualizaremos esta política si cambian nuestros servicios o la forma en que tratamos los datos. La fecha indicada arriba muestra la versión más reciente." }],
      },
    ],
  },
} satisfies Record<"legal" | "privacy", LegalDoc>;

export const legalContent: Record<Locale, Record<"legal" | "privacy", LegalDoc>> = { en, es };
