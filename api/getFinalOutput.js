const { CloudRobot } = require('@automationcloud/cloud-robot');
const auth = process.env.AUTH;

const robot = new CloudRobot({
    serviceId: '44297322-a2fd-485a-a98a-eb268599735c',
    auth,
});

module.exports = async (req, res) => {
    const { jobId } = req.query;

    if (!jobId) {
        res.status(400).send({
            error: {
                name: 'jobId is mandatory'
            }
        });
        return;
    }

    let output = null;

    try {
        const job = await robot.getJob(jobId);
        const state = await job.getState();

        if (state === 'success') {
            output = await job.getOutput('value');
        }

    } catch (err) {
        res.status(500).send({
            error: {
                name: err.message || 'Something went wrong :-('
            }
        });
        return;
    }

    if (output) {
        res.status(200).send({ output });
    } else {
        res.status(204).end();
    }
}
