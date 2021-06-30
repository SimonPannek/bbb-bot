const exams = [
    {
        date: new Date('2021-05-04'),
        name: 'Quiz 1',
        registration: null,
        grading: '2 bonus points',
    },
    {
        date: new Date('2021-06-08'),
        name: 'midterm',
        registration: new Date('2021-05-19'),
        grading: '10 bonus points',
    },
    {
        date: new Date('2021-07-05'),
        name: 'Quiz 2',
        registration: null,
        grading: '2 bonus points',
    },
    {
        date: new Date('2021-07-27'),
        name: 'endterm',
        registration: null,
        grading: '90 points (+ up to 15 bonus points you have earned)',
    },
    {
        date: null,
        name: 'retake',
        registration: null,
        grading: '90 points (+ up to 15 bonus points you have earned)',
    }];

module.exports = {
    name: "nextexam",
    description: "Print the date of the next exam.",
    async execute() {
        const reply = [];

        const next = exams.filter(exam => !exam.date || Date.now() < exam.date.valueOf())[0];
        if (!next) {
            reply.push("Good news! There is no exam coming up.");
        } else {
            reply.push(`The next exam is the ${next.name} on`);
            reply.push(`${next.date ? next.date.toLocaleDateString("de-DE") : "an unknown date"}. You can`);

            if (next.registration) {
                reply.push(`register until ${next.registration.toLocaleDateString('de-DE')} and`);
            }

            reply.push(`earn up to ${next.grading}.`);
        }

        return reply.join(" ");
    }
};
