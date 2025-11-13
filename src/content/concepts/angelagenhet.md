---
id: angelagenhet
title: Angelägenhet (Concern)
icon: AlertCircle
category: Intressenter
relationships: [intressenter, malgrupp, arkitekturperspektiv]
examples: [Säkerhet, Prestanda, Användbarhet, Kostnadseffektivitet]
date: 2025-11-13
---

# Angelägenhet (Concern)

En angelägenhet beskriver vad en intressent eller målgrupp anser vara viktigt i ett system eller en arkitektur. Det kan vara mål, behov, krav eller frågor som påverkar hur något ska utformas eller fungera.

## Definition enligt ISO 42010

Enligt standarden ISO 42010:2022 är en "concern" ett intresse som är av betydelse för en eller flera intressenter i relation till ett system och dess arkitektur.

## Typer av angelägenheter

### Funktionella angelägenheter
- **Användbarhet**: Hur lätt är systemet att använda?
- **Prestanda**: Uppfyller systemet prestandakrav?
- **Funktionalitet**: Ger systemet rätt funktioner?

### Kvalitetsaspekter
- **Säkerhet**: Är systemet säkert mot hot?
- **Tillförlitlighet**: Fungerar systemet konsekvent?
- **Skalbarhet**: Kan systemet hantera ökad belastning?

### Affärsangelägenheter
- **Kostnadseffektivitet**: Ger systemet värde för pengarna?
- **Time-to-market**: Hur snabbt kan lösningen levereras?
- **Compliance**: Följer systemet regelverk?

## Relation till arkitekturvyer

Angelägenheter driver utformningen av arkitekturvyer:
- Varje vy adresserar specifika angelägenheter
- Vyernas innehåll och struktur anpassas för att besvara concerns
- Olika intressenter har olika angelägenheter som kräver olika vyer

## Identifiering av angelägenheter

### Workshop-metoder
- Intressentanalys
- Concern mapping
- Riskanalyser

### Strukturerade intervjuer
- Målgruppspecifika frågor
- Prioritering av concerns
- Konfliktidentifiering

## Hantering av konflikter
Olika intressenters angelägenheter kan vara motstridiga och kräver:
- **Prioritering** baserad på affärsvärde
- **Kompromisser** mellan konkurrerande concerns
- **Tydlig kommunikation** om designbeslut