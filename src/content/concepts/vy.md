---
id: vy
title: Vy
icon: Eye
category: Vyer och perspektiv
relationships: [arkitekturperspektiv, vy-specifikation, angelagenhet]
examples: [Systemkomponentvy, Integrationsvyer, Säkerhetsvy]
date: 2025-11-13
---

# Vy

En vy är en strukturerad och visualiserad representation av en arkitektur ur ett specifikt perspektiv, som syftar till att göra arkitekturen begriplig och relevant för olika intressenter genom att illustrera komponenter, relationer och egenskaper såsom systemkomponenters samspel, informationsflöden, säkerhetslager, infrastruktur och tjänstegränssnitt, i syfte att besvara målgruppens frågeställningar (concerns).

## Syfte och funktion

### Kommunikation
Vyer gör komplexa arkitekturer förståeliga genom visuell representation anpassad för specifika målgrupper.

### Fokusering
Genom att visa endast relevanta aspekter kan vyer minska komplexitet och öka förståelsen.

### Beslutsunderlag
Ger strukturerad information som stödjer arkitektoniska och tekniska beslut.

## Viktiga aspekter av vyer

### Målgruppsanpassning
- **Innehåll** anpassas efter målgruppens kunskaper och behov
- **Detaljeringsgrad** varierar beroende på användningsområde
- **Notation** väljs för optimal förståelse

### Angelägenhetsfokus
Varje vy adresserar specifika angelägenheter (concerns):
- Säkerhetsvy fokuserar på säkerhetsaspekter
- Integrationsvyer visar systemsamverkan
- Prestandavy belyser prestandakritiska element

## Exempel på vytyper

### Kontextvy
- **Syfte**: Visa systemets relation till omgivningen
- **Innehåll**: Externa aktörer, systemgränser
- **Målgrupp**: Verksamhetsanalytiker, projektledare

### Komponentvy
- **Syfte**: Visa systemets interna struktur
- **Innehåll**: Komponenter, gränssnitt, dataflöden
- **Målgrupp**: Arkitekter, utvecklare

### Deployment-vy
- **Syfte**: Visa fysisk utplacering
- **Innehåll**: Servrar, nätverk, miljöer
- **Målgrupp**: Infrastrukturteam, drift

### Säkerhetsvy
- **Syfte**: Visa säkerhetsarkitektur
- **Innehåll**: Säkerhetszoner, kontroller, hot
- **Målgrupp**: Säkerhetsarkitekter, CISO

## Kvalitetsaspekter
- **Konsekvens** mellan relaterade vyer
- **Aktualitet** - vyer måste hållas uppdaterade
- **Verifierbarhet** - vyer ska kunna valideras mot implementationen