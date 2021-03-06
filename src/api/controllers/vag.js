
function getSessions(req, res, next) {
    let sessions = {};

    this.sessions.forEach(function (session, id) {
        if (session.TAG === 'sip')
            sessions[session.id] = { host: session.via.host, port: session.via.port, info: session.deviceinfo, status: session.devicestatus, catalog: session.catalog };

    });

    res.json(sessions);
}

function getSession(req, res, next) {
    let result = {};

    if (this.sessions.has(req.params.device)) {
        let session = this.sessions.get(req.params.device);

        switch (req.params.action) {
            case 'start':
                session.RealPlay(req.params.channel, req.params.host, req.params.port, req.params.mode);
                break;
            case 'stop':
                session.StopRealPlay(req.params.channel, req.params.host, req.params.port);
                break;
        }

        result.result = true;
        result.message = 'OK';
    }
    else {
        result.result = false;
        result.message = 'device not online';
    }
    res.json(result);
}

async function  ptzControl(req, res) {
    let result = {};

    if (this.sessions.has(req.params.device)) {
        let session = this.sessions.get(req.params.device);

        let result = await session.PTZ(req.params.channel, "PTZCmd", req.params.value);

        result.result = true;
        result.message = 'OK';
    }
    else {
        result.result = false;
        result.message = 'device not online';
    }
    res.json(result);
}



module.exports = { getSession: getSession, getSessions: getSessions, ptzControl: ptzControl }