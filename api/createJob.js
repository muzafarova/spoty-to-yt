const { CloudRobot } = require('@automationcloud/cloud-robot');
const auth = process.env.AUTH;

const robot = new CloudRobot({
    serviceId: '44297322-a2fd-485a-a98a-eb268599735c',
    auth,
});

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

    let jobId = '';

    try {
        const job = await robot.createJob({ input: { url } });
        jobId = job.jobId;
    } catch (err) {
        res.status(500).send({
            error: {
                name: err.message || 'Something went wrong :-('
            }
        });
        return;
    }

    console.log('Job created.');
    res.status(200).send({ jobId });
}
