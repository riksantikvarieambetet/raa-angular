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

    npm run build

köras för att kompilera ts-koden

### Artifactory (publicera och hämta)

#### Hämta:

För att hämta beroenden för projektet används det virtuella repositoriet 'raa-npm-prod'.  
Ex. https://artifactory.raa.se/artifactory/raa-npm-prod/  
Default-registry för detta sätts i .npmrc.

#### Publicera:

Publicering till Artifactory sker manuellt/lokalt, dvs. ej genom Bamboo. Följ instruktioner nedan:

För att kunna publicera nya versioner av raa-angular till artifactory behöver man logga in på det virtuella repositoriet 'common-npm-prod'.
Konfiguration för till var nya publiceringar sker sätts i package.json på:

      "publishConfig": {
        "registry": "https://artifactory.raa.se/artifactory/api/npm/common-npm-prod/"
      },

Logga in på repot genom:

    npm login --registry https://artifactory.raa.se/artifactory/api/npm/common-npm-prod/

Ange sedan dina credentials då detta krävs för att få skrivrättigheter på artifactory.  
Kör sedan skriptet publishNewVersion.js som hanterar publiceringen av paketet till Artifactory.  
Det finns tre olika typer av publiceringar i package.json som beror på vad för typer av förändringar som har gjorts.

- publish:patch
- publish:minor
- publish:major

#### Exempel

    yarn publish:patch

#### patch

Används vid bakåtkompatibla buggfixar.

#### minor

Används vid ny funktionalitet har lagts till på ett bakåtkompatibel sätt.

#### major

Används när förändringarna gör att vi inte längre är bakåtkompatibla.

Vid en publicering kommer paketets version i `package.json` uppdateras samt en ny tag att skapas och commitas. Sedan publiceras den nya versionen till det gemensamma npm-repository och förändringarna pushas upp till git.

### Dokumentation

- https://www.jfrog.com/confluence/display/JFROG/npm+Registry - Guide för hur man använder npm/artifactory
- http://raawiki.raa.se/pages/viewpage.action?pageId=82023997 - Översikt över raa:s artifactory setup
