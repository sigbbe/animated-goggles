INSERT INTO
	Form (id, title, description)
VALUES
	(
		"cleedkhbo00002v6klrrm9dwq",
		"Spotify XAI test form",
		"Lorem ipsum dolor sit amet,
consectetur adipiscing elit.Ut leo felis,
elementum in enim sed,
malesuada dignissim magna.Etiam congue eros sit amet felis convallis,
nec pellentesque massa vehicula.Phasellus tempor vestibulum tortor ut scelerisque.Nulla id faucibus nibh.Quisque ut ultricies ipsum.Phasellus pellentesque luctus efficitur."
	);

INSERT INTO
	Question (id, title, body, formId)
VALUES
	(
		"cleedkhbo000a2v6kptiat1s9",
		"Popularity",
		"What is the popularity of the song 'I'm Yours' by Jason Mraz?",
		"cleedkhbo00002v6klrrm9dwq"
	);

INSERT INTO
	Question (id, title, body, formId)
VALUES
	(
		"cleedkhbo000b2v6kd98opmaa",
		"Perceived comprehensibility",
		"How clear/meaningful do you think this explanation is?",
		"cleedkhbo00002v6klrrm9dwq"
	);

INSERT INTO
	Question (id, title, body, formId)
VALUES
	(
		"cleedkhbo000d2v6kei9m23b8",
		"Features",
		"Which of the following features do you think contributed the most to the AI's prediction?",
		"cleedkhbo00002v6klrrm9dwq"
	);

INSERT INTO
	Question (id, title, body, formId)
VALUES
	(
		"cleedkhbo000n2v6k7tuwylea",
		"Multiple choice",
		"Which of the following features do you think contributed the most to the AI's prediction?",
		"cleedkhbo00002v6klrrm9dwq"
	);

INSERT INTO
	MultipleChoice (
		id,
		questionId,
		choice1,
		choice2,
		choice3,
		choice4,
		choice5
	)
VALUES
	(
		"cleedkhbo000u2v6kvvt88an5",
		"cleedkhbo000n2v6k7tuwylea",
		"Artist",
		"Year",
		"Genre",
		"Duration",
		"Explicit"
	);