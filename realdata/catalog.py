"""The real datasets: Numenta Anomaly Benchmark (NAB), MIT licence, https://github.com/numenta/NAB

Every series is real telemetry. Experts labelled the time windows that contain each real anomaly
(labels/combined_windows.json). RYVO trains on the 17 AWS CloudWatch series and tests on the
7 "known cause" series it never saw during training.

The `scenario` field only says which RYVO scenario models a similar kind of failure. The data itself is
not from 108, UPI or a delivery company.
"""
from shared import config

DIR = config.DATA_DIR / "real"
SOURCE = "Numenta Anomaly Benchmark (NAB)"
SOURCE_URL = "https://github.com/numenta/NAB"
RAW_URL = "https://raw.githubusercontent.com/numenta/NAB/master/data/{id}.csv"
LICENCE = "MIT, Copyright 2014-2024 Numenta Inc."

CLOUDWATCH = "AWS server metric collected by Amazon CloudWatch"
SERIES = {
    # ---- test set: real failures with a documented cause (never used for training)
    "realKnownCause/ec2_request_latency_system_failure": {
        "title": "AWS EC2 request latency", "split": "test", "scenario": "upi",
        "about": "Server data from Amazon's US-East datacenter, ending in a documented failure of AWS API servers.",
        "analogy": "A partner bank slowing down before it fails"},
    "realKnownCause/machine_temperature_system_failure": {
        "title": "Industrial machine temperature", "split": "test", "scenario": "emergency",
        "about": "Temperature sensor inside a large industrial machine: a planned shutdown, a hard-to-see anomaly, then a catastrophic failure.",
        "analogy": "Critical dispatch hardware degrading before it breaks down"},
    "realKnownCause/ambient_temperature_system_failure": {
        "title": "Office temperature (AC failure)", "split": "test", "scenario": "emergency",
        "about": "Ambient temperature in an office; the anomalies are an air-conditioning failure.",
        "analogy": "A facility-level failure around a control room"},
    "realKnownCause/cpu_utilization_asg_misconfiguration": {
        "title": "CPU, auto-scaling misconfiguration", "split": "test", "scenario": "food",
        "about": "Server CPU from an AWS auto-scaling group; the anomaly is a misconfiguration.",
        "analogy": "Free-delivery zone configuration drift"},
    "realKnownCause/nyc_taxi": {
        "title": "NYC taxi passengers", "split": "test", "scenario": "food",
        "about": "Number of New York taxi passengers (30-minute buckets); anomalies are the marathon, Thanksgiving, Christmas, New Year's Day and a snowstorm.",
        "analogy": "A festival or weather surge in delivery demand"},
    "realKnownCause/rogue_agent_key_hold": {
        "title": "Keystroke hold times", "split": "test", "scenario": "upi",
        "about": "How long users hold computer keys; the anomalies are a different person taking over the keyboard.",
        "analogy": "Unusual account behaviour, like a fraud bot"},
    "realKnownCause/rogue_agent_key_updown": {
        "title": "Keystroke up/down timing", "split": "test", "scenario": "upi",
        "about": "Time between key presses; the anomalies are a different person taking over the keyboard.",
        "analogy": "Unusual account behaviour, like a fraud bot"},
}
for _id, _title in [
    ("ec2_cpu_utilization_24ae8d", "EC2 CPU utilisation (24ae8d)"), ("ec2_cpu_utilization_53ea38", "EC2 CPU utilisation (53ea38)"),
    ("ec2_cpu_utilization_5f5533", "EC2 CPU utilisation (5f5533)"), ("ec2_cpu_utilization_77c1ca", "EC2 CPU utilisation (77c1ca)"),
    ("ec2_cpu_utilization_825cc2", "EC2 CPU utilisation (825cc2)"), ("ec2_cpu_utilization_ac20cd", "EC2 CPU utilisation (ac20cd)"),
    ("ec2_cpu_utilization_c6585a", "EC2 CPU utilisation (c6585a)"), ("ec2_cpu_utilization_fe7f93", "EC2 CPU utilisation (fe7f93)"),
    ("ec2_disk_write_bytes_1ef3de", "EC2 disk write bytes (1ef3de)"), ("ec2_disk_write_bytes_c0d644", "EC2 disk write bytes (c0d644)"),
    ("ec2_network_in_257a54", "EC2 network in (257a54)"), ("ec2_network_in_5abac7", "EC2 network in (5abac7)"),
    ("elb_request_count_8c0756", "Load balancer request count"), ("grok_asg_anomaly", "Auto-scaling group metric"),
    ("iio_us-east-1_i-a2eb1cd9_NetworkIn", "EC2 network in (US-East)"),
    ("rds_cpu_utilization_cc0c53", "RDS database CPU (cc0c53)"), ("rds_cpu_utilization_e47b3b", "RDS database CPU (e47b3b)"),
]:
    SERIES[f"realAWSCloudwatch/{_id}"] = {"title": _title, "split": "train", "scenario": None,
                                          "about": CLOUDWATCH + ".", "analogy": None}
