const { CloudRobot } = require('@automationcloud/cloud-robot');
const auth = process.env.AUTH;

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        res.status(400).send({
            error: {
                name: 'Playlist or Album URL is not optional!'
            }
        });
        return;
    }

    const robot = new CloudRobot({
        serviceId: '44297322-a2fd-485a-a98a-eb268599735c',
        auth,
    });

    try {
        const data = await main(robot, url);
        res.status(200).send(data);

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: {
                name: err.message || 'Something went wrong :-('
            }
        });
    }
}

async function main(robot, url) {
    const job = await robot.createJob({
        input: { url },
    });
    console.log('Job created.');

    let output;
    job.onOutput('value', async outputData => {
        output = outputData;
        console.info('Job output', output);
    });

    await job.waitForCompletion();
    console.log('Job completed.');

    const state = await job.getState();
    console.info('Job state:', state);

    if (state === 'success') {
        return {
            state,
            output
        };

    }

    const error = await job.getErrorInfo();
    console.error('Job failed with error:', error);
    return {
        state,
        error
    };
}
