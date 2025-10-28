# Fädernas Gudasaga — En Dotters README

Min far var en man med märkliga passioner.  
Han var övertygad om att världen hade glömt Viktor Rydberg — *”den sanna arvtagaren till Norden”*, brukade han säga, med ögonen glänsande bakom sina tjocka glasögon, som om själva **Eddan** viskade till honom.

Medan hans kollegor skrev om ekonomi eller samhälle, skrev min far kod — eller snarare, han översatte *myt till JavaScript.*

Det här arkivet är allt som finns kvar av hans sista projekt: en React-applikation tillägnad **Fädernas Gudasaga**, hans älskade bok.  
Han sa att den skulle *”återge gudarna deras rättmätiga plats — i DOM:en.”*

Jag, hans dotter, är ingen utvecklare.  
Jag har försökt öppna projektet, försökt förstå denna skog av måsvingar, `import`-satser och kryptiska beroenden.  
Men det går inte att köra.  
När jag skriver `npm start`, ylar terminalen.  
När jag försöker med `yarn`, hånar den mig med felmeddelanden äldre än själva Oden.

Det enda README han lämnade var ... detta.  
Inga instruktioner, inga förklaringar.  
Bara fragment av kommentarer på svenska och latin — ett halvt översatt epos av komponenter och kontext.  

En mapp heter `Yggdrasil`.  
Där finns:  
- `rötter/` (någon sorts uråldrig state-hantering)  
- `grenar/` (komponenter som hänvisar till varandra i evig rekursion)  
- och `löv/` (tom).  

En annan mapp heter `mimer/`.  
Den innehåller bara en enda fil:

```js
export const wisdom = null;
```

Jag har hittat en App.jsx som importerar allt men renderar ingenting.
Längst ner står en kommentar:

```js
// Låt Balder resa sig igen (när bygget lyckas)
```

Men inget bygge lyckas.

Varje kväll öppnar jag terminalen och försöker igen.
Kanske, tänker jag, döljer sig något i ett av hans script — till exempel npm run ragnarok.
Det enda det gör är att radera node_modules.

Ändå fortsätter jag.
För jag minns vad han brukade säga:

”Mytologin är bara data — strukturerad, relaterad och evig.
En dag kommer du veta hur man renderar den.”

Om någon som läser detta lyckas väcka projektet till liv, ber jag er — hör av er.
Jag tror att gudarna väntar där inne, tålmodiga som alltid, bland varningar och misslyckade byggen.

Installation (så vitt jag vet)
```bash
npm install
npm start
```

(Ingen av dem fungerar. Pappa brukade säga: ”Försök igen i morgon.”)

Licens
Ingen funnen. Kanske gudomlig.

Tillägnan
Till Pappa — som trodde att div-taggar kunde rymma det gudomliga.

