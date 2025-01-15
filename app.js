#!/usr/bin/env node
const robot = require("robotjs");
const { program } = require('commander');
const { CronJob } = require('cron');

function moveMouse() {
    robot.setMouseDelay(0.95);
    
    const twoPI = Math.PI * 2.0;
    const screenSize = robot.getScreenSize();
    const height = (screenSize.height / 2) - 10;
    const width = screenSize.width;
    
    for (let x = 0; x < width; x++)
    {
        y = height * Math.sin((twoPI * x) / width) + height;
        robot.moveMouse(x, y);
    }

}

function scheduleMouseMovement(time, interval, duration) {
    const [hour, minute] = time.split(':').map(Number);
    const cronTime = `* ${minute} ${hour} * * *`;
    const job = new CronJob(cronTime, () => {
        const intervalId = setInterval(() => {
            moveMouse();
            console.log('Mouse moved');
        }, interval);

        setTimeout(() => {
            clearInterval(intervalId);
            console.log('Scheduled mouse movement ended');
        }, duration);
    });

    job.start();
}

program
    .version('0.0.1')
    .description('自動移動滑鼠的程式');

program
    .command('move')
    .description('啟動滑鼠移動')
    .option('-t, --interval <millisecond>', 'Interval of the mouse movement', 5000)
    .option('-d, --duration <millisecond>', 'Duration of the mouse movement', 36000000)
    .option('-T, --time <HH:MM>', 'Specific Time of the mouse movement')
    .action((options) => {
        console.log('Move mouse in a sine wave pattern');
        if (options.time) {
            console.log('Scheduled mouse movement at', options.time);
            scheduleMouseMovement(options.time, options.interval, options.duration);
        } else {
            setInterval(() => {
                console.log('Mouse moved');
                moveMouse();
            }, options.interval);
        }
    });
    
program.parse(process.argv);