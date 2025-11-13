---
id: regel
title: Regel
icon: Shield
category: Governance
relationships: [riktlinje, styrande-principer]
examples: [Säkerhetspolicyer, Compliance-krav, Tekniska standarder]
date: 2025-11-13
---

# Regel

En regel är en tvingande riktlinje. Den definierar vad som måste följas i syfte att säkerställa att personer agerar i enlighet med styrande principer, lagkrav eller andra obligatoriska förhållningssätt.

## Karakteristika

### Obligatorisk
Regler är tvingande och måste följas utan undantag eller endast med formella avsteg.

### Specifik
Ger tydliga, mätbara krav som kan kontrolleras och följas upp.

### Kontrollerbar
Måste vara möjlig att verifiera efterlevnad av, ofta genom automatiserade kontroller.

## Typiska källor för regler

### Lagkrav
- GDPR och dataskydd
- Tillgänglighetslagstiftning
- Branschspecifika regleringar

### Säkerhetspolicyer
- Kryptografiska standarder
- Åtkomstkontrollkrav
- Incident management

### Tekniska standarder
- Arkitektoniska constraints
- Plattformskrav
- Integrationsstandarder

## Exempel på regler

### Säkerhet
"All kommunikation med externa system MÅSTE använda TLS 1.2 eller senare"

### Dataskydd
"Personuppgifter SKALL raderas inom 30 dagar efter avslutad relation"

### Arkitektur
"Nya system MÅSTE exponera API:er enligt OpenAPI 3.0 specifikation"

## Implementation
Regler implementeras ofta genom:
- **Automatiserade kontroller** i CI/CD-pipelines
- **Policysystem** som blockerar regelbrott
- **Compliance-verktyg** för kontinuerlig övervakning
- **Granskningsprocesser** för manuell kontroll