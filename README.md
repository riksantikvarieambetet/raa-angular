# raa-angular

Angular-modul som innehåller gemensamma komponenter för RAÄ:s webbapplikationer.

## Användning

### I andra projekt

För att kunna installera det här paketet direkt via npm/yarn måste man ange Riksantikvarieämbetets egna registry som källa.
Detta gör man genom att lägga till en .npmrc-fil i sitt projekt som innehåller länken till registryt. En sådan fil finns i detta projekt, så det enklaste är att kopiera den.

När man gjort detta kan man installera med

yarn install raa-angular

För att angular ska känna till modulen måste denna defineras i applikationens modul/moduler.

    import { RaaModule } from 'ng-raa-common';

    @NgModule({
        bootstrap: [AppComponent],
        declarations: [],
        imports: [
            RaaModule,
        ],
        providers: []
        })

Index.ts måste också inkluderas i tsconfig.json

    "include": [
    	"src/**/*",
    	"node_modules/raa-angular/index.ts"

]

Nu kan du använda våra gemensamma komponenter i ditt projekt. För
att tillexempel använda raa-select i ditt projekt anger du bara komponenten i din html-kod

    <raa-select [domain]="din_domän" valueAttr="domänens_nyckel_attribut" displayAttr="domänens_visningsvärde_attribut"></raa-select>

För att kunna använda gemensamma Pipes i direkt i javascriptkod behöver dessa inject:as från `ng-raa-common/pipes`

Exempel:

    import { OrgnummerPipe } from "ng-raa-common/pipes";

### Gemensam Sass

Gemensamm css kod som ska användas inom RAÄ:s webbapplikationer importeras i varje Sass-fil där dom behövs:

    @import '~ng-raa-common/styles';

Då kan våra gemensama sass-variabler och mixin:s användas direkt

## Utveckling

För att fixa buggar/utveckla ny funktionalitet, checka ut projektet till valfri mapp med kommandot

    git clone http://stash.raa.se/projects/GRAP/repos/raa-angular

Hämta hem alla beroenden med kommandot

    yarn install

Filen `/index.ts` definerar vad npm-paketet ska exportera för komponenter och där har vi angivet att vi vill exportera vår angular module `raa.module`.
I filen `/pipes.ts` exporterar vi våra pipe klasser. Se nedan under [Pipes](#pipes) för vad man behöver göra utöver det nedanför för dessa.

### <a name="nya-komponenter"></a>Angular gemensamma komponenter

Under mappen `/src/` ligger alla `components`, `directives`, `pipes` och `styles`
som angular modulen `ng-raa-common` innehåller. För att bygga en ny komponent skapa en ny katalog för komponenten
och lägg till ett beroende under `declarations` och exportera komponenten till övriga projekt genom att lägga till komponenten
under `exports` i filen `/src/raa.module.ts`.

### <a name="pipes"></a>Pipes

För Pipes gäller samma som för [Angular gemensamma komponenter](#nya-komponenter) samt att vi även måste exportera `.ts` filerna för att kunna injecta dessa med rätt typning till våra projekt som vill använda dessa i kod och inte bara i `html`-kod.
I filen `/src/pipes/pipes.ts` måste samtliga pipes listas och exporteras. Viktigt att man lägger till en ny rad när en ny Pipe skapats.

Ex:

    export * from './orgnummer.pipe';

Denna fil exporteras sedan från `/pipes.ts` så att dom enkelt kan importeras från externa projekt genom att skriva tillexempel `import { OrgnummerPipe } from 'ng-raa-common/pipes';`

### Prettier - https://prettier.io/

För att formatera koden och hålla en konsekvens formattering använder vi oss av Prettier som formaterar scss, css och ts koden åt en. Ett precommit steg finns som automatiskt formaterar koden innan koden commit:as.

För att formatera automatiskt vid editering finns följande plugins

#### Visual Studio Code

Plugin: Prettier - Code formatter
För att formatera automatiskt vid spara lägg till configurationen

    "editor.formatOnSave": true

#### IntelliJ IDEA

Plugin: https://plugins.jetbrains.com/plugin/10456-prettier

### Incheckning

Innan incheckning till stash ska

    npm run prepublish

köras för att kompilera ts-koden
