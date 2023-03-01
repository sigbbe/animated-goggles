# [Remix - Indie stack](https://github.com/remix-run/indie-stack/blob/main/app/routes/index.tsx)

Features:
- [x] Register e-mail
- [ ] Support for various question types:
  - [x] Short text question
  - [ ] Long text question
  - [ ] Range
  - [ ] Dropdown
  - [ ] Linear scale
  - [ ] Checkbox
  - [ ] Checkbox-grid
  - [ ] Multiple choice-grid
- [ ] Admin page
- [ ] Vurdere random sanger

**Features**:
- Mer info om person
  - feks. hvor godt er du kjent med AI/XAI
  - Student (klasse)
  - Alder
  - Utdanning
- Spørsmål om tall
- Integrasjon med spotify
- Andre spørsmål: 
  - Hvor godt kjent er du med denne sangen?
  - 


Questionaire: list med questions.
Question: info om spørsmål + referanser til alle svar for dette spørsmålet. 
Utility: server kan hente et nytt questionaire når den kjøres opp.  

{
	_id: ID, 
	question: String,
	question_type: String 
}
{
	user_session: ID, 
	date: DateTime	
}
{
	_id: ID, 
	answer: hash
}

**Questions**:
- What is the popularity of the song 'I'm Yours' by Jason Mraz?
- How clear/meaningful do you think this explanation is?
- Which of the following features do you think contributed the most to the AI's prediction?

- Hva tror du har størst innvirkning på en låts popularitet? (1. viktigst, 2. nest viktigst, osv.)
- Hva mener du kreves av en forklaring (feks.  avhengig/uavhengig av kontekst, må den være sann, etc)
- 

FormTestIdcle6gswt30000pl7vnwova1a6

<!-- tteeekflsdksdf@lskdflksdf.com -->
<!-- sdølfksdølkf -->
<!-- sdflksBSDASLDK -->
<!-- XXXXXXXXX -->
<!-- Genre -->

CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "formId" TEXT NOT NULL,

## Refleksjon

Jeg har sitttet å jobbet med form-appen. 
Gjort dette alene, og prøver å finne ut om dette er gjennomførbart. 
Litt rusten når det kommer til bruk av de ulike teknologiene (feks. prisma støtter ikke createMany for sqlite), men håpefull for hva vi kan få til.

Samarbeidet: første dag med konkret utvikling på web-appen har jeg jobbet selv. Karl og Jonas har jobbet sammen med utvikling av AI og bruk av auto-ml. Jonatan jobbet med presentasjon og leste pensum. 

Litteratur fra Jonas: https://christophm.github.io/interpretable-ml-book/preface-by-the-author.html


"Jeg har ikke blitt mere glad i dere, men jeg synes dere jobber bedre"
""

Minste motstands vei/det som kommer mest naturlig. Vi har i dag hatt lengre perioder 1-2 timer hvor gruppemedlemmer har jobbe for seg selv. Det kan føre til at enkelte gruppemedlemmer etterhvert opplever uklarhet, eller glemmer hva de andre jobber med. Tiltak til slike situasjoner er å strebe etter en gruppedynamikk hvor det er lav terskel for å spørre. Feks. "Hva jobber dere med nå?", "Hva er neste mål gruppa jobber mot?".

andre gruppemedlemmer hva de holder på med

https://christophm.github.io/interpretable-ml-book/preface-by-the-author.html


## Login screen

(optional) login page som spør om email, kan også huske email hvis bruker klikker sjekkboks.
Tar bruker gjennom form med spørsmål. 

Målsettinger: 
1. Henter questionnaire fra en eller annen url.
   1. Ferdigstill prisma schema
2. App som mottar brukers e-mail, og tar brukeren gjennom et set med spørsmål
3. App gjør request mot AI server som gjør prediksjoner. 
4. App gjør request mot AI server som gjør XI forklaringer
5. Admin: hente ut data lagret i sqlite-db 

### Errors

- [ ] `react-dom.development.js:86 Warning: Expected server HTML to contain a matching <meta> in <head>.`
- [ ] `Uncaught Error: Hydration failed because the initial UI does not match`
- [ ] `Warning: An error occurred during hydration. The server HTML was replaced with client content in <#document>.`
- [ ] `react-dom.development.js:19849 Uncaught Error: There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.`
- [ ] `data.js:40 POST http://192.168.68.112:3000/login?_data=routes%2Flogin 400 (Bad Request)`
- [ ] ``
