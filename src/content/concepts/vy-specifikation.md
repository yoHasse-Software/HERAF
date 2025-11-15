---
id: vy-specifikation
title: Vy-specifikation
icon: FileText
category: Vyer och perspektiv
relationships: [vy, arkitekturperspektiv, malgruppsperspektiv]
examples: [UML-specifikationer, ArchiMate-viewpoints, TOGAF-vyer]
date: 2025-11-13
---

# Vy-specifikation

En vy-specifikation definierar hur en vy ska utformas genom att ange dess syfte, målgrupp, innehåll, notation och detaljnivå, vilket säkerställer att vyer är konsekventa, jämförbara och uppfyller sitt arkitektoniska syfte.

## Komponenter av en vy-specifikation

### Syfte
- **Varför** existerar denna vy?
- Vilka **angelägenheter** (concerns) adresseras?
- Vilket **problem** löser vyn?

### Målgrupp
- **Vem** är den primära användaren?
- Vilken **kunskapsnivå** förutsätts?
- Vilka **roller** och **ansvar** har målgruppen?

### Innehåll
- **Vilka element** ska inkluderas?
- **Vilka relationer** ska visas?
- **Vilken information** är relevant?

### Notation
- **Symboler** och **ikoner** som ska användas
- **Konventioner** för representation
- **Standarder** som följs (UML, ArchiMate, etc.)

### Detaljnivå
- **Granularitet** av information
- **Abstraktionsnivå** som är lämplig
- **Omfattning** av vyn

## Fördelar med vy-specifikationer

### Konsekvens
Säkerställer att liknande vyer skapas på samma sätt oavsett vem som producerar dem.

### Kvalitet
Definierade kriterier och standarder höjer kvaliteten på arkitekturdokumentation.

### Effektivitet
Färdiga mallar och riktlinjer accelererar vyproduktion.

### Kommunikation
Gemensam förståelse för vad olika vytyper innehåller och varför.

## Exempel på vy-specifikationer

### Systemkontextvy
- **Syfte**: Visa systemets relation till omgivningen
- **Målgrupp**: Verksamhetsanalytiker, projektledare
- **Innehåll**: System, externa aktörer, informationsflöden
- **Notation**: Enkla rektanglar och pilar
- **Detalj**: Högnivå, inga tekniska detaljer

### Komponentarkitekturvy
- **Syfte**: Visa systemets interna struktur
- **Målgrupp**: Systemarkitekter, utvecklare
- **Innehåll**: Komponenter, gränssnitt, dependencies
- **Notation**: UML-komponentdiagram
- **Detalj**: Medeldetaljnivå med teknisk fokus

## Standarder och ramverk
- **TOGAF ADM**: Definierade vytyper för enterprise architecture
- **ISO 42010**: Standard för arkitekturbeskrivning
- **ArchiMate**: Språk för enterprise architecture modeling