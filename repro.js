
async function main() {
    try {
        console.log('Fetching http://127.0.0.1:3000/api/quizzes...');
        const res = await fetch('http://127.0.0.1:3000/api/quizzes');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
        const quizzes = JSON.parse(text);
        if (quizzes.length > 0) {
            const quizId = quizzes[0].id;
            console.log(`Fetching questions for quiz ${quizId}...`);
            const res2 = await fetch(`http://127.0.0.1:3000/api/quizzes/${quizId}/questions`);
            console.log('Questions Status:', res2.status);
            const text2 = await res2.text();
            console.log('Questions Body:', text2);

            const totalTime = 10; // 10 minutes
            console.log(`Optimizing questions for quiz ${quizId} with time limit ${totalTime}...`);
            const res3 = await fetch('http://127.0.0.1:3000/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizId, totalTime })
            });
            console.log('Optimize Status:', res3.status);
            const text3 = await res3.text();
            console.log('Optimize Body:', text3);
        }
    } catch (err) {
        console.error('Fetch failed:', err);
    }
}

main();
