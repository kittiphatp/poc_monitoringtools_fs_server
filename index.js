const express = require('express'), app = express();

let alerts = [
    {
        node: "RDS_euc-shard1_{{node}}",
        tags: ["us-east", "core services layer"],
        message: "Streaming Service",
        resource: "FRSH-RDS-AMS",
        severity: "critical",
        description: "MEM utilization on streaming service threshold value. Current value is 99.99%",
        metric_name: "Mem Utilization Pct",
        metric_value: "99.20%",
        additional_info: {
            custom_attribute1: "performance",
            custom_attribute2: "capacity",
            custom_attribute3: "p1"
        },
        occurrence_time: ""
    },
    {
        node: "RDS_euc-shard2_{{node}}",
        tags: ["us-west", "database layer"],
        message: "Database Service",
        resource: "FRSH-RDS-DB",
        severity: "warning",
        description: "CPU utilization on database service threshold value. Current value is 85.50%",
        metric_name: "CPU Utilization Pct",
        metric_value: "85.50%",
        additional_info: {
            custom_attribute1: "performance",
            custom_attribute2: "scalability",
            custom_attribute3: "p2"
        },
        occurrence_time: ""
    },
    {
        node: "RDS_euc-shard3_{{node}}",
        tags: ["eu-central", "application layer"],
        message: "Application Service",
        resource: "FRSH-RDS-APP",
        severity: "high",
        description: "Disk space utilization on application service threshold value. Current value is 95.00%",
        metric_name: "Disk Space Utilization Pct",
        metric_value: "95.00%",
        additional_info: {
            custom_attribute1: "capacity",
            custom_attribute2: "storage",
            custom_attribute3: "p1"
        },
        occurrence_time: ""
    },
    {
        node: "RDS_euc-shard4_{{node}}",
        tags: ["ap-south", "cache layer"],
        message: "Cache Service",
        resource: "FRSH-RDS-CACHE",
        severity: "critical",
        description: "Cache hit ratio is reach limits. Current value is 100.00%",
        metric_name: "Cache Hit Ratio",
        metric_value: "100.00%",
        additional_info: {
            custom_attribute1: "performance",
            custom_attribute2: "efficiency",
            custom_attribute3: "p3"
        },
        occurrence_time: ""
    }
];

let resolves = [
    {
        node: "RDS_euc-shard1_{{node}}",
        tags: ["us-east", "core services layer"],
        message: "Streaming Service",
        resource: "FRSH-RDS-AMS",
        severity: "ok",
        description: "MEM utilization on streaming service threshold value. Current value is 30.55%",
        metric_name: "Mem Utilization Pct",
        metric_value: "30.55%",
        additional_info: {
            custom_attribute1: "performance",
            custom_attribute2: "capacity",
            custom_attribute3: "p1"
        },
        occurrence_time: new Date().toISOString()
    },
    {
        node: "RDS_euc-shard2_{{node}}",
        tags: ["us-west", "database layer"],
        message: "Database Service",
        resource: "FRSH-RDS-DB",
        severity: "ok",
        description: "CPU utilization on database service threshold value. Current value is 40.25%",
        metric_name: "CPU Utilization Pct",
        metric_value: "40.25%",
        additional_info: {
            custom_attribute1: "performance",
            custom_attribute2: "scalability",
            custom_attribute3: "p2"
        },
        occurrence_time: ""
    },
    {
        node: "RDS_euc-shard3_{{node}}",
        tags: ["eu-central", "application layer"],
        message: "Application Service",
        resource: "FRSH-RDS-APP",
        severity: "ok",
        description: "Disk space utilization on application service threshold value. Current value is 20.00%",
        metric_name: "Disk Space Utilization Pct",
        metric_value: "20.00%",
        additional_info: {
            custom_attribute1: "capacity",
            custom_attribute2: "storage",
            custom_attribute3: "p1"
        },
        occurrence_time: ""
    },
    {
        node: "RDS_euc-shard4_{{node}}",
        tags: ["ap-south", "cache layer"],
        message: "Cache Service",
        resource: "FRSH-RDS-CACHE",
        severity: "ok",
        description: "Cache hit ratio is within acceptable limits. Current value is 95.00%",
        metric_name: "Cache Hit Ratio",
        metric_value: "95.00%",
        additional_info: {
            custom_attribute1: "performance",
            custom_attribute2: "efficiency",
            custom_attribute3: "p3"
        },
        occurrence_time: ""
    }
];

const sendFreshservice = async (body) => {
    try {
    // const response = await fetch(`${process.env.ALERT_URL}`, {
    const response = await fetch(`https://mverge.alerts.freshservice.com/integrations/1000013068/alerts`, {
        method: 'POST', 
        body: JSON.stringify(body), 
        headers: {
            // "Authorization": `${process.env.ALERT_AUTH_TOKEN}`, 
            "Authorization": `auth-key eyJhbGciOiJIUzI1NiJ9.eyJhX2lkIjoxNTkzOCwic19pZCI6NSwidHMiOjE3NDU5NDIyNjIuMzM5MTkyfQ.f2OnHZKTRXwOOAWpeDrhl0epr_oz199X4hUd_UMnFVU`, 
            'Content-Type': 'application/json' 
        }})
    const data = await response.json()
    const output = {
        sent_status: data,
        payload: body
    }
    return output
    } catch (error) {
        return {
            sent_status: {message: 'Error sending data to Freshservice', error},
            payload: body
        }
    }
}

app.post('/api/alerts/:id', async (req, res) => {
    try{
        const { id } = req.params
        alerts[id].occurrence_time = new Date().toString()
        const msg = await sendFreshservice(alerts[id])
        res.send(msg)
    } catch (err) {
        res.send({message: 'Error on local server', err})
    }
})

app.post('/api/resolves/:id', async (req, res) => {
    try{
        const { id } = req.params
        const send_id = Number(id)
        resolves[send_id].occurrence_time = new Date().toString()
        const msg = await sendFreshservice(resolves[send_id])
        res.send(msg)
    } catch (err) {
        res.send({message: 'Error on local server', err})
    }
})

app.listen(3000, () => console.log('Server is running on port 3000'))
