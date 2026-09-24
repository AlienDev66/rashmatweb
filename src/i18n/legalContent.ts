import { brand } from "../brand";
import type { Locale } from "../i18n/types";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export function privacySections(locale: Locale): LegalSection[] {
  if (locale === "pt") {
    return [
      {
        title: "1. Quem somos",
        paragraphs: [
          `${brand.name} oferece produtos de treino de artes marciais: uma app de atleta para seguir creators e completar programas, e o Creator Studio para publicar camps, sessões e drills.`,
          `Contacto do responsável: ${brand.email}. Suporte: ${brand.supportEmail}. Domínio: ${brand.domain}.`,
        ],
      },
      {
        title: "2. Informação que recolhemos",
        paragraphs: [
          "Recolhemos informação que nos dás e informação gerada quando usas o serviço.",
        ],
        bullets: [
          "Dados de conta — email, nome, password (hashed) ou identificadores OAuth (Apple / Google).",
          "Dados de perfil — avatar, cidade/país, métricas corporais opcionais, estado de membership.",
          "Dados de treino — enrollments, conclusões de sessão, logs, notas, XP, medalhas, favoritos, follows, referrals.",
          "Dados de creator — programas, sessões, drills, capas, vídeos enviados, progresso de alunos.",
          "Dispositivo e uso — versão da app, diagnósticos aproximados, crash logs e analytics básicos para fiabilidade.",
          "Comunicações — mensagens de suporte e preferências de notificação.",
        ],
      },
      {
        title: "3. Como usamos a informação",
        paragraphs: [
          "Usamos dados pessoais para operar e melhorar o produto — não para vender o teu histórico de treino a anunciantes.",
        ],
        bullets: [
          "Autenticar-te e proteger contas.",
          "Entregar programas, vídeo, progresso, XP, leaderboards, follows e referrals.",
          "Permitir que creators publiquem conteúdo e vejam progresso de alunos/followers autorizado.",
          "Enviar emails de produto/conta e (só se ativo) lembretes de treino.",
          "Prevenir abuso, corrigir falhas e cumprir obrigações legais.",
        ],
      },
      {
        title: "4. Bases legais (EEE/UK/Portugal)",
        paragraphs: [
          "Onde o RGPD / UK GDPR se aplica, processamos dados sob: contrato (prestar o serviço), interesses legítimos (segurança, melhoria, fraude), consentimento (notificações/marketing opcional) e obrigação legal quando a lei o exige.",
        ],
      },
      {
        title: "5. Partilha",
        paragraphs: [
          "Partilhamos dados com processadores que ajudam a operar o produto (hosting, autenticação, storage, email). Só processam sob as nossas instruções.",
          "Creators que segues ou em que te inscreves podem ver progresso limitado relacionado com os programas deles. Campos públicos de perfil (nome, avatar) podem aparecer em leaderboards ou listas de followers.",
          "Não vendemos dados pessoais. Podemos divulgar informação se a lei o exigir ou para proteger utilizadores e a plataforma.",
        ],
      },
      {
        title: "6. Transferências internacionais",
        paragraphs: [
          "A infraestrutura pode processar dados na UE e noutras regiões. Quando necessário, usamos salvaguardas adequadas (ex.: cláusulas contratuais-tipo) com processadores.",
        ],
      },
      {
        title: "7. Conservação",
        paragraphs: [
          "Mantemos registos de conta e treino enquanto a conta estiver ativa e por um período razoável depois, para backups, litígios e requisitos legais. Podes pedir eliminação (ver Os teus direitos).",
        ],
      },
      {
        title: "8. Segurança",
        paragraphs: [
          "Usamos medidas standard da indústria (encriptação em trânsito, controlos de acesso, passwords hashed). Nenhum método é 100% seguro; usa uma password forte e única e mantém os dispositivos atualizados.",
        ],
      },
      {
        title: "9. Menores",
        paragraphs: [
          `${brand.name} não se destina a menores de 16 anos. Se acreditas que um menor criou uma conta, contacta ${brand.supportEmail} e tomaremos medidas adequadas.`,
        ],
      },
      {
        title: "10. Os teus direitos",
        paragraphs: [
          "Consoante o teu país, podes ter direitos de acesso, retificação, eliminação, limitação ou portabilidade, e de oposição a certos processamentos. Também podes retirar consentimento quando o processamento se baseia nele.",
          `Para exercer direitos, escreve para ${brand.supportEmail}. Podes apresentar queixa à autoridade de supervisão (em Portugal, a CNPD).`,
        ],
      },
      {
        title: "11. Cookies e tecnologias semelhantes",
        paragraphs: [
          "O site de marketing e o Studio podem usar cookies essenciais para autenticação e segurança. Não corremos trackers de anúncios de terceiros no site de marketing. Ferramentas de analytics, se forem adicionadas depois, serão divulgadas aqui.",
        ],
      },
      {
        title: "12. Alterações",
        paragraphs: [
          "Podemos atualizar esta política. Alterações materiais refletem-se numa nova data de vigência nesta página. Continuar a usar o serviço após alterações significa que aceitas a política atualizada.",
        ],
      },
    ];
  }

  return [
    {
      title: "1. Who we are",
      paragraphs: [
        `${brand.name} provides martial arts training products: an athlete app for following creators and completing programs, and Creator Studio for publishing camps, sessions, and drills.`,
        `Controller contact: ${brand.email}. Support: ${brand.supportEmail}. Service domain: ${brand.domain}.`,
      ],
    },
    {
      title: "2. Information we collect",
      paragraphs: [
        "We collect information you provide and information generated when you use the service.",
      ],
      bullets: [
        "Account data — email, name, password (hashed) or OAuth identifiers (Apple / Google).",
        "Profile data — avatar, city/country, optional body metrics you choose to save, membership status.",
        "Training data — enrollments, session completions, set logs, notes, XP, medals, favorites, follows, referrals.",
        "Creator data — programs, sessions, drills, covers, uploaded videos, student progress for your camps.",
        "Device & usage — app version, approximate diagnostics, crash logs, and basic analytics needed to keep the product reliable.",
        "Communications — messages you send to support, and notification preference toggles.",
      ],
    },
    {
      title: "3. How we use information",
      paragraphs: [
        "We use personal data to operate and improve the product — not to sell your training history to advertisers.",
      ],
      bullets: [
        "Authenticate you and secure accounts.",
        "Deliver programs, video, progress, XP, leaderboards, follows, and referrals.",
        "Let creators publish content and see student/follower progress they are authorized to view.",
        "Send product/account emails and (only if enabled) training reminders.",
        "Prevent abuse, debug issues, and meet legal obligations.",
      ],
    },
    {
      title: "4. Legal bases (EEA/UK/Portugal)",
      paragraphs: [
        "Where GDPR / UK GDPR apply, we process data under: contract (to provide the service you request), legitimate interests (security, product improvement, fraud prevention), consent (optional notifications or marketing where required), and legal obligation when the law requires it.",
      ],
    },
    {
      title: "5. Sharing",
      paragraphs: [
        "We share data with processors that help us run the product (for example hosting, authentication, file storage, and email). They may only process data on our instructions.",
        "Creators you follow or enroll with can see limited athlete progress related to their programs (for example completion and progress percentage). Public profile fields you set (name, avatar) may appear on leaderboards or follower lists.",
        "We do not sell personal data. We may disclose information if required by law or to protect users and the platform.",
      ],
    },
    {
      title: "6. International transfers",
      paragraphs: [
        "Infrastructure may process data in the EU and other regions. Where required, we use appropriate safeguards (such as standard contractual clauses) with processors.",
      ],
    },
    {
      title: "7. Retention",
      paragraphs: [
        "We keep account and training records while your account is active and for a reasonable period afterward for backups, disputes, and legal requirements. You can request deletion (see Your rights).",
      ],
    },
    {
      title: "8. Security",
      paragraphs: [
        "We use industry-standard measures (encryption in transit, access controls, hashed passwords). No method of transmission or storage is 100% secure; please use a strong unique password and keep your devices updated.",
      ],
    },
    {
      title: "9. Children",
      paragraphs: [
        `${brand.name} is not directed at children under 16. If you believe a minor has created an account, contact ${brand.supportEmail} and we will take appropriate steps.`,
      ],
    },
    {
      title: "10. Your rights",
      paragraphs: [
        "Depending on where you live, you may have rights to access, correct, delete, restrict, or port your data, and to object to certain processing. You may also withdraw consent where processing is based on consent.",
        `To exercise rights, email ${brand.supportEmail}. You may lodge a complaint with your local supervisory authority (in Portugal, the CNPD).`,
      ],
    },
    {
      title: "11. Cookies & similar tech",
      paragraphs: [
        "The marketing site and Studio may use essential cookies for authentication and security. We do not run third-party ad trackers on the marketing site. Analytics tools, if added later, will be disclosed here.",
      ],
    },
    {
      title: "12. Changes",
      paragraphs: [
        "We may update this policy. Material changes will be reflected by a new effective date on this page. Continued use after changes means you accept the updated policy.",
      ],
    },
  ];
}

export function termsSections(locale: Locale): LegalSection[] {
  if (locale === "pt") {
    return [
      {
        title: "1. O serviço",
        paragraphs: [
          `${brand.name} oferece ferramentas de treino estruturado de artes marciais: atletas podem explorar creators, seguir perfis, desbloquear ou inscrever-se em programas, treinar com sessões em vídeo e acompanhar progresso; creators podem publicar programas, enviar média e ver atividade de alunos/followers.`,
          "As funcionalidades podem mudar à medida que lançamos atualizações. Algumas capacidades (pagamentos, notificações ou builds de loja) podem estar em early access ou modo demo.",
        ],
      },
      {
        title: "2. Contas",
        paragraphs: [
          "Deves fornecer informação correta e manter as credenciais seguras. És responsável pela atividade na tua conta. Avisa-nos rapidamente de uso não autorizado.",
          "Deves ter pelo menos 16 anos (ou a idade de consentimento digital no teu país) para usar o serviço.",
        ],
      },
      {
        title: "3. Uso por atletas",
        paragraphs: [
          "O conteúdo de treino é educativo e relacionado com fitness. És responsável pela tua saúde e segurança. Consulta um médico antes de um novo programa. Para se sentires dor ou tonturas.",
          `${brand.name} não é um serviço médico e não substitui coaching de um instrutor qualificado num ginásio ao vivo.`,
        ],
      },
      {
        title: "4. Creator Studio e conteúdo",
        paragraphs: [
          "Se publicas como creator, declaras que possuis ou tens direitos sobre o conteúdo que envias (vídeo, imagens, texto) e que não infringe direitos de terceiros nem viola a lei.",
          `Concedes à ${brand.name} uma licença mundial, não exclusiva, para alojar, fazer stream, mostrar e distribuir o teu conteúdo conforme necessário para operar a plataforma e para marketing do serviço (ex.: capas de programas em rashmat.app).`,
          "Podemos remover conteúdo ou suspender contas abusivas, ilegais, enganadoras ou prejudiciais à comunidade.",
        ],
      },
      {
        title: "5. Uso aceitável",
        paragraphs: ["Não abuses da plataforma."],
        bullets: [
          "Sem scraping, engenharia inversa ou ataques ao serviço.",
          "Sem personificação, assédio, ódio ou conteúdo ilegal.",
          "Sem malware ou tentativas de contornar segurança ou paywalls.",
          "Sem usar a conta de outro utilizador sem permissão.",
        ],
      },
      {
        title: "6. Pagamentos e subscrições",
        paragraphs: [
          "Funcionalidades pagas, se existirem, serão descritas no checkout. Preços, impostos e renovação serão mostrados antes de confirmares.",
          "Compras na app nativa podem ser processadas pela Apple ou Google sob os respetivos termos. Pagamentos web podem usar processadores terceiros. Checkouts demo ou sandbox não são cobranças reais.",
          "Exceto quando a lei o exigir, as taxas não são reembolsáveis depois de um programa digital ou período ter sido entregue.",
        ],
      },
      {
        title: "7. Propriedade intelectual",
        paragraphs: [
          `A marca, software e UI da plataforma ${brand.name} são nossos ou dos nossos licenciantes. Creators mantêm a propriedade do conteúdo original sujeito à licença acima. Materiais da rules library são de referência; os regulamentos oficiais das federações prevalecem.`,
        ],
      },
      {
        title: "8. Exclusões de garantia",
        paragraphs: [
          `O SERVIÇO É PRESTADO “TAL COMO ESTÁ” E “CONFORME DISPONÍVEL”. NA MÁXIMA EXTENSÃO PERMITIDA POR LEI, A ${brand.name} EXCLUI GARANTIAS DE COMERCIABILIDADE, ADEQUAÇÃO A UM FIM ESPECÍFICO E NÃO INFRAÇÃO. Não garantimos disponibilidade ininterrupta nem que os resultados de treino correspondam aos teus objetivos.`,
        ],
      },
      {
        title: "9. Limitação de responsabilidade",
        paragraphs: [
          `NA MÁXIMA EXTENSÃO PERMITIDA POR LEI, A ${brand.name} E A SUA EQUIPA NÃO SÃO RESPONSÁVEIS POR DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS, NEM POR PERDA DE LUCROS, DADOS OU GOODWILL. A NOSSA RESPONSABILIDADE TOTAL POR RECLAMAÇÕES RELACIONADAS COM O SERVIÇO LIMITA-SE AOS MONTANTES QUE NOS PAGASTE NOS 12 MESES ANTERIORES À RECLAMAÇÃO (OU €50 SE NÃO PAGASTE NADA).`,
          "Nada nestes Termos limita responsabilidade que não possa ser limitada por lei aplicável (incluindo morte ou lesão pessoal causada por negligência quando essa limitação é proibida).",
        ],
      },
      {
        title: "10. Cessação",
        paragraphs: [
          "Podes deixar de usar o serviço a qualquer momento. Podemos suspender ou terminar o acesso se violares estes Termos ou se descontinuarmos o produto. Cláusulas que devam sobreviver (IP, exclusões, limites de responsabilidade) sobrevivem à cessação.",
        ],
      },
      {
        title: "11. Lei aplicável",
        paragraphs: [
          `Estes Termos regem-se pelas leis de ${brand.legal.governingLaw}, sem prejuízo das regras de conflitos de leis. Os tribunais em Portugal têm jurisdição exclusiva, salvo proteções de consumo obrigatórias no teu país de residência.`,
        ],
      },
      {
        title: "12. Alterações",
        paragraphs: [
          "Podemos atualizar estes Termos. A data de vigência no topo desta página muda quando o fizermos. Continuar a usar após atualizações constitui aceitação. Se discordares, deixa de usar o serviço.",
        ],
      },
      {
        title: "13. Contacto",
        paragraphs: [`Legal e suporte: ${brand.email} / ${brand.supportEmail}.`],
      },
    ];
  }

  return [
    {
      title: "1. The service",
      paragraphs: [
        `${brand.name} provides structured martial arts training tools: athletes can browse creators, follow profiles, unlock or enroll in programs, train with video sessions, and track progress; creators can publish programs, upload media, and view student/follower activity.`,
        "Features may change as we ship updates. Some capabilities (for example payments, notifications, or store builds) may be in early access or demo mode.",
      ],
    },
    {
      title: "2. Accounts",
      paragraphs: [
        "You must provide accurate information and keep credentials secure. You are responsible for activity under your account. Notify us promptly of unauthorized use.",
        "You must be at least 16 (or the age of digital consent in your country) to use the service.",
      ],
    },
    {
      title: "3. Athlete use",
      paragraphs: [
        "Training content is educational and fitness-related. You are responsible for your own health and safety. Consult a physician before starting a new training program. Stop if you feel pain or dizziness.",
        `${brand.name} is not a medical service and does not replace coaching from a qualified instructor in a live gym environment.`,
      ],
    },
    {
      title: "4. Creator Studio & content",
      paragraphs: [
        "If you publish as a creator, you represent that you own or have rights to the content you upload (video, images, text) and that it does not infringe others’ rights or violate law.",
        `You grant ${brand.name} a worldwide, non-exclusive license to host, stream, display, and distribute your content as needed to operate the platform for athletes and for marketing the service (for example program covers on rashmat.app).`,
        "We may remove content or suspend accounts that are abusive, illegal, misleading, or harmful to the community.",
      ],
    },
    {
      title: "5. Acceptable use",
      paragraphs: ["Do not abuse the platform."],
      bullets: [
        "No scraping, reverse engineering, or attacking the service.",
        "No impersonation, harassment, hate, or illegal content.",
        "No uploading malware or attempting to bypass security or paywalls.",
        "No using another user’s account without permission.",
      ],
    },
    {
      title: "6. Payments & subscriptions",
      paragraphs: [
        "Paid features, if offered, will be described at checkout. Prices, taxes, and renewal terms will be shown before you confirm.",
        "Native app purchases may be processed by Apple or Google under their terms. Web payments may use third-party processors. Demo or sandbox checkouts are not real charges.",
        "Except where required by law, fees are non-refundable once a digital program or period has been delivered.",
      ],
    },
    {
      title: "7. Intellectual property",
      paragraphs: [
        `${brand.name} branding, software, and platform UI are owned by us or our licensors. Creators retain ownership of their original content subject to the license above. Rules library materials are provided for reference; official federation rulebooks always control.`,
      ],
    },
    {
      title: "8. Disclaimers",
      paragraphs: [
        `THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${brand.name} DISCLAIMS WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not guarantee uninterrupted availability or that training outcomes will match your goals.`,
      ],
    },
    {
      title: "9. Limitation of liability",
      paragraphs: [
        `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${brand.name} AND ITS TEAM ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR CLAIMS RELATING TO THE SERVICE IS LIMITED TO THE AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM (OR €50 IF YOU PAID NOTHING).`,
        "Nothing in these Terms limits liability that cannot be limited under applicable law (including for death or personal injury caused by negligence where such limitation is prohibited).",
      ],
    },
    {
      title: "10. Termination",
      paragraphs: [
        "You may stop using the service at any time. We may suspend or terminate access if you violate these Terms or if we discontinue the product. Provisions that should survive (IP, disclaimers, liability limits) will survive termination.",
      ],
    },
    {
      title: "11. Governing law",
      paragraphs: [
        `These Terms are governed by the laws of ${brand.legal.governingLaw}, without regard to conflict-of-law rules. Courts in Portugal have exclusive jurisdiction, except that you may have mandatory consumer protections in your country of residence.`,
      ],
    },
    {
      title: "12. Changes",
      paragraphs: [
        "We may update these Terms. The effective date at the top of this page will change when we do. Continued use after updates constitutes acceptance. If you disagree, stop using the service.",
      ],
    },
    {
      title: "13. Contact",
      paragraphs: [`Legal and support: ${brand.email} / ${brand.supportEmail}.`],
    },
  ];
}
