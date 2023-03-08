# [Remix - Indie stack](https://github.com/remix-run/indie-stack/blob/main/app/routes/index.tsx)

**Features**:
- [x] Register e-mail
- [ ] Support for various question types:
  - [x] Short text question
  - [x] Long text question
  - [x] Range
  - [ ] Dropdown
  - [x] Linear scale
  - [x] Checkbox
  - [ ] Checkbox-grid
  - [ ] Multiple choice-grid
- [ ] Vurdere random sanger
- [ ] Mer info om person
  - [ ] feks. hvor godt er du kjent med AI/XAI
  - [ ] Student (klasse)
  - [ ] Alder
  - [ ] Utdanning
- [ ] Spørsmål om tall
- [ ] Integrasjon med spotify
- [ ] Andre spørsmål: 
  - [ ] Hvor godt kjent er du med denne sangen?
  
  - [ ] Legge til spørsmål i signin form
  - [ ] Huske state i spørsmål/createOrUpdateAnswer i backend
  - [ ] Lage schema og importere spotify dataset
  - [ ] Definere schema for sang element
  - [ ] Vise "thank u" melding 
  - [ ] Vise sang i form
  - [ ] Deploy 


**Questions**:
- What is the popularity of the song 'I'm Yours' by Jason Mraz?
- How clear/meaningful do you think this explanation is?
- Which of the following features do you think contributed the most to the AI's prediction?

- Hva tror du har størst innvirkning på en låts popularitet? (1. viktigst, 2. nest viktigst, osv.)
- Hva mener du kreves av en forklaring (feks.  avhengig/uavhengig av kontekst, må den være sann, etc)
- 

## Refleksjon

Jeg har sitttet å jobbet med form-appen. 
Gjort dette alene, og prøver å finne ut om dette er gjennomførbart. 
Litt rusten når det kommer til bruk av de ulike teknologiene (feks. prisma støtter ikke createMany for sqlite), men håpefull for hva vi kan få til.

Samarbeidet: første dag med konkret utvikling på web-appen har jeg jobbet selv. Karl og Jonas har jobbet sammen med utvikling av AI og bruk av auto-ml. Jonatan jobbet med presentasjon og leste pensum. 

Litteratur fra Jonas: https://christophm.github.io/interpretable-ml-book/preface-by-the-author.html

Minste motstands vei/det som kommer mest naturlig. Vi har i dag hatt lengre perioder 1-2 timer hvor gruppemedlemmer har jobbe for seg selv. Det kan føre til at enkelte gruppemedlemmer etterhvert opplever uklarhet, eller glemmer hva de andre jobber med. Tiltak til slike situasjoner er å strebe etter en gruppedynamikk hvor det er lav terskel for å spørre. Feks. "Hva jobber dere med nå?", "Hva er neste mål gruppa jobber mot?".

andre gruppemedlemmer hva de holder på med

https://christophm.github.io/interpretable-ml-book/preface-by-the-author.html


[remix-run/blues-stack](https://github.com/remix-run/blues-stack)

## Form

```json
{
	"title": "string",
	"description": "string",
	"questions": [
		<question_1>, 
		<question_2>,
		... 
		<question_n>, 
	]
}
```

## Question types supported

**Short text question**:

```json
{
	"title": "optional string",
	"type": "SHORT_TEXT",
	"body": {
		"question": "string"
	}
}

```

**Long text question**: 

```json
{
	"title": "optional string",
	"type": "LONG_TEXT",
	"body": {
		"question": "string"
	}
}
```

**Explenation**: 

```json
{
	"title": "optional string",
	"type": "EXPLENATION", 
	"body": {
		"question": "string",
		"img": "optional string"
	}
}
```


**Multiple choice**: 

```json
{
	"title": "optional string",
	"type": "MULTIPLE_CHOICE",
	"body": {
		"ordered": "boolean",
		"single": "boolean",
		"question": "string",
		"choices": [
			"string",
			"string",
			..., 
			"string"
		]
	}
}
```

**Number range**: 

```json
{
	"title": "optional string",
	"type": "NUMBER_RANGE",
	"body": {
		"question": "string",
		"min": "number",
		"max": "number"
	}
}
```


**Song**: 

```json
{
	"type": "SONG",
	"body": {
		"artists": [
			"string", 
			"string"
		],
		"name": "string",
		"img_src": "string",
		"src": "string"
	}
}
```

or
```json
{
	"type": "SONG",
	"body": {
		"track_id": "string" // track_id is an identifer for a track in the spotify api
	}
}
```



