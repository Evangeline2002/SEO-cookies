import mysql from 'mysql2/promise';

async function killSleeping() {
    const connUrl = 'mysql://cookie_heaven_chooselaw:b4ad29155aa451b5750ec511da77cfbfaeac00ad@03pjpq.h.filess.io:3306/cookie_heaven_chooselaw';
    while (true) {
        let conn;
        try {
            console.log('Attempting to infiltrate filess.io connection pool...');
            conn = await mysql.createConnection(connUrl);
            console.log('Successfully Connected! Identifying orphaned connections...');

            const [rows] = await conn.query("SHOW PROCESSLIST");
            let killed = 0;

            for (const row of rows) {
                if (row.Id !== conn.threadId) {
                    console.log(`Killing orphaned thread ${row.Id} (${row.Command})...`);
                    await conn.query(`KILL ${row.Id}`);
                    killed++;
                }
            }

            console.log(`Successfully purged ${killed} orphaned connections from filess.io.`);
            break;
        } catch (e) {
            console.log('Pool is still locked:', e.message);
            await new Promise(r => setTimeout(r, 5000));
        } finally {
            if (conn) {
                await conn.end();
            }
        }
    }
    process.exit(0);
}
killSleeping();
