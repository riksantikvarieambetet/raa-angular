# ng2-raa-common
Angular 2 module som innehåller gemensamma komponenter för RAÄ:s webbapplikationer.

## Användning

### I andra projekt
För att använda ng2-raa-common i en andra projekt behöver npm känna till beroende och ladda ner paketet. Lägg till beroendet i projektets `package.json`

        "ng2-raa-common": "git+http://stash.raa.se/scm/tek/ng2-raa-common.git#master"

Då kommer `npm install` ladda ner senaste incheckningen från master-branchen till projektet.
För att angular ska känna till modulen måste denna laddas in till applikationens modul/moduler.

    import { RaaModule } from 'ng2-raa-common';

    @NgModule({
        bootstrap: [AppComponent],
        declarations: [],
        imports: [
            RaaModule,
        ],
        providers: []
        })

Nu kan du använda våra gemensamma komponenter i ditt projekt. För
att tillexempel använda raa-select i ditt projekt anger du bara komponenten i din html-kod

    <raa-select [domain]="din_domän" valueAttr="domänens_nyckel_attribut" displayAttr="domänens_visningsvärde_attribut"></raa-select>

För att kunna använda gemensamma Pipes i direkt i javascriptkod behöver dessa inject:as från `ng2-raa-common/pipes`

Exempel:

    import { OrgnummerPipe } from "ng2-raa-common/pipes";

### Gemensam Sass
Gemensamm css kod som ska användas inom RAÄ:s webbapplikationer importeras i varje Sass-fil där dom behövs:

    @import '~ng2-raa-common/styles';

Då kan våra gemensama sass-variabler och mixin:s användas direkt

## Utveckling
För att fixa buggar/utveckla ny funktionalitet, checka ut projektet till valfri mapp med kommandot

    git clone ssh://git@lx-ra-jira.raa.se:7999/tek/ng2-raa-common.git

Hämta hem alla npm beroenden med kommandot

    npm install

Filen `/index.ts` definerar vad npm-paketet ska exportera för komponenter och där har vi angivet att vi vill exportera vår angular module `raa.module`.
I filen `/pipes.ts` exporterar vi våra pipe klasser. Se nedan under [Pipes](#pipes) för hur dessa ska hanteras.

### Angular 2 gemensamma komponenter
Under mappen `/src/` ligger alla `components`, `directives`, `pipes` och `styles`
som vår angular module har. För att bygga en ny komponent skapa en ny katalog för komponenten
och lägg till ett beroende under `declarations` och exportera komponenten till övriga projekt genom att lägga till komponenten 
under `exports` `/src/raa.module.ts`.

### <a name="pipes"></a>Pipes
För Pipes måste vi även exportera `.ts` filerna för att kunna injecta dessa med rätt typning till våra projekt som vill använda dessa.
I filen `/src/pipes/pipes.ts` måste samtliga pipes listas och exporteras. Viktigt att man lägger till en ny rad när en ny Pipe skapats.

Ex:

    export * from './orgnummer.pipe';

Denna fil exporteras sedan från `/pipes.ts` så att dom enkelt kan importeras från externa projekt genom att skriva  tillexempel `import { OrgnummerPipe } from 'ng2-raa-common/pipes';`
