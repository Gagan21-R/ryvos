### Round 1 · 🚑 Emergency response (108) #1
- **Attack** (explore (untried)): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via rules -> applied restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Diagnosed** `dispatch_backlog+high_call_rate` via rules -> applied surge_mode.
- **Tried and failed**: 'surge_mode' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.67.

### Round 2 · 🛵 Food delivery #1
- **Attack** (explore (untried)): festival_surge on citywide.
- **Detected** `order_backlog+high_order_rate` at 31 min.
- **Detected** `eta_breaches` at 61 min.
- **Diagnosed** `order_backlog+high_order_rate` via rules -> applied reassign_riders.
- **Tried and failed**: 'reassign_riders' did not clear it.
- **Diagnosed** `order_backlog+high_order_rate` via rules -> applied batch_orders.
- **Diagnosed** `eta_breaches` via rules -> applied extend_eta_notify.
- **Recovered** in 43 min after the attack.
- **Impact**: Late orders: 25.6%; Cancelled orders: 2; Avg delivery time: 22.3min. Red reward 0.43.
- **Lesson saved**: order_backlog+high_order_rate -> reassign_riders + batch_orders; eta_breaches -> extend_eta_notify.

### Round 3 · 💳 UPI payments #1
- **Attack** (explore (untried)): bank_slow on bank_c.
- **Detected** `high_failure_rate+one_bank` at 17 s.
- **Diagnosed** `high_failure_rate+one_bank` via rules -> applied route_to_healthy_bank.
- **Recovered** in 22 s after the attack.
- **Impact**: Failed payments: 3.8%; Double debits: 0; Money stuck (debited, not confirmed): 10614₹. Red reward 0.16.
- **Lesson saved**: high_failure_rate+one_bank -> route_to_healthy_bank.

### Round 4 · 🚑 Emergency response (108) #2
- **Attack** (explore (untried)): freeze_gps on amb_4, amb_5, amb_7, amb_11....
- **Detected** `gps_stuck` at 9 min.
- **Diagnosed** `gps_stuck` via rules -> applied distrust_gps.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 10.5min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 1. Red reward 0.21.
- **Lesson saved**: gps_stuck -> distrust_gps.

### Round 5 · 🛵 Food delivery #2
- **Attack** (explore (untried)): maps_slow on maps_api.
- **Detected** `assignment_slow` at 8 min.
- **Diagnosed** `assignment_slow` via rules -> applied cached_routes.
- **Recovered** in 7 min after the attack.
- **Impact**: Late orders: 2.3%; Cancelled orders: 0; Avg delivery time: 17.8min. Red reward 0.0.
- **Lesson saved**: assignment_slow -> cached_routes.

### Round 6 · 💳 UPI payments #2
- **Attack** (explore (untried)): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via rules -> applied idempotency_check.
- **Recovered** in 8 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 34; Money stuck (debited, not confirmed): 13547₹. Red reward 0.1.
- **Lesson saved**: double_debits -> idempotency_check.

### Round 7 · 🚑 Emergency response (108) #3
- **Attack** (explore (untried)): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 14 min.
- **Diagnosed** `sms_failing` via rules -> applied backup_sms.
- **Recovered** in 14 min after the attack.
- **Impact**: Avg ambulance arrival: 10.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.15.
- **Lesson saved**: sms_failing -> backup_sms.

### Round 8 · 🛵 Food delivery #3
- **Attack** (explore (untried)): tablet_offline on rest_3, rest_5, rest_6, rest_11....
- **Detected** `orders_unacknowledged` at 18 min.
- **Diagnosed** `orders_unacknowledged` via rules -> applied phone_restaurants.
- **Recovered** in 17 min after the attack.
- **Impact**: Late orders: 3.4%; Cancelled orders: 0; Avg delivery time: 18.6min. Red reward 0.02.
- **Lesson saved**: orders_unacknowledged -> phone_restaurants.

### Round 9 · 💳 UPI payments #3
- **Attack** (explore (untried)): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via rules -> applied queue_rate_limit.
- **Tried and failed**: 'queue_rate_limit' did not clear it.
- **Diagnosed** `fraud_check_backlog+few_devices` via rules -> applied throttle_bot.
- **Recovered** in 23 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.94.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.

### Round 10 · 🚑 Emergency response (108) #4
- **Attack** (explore (untried)): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 20 min.
- **Diagnosed** `dispatch_backlog` via rules -> applied restart_dispatch.
- **Recovered** in 20 min after the attack.
- **Impact**: Avg ambulance arrival: 12.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.27.
- **Lesson saved**: dispatch_backlog -> restart_dispatch.

### Round 11 · 🛵 Food delivery #4
- **Attack** (explore (untried)): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 59 min.
- **Diagnosed** `rider_shortage` via rules -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 9 min after the attack.
- **Impact**: Late orders: 34.6%; Cancelled orders: 0; Avg delivery time: 21.9min. Red reward 0.54.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 12 · 💳 UPI payments #4
- **Attack** (explore (untried)): diwali_spike on all_users.
- **Detected** `high_failure_rate+traffic_spike` at 24 s.
- **Diagnosed** `high_failure_rate+traffic_spike` via rules -> applied route_to_healthy_bank.
- **Tried and failed**: 'route_to_healthy_bank' did not clear it.
- **Diagnosed** `high_failure_rate+traffic_spike` via rules -> applied queue_rate_limit.
- **Tried and failed**: 'queue_rate_limit' did not clear it.
- **Escalated** `high_failure_rate+traffic_spike` to a human.
- **Recovered** in 42 s after the attack.
- **Impact**: Failed payments: 29.4%; Double debits: 0; Money stuck (debited, not confirmed): 256721₹. Red reward 1.0.
- **Lesson saved**: high_failure_rate+traffic_spike -> route_to_healthy_bank + queue_rate_limit.

### Round 13 · 🚑 Emergency response (108) #5
- **Attack** (explore (untried)): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via rules -> applied skip_stale_hospitals.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 8.2min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.

### Round 14 · 🛵 Food delivery #5
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog+high_order_rate` at 36 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Tried and failed**: 'batch_orders' did not clear it.
- **Escalated** `order_backlog+high_order_rate` to a human.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 15 min after the attack.
- **Impact**: Late orders: 46.4%; Cancelled orders: 0; Avg delivery time: 27.1min. Red reward 0.74.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog+high_order_rate -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 15 · 💳 UPI payments #5
- **Attack** (explore): bank_slow on bank_a.
- **Detected** `high_failure_rate+one_bank` at 17 s.
- **Diagnosed** `high_failure_rate+one_bank` via playbook -> applied route_to_healthy_bank.
- **Recovered** in 18 s after the attack.
- **Impact**: Failed payments: 3.1%; Double debits: 0; Money stuck (debited, not confirmed): 10349₹. Red reward 0.13.
- **Lesson saved**: high_failure_rate+one_bank -> route_to_healthy_bank.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 16 · 🚑 Emergency response (108) #6
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 13 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 10.1min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.07.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 17 · 🛵 Food delivery #6
- **Attack** (explore): tablet_offline on rest_6, rest_8, rest_9, rest_12....
- **Detected** `orders_unacknowledged` at 13 min.
- **Diagnosed** `orders_unacknowledged` via playbook -> applied phone_restaurants.
- **Recovered** in 9 min after the attack.
- **Impact**: Late orders: 0.0%; Cancelled orders: 0; Avg delivery time: 17.8min. Red reward 0.0.
- **Lesson saved**: orders_unacknowledged -> phone_restaurants.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 18 · 💳 UPI payments #6
- **Attack** (exploit): diwali_spike on all_users.
- **Detected** `high_failure_rate+traffic_spike` at 21 s.
- **Diagnosed** `high_failure_rate+traffic_spike` via playbook -> applied route_to_healthy_bank + queue_rate_limit.
- **Recovered** in 18 s after the attack.
- **Impact**: Failed payments: 2.1%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.06.
- **Lesson saved**: high_failure_rate+traffic_spike -> route_to_healthy_bank + queue_rate_limit.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 19 · 🚑 Emergency response (108) #7
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via rules -> applied restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Diagnosed** `dispatch_backlog+high_call_rate` via rules -> applied surge_mode.
- **Tried and failed**: 'surge_mode' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 31 min after the attack.
- **Impact**: Avg ambulance arrival: 16.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.79.
- **Lesson saved**: dispatch_backlog+high_call_rate -> restart_dispatch + surge_mode.

### Round 20 · 🛵 Food delivery #7
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 55 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 26.1%; Cancelled orders: 0; Avg delivery time: 23.6min. Red reward 0.4.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 21 · 💳 UPI payments #7
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.19.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 22 · 🚑 Emergency response (108) #8
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog` at 7 min.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Detected** `dispatch_backlog+high_call_rate` at 32 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Tried and failed**: 'surge_mode' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 13.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.52.
- **Lesson saved**: dispatch_backlog -> restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 23 · 🛵 Food delivery #8
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 32.0%; Cancelled orders: 0; Avg delivery time: 23.0min. Red reward 0.5.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 24 · 💳 UPI payments #8
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 25 · 🚑 Emergency response (108) #9
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 28 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Tried and failed**: 'surge_mode' did not clear it.
- **Diagnosed** `dispatch_backlog+high_call_rate` via rules -> applied restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 13.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.48.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 26 · 🛵 Food delivery #9
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 18.9%; Cancelled orders: 0; Avg delivery time: 22.0min. Red reward 0.28.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 27 · 💳 UPI payments #9
- **Attack** (exploit): diwali_spike on all_users.
- **Detected** `high_failure_rate+traffic_spike` at 20 s.
- **Diagnosed** `high_failure_rate+traffic_spike` via playbook -> applied route_to_healthy_bank + queue_rate_limit.
- **Recovered** in 17 s after the attack.
- **Impact**: Failed payments: 2.1%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.06.
- **Lesson saved**: high_failure_rate+traffic_spike -> route_to_healthy_bank + queue_rate_limit.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 28 · 🚑 Emergency response (108) #10
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 15.7min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 7. Red reward 0.81.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 29 · 🛵 Food delivery #10
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 52 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 45.1%; Cancelled orders: 0; Avg delivery time: 26.3min. Red reward 0.72.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 30 · 💳 UPI payments #10
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 31 · 🚑 Emergency response (108) #11
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 10.4min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 1. Red reward 0.2.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 32 · 🛵 Food delivery #11
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog+high_order_rate` at 31 min.
- **Detected** `eta_breaches` at 49 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Tried and failed**: 'batch_orders' did not clear it.
- **Escalated** `order_backlog+high_order_rate` to a human.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 27 min after the attack.
- **Impact**: Late orders: 45.8%; Cancelled orders: 0; Avg delivery time: 29.0min. Red reward 0.73.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify; order_backlog+high_order_rate -> batch_orders.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 33 · 💳 UPI payments #11
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 34 · 🚑 Emergency response (108) #12
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 10.6min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 2. Red reward 0.21.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 35 · 🛵 Food delivery #12
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog` at 40 min.
- **Detected** `eta_breaches` at 57 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog` via rules -> applied batch_orders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 12 min after the attack.
- **Impact**: Late orders: 50.9%; Cancelled orders: 0; Avg delivery time: 26.5min. Red reward 0.81.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 36 · 💳 UPI payments #12
- **Attack** (explore): diwali_spike on all_users.
- **Detected** `high_failure_rate+traffic_spike` at 22 s.
- **Diagnosed** `high_failure_rate+traffic_spike` via playbook -> applied route_to_healthy_bank + queue_rate_limit.
- **Recovered** in 19 s after the attack.
- **Impact**: Failed payments: 1.8%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.05.
- **Lesson saved**: high_failure_rate+traffic_spike -> route_to_healthy_bank + queue_rate_limit.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 37 · 🚑 Emergency response (108) #13
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 38 · 🛵 Food delivery #13
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 55 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 24.4%; Cancelled orders: 0; Avg delivery time: 22.8min. Red reward 0.37.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 39 · 💳 UPI payments #13
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via playbook -> applied idempotency_check.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 10; Money stuck (debited, not confirmed): 5458₹. Red reward 0.02.
- **Lesson saved**: double_debits -> idempotency_check.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 40 · 🚑 Emergency response (108) #14
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 14.2min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.53.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 41 · 🛵 Food delivery #14
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 54 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 48.9%; Cancelled orders: 0; Avg delivery time: 26.6min. Red reward 0.78.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 42 · 💳 UPI payments #14
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 43 · 🚑 Emergency response (108) #15
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 11 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 9.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.04.
- **Lesson saved**: dispatch_backlog -> restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 44 · 🛵 Food delivery #15
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 50 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 13.5%; Cancelled orders: 0; Avg delivery time: 25.9min. Red reward 0.19.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 45 · 💳 UPI payments #15
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 46 · 🚑 Emergency response (108) #16
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 11.9min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 3. Red reward 0.33.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 47 · 🛵 Food delivery #16
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 66 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 29.3%; Cancelled orders: 0; Avg delivery time: 22.6min. Red reward 0.46.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 48 · 💳 UPI payments #16
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.12.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 49 · 🚑 Emergency response (108) #17
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 11.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.19.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 50 · 🛵 Food delivery #17
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 15.4%; Cancelled orders: 0; Avg delivery time: 23.9min. Red reward 0.22.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 51 · 💳 UPI payments #17
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 52 · 🚑 Emergency response (108) #18
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 11.2min; Patients sent to full hospitals: 5; Critical patients waiting >15 min: 1. Red reward 0.32.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 53 · 💳 UPI payments #18
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 54 · 💳 UPI payments #19
- **Attack** (explore): bank_slow on bank_a.
- **Detected** `high_failure_rate+one_bank` at 16 s.
- **Diagnosed** `high_failure_rate+one_bank` via playbook -> applied route_to_healthy_bank.
- **Recovered** in 18 s after the attack.
- **Impact**: Failed payments: 2.9%; Double debits: 0; Money stuck (debited, not confirmed): 10246₹. Red reward 0.12.
- **Lesson saved**: high_failure_rate+one_bank -> route_to_healthy_bank.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 55 · 💳 UPI payments #20
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via playbook -> applied idempotency_check.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 11; Money stuck (debited, not confirmed): 5132₹. Red reward 0.02.
- **Lesson saved**: double_debits -> idempotency_check.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 56 · 💳 UPI payments #21
- **Attack** (explore): diwali_spike on all_users.
- **Detected** `high_failure_rate+traffic_spike` at 20 s.
- **Diagnosed** `high_failure_rate+traffic_spike` via playbook -> applied route_to_healthy_bank + queue_rate_limit.
- **Recovered** in 17 s after the attack.
- **Impact**: Failed payments: 1.7%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.05.
- **Lesson saved**: high_failure_rate+traffic_spike -> route_to_healthy_bank + queue_rate_limit.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 57 · 💳 UPI payments #22
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 58 · 💳 UPI payments #23
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.13.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 59 · 💳 UPI payments #24
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 60 · 💳 UPI payments #25
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 61 · 💳 UPI payments #26
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.13.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 62 · 💳 UPI payments #27
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 63 · 💳 UPI payments #28
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 64 · 💳 UPI payments #29
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 65 · 💳 UPI payments #30
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 66 · 💳 UPI payments #31
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.21.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 67 · 💳 UPI payments #32
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.19.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 68 · 💳 UPI payments #33
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 69 · 💳 UPI payments #34
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.13.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 70 · 💳 UPI payments #35
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 71 · 🚑 Emergency response (108) #19
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 12.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.46.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 72 · 🚑 Emergency response (108) #20
- **Attack** (scenario): freeze_gps on amb_2, amb_3, amb_4, amb_6..., kill_sms on sms_gateway.
- **Detected** `gps_stuck` at 8 min.
- **Detected** `sms_failing` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 10.7min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.19.
- **Lesson saved**: gps_stuck -> distrust_gps; sms_failing -> backup_sms.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 73 · 🚑 Emergency response (108) #21
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 13.0min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.39.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 74 · 🛵 Food delivery #18
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 19.5%; Cancelled orders: 0; Avg delivery time: 23.5min. Red reward 0.29.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 75 · 💳 UPI payments #36
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 10 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.11.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 76 · 🚑 Emergency response (108) #22
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode.
- **Tried and failed**: 'surge_mode' did not clear it.
- **Diagnosed** `dispatch_backlog+high_call_rate` via rules -> applied restart_dispatch.
- **Recovered** in 24 min after the attack.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.74.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 77 · 🚑 Emergency response (108) #23
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 11.0min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.18.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 78 · 🚑 Emergency response (108) #24
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 26 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.0min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.88.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 79 · 🚑 Emergency response (108) #25
- **Attack** (explore): freeze_gps on amb_4, amb_5, amb_6, amb_9....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 8.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 80 · 🚑 Emergency response (108) #26
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 11.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.28.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 81 · 🚑 Emergency response (108) #27
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.1min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.07.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 82 · 🚑 Emergency response (108) #28
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 11.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.26.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 83 · 🚑 Emergency response (108) #29
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 27 min.
- **Detected** `dispatch_backlog+high_call_rate` at 35 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 14.0min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.57.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 84 · 🚑 Emergency response (108) #30
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Detected** `dispatch_backlog+high_call_rate` at 38 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 14.1min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.49.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 85 · 🚑 Emergency response (108) #31
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 11.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.2.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 86 · 🚑 Emergency response (108) #32
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 19 min.
- **Detected** `dispatch_backlog+high_call_rate` at 26 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 0.83.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 87 · 🚑 Emergency response (108) #33
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 12.5min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.36.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 88 · 🚑 Emergency response (108) #34
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Detected** `dispatch_backlog+high_call_rate` at 36 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 14.5min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 7. Red reward 0.79.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 89 · 🚑 Emergency response (108) #35
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 12.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.29.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 90 · 🚑 Emergency response (108) #36
- **Attack** (scenario): freeze_gps on amb_3, amb_5, amb_7, amb_8..., kill_sms on sms_gateway.
- **Detected** `sms_failing` at 9 min.
- **Detected** `gps_stuck` at 14 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 8.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: sms_failing -> backup_sms; gps_stuck -> distrust_gps.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 91 · 🛵 Food delivery #19
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 53 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 25.0%; Cancelled orders: 0; Avg delivery time: 24.2min. Red reward 0.38.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 92 · 💳 UPI payments #37
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 8 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.08.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 93 · 🚑 Emergency response (108) #37
- **Attack** (scenario): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 22.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 10. Red reward 1.0.

### Round 94 · 🚑 Emergency response (108) #38
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 19 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 16 min after the attack.
- **Impact**: Avg ambulance arrival: 13.7min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.43.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 95 · 🚑 Emergency response (108) #39
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 15.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.62.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 96 · 🚑 Emergency response (108) #40
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 0.99.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 97 · 🚑 Emergency response (108) #41
- **Attack** (explore): freeze_gps on amb_4, amb_5, amb_6, amb_9....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.0min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 98 · 🚑 Emergency response (108) #42
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 24 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 23 min after the attack.
- **Impact**: Avg ambulance arrival: 16.2min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 3. Red reward 0.76.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 99 · 🚑 Emergency response (108) #43
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 13.0min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 6. Red reward 0.57.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 100 · 🚑 Emergency response (108) #44
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 12. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 101 · 🚑 Emergency response (108) #45
- **Attack** (scenario): freeze_gps on amb_3, amb_5, amb_6, amb_7..., kill_sms on sms_gateway.
- **Detected** `gps_stuck` at 8 min.
- **Detected** `sms_failing` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 10.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.09.
- **Lesson saved**: gps_stuck -> distrust_gps; sms_failing -> backup_sms.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 102 · 🚑 Emergency response (108) #46
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 11.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.19.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 103 · 🛵 Food delivery #20
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 35.4%; Cancelled orders: 1; Avg delivery time: 25.9min. Red reward 0.58.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 104 · 💳 UPI payments #38
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 9 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.08.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 105 · 🚑 Emergency response (108) #47
- **Attack** (scenario): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 1.0.

### Round 106 · 🚑 Emergency response (108) #48
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.1min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 107 · 🚑 Emergency response (108) #49
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 18 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 15 min after the attack.
- **Impact**: Avg ambulance arrival: 15.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.64.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 108 · 🚑 Emergency response (108) #50
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 7 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 109 · 🚑 Emergency response (108) #51
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 14.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.62.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 110 · 🚑 Emergency response (108) #52
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 14.2min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.53.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 111 · 🚑 Emergency response (108) #53
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 14.5min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 3. Red reward 0.59.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 112 · 🚑 Emergency response (108) #54
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 19 min after the attack.
- **Impact**: Avg ambulance arrival: 21.6min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 113 · 🚑 Emergency response (108) #55
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Detected** `dispatch_backlog+high_call_rate` at 30 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 8. Red reward 0.92.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 114 · 🚑 Emergency response (108) #56
- **Attack** (scenario): freeze_gps on amb_1, amb_2, amb_3, amb_5..., kill_sms on sms_gateway.
- **Detected** `sms_failing` at 7 min.
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.04.
- **Lesson saved**: sms_failing -> backup_sms; gps_stuck -> distrust_gps.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 115 · 🛵 Food delivery #21
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 61 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 45.1%; Cancelled orders: 0; Avg delivery time: 24.5min. Red reward 0.72.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 116 · 💳 UPI payments #39
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 10 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.1.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 117 · 🚑 Emergency response (108) #57
- **Attack** (scenario): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 8. Red reward 1.0.

### Round 118 · 🚑 Emergency response (108) #58
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 22 min.
- **Detected** `dispatch_backlog+high_call_rate` at 30 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 21 min after the attack.
- **Impact**: Avg ambulance arrival: 15.3min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 2. Red reward 0.72.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 119 · 🚑 Emergency response (108) #59
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 10.0min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.06.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 120 · 🚑 Emergency response (108) #60
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 14.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.48.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 121 · 🚑 Emergency response (108) #61
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 19 min after the attack.
- **Impact**: Avg ambulance arrival: 15.3min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.7.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 122 · 🚑 Emergency response (108) #62
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 9.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.06.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 123 · 🚑 Emergency response (108) #63
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 11.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.25.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 124 · 🚑 Emergency response (108) #64
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 13.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.51.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 125 · 🚑 Emergency response (108) #65
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.59.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 126 · 🚑 Emergency response (108) #66
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.3min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.01.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 127 · 🚑 Emergency response (108) #67
- **Attack** (scenario): freeze_gps on amb_3, amb_5, amb_7, amb_8..., kill_sms on sms_gateway.
- **Detected** `gps_stuck` at 8 min.
- **Detected** `sms_failing` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.0min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 0. Red reward 0.02.
- **Lesson saved**: gps_stuck -> distrust_gps; sms_failing -> backup_sms.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 128 · 🛵 Food delivery #22
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog+high_order_rate` at 32 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 8 min after the attack.
- **Impact**: Late orders: 36.9%; Cancelled orders: 1; Avg delivery time: 23.8min. Red reward 0.6.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog+high_order_rate -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 129 · 💳 UPI payments #40
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 9 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.1.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 130 · 🚑 Emergency response (108) #68
- **Attack** (scenario): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 1.0.

### Round 131 · 🚑 Emergency response (108) #69
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 5. Red reward 0.62.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 132 · 🚑 Emergency response (108) #70
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 29 min after the attack.
- **Impact**: Avg ambulance arrival: 16.5min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.8.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 133 · 🚑 Emergency response (108) #71
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 10.7min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 1. Red reward 0.19.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 134 · 🚑 Emergency response (108) #72
- **Attack** (explore): freeze_gps on amb_4, amb_5, amb_6, amb_9....
- **Detected** `gps_stuck` at 17 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 14 min after the attack.
- **Impact**: Avg ambulance arrival: 9.2min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 135 · 🚑 Emergency response (108) #73
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 24 min.
- **Detected** `dispatch_backlog+high_call_rate` at 28 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 0.96.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 136 · 🚑 Emergency response (108) #74
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.6min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.12.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 137 · 🚑 Emergency response (108) #75
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog` at 28 min.
- **Detected** `dispatch_backlog+high_call_rate` at 33 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 8. Red reward 0.9.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog -> restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 138 · 🚑 Emergency response (108) #76
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 5. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 139 · 🚑 Emergency response (108) #77
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 10.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.15.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 140 · 🚑 Emergency response (108) #78
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 7.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 141 · 🚑 Emergency response (108) #79
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 15.6min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.74.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 142 · 🚑 Emergency response (108) #80
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Detected** `dispatch_backlog+high_call_rate` at 22 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 143 · 🚑 Emergency response (108) #81
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 7 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 8.5min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 144 · 🚑 Emergency response (108) #82
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 11.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.28.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 145 · 🚑 Emergency response (108) #83
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 11.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.19.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 146 · 🚑 Emergency response (108) #84
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 12.5min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.37.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 147 · 🚑 Emergency response (108) #85
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 6 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 3 min after the attack.
- **Impact**: Avg ambulance arrival: 13.2min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 4. Red reward 0.57.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 148 · 🚑 Emergency response (108) #86
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 8.5min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 149 · 🚑 Emergency response (108) #87
- **Attack** (explore): freeze_gps on amb_1, amb_3, amb_4, amb_6....
- **Detected** `gps_stuck` at 10 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 14.2min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 4. Red reward 0.67.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 150 · 🚑 Emergency response (108) #88
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 151 · 🚑 Emergency response (108) #89
- **Attack** (exploit): freeze_gps on amb_1, amb_3, amb_6, amb_7....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 8.7min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 152 · 🚑 Emergency response (108) #90
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 8.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 153 · 🚑 Emergency response (108) #91
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 9.8min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 1. Red reward 0.1.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 154 · 🚑 Emergency response (108) #92
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 30 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 14.2min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 7. Red reward 0.72.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 155 · 🚑 Emergency response (108) #93
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.81.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 156 · 🚑 Emergency response (108) #94
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 27 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.5min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 10. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 157 · 🚑 Emergency response (108) #95
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 14.3min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 3. Red reward 0.57.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 158 · 🚑 Emergency response (108) #96
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 14.8min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 2. Red reward 0.63.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 159 · 🚑 Emergency response (108) #97
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Detected** `dispatch_backlog+high_call_rate` at 33 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 17 min after the attack.
- **Impact**: Avg ambulance arrival: 12.3min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 1. Red reward 0.39.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 160 · 🚑 Emergency response (108) #98
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 32 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 20 min after the attack.
- **Impact**: Avg ambulance arrival: 16.6min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.81.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 161 · 🚑 Emergency response (108) #99
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 13.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.44.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 162 · 🚑 Emergency response (108) #100
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 10 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 9.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.04.
- **Lesson saved**: dispatch_backlog -> restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 163 · 🚑 Emergency response (108) #101
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.7min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 9. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 164 · 🚑 Emergency response (108) #102
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 10.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.09.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 165 · 🚑 Emergency response (108) #103
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 10.7min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.18.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 166 · 🚑 Emergency response (108) #104
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 15.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 0.77.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 167 · 🚑 Emergency response (108) #105
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 29 min.
- **Detected** `dispatch_backlog+high_call_rate` at 37 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 25 min after the attack.
- **Impact**: Avg ambulance arrival: 14.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.49.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 168 · 🚑 Emergency response (108) #106
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 13.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.42.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 169 · 🚑 Emergency response (108) #107
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 11.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.27.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 170 · 🚑 Emergency response (108) #108
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 12.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.35.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 171 · 🚑 Emergency response (108) #109
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.8min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 5. Red reward 0.92.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 172 · 🚑 Emergency response (108) #110
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 11 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 8.9min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog -> restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 173 · 🚑 Emergency response (108) #111
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 20 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 174 · 🚑 Emergency response (108) #112
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 8.8min; Patients sent to full hospitals: 5; Critical patients waiting >15 min: 1. Red reward 0.08.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 175 · 🚑 Emergency response (108) #113
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 12.3min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 3. Red reward 0.37.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 176 · 🚑 Emergency response (108) #114
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 19 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Detected** `dispatch_backlog+high_call_rate` at 35 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 22 min after the attack.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 7. Red reward 0.89.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 4 time(s) - no investigation needed.

### Round 177 · 🚑 Emergency response (108) #115
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Detected** `dispatch_backlog+high_call_rate` at 19 min.
- **Detected** `dispatch_backlog+high_call_rate` at 25 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 25 min after the attack.
- **Impact**: Avg ambulance arrival: 17.7min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 7. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 178 · 🚑 Emergency response (108) #116
- **Attack** (explore): freeze_gps on amb_3, amb_5, amb_8, amb_9....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 8.5min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 179 · 🚑 Emergency response (108) #117
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 27 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 29 min after the attack.
- **Impact**: Avg ambulance arrival: 16.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.8.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 180 · 🚑 Emergency response (108) #118
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 12.1min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.3.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 181 · 🚑 Emergency response (108) #119
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 19 min after the attack.
- **Impact**: Avg ambulance arrival: 15.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.69.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 182 · 🚑 Emergency response (108) #120
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Detected** `dispatch_backlog+high_call_rate` at 35 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 15 min after the attack.
- **Impact**: Avg ambulance arrival: 17.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 10. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 183 · 🚑 Emergency response (108) #121
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 8 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 8.1min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 184 · 🚑 Emergency response (108) #122
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.65.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 185 · 🚑 Emergency response (108) #123
- **Attack** (explore): freeze_gps on amb_1, amb_2, amb_4, amb_7....
- **Detected** `gps_stuck` at 13 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 7.7min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 186 · 🚑 Emergency response (108) #124
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 13 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 9.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.04.
- **Lesson saved**: dispatch_backlog -> restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 187 · 🚑 Emergency response (108) #125
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 13.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.46.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 188 · 🚑 Emergency response (108) #126
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 29 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.7min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 5. Red reward 0.77.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 189 · 🚑 Emergency response (108) #127
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 7.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 190 · 🚑 Emergency response (108) #128
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 14 min after the attack.
- **Impact**: Avg ambulance arrival: 12.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.37.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 191 · 🚑 Emergency response (108) #129
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.5.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 192 · 🚑 Emergency response (108) #130
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 11.6min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.32.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 193 · 🚑 Emergency response (108) #131
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 13.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.45.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 194 · 🚑 Emergency response (108) #132
- **Attack** (explore): freeze_gps on amb_2, amb_3, amb_4, amb_6....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.03.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 195 · 🚑 Emergency response (108) #133
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 13.0min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 5. Red reward 0.5.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 196 · 🚑 Emergency response (108) #134
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog` at 17 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Diagnosed** `dispatch_backlog` via rules -> applied surge_mode.
- **Recovered** in 21 min after the attack.
- **Impact**: Avg ambulance arrival: 14.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.61.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 197 · 🚑 Emergency response (108) #135
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Detected** `dispatch_backlog+high_call_rate` at 22 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.97.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 198 · 🚑 Emergency response (108) #136
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 13.0min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 4. Red reward 0.51.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 199 · 🚑 Emergency response (108) #137
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Detected** `dispatch_backlog` at 29 min.
- **Detected** `dispatch_backlog+high_call_rate` at 33 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 24 min after the attack.
- **Impact**: Avg ambulance arrival: 17.6min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 8. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog -> restart_dispatch + surge_mode; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 4 time(s) - no investigation needed.

### Round 200 · 🛵 Food delivery #23
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog` at 40 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog` via playbook -> applied batch_orders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 8 min after the attack.
- **Impact**: Late orders: 43.4%; Cancelled orders: 0; Avg delivery time: 26.8min. Red reward 0.69.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 201 · 💳 UPI payments #41
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via playbook -> applied idempotency_check.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 18; Money stuck (debited, not confirmed): 14684₹. Red reward 0.06.
- **Lesson saved**: double_debits -> idempotency_check.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 202 · 🚑 Emergency response (108) #138
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 10.1min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 1. Red reward 0.17.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 203 · 🛵 Food delivery #24
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog` at 38 min.
- **Detected** `eta_breaches` at 50 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog` via playbook -> applied batch_orders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 10 min after the attack.
- **Impact**: Late orders: 44.0%; Cancelled orders: 0; Avg delivery time: 29.6min. Red reward 0.7.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 204 · 💳 UPI payments #42
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 205 · 🚑 Emergency response (108) #139
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 19 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 16 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.5.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 206 · 🛵 Food delivery #25
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog` at 28 min.
- **Detected** `eta_breaches` at 53 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog` via playbook -> applied batch_orders.
- **Tried and failed**: 'batch_orders' did not clear it.
- **Escalated** `order_backlog` to a human.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 15 min after the attack.
- **Impact**: Late orders: 58.5%; Cancelled orders: 0; Avg delivery time: 26.6min. Red reward 0.94.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 207 · 💳 UPI payments #43
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 208 · 🚑 Emergency response (108) #140
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 12.1min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.29.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 209 · 🛵 Food delivery #26
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 57 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 29.3%; Cancelled orders: 1; Avg delivery time: 23.1min. Red reward 0.48.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 210 · 💳 UPI payments #44
- **Attack** (explore): bank_slow on bank_a.
- **Detected** `high_failure_rate+one_bank` at 16 s.
- **Diagnosed** `high_failure_rate+one_bank` via playbook -> applied route_to_healthy_bank.
- **Recovered** in 18 s after the attack.
- **Impact**: Failed payments: 3.3%; Double debits: 0; Money stuck (debited, not confirmed): 9465₹. Red reward 0.14.
- **Lesson saved**: high_failure_rate+one_bank -> route_to_healthy_bank.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 211 · 🚑 Emergency response (108) #141
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 8 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 9.5min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.01.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 212 · 🛵 Food delivery #27
- **Attack** (explore): tablet_offline on rest_6, rest_8, rest_9, rest_12....
- **Detected** `orders_unacknowledged` at 22 min.
- **Diagnosed** `orders_unacknowledged` via playbook -> applied phone_restaurants.
- **Recovered** in 18 min after the attack.
- **Impact**: Late orders: 0.0%; Cancelled orders: 0; Avg delivery time: 18.6min. Red reward 0.0.
- **Lesson saved**: orders_unacknowledged -> phone_restaurants.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 213 · 💳 UPI payments #45
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 4 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.11.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 214 · 🚑 Emergency response (108) #142
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 8.1min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 215 · 🛵 Food delivery #28
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 54 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 16.2%; Cancelled orders: 0; Avg delivery time: 23.1min. Red reward 0.24.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 216 · 💳 UPI payments #46
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 217 · 🚑 Emergency response (108) #143
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 36 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 19 min after the attack.
- **Impact**: Avg ambulance arrival: 14.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.6.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 218 · 🛵 Food delivery #29
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 37.3%; Cancelled orders: 0; Avg delivery time: 22.7min. Red reward 0.59.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 219 · 💳 UPI payments #47
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.2.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 220 · 🚑 Emergency response (108) #144
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 26 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 7. Red reward 0.76.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 221 · 🛵 Food delivery #30
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 54 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 41.5%; Cancelled orders: 0; Avg delivery time: 25.0min. Red reward 0.66.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 222 · 💳 UPI payments #48
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 4 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.1.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 223 · 🚑 Emergency response (108) #145
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 9.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 224 · 🛵 Food delivery #31
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog+high_order_rate` at 31 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 9 min after the attack.
- **Impact**: Late orders: 35.6%; Cancelled orders: 0; Avg delivery time: 22.6min. Red reward 0.56.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog+high_order_rate -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 225 · 💳 UPI payments #49
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.17.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 226 · 🚑 Emergency response (108) #146
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog` at 19 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Recovered** in 16 min after the attack.
- **Impact**: Avg ambulance arrival: 16.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.77.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 227 · 🚑 Emergency response (108) #147
- **Attack** (scenario): freeze_gps on amb_1, amb_2, amb_4, amb_8..., kill_sms on sms_gateway.
- **Detected** `sms_failing` at 8 min.
- **Detected** `gps_stuck` at 13 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 10.9min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 0. Red reward 0.21.
- **Lesson saved**: sms_failing -> backup_sms; gps_stuck -> distrust_gps.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 228 · 🛵 Food delivery #32
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 60 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 32.0%; Cancelled orders: 0; Avg delivery time: 23.8min. Red reward 0.5.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 229 · 💳 UPI payments #50
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 10 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.1.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 230 · 🚑 Emergency response (108) #148
- **Attack** (scenario): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 0.9.

### Round 231 · 🚑 Emergency response (108) #149
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 13.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.4.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 232 · 🚑 Emergency response (108) #150
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Detected** `dispatch_backlog+high_call_rate` at 36 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 16 min after the attack.
- **Impact**: Avg ambulance arrival: 17.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 0.99.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 233 · 🚑 Emergency response (108) #151
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 22 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.79.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 234 · 🚑 Emergency response (108) #152
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 19 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 21.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 235 · 🚑 Emergency response (108) #153
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Detected** `dispatch_backlog+high_call_rate` at 28 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 13.1min; Patients sent to full hospitals: 5; Critical patients waiting >15 min: 2. Red reward 0.54.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 236 · 🚑 Emergency response (108) #154
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 14.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.56.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 237 · 🚑 Emergency response (108) #155
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 9.6min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.12.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 238 · 🚑 Emergency response (108) #156
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 15.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.66.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 239 · 🚑 Emergency response (108) #157
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 30 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 14.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.61.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 240 · 🚑 Emergency response (108) #158
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 14.6min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 3. Red reward 0.68.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 241 · 🚑 Emergency response (108) #159
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 19.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 242 · 🚑 Emergency response (108) #160
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 5. Red reward 0.66.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 243 · 🚑 Emergency response (108) #161
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 12.4min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 1. Red reward 0.36.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 244 · 🚑 Emergency response (108) #162
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 21 min.
- **Detected** `dispatch_backlog+high_call_rate` at 32 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 20 min after the attack.
- **Impact**: Avg ambulance arrival: 13.1min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.43.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 245 · 🚑 Emergency response (108) #163
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 25 min after the attack.
- **Impact**: Avg ambulance arrival: 16.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.79.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 246 · 🚑 Emergency response (108) #164
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 32 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.8min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 6. Red reward 0.99.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 247 · 🚑 Emergency response (108) #165
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 15.7min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 5. Red reward 0.85.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 248 · 🛵 Food delivery #33
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 14.3%; Cancelled orders: 0; Avg delivery time: 22.4min. Red reward 0.21.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 249 · 💳 UPI payments #51
- **Attack** (explore): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 250 · 🚑 Emergency response (108) #166
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 9 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 9.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.02.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 251 · 🚑 Emergency response (108) #167
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 12.5min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.36.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 252 · 🚑 Emergency response (108) #168
- **Attack** (scenario): freeze_gps on amb_4, amb_5, amb_8, amb_10..., kill_sms on sms_gateway.
- **Detected** `gps_stuck` at 8 min.
- **Detected** `sms_failing` at 12 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 8.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps; sms_failing -> backup_sms.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 253 · 🛵 Food delivery #34
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 41.7%; Cancelled orders: 0; Avg delivery time: 24.2min. Red reward 0.66.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 254 · 💳 UPI payments #52
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 9 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.09.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 255 · 🚑 Emergency response (108) #169
- **Attack** (scenario): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 0.92.

### Round 256 · 🚑 Emergency response (108) #170
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 13 min after the attack.
- **Impact**: Avg ambulance arrival: 13.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.45.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 257 · 🚑 Emergency response (108) #171
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 14.1min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 4. Red reward 0.62.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 258 · 🚑 Emergency response (108) #172
- **Attack** (explore): freeze_gps on amb_4, amb_5, amb_6, amb_9....
- **Detected** `gps_stuck` at 9 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 7.6min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 259 · 🚑 Emergency response (108) #173
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 27 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 19 min after the attack.
- **Impact**: Avg ambulance arrival: 16.5min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 7. Red reward 0.91.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 260 · 🚑 Emergency response (108) #174
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 13.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 0.52.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 261 · 🚑 Emergency response (108) #175
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 18 min.
- **Detected** `dispatch_backlog+high_call_rate` at 35 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 17 min after the attack.
- **Impact**: Avg ambulance arrival: 15.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.66.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 262 · 🚑 Emergency response (108) #176
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Detected** `dispatch_backlog+high_call_rate` at 32 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 23 min after the attack.
- **Impact**: Avg ambulance arrival: 14.4min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.52.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 263 · 🚑 Emergency response (108) #177
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 15.8min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 4. Red reward 0.79.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 264 · 🚑 Emergency response (108) #178
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 8.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 265 · 🚑 Emergency response (108) #179
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 9.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.06.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 266 · 🚑 Emergency response (108) #180
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 26 min after the attack.
- **Impact**: Avg ambulance arrival: 16.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.74.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 267 · 🚑 Emergency response (108) #181
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 10 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 10.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.07.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 268 · 🚑 Emergency response (108) #182
- **Attack** (scenario): freeze_gps on amb_3, amb_4, amb_8, amb_9..., kill_sms on sms_gateway.
- **Detected** `sms_failing` at 7 min.
- **Detected** `gps_stuck` at 9 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 10.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.08.
- **Lesson saved**: sms_failing -> backup_sms; gps_stuck -> distrust_gps.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 269 · 💳 UPI payments #53
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.18.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 270 · 🚑 Emergency response (108) #183
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 17.3min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 6. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 271 · 🚑 Emergency response (108) #184
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 10.0min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.16.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 272 · 💳 UPI payments #54
- **Attack** (scenario): diwali_spike on all_users, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 9 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.09.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 273 · 🚑 Emergency response (108) #185
- **Attack** (scenario): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 30 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 26 min after the attack.
- **Impact**: Avg ambulance arrival: 14.6min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 4. Red reward 0.67.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 274 · 🚑 Emergency response (108) #186
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 14.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.62.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 275 · 🚑 Emergency response (108) #187
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 9 min.
- **Diagnosed** `sms_failing` via playbook -> applied backup_sms.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 13.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.46.
- **Lesson saved**: sms_failing -> backup_sms.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 276 · 🚑 Emergency response (108) #188
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 24 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.5min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.83.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 277 · 🚑 Emergency response (108) #189
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 11.9min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.36.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 278 · 🚑 Emergency response (108) #190
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 25 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 13 min after the attack.
- **Impact**: Avg ambulance arrival: 17.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.92.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 279 · 🚑 Emergency response (108) #191
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 13.9min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 7. Red reward 0.65.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 280 · 🚑 Emergency response (108) #192
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 10.4min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 3. Red reward 0.26.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 281 · 🚑 Emergency response (108) #193
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 13.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.36.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 282 · 🚑 Emergency response (108) #194
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 10.2min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.1.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 283 · 🚑 Emergency response (108) #195
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.55.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 284 · 🚑 Emergency response (108) #196
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 11.1min; Patients sent to full hospitals: 6; Critical patients waiting >15 min: 1. Red reward 0.35.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 285 · 🚑 Emergency response (108) #197
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 10.9min; Patients sent to full hospitals: 6; Critical patients waiting >15 min: 3. Red reward 0.39.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 286 · 🚑 Emergency response (108) #198
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 12.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.39.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 287 · 🚑 Emergency response (108) #199
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 12 min after the attack.
- **Impact**: Avg ambulance arrival: 13.5min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.53.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 288 · 🚑 Emergency response (108) #200
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 8.7min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 289 · 🚑 Emergency response (108) #201
- **Attack** (scenario): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 16 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Recovered** in 13 min after the attack.
- **Impact**: Avg ambulance arrival: 10.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.08.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 290 · 🛵 Food delivery #35
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 57 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 50.0%; Cancelled orders: 2; Avg delivery time: 24.8min. Red reward 0.84.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 291 · 🛵 Food delivery #36
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog+high_order_rate` at 34 min.
- **Detected** `eta_breaches` at 55 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Tried and failed**: 'batch_orders' did not clear it.
- **Escalated** `order_backlog+high_order_rate` to a human.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 21 min after the attack.
- **Impact**: Late orders: 45.3%; Cancelled orders: 0; Avg delivery time: 26.4min. Red reward 0.72.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog+high_order_rate -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 292 · 🛵 Food delivery #37
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 4.5%; Cancelled orders: 0; Avg delivery time: 21.3min. Red reward 0.04.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 293 · 🛵 Food delivery #38
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 53 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 13.0%; Cancelled orders: 0; Avg delivery time: 22.9min. Red reward 0.18.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 294 · 🛵 Food delivery #39
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Recovered** in 4 min after the attack.
- **Impact**: Late orders: 3.1%; Cancelled orders: 0; Avg delivery time: 21.0min. Red reward 0.02.
- **Lesson saved**: rider_shortage -> reassign_riders.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 295 · 🛵 Food delivery #40
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `order_backlog+high_order_rate` at 31 min.
- **Detected** `eta_breaches` at 53 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 12 min after the attack.
- **Impact**: Late orders: 42.9%; Cancelled orders: 0; Avg delivery time: 27.7min. Red reward 0.68.
- **Lesson saved**: rider_shortage -> reassign_riders; order_backlog+high_order_rate -> batch_orders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 296 · 🛵 Food delivery #41
- **Attack** (explore): festival_surge on citywide.
- **Detected** `order_backlog` at 24 min.
- **Detected** `order_backlog+high_order_rate` at 38 min.
- **Detected** `eta_breaches` at 58 min.
- **Diagnosed** `order_backlog` via playbook -> applied batch_orders.
- **Diagnosed** `order_backlog+high_order_rate` via playbook -> applied batch_orders.
- **Tried and failed**: 'batch_orders' did not clear it.
- **Diagnosed** `order_backlog+high_order_rate` via rules -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 30 min after the attack.
- **Impact**: Late orders: 29.9%; Cancelled orders: 0; Avg delivery time: 24.3min. Red reward 0.46.
- **Lesson saved**: order_backlog -> batch_orders; order_backlog+high_order_rate -> batch_orders + reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 297 · 🛵 Food delivery #42
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 60 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 21.7%; Cancelled orders: 0; Avg delivery time: 24.2min. Red reward 0.33.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 298 · 🛵 Food delivery #43
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 57 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 23.5%; Cancelled orders: 0; Avg delivery time: 22.6min. Red reward 0.36.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 299 · 💳 UPI payments #55
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.13.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 300 · 💳 UPI payments #56
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.13.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 301 · 💳 UPI payments #57
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 4 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.1.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 302 · 💳 UPI payments #58
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.18.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 303 · 💳 UPI payments #59
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 304 · 💳 UPI payments #60
- **Attack** (explore): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 305 · 💳 UPI payments #61
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 306 · 💳 UPI payments #62
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 307 · 💳 UPI payments #63
- **Attack** (explore): bank_slow on bank_e.
- **Detected** `high_failure_rate+one_bank` at 17 s.
- **Diagnosed** `high_failure_rate+one_bank` via playbook -> applied route_to_healthy_bank.
- **Recovered** in 18 s after the attack.
- **Impact**: Failed payments: 3.1%; Double debits: 0; Money stuck (debited, not confirmed): 9723₹. Red reward 0.13.
- **Lesson saved**: high_failure_rate+one_bank -> route_to_healthy_bank.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 308 · 💳 UPI payments #64
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.12.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 309 · 💳 UPI payments #65
- **Attack** (scenario): bank_slow on bank_d.
- **Detected** `high_failure_rate+one_bank` at 16 s.
- **Diagnosed** `high_failure_rate+one_bank` via playbook -> applied route_to_healthy_bank.
- **Recovered** in 18 s after the attack.
- **Impact**: Failed payments: 3.1%; Double debits: 0; Money stuck (debited, not confirmed): 11886₹. Red reward 0.13.
- **Lesson saved**: high_failure_rate+one_bank -> route_to_healthy_bank.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 310 · 💳 UPI payments #66
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 311 · 💳 UPI payments #67
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 312 · 💳 UPI payments #68
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 313 · 💳 UPI payments #69
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.16.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 314 · 💳 UPI payments #70
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via playbook -> applied idempotency_check.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 15; Money stuck (debited, not confirmed): 7417₹. Red reward 0.04.
- **Lesson saved**: double_debits -> idempotency_check.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 315 · 💳 UPI payments #71
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.2.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 316 · 💳 UPI payments #72
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via playbook -> applied idempotency_check.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 26; Money stuck (debited, not confirmed): 10640₹. Red reward 0.07.
- **Lesson saved**: double_debits -> idempotency_check.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 317 · 💳 UPI payments #73
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 318 · 💳 UPI payments #74
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 31 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 14.9%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 319 · 💳 UPI payments #75
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Detected** `high_failure_rate` at 33 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 16.2%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 320 · 💳 UPI payments #76
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 321 · 💳 UPI payments #77
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 322 · 💳 UPI payments #78
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 323 · 💳 UPI payments #79
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 324 · 💳 UPI payments #80
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 325 · 💳 UPI payments #81
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 14.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 326 · 💳 UPI payments #82
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 34 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 14.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 327 · 🚑 Emergency response (108) #202
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 1.0.

### Round 328 · 🚑 Emergency response (108) #203
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 0.9.

### Round 329 · 🚑 Emergency response (108) #204
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.5min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 1.0.

### Round 330 · 🚑 Emergency response (108) #205
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 17 min.
- **Recovered** in 38 min after the attack.
- **Impact**: Avg ambulance arrival: 11.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.24.

### Round 331 · 🚑 Emergency response (108) #206
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog` at 9 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 1.0.

### Round 332 · 🚑 Emergency response (108) #207
- **Attack** (explore): freeze_gps on amb_1, amb_2, amb_4, amb_7....
- **Detected** `gps_stuck` at 8 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 9.2min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 1. Red reward 0.0.

### Round 333 · 🚑 Emergency response (108) #208
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 8 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.88.

### Round 334 · 🚑 Emergency response (108) #209
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 11.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 1. Red reward 0.24.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 335 · 🚑 Emergency response (108) #210
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 26 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.7.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 336 · 🚑 Emergency response (108) #211
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 10.6min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 1. Red reward 0.22.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 337 · 🚑 Emergency response (108) #212
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 12.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.3.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 338 · 🚑 Emergency response (108) #213
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 8.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 339 · 🚑 Emergency response (108) #214
- **Attack** (exploit): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 12 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 8.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 340 · 🚑 Emergency response (108) #215
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.72.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 341 · 🚑 Emergency response (108) #216
- **Attack** (explore): freeze_gps on amb_2, amb_3, amb_4, amb_6....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 7.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 342 · 💳 UPI payments #83
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.13.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 343 · 💳 UPI payments #84
- **Attack** (scenario): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.14.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 344 · 🚑 Emergency response (108) #217
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 24 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 19 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.53.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 345 · 🚑 Emergency response (108) #218
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 11 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 9.1min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 346 · 🚑 Emergency response (108) #219
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 12.5min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 3. Red reward 0.47.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 347 · 🚑 Emergency response (108) #220
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 15.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.66.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 348 · 🚑 Emergency response (108) #221
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.0min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 1.0.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 349 · 🚑 Emergency response (108) #222
- **Attack** (explore): slow_dispatch on dispatcher.
- **Detected** `dispatch_backlog` at 12 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 8.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 350 · 🚑 Emergency response (108) #223
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 23 min after the attack.
- **Impact**: Avg ambulance arrival: 16.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.75.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 351 · 🚑 Emergency response (108) #224
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 10.5min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 2. Red reward 0.2.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 352 · 🚑 Emergency response (108) #225
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 8 min after the attack.
- **Impact**: Avg ambulance arrival: 15.4min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 5. Red reward 0.74.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 353 · 🚑 Emergency response (108) #226
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 20 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.5min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 9. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 354 · 🚑 Emergency response (108) #227
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 31 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 27 min after the attack.
- **Impact**: Avg ambulance arrival: 16.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.78.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 355 · 🚑 Emergency response (108) #228
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Detected** `dispatch_backlog+high_call_rate` at 36 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.78.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 356 · 🚑 Emergency response (108) #229
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 29 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 357 · 🚑 Emergency response (108) #230
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 13.9min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 6. Red reward 0.66.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 358 · 🚑 Emergency response (108) #231
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 13 min after the attack.
- **Impact**: Avg ambulance arrival: 13.7min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.52.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 359 · 🚑 Emergency response (108) #232
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 14 min after the attack.
- **Impact**: Avg ambulance arrival: 12.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.33.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 360 · 🛵 Food delivery #44
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 55 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 40.0%; Cancelled orders: 0; Avg delivery time: 21.2min. Red reward 0.63.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 361 · 💳 UPI payments #85
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 362 · 💳 UPI payments #86
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Diagnosed** `double_debits` via playbook -> applied idempotency_check.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 12; Money stuck (debited, not confirmed): 8289₹. Red reward 0.03.
- **Lesson saved**: double_debits -> idempotency_check.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 363 · 💳 UPI payments #87
- **Attack** (explore): diwali_spike on all_users.
- **Detected** `high_failure_rate+traffic_spike` at 19 s.
- **Diagnosed** `high_failure_rate+traffic_spike` via playbook -> applied route_to_healthy_bank + queue_rate_limit.
- **Recovered** in 16 s after the attack.
- **Impact**: Failed payments: 2.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.06.
- **Lesson saved**: high_failure_rate+traffic_spike -> route_to_healthy_bank + queue_rate_limit.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 364 · 💳 UPI payments #88
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.15.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 365 · 🚑 Emergency response (108) #233
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog` at 21 min.
- **Detected** `dispatch_backlog+high_call_rate` at 30 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.55.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 366 · 🛵 Food delivery #45
- **Attack** (exploit): heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `eta_breaches` at 56 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 51.0%; Cancelled orders: 0; Avg delivery time: 25.0min. Red reward 0.82.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 367 · 🚑 Emergency response (108) #234
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 20 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 17 min after the attack.
- **Impact**: Avg ambulance arrival: 15.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.67.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 368 · 🚑 Emergency response (108) #235
- **Attack** (scenario): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.56.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 369 · 🚑 Emergency response (108) #236
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 13.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.51.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 370 · 🚑 Emergency response (108) #237
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 20 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 11 min after the attack.
- **Impact**: Avg ambulance arrival: 16.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.87.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 371 · 🚑 Emergency response (108) #238
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Detected** `dispatch_backlog+high_call_rate` at 26 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 33 min after the attack.
- **Impact**: Avg ambulance arrival: 16.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 0.91.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 372 · 🚑 Emergency response (108) #239
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 10.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.17.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 373 · 🚑 Emergency response (108) #240
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 9 min after the attack.
- **Impact**: Avg ambulance arrival: 14.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.61.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 374 · 🚑 Emergency response (108) #241
- **Attack** (explore): freeze_gps on amb_1, amb_2, amb_5, amb_7....
- **Detected** `gps_stuck` at 8 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 7.8min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 375 · 🚑 Emergency response (108) #242
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 10.7min; Patients sent to full hospitals: 6; Critical patients waiting >15 min: 2. Red reward 0.34.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 376 · 🚑 Emergency response (108) #243
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 8.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 377 · 🚑 Emergency response (108) #244
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Detected** `dispatch_backlog+high_call_rate` at 37 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 17 min after the attack.
- **Impact**: Avg ambulance arrival: 14.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.59.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 378 · 🚑 Emergency response (108) #245
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Recovered** in 32 min after the attack.
- **Impact**: Avg ambulance arrival: 16.3min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 5. Red reward 0.83.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 379 · 🚑 Emergency response (108) #246
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 12.4min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.42.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 380 · 🚑 Emergency response (108) #247
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 5 min after the attack.
- **Impact**: Avg ambulance arrival: 11.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.32.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 381 · 🚑 Emergency response (108) #248
- **Attack** (scenario): freeze_gps on amb_2, amb_3, amb_5, amb_8....
- **Detected** `gps_stuck` at 10 min.
- **Diagnosed** `gps_stuck` via playbook -> applied distrust_gps.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 7.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: gps_stuck -> distrust_gps.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 382 · 🚑 Emergency response (108) #249
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 23 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.5min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 383 · 🚑 Emergency response (108) #250
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 10.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.12.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 384 · 🚑 Emergency response (108) #251
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Detected** `dispatch_backlog+high_call_rate` at 34 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.92.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 385 · 🚑 Emergency response (108) #252
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 8.7min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 386 · 🚑 Emergency response (108) #253
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 9.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 0. Red reward 0.0.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 387 · 🚑 Emergency response (108) #254
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 18.7min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 6. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 388 · 🚑 Emergency response (108) #255
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 11.7min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 3. Red reward 0.29.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 389 · 🚑 Emergency response (108) #256
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 7 min after the attack.
- **Impact**: Avg ambulance arrival: 11.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.21.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 390 · 🚑 Emergency response (108) #257
- **Attack** (scenario): call_surge on indiranagar, stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Detected** `dispatch_backlog+high_call_rate` at 22 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 0.91.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals; dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 3 time(s) - no investigation needed.

### Round 391 · 🚑 Emergency response (108) #258
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Detected** `dispatch_backlog+high_call_rate` at 24 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.87.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 392 · 🚑 Emergency response (108) #259
- **Attack** (exploit): call_surge on banashankari.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Detected** `dispatch_backlog+high_call_rate` at 26 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 13.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.55.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 393 · 🚑 Emergency response (108) #260
- **Attack** (explore): stale_beds on bed_feed.
- **Detected** `bed_feed_stale` at 9 min.
- **Diagnosed** `bed_feed_stale` via playbook -> applied skip_stale_hospitals.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 10.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.18.
- **Lesson saved**: bed_feed_stale -> skip_stale_hospitals.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 394 · 🚑 Emergency response (108) #261
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 10 min after the attack.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 2. Red reward 0.68.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 395 · 🚑 Emergency response (108) #262
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 14 min after the attack.
- **Impact**: Avg ambulance arrival: 14.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 4. Red reward 0.65.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 1 time(s) - no investigation needed.

### Round 396 · 🚑 Emergency response (108) #263
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Tried and failed**: 'restart_dispatch' did not clear it.
- **Escalated** `dispatch_backlog+high_call_rate` to a human.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.6min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 7. Red reward 1.0.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 397 · 🚑 Emergency response (108) #264
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.71.

### Round 398 · 🚑 Emergency response (108) #265
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 10 min.
- **Detected** `sms_failing` at 33 min.
- **Recovered** in 36 min after the attack.
- **Impact**: Avg ambulance arrival: 12.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 1. Red reward 0.27.

### Round 399 · 🚑 Emergency response (108) #266
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 3. Red reward 0.72.

### Round 400 · 🚑 Emergency response (108) #267
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 8 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.88.

### Round 401 · 🚑 Emergency response (108) #268
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 1.0.

### Round 402 · 🚑 Emergency response (108) #269
- **Attack** (explore): freeze_gps on amb_1, amb_4, amb_5, amb_7....
- **Detected** `gps_stuck` at 9 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 9.4min; Patients sent to full hospitals: 4; Critical patients waiting >15 min: 0. Red reward 0.1.

### Round 403 · 🚑 Emergency response (108) #270
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 20.3min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 9. Red reward 1.0.

### Round 404 · 🚑 Emergency response (108) #271
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.8min; Patients sent to full hospitals: 3; Critical patients waiting >15 min: 12. Red reward 1.0.

### Round 405 · 🚑 Emergency response (108) #272
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 10 min.
- **Detected** `dispatch_backlog` at 16 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 10. Red reward 1.0.

### Round 406 · 🚑 Emergency response (108) #273
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 1.0.

### Round 407 · 🚑 Emergency response (108) #274
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 13 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 9. Red reward 1.0.

### Round 408 · 🚑 Emergency response (108) #275
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 16 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 0.9.

### Round 409 · 🚑 Emergency response (108) #276
- **Attack** (exploit): call_surge on yelahanka.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 8. Red reward 1.0.

### Round 410 · 🚑 Emergency response (108) #277
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 22.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 11. Red reward 1.0.

### Round 411 · 🚑 Emergency response (108) #278
- **Attack** (explore): kill_sms on sms_gateway.
- **Detected** `sms_failing` at 8 min.
- **Recovered** in 36 min after the attack.
- **Impact**: Avg ambulance arrival: 14.4min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.59.

### Round 412 · 🚑 Emergency response (108) #279
- **Attack** (exploit): call_surge on rajajinagar.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 15.9min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 4. Red reward 0.74.

### Round 413 · 🚑 Emergency response (108) #280
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.7min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 1.0.

### Round 414 · 🚑 Emergency response (108) #281
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.5min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 0.92.

### Round 415 · 🚑 Emergency response (108) #282
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 17 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.5min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 7. Red reward 0.99.

### Round 416 · 🚑 Emergency response (108) #283
- **Attack** (exploit): call_surge on malleshwaram.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.0min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 8. Red reward 1.0.

### Round 417 · 🚑 Emergency response (108) #284
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 18.2min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 11. Red reward 1.0.

### Round 418 · 🚑 Emergency response (108) #285
- **Attack** (exploit): call_surge on jayanagar.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 20.9min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 11. Red reward 1.0.

### Round 419 · 🚑 Emergency response (108) #286
- **Attack** (exploit): call_surge on hebbal.
- **Detected** `dispatch_backlog+high_call_rate` at 7 min.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.3min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 6. Red reward 1.0.

### Round 420 · 🚑 Emergency response (108) #287
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 9 min.
- **Detected** `dispatch_backlog+high_call_rate` at 15 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.5min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 1.0.

### Round 421 · 🚑 Emergency response (108) #288
- **Attack** (exploit): call_surge on electronic_city.
- **Detected** `dispatch_backlog+high_call_rate` at 11 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 19.6min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 6. Red reward 1.0.

### Round 422 · 🚑 Emergency response (108) #289
- **Attack** (exploit): call_surge on indiranagar.
- **Detected** `dispatch_backlog+high_call_rate` at 12 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 20.6min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 5. Red reward 1.0.

### Round 423 · 🚑 Emergency response (108) #290
- **Attack** (exploit): call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 14 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 17.8min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 5. Red reward 0.96.

### Round 424 · 🚑 Emergency response (108) #291
- **Attack** (exploit): call_surge on whitefield.
- **Detected** `dispatch_backlog` at 17 min.
- **Not fully recovered** by the end of the round.
- **Impact**: Avg ambulance arrival: 16.1min; Patients sent to full hospitals: 0; Critical patients waiting >15 min: 4. Red reward 0.76.

### Round 425 · 💳 UPI payments #89
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 14.3%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 426 · 💳 UPI payments #90
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 11.4%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 427 · 💳 UPI payments #91
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 14.1%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 428 · 💳 UPI payments #92
- **Attack** (explore): duplicate_storm on payment_app_v5.
- **Detected** `double_debits` at 11 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 0.0%; Double debits: 361; Money stuck (debited, not confirmed): 241386₹. Red reward 1.0.

### Round 429 · 💳 UPI payments #93
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 15.4%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 430 · 💳 UPI payments #94
- **Attack** (explore): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Detected** `high_failure_rate` at 35 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 9.5%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 431 · 💳 UPI payments #95
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 33 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 12.8%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 432 · 💳 UPI payments #96
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 33 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 13.8%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 433 · 💳 UPI payments #97
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 12 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 14.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 434 · 💳 UPI payments #98
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Not fully recovered** by the end of the round.
- **Impact**: Failed payments: 15.4%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 1.0.

### Round 435 · 💳 UPI payments #99
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 11 s.
- **Detected** `high_failure_rate` at 32 s.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Detected** `fraud_check_backlog+few_devices` at 10 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.18.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 435 · 💳 UPI payments #99
- **Attack** (-): nothing.
- **Recovered** in 6 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.18.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 436 · 🚑 Emergency response (108) #292
- **Attack** (explore): slow_dispatch on dispatcher, call_surge on banashankari.
- **Detected** `dispatch_backlog` at 7 min.
- **Detected** `dispatch_backlog` at 7 min.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Diagnosed** `dispatch_backlog` via playbook -> applied restart_dispatch + surge_mode.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 8.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.0.
- **Lesson saved**: dispatch_backlog -> restart_dispatch + surge_mode.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 436 · 🚑 Emergency response (108) #292
- **Attack** (-): nothing.
- **Recovered** in 6 min after the attack.
- **Impact**: Avg ambulance arrival: 8.8min; Patients sent to full hospitals: 2; Critical patients waiting >15 min: 2. Red reward 0.0.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 437 · 🛵 Food delivery #46
- **Attack** (explore (untried)): coverage_drift on hebbal, heavy_rain on citywide.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `rider_shortage` at 8 min.
- **Detected** `coverage_mismatch` at 11 min.
- **Detected** `eta_breaches` at 59 min.
- **Detected** `eta_breaches` at 59 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `coverage_mismatch` via rules -> applied restore_zone_config.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 13 min after the attack.
- **Impact**: Late orders: 11.6%; Cancelled orders: 1; Avg delivery time: 21.9min. Red reward 0.27.
- **Lesson saved**: rider_shortage -> reassign_riders; coverage_mismatch -> restore_zone_config; eta_breaches -> extend_eta_notify.
- **Playbook reused** 4 time(s) - no investigation needed.

### Round 437 · 🛵 Food delivery #46
- **Attack** (-): nothing.
- **Recovered** in 13 min after the attack.
- **Impact**: Late orders: 11.6%; Cancelled orders: 1; Avg delivery time: 21.9min. Red reward 0.18.
- **Playbook reused** 4 time(s) - no investigation needed.

### Round 438 · 💳 UPI payments #100
- **Attack** (exploit): fraud_bot_burst on bot_1, bot_2, bot_3, fraud_bot_burst on bot_1, bot_2, bot_3.
- **Detected** `fraud_check_backlog+few_devices` at 9 s.
- **Detected** `fraud_check_backlog+few_devices` at 9 s.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Diagnosed** `fraud_check_backlog+few_devices` via playbook -> applied queue_rate_limit + throttle_bot.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.17.
- **Lesson saved**: fraud_check_backlog+few_devices -> queue_rate_limit + throttle_bot.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 438 · 💳 UPI payments #100
- **Attack** (-): nothing.
- **Recovered** in 5 s after the attack.
- **Impact**: Failed payments: 0.0%; Double debits: 0; Money stuck (debited, not confirmed): 0₹. Red reward 0.17.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 439 · 🚑 Emergency response (108) #293
- **Attack** (exploit): call_surge on jayanagar, call_surge on koramangala.
- **Detected** `dispatch_backlog+high_call_rate` at 5 min.
- **Detected** `dispatch_backlog+high_call_rate` at 5 min.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Diagnosed** `dispatch_backlog+high_call_rate` via playbook -> applied surge_mode + restart_dispatch.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.01.
- **Lesson saved**: dispatch_backlog+high_call_rate -> surge_mode + restart_dispatch.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 439 · 🚑 Emergency response (108) #293
- **Attack** (-): nothing.
- **Recovered** in 4 min after the attack.
- **Impact**: Avg ambulance arrival: 9.2min; Patients sent to full hospitals: 1; Critical patients waiting >15 min: 2. Red reward 0.01.
- **Playbook reused** 2 time(s) - no investigation needed.

### Round 440 · 🛵 Food delivery #47
- **Attack** (exploit): heavy_rain on citywide, heavy_rain on citywide.
- **Detected** `rider_shortage` at 6 min.
- **Detected** `rider_shortage` at 6 min.
- **Detected** `eta_breaches` at 60 min.
- **Detected** `eta_breaches` at 60 min.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `rider_shortage` via playbook -> applied reassign_riders.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Diagnosed** `eta_breaches` via playbook -> applied extend_eta_notify.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 36.0%; Cancelled orders: 1; Avg delivery time: 22.8min. Red reward 0.59.
- **Lesson saved**: rider_shortage -> reassign_riders; eta_breaches -> extend_eta_notify.
- **Playbook reused** 4 time(s) - no investigation needed.

### Round 440 · 🛵 Food delivery #47
- **Attack** (-): nothing.
- **Recovered** in 6 min after the attack.
- **Impact**: Late orders: 36.0%; Cancelled orders: 1; Avg delivery time: 22.8min. Red reward 0.59.
- **Playbook reused** 4 time(s) - no investigation needed.

### INC-UPI-0435 · Round 435 · 💳 UPI payments #99
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 67%).
- **Recovery**: queue_rate_limit + throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** — → 79.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0436 · Round 436 · 🚑 Emergency response (108) #292
- **Experiment** (explore): Dispatcher latency injection on Dispatcher.
- **Detected** dispatch_backlog after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 75%, ORACLE-validated accuracy 67%).
- **Recovery**: restart_dispatch + surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.5min; Patients sent to full hospitals 2; Critical patients waiting >15 min 1.
- **Resilience** — → 70.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (10 past runs)).

### INC-FOO-0437 · Round 437 · 🛵 Food delivery #46
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 19.1%; Cancelled orders 0; Avg delivery time 25.3min.
- **Resilience** — → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0438 · Round 438 · 💳 UPI payments #100
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 67%).
- **Recovery**: queue_rate_limit + throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 79 → 80.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0439 · Round 439 · 🚑 Emergency response (108) #293
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Degraded dispatcher (injected latency) (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.0min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 70 → 74.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0440 · Round 440 · 🛵 Food delivery #47
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 30.8%; Cancelled orders 0; Avg delivery time 26.6min.
- **Resilience** 93 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-EME-0441 · Round 441 · 🚑 Emergency response (108) #294
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Degraded dispatcher (injected latency) (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 18.2min; Patients sent to full hospitals 0; Critical patients waiting >15 min 6.
- **Resilience** 74 → 74.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0442 · Round 442 · 🚑 Emergency response (108) #295
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.5min; Patients sent to full hospitals 0; Critical patients waiting >15 min 7.
- **Resilience** 74 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0443 · Round 443 · 🚑 Emergency response (108) #296
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 9 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.4min; Patients sent to full hospitals 2; Critical patients waiting >15 min 3.
- **Resilience** 78 → 72.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0444 · Round 444 · 🚑 Emergency response (108) #297
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.1min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 72 → 75.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0445 · Round 445 · 🚑 Emergency response (108) #298
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 19 min · RECOVERED.
- **Impact**: Avg ambulance arrival 17.8min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 75 → 70.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0446 · Round 446 · 🛵 Food delivery #48
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 34.0%; Cancelled orders 0; Avg delivery time 25.1min.
- **Resilience** 93 → 91.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0447 · Round 447 · 💳 UPI payments #101
- **Experiment** (explore): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 67%).
- **Recovery**: queue_rate_limit + throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 80 → 81.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0448 · Round 448 · 🚑 Emergency response (108) #299
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 4 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.5min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 70 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0449 · Round 449 · 🛵 Food delivery #49
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 67%).
- **Recovery**: reassign_riders + restore_zone_config · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 22.0%; Cancelled orders 0; Avg delivery time 21.8min.
- **Resilience** 91 → 90.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0450 · Round 450 · 💳 UPI payments #102
- **Experiment** (exploit): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 13; Money stuck (debited, not confirmed) 5541.
- **Resilience** 81 → 84.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0451 · Round 451 · 🚑 Emergency response (108) #300
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 4 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.4min; Patients sent to full hospitals 0; Critical patients waiting >15 min 8.
- **Resilience** 77 → 81.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0452 · Round 452 · 🛵 Food delivery #50
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 43.8%; Cancelled orders 1; Avg delivery time 23.6min.
- **Resilience** 90 → 91.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0453 · Round 453 · 💳 UPI payments #103
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 84 → 86.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0454 · Round 454 · 🚑 Emergency response (108) #301
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 7 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.0min; Patients sent to full hospitals 2; Critical patients waiting >15 min 5.
- **Resilience** 81 → 79.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0455 · Round 455 · 🛵 Food delivery #51
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 43.6%; Cancelled orders 0; Avg delivery time 27.6min.
- **Resilience** 91 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0456 · Round 456 · 💳 UPI payments #104
- **Experiment** (explore): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 10; Money stuck (debited, not confirmed) 5552.
- **Resilience** 86 → 88.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0457 · Round 457 · 🚑 Emergency response (108) #302
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 22 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 20.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 8.
- **Resilience** 79 → 74.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0458 · Round 458 · 🛵 Food delivery #52
- **Experiment** (explore): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 36.7%; Cancelled orders 0; Avg delivery time 24.5min.
- **Resilience** 92 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0459 · Round 459 · 💳 UPI payments #105
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 88 → 89.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0460 · Round 460 · 🚑 Emergency response (108) #303
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 22 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.8min; Patients sent to full hospitals 4; Critical patients waiting >15 min 3.
- **Resilience** 74 → 71.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0461 · Round 461 · 🛵 Food delivery #53
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 34.7%; Cancelled orders 0; Avg delivery time 22.6min.
- **Resilience** 92 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0462 · Round 462 · 💳 UPI payments #106
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 89 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0463 · Round 463 · 🚑 Emergency response (108) #304
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 23 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 17.4min; Patients sent to full hospitals 0; Critical patients waiting >15 min 7.
- **Resilience** 71 → 69.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0464 · Round 464 · 🛵 Food delivery #54
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 11.4%; Cancelled orders 1; Avg delivery time 21.2min.
- **Resilience** 92 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0465 · Round 465 · 💳 UPI payments #107
- **Experiment** (exploit): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 12; Money stuck (debited, not confirmed) 6632.
- **Resilience** 90 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0466 · Round 466 · 🚑 Emergency response (108) #305
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.4min; Patients sent to full hospitals 2; Critical patients waiting >15 min 5.
- **Resilience** 69 → 74.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0467 · Round 467 · 🛵 Food delivery #55
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 96%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 3.0%; Cancelled orders 0; Avg delivery time 16.9min.
- **Resilience** 92 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-UPI-0468 · Round 468 · 💳 UPI payments #108
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 91 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0469 · Round 469 · 🚑 Emergency response (108) #306
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 74 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0470 · Round 470 · 🚑 Emergency response (108) #307
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 3 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 80 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0471 · Round 471 · 🚑 Emergency response (108) #308
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 3.
- **Resilience** 82 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0472 · Round 472 · 🚑 Emergency response (108) #309
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.1min; Patients sent to full hospitals 5; Critical patients waiting >15 min 3.
- **Resilience** 85 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0473 · Round 473 · 🚑 Emergency response (108) #310
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.2min; Patients sent to full hospitals 3; Critical patients waiting >15 min 1.
- **Resilience** 88 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0474 · Round 474 · 🚑 Emergency response (108) #311
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 12 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.3min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 90 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0475 · Round 475 · 🚑 Emergency response (108) #312
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.0min; Patients sent to full hospitals 2; Critical patients waiting >15 min 1.
- **Resilience** 82 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0476 · Round 476 · 🚑 Emergency response (108) #313
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 6 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.6min; Patients sent to full hospitals 4; Critical patients waiting >15 min 7.
- **Resilience** 86 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0477 · Round 477 · 🚑 Emergency response (108) #314
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.2min; Patients sent to full hospitals 5; Critical patients waiting >15 min 2.
- **Resilience** 87 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0478 · Round 478 · 🚑 Emergency response (108) #315
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 9 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.7min; Patients sent to full hospitals 0; Critical patients waiting >15 min 2.
- **Resilience** 87 → 83.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0479 · Round 479 · 🚑 Emergency response (108) #316
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.5min; Patients sent to full hospitals 4; Critical patients waiting >15 min 2.
- **Resilience** 83 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0480 · Round 480 · 🚑 Emergency response (108) #317
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 13 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 25 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 18.3min; Patients sent to full hospitals 0; Critical patients waiting >15 min 9.
- **Resilience** 87 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0481 · Round 481 · 🚑 Emergency response (108) #318
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 7 min · RECOVERED.
- **Impact**: Avg ambulance arrival 18.8min; Patients sent to full hospitals 0; Critical patients waiting >15 min 2.
- **Resilience** 77 → 79.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0482 · Round 482 · 🚑 Emergency response (108) #319
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 20 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 17.1min; Patients sent to full hospitals 3; Critical patients waiting >15 min 8.
- **Resilience** 79 → 72.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0483 · Round 483 · 🚑 Emergency response (108) #320
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.1min; Patients sent to full hospitals 6; Critical patients waiting >15 min 3.
- **Resilience** 72 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0485 · Round 485 · 🚑 Emergency response (108) #322
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.0min; Patients sent to full hospitals 3; Critical patients waiting >15 min 5.
- **Resilience** 80 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0486 · Round 486 · 🚑 Emergency response (108) #323
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 27 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 19.7min; Patients sent to full hospitals 2; Critical patients waiting >15 min 6.
- **Resilience** 84 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0487 · Round 487 · 🚑 Emergency response (108) #324
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 6 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.4min; Patients sent to full hospitals 3; Critical patients waiting >15 min 1.
- **Resilience** 78 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0488 · Round 488 · 🚑 Emergency response (108) #325
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.2min; Patients sent to full hospitals 4; Critical patients waiting >15 min 1.
- **Resilience** 82 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0490 · Round 490 · 🚑 Emergency response (108) #327
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 11 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 14.6min; Patients sent to full hospitals 2; Critical patients waiting >15 min 0.
- **Resilience** 85 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0491 · Round 491 · 🚑 Emergency response (108) #328
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 77 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0492 · Round 492 · 🚑 Emergency response (108) #329
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.0min; Patients sent to full hospitals 2; Critical patients waiting >15 min 1.
- **Resilience** 82 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0493 · Round 493 · 🚑 Emergency response (108) #330
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 17.1min; Patients sent to full hospitals 1; Critical patients waiting >15 min 5.
- **Resilience** 87 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0494 · Round 494 · 🚑 Emergency response (108) #331
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 25 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 16.8min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 87 → 79.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0496 · Round 496 · 🚑 Emergency response (108) #333
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.9min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 79 → 81.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0497 · Round 497 · 🚑 Emergency response (108) #334
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.5min; Patients sent to full hospitals 2; Critical patients waiting >15 min 2.
- **Resilience** 81 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0498 · Round 498 · 🚑 Emergency response (108) #335
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.0min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 85 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0501 · Round 501 · 🚑 Emergency response (108) #338
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.5min; Patients sent to full hospitals 0; Critical patients waiting >15 min 1.
- **Resilience** 87 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0502 · Round 502 · 🚑 Emergency response (108) #339
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.3min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 88 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0503 · Round 503 · 🚑 Emergency response (108) #340
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.2min; Patients sent to full hospitals 4; Critical patients waiting >15 min 1.
- **Resilience** 89 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-EME-0504 · Round 504 · 🚑 Emergency response (108) #341
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 1.
- **Resilience** 91 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0506 · Round 506 · 🛵 Food delivery #56
- **Experiment** (scenario): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 4 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 93%, ORACLE-validated accuracy 67%).
- **Recovery**: restore_zone_config + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 15.7%; Cancelled orders 0; Avg delivery time 21.7min.
- **Resilience** 93 → 91.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (0 past runs)).

### INC-FOO-0508 · Round 508 · 🛵 Food delivery #58
- **Experiment** (scenario): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 6 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 2.3%; Cancelled orders 1; Avg delivery time 18.6min.
- **Resilience** 91 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (1 past runs)).

### INC-UPI-0510 · Round 510 · 💳 UPI payments #109
- **Experiment** (scenario): 10x Diwali traffic spike + Fraud-bot burst on Bank switch, Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 2 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 99%, ORACLE-validated accuracy 80%).
- **Recovery**: throttle_bot + route_to_healthy_bank + queue_rate_limit · MTTR 35 s · RECOVERED.
- **Impact**: Failed payments 36.6%; Double debits 0; Money stuck (debited, not confirmed) 375663.
- **Resilience** 92 → 86.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0511 · Round 511 · 💳 UPI payments #110
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 86 → 89.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0512 · Round 512 · 💳 UPI payments #111
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 89 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0513 · Round 513 · 💳 UPI payments #112
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 91 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0514 · Round 514 · 🚑 Emergency response (108) #342
- **Experiment** (explore): Dispatcher latency injection on Dispatcher.
- **Detected** dispatch_backlog after 17 min.
- **Diagnosis**: Degraded dispatcher (injected latency) (AEGIS confidence 80%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 88 → 83.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (11 past runs)).

### INC-FOO-0515 · Round 515 · 🛵 Food delivery #59
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 18.2%; Cancelled orders 0; Avg delivery time 24.0min.
- **Resilience** 92 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (2 past runs)).

### INC-UPI-0516 · Round 516 · 💳 UPI payments #113
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0517 · Round 517 · 🚑 Emergency response (108) #343
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 13 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 26 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 17.5min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 83 → 74.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-FOO-0518 · Round 518 · 🛵 Food delivery #60
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 16.7%; Cancelled orders 0; Avg delivery time 21.4min.
- **Resilience** 93 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (2 past runs)).

### INC-UPI-0520 · Round 520 · 💳 UPI payments #115
- **Experiment** (alternative): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 15; Money stuck (debited, not confirmed) 5259.
- **Resilience** 93 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0521 · Round 521 · 💳 UPI payments #116
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0522 · Round 522 · 💳 UPI payments #117
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0523 · Round 523 · 💳 UPI payments #118
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0524 · Round 524 · 💳 UPI payments #119
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0525 · Round 525 · 💳 UPI payments #120
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-UPI-0526 · Round 526 · 💳 UPI payments #121
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0529 · Round 529 · 🚑 Emergency response (108) #344
- **Experiment** (explore): Stale bed data on Bed tracker.
- **Detected** bed_feed_stale after 4 min.
- **Diagnosis**: Stale bed-availability feed (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: skip_stale_hospitals · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 7.8min; Patients sent to full hospitals 2; Critical patients waiting >15 min 1.
- **Resilience** 74 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0530 · Round 530 · 🚑 Emergency response (108) #345
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 16 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 6.
- **Resilience** 80 → 76.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0531 · Round 531 · 🚑 Emergency response (108) #346
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 13 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 21.0min; Patients sent to full hospitals 1; Critical patients waiting >15 min 8.
- **Resilience** 76 → 73.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0532 · Round 532 · 🚑 Emergency response (108) #347
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 22 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 17.7min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 73 → 70.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-FOO-0534 · Round 534 · 🛵 Food delivery #61
- **Experiment** (alternative): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 13 min.
- **Diagnosis**: Restaurant tablets offline (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: phone_restaurants · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 18.8min.
- **Resilience** 94 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0535 · Round 535 · 🛵 Food delivery #62
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 7 min · RECOVERED.
- **Impact**: Late orders 45.6%; Cancelled orders 0; Avg delivery time 27.1min.
- **Resilience** 92 → 91.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0537 · Round 537 · 🛵 Food delivery #64
- **Experiment** (scenario): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 16 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 7.9%; Cancelled orders 3; Avg delivery time 18.4min.
- **Resilience** 91 → 89.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0540 · Round 540 · 🛵 Food delivery #67
- **Experiment** (alternative): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 13 min.
- **Diagnosis**: Restaurant tablets offline (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: phone_restaurants · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 2.4%; Cancelled orders 0; Avg delivery time 19.7min.
- **Resilience** 89 → 88.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0542 · Round 542 · 🛵 Food delivery #69
- **Experiment** (alternative): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 13 min.
- **Diagnosis**: Restaurant tablets offline (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: phone_restaurants · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 4.5%; Cancelled orders 0; Avg delivery time 19.9min.
- **Resilience** 88 → 88.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-EME-0543 · Round 543 · 🚑 Emergency response (108) #349
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 16 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 1.
- **Resilience** 70 → 74.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0544 · Round 544 · 🚑 Emergency response (108) #350
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 23 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 18.1min; Patients sent to full hospitals 1; Critical patients waiting >15 min 8.
- **Resilience** 74 → 70.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0545 · Round 545 · 🚑 Emergency response (108) #351
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.5min; Patients sent to full hospitals 2; Critical patients waiting >15 min 2.
- **Resilience** 70 → 76.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0546 · Round 546 · 🚑 Emergency response (108) #352
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.0min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 76 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0547 · Round 547 · 🚑 Emergency response (108) #353
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.2min; Patients sent to full hospitals 1; Critical patients waiting >15 min 1.
- **Resilience** 78 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-EME-0548 · Round 548 · 🚑 Emergency response (108) #354
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 25 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 17.0min; Patients sent to full hospitals 2; Critical patients waiting >15 min 5.
- **Resilience** 84 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-UPI-0549 · Round 549 · 💳 UPI payments #122
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0550 · Round 550 · 🚑 Emergency response (108) #355
- **Experiment** (explore): Dispatcher latency injection on Dispatcher.
- **Detected** dispatch_backlog after 6 min.
- **Diagnosis**: Degraded dispatcher (injected latency) (AEGIS confidence 78%, ORACLE-validated accuracy 100%).
- **Recovery**: restart_dispatch · MTTR 5 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.4min; Patients sent to full hospitals 1; Critical patients waiting >15 min 4.
- **Resilience** 77 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (12 past runs)).

### INC-FOO-0551 · Round 551 · 🛵 Food delivery #70
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 22.2%; Cancelled orders 0; Avg delivery time 26.0min.
- **Resilience** 88 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-UPI-0552 · Round 552 · 💳 UPI payments #123
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0553 · Round 553 · 🚑 Emergency response (108) #356
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 5 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.3min; Patients sent to full hospitals 2; Critical patients waiting >15 min 3.
- **Resilience** 80 → 81.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0554 · Round 554 · 🛵 Food delivery #71
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 44.2%; Cancelled orders 0; Avg delivery time 24.7min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-UPI-0555 · Round 555 · 💳 UPI payments #124
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0556 · Round 556 · 🚑 Emergency response (108) #357
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: restart_dispatch + surge_mode · MTTR 5 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.4min; Patients sent to full hospitals 0; Critical patients waiting >15 min 2.
- **Resilience** 81 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0557 · Round 557 · 🛵 Food delivery #72
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 37.8%; Cancelled orders 0; Avg delivery time 25.7min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-UPI-0558 · Round 558 · 💳 UPI payments #125
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0559 · Round 559 · 🚑 Emergency response (108) #358
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.2min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 82 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-EME-0561 · Round 561 · 🚑 Emergency response (108) #359
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 4 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.0min; Patients sent to full hospitals 4; Critical patients waiting >15 min 1.
- **Resilience** 82 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0563 · Round 563 · 🛵 Food delivery #74
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 50.0%; Cancelled orders 0; Avg delivery time 22.9min.
- **Resilience** 93 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0564 · Round 564 · 🛵 Food delivery #75
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 16.7%; Cancelled orders 0; Avg delivery time 23.1min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0565 · Round 565 · 🛵 Food delivery #76
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 14 min · RECOVERED.
- **Impact**: Late orders 49.2%; Cancelled orders 0; Avg delivery time 29.1min.
- **Resilience** 93 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0567 · Round 567 · 🛵 Food delivery #78
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 8 min · RECOVERED.
- **Impact**: Late orders 38.2%; Cancelled orders 1; Avg delivery time 26.3min.
- **Resilience** 90 → 89.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0568 · Round 568 · 🛵 Food delivery #79
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 25.5%; Cancelled orders 2; Avg delivery time 21.5min.
- **Resilience** 89 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0569 · Round 569 · 🛵 Food delivery #80
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 48.1%; Cancelled orders 0; Avg delivery time 26.5min.
- **Resilience** 91 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0570 · Round 570 · 🛵 Food delivery #81
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 38.3%; Cancelled orders 0; Avg delivery time 22.9min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0571 · Round 571 · 🛵 Food delivery #82
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 11.4%; Cancelled orders 0; Avg delivery time 23.1min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0572 · Round 572 · 🛵 Food delivery #83
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 11.1%; Cancelled orders 0; Avg delivery time 21.3min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0573 · Round 573 · 🛵 Food delivery #84
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 9 min · RECOVERED.
- **Impact**: Late orders 50.0%; Cancelled orders 0; Avg delivery time 25.3min.
- **Resilience** 94 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0574 · Round 574 · 🛵 Food delivery #85
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 13 min · RECOVERED.
- **Impact**: Late orders 52.6%; Cancelled orders 0; Avg delivery time 26.3min.
- **Resilience** 92 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0575 · Round 575 · 🛵 Food delivery #86
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 26.5%; Cancelled orders 0; Avg delivery time 21.0min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0576 · Round 576 · 🛵 Food delivery #87
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 96%, ORACLE-validated accuracy 67%).
- **Recovery**: reassign_riders + restore_zone_config + batch_orders + extend_eta_notify · MTTR 13 min · RECOVERED.
- **Impact**: Late orders 43.5%; Cancelled orders 1; Avg delivery time 22.6min.
- **Resilience** 92 → 88.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0577 · Round 577 · 🛵 Food delivery #88
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 99%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 41.3%; Cancelled orders 0; Avg delivery time 24.5min.
- **Resilience** 88 → 89.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0578 · Round 578 · 🛵 Food delivery #89
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 21.2%; Cancelled orders 0; Avg delivery time 23.7min.
- **Resilience** 89 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0579 · Round 579 · 🛵 Food delivery #90
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 31.2%; Cancelled orders 0; Avg delivery time 22.8min.
- **Resilience** 91 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0580 · Round 580 · 🛵 Food delivery #91
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 21.6%; Cancelled orders 0; Avg delivery time 22.5min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0581 · Round 581 · 🛵 Food delivery #92
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 96%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 24.5%; Cancelled orders 0; Avg delivery time 22.0min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0582 · Round 582 · 🛵 Food delivery #93
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 8 min · RECOVERED.
- **Impact**: Late orders 40.0%; Cancelled orders 1; Avg delivery time 25.8min.
- **Resilience** 94 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0584 · Round 584 · 🛵 Food delivery #95
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 13 min · RECOVERED.
- **Impact**: Late orders 34.3%; Cancelled orders 1; Avg delivery time 24.8min.
- **Resilience** 92 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0585 · Round 585 · 🛵 Food delivery #96
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 35.4%; Cancelled orders 2; Avg delivery time 25.2min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0586 · Round 586 · 🛵 Food delivery #97
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 27.1%; Cancelled orders 0; Avg delivery time 21.7min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0587 · Round 587 · 🛵 Food delivery #98
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 9 min · RECOVERED.
- **Impact**: Late orders 46.6%; Cancelled orders 0; Avg delivery time 25.8min.
- **Resilience** 93 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0589 · Round 589 · 🛵 Food delivery #100
- **Experiment** (scenario): Heavy rain + rider shortage + Maps API latency injection on Assignment, Maps / ETA, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + cached_routes + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 29.4%; Cancelled orders 1; Avg delivery time 24.0min.
- **Resilience** 91 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0590 · Round 590 · 🛵 Food delivery #101
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 26.0%; Cancelled orders 0; Avg delivery time 24.1min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0591 · Round 591 · 🛵 Food delivery #102
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 27.1%; Cancelled orders 3; Avg delivery time 23.5min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0592 · Round 592 · 🛵 Food delivery #103
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 17.8min.
- **Resilience** 94 → 95.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0593 · Round 593 · 🛵 Food delivery #104
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 40.0%; Cancelled orders 0; Avg delivery time 25.7min.
- **Resilience** 95 → 95.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0594 · Round 594 · 🛵 Food delivery #105
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 12 min · RECOVERED.
- **Impact**: Late orders 46.2%; Cancelled orders 0; Avg delivery time 27.1min.
- **Resilience** 95 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0595 · Round 595 · 🛵 Food delivery #106
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 13 min · RECOVERED.
- **Impact**: Late orders 59.7%; Cancelled orders 0; Avg delivery time 27.7min.
- **Resilience** 92 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0596 · Round 596 · 🛵 Food delivery #107
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: cached_routes + restore_zone_config · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 17.9min.
- **Resilience** 90 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0597 · Round 597 · 🛵 Food delivery #108
- **Experiment** (explore): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 11 min.
- **Diagnosis**: Restaurant tablets offline (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: phone_restaurants · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 17.3min.
- **Resilience** 90 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0598 · Round 598 · 🛵 Food delivery #109
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 16.3%; Cancelled orders 0; Avg delivery time 21.7min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0599 · Round 599 · 🛵 Food delivery #110
- **Experiment** (explore): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 9 min · RECOVERED.
- **Impact**: Late orders 56.4%; Cancelled orders 0; Avg delivery time 26.6min.
- **Resilience** 92 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0600 · Round 600 · 🛵 Food delivery #111
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 43.4%; Cancelled orders 0; Avg delivery time 25.4min.
- **Resilience** 91 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0601 · Round 601 · 🛵 Food delivery #112
- **Experiment** (explore): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 13 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 93%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 8.3%; Cancelled orders 1; Avg delivery time 18.6min.
- **Resilience** 91 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0602 · Round 602 · 🛵 Food delivery #113
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 39.2%; Cancelled orders 1; Avg delivery time 23.3min.
- **Resilience** 90 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0603 · Round 603 · 🛵 Food delivery #114
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 43.9%; Cancelled orders 1; Avg delivery time 24.5min.
- **Resilience** 90 → 89.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0604 · Round 604 · 🛵 Food delivery #115
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 97%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 12 min · RECOVERED.
- **Impact**: Late orders 44.6%; Cancelled orders 1; Avg delivery time 25.0min.
- **Resilience** 89 → 88.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0605 · Round 605 · 🛵 Food delivery #116
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 9 min · RECOVERED.
- **Impact**: Late orders 34.4%; Cancelled orders 0; Avg delivery time 22.9min.
- **Resilience** 88 → 88.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0606 · Round 606 · 🛵 Food delivery #117
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 40.0%; Cancelled orders 0; Avg delivery time 25.1min.
- **Resilience** 88 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0607 · Round 607 · 🛵 Food delivery #118
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 40.4%; Cancelled orders 0; Avg delivery time 27.1min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0608 · Round 608 · 🛵 Food delivery #119
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 27.1%; Cancelled orders 0; Avg delivery time 22.6min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0609 · Round 609 · 🛵 Food delivery #120
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 23.9%; Cancelled orders 0; Avg delivery time 23.4min.
- **Resilience** 93 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0610 · Round 610 · 🛵 Food delivery #121
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 34.6%; Cancelled orders 0; Avg delivery time 26.4min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0611 · Round 611 · 🛵 Food delivery #122
- **Experiment** (explore): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 5 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 94%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 17.8min.
- **Resilience** 93 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0612 · Round 612 · 🛵 Food delivery #123
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 21.7%; Cancelled orders 0; Avg delivery time 24.6min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0613 · Round 613 · 🛵 Food delivery #124
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 29.8%; Cancelled orders 0; Avg delivery time 24.4min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0614 · Round 614 · 🛵 Food delivery #125
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 20.5%; Cancelled orders 0; Avg delivery time 24.1min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0615 · Round 615 · 🛵 Food delivery #126
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 55.8%; Cancelled orders 0; Avg delivery time 28.4min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0616 · Round 616 · 🛵 Food delivery #127
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 17 min · RECOVERED.
- **Impact**: Late orders 53.7%; Cancelled orders 0; Avg delivery time 25.0min.
- **Resilience** 94 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0617 · Round 617 · 🛵 Food delivery #128
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 41.2%; Cancelled orders 2; Avg delivery time 25.5min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0618 · Round 618 · 🛵 Food delivery #129
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 46.3%; Cancelled orders 1; Avg delivery time 25.1min.
- **Resilience** 92 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0619 · Round 619 · 🛵 Food delivery #130
- **Experiment** (explore): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 16 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: batch_orders + extend_eta_notify · MTTR 19 min · RECOVERED.
- **Impact**: Late orders 34.9%; Cancelled orders 2; Avg delivery time 23.1min.
- **Resilience** 90 → 82.
- **Next**: Festival order surge (least-tested failure mode in food delivery (2 past runs)).

### INC-FOO-0620 · Round 620 · 🛵 Food delivery #131
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 12.5%; Cancelled orders 0; Avg delivery time 23.2min.
- **Resilience** 82 → 87.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0621 · Round 621 · 🛵 Food delivery #132
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 97%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 27.8%; Cancelled orders 0; Avg delivery time 25.6min.
- **Resilience** 87 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0622 · Round 622 · 🛵 Food delivery #133
- **Experiment** (explore): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 6 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 98%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 5.0%; Cancelled orders 0; Avg delivery time 19.2min.
- **Resilience** 90 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0623 · Round 623 · 🛵 Food delivery #134
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 8 min · RECOVERED.
- **Impact**: Late orders 39.7%; Cancelled orders 0; Avg delivery time 24.7min.
- **Resilience** 91 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0624 · Round 624 · 🛵 Food delivery #135
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 41.9%; Cancelled orders 0; Avg delivery time 28.0min.
- **Resilience** 90 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0625 · Round 625 · 🛵 Food delivery #136
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 18.5min.
- **Resilience** 92 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0626 · Round 626 · 🛵 Food delivery #137
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 19.0%; Cancelled orders 1; Avg delivery time 23.8min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0627 · Round 627 · 🛵 Food delivery #138
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 58.7%; Cancelled orders 0; Avg delivery time 29.1min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0628 · Round 628 · 🛵 Food delivery #139
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 2.2%; Cancelled orders 0; Avg delivery time 18.4min.
- **Resilience** 94 → 95.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0629 · Round 629 · 🛵 Food delivery #140
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 44.2%; Cancelled orders 0; Avg delivery time 26.3min.
- **Resilience** 95 → 95.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0630 · Round 630 · 🛵 Food delivery #141
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 16.9min.
- **Resilience** 95 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0631 · Round 631 · 🛵 Food delivery #142
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 54.5%; Cancelled orders 0; Avg delivery time 26.9min.
- **Resilience** 96 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-FOO-0632 · Round 632 · 🛵 Food delivery #143
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 19.0%; Cancelled orders 1; Avg delivery time 21.6min.
- **Resilience** 96 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0633 · Round 633 · 💳 UPI payments #126
- **Experiment** (explore): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0634 · Round 634 · 🚑 Emergency response (108) #360
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 2 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.0min; Patients sent to full hospitals 3; Critical patients waiting >15 min 2.
- **Resilience** 86 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0635 · Round 635 · 🛵 Food delivery #144
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 33.3%; Cancelled orders 0; Avg delivery time 25.0min.
- **Resilience** 96 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0636 · Round 636 · 💳 UPI payments #127
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0637 · Round 637 · 🚑 Emergency response (108) #361
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.8min; Patients sent to full hospitals 2; Critical patients waiting >15 min 0.
- **Resilience** 89 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0638 · Round 638 · 🛵 Food delivery #145
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 19.4%; Cancelled orders 0; Avg delivery time 21.8min.
- **Resilience** 96 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0639 · Round 639 · 💳 UPI payments #128
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0640 · Round 640 · 🚑 Emergency response (108) #362
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 1.
- **Resilience** 89 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0641 · Round 641 · 🛵 Food delivery #146
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 97%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 28.8%; Cancelled orders 0; Avg delivery time 24.5min.
- **Resilience** 96 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0642 · Round 642 · 💳 UPI payments #129
- **Experiment** (explore): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 13; Money stuck (debited, not confirmed) 6946.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0643 · Round 643 · 🚑 Emergency response (108) #363
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 12 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.2min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 89 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0644 · Round 644 · 🛵 Food delivery #147
- **Experiment** (explore): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 33.3%; Cancelled orders 0; Avg delivery time 22.4min.
- **Resilience** 96 → 96.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0645 · Round 645 · 💳 UPI payments #130
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0646 · Round 646 · 🚑 Emergency response (108) #364
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.6min; Patients sent to full hospitals 5; Critical patients waiting >15 min 2.
- **Resilience** 82 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0647 · Round 647 · 🛵 Food delivery #148
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 43.4%; Cancelled orders 1; Avg delivery time 25.1min.
- **Resilience** 96 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0648 · Round 648 · 💳 UPI payments #131
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0649 · Round 649 · 🚑 Emergency response (108) #365
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 29 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 21.0min; Patients sent to full hospitals 0; Critical patients waiting >15 min 7.
- **Resilience** 87 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0650 · Round 650 · 🛵 Food delivery #149
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 7 min · RECOVERED.
- **Impact**: Late orders 37.5%; Cancelled orders 0; Avg delivery time 23.4min.
- **Resilience** 94 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0651 · Round 651 · 💳 UPI payments #132
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0652 · Round 652 · 🚑 Emergency response (108) #366
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.4min; Patients sent to full hospitals 5; Critical patients waiting >15 min 0.
- **Resilience** 78 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0653 · Round 653 · 🛵 Food delivery #150
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: cached_routes + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 10.2%; Cancelled orders 0; Avg delivery time 19.0min.
- **Resilience** 92 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0654 · Round 654 · 💳 UPI payments #133
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0655 · Round 655 · 🚑 Emergency response (108) #367
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.0min; Patients sent to full hospitals 4; Critical patients waiting >15 min 0.
- **Resilience** 84 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0656 · Round 656 · 🛵 Food delivery #151
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 47.5%; Cancelled orders 0; Avg delivery time 23.8min.
- **Resilience** 91 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0657 · Round 657 · 💳 UPI payments #134
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0658 · Round 658 · 🚑 Emergency response (108) #368
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.7min; Patients sent to full hospitals 0; Critical patients waiting >15 min 2.
- **Resilience** 88 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0659 · Round 659 · 🛵 Food delivery #152
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 17.9min.
- **Resilience** 91 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0660 · Round 660 · 💳 UPI payments #135
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0661 · Round 661 · 🚑 Emergency response (108) #369
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 5 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.4min; Patients sent to full hospitals 2; Critical patients waiting >15 min 4.
- **Resilience** 88 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0662 · Round 662 · 🛵 Food delivery #153
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 19.5%; Cancelled orders 1; Avg delivery time 22.5min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0663 · Round 663 · 💳 UPI payments #136
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0664 · Round 664 · 🚑 Emergency response (108) #370
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.4min; Patients sent to full hospitals 3; Critical patients waiting >15 min 2.
- **Resilience** 89 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0665 · Round 665 · 🛵 Food delivery #154
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 8.8%; Cancelled orders 0; Avg delivery time 22.1min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0666 · Round 666 · 💳 UPI payments #137
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0667 · Round 667 · 🚑 Emergency response (108) #371
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 7 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 7.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 91 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0668 · Round 668 · 🛵 Food delivery #155
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 35.2%; Cancelled orders 0; Avg delivery time 26.4min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0669 · Round 669 · 💳 UPI payments #138
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0670 · Round 670 · 🚑 Emergency response (108) #372
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 18 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.4min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 90 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0671 · Round 671 · 🛵 Food delivery #156
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 46.8%; Cancelled orders 0; Avg delivery time 26.7min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0672 · Round 672 · 💳 UPI payments #139
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0673 · Round 673 · 🚑 Emergency response (108) #373
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 22 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 80 → 73.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0674 · Round 674 · 🛵 Food delivery #157
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 39.6%; Cancelled orders 0; Avg delivery time 26.4min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0675 · Round 675 · 💳 UPI payments #140
- **Experiment** (explore): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 12; Money stuck (debited, not confirmed) 6728.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0676 · Round 676 · 🚑 Emergency response (108) #374
- **Experiment** (explore): Stale bed data on Bed tracker.
- **Detected** bed_feed_stale after 4 min.
- **Diagnosis**: Stale bed-availability feed (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: skip_stale_hospitals · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.3min; Patients sent to full hospitals 4; Critical patients waiting >15 min 0.
- **Resilience** 73 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0677 · Round 677 · 🛵 Food delivery #158
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 24.5%; Cancelled orders 2; Avg delivery time 21.9min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0678 · Round 678 · 💳 UPI payments #141
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0679 · Round 679 · 🚑 Emergency response (108) #375
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 9 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.3min; Patients sent to full hospitals 2; Critical patients waiting >15 min 2.
- **Resilience** 80 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0680 · Round 680 · 🛵 Food delivery #159
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 26.3%; Cancelled orders 0; Avg delivery time 23.5min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0681 · Round 681 · 💳 UPI payments #142
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0682 · Round 682 · 🚑 Emergency response (108) #376
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.9min; Patients sent to full hospitals 1; Critical patients waiting >15 min 4.
- **Resilience** 82 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0683 · Round 683 · 🛵 Food delivery #160
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 49.1%; Cancelled orders 1; Avg delivery time 25.8min.
- **Resilience** 94 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0684 · Round 684 · 💳 UPI payments #143
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0685 · Round 685 · 🚑 Emergency response (108) #377
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 9 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.4min; Patients sent to full hospitals 2; Critical patients waiting >15 min 10.
- **Resilience** 85 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0686 · Round 686 · 🛵 Food delivery #161
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 23.8%; Cancelled orders 0; Avg delivery time 24.9min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0687 · Round 687 · 💳 UPI payments #144
- **Experiment** (explore): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0688 · Round 688 · 🚑 Emergency response (108) #378
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.5min; Patients sent to full hospitals 0; Critical patients waiting >15 min 6.
- **Resilience** 85 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0689 · Round 689 · 🛵 Food delivery #162
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 19.1min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0690 · Round 690 · 💳 UPI payments #145
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0691 · Round 691 · 🚑 Emergency response (108) #379
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.9min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 86 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0692 · Round 692 · 🛵 Food delivery #163
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 49.0%; Cancelled orders 0; Avg delivery time 24.7min.
- **Resilience** 94 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0693 · Round 693 · 💳 UPI payments #146
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0694 · Round 694 · 🚑 Emergency response (108) #380
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 17 min · RECOVERED.
- **Impact**: Avg ambulance arrival 17.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 6.
- **Resilience** 88 → 79.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0695 · Round 695 · 🛵 Food delivery #164
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 19.1%; Cancelled orders 0; Avg delivery time 23.2min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0696 · Round 696 · 💳 UPI payments #147
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0697 · Round 697 · 🚑 Emergency response (108) #381
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 11 min · RECOVERED.
- **Impact**: Avg ambulance arrival 18.2min; Patients sent to full hospitals 2; Critical patients waiting >15 min 8.
- **Resilience** 79 → 81.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0698 · Round 698 · 🛵 Food delivery #165
- **Experiment** (explore): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 5 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 97%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 16.2min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0699 · Round 699 · 💳 UPI payments #148
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0700 · Round 700 · 🚑 Emergency response (108) #382
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 20.7min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 81 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0701 · Round 701 · 🛵 Food delivery #166
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 46.3%; Cancelled orders 0; Avg delivery time 26.0min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0702 · Round 702 · 💳 UPI payments #149
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0703 · Round 703 · 🚑 Emergency response (108) #383
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 2 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 94%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.6min; Patients sent to full hospitals 1; Critical patients waiting >15 min 1.
- **Resilience** 82 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0704 · Round 704 · 🛵 Food delivery #167
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 7 min · RECOVERED.
- **Impact**: Late orders 41.2%; Cancelled orders 1; Avg delivery time 24.6min.
- **Resilience** 94 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0705 · Round 705 · 💳 UPI payments #150
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0706 · Round 706 · 🚑 Emergency response (108) #384
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 3.
- **Resilience** 87 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0707 · Round 707 · 🛵 Food delivery #168
- **Experiment** (explore): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 13 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 94%, ORACLE-validated accuracy 80%).
- **Recovery**: batch_orders + reassign_riders + extend_eta_notify · MTTR 15 min · RECOVERED.
- **Impact**: Late orders 30.1%; Cancelled orders 0; Avg delivery time 23.7min.
- **Resilience** 92 → 86.
- **Next**: Festival order surge (least-tested failure mode in food delivery (3 past runs)).

### INC-UPI-0708 · Round 708 · 💳 UPI payments #151
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0709 · Round 709 · 🚑 Emergency response (108) #385
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.2min; Patients sent to full hospitals 2; Critical patients waiting >15 min 1.
- **Resilience** 87 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0710 · Round 710 · 🛵 Food delivery #169
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 31.2%; Cancelled orders 0; Avg delivery time 27.9min.
- **Resilience** 86 → 89.
- **Next**: Festival order surge (least-tested failure mode in food delivery (4 past runs)).

### INC-UPI-0711 · Round 711 · 💳 UPI payments #152
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0712 · Round 712 · 🚑 Emergency response (108) #386
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.1min; Patients sent to full hospitals 1; Critical patients waiting >15 min 1.
- **Resilience** 90 → 92.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0713 · Round 713 · 🛵 Food delivery #170
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 35.3%; Cancelled orders 0; Avg delivery time 24.9min.
- **Resilience** 89 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (4 past runs)).

### INC-UPI-0714 · Round 714 · 💳 UPI payments #153
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0715 · Round 715 · 🚑 Emergency response (108) #387
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 3 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.2min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 92 → 93.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0716 · Round 716 · 🛵 Food delivery #171
- **Experiment** (explore): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 16 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: batch_orders + reassign_riders + extend_eta_notify · MTTR 11 min · RECOVERED.
- **Impact**: Late orders 29.9%; Cancelled orders 3; Avg delivery time 22.2min.
- **Resilience** 91 → 85.
- **Next**: Festival order surge (least-tested failure mode in food delivery (4 past runs)).

### INC-UPI-0717 · Round 717 · 💳 UPI payments #154
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0718 · Round 718 · 🚑 Emergency response (108) #388
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.4min; Patients sent to full hospitals 1; Critical patients waiting >15 min 5.
- **Resilience** 93 → 93.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0719 · Round 719 · 🛵 Food delivery #172
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 40.4%; Cancelled orders 0; Avg delivery time 25.5min.
- **Resilience** 85 → 87.
- **Next**: Festival order surge (least-tested failure mode in food delivery (5 past runs)).

### INC-UPI-0720 · Round 720 · 💳 UPI payments #155
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0721 · Round 721 · 🚑 Emergency response (108) #389
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.1min; Patients sent to full hospitals 2; Critical patients waiting >15 min 5.
- **Resilience** 93 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0722 · Round 722 · 🛵 Food delivery #173
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 11.8%; Cancelled orders 0; Avg delivery time 22.1min.
- **Resilience** 87 → 90.
- **Next**: Festival order surge (least-tested failure mode in food delivery (5 past runs)).

### INC-UPI-0723 · Round 723 · 💳 UPI payments #156
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0724 · Round 724 · 🚑 Emergency response (108) #390
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.0min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 90 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0725 · Round 725 · 🛵 Food delivery #174
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 21 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 100%, ORACLE-validated accuracy 80%).
- **Recovery**: batch_orders + reassign_riders + extend_eta_notify · MTTR 11 min · RECOVERED.
- **Impact**: Late orders 25.8%; Cancelled orders 2; Avg delivery time 21.4min.
- **Resilience** 90 → 83.
- **Next**: Festival order surge (least-tested failure mode in food delivery (5 past runs)).

### INC-UPI-0726 · Round 726 · 💳 UPI payments #157
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0727 · Round 727 · 🚑 Emergency response (108) #391
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.1min; Patients sent to full hospitals 2; Critical patients waiting >15 min 0.
- **Resilience** 88 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0728 · Round 728 · 🛵 Food delivery #175
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 12 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 97%, ORACLE-validated accuracy 80%).
- **Recovery**: batch_orders + reassign_riders + extend_eta_notify · MTTR 9 min · RECOVERED.
- **Impact**: Late orders 27.9%; Cancelled orders 1; Avg delivery time 22.7min.
- **Resilience** 83 → 82.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0729 · Round 729 · 💳 UPI payments #158
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0730 · Round 730 · 🚑 Emergency response (108) #392
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.2min; Patients sent to full hospitals 1; Critical patients waiting >15 min 6.
- **Resilience** 90 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0731 · Round 731 · 🛵 Food delivery #176
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 15 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: batch_orders + reassign_riders + extend_eta_notify · MTTR 17 min · RECOVERED.
- **Impact**: Late orders 23.0%; Cancelled orders 0; Avg delivery time 23.3min.
- **Resilience** 82 → 78.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0732 · Round 732 · 💳 UPI payments #159
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0733 · Round 733 · 🚑 Emergency response (108) #393
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.9min; Patients sent to full hospitals 3; Critical patients waiting >15 min 0.
- **Resilience** 89 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0734 · Round 734 · 🛵 Food delivery #177
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 32.7%; Cancelled orders 0; Avg delivery time 25.1min.
- **Resilience** 78 → 84.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0735 · Round 735 · 💳 UPI payments #160
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0736 · Round 736 · 🚑 Emergency response (108) #394
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.4min; Patients sent to full hospitals 1; Critical patients waiting >15 min 3.
- **Resilience** 91 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0737 · Round 737 · 🛵 Food delivery #178
- **Experiment** (explore): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 7 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 5.0%; Cancelled orders 1; Avg delivery time 17.5min.
- **Resilience** 84 → 87.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0738 · Round 738 · 💳 UPI payments #161
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0739 · Round 739 · 🚑 Emergency response (108) #395
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 9 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.7min; Patients sent to full hospitals 2; Critical patients waiting >15 min 7.
- **Resilience** 88 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0740 · Round 740 · 🛵 Food delivery #179
- **Experiment** (explore): Free-delivery zone config drift on Delivery zones.
- **Detected** coverage_mismatch after 7 min.
- **Diagnosis**: Free-delivery zone misconfigured (config drift) (AEGIS confidence 97%, ORACLE-validated accuracy 100%).
- **Recovery**: restore_zone_config · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 2.3%; Cancelled orders 0; Avg delivery time 19.5min.
- **Resilience** 87 → 89.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0741 · Round 741 · 💳 UPI payments #162
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0742 · Round 742 · 🚑 Emergency response (108) #396
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.6min; Patients sent to full hospitals 2; Critical patients waiting >15 min 4.
- **Resilience** 85 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0743 · Round 743 · 🛵 Food delivery #180
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 22 min · RECOVERED.
- **Impact**: Late orders 41.7%; Cancelled orders 0; Avg delivery time 28.5min.
- **Resilience** 89 → 85.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0744 · Round 744 · 💳 UPI payments #163
- **Experiment** (explore): 10x Diwali traffic spike on Bank switch, Payment API.
- **Detected** high_failure_rate+traffic_spike after 10 s.
- **Diagnosis**: Traffic beyond bank capacity (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: queue_rate_limit · MTTR 5 s · RECOVERED.
- **Impact**: Failed payments 1.8%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0745 · Round 745 · 🚑 Emergency response (108) #397
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 26 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 22.5min; Patients sent to full hospitals 0; Critical patients waiting >15 min 5.
- **Resilience** 84 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0746 · Round 746 · 🛵 Food delivery #181
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 26 min · RECOVERED.
- **Impact**: Late orders 60.0%; Cancelled orders 0; Avg delivery time 25.5min.
- **Resilience** 85 → 82.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0747 · Round 747 · 💳 UPI payments #164
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 91 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0748 · Round 748 · 🚑 Emergency response (108) #398
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.5min; Patients sent to full hospitals 2; Critical patients waiting >15 min 4.
- **Resilience** 77 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0749 · Round 749 · 🛵 Food delivery #182
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 11 min · RECOVERED.
- **Impact**: Late orders 49.1%; Cancelled orders 0; Avg delivery time 24.8min.
- **Resilience** 82 → 85.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0750 · Round 750 · 💳 UPI payments #165
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0751 · Round 751 · 🚑 Emergency response (108) #399
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.8min; Patients sent to full hospitals 5; Critical patients waiting >15 min 5.
- **Resilience** 80 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0752 · Round 752 · 🛵 Food delivery #183
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 26.5%; Cancelled orders 0; Avg delivery time 21.9min.
- **Resilience** 85 → 88.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0753 · Round 753 · 💳 UPI payments #166
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0754 · Round 754 · 🚑 Emergency response (108) #400
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.5min; Patients sent to full hospitals 1; Critical patients waiting >15 min 4.
- **Resilience** 85 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0755 · Round 755 · 🛵 Food delivery #184
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 29.2%; Cancelled orders 0; Avg delivery time 24.1min.
- **Resilience** 88 → 90.
- **Next**: Restaurant tablets offline (least-tested failure mode in food delivery (7 past runs)).

### INC-UPI-0756 · Round 756 · 💳 UPI payments #167
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0757 · Round 757 · 🚑 Emergency response (108) #401
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 3 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.7min; Patients sent to full hospitals 4; Critical patients waiting >15 min 1.
- **Resilience** 86 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0758 · Round 758 · 🛵 Food delivery #185
- **Experiment** (explore): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 5 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: phone_restaurants + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 24.1%; Cancelled orders 0; Avg delivery time 22.8min.
- **Resilience** 90 → 89.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0759 · Round 759 · 💳 UPI payments #168
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0760 · Round 760 · 🚑 Emergency response (108) #402
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 1.
- **Resilience** 89 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0761 · Round 761 · 🛵 Food delivery #186
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 52.7%; Cancelled orders 0; Avg delivery time 23.8min.
- **Resilience** 89 → 91.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0762 · Round 762 · 💳 UPI payments #169
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0763 · Round 763 · 🚑 Emergency response (108) #403
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 6 min · RECOVERED.
- **Impact**: Avg ambulance arrival 18.2min; Patients sent to full hospitals 2; Critical patients waiting >15 min 8.
- **Resilience** 89 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0764 · Round 764 · 🛵 Food delivery #187
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 31.9%; Cancelled orders 1; Avg delivery time 23.6min.
- **Resilience** 91 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0765 · Round 765 · 💳 UPI payments #170
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0766 · Round 766 · 🚑 Emergency response (108) #404
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 89 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0767 · Round 767 · 🛵 Food delivery #188
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 22.7%; Cancelled orders 1; Avg delivery time 22.1min.
- **Resilience** 92 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0768 · Round 768 · 💳 UPI payments #171
- **Experiment** (explore): Partner-bank latency injection on Bank switch.
- **Detected** high_failure_rate+one_bank after 8 s.
- **Diagnosis**: Slow partner bank (injected latency) (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: route_to_healthy_bank · MTTR 9 s · RECOVERED.
- **Impact**: Failed payments 3.0%; Double debits 0; Money stuck (debited, not confirmed) 11540.
- **Resilience** 94 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (6 past runs)).

### INC-EME-0769 · Round 769 · 🚑 Emergency response (108) #405
- **Experiment** (explore): Dispatcher latency injection on Dispatcher.
- **Detected** dispatch_backlog after 20 min.
- **Diagnosis**: Degraded dispatcher (injected latency) (AEGIS confidence 80%, ORACLE-validated accuracy 100%).
- **Recovery**: restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.6min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 87 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (13 past runs)).

### INC-FOO-0770 · Round 770 · 🛵 Food delivery #189
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 39.5%; Cancelled orders 0; Avg delivery time 26.7min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0771 · Round 771 · 💳 UPI payments #172
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 90 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (7 past runs)).

### INC-EME-0772 · Round 772 · 🚑 Emergency response (108) #406
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 3.
- **Resilience** 85 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0773 · Round 773 · 🛵 Food delivery #190
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 26.1%; Cancelled orders 0; Avg delivery time 24.9min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0774 · Round 774 · 💳 UPI payments #173
- **Experiment** (explore): 10x Diwali traffic spike on Bank switch, Payment API.
- **Detected** high_failure_rate+traffic_spike after 12 s.
- **Diagnosis**: Traffic beyond bank capacity (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: queue_rate_limit · MTTR 5 s · RECOVERED.
- **Impact**: Failed payments 1.6%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 89.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (7 past runs)).

### INC-EME-0775 · Round 775 · 🚑 Emergency response (108) #407
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 20 min · RECOVERED.
- **Impact**: Avg ambulance arrival 20.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 8.
- **Resilience** 87 → 79.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0776 · Round 776 · 🛵 Food delivery #191
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 52.6%; Cancelled orders 0; Avg delivery time 25.0min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0777 · Round 777 · 💳 UPI payments #174
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 89 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (7 past runs)).

### INC-EME-0778 · Round 778 · 🚑 Emergency response (108) #408
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 79 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0779 · Round 779 · 🛵 Food delivery #192
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 99%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 45.1%; Cancelled orders 0; Avg delivery time 25.2min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0780 · Round 780 · 💳 UPI payments #175
- **Experiment** (explore): Partner-bank latency injection on Bank switch.
- **Detected** high_failure_rate+one_bank after 8 s.
- **Diagnosis**: Slow partner bank (injected latency) (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: route_to_healthy_bank · MTTR 9 s · RECOVERED.
- **Impact**: Failed payments 3.5%; Double debits 0; Money stuck (debited, not confirmed) 6375.
- **Resilience** 91 → 89.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (7 past runs)).

### INC-EME-0781 · Round 781 · 🚑 Emergency response (108) #409
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 19 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.8min; Patients sent to full hospitals 5; Critical patients waiting >15 min 2.
- **Resilience** 84 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0782 · Round 782 · 🛵 Food delivery #193
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 96%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 38.3%; Cancelled orders 0; Avg delivery time 23.6min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0783 · Round 783 · 💳 UPI payments #176
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 91%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 89 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0784 · Round 784 · 🚑 Emergency response (108) #410
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.4min; Patients sent to full hospitals 2; Critical patients waiting >15 min 0.
- **Resilience** 78 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0785 · Round 785 · 🛵 Food delivery #194
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 26.7%; Cancelled orders 0; Avg delivery time 24.9min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0786 · Round 786 · 💳 UPI payments #177
- **Experiment** (explore): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 12; Money stuck (debited, not confirmed) 6080.
- **Resilience** 91 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0787 · Round 787 · 🚑 Emergency response (108) #411
- **Experiment** (explore): Stale bed data on Bed tracker.
- **Detected** bed_feed_stale after 4 min.
- **Diagnosis**: Stale bed-availability feed (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: skip_stale_hospitals · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.9min; Patients sent to full hospitals 4; Critical patients waiting >15 min 0.
- **Resilience** 84 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0788 · Round 788 · 🛵 Food delivery #195
- **Experiment** (explore): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 10 min.
- **Diagnosis**: Restaurant tablets offline (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: phone_restaurants · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 2.5%; Cancelled orders 0; Avg delivery time 18.6min.
- **Resilience** 94 → 93.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0789 · Round 789 · 💳 UPI payments #178
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0790 · Round 790 · 🚑 Emergency response (108) #412
- **Experiment** (explore): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.1min; Patients sent to full hospitals 1; Critical patients waiting >15 min 5.
- **Resilience** 87 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0791 · Round 791 · 🛵 Food delivery #196
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 34.0%; Cancelled orders 0; Avg delivery time 23.8min.
- **Resilience** 93 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0792 · Round 792 · 💳 UPI payments #179
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0793 · Round 793 · 🚑 Emergency response (108) #413
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 10 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.5min; Patients sent to full hospitals 1; Critical patients waiting >15 min 7.
- **Resilience** 87 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0794 · Round 794 · 🛵 Food delivery #197
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 97%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 18.2%; Cancelled orders 0; Avg delivery time 24.8min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0795 · Round 795 · 💳 UPI payments #180
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0796 · Round 796 · 🚑 Emergency response (108) #414
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 14.1min; Patients sent to full hospitals 8; Critical patients waiting >15 min 5.
- **Resilience** 86 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0797 · Round 797 · 🛵 Food delivery #198
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 31.8%; Cancelled orders 0; Avg delivery time 24.7min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0798 · Round 798 · 💳 UPI payments #181
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0799 · Round 799 · 🚑 Emergency response (108) #415
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.2min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 89 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0800 · Round 800 · 🛵 Food delivery #199
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 31.9%; Cancelled orders 0; Avg delivery time 25.9min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0801 · Round 801 · 💳 UPI payments #182
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0802 · Round 802 · 🚑 Emergency response (108) #416
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 2.
- **Resilience** 91 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0803 · Round 803 · 🛵 Food delivery #200
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 40.4%; Cancelled orders 0; Avg delivery time 23.2min.
- **Resilience** 94 → 94.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0804 · Round 804 · 💳 UPI payments #183
- **Experiment** (explore): Duplicate-request storm on Ledger.
- **Detected** double_debits after 3 s.
- **Diagnosis**: Duplicate requests reaching the ledger (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: idempotency_check · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 13; Money stuck (debited, not confirmed) 4505.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0805 · Round 805 · 🚑 Emergency response (108) #417
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 5 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.8min; Patients sent to full hospitals 1; Critical patients waiting >15 min 0.
- **Resilience** 90 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0806 · Round 806 · 🛵 Food delivery #201
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 59.6%; Cancelled orders 0; Avg delivery time 25.8min.
- **Resilience** 94 → 92.
- **Next**: Festival order surge (least-tested failure mode in food delivery (8 past runs)).

### INC-UPI-0807 · Round 807 · 💳 UPI payments #184
- **Experiment** (explore): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0808 · Round 808 · 🚑 Emergency response (108) #418
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.9min; Patients sent to full hospitals 3; Critical patients waiting >15 min 1.
- **Resilience** 90 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0809 · Round 809 · 🛵 Food delivery #202
- **Experiment** (explore): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 13 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 94%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 23.3%; Cancelled orders 1; Avg delivery time 23.2min.
- **Resilience** 92 → 88.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0810 · Round 810 · 💳 UPI payments #185
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0811 · Round 811 · 🚑 Emergency response (108) #419
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 5 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.7min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 91 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0812 · Round 812 · 🛵 Food delivery #203
- **Experiment** (explore): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 96%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 11 min · RECOVERED.
- **Impact**: Late orders 47.5%; Cancelled orders 1; Avg delivery time 24.8min.
- **Resilience** 88 → 89.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0813 · Round 813 · 💳 UPI payments #186
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0814 · Round 814 · 🚑 Emergency response (108) #420
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 5 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.7min; Patients sent to full hospitals 3; Critical patients waiting >15 min 3.
- **Resilience** 86 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0815 · Round 815 · 🛵 Food delivery #204
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 48.1%; Cancelled orders 1; Avg delivery time 24.2min.
- **Resilience** 89 → 91.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0816 · Round 816 · 💳 UPI payments #187
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0817 · Round 817 · 🚑 Emergency response (108) #421
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.7min; Patients sent to full hospitals 4; Critical patients waiting >15 min 2.
- **Resilience** 88 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0818 · Round 818 · 🛵 Food delivery #205
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 30.6%; Cancelled orders 0; Avg delivery time 22.9min.
- **Resilience** 91 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0819 · Round 819 · 💳 UPI payments #188
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0820 · Round 820 · 🚑 Emergency response (108) #422
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 6 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.9min; Patients sent to full hospitals 4; Critical patients waiting >15 min 1.
- **Resilience** 90 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0821 · Round 821 · 🛵 Food delivery #206
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 45.7%; Cancelled orders 0; Avg delivery time 25.2min.
- **Resilience** 92 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0822 · Round 822 · 💳 UPI payments #189
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0823 · Round 823 · 🚑 Emergency response (108) #423
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 2 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 83%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.7min; Patients sent to full hospitals 2; Critical patients waiting >15 min 0.
- **Resilience** 86 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0824 · Round 824 · 🛵 Food delivery #207
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 20.4%; Cancelled orders 0; Avg delivery time 24.9min.
- **Resilience** 93 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0825 · Round 825 · 💳 UPI payments #190
- **Experiment** (explore): Partner-bank latency injection on Bank switch.
- **Detected** high_failure_rate+one_bank after 9 s.
- **Diagnosis**: Slow partner bank (injected latency) (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: route_to_healthy_bank · MTTR 10 s · RECOVERED.
- **Impact**: Failed payments 3.8%; Double debits 0; Money stuck (debited, not confirmed) 7687.
- **Resilience** 94 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (8 past runs)).

### INC-EME-0826 · Round 826 · 🚑 Emergency response (108) #424
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.7min; Patients sent to full hospitals 1; Critical patients waiting >15 min 5.
- **Resilience** 89 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0827 · Round 827 · 🛵 Food delivery #208
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 42.0%; Cancelled orders 0; Avg delivery time 26.0min.
- **Resilience** 94 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0828 · Round 828 · 💳 UPI payments #191
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 90 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0829 · Round 829 · 🚑 Emergency response (108) #425
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.8min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 89 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0830 · Round 830 · 🛵 Food delivery #209
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 37.2%; Cancelled orders 0; Avg delivery time 26.1min.
- **Resilience** 94 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0831 · Round 831 · 💳 UPI payments #192
- **Experiment** (explore): 10x Diwali traffic spike on Bank switch, Payment API.
- **Detected** high_failure_rate+traffic_spike after 11 s.
- **Diagnosis**: Traffic beyond bank capacity (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: queue_rate_limit · MTTR 5 s · RECOVERED.
- **Impact**: Failed payments 1.5%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0832 · Round 832 · 🚑 Emergency response (108) #426
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 3 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.0min; Patients sent to full hospitals 2; Critical patients waiting >15 min 0.
- **Resilience** 91 → 92.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0833 · Round 833 · 🛵 Food delivery #210
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 34.8%; Cancelled orders 0; Avg delivery time 25.1min.
- **Resilience** 93 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0834 · Round 834 · 💳 UPI payments #193
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 90 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0835 · Round 835 · 🚑 Emergency response (108) #427
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.5min; Patients sent to full hospitals 7; Critical patients waiting >15 min 1.
- **Resilience** 92 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0836 · Round 836 · 🛵 Food delivery #211
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 40.0%; Cancelled orders 0; Avg delivery time 25.3min.
- **Resilience** 94 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0837 · Round 837 · 💳 UPI payments #194
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0838 · Round 838 · 🚑 Emergency response (108) #428
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 15 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.1min; Patients sent to full hospitals 0; Critical patients waiting >15 min 2.
- **Resilience** 89 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0839 · Round 839 · 🛵 Food delivery #212
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 40.4%; Cancelled orders 0; Avg delivery time 24.4min.
- **Resilience** 94 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0840 · Round 840 · 💳 UPI payments #195
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0841 · Round 841 · 🚑 Emergency response (108) #429
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.3min; Patients sent to full hospitals 3; Critical patients waiting >15 min 1.
- **Resilience** 86 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0842 · Round 842 · 🛵 Food delivery #213
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 54.4%; Cancelled orders 0; Avg delivery time 25.4min.
- **Resilience** 93 → 91.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0843 · Round 843 · 💳 UPI payments #196
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0844 · Round 844 · 🚑 Emergency response (108) #430
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 5 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.1min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 88 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0845 · Round 845 · 🛵 Food delivery #214
- **Experiment** (explore): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 21.7%; Cancelled orders 0; Avg delivery time 21.8min.
- **Resilience** 91 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0846 · Round 846 · 💳 UPI payments #197
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0847 · Round 847 · 🚑 Emergency response (108) #431
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 24 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 18.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 7.
- **Resilience** 89 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0848 · Round 848 · 🛵 Food delivery #215
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 42 min · RECOVERED.
- **Impact**: Late orders 66.7%; Cancelled orders 0; Avg delivery time 28.8min.
- **Resilience** 92 → 87.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0849 · Round 849 · 💳 UPI payments #198
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0850 · Round 850 · 🚑 Emergency response (108) #432
- **Experiment** (explore): Stale bed data on Bed tracker.
- **Detected** bed_feed_stale after 4 min.
- **Diagnosis**: Stale bed-availability feed (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: skip_stale_hospitals · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.7min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 80 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0851 · Round 851 · 🛵 Food delivery #216
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 42.6%; Cancelled orders 2; Avg delivery time 26.3min.
- **Resilience** 87 → 90.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0852 · Round 852 · 💳 UPI payments #199
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0853 · Round 853 · 🚑 Emergency response (108) #433
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 10 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 84 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0854 · Round 854 · 🛵 Food delivery #217
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 28.9%; Cancelled orders 0; Avg delivery time 25.2min.
- **Resilience** 90 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0855 · Round 855 · 💳 UPI payments #200
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0856 · Round 856 · 🚑 Emergency response (108) #434
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 17.4min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 84 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0857 · Round 857 · 🛵 Food delivery #218
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 22 min · RECOVERED.
- **Impact**: Late orders 44.6%; Cancelled orders 0; Avg delivery time 28.1min.
- **Resilience** 92 → 87.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0858 · Round 858 · 💳 UPI payments #201
- **Experiment** (explore): 10x Diwali traffic spike on Bank switch, Payment API.
- **Detected** high_failure_rate+traffic_spike after 13 s.
- **Diagnosis**: Traffic beyond bank capacity (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: queue_rate_limit · MTTR 5 s · RECOVERED.
- **Impact**: Failed payments 1.8%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0859 · Round 859 · 🚑 Emergency response (108) #435
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 16 min · RECOVERED.
- **Impact**: Avg ambulance arrival 19.0min; Patients sent to full hospitals 0; Critical patients waiting >15 min 6.
- **Resilience** 84 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0860 · Round 860 · 🛵 Food delivery #219
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 96%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 21.1%; Cancelled orders 0; Avg delivery time 21.9min.
- **Resilience** 87 → 90.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0861 · Round 861 · 💳 UPI payments #202
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 90 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0862 · Round 862 · 🚑 Emergency response (108) #436
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 14 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 16.0min; Patients sent to full hospitals 1; Critical patients waiting >15 min 6.
- **Resilience** 77 → 71.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0863 · Round 863 · 🛵 Food delivery #220
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 44.2%; Cancelled orders 1; Avg delivery time 24.1min.
- **Resilience** 90 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0864 · Round 864 · 💳 UPI payments #203
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 91%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 91 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0865 · Round 865 · 🚑 Emergency response (108) #437
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.4min; Patients sent to full hospitals 4; Critical patients waiting >15 min 5.
- **Resilience** 71 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0866 · Round 866 · 🛵 Food delivery #221
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 30 min · RECOVERED.
- **Impact**: Late orders 60.3%; Cancelled orders 0; Avg delivery time 29.7min.
- **Resilience** 92 → 87.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0867 · Round 867 · 💳 UPI payments #204
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0868 · Round 868 · 🚑 Emergency response (108) #438
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 13.1min; Patients sent to full hospitals 2; Critical patients waiting >15 min 5.
- **Resilience** 78 → 84.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0869 · Round 869 · 🛵 Food delivery #222
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 28.0%; Cancelled orders 1; Avg delivery time 22.4min.
- **Resilience** 87 → 90.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0870 · Round 870 · 💳 UPI payments #205
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 4 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0871 · Round 871 · 🚑 Emergency response (108) #439
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 19 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 17.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 84 → 77.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0872 · Round 872 · 🛵 Food delivery #223
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 13.6%; Cancelled orders 0; Avg delivery time 23.9min.
- **Resilience** 90 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0873 · Round 873 · 💳 UPI payments #206
- **Experiment** (explore): 10x Diwali traffic spike on Bank switch, Payment API.
- **Detected** high_failure_rate+traffic_spike after 13 s.
- **Diagnosis**: Traffic beyond bank capacity (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: queue_rate_limit · MTTR 5 s · RECOVERED.
- **Impact**: Failed payments 1.8%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0874 · Round 874 · 🚑 Emergency response (108) #440
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 11 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.3min; Patients sent to full hospitals 5; Critical patients waiting >15 min 2.
- **Resilience** 77 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0875 · Round 875 · 🛵 Food delivery #224
- **Experiment** (explore): Restaurant tablets offline on Restaurant tablets.
- **Detected** orders_unacknowledged after 7 min.
- **Diagnosis**: Restaurant tablets offline (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: phone_restaurants · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 2.0%; Cancelled orders 0; Avg delivery time 19.5min.
- **Resilience** 92 → 92.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0876 · Round 876 · 💳 UPI payments #207
- **Experiment** (explore): Partner-bank latency injection on Bank switch.
- **Detected** high_failure_rate+one_bank after 8 s.
- **Diagnosis**: Slow partner bank (injected latency) (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: route_to_healthy_bank · MTTR 10 s · RECOVERED.
- **Impact**: Failed payments 2.7%; Double debits 0; Money stuck (debited, not confirmed) 4905.
- **Resilience** 90 → 88.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (9 past runs)).

### INC-EME-0877 · Round 877 · 🚑 Emergency response (108) #441
- **Experiment** (explore): Dispatcher latency injection on Dispatcher.
- **Detected** dispatch_backlog after 9 min.
- **Diagnosis**: Degraded dispatcher (injected latency) (AEGIS confidence 78%, ORACLE-validated accuracy 100%).
- **Recovery**: restart_dispatch · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.2min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 78 → 81.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (14 past runs)).

### INC-FOO-0878 · Round 878 · 🛵 Food delivery #225
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 43.2%; Cancelled orders 2; Avg delivery time 25.4min.
- **Resilience** 92 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0879 · Round 879 · 💳 UPI payments #208
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 88 → 90.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0880 · Round 880 · 🚑 Emergency response (108) #442
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.3min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 81 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0881 · Round 881 · 🛵 Food delivery #226
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 40.7%; Cancelled orders 0; Avg delivery time 21.6min.
- **Resilience** 93 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0882 · Round 882 · 💳 UPI payments #209
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 91%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 90 → 92.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0883 · Round 883 · 🚑 Emergency response (108) #443
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 10.3min; Patients sent to full hospitals 2; Critical patients waiting >15 min 2.
- **Resilience** 86 → 88.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0884 · Round 884 · 🛵 Food delivery #227
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 27.9%; Cancelled orders 0; Avg delivery time 25.9min.
- **Resilience** 94 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0885 · Round 885 · 💳 UPI payments #210
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 92 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0886 · Round 886 · 🚑 Emergency response (108) #444
- **Experiment** (explore): GPS dead zone on GPS tracker.
- **Detected** gps_stuck after 6 min.
- **Diagnosis**: Frozen GPS telemetry (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: distrust_gps · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 7.0min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 88 → 89.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0887 · Round 887 · 🛵 Food delivery #228
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + restore_zone_config + extend_eta_notify · MTTR 6 min · RECOVERED.
- **Impact**: Late orders 32.1%; Cancelled orders 0; Avg delivery time 25.8min.
- **Resilience** 94 → 93.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0888 · Round 888 · 💳 UPI payments #211
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0889 · Round 889 · 🚑 Emergency response (108) #445
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 2 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 9.0min; Patients sent to full hospitals 3; Critical patients waiting >15 min 1.
- **Resilience** 89 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0890 · Round 890 · 🛵 Food delivery #229
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 24.4%; Cancelled orders 2; Avg delivery time 23.6min.
- **Resilience** 93 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0891 · Round 891 · 💳 UPI payments #212
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0892 · Round 892 · 🚑 Emergency response (108) #446
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.1min; Patients sent to full hospitals 2; Critical patients waiting >15 min 6.
- **Resilience** 91 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0893 · Round 893 · 🛵 Food delivery #230
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 15.8%; Cancelled orders 0; Avg delivery time 20.7min.
- **Resilience** 94 → 94.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0894 · Round 894 · 💳 UPI payments #213
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0895 · Round 895 · 🚑 Emergency response (108) #447
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 95%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 30 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 18.0min; Patients sent to full hospitals 5; Critical patients waiting >15 min 10.
- **Resilience** 90 → 81.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0896 · Round 896 · 🛵 Food delivery #231
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 19 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 91%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 19 min · RECOVERED.
- **Impact**: Late orders 28.7%; Cancelled orders 0; Avg delivery time 24.2min.
- **Resilience** 94 → 84.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0897 · Round 897 · 💳 UPI payments #214
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0898 · Round 898 · 🚑 Emergency response (108) #448
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 4 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.8min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 81 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0899 · Round 899 · 🛵 Food delivery #232
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 14 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 92%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 16 min · RECOVERED.
- **Impact**: Late orders 35.8%; Cancelled orders 3; Avg delivery time 23.8min.
- **Resilience** 84 → 80.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0900 · Round 900 · 💳 UPI payments #215
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0901 · Round 901 · 🚑 Emergency response (108) #449
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 9 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 100%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 31 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 20.3min; Patients sent to full hospitals 1; Critical patients waiting >15 min 5.
- **Resilience** 82 → 76.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0902 · Round 902 · 🛵 Food delivery #233
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 15 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 94%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 9 min · RECOVERED.
- **Impact**: Late orders 28.4%; Cancelled orders 2; Avg delivery time 24.4min.
- **Resilience** 80 → 79.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0903 · Round 903 · 💳 UPI payments #216
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 87%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0904 · Round 904 · 🚑 Emergency response (108) #450
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 3 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.8min; Patients sent to full hospitals 4; Critical patients waiting >15 min 5.
- **Resilience** 76 → 82.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0905 · Round 905 · 🛵 Food delivery #234
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 15 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 98%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 8 min · RECOVERED.
- **Impact**: Late orders 27.8%; Cancelled orders 1; Avg delivery time 24.1min.
- **Resilience** 79 → 78.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0906 · Round 906 · 💳 UPI payments #217
- **Experiment** (explore): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0907 · Round 907 · 🚑 Emergency response (108) #451
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 6.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 0.
- **Resilience** 82 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0908 · Round 908 · 🛵 Food delivery #235
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 26 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 94%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 27.2%; Cancelled orders 1; Avg delivery time 22.7min.
- **Resilience** 78 → 77.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0909 · Round 909 · 💳 UPI payments #218
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0910 · Round 910 · 🚑 Emergency response (108) #452
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 2 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 11.1min; Patients sent to full hospitals 4; Critical patients waiting >15 min 2.
- **Resilience** 87 → 90.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0911 · Round 911 · 🛵 Food delivery #236
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 14 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 90%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 8 min · RECOVERED.
- **Impact**: Late orders 24.4%; Cancelled orders 3; Avg delivery time 24.2min.
- **Resilience** 77 → 77.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0912 · Round 912 · 💳 UPI payments #219
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0913 · Round 913 · 🚑 Emergency response (108) #453
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 4 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 16.2min; Patients sent to full hospitals 3; Critical patients waiting >15 min 6.
- **Resilience** 90 → 91.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0914 · Round 914 · 🛵 Food delivery #237
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 16 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 100%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 12 min · RECOVERED.
- **Impact**: Late orders 22.9%; Cancelled orders 0; Avg delivery time 22.8min.
- **Resilience** 77 → 76.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0915 · Round 915 · 💳 UPI payments #220
- **Experiment** (explore): 10x Diwali traffic spike on Bank switch, Payment API.
- **Detected** high_failure_rate+traffic_spike after 17 s.
- **Diagnosis**: Traffic beyond bank capacity (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: queue_rate_limit · MTTR 5 s · RECOVERED.
- **Impact**: Failed payments 1.7%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 89.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0916 · Round 916 · 🚑 Emergency response (108) #454
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 11 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 88%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 18 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 15.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 91 → 80.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0917 · Round 917 · 🛵 Food delivery #238
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 16 min.
- **Diagnosis**: Promised ETAs no longer realistic (AEGIS confidence 92%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 10 min · RECOVERED.
- **Impact**: Late orders 25.5%; Cancelled orders 1; Avg delivery time 22.1min.
- **Resilience** 76 → 76.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0918 · Round 918 · 💳 UPI payments #221
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 89 → 91.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0919 · Round 919 · 🚑 Emergency response (108) #455
- **Experiment** (explore): SMS gateway outage on Notifier (SMS).
- **Detected** sms_failing after 2 min.
- **Diagnosis**: SMS gateway outage (AEGIS confidence 92%, ORACLE-validated accuracy 100%).
- **Recovery**: backup_sms · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 8.7min; Patients sent to full hospitals 3; Critical patients waiting >15 min 0.
- **Resilience** 80 → 85.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0920 · Round 920 · 🛵 Food delivery #239
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 15 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 90%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 12 min · RECOVERED.
- **Impact**: Late orders 25.5%; Cancelled orders 1; Avg delivery time 22.9min.
- **Resilience** 76 → 76.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0921 · Round 921 · 💳 UPI payments #222
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 2 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 91 → 93.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0922 · Round 922 · 🚑 Emergency response (108) #456
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 17.6min; Patients sent to full hospitals 0; Critical patients waiting >15 min 3.
- **Resilience** 85 → 86.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0923 · Round 923 · 🛵 Food delivery #240
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 16.8min.
- **Resilience** 76 → 83.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0924 · Round 924 · 💳 UPI payments #223
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 86%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 93 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0925 · Round 925 · 🚑 Emergency response (108) #457
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 6 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 15.2min; Patients sent to full hospitals 0; Critical patients waiting >15 min 4.
- **Resilience** 86 → 87.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0926 · Round 926 · 🛵 Food delivery #241
- **Experiment** (exploit): Festival order surge on Assignment, Order intake.
- **Detected** order_backlog+high_order_rate after 19 min.
- **Diagnosis**: Order surge beyond fleet capacity (AEGIS confidence 94%, ORACLE-validated accuracy 80%).
- **Recovery**: reassign_riders + batch_orders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 16.2%; Cancelled orders 0; Avg delivery time 23.4min.
- **Resilience** 83 → 81.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0927 · Round 927 · 💳 UPI payments #224
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 88%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0928 · Round 928 · 🚑 Emergency response (108) #458
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 12 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 24 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 16.9min; Patients sent to full hospitals 0; Critical patients waiting >15 min 6.
- **Resilience** 87 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0929 · Round 929 · 🛵 Food delivery #242
- **Experiment** (exploit): Heavy rain + rider shortage on Assignment, Rider GPS.
- **Detected** rider_shortage after 2 min.
- **Diagnosis**: Rider shortage (weather or demand) (AEGIS confidence 95%, ORACLE-validated accuracy 100%).
- **Recovery**: reassign_riders + extend_eta_notify · MTTR 4 min · RECOVERED.
- **Impact**: Late orders 41.7%; Cancelled orders 1; Avg delivery time 26.0min.
- **Resilience** 81 → 86.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0930 · Round 930 · 💳 UPI payments #225
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 3 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 89%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 94.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0931 · Round 931 · 🚑 Emergency response (108) #459
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 8 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 98%, ORACLE-validated accuracy 67%).
- **Recovery**: surge_mode + restart_dispatch · MTTR 19 min · NOT RECOVERED.
- **Impact**: Avg ambulance arrival 16.4min; Patients sent to full hospitals 4; Critical patients waiting >15 min 6.
- **Resilience** 78 → 73.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

### INC-FOO-0932 · Round 932 · 🛵 Food delivery #243
- **Experiment** (explore): Maps API latency injection on Maps / ETA.
- **Detected** assignment_slow after 2 min.
- **Diagnosis**: Slow maps / ETA dependency (AEGIS confidence 100%, ORACLE-validated accuracy 100%).
- **Recovery**: cached_routes · MTTR 2 min · RECOVERED.
- **Impact**: Late orders 0.0%; Cancelled orders 0; Avg delivery time 18.0min.
- **Resilience** 86 → 90.
- **Next**: Free-delivery zone config drift (least-tested failure mode in food delivery (9 past runs)).

### INC-UPI-0933 · Round 933 · 💳 UPI payments #226
- **Experiment** (exploit): Fraud-bot burst on Fraud check, Payment API.
- **Detected** fraud_check_backlog+few_devices after 2 s.
- **Diagnosis**: Bot traffic flooding the fraud check (AEGIS confidence 85%, ORACLE-validated accuracy 100%).
- **Recovery**: throttle_bot · MTTR 2 s · RECOVERED.
- **Impact**: Failed payments 0.0%; Double debits 0; Money stuck (debited, not confirmed) 0.
- **Resilience** 94 → 95.
- **Next**: Partner-bank latency injection (least-tested failure mode in upi payments (10 past runs)).

### INC-EME-0934 · Round 934 · 🚑 Emergency response (108) #460
- **Experiment** (exploit): Mass-casualty call surge on Call intake, Dispatcher.
- **Detected** dispatch_backlog+high_call_rate after 7 min.
- **Diagnosis**: Call surge with duplicate callers (AEGIS confidence 90%, ORACLE-validated accuracy 100%).
- **Recovery**: surge_mode · MTTR 2 min · RECOVERED.
- **Impact**: Avg ambulance arrival 12.5min; Patients sent to full hospitals 4; Critical patients waiting >15 min 4.
- **Resilience** 73 → 78.
- **Next**: Dispatcher latency injection (least-tested failure mode in emergency response (108) (15 past runs)).

