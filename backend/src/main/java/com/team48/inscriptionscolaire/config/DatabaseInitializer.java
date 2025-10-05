package com.team48.inscriptionscolaire.config;

import com.team48.inscriptionscolaire.learnModule.LearnModule;
import com.team48.inscriptionscolaire.learnModule.LearnModuleRepository;
import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.program.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final ProgramRepository programRepository;
    private final LearnModuleRepository learnModuleRepository;

    @Override
    public void run(String... args) {
        if (programRepository.count() == 0) {
            System.out.println("Populating database with initial program data...");

            // Create programs
            List<Program> programs = Arrays.asList(
                    Program.builder()
                            .programName("Blockchain et Technologies Décentralisées")
                            .programCode("BCHN")
                            .description("Explorez l'univers révolutionnaire de la blockchain et des technologies décentralisées qui transforment les industries. Ce programme innovant couvre les principes fondamentaux de la blockchain, les smart contracts, les cryptomonnaies, les applications décentralisées (DApps), et les protocoles de consensus. Vous développerez des projets concrets en utilisant Ethereum, Hyperledger et d'autres plateformes blockchain pour créer des solutions décentralisées sécurisées.")
                            .certificateName("Certificat de Spécialisation en Blockchain")
                            .careerProspects("Développeur Blockchain, Architecte de Solutions Décentralisées, Consultant en Cryptomonnaies, Ingénieur Smart Contracts, Spécialiste de la Sécurité Blockchain")
                            .registrationFee(new BigDecimal("580.00"))
                            .maxCapacity(85)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(18) // 18 months
                            .price(new BigDecimal("13500.00")) // 13500 currency units
                            .hoursPerDay(4)
                            .daysPerWeek(3)
                            .courseDays(new HashSet<>(Arrays.asList("MONDAY", "WEDNESDAY", "FRIDAY")))
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(13, 0))
                            .build(),
                    Program.builder()
                            .programName("Cloud Computing et Architecture des Systèmes Distribués")
                            .programCode("CCLD")
                            .description("Devenez expert en cloud computing et architectures distribuées pour déployer des solutions informatiques évolutives et résilientes. Ce programme avancé couvre les principes du cloud computing, les architectures microservices, la conteneurisation avec Docker et Kubernetes, l'orchestration, et les services cloud des principaux fournisseurs (AWS, Azure, GCP). Vous apprendrez à concevoir et déployer des infrastructures cloud sécurisées et optimisées.")
                            .certificateName("Certificat d'Expert en Cloud Computing")
                            .careerProspects("Architecte Cloud, Ingénieur DevOps, Spécialiste Kubernetes, Consultant Cloud, Administrateur de Systèmes Distribués")
                            .registrationFee(new BigDecimal("620.00"))
                            .maxCapacity(100)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(24) // 24 months
                            .price(new BigDecimal("14500.00")) // 14500 currency units
                            .hoursPerDay(5)
                            .daysPerWeek(4)
                            .courseDays(new HashSet<>(Arrays.asList("TUESDAY", "THURSDAY", "SATURDAY")))
                            .startTime(LocalTime.of(14, 0))
                            .endTime(LocalTime.of(19, 0))
                            .build(),
                    Program.builder()
                            .programName("Communication Digitale et Stratégies de Contenu")
                            .programCode("CDIG")
                            .description("Maîtrisez les stratégies de communication sur les plateformes numériques pour créer des expériences engageantes et mémorables. Ce programme innovant couvre la création de contenu digital, la gestion de communauté, l'influence marketing, l'analyse d'audience, et les tendances émergentes en communication digitale. Vous apprendrez à développer des campagnes intégrées qui connectent les marques avec leur public cible.")
                            .certificateName("Certificat de Spécialisation en Communication Digitale")
                            .careerProspects("Responsable Communication Digitale, Community Manager, Stratège de Contenu, Spécialiste en Marketing de Contenu, Consultant en Influence Digitale")
                            .registrationFee(new BigDecimal("420.00"))
                            .maxCapacity(180)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(12) // 12 months
                            .price(new BigDecimal("8500.00")) // 8500 currency units
                            .hoursPerDay(3)
                            .daysPerWeek(2)
                            .courseDays(new HashSet<>(Arrays.asList("MONDAY", "THURSDAY")))
                            .startTime(LocalTime.of(10, 0))
                            .endTime(LocalTime.of(13, 0))
                            .build(),
                    Program.builder()
                            .programName("Cybersécurité et Protection des Systèmes d'Information")
                            .programCode("CYBS")
                            .description("Devenez un expert en cybersécurité capable de protéger les systèmes informatiques et les réseaux contre les cybermenaces. Ce programme approfondi couvre la cryptographie, la gestion des risques, l'analyse des vulnérabilités, la réponse aux incidents de sécurité, et les normes de conformité. Vous acquerrez les compétences nécessaires pour concevoir et mettre en œuvre des architectures sécurisées dans des environnements d'entreprise.")
                            .certificateName("Certificat de Spécialisation en Cybersécurité")
                            .careerProspects("Analyste en Cybersécurité, Ingénieur de Sécurité, Responsable RSSI, Consultant en Sécurité Informatique, Expert en Réponse aux Incidents")
                            .registrationFee(new BigDecimal("600.00"))
                            .maxCapacity(120)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(24) // 24 months
                            .price(new BigDecimal("14000.00")) // 14000 currency units
                            .hoursPerDay(6)
                            .daysPerWeek(3)
                            .courseDays(new HashSet<>(Arrays.asList("TUESDAY", "FRIDAY", "SUNDAY")))
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(15, 0))
                            .build(),
                    Program.builder()
                            .programName("Développement Web et Applications Interactives")
                            .programCode("DWEB")
                            .description("Maîtrisez les technologies modernes de développement web pour créer des applications interactives et réactives. Ce programme complet couvre HTML5, CSS3, JavaScript, les frameworks front-end comme React et Vue.js, les technologies back-end avec Node.js et Spring Boot, les bases de données relationnelles et NoSQL, l'architecture RESTful, et les bonnes pratiques de déploiement. Vous développerez des projets complets depuis la conception jusqu'à la mise en production.")
                            .certificateName("Certificat de Développeur Web Full Stack")
                            .careerProspects("Développeur Web Front-End, Développeur Web Back-End, Ingénieur Full Stack, Architecte d'Applications Web, Spécialiste en Déploiement Web")
                            .registrationFee(new BigDecimal("480.00"))
                            .maxCapacity(160)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(18) // 18 months
                            .price(new BigDecimal("11000.00")) // 11000 currency units
                            .hoursPerDay(5)
                            .daysPerWeek(4)
                            .courseDays(new HashSet<>(Arrays.asList("MONDAY", "WEDNESDAY", "FRIDAY", "SATURDAY")))
                            .startTime(LocalTime.of(14, 0))
                            .endTime(LocalTime.of(19, 0))
                            .build(),
                    Program.builder()
                            .programName("Design Graphique et Création Visuelle")
                            .programCode("DGRH")
                            .description("Libérez votre créativité en maîtrisant les principes fondamentaux du design graphique et de la création visuelle. Ce programme pratique couvre la théorie des couleurs, la typographie, la composition visuelle, le branding, et l'utilisation des logiciels de design professionnels comme Adobe Creative Suite. Vous développerez un portfolio impressionnant en travaillant sur des projets réels pour des clients.")
                            .certificateName("Certificat de Designer Graphique Professionnel")
                            .careerProspects("Designer Graphique, Directeur Artistique, Spécialiste en Branding, Illustrateur, Concepteur d'Interfaces Utilisateur")
                            .registrationFee(new BigDecimal("350.00"))
                            .maxCapacity(140)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(12) // 12 months
                            .price(new BigDecimal("7000.00")) // 7000 currency units
                            .hoursPerDay(4)
                            .daysPerWeek(3)
                            .courseDays(new HashSet<>(Arrays.asList("TUESDAY", "THURSDAY", "SATURDAY")))
                            .startTime(LocalTime.of(10, 0))
                            .endTime(LocalTime.of(14, 0))
                            .build(),
                    Program.builder()
                            .programName("Génie Logiciel et Développement d'Applications")
                            .programCode("GLOG")
                            .description("Ce programme complet couvre la conception, le développement et la maintenance d'applications logicielles complexes. Vous apprendrez les principes fondamentaux de l'ingénierie logicielle, les méthodologies de développement Agile, les architectures logicielles modernes, et les bonnes pratiques de codage. Le programme inclut des projets pratiques qui vous permettront de créer des applications web et mobiles robustes, sécurisées et évolutives.")
                            .certificateName("Certificat d'Ingénierie Logicielle")
                            .careerProspects("Ingénieur Logiciel, Architecte Logiciel, Développeur d'Applications, Chef de Projets Techniques, Spécialiste en Qualité Logicielle")
                            .registrationFee(new BigDecimal("500.00"))
                            .maxCapacity(150)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(24) // 24 months
                            .price(new BigDecimal("12000.00")) // 12000 currency units
                            .hoursPerDay(5)
                            .daysPerWeek(4)
                            .courseDays(new HashSet<>(Arrays.asList("MONDAY", "TUESDAY", "THURSDAY", "FRIDAY")))
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(14, 0))
                            .build(),
                    Program.builder()
                            .programName("Gestion de Projet et Leadership d'Équipe")
                            .programCode("GPJT")
                            .description("Développez vos compétences en gestion de projet pour planifier, exécuter et suivre efficacement des projets complexes. Ce programme complet couvre les méthodologies Agile et Scrum, la gestion des risques, le leadership d'équipe, la communication de projet, et les outils de gestion de projet. Vous apprendrez à diriger des équipes multidisciplinaires pour atteindre des objectifs précis dans les délais et budgets impartis.")
                            .certificateName("Certificat de Gestion de Projets Professionnels")
                            .careerProspects("Chef de Projets, Coordinateur de Projets, Scrum Master, Responsable de Programmes, Consultant en Gestion de Projets")
                            .registrationFee(new BigDecimal("450.00"))
                            .maxCapacity(160)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(12) // 12 months
                            .price(new BigDecimal("9000.00")) // 9000 currency units
                            .hoursPerDay(3)
                            .daysPerWeek(2)
                            .courseDays(new HashSet<>(Arrays.asList("WEDNESDAY", "SUNDAY")))
                            .startTime(LocalTime.of(15, 0))
                            .endTime(LocalTime.of(18, 0))
                            .build(),
                    Program.builder()
                            .programName("Intelligence Artificielle et Machine Learning")
                            .programCode("IART")
                            .description("Maîtrisez les technologies de pointe de l'intelligence artificielle pour créer des machines intelligentes capables d'imiter les fonctions cognitives humaines. Ce programme avancé explore les réseaux de neurones, le deep learning, le traitement du langage naturel, la vision par ordinateur, et la robotique. Vous développerez des projets concrets utilisant TensorFlow, PyTorch et d'autres frameworks d'IA pour résoudre des problèmes du monde réel.")
                            .certificateName("Certificat de Spécialisation en Intelligence Artificielle")
                            .careerProspects("Ingénieur en IA, Data Scientist, Spécialiste en Machine Learning, Chercheur en IA, Développeur d'Algorithmes Intelligents")
                            .registrationFee(new BigDecimal("650.00"))
                            .maxCapacity(90)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(24) // 24 months
                            .price(new BigDecimal("15000.00")) // 15000 currency units
                            .hoursPerDay(6)
                            .daysPerWeek(3)
                            .courseDays(new HashSet<>(Arrays.asList("MONDAY", "WEDNESDAY", "FRIDAY")))
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(15, 0))
                            .build(),
                    Program.builder()
                            .programName("Marketing Digital et Stratégies de Communication en Ligne")
                            .programCode("MADI")
                            .description("Acquérez les compétences essentielles pour élaborer et exécuter des stratégies de marketing efficaces dans l'environnement numérique. Ce programme couvre le SEO/SEA, le marketing de contenu, les réseaux sociaux, l'e-mail marketing, l'analyse de données marketing, et l'automatisation des campagnes. Vous apprendrez à utiliser les plateformes publicitaires telles que Google Ads et Facebook Ads pour maximiser le retour sur investissement.")
                            .certificateName("Certificat de Marketing Digital Avancé")
                            .careerProspects("Responsable Marketing Digital, Spécialiste SEO/SEA, Gestionnaire de Campagnes Publicitaires, Analyste Marketing, Consultant en Stratégies Digitales")
                            .registrationFee(new BigDecimal("400.00"))
                            .maxCapacity(200)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(12) // 12 months
                            .price(new BigDecimal("8000.00")) // 8000 currency units
                            .hoursPerDay(4)
                            .daysPerWeek(3)
                            .courseDays(new HashSet<>(Arrays.asList("TUESDAY", "THURSDAY", "SATURDAY")))
                            .startTime(LocalTime.of(10, 0))
                            .endTime(LocalTime.of(14, 0))
                            .build(),
                    Program.builder()
                            .programName("Science des Données et Analyse Prédictive")
                            .programCode("SDAT")
                            .description("Plongez dans l'univers fascinant de la science des données, où vous apprendrez à extraire des connaissances précieuses à partir de grands ensembles de données. Ce programme couvre les techniques statistiques avancées, l'apprentissage automatique, la visualisation de données, et les outils d'analyse prédictive. Vous travaillerez avec des jeux de données réels pour résoudre des problèmes complexes dans divers domaines tels que la finance, la santé et le marketing.")
                            .certificateName("Certificat de Science des Données")
                            .careerProspects("Data Scientist, Analyste de Données, Ingénieur en Machine Learning, Spécialiste en Business Intelligence, Consultant en Analyse Prédictive")
                            .registrationFee(new BigDecimal("550.00"))
                            .maxCapacity(100)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(24) // 24 months
                            .price(new BigDecimal("13000.00")) // 13000 currency units
                            .hoursPerDay(5)
                            .daysPerWeek(4)
                            .courseDays(new HashSet<>(Arrays.asList("MONDAY", "TUESDAY", "THURSDAY", "FRIDAY")))
                            .startTime(LocalTime.of(14, 0))
                            .endTime(LocalTime.of(19, 0))
                            .build(),
                    Program.builder()
                            .programName("Systèmes Embarqués et Internet des Objets")
                            .programCode("SEIO")
                            .description("Maîtrisez les technologies des systèmes embarqués et de l'Internet des Objets (IoT) pour concevoir des solutions connectées intelligentes. Ce programme couvre l'architecture des microcontrôleurs, la programmation bas niveau, les protocoles de communication, la sécurité IoT, et le développement d'applications connectées. Vous réaliserez des projets pratiques avec des capteurs, actionneurs et plateformes IoT.")
                            .certificateName("Certificat de Spécialisation en Systèmes Embarqués et IoT")
                            .careerProspects("Ingénieur en Systèmes Embarqués, Développeur IoT, Architecte de Solutions Connectées, Spécialiste en Automatisation, Consultant en Objets Connectés")
                            .registrationFee(new BigDecimal("600.00"))
                            .maxCapacity(90)
                            .registrationStartDate(LocalDate.of(2025, 9, 1))
                            .registrationEndDate(LocalDate.of(2025, 10, 31))
                            .duration(24) // 24 months
                            .price(new BigDecimal("14000.00")) // 14000 currency units
                            .hoursPerDay(6)
                            .daysPerWeek(3)
                            .courseDays(new HashSet<>(Arrays.asList("WEDNESDAY", "FRIDAY", "SUNDAY")))
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(15, 0))
                            .build()
            );

            // Save programs first
            List<Program> savedPrograms = programRepository.saveAll(programs);
            System.out.println("Database population complete with " + savedPrograms.size() + " programs.");

            // Add modules to programs
            initializeModules(savedPrograms);
        }
    }

    private void initializeModules(List<Program> programs) {
        System.out.println("Populating database with initial module data...");

        for (Program program : programs) {
            List<LearnModule> modules = getModulesForProgram(program);
            if (!modules.isEmpty()) {
                learnModuleRepository.saveAll(modules);
            }
        }

        System.out.println("Database population complete with modules for all programs.");
    }

    private List<LearnModule> getModulesForProgram(Program program) {
        switch (program.getProgramCode()) {
            case "BCHN": // Blockchain
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Introduction à la Blockchain")
                        .moduleDescription("Compréhension des concepts fondamentaux de la technologie blockchain, son histoire et ses applications.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Cryptographie et Sécurité")
                        .moduleDescription("Étude des principes cryptographiques sous-jacents à la blockchain, hachage, signatures numériques.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Smart Contracts")
                        .moduleDescription("Développement et déploiement de smart contracts sur la plateforme Ethereum.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Applications Décentralisées")
                        .moduleDescription("Conception et développement d'applications décentralisées (DApps).")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "CCLD": // Cloud Computing
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Fondamentaux du Cloud Computing")
                        .moduleDescription("Introduction aux concepts du cloud computing, modèles de service et déploiement.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Architecture des Systèmes Distribués")
                        .moduleDescription("Conception d'architectures distribuées évolutives et résilientes.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Conteneurisation avec Docker")
                        .moduleDescription("Maîtrise de Docker pour le déploiement d'applications conteneurisées.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Orchestration avec Kubernetes")
                        .moduleDescription("Gestion d'environnements conteneurisés avec Kubernetes.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "CDIG": // Communication Digitale
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Stratégies de Communication Digitale")
                        .moduleDescription("Élaboration de stratégies de communication efficaces pour les plateformes numériques.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Création de Contenu Digital")
                        .moduleDescription("Production de contenu engageant pour les réseaux sociaux et sites web.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Gestion de Communauté")
                        .moduleDescription("Animation et modération de communautés en ligne.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Analyse d'Audience")
                        .moduleDescription("Mesure et analyse de la performance des campagnes digitales.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "CYBS": // Cybersécurité
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Fondamentaux de la Cybersécurité")
                        .moduleDescription("Principes de base de la sécurité informatique et menaces courantes.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Cryptographie Appliquée")
                        .moduleDescription("Techniques de chiffrement et de protection des données.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Gestion des Risques et Conformité")
                        .moduleDescription("Identification des risques et mise en œuvre de mesures de protection.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Réponse aux Incidents de Sécurité")
                        .moduleDescription("Procédures de détection, analyse et réponse aux cyberattaques.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "DWEB": // Développement Web
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Fondamentaux du Développement Web")
                        .moduleDescription("HTML, CSS, JavaScript et frameworks front-end modernes.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Développement Back-End")
                        .moduleDescription("Création d'API RESTful avec Node.js et bases de données.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Bases de Données et ORM")
                        .moduleDescription("Conception et manipulation de bases de données relationnelles et NoSQL.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Déploiement et DevOps")
                        .moduleDescription("Mise en production d'applications web et bonnes pratiques DevOps.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "DGRH": // Design Graphique
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Principes Fondamentaux du Design")
                        .moduleDescription("Théorie des couleurs, typographie, composition et esthétique visuelle.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Logiciels de Design Professionnels")
                        .moduleDescription("Maîtrise d'Adobe Creative Suite (Photoshop, Illustrator, InDesign).")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Branding et Identité Visuelle")
                        .moduleDescription("Création d'identités de marque cohérentes et mémorables.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Portfolio et Présentation Professionnelle")
                        .moduleDescription("Préparation d'un portfolio professionnel et techniques de présentation.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "GLOG": // Génie Logiciel
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Principes de l'Ingénierie Logicielle")
                        .moduleDescription("Cycle de vie du développement logiciel et méthodologies Agile.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Architecture Logicielle")
                        .moduleDescription("Conception d'architectures logicielles modulaires et évolutives.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Développement Agile")
                        .moduleDescription("Pratiques Agile et Scrum pour le développement itératif et incrémental.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Tests et Maintenance")
                        .moduleDescription("Mise en œuvre de tests automatisés et maintenance des applications.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "GPJT": // Gestion de Projet
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Fondamentaux de la Gestion de Projet")
                        .moduleDescription("Principes de la gestion de projet, cycle de vie et parties prenantes.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Méthodologies Agile et Scrum")
                        .moduleDescription("Approches Agile et framework Scrum pour la gestion de projets.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Gestion des Risques et Communication")
                        .moduleDescription("Identification des risques et communication efficace dans les projets.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Leadership et Management d'Équipe")
                        .moduleDescription("Techniques de leadership pour motiver et diriger des équipes.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "IART": // Intelligence Artificielle
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Introduction à l'Intelligence Artificielle")
                        .moduleDescription("Concepts fondamentaux de l'IA, machine learning et deep learning.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Réseaux de Neurones et Deep Learning")
                        .moduleDescription("Architecture des réseaux de neurones et frameworks de deep learning.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Traitement du Langage Naturel")
                        .moduleDescription("Techniques de traitement et analyse du langage humain par ordinateur.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Vision par Ordinateur")
                        .moduleDescription("Reconnaissance d'images et analyse visuelle avec l'IA.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "MADI": // Marketing Digital
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Fondamentaux du Marketing Digital")
                        .moduleDescription("Principes du marketing en ligne et stratégies digitales.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("SEO et SEA")
                        .moduleDescription("Optimisation pour les moteurs de recherche et publicité en ligne.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Marketing de Contenu")
                        .moduleDescription("Création et distribution de contenu engageant pour les audiences.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Analyse de Données Marketing")
                        .moduleDescription("Mesure, analyse et optimisation des performances marketing.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "SDAT": // Science des Données
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Introduction à la Science des Données")
                        .moduleDescription("Concepts fondamentaux de l'analyse de données et statistiques.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Machine Learning")
                        .moduleDescription("Algorithmes d'apprentissage automatique et modélisation prédictive.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Visualisation de Données")
                        .moduleDescription("Techniques de visualisation pour communiquer les insights de données.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Big Data et Outils d'Analyse")
                        .moduleDescription("Traitement de grands volumes de données avec des outils spécialisés.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            case "SEIO": // Systèmes Embarqués
                return Arrays.asList(
                    LearnModule.builder()
                        .moduleName("Architecture des Systèmes Embarqués")
                        .moduleDescription("Composants matériels et logiciels des systèmes embarqués.")
                        .moduleOrder(1)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Programmation Bas Niveau")
                        .moduleDescription("Développement de logiciels pour microcontrôleurs et processeurs.")
                        .moduleOrder(2)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Protocoles de Communication IoT")
                        .moduleDescription("Protocoles de communication pour l'Internet des Objets.")
                        .moduleOrder(3)
                        .program(program)
                        .build(),
                    LearnModule.builder()
                        .moduleName("Sécurité des Systèmes Connectés")
                        .moduleDescription("Protection des dispositifs IoT contre les cybermenaces.")
                        .moduleOrder(4)
                        .program(program)
                        .build()
                );
                
            default:
                return Arrays.asList();
        }
    }
}