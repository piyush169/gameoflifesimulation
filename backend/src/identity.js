// identity.js
// Who is this container? Resolved once at startup.
//  - On Fargate: from the ECS task metadata endpoint (task id, AZ, real CPU/memory limits).
//  - Locally / in docker-compose: hostname + pid, limits from env or cgroup.
const os = require('os');
const fs = require('fs');

const startedAt = Date.now();
let identity = null;

function readFile(path) {
    try { return fs.readFileSync(path, 'utf8').trim(); } catch (_) { return null; }
}

// CPU limit in vCPUs from the container's cgroup (v2, then v1). null if unlimited/unknown.
function cgroupCpuLimit() {
    const v2 = readFile('/sys/fs/cgroup/cpu.max');
    if (v2) {
        const [quota, period] = v2.split(' ');
        if (quota !== 'max' && Number(period) > 0) return Number(quota) / Number(period);
    }
    const quota = Number(readFile('/sys/fs/cgroup/cpu/cpu.cfs_quota_us'));
    const period = Number(readFile('/sys/fs/cgroup/cpu/cpu.cfs_period_us'));
    if (quota > 0 && period > 0) return quota / period;
    return null;
}

// Memory limit in MiB from the cgroup (v2, then v1). null if unlimited/unknown.
function cgroupMemLimitMb() {
    const v2 = readFile('/sys/fs/cgroup/memory.max');
    if (v2 && v2 !== 'max') return Number(v2) / 1048576;
    const v1 = Number(readFile('/sys/fs/cgroup/memory/memory.limit_in_bytes'));
    if (v1 > 0 && v1 < 2 ** 50) return v1 / 1048576; // v1 reports a huge number when unlimited
    return null;
}

async function loadIdentity() {
    if (identity) return identity;

    const id = {
        id: `${os.hostname()}-${process.pid}`,
        shortId: null,
        az: 'local',
        source: 'local',
        startedAt,
        cpuLimit: null,   // vCPUs
        memLimitMb: null  // MiB
    };

    // 1. Fargate: ask the task metadata endpoint (injected by ECS automatically).
    const metaUri = process.env.ECS_CONTAINER_METADATA_URI_V4;
    if (metaUri) {
        try {
            const res = await fetch(`${metaUri}/task`, { signal: AbortSignal.timeout(2000) });
            const task = await res.json();
            // TaskARN ends in .../task/<cluster>/<taskId>
            id.id = String(task.TaskARN).split('/').pop();
            id.az = task.AvailabilityZone || 'unknown';
            id.source = 'ecs';
            if (task.Limits) {
                id.cpuLimit = Number(task.Limits.CPU) || null;
                id.memLimitMb = Number(task.Limits.Memory) || null;
            }
        } catch (err) {
            console.error('Could not read ECS task metadata, falling back to local identity:', err.message);
        }
    }

    // 2. Limits: explicit env override > ECS metadata > cgroup > host (host is wrong inside Fargate, so it is last).
    if (process.env.CPU_LIMIT_VCPUS) id.cpuLimit = Number(process.env.CPU_LIMIT_VCPUS);
    if (!id.cpuLimit) id.cpuLimit = cgroupCpuLimit() || os.cpus().length;

    if (process.env.MEM_LIMIT_MB) id.memLimitMb = Number(process.env.MEM_LIMIT_MB);
    if (!id.memLimitMb) id.memLimitMb = cgroupMemLimitMb() || Math.round(os.totalmem() / 1048576);

    id.shortId = id.id.slice(0, id.source === 'ecs' ? 8 : 12);

    identity = id;
    console.log(`Node identity: ${id.id} (az=${id.az}, cpu=${id.cpuLimit} vCPU, mem=${id.memLimitMb} MiB, source=${id.source})`);
    return identity;
}

function getIdentity() {
    if (!identity) throw new Error('identity not loaded yet; call loadIdentity() first');
    return identity;
}

module.exports = { loadIdentity, getIdentity };
