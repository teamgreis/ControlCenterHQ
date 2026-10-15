/* ============================================================
   ControlCenterHQ – Frontend Application
   © Felix Greis 2026 – All rights reserved.
   ControlCenterHQ – Unauthorized modification prohibited.
   ============================================================ */

const ATLAS_COPYRIGHT = "Felix Greis 2026";
const ATLAS_APP = "ControlCenterHQ";

const ATLAS = {

/* ============================================================
   i18n – Internationalization
============================================================ */
i18n: {
  lang: localStorage.getItem('atlas_lang') || 'en',
  strings: {
    en: {
      dashboard: 'Dashboard', map: 'Command & Control', incidents: 'Incidents',
      alerts: 'Alerts', chat: 'Communication', sensors: 'Sensors',
      logs: 'Data Logs', analytics: 'AI Analytics', fleet: 'Fleet Management',
      navigation: 'Navigation', users: 'Users', modules: 'Modules', settings: 'Settings',
      login: 'Sign In', logout: 'Logout', username: 'Username', password: 'Password',
      save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', create: 'Create',
      add: 'Add', close: 'Close', confirm: 'Confirm', search: 'Search',
      loading: 'Loading...', error: 'Error', success: 'Success', warning: 'Warning',
      critical: 'Critical', info: 'Info', open: 'Open', resolved: 'Resolved',
      in_progress: 'In Progress', active: 'Active', inactive: 'Inactive',
      available: 'Available', on_trip: 'On Trip', maintenance: 'Maintenance',
      out_of_service: 'Out of Service', acknowledge: 'Acknowledge', ack_all: 'Ack All',
      new_incident: 'New Incident', new_alert: 'New Alert', new_asset: 'New Asset',
      new_vehicle: 'New Vehicle', new_driver: 'New Driver', new_trip: 'New Trip',
      new_maintenance: 'New Maintenance', add_fuel: 'Add Fuel Log',
      title: 'Title', description: 'Description', severity: 'Severity', status: 'Status',
      name: 'Name', type: 'Type', location: 'Location', date: 'Date',
      vehicle: 'Vehicle', driver: 'Driver', origin: 'Origin', destination: 'Destination',
      departure: 'Departure', arrival: 'Arrival', distance: 'Distance',
      cost: 'Cost', liters: 'Liters', odometer: 'Odometer',
      license_plate: 'License Plate', vin: 'VIN', make: 'Make', model: 'Model',
      year: 'Year', color: 'Color', seats: 'Seats', fuel_type: 'Fuel Type',
      insurance_expiry: 'Insurance Expiry', tuev_expiry: 'TÜV / Inspection',
      role: 'Role', owner: 'Owner', admin: 'Admin', operator: 'Operator', viewer: 'Viewer',
      theme: 'Theme', language: 'Language', online: 'Online', offline: 'Offline',
      send: 'Send', message: 'Message', rooms: 'Rooms', direct_messages: 'Direct Messages',
      navigate_to: 'Navigate To', start_navigation: 'Start Navigation',
      recalculating: 'Recalculating...', arrived: 'You have arrived!',
      turn_left: 'Turn left', turn_right: 'Turn right', continue_straight: 'Continue straight',
      by_car: 'By Car', by_bike: 'By Bike', on_foot: 'On Foot',
      eta: 'ETA', total_distance: 'Total Distance',
      alert_tone: 'Alert Tone', test_tone: 'Test Tone',
      export_csv: 'Export CSV', export_json: 'Export JSON',
      no_data: 'No data available', refresh: 'Refresh',
      enabled: 'Enabled', disabled: 'Disabled', toggle: 'Toggle',
      overview: 'Overview', details: 'Details', history: 'History',
      fleet_stats: 'Fleet Statistics', maintenance_due: 'Maintenance Due',
      pre_trip: 'Pre-Trip', post_trip: 'Post-Trip', inspection: 'Inspection',
      documents: 'Documents', fuel_log: 'Fuel Log', trips: 'Trips',
      drivers: 'Drivers', vehicles: 'Vehicles',
      anomalies: 'Anomalies', predictions: 'Predictions', patterns: 'Patterns',
      org_name: 'Organization Name', facility_type: 'Facility Type',
      copyright: '© Felix Greis 2026',
      invalid_credentials: 'Invalid username or password',
      default_hint: '',
      pager: 'Pager Gateway', scheduler: 'Scheduler',
      pager_rx: 'Receive (POCSAG)', pager_tx: 'Send (DAPNET)', pager_channels: 'Push Channels',
      capcode: 'Capcode', rx_running: 'RX Running', rx_stopped: 'RX Stopped',
      start_rx: 'Start Receiver', stop_rx: 'Stop Receiver',
      dapnet_config: 'DAPNET Config', ntfy_config: 'ntfy Config', apprise_config: 'Apprise Config',
      send_to_pager: 'Send via DAPNET', pager_test_ok: 'Test OK', pager_test_fail: 'Test failed',
      callsign: 'Callsign', target_callsigns: 'Target Callsigns',
      transmitter_group: 'Transmitter Group', ntfy_url: 'ntfy Server URL',
      ntfy_topic: 'Topic', ntfy_token: 'Access Token',
      apprise_urls: 'Apprise URLs (one per line)', rx_frequency: 'Frequency (MHz)',
      rx_gain: 'Gain', rx_filter_capcodes: 'Filter Capcodes (comma-separated)',
      rx_create_alerts: 'Create Atlas Alerts from RX',
      channels: 'Active Channels', webpush_status: 'Web Push Status',
      scheduled: 'Scheduled Items', new_scheduled: 'New Scheduled Item',
      recurrence: 'Recurrence', once: 'Once', daily: 'Daily', weekly: 'Weekly',
      hourly: 'Hourly', interval: 'Every N minutes',
      next_run: 'Next Run', last_run: 'Last Run', run_count: 'Run Count',
      run_now: 'Run Now', schedule_alert: 'Scheduled Alert', schedule_incident: 'Scheduled Incident',
      interval_minutes: 'Interval (minutes)',
      // Weather
      weather: 'Weather', weather_current: 'Current Weather', weather_forecast: 'Forecast',
      temp: 'Temperature', humidity: 'Humidity', wind: 'Wind Speed', feels_like: 'Feels Like',
      // Calendar
      calendar: 'Calendar', new_event: 'New Event', vacation: 'Vacation', duty: 'Duty Shift', event: 'Event',
      pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
      approve: 'Approve', reject: 'Reject', all_day: 'All Day',
      // Travel
      travel: 'Travel Requests', new_travel: 'New Travel Request',
      travel_type: 'Travel Type', solo: 'Solo', with_crew: 'With Crew',
      passengers: 'Passengers', reviewer_notes: 'Reviewer Notes',
      accept_counteroffer: 'Accept', reject_counteroffer: 'Reject Counter-offer',
      // Permissions
      permissions: 'Permissions', user_groups: 'User Groups', new_group: 'New Group',
      base_role: 'Base Role', dispatcher: 'Dispatcher', abteilleitung: 'Department Head',
      can_delete_alerts: 'Delete Alerts', can_ack_all: 'Acknowledge All',
      can_manage_users: 'Manage Users', can_manage_fleet: 'Manage Fleet',
      can_view_logs: 'View Logs', can_send_pager: 'Send Pager',
      can_restart: 'Restart Server', can_backup: 'Create Backup',
      can_manage_calendar: 'Manage Calendar', can_approve_travel: 'Approve Travel',
      // New modules
      Lagerverwaltung: 'Inventory', Wissensdatenbank: 'Knowledge Base', Anfragen: 'Requests', 'Pi-Netzwerk': 'Pi Network',
      Ereignisvorhersage: 'Event Predictions', 'Remote-Zugriff': 'Remote Access', 'Sicherheits-KI': 'Security AI',
      // Backup & System
      backup: 'Backup', restore: 'Restore', server_restart: 'Restart Server',
      pi_sensors: 'Pi Sensors', cpu_temp: 'CPU Temperature', cpu_voltage: 'CPU Voltage',
      // Map layers
      map_layer: 'Map Layer', map_osm: 'OpenStreetMap', map_satellite: 'Satellite',
      map_topo: 'Topographic', map_dark: 'Dark', map_transport: 'Transport',
      map_water: 'Nautical / Water',
      // Gotify
      gotify_config: 'Gotify Config', gotify_url: 'Gotify URL', gotify_token: 'Gotify Token',
      gotify_priority: 'Priority',
      // Navigation extra
      flight_mode: 'Flight Mode', boat_mode: 'Boat / Water Mode',
      route_options: 'Route Options', route_fastest: 'Fastest', route_shortest: 'Shortest', route_avoid_highways: 'Avoid Highways',
      // Vehicle fuel
      fuel_capacity: 'Tank Capacity (L)', fuel_current: 'Current Fuel (L)', fuel_avg: 'Avg. Consumption (L/100km)',
      fuel_range: 'Estimated Range', update_position: 'Update Position', complete_trip: 'Complete Trip',
      fuel_used: 'Fuel Used (L)', end_position: 'End Position', completed_notes: 'Completion Notes',
      // Alarm
      alarm_active: 'ALARM ACTIVE', dismiss_alarm: 'Dismiss',
      // Contacts
      contacts: 'Contacts', new_contact: 'New Contact', call_sign: 'Call Sign',
      organization: 'Organization', department: 'Department', role_label: 'Role / Title', phone: 'Phone',
      category: 'Category', notes: 'Notes', favorite: 'Favorite',
      cat_staff: 'Staff', cat_emergency: 'Emergency Services', cat_supplier: 'Supplier',
      cat_authority: 'Authority', cat_other: 'Other', search_contacts: 'Search contacts…',
      location: 'Location', address_or_coords: 'Address or coordinates…',
      // Roles
      roles: 'Roles & Permissions', new_role: 'New Role', builtin: 'Built-in',
      custom: 'Custom', permissions: 'Permissions', base_role: 'Base Role',
      perm_read: 'Read / View', perm_create: 'Create', perm_edit: 'Edit',
      perm_delete: 'Delete', perm_fleet: 'Fleet Management', perm_pager: 'Pager / Push',
      perm_analytics: 'AI Analytics', perm_admin: 'Admin (all rights)',
      role_description: 'Description',
      // Voice
      voice_channel: 'Voice Channel', ptt_hold: 'Hold to Talk', ptt_release: 'Release',
      voice_joining: 'Joining…', voice_leave: 'Leave', voice_speaking: 'Speaking',
      voice_idle: 'Standby', voice_active: 'Active',
      // Predictive Dispatch
      predictive_dispatch: 'Predictive Dispatch', heatmap: 'Incident Heatmap',
      risk_hours: 'Risk Hours', risk_days: 'Risk Days', total_analyzed: 'Incidents Analyzed',
      suggest_vehicles: 'Suggest Vehicles', resource_intelligence: 'Resource Intelligence',
      // Infrastructure
      infrastructure: 'Infrastructure', hydrants: 'Hydrants', fire_access: 'Fire Access',
      infra_scanner: 'Infrastructure Scanner', click_map_infra: 'Click on map to scan infrastructure',
      // Incident Report
      incident_report: 'Incident Report', generate_report: 'Generate Report',
      print_report: 'Print / PDF', report_chronology: 'Chronology',
      deployed_vehicles: 'Deployed Vehicles', related_alerts: 'Related Alerts',
      // Federation
      federation: 'Multi-Dispatch Network', add_peer: 'Add Dispatch Center',
      peer_name: 'Name', peer_url: 'URL', peer_api_key: 'API Key',
      peer_status: 'Status', peer_online: 'Online', peer_offline: 'Offline',
      peer_unknown: 'Unknown', sync_now: 'Sync Now', live_map: 'Live Map',
      federation_api_key: 'Your Federation API Key',
      auto_discover: 'Auto-Discover via Tailscale',
      // Setup Wizard
      setup_welcome: 'Welcome to ControlCenterHQ', setup_subtitle: 'First-time setup',
      setup_org: 'Organization', setup_admin: 'Administrator Account',
      setup_server: 'Server Settings', setup_network: 'Network & APIs',
      setup_complete_btn: 'Complete Setup',
      overpass_url: 'Overpass API URL', tailscale_key: 'Tailscale Auth Key (optional)',
      // Smart Alerting
      alarm_groups: 'Alarm Groups', dispatch_vehicle: 'Dispatch Vehicle',
      dispatch_accept: 'Accept', dispatch_decline: 'Decline', dispatch_reason: 'Reason',
      nina_monitor: 'NINA Warning Monitor', nina_enabled: 'Enable NINA/MoWaS Monitoring',
      nina_status: 'NINA Status', nina_last_check: 'Last Check', nina_warnings: 'Active Warnings',
      emergency_broadcast: 'Emergency Broadcast', trigger_emergency: 'Trigger Emergency Alert',
      vehicle_dispatched: 'Vehicle Dispatched', dispatch_request: 'Dispatch Request',
      // Timeline
      timeline: 'Event Timeline', timeline_incidents: 'Incidents', timeline_alerts: 'Alerts',
      timeline_fleet: 'Fleet', timeline_all: 'All Events',
      // Vehicle utilization
      vehicle_utilization: 'Vehicle Utilization', trip_count: 'Trips', total_distance: 'Total Distance',
      incident_trends: 'Incident Trends', trend_up: '↑ Increasing', trend_down: '↓ Decreasing', trend_stable: '→ Stable',
      // Mobile App
      connect_mobile_app: 'Connect Mobile App', scan_qr_code: 'Scan this QR code with the Atlas app',
      qr_expires_in: 'QR code expires in 60 minutes', qr_generating: 'Generating…',
      apns_config: 'APNs Configuration', apns_key_id: 'Key ID', apns_team_id: 'Team ID',
      apns_p8_key: 'P8 Private Key', apns_sandbox: 'Sandbox Mode (Dev)',
      apns_test: 'Send Test Push',
      qr_tailscale_hint: 'The QR code uses your Tailscale URL – works from anywhere. If Tailscale is not active, enter the local URL manually in the app.',
      // Device / Mobile user locations
      device_locations: 'Mobile Users', device_location_live: 'Live position from app',
      no_device_locations: 'No mobile users online',
    },
    de: {
      dashboard: 'Dashboard', map: 'Lagekarte', incidents: 'Vorfälle',
      alerts: 'Alarme', chat: 'Kommunikation', sensors: 'Sensoren',
      logs: 'Datenlogs', analytics: 'KI-Analytik', fleet: 'Fuhrparkmanagement',
      navigation: 'Navigation', users: 'Benutzer', modules: 'Module', settings: 'Einstellungen',
      login: 'Anmelden', logout: 'Abmelden', username: 'Benutzername', password: 'Passwort',
      save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', edit: 'Bearbeiten', create: 'Erstellen',
      add: 'Hinzufügen', close: 'Schließen', confirm: 'Bestätigen', search: 'Suchen',
      loading: 'Laden...', error: 'Fehler', success: 'Erfolg', warning: 'Warnung',
      critical: 'Kritisch', info: 'Info', open: 'Offen', resolved: 'Gelöst',
      in_progress: 'In Bearbeitung', active: 'Aktiv', inactive: 'Inaktiv',
      available: 'Verfügbar', on_trip: 'Auf Tour', maintenance: 'In Wartung',
      out_of_service: 'Außer Betrieb', acknowledge: 'Bestätigen', ack_all: 'Alle best.',
      new_incident: 'Neuer Vorfall', new_alert: 'Neuer Alarm', new_asset: 'Neues Asset',
      new_vehicle: 'Neues Fahrzeug', new_driver: 'Neuer Fahrer', new_trip: 'Neue Tour',
      new_maintenance: 'Neue Wartung', add_fuel: 'Tankeintrag',
      title: 'Titel', description: 'Beschreibung', severity: 'Schwere', status: 'Status',
      name: 'Name', type: 'Typ', location: 'Standort', date: 'Datum',
      vehicle: 'Fahrzeug', driver: 'Fahrer', origin: 'Startpunkt', destination: 'Ziel',
      departure: 'Abfahrt', arrival: 'Ankunft', distance: 'Distanz',
      cost: 'Kosten', liters: 'Liter', odometer: 'Kilometerstand',
      license_plate: 'Kennzeichen', vin: 'Fahrzeugidentifikationsnummer', make: 'Hersteller', model: 'Modell',
      year: 'Baujahr', color: 'Farbe', seats: 'Sitze', fuel_type: 'Kraftstoffart',
      insurance_expiry: 'Versicherungsablauf', tuev_expiry: 'TÜV-Datum',
      role: 'Rolle', owner: 'Eigentümer', admin: 'Administrator', operator: 'Operator', viewer: 'Zuschauer',
      theme: 'Design', language: 'Sprache', online: 'Online', offline: 'Offline',
      send: 'Senden', message: 'Nachricht', rooms: 'Räume', direct_messages: 'Direktnachrichten',
      navigate_to: 'Navigieren nach', start_navigation: 'Navigation starten',
      recalculating: 'Neu berechnen...', arrived: 'Sie haben Ihr Ziel erreicht!',
      turn_left: 'Links abbiegen', turn_right: 'Rechts abbiegen', continue_straight: 'Geradeaus fahren',
      by_car: 'Mit dem Auto', by_bike: 'Mit dem Fahrrad', on_foot: 'Zu Fuß',
      eta: 'Ankunft', total_distance: 'Gesamtdistanz',
      alert_tone: 'Alarmton', test_tone: 'Ton testen',
      export_csv: 'CSV exportieren', export_json: 'JSON exportieren',
      no_data: 'Keine Daten verfügbar', refresh: 'Aktualisieren',
      enabled: 'Aktiviert', disabled: 'Deaktiviert', toggle: 'Umschalten',
      overview: 'Übersicht', details: 'Details', history: 'Verlauf',
      fleet_stats: 'Fuhrpark-Statistik', maintenance_due: 'Wartung fällig',
      pre_trip: 'Vor der Fahrt', post_trip: 'Nach der Fahrt', inspection: 'Inspektion',
      documents: 'Dokumente', fuel_log: 'Tankprotokoll', trips: 'Touren',
      drivers: 'Fahrer', vehicles: 'Fahrzeuge',
      anomalies: 'Anomalien', predictions: 'Vorhersagen', patterns: 'Muster',
      org_name: 'Organisationsname', facility_type: 'Einrichtungstyp',
      copyright: '© Felix Greis 2026',
      invalid_credentials: 'Ungültiger Benutzername oder Passwort',
      default_hint: '',
      pager: 'Pager Gateway', scheduler: 'Planer',
      pager_rx: 'Empfangen (POCSAG)', pager_tx: 'Senden (DAPNET)', pager_channels: 'Push-Kanäle',
      capcode: 'Capcode', rx_running: 'Empfänger aktiv', rx_stopped: 'Empfänger gestoppt',
      start_rx: 'Empfänger starten', stop_rx: 'Empfänger stoppen',
      dapnet_config: 'DAPNET-Konfiguration', ntfy_config: 'ntfy-Konfiguration', apprise_config: 'Apprise-Konfiguration',
      send_to_pager: 'Via DAPNET senden', pager_test_ok: 'Test OK', pager_test_fail: 'Test fehlgeschlagen',
      callsign: 'Rufzeichen', target_callsigns: 'Ziel-Rufzeichen',
      transmitter_group: 'Sendergruppe', ntfy_url: 'ntfy-Server-URL',
      ntfy_topic: 'Thema', ntfy_token: 'Zugriffstoken',
      apprise_urls: 'Apprise URLs (eine pro Zeile)', rx_frequency: 'Frequenz (MHz)',
      rx_gain: 'Verstärkung', rx_filter_capcodes: 'Capcode-Filter (kommagetrennt)',
      rx_create_alerts: 'Atlas-Alarme aus Empfang erstellen',
      channels: 'Aktive Kanäle', webpush_status: 'Web-Push-Status',
      scheduled: 'Geplante Elemente', new_scheduled: 'Neues geplantes Element',
      recurrence: 'Wiederholung', once: 'Einmalig', daily: 'Täglich', weekly: 'Wöchentlich',
      hourly: 'Stündlich', interval: 'Alle N Minuten',
      next_run: 'Nächste Ausführung', last_run: 'Letzte Ausführung', run_count: 'Ausführungen',
      run_now: 'Jetzt ausführen', schedule_alert: 'Geplanter Alarm', schedule_incident: 'Geplanter Vorfall',
      interval_minutes: 'Intervall (Minuten)',
      weather: 'Wetter', weather_current: 'Aktuelles Wetter', weather_forecast: 'Vorhersage',
      temp: 'Temperatur', humidity: 'Luftfeuchtigkeit', wind: 'Windgeschwindigkeit', feels_like: 'Gefühlt',
      calendar: 'Kalender', new_event: 'Neuer Eintrag', vacation: 'Urlaub', duty: 'Dienstschicht', event: 'Ereignis',
      pending: 'Ausstehend', approved: 'Genehmigt', rejected: 'Abgelehnt',
      approve: 'Genehmigen', reject: 'Ablehnen', all_day: 'Ganztägig',
      travel: 'Reiseanträge', new_travel: 'Neuer Reiseantrag',
      travel_type: 'Reiseart', solo: 'Allein', with_crew: 'Mit Besatzung',
      passengers: 'Mitreisende', reviewer_notes: 'Prüfnotizen',
      accept_counteroffer: 'Akzeptieren', reject_counteroffer: 'Gegenangebot ablehnen',
      permissions: 'Berechtigungen', user_groups: 'Benutzergruppen', new_group: 'Neue Gruppe',
      base_role: 'Basisrolle', dispatcher: 'Dispatcher', abteilleitung: 'Abteilungsleitung',
      can_delete_alerts: 'Alarme löschen', can_ack_all: 'Alle bestätigen',
      can_manage_users: 'Benutzer verwalten', can_manage_fleet: 'Fuhrpark verwalten',
      can_view_logs: 'Logs einsehen', can_send_pager: 'Pager senden',
      can_restart: 'Server neustarten', can_backup: 'Backup erstellen',
      can_manage_calendar: 'Kalender verwalten', can_approve_travel: 'Reisen genehmigen',
      backup: 'Backup', restore: 'Wiederherstellen', server_restart: 'Server neustarten',
      pi_sensors: 'Pi-Sensoren', cpu_temp: 'CPU-Temperatur', cpu_voltage: 'CPU-Spannung',
      map_layer: 'Kartenebene', map_osm: 'OpenStreetMap', map_satellite: 'Satellit',
      map_topo: 'Topografie', map_dark: 'Dunkel', map_transport: 'Transport',
      map_water: 'Nautisch / Wasser',
      gotify_config: 'Gotify-Konfiguration', gotify_url: 'Gotify-URL', gotify_token: 'Gotify-Token',
      gotify_priority: 'Priorität',
      flight_mode: 'Flugmodus', boat_mode: 'Boots- / Wassermodus',
      route_options: 'Routenoptionen', route_fastest: 'Schnellste', route_shortest: 'Kürzeste', route_avoid_highways: 'Autobahn meiden',
      fuel_capacity: 'Tankinhalt (L)', fuel_current: 'Aktueller Kraftstoff (L)', fuel_avg: 'Ø-Verbrauch (L/100km)',
      fuel_range: 'Geschätzte Reichweite', update_position: 'Position aktualisieren', complete_trip: 'Tour abschließen',
      fuel_used: 'Verbrauchter Kraftstoff (L)', end_position: 'Endposition', completed_notes: 'Abschlussnotizen',
      alarm_active: 'ALARM AKTIV', dismiss_alarm: 'Quittieren',
      // Kontakte
      contacts: 'Kontakte', new_contact: 'Neuer Kontakt', call_sign: 'Rufzeichen',
      organization: 'Organisation', department: 'Abteilung', role_label: 'Rolle / Titel', phone: 'Telefon',
      category: 'Kategorie', notes: 'Notizen', favorite: 'Favorit',
      cat_staff: 'Personal', cat_emergency: 'Einsatzkräfte', cat_supplier: 'Lieferant',
      cat_authority: 'Behörde', cat_other: 'Sonstige', search_contacts: 'Kontakte suchen…',
      location: 'Standort', address_or_coords: 'Adresse oder Koordinaten…',
      // Rollen
      roles: 'Rollen & Rechte', new_role: 'Neue Rolle', builtin: 'Eingebaut',
      custom: 'Benutzerdefiniert', permissions: 'Berechtigungen', base_role: 'Basisrolle',
      perm_read: 'Lesen / Anzeigen', perm_create: 'Erstellen', perm_edit: 'Bearbeiten',
      perm_delete: 'Löschen', perm_fleet: 'Flotte verwalten', perm_pager: 'Pager / Push senden',
      perm_analytics: 'KI-Analytik', perm_admin: 'Admin (alle Rechte)',
      role_description: 'Beschreibung',
      // Sprach-Kanal
      voice_channel: 'Sprachkanal', ptt_hold: 'Halten zum Sprechen', ptt_release: 'Loslassen',
      voice_joining: 'Verbinde…', voice_leave: 'Verlassen', voice_speaking: 'Spricht',
      voice_idle: 'Bereitschaft', voice_active: 'Aktiv',
      // Predictive Dispatch
      predictive_dispatch: 'Predictive Dispatch', heatmap: 'Einsatz-Heatmap',
      risk_hours: 'Risikostunden', risk_days: 'Risikotage', total_analyzed: 'Analysierte Einsätze',
      suggest_vehicles: 'Fahrzeuge vorschlagen', resource_intelligence: 'Ressourcen-Intelligenz',
      // Infrastruktur
      infrastructure: 'Infrastruktur', hydrants: 'Hydranten', fire_access: 'Feuerwehrzufahrten',
      infra_scanner: 'Infrastruktur-Scanner', click_map_infra: 'Auf Karte klicken zum Scannen',
      // Einsatzbericht
      incident_report: 'Einsatzbericht', generate_report: 'Bericht erstellen',
      print_report: 'Drucken / PDF', report_chronology: 'Chronologie',
      deployed_vehicles: 'Eingesetzte Fahrzeuge', related_alerts: 'Zugehörige Alarme',
      // Verbund
      federation: 'Leitstellen-Verbund', add_peer: 'Leitstelle hinzufügen',
      peer_name: 'Name', peer_url: 'URL', peer_api_key: 'API-Schlüssel',
      peer_status: 'Status', peer_online: 'Online', peer_offline: 'Offline',
      peer_unknown: 'Unbekannt', sync_now: 'Jetzt synchronisieren', live_map: 'Live-Karte',
      federation_api_key: 'Eigener Verbund-API-Schlüssel',
      auto_discover: 'Automatisch über Tailscale erkennen',
      // Einrichtungs-Assistent
      setup_welcome: 'Willkommen bei ControlCenterHQ', setup_subtitle: 'Ersteinrichtung',
      setup_org: 'Organisation', setup_admin: 'Administrator-Konto',
      setup_server: 'Server-Einstellungen', setup_network: 'Netzwerk & APIs',
      setup_complete_btn: 'Einrichtung abschließen',
      overpass_url: 'Overpass-API-URL', tailscale_key: 'Tailscale Auth-Key (optional)',
      // Intelligente Alarmierung
      alarm_groups: 'Alarmgruppen', dispatch_vehicle: 'Fahrzeug alarmieren',
      dispatch_accept: 'Annehmen', dispatch_decline: 'Ablehnen', dispatch_reason: 'Grund',
      nina_monitor: 'NINA-Warnmonitor', nina_enabled: 'NINA/MoWaS-Monitoring aktivieren',
      nina_status: 'NINA-Status', nina_last_check: 'Letzte Prüfung', nina_warnings: 'Aktive Warnungen',
      emergency_broadcast: 'Notfallalarm', trigger_emergency: 'Notfallalarm auslösen',
      vehicle_dispatched: 'Fahrzeug alarmiert', dispatch_request: 'Einsatzanfrage',
      // Timeline
      timeline: 'Ereigniszeitleiste', timeline_incidents: 'Vorfälle', timeline_alerts: 'Alarme',
      timeline_fleet: 'Fuhrpark', timeline_all: 'Alle Ereignisse',
      // Fahrzeugauslastung
      vehicle_utilization: 'Fahrzeugauslastung', trip_count: 'Fahrten',
      incident_trends: 'Einsatz-Trends', trend_up: '↑ Zunehmend', trend_down: '↓ Abnehmend', trend_stable: '→ Stabil',
      // Mobile App
      connect_mobile_app: 'Mobile App verbinden', scan_qr_code: 'QR-Code mit der Atlas-App scannen',
      qr_expires_in: 'QR-Code gültig für 60 Minuten', qr_generating: 'Wird generiert…',
      apns_config: 'APNs Konfiguration', apns_key_id: 'Key ID', apns_team_id: 'Team ID',
      apns_p8_key: 'P8 Privatschlüssel', apns_sandbox: 'Sandbox-Modus (Entwicklung)',
      apns_test: 'Test-Push senden',
      qr_tailscale_hint: 'Der QR-Code enthält deine Tailscale-URL – funktioniert von überall. Falls Tailscale nicht aktiv ist, die lokale URL in der App manuell eingeben.',
      // Geräte-/App-Standorte
      device_locations: 'Mobile Nutzer', device_location_live: 'Live-Standort aus App',
      no_device_locations: 'Keine mobilen Nutzer online',
    },
    fr: {
      dashboard: 'Tableau de bord', map: 'Commande & Contrôle', incidents: 'Incidents',
      alerts: 'Alertes', chat: 'Communication', sensors: 'Capteurs',
      logs: 'Journaux', analytics: 'Analytique IA', fleet: 'Gestion de flotte',
      navigation: 'Navigation', users: 'Utilisateurs', modules: 'Modules', settings: 'Paramètres',
      login: 'Connexion', logout: 'Déconnexion', username: 'Identifiant', password: 'Mot de passe',
      save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', create: 'Créer',
      add: 'Ajouter', close: 'Fermer', confirm: 'Confirmer', search: 'Rechercher',
      loading: 'Chargement...', error: 'Erreur', success: 'Succès', warning: 'Avertissement',
      critical: 'Critique', info: 'Info', open: 'Ouvert', resolved: 'Résolu',
      in_progress: 'En cours', active: 'Actif', inactive: 'Inactif',
      available: 'Disponible', on_trip: 'En déplacement', maintenance: 'En maintenance',
      out_of_service: 'Hors service', acknowledge: 'Acquitter', ack_all: 'Tout acquitter',
      new_incident: 'Nouvel incident', new_alert: 'Nouvelle alerte', new_asset: 'Nouvel actif',
      new_vehicle: 'Nouveau véhicule', new_driver: 'Nouveau conducteur', new_trip: 'Nouveau trajet',
      new_maintenance: 'Nouvelle maintenance', add_fuel: 'Ajouter carburant',
      title: 'Titre', description: 'Description', severity: 'Sévérité', status: 'Statut',
      name: 'Nom', type: 'Type', location: 'Emplacement', date: 'Date',
      vehicle: 'Véhicule', driver: 'Conducteur', origin: 'Origine', destination: 'Destination',
      departure: 'Départ', arrival: 'Arrivée', distance: 'Distance',
      cost: 'Coût', liters: 'Litres', odometer: 'Kilométrage',
      license_plate: 'Plaque d\'immatriculation', vin: 'NIV', make: 'Marque', model: 'Modèle',
      year: 'Année', color: 'Couleur', seats: 'Sièges', fuel_type: 'Carburant',
      insurance_expiry: 'Expiration assurance', tuev_expiry: 'Contrôle technique',
      role: 'Rôle', owner: 'Propriétaire', admin: 'Administrateur', operator: 'Opérateur', viewer: 'Observateur',
      theme: 'Thème', language: 'Langue', online: 'En ligne', offline: 'Hors ligne',
      send: 'Envoyer', message: 'Message', rooms: 'Salles', direct_messages: 'Messages directs',
      navigate_to: 'Naviguer vers', start_navigation: 'Démarrer la navigation',
      recalculating: 'Recalcul...', arrived: 'Vous êtes arrivé!',
      turn_left: 'Tourner à gauche', turn_right: 'Tourner à droite', continue_straight: 'Continuer tout droit',
      by_car: 'En voiture', by_bike: 'À vélo', on_foot: 'À pied',
      eta: 'Heure d\'arrivée', total_distance: 'Distance totale',
      alert_tone: 'Tonalité d\'alerte', test_tone: 'Tester le son',
      export_csv: 'Exporter CSV', export_json: 'Exporter JSON',
      no_data: 'Aucune donnée disponible', refresh: 'Actualiser',
      enabled: 'Activé', disabled: 'Désactivé', toggle: 'Basculer',
      overview: 'Aperçu', details: 'Détails', history: 'Historique',
      fleet_stats: 'Statistiques de flotte', maintenance_due: 'Maintenance requise',
      pre_trip: 'Avant le trajet', post_trip: 'Après le trajet', inspection: 'Inspection',
      documents: 'Documents', fuel_log: 'Journal de carburant', trips: 'Trajets',
      drivers: 'Conducteurs', vehicles: 'Véhicules',
      anomalies: 'Anomalies', predictions: 'Prédictions', patterns: 'Modèles',
      org_name: 'Nom de l\'organisation', facility_type: 'Type d\'établissement',
      copyright: '© Felix Greis 2026',
      invalid_credentials: 'Identifiant ou mot de passe invalide',
      default_hint: '',
      pager: 'Passerelle Pager', scheduler: 'Planificateur',
      pager_rx: 'Réception (POCSAG)', pager_tx: 'Envoi (DAPNET)', pager_channels: 'Canaux Push',
      capcode: 'Capcode', rx_running: 'Récepteur actif', rx_stopped: 'Récepteur arrêté',
      start_rx: 'Démarrer récepteur', stop_rx: 'Arrêter récepteur',
      dapnet_config: 'Config DAPNET', ntfy_config: 'Config ntfy', apprise_config: 'Config Apprise',
      send_to_pager: 'Envoyer via DAPNET', pager_test_ok: 'Test OK', pager_test_fail: 'Test échoué',
      callsign: 'Indicatif', target_callsigns: 'Indicatifs cibles',
      transmitter_group: 'Groupe émetteur', ntfy_url: 'URL serveur ntfy',
      ntfy_topic: 'Sujet', ntfy_token: 'Jeton d\'accès',
      apprise_urls: 'URLs Apprise (une par ligne)', rx_frequency: 'Fréquence (MHz)',
      rx_gain: 'Gain', rx_filter_capcodes: 'Filtres Capcode (séparés par virgule)',
      rx_create_alerts: 'Créer alertes Atlas depuis réception',
      channels: 'Canaux actifs', webpush_status: 'Statut Web Push',
      scheduled: 'Éléments planifiés', new_scheduled: 'Nouvel élément planifié',
      recurrence: 'Récurrence', once: 'Une fois', daily: 'Quotidien', weekly: 'Hebdomadaire',
      hourly: 'Horaire', interval: 'Toutes les N minutes',
      next_run: 'Prochaine exécution', last_run: 'Dernière exécution', run_count: 'Exécutions',
      run_now: 'Exécuter maintenant', schedule_alert: 'Alerte planifiée', schedule_incident: 'Incident planifié',
      interval_minutes: 'Intervalle (minutes)',
      weather: 'Météo', weather_current: 'Météo actuelle', weather_forecast: 'Prévisions',
      temp: 'Température', humidity: 'Humidité', wind: 'Vitesse du vent', feels_like: 'Ressenti',
      calendar: 'Calendrier', new_event: 'Nouvel événement', vacation: 'Vacances', duty: 'Service', event: 'Événement',
      pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté',
      approve: 'Approuver', reject: 'Rejeter', all_day: 'Toute la journée',
      travel: 'Demandes de voyage', new_travel: 'Nouvelle demande',
      travel_type: 'Type de voyage', solo: 'Solo', with_crew: 'Avec équipage',
      passengers: 'Passagers', reviewer_notes: 'Notes du réviseur',
      accept_counteroffer: 'Accepter', reject_counteroffer: 'Refuser la contre-offre',
      permissions: 'Permissions', user_groups: 'Groupes d\'utilisateurs', new_group: 'Nouveau groupe',
      base_role: 'Rôle de base', dispatcher: 'Dispatcher', abteilleitung: 'Chef de département',
      can_delete_alerts: 'Supprimer alertes', can_ack_all: 'Acquitter tout',
      can_manage_users: 'Gérer utilisateurs', can_manage_fleet: 'Gérer flotte',
      can_view_logs: 'Voir journaux', can_send_pager: 'Envoyer pager',
      can_restart: 'Redémarrer serveur', can_backup: 'Créer sauvegarde',
      can_manage_calendar: 'Gérer calendrier', can_approve_travel: 'Approuver voyages',
      backup: 'Sauvegarde', restore: 'Restaurer', server_restart: 'Redémarrer serveur',
      pi_sensors: 'Capteurs Pi', cpu_temp: 'Température CPU', cpu_voltage: 'Tension CPU',
      map_layer: 'Couche de carte', map_osm: 'OpenStreetMap', map_satellite: 'Satellite',
      map_topo: 'Topographique', map_dark: 'Sombre', map_transport: 'Transport',
      map_water: 'Nautique / Eau',
      gotify_config: 'Config Gotify', gotify_url: 'URL Gotify', gotify_token: 'Token Gotify',
      gotify_priority: 'Priorité',
      flight_mode: 'Mode vol', boat_mode: 'Mode bateau / eau',
      route_options: 'Options d\'itinéraire', route_fastest: 'Plus rapide', route_shortest: 'Plus court', route_avoid_highways: 'Éviter autoroutes',
      fuel_capacity: 'Capacité réservoir (L)', fuel_current: 'Carburant actuel (L)', fuel_avg: 'Conso. moy. (L/100km)',
      fuel_range: 'Autonomie estimée', update_position: 'Mettre à jour position', complete_trip: 'Terminer le trajet',
      fuel_used: 'Carburant utilisé (L)', end_position: 'Position finale', completed_notes: 'Notes de fin',
      alarm_active: 'ALARME ACTIVE', dismiss_alarm: 'Acquitter',
      connect_mobile_app: 'Connecter l\'app mobile', scan_qr_code: 'Scannez ce QR code avec l\'app Atlas',
      qr_expires_in: 'QR code valable 60 minutes', qr_generating: 'Génération…',
      apns_config: 'Configuration APNs', apns_key_id: 'Key ID', apns_team_id: 'Team ID',
      apns_p8_key: 'Clé privée P8', apns_sandbox: 'Mode Sandbox (Développement)',
      apns_test: 'Envoyer push test',
      qr_tailscale_hint: 'Le QR code utilise votre URL Tailscale – accessible de partout. Si Tailscale n\'est pas actif, entrez manuellement l\'URL locale dans l\'app.',
      // Localisation des utilisateurs mobiles
      device_locations: 'Utilisateurs mobiles', device_location_live: 'Position en direct depuis l\'app',
      no_device_locations: 'Aucun utilisateur mobile en ligne',
      // --- Keys added for FR parity ---
      add_peer: 'Ajouter homologue', alarm_groups: 'Groupes d\'alarme',
      auto_discover: 'Découverte automatique', builtin: 'Intégré',
      call_sign: 'Indicatif', cat_authority: 'Autorités', cat_emergency: 'Urgences',
      cat_other: 'Autre', cat_staff: 'Personnel', cat_supplier: 'Fournisseur',
      category: 'Catégorie', click_map_infra: 'Cliquez sur la carte pour ajouter',
      contacts: 'Contacts', custom: 'Personnalisé', department: 'Service',
      deployed_vehicles: 'Véhicules déployés', dispatch_accept: 'Accepter',
      dispatch_decline: 'Refuser', dispatch_reason: 'Raison du refus',
      dispatch_request: 'Mission', dispatch_vehicle: 'Dispatcher un véhicule',
      emergency_broadcast: 'Diffusion d\'urgence', favorite: 'Favori',
      federation: 'Fédération', federation_api_key: 'Clé API fédération',
      fire_access: 'Accès pompiers', generate_report: 'Générer rapport',
      heatmap: 'Carte de chaleur', hydrants: 'Bornes incendie',
      incident_report: 'Rapport d\'incident', incident_trends: 'Tendances incidents',
      infra_scanner: 'Scanner infrastructure', infrastructure: 'Infrastructure',
      live_map: 'Carte en direct', new_contact: 'Nouveau contact',
      new_role: 'Nouveau rôle', nina_enabled: 'NINA activé',
      nina_last_check: 'Dernier contrôle NINA', nina_monitor: 'Surveillance NINA',
      nina_status: 'Statut NINA', nina_warnings: 'Alertes NINA',
      notes: 'Notes', organization: 'Organisation', phone: 'Téléphone',
      overpass_url: 'URL Overpass API', peer_api_key: 'Clé API homologue',
      peer_name: 'Nom homologue', peer_offline: 'Hors ligne',
      peer_online: 'En ligne', peer_status: 'Statut homologue',
      peer_unknown: 'Inconnu', peer_url: 'URL homologue',
      perm_admin: 'Administration', perm_analytics: 'Analytique',
      perm_create: 'Créer', perm_delete: 'Supprimer', perm_edit: 'Modifier',
      perm_fleet: 'Flotte', perm_pager: 'Pager', perm_read: 'Lire',
      predictive_dispatch: 'Dispatch prédictif', print_report: 'Imprimer rapport',
      ptt_hold: 'Maintenir pour parler', ptt_release: 'Relâcher',
      related_alerts: 'Alertes liées', report_chronology: 'Chronologie',
      resource_intelligence: 'Intelligence ressources',
      risk_days: 'Jours à risque', risk_hours: 'Heures à risque',
      role_description: 'Description du rôle', role_label: 'Nom du rôle',
      roles: 'Rôles', search_contacts: 'Rechercher contacts',
      location: 'Localisation', address_or_coords: 'Adresse ou coordonnées…',
      setup_admin: 'Compte administrateur', setup_complete_btn: 'Démarrer Atlas',
      setup_network: 'Réseau & sécurité', setup_org: 'Votre organisation',
      setup_server: 'Configuration du serveur', setup_subtitle: 'Configuration initiale',
      setup_welcome: 'Bienvenue dans ControlCenterHQ', suggest_vehicles: 'Suggérer des véhicules',
      sync_now: 'Synchroniser maintenant', tailscale_key: 'Clé Tailscale',
      timeline: 'Chronologie', timeline_alerts: 'Alertes', timeline_all: 'Tout',
      timeline_fleet: 'Flotte', timeline_incidents: 'Incidents',
      total_analyzed: 'Total analysé', trend_down: 'En baisse',
      trend_stable: 'Stable', trend_up: 'En hausse',
      trigger_emergency: 'Déclencher urgence', trip_count: 'Nombre de trajets',
      vehicle_dispatched: 'Véhicule dispatché',
      vehicle_utilization: 'Utilisation véhicule',
      voice_active: 'Actif', voice_channel: 'Canal vocal', voice_idle: 'Inactif',
      voice_joining: 'Connexion...', voice_leave: 'Quitter',
      voice_speaking: 'En train de parler',
    }
  },
  t(key) {
    return this.strings[this.lang]?.[key] || this.strings.en[key] || key;
  },
  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('atlas_lang', lang);
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('lang-' + lang);
    if (btn) btn.classList.add('active');
    ATLAS.ui.applyTranslations();
    if (ATLAS.state.currentPage) ATLAS.router.go(ATLAS.state.currentPage, true);
  }
},

/* ============================================================
   State
============================================================ */
state: {
  user: null,
  token: null,
  currentPage: null,
  modules: [],
  assets: [],
  incidents: [],
  alerts: [],
  sensors: [],
  onlineUsers: [],
  chatRooms: [],
  currentRoom: null,
  mapInstance: null,
  mapMarkers: {},
  fleetMapMarkers: {},
  charts: {},
  navRoute: null,
  navStep: 0,
  navWatchId: null,
  audioCtx: null,
},

/* ============================================================
   API
============================================================ */
api: {
  base: '',
  _loggingOut: false,
  async req(method, path, body) {
    const opts = {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(ATLAS.state.token ? { 'Authorization': `Bearer ${ATLAS.state.token}` } : {}),
        'Accept-Language': ATLAS.i18n.lang,
      }
    };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    // Only treat 401 as "session expired → logout" when a session token is
    // already set AND we are not on the login endpoint itself.
    // Previously every 401 (including wrong-password on /api/auth/login) triggered
    // doLogout() which cleared the form fields and swallowed the error message.
    const isLoginEndpoint = path === '/api/auth/login';
    if (res.status === 401 && !this._loggingOut && !isLoginEndpoint && ATLAS.state.token) {
      this._loggingOut = true;
      await ATLAS.auth.doLogout();
      this._loggingOut = false;
      return null;
    }
    if (res.status === 402) {
      // License required – show license gate (but don't throw for license endpoints)
      if (!path.startsWith('/api/license')) ATLAS.license.showGate();
      const err = await res.json().catch(() => ({ detail: 'Lizenz erforderlich' }));
      throw new Error(err.detail || 'Lizenz erforderlich');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(err.detail || 'Request failed');
    }
    if (res.status === 204) return null;
    return res.json();
  },
  get(path) { return this.req('GET', path); },
  post(path, body) { return this.req('POST', path, body); },
  put(path, body) { return this.req('PUT', path, body); },
  delete(path) { return this.req('DELETE', path); },
},

/* ============================================================
   Geocoding  (Nominatim / OpenStreetMap – no API key required)
============================================================ */
geo: {
  // Resolve address string OR "lat,lng" string → { lat, lng, display }
  // Returns null on failure.
  async resolve(query) {
    query = (query || '').trim();
    if (!query) return null;
    // Already coordinates? e.g. "51.1657, 10.4515" or "51.1657,10.4515"
    const coordRe = /^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/;
    const m = query.match(coordRe);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]), display: query };
    // Geocode via Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': ATLAS.i18n.lang } });
      const data = await res.json();
      if (!data.length) return null;
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
    } catch { return null; }
  },

  // Build the reusable address+coordinates widget HTML.
  // prefix: short id prefix (e.g. "na", "ni", "upd")
  // currentLat/Lng: optional pre-filled values
  widget(prefix, currentLat, currentLng) {
    const latVal = currentLat != null ? currentLat : '';
    const lngVal = currentLng != null ? currentLng : '';
    return `
      <div class="form-group" style="margin-bottom:4px;">
        <label class="form-label">📍 ${ATLAS.i18n.t('location') || 'Location'}</label>
        <div style="display:flex;gap:6px;">
          <input id="${prefix}-addr" class="form-input" placeholder="${ATLAS.i18n.t('address_or_coords') || 'Address or coordinates…'}" style="flex:1;">
          <button type="button" class="btn btn-secondary btn-sm" style="white-space:nowrap;" onclick="ATLAS.geo.resolveWidget('${prefix}')">🔍</button>
          <button type="button" class="btn btn-secondary btn-sm" style="white-space:nowrap;" title="GPS" onclick="ATLAS.geo.gpsWidget('${prefix}')">📡</button>
        </div>
        <div id="${prefix}-geo-status" style="font-size:11px;color:var(--text-muted);margin-top:3px;min-height:14px;"></div>
      </div>
      <div class="form-row" style="margin-top:4px;">
        <div class="form-group">
          <label class="form-label" style="font-size:11px;color:var(--text-muted);">Lat</label>
          <input id="${prefix}-lat" class="form-input" type="number" step="any" placeholder="51.1657" value="${latVal}">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size:11px;color:var(--text-muted);">Lng</label>
          <input id="${prefix}-lng" class="form-input" type="number" step="any" placeholder="10.4515" value="${lngVal}">
        </div>
      </div>`;
  },

  async resolveWidget(prefix) {
    const addrEl = document.getElementById(`${prefix}-addr`);
    const statusEl = document.getElementById(`${prefix}-geo-status`);
    if (!addrEl || !statusEl) return;
    const q = addrEl.value.trim();
    if (!q) return;
    statusEl.textContent = '⏳ Suche…';
    const result = await ATLAS.geo.resolve(q);
    if (!result) { statusEl.textContent = '❌ Nicht gefunden'; return; }
    const latEl = document.getElementById(`${prefix}-lat`);
    const lngEl = document.getElementById(`${prefix}-lng`);
    if (latEl) latEl.value = result.lat.toFixed(6);
    if (lngEl) lngEl.value = result.lng.toFixed(6);
    statusEl.textContent = `✅ ${result.lat.toFixed(5)}, ${result.lng.toFixed(5)}`;
    if (result.display && result.display !== q) addrEl.value = result.display.split(',').slice(0,3).join(',');
  },

  gpsWidget(prefix) {
    const statusEl = document.getElementById(`${prefix}-geo-status`);
    if (statusEl) statusEl.textContent = '📡 GPS…';
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const latEl = document.getElementById(`${prefix}-lat`);
        const lngEl = document.getElementById(`${prefix}-lng`);
        if (latEl) latEl.value = pos.coords.latitude.toFixed(6);
        if (lngEl) lngEl.value = pos.coords.longitude.toFixed(6);
        if (statusEl) statusEl.textContent = `✅ ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`;
      },
      err => { if (statusEl) statusEl.textContent = `❌ ${err.message}`; },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },
},

/* ============================================================
   WebSocket
============================================================ */
ws: {
  socket: null,
  handlers: {},
  pingInterval: null,

  connect() {
    if (this.socket) { this.socket.onclose = null; this.socket.close(); }
    clearInterval(this.pingInterval);
    if (!ATLAS.state.token) return;
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Pass token as query parameter instead of URL path to avoid it
    // appearing in server access logs as part of the request path.
    this.socket = new WebSocket(`${proto}//${location.host}/ws?token=${encodeURIComponent(ATLAS.state.token)}`);
    this.socket.onopen = () => {
      clearInterval(this.pingInterval);
      this.pingInterval = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN)
          this.socket.send(JSON.stringify({ type: 'ping' }));
      }, 30000);
    };
    this.socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg && typeof msg === 'object') ATLAS.ws.dispatch(msg);
      } catch(err) {
        console.warn('[WS] Invalid message:', err);
      }
    };
    this.socket.onerror = () => { /* onclose fires right after, handles reconnect */ };
    this.socket.onclose = () => {
      clearInterval(this.pingInterval);
      if (ATLAS.state.token) setTimeout(() => ATLAS.ws.connect(), 3000);
    };
  },

  on(type, handler) {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.handlers[type].push(handler);
  },

  dispatch(msg) {
    const { type, data } = msg;
    // Built-in handlers
    switch(type) {
      case 'alert_new':
        ATLAS.state.alerts.unshift(data);
        ATLAS.alerts.onNew(data);
        break;
      case 'alert_ack':
        ATLAS.alerts.onAck(data.id);
        break;
      case 'alerts_all_ack':
        ATLAS.state.alerts.forEach(a => a.acknowledged = 1);
        ATLAS.alerts.updateBanner();
        break;
      case 'asset_move':
        ATLAS.map.moveMarker(data.id, data.lat, data.lng);
        break;
      case 'asset_new':
        ATLAS.state.assets.push(data);
        ATLAS.map.addAssetMarker(data);
        break;
      case 'incident_new':
        ATLAS.state.incidents.unshift(data);
        break;
      case 'chat_message':
        ATLAS.chat.onMessage(data);
        break;
      case 'dm_message':
        ATLAS.chat.onDM(data);
        break;
      case 'sensor_reading':
        ATLAS.sensors.onReading(data);
        break;
      case 'user_online':
        if (!ATLAS.state.onlineUsers.includes(data.user_id))
          ATLAS.state.onlineUsers.push(data.user_id);
        ATLAS.ui.updateOnlineCount();
        break;
      case 'user_offline':
        ATLAS.state.onlineUsers = ATLAS.state.onlineUsers.filter(id => id !== data.user_id);
        ATLAS.ui.updateOnlineCount();
        break;
      case 'fleet_vehicle_move':
        ATLAS.fleet.moveVehicleMarker(data.id, data.lat, data.lng);
        break;
      case 'module_toggled':
        ATLAS.modules.onToggle(data);
        break;
      case 'pager_rx':
        if (ATLAS.state.currentPage === 'pager') ATLAS.pagerPage.onRxMessage(data);
        break;
      case 'scheduled_fired':
        ATLAS.ui.toast(`⏰ ${data.title}`, data.severity === 'critical' ? 'error' : data.severity === 'warning' ? 'warning' : 'info');
        if (ATLAS.state.currentPage === 'scheduler') ATLAS.schedulerPage.refresh();
        break;
      case 'alert_deleted':
        ATLAS.state.alerts = ATLAS.state.alerts.filter(a => a.id !== data.id);
        ATLAS.alerts.updateBanner();
        if (ATLAS.state.currentPage === 'alerts') ATLAS.alertsPage.render(document.getElementById('main-content'));
        break;
      case 'calendar_new':
        if (ATLAS.state.currentPage === 'calendar') ATLAS.calendarPage.load();
        break;
      case 'travel_new':
      case 'travel_update':
        if (ATLAS.state.currentPage === 'travel') ATLAS.travelPage.load();
        if (data.requester_id === ATLAS.state.user?.id)
          ATLAS.ui.toast(`✈️ Travel request ${data.status}`, data.status==='approved'?'success':'info');
        break;
      case 'fleet_position_update':
        if (ATLAS.state.currentPage === 'map' && ATLAS.map.fleetLayer) {
          // Refresh fleet layer marker
        }
        break;
      // Voice channel events
      case 'voice_status':
        ATLAS.voice.onStatus(data);
        break;
      case 'voice_ptt_start':
        ATLAS.voice.onPTTStart(data);
        break;
      case 'voice_ptt_stop':
        ATLAS.voice.onPTTStop(data);
        break;
      case 'voice_offer':
        ATLAS.voice.onOffer(msg);
        break;
      case 'voice_answer':
        ATLAS.voice.onAnswer(msg);
        break;
      case 'voice_ice':
        ATLAS.voice.onICE(msg);
        break;
      case 'emergency_broadcast':
        ATLAS.alerts.onEmergencyBroadcast(data);
        break;
      case 'vehicle_dispatched':
        if (ATLAS.state.currentPage === 'fleet') ATLAS.fleet.refresh();
        ATLAS.ui.toast(`🚨 ${data.vehicle_name}: ${data.message}`, 'error');
        break;
      case 'dispatch_request':
        ATLAS.fleet.onDispatchRequest(data);
        break;
      case 'dispatch_accepted':
        ATLAS.ui.toast(`✅ ${ATLAS.i18n.t('dispatch_accept')}: ${data.accepted_by}`, 'success');
        if (ATLAS.state.currentPage === 'fleet') ATLAS.fleet.refresh();
        break;
      case 'dispatch_declined':
        ATLAS.ui.toast(`❌ Abgelehnt: ${data.declined_by}${data.reason ? ' – ' + data.reason : ''}`, 'warning');
        if (ATLAS.state.currentPage === 'fleet') ATLAS.fleet.refresh();
        break;
      case 'device_location':
        ATLAS.map.updateUserMarker(data);
        break;
    }
    // Custom handlers
    (this.handlers[type] || []).forEach(h => h(data));
  },

  disconnect() {
    clearInterval(this.pingInterval);
    if (this.socket) { this.socket.onclose = null; this.socket.close(); }
  }
},

/* ============================================================
   License
============================================================ */
license: {
  _timer: null,
  _gateShown: false,

  async checkAndEnforce() {
    try {
      const status = await fetch('/api/license/check').then(r=>r.json()).catch(()=>null);
      if (!status) return;
      if (status.valid) { this._hideBanner(); return; }
      if (status.grace_active) {
        this._showGraceBanner(status.grace_remaining_seconds);
      } else {
        this.showGate();
      }
    } catch(e) { /* ignore */ }
  },

  _showGraceBanner(remainingSecs) {
    let existing = document.getElementById('license-grace-banner');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'license-grace-banner';
      existing.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.3);';
      existing.innerHTML = `<div>⚠️ <span id="grace-msg">Kein Lizenzkey – noch <span id="grace-timer">–</span> bis zur Sperrung</span></div>
        <button onclick="ATLAS.router.go('settings');ATLAS.license._hideBanner();" style="background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.5);color:#fff;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:12px;">🔑 Key eingeben</button>`;
      document.body.prepend(existing);
    }
    // Countdown timer
    let secs = remainingSecs;
    const tick = () => {
      const timerEl = document.getElementById('grace-timer');
      if (!timerEl) return;
      if (secs <= 0) { this.showGate(); return; }
      const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), s = secs%60;
      timerEl.textContent = h>0 ? `${h}h ${m}m` : m>0 ? `${m}m ${s}s` : `${s}s`;
      secs--;
    };
    tick();
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(tick, 1000);
  },

  _hideBanner() {
    const b = document.getElementById('license-grace-banner');
    if (b) b.remove();
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  },

  showGate() {
    if (this._gateShown) return;
    this._gateShown = true;
    // Full overlay – blocks everything
    let overlay = document.getElementById('license-gate-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'license-gate-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `<div style="background:var(--surface-1,#1a1a2e);border:1px solid var(--border,#333);border-radius:16px;padding:40px;max-width:480px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);">
      <div style="font-size:64px;margin-bottom:16px;">🔑</div>
      <div style="font-size:22px;font-weight:800;margin-bottom:8px;color:var(--text-primary,#fff);">Lizenz erforderlich</div>
      <p style="color:var(--text-muted,#888);font-size:14px;margin-bottom:24px;line-height:1.6;">
        Die Testphase ist abgelaufen.<br>Bitte geben Sie Ihren Lizenzkey ein, um ControlCenterHQ weiter nutzen zu können.
      </p>
      <div style="position:relative;margin-bottom:8px;">
        <input id="gate-key-input" type="text" placeholder="CCHQ-XXX-XXXX-XX-XXXXX" autocomplete="off"
          maxlength="26"
          style="width:100%;padding:12px 40px 12px 16px;border-radius:8px;border:1px solid var(--border,#444);background:var(--surface-2,#111);color:var(--text-primary,#fff);font-size:15px;margin-bottom:0;box-sizing:border-box;font-family:monospace;letter-spacing:1px;text-transform:uppercase;"
          oninput="ATLAS.license._formatGateKey(this)"
          onkeydown="if(event.key==='Enter')ATLAS.license.activateFromGate()">
        <span onclick="ATLAS.license._toggleGateKeyVis()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;user-select:none;">👁</span>
      </div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:12px;">Format: CCHQ-PRO-2026-FG-X7K9M</div>
      <div id="gate-error" style="color:#f87171;font-size:12px;margin-bottom:10px;min-height:16px;"></div>
      <button id="gate-activate-btn" onclick="ATLAS.license.activateFromGate()" style="width:100%;padding:13px;background:linear-gradient(135deg,#4caf7d,#2e7d52);border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;">✅ Lizenz aktivieren</button>
      <p style="margin-top:16px;font-size:11px;color:var(--text-muted,#666);">Kein Key? Wenden Sie sich an den Systemadministrator.</p>
    </div>`;
    document.body.appendChild(overlay);
    // Remove any previous banner
    this._hideBanner();
    setTimeout(()=>document.getElementById('gate-key-input')?.focus(), 100);
  },

  async activateFromGate() {
    const keyInput = document.getElementById('gate-key-input');
    const key = keyInput?.value.trim();
    const errEl = document.getElementById('gate-error');
    const btn = document.getElementById('gate-activate-btn');
    if (!key) { if(errEl) errEl.textContent = '⚠️ Bitte einen Lizenzkey eingeben.'; return; }
    if (errEl) errEl.textContent = '';
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Wird geprüft…'; }
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ATLAS.state.token ? { 'Authorization': `Bearer ${ATLAS.state.token}` } : {})
        },
        body: JSON.stringify({ key })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) {
        if (errEl) errEl.textContent = '❌ ' + (data.detail || 'Ungültiger Lizenzkey');
        return;
      }
      // Success – close gate
      document.getElementById('license-gate-overlay')?.remove();
      this._gateShown = false;
      this._hideBanner();
      ATLAS.ui.toast(`✅ Lizenz aktiviert: ${data.tier || ''}`, 'success');
    } catch(e) {
      if (errEl) errEl.textContent = '❌ ' + (e.message || 'Verbindungsfehler');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '✅ Lizenz aktivieren'; }
    }
  },

  _formatGateKey(input) {
    // Same format helper for gate modal: CCHQ-PRO-2026-FG-X7K9M
    const segLengths = [4, 3, 4, 2, 5];
    let raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let result = '';
    let pos = 0;
    for (let i = 0; i < segLengths.length && pos < raw.length; i++) {
      if (i > 0) result += '-';
      result += raw.substr(pos, segLengths[i]);
      pos += segLengths[i];
    }
    input.value = result;
  },

  _toggleGateKeyVis() {
    const inp = document.getElementById('gate-key-input');
    if (!inp) return;
    if (inp.dataset.hidden === 'true') {
      inp.style.webkitTextSecurity = '';
      inp.dataset.hidden = 'false';
    } else {
      inp.style.webkitTextSecurity = 'disc';
      inp.dataset.hidden = 'true';
    }
  },
},

/* ============================================================
   Auth
============================================================ */
auth: {
  async login() {
    const userVal = document.getElementById('login-user').value.trim();
    const passEl = document.getElementById('login-pass');
    const passVal = passEl ? passEl.value : '';
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');

    // Validation with specific messages
    if (!userVal) {
      err.textContent = ATLAS.i18n.lang === 'de' ? 'Benutzername eingeben' : 'Please enter your username';
      err.classList.remove('hidden');
      document.getElementById('login-user').focus();
      return;
    }
    if (!passVal) {
      err.textContent = ATLAS.i18n.lang === 'de' ? 'Passwort eingeben' : 'Please enter your password';
      err.classList.remove('hidden');
      if (passEl) passEl.focus();
      return;
    }

    btn.disabled = true;
    const btnText = document.getElementById('login-btn-text');
    if (btnText) btnText.textContent = ATLAS.i18n.t('loading');
    err.classList.add('hidden');

    try {
      // Use raw fetch so we can distinguish network errors from auth errors
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userVal, password: passVal }),
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        // 400 = wrong credentials, 429 = rate limited, etc.
        if (resp.status === 429) {
          err.textContent = ATLAS.i18n.lang === 'de'
            ? 'Zu viele Versuche. Bitte warte einen Moment.'
            : 'Too many attempts. Please wait a moment.';
        } else {
          err.textContent = ATLAS.i18n.t('invalid_credentials');
        }
        err.classList.remove('hidden');
        try { localStorage.removeItem('atlas_token'); } catch(_) {}
        ATLAS.state.token = null;
        return;
      }

      if (!data || !data.token || !data.user) {
        err.textContent = ATLAS.i18n.lang === 'de' ? 'Ungültige Serverantwort' : 'Invalid server response';
        err.classList.remove('hidden');
        return;
      }

      ATLAS.state.token = data.token;
      ATLAS.state.user = data.user;
      try { localStorage.setItem('atlas_token', data.token); } catch(_) {}
      try { localStorage.setItem('atlas_lang', data.user.language || ATLAS.i18n.lang); } catch(_) {}
      if (data.user.theme) ATLAS.ui.applyTheme(data.user.theme);
      if (data.user.language) ATLAS.i18n.lang = data.user.language;
      ATLAS.ws.connect();
      await ATLAS.boot();
    } catch(e) {
      // Network error
      err.textContent = ATLAS.i18n.lang === 'de'
        ? 'Verbindungsfehler. Server erreichbar?'
        : 'Connection error. Is the server running?';
      err.classList.remove('hidden');
      try { localStorage.removeItem('atlas_token'); } catch(_) {}
      ATLAS.state.token = null;
    } finally {
      btn.disabled = false;
      if (btnText) btnText.textContent = ATLAS.i18n.t('login');
    }
  },

  async tryAutoLogin() {
    let token;
    try { token = localStorage.getItem('atlas_token'); } catch(_) { return false; }
    if (!token) return false;

    // Set token temporarily so ATLAS.api.get sends Authorization header
    ATLAS.state.token = token;
    try {
      // Use raw fetch to avoid the api.req 401 → doLogout() chain which
      // would call showLoginScreen() – we handle that ourselves in init().
      const resp = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) {
        // Token invalid or expired – clean up silently
        try { localStorage.removeItem('atlas_token'); } catch(_) {}
        ATLAS.state.token = null;
        return false;
      }
      const user = await resp.json().catch(() => null);
      if (!user) {
        try { localStorage.removeItem('atlas_token'); } catch(_) {}
        ATLAS.state.token = null;
        return false;
      }
      ATLAS.state.user = user;
      if (user.theme) ATLAS.ui.applyTheme(user.theme);
      if (user.language) {
        ATLAS.i18n.lang = user.language;
        try { localStorage.setItem('atlas_lang', user.language); } catch(_) {}
      }
      ATLAS.ws.connect();
      await ATLAS.boot();
      return true;
    } catch {
      // Network error – clear token and show login
      try { localStorage.removeItem('atlas_token'); } catch(_) {}
      ATLAS.state.token = null;
      return false;
    }
  },

  async doLogout() {
    // Capture token before clearing so we can invalidate the session server-side
    const token = ATLAS.state.token;
    // Clear state FIRST so any subsequent API calls don't retry with the old token
    ATLAS.state.token = null;
    ATLAS.state.user = null;
    try { localStorage.removeItem('atlas_token'); } catch(_) {}
    // Tell the server to invalidate the session (best-effort, ignore errors)
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch(_) {}
    }
    ATLAS.ws.disconnect();
    ATLAS.auth.showLoginScreen(true);
  },

  showLoginScreen(clearFields = true) {
    const appShell = document.getElementById('app-shell');
    if (appShell) appShell.classList.add('hidden');
    const setupScreen = document.getElementById('setup-wizard-screen');
    if (setupScreen) setupScreen.style.display = 'none';

    // Re-inject the password field fresh each time – this prevents the browser
    // from ever seeing a <input type="password"> at page load (AutoFill trigger).
    const container = document.getElementById('login-pass-container');
    if (container) {
      container.innerHTML = '';
      const pw = document.createElement('input');
      pw.type = 'password';
      pw.id = 'login-pass';
      pw.className = 'form-input';
      pw.setAttribute('autocomplete', 'new-password');
      pw.setAttribute('autocorrect', 'off');
      pw.setAttribute('autocapitalize', 'off');
      pw.setAttribute('spellcheck', 'false');
      pw.placeholder = '••••••••';
      pw.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); ATLAS.auth.login(); }
      });
      container.appendChild(pw);
    }

    // Clear error message when showing login screen
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.classList.add('hidden');

    // Only clear fields on real logout/first-load – not after a failed login
    if (clearFields) {
      const userEl = document.getElementById('login-user');
      if (userEl) userEl.value = '';
    }

    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.remove('hidden');

    // Update login screen text with current language translations
    ATLAS.ui.applyTranslations();

    requestAnimationFrame(() => {
      const userEl = document.getElementById('login-user');
      const pw = document.getElementById('login-pass');
      if (userEl && userEl.value.trim() && pw) { pw.focus(); }
      else if (userEl) { userEl.focus(); }
    });
  }
},

/* ============================================================
   Boot
============================================================ */
async boot() {
  // Show app shell
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  // Load initial data in parallel – each call has its own .catch() so one
  // failing endpoint never prevents the whole boot from completing.
  const [modules, assets, incidents, alerts, sensors, rooms, info] = await Promise.all([
    ATLAS.api.get('/api/modules').catch(()=>null),
    ATLAS.api.get('/api/assets').catch(()=>null),
    ATLAS.api.get('/api/incidents').catch(()=>null),
    ATLAS.api.get('/api/alerts').catch(()=>null),
    ATLAS.api.get('/api/sensors').catch(()=>null),
    ATLAS.api.get('/api/chat/rooms').catch(()=>null),
    ATLAS.api.get('/api/info').catch(()=>null),
  ]);

  ATLAS.state.modules = modules || [];
  ATLAS.state.assets = assets || [];
  ATLAS.state.incidents = incidents || [];
  ATLAS.state.alerts = alerts || [];
  ATLAS.state.sensors = sensors || [];
  ATLAS.state.chatRooms = rooms || [];

  // Update UI
  const u = ATLAS.state.user;
  document.getElementById('user-avatar').textContent = ((u.full_name || u.username || '?')[0] || '?').toUpperCase();
  document.getElementById('sidebar-user-name').textContent = u.full_name || u.username;
  document.getElementById('sidebar-user-role').textContent = ATLAS.i18n.t(u.role);
  if (info) {
    document.getElementById('sidebar-org-name').textContent = info.org || 'ControlCenterHQ';
  }

  ATLAS.ui.buildNav();
  ATLAS.alerts.updateBanner();
  ATLAS.ui.applyTranslations();
  ATLAS.i18n.setLang(ATLAS.i18n.lang);

  // Register service worker for push notifications
  ATLAS.audio.init();

  // Init voice channel bar
  ATLAS.voice.initBar();

  // Init lockdown state + button visibility (owner-only)
  ATLAS.lockdown.init();

  // Init idle logout timer
  ATLAS.idleLogout.init();

  // Check license status and show gate if needed
  ATLAS.license.checkAndEnforce();

  // Check for available updates (admin only, non-blocking)
  ATLAS.updater.check().catch(() => {});

  // ── Push: re-sync existing subscription with server silently ──────────────
  // AtlasSW.register() runs on script load and calls _restoreSubscription()
  // which retrieves the PushManager subscription. Here we re-sync it with the
  // server so background push works after server restarts or token refresh.
  if (!ATLAS._pushSyncAttached) {
    ATLAS._pushSyncAttached = true;

    // Re-sync subscription if one already exists in PushManager
    (async () => {
      try {
        if (typeof AtlasSW === 'undefined' || !AtlasSW.supported) return;
        // Wait briefly for SW registration to complete if it hasn't yet
        if (!AtlasSW.registration) {
          await new Promise(r => setTimeout(r, 800));
        }
        if (!AtlasSW.registration) return;
        const sub = await AtlasSW.registration.pushManager.getSubscription();
        if (sub && ATLAS.state.token) {
          // Re-send subscription to server (idempotent upsert)
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ATLAS.state.token}`,
            },
            body: JSON.stringify(sub.toJSON()),
          }).catch(() => {});
        }
      } catch(e) { /* non-fatal */ }
    })();

    // Handle messages from service worker: ACK_ALERT, SYNC_ACKS
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', async (event) => {
        const msg = event.data || {};
        if (msg.type === 'ACK_ALERT' && msg.alertId && ATLAS.state.token) {
          // User tapped "Acknowledge" on push notification while app was open
          try {
            await ATLAS.api.post(`/api/alerts/${msg.alertId}/acknowledge`);
            // Update local state
            const al = ATLAS.state.alerts.find(a => a.id === msg.alertId);
            if (al) al.acknowledged = 1;
            ATLAS.alerts.updateBanner();
            ATLAS.ui.toast(`Alert #${msg.alertId} bestätigt`, 'success');
          } catch(e) {
            ATLAS.ui.toast(`Acknowledge fehlgeschlagen: ${e.message}`, 'error');
          }
        } else if (msg.type === 'SYNC_ACKS' && ATLAS.state.token) {
          // Background sync: re-check unacknowledged alerts
          try {
            const fresh = await ATLAS.api.get('/api/alerts');
            if (fresh) {
              ATLAS.state.alerts = fresh;
              ATLAS.alerts.updateBanner();
            }
          } catch(e) { /* non-fatal */ }
        }
      });
    }
  }

  // ── Handle ?ack=alertId URL param (SW opened app to ack) ─────────────────
  try {
    const urlAck = new URLSearchParams(location.search).get('ack');
    if (urlAck && ATLAS.state.token) {
      // Remove param from URL without reload
      const cleanUrl = location.pathname + location.hash;
      history.replaceState(null, '', cleanUrl);
      // Acknowledge after short delay to ensure boot is complete
      setTimeout(async () => {
        try {
          await ATLAS.api.post(`/api/alerts/${urlAck}/acknowledge`);
          const al = ATLAS.state.alerts.find(a => String(a.id) === String(urlAck));
          if (al) al.acknowledged = 1;
          ATLAS.alerts.updateBanner();
          ATLAS.ui.toast(`Alert #${urlAck} bestätigt`, 'success');
        } catch(e) { /* non-fatal */ }
      }, 500);
    }
  } catch(e) { /* non-fatal */ }

  // Navigate to dashboard
  ATLAS.router.go('dashboard');

  // Handle hash routing – guard ensures only ONE listener even if boot() re-runs
  if (!ATLAS._hashChangeAttached) {
    ATLAS._hashChangeAttached = true;
    window.addEventListener('hashchange', () => {
      const page = location.hash.replace('#/', '') || 'dashboard';
      ATLAS.router.go(page);
    });
  }
},

/* ============================================================
   Router
============================================================ */
router: {
  go(page, force) {
    if (ATLAS.state.currentPage === page && !force) return;

    // Clear any auto-refresh intervals from the previous page
    const _cleanable = [
      'healthPage','kpiChartsPage','predictionsPage','dashboard',
      'alertsPage','sensors','fleet','securityMonitor','activityHeatmap',
      'geofencingPage','federationPage','analyticsPage','analyticsExtPage'
    ];
    _cleanable.forEach(mod => {
      const m = ATLAS[mod];
      if (m && m._interval) { clearInterval(m._interval); m._interval = null; }
    });

    ATLAS.state.currentPage = page;
    location.hash = '#/' + page;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // Page title
    const titles = {
      dashboard: 'dashboard', map: 'map', incidents: 'incidents',
      alerts: 'alerts', chat: 'chat', sensors: 'sensors', logs: 'logs',
      analytics: 'analytics', fleet: 'fleet', navigation: 'navigation',
      users: 'users', modules: 'modules', settings: 'settings',
      pager: 'pager', scheduler: 'scheduler', weather: 'weather',
      calendar: 'calendar', travel: 'travel', contacts: 'contacts',
      roles: 'roles', predictive: 'predictive_dispatch', federation: 'federation',
      timeline: 'timeline', webhooks: 'Webhooks', security: 'Security Monitor',
      activity: 'Aktivitäts-Heatmap', geofencing: 'Geo-Fencing', compliance: 'Compliance Reports',
      backups: 'Encrypted Backups', health: 'Systemüberwachung', 'rate-limits': 'Rate Limit Analytics',
      predictions: 'KI Prognosen', 'fed-sync': 'Federation Sync', 'kpi-charts': 'Realtime KPI',
      'auto-reports': 'Auto Reports',
    };
    document.getElementById('page-title').textContent = ATLAS.i18n.t(titles[page] || page);

    // Render page
    const content = document.getElementById('main-content');
    content.innerHTML = '';

    switch(page) {
      case 'dashboard': ATLAS.dashboard.render(content); break;
      case 'map': ATLAS.map.render(content); break;
      case 'incidents': ATLAS.incidents.render(content); break;
      case 'alerts': ATLAS.alertsPage.render(content); break;
      case 'chat': ATLAS.chat.render(content); break;
      case 'sensors': ATLAS.sensors.render(content); break;
      case 'logs': ATLAS.logsPage.render(content); break;
      case 'analytics': ATLAS.analyticsPage.render(content); break;
      case 'fleet': ATLAS.fleet.render(content); break;
      case 'navigation': ATLAS.navigation.render(content); break;
      case 'users': ATLAS.usersPage.render(content); break;
      case 'modules': ATLAS.modulesPage.render(content); break;
      case 'settings': ATLAS.settingsPage.render(content); break;
      case 'pager': ATLAS.pagerPage.render(content); break;
      case 'scheduler': ATLAS.schedulerPage.render(content); break;
      case 'weather': ATLAS.weatherPage.render(content); break;
      case 'calendar': ATLAS.calendarPage.render(content); break;
      case 'travel': ATLAS.travelPage.render(content); break;
      case 'contacts': ATLAS.contactsPage.render(content); break;
      case 'roles': ATLAS.rolesPage.render(content); break;
      case 'predictive': ATLAS.predictivePage.render(content); break;
      case 'federation': ATLAS.federationPage.render(content); break;
      case 'timeline': ATLAS.timelinePage.render(content); break;
      case 'webhooks': ATLAS.webhooksPage.render(content); break;
      case 'security': ATLAS.securityMonitor.render(content); break;
      case 'activity': ATLAS.activityHeatmap.render(content); break;
      case 'geofencing': ATLAS.geofencingPage.render(content); break;
      case 'compliance': ATLAS.compliancePage.render(content); break;
      case 'backups': ATLAS.backupsPage.render(content); break;
      case 'admin-settings': ATLAS.adminSettingsPage.render(content); break;
      case 'health': ATLAS.healthPage.render(content); break;
      case 'rate-limits': ATLAS.rateLimitPage.render(content); break;
      case 'predictions': ATLAS.predictionsPage.render(content); break;
      case 'fed-sync': ATLAS.fedSyncPage.render(content); break;
      case 'kpi-charts': ATLAS.kpiChartsPage.render(content); break;
      case 'auto-reports': ATLAS.autoReportsPage.render(content); break;
      case 'inventory': ATLAS.inventoryPage.render(content); break;
      case 'knowledge': ATLAS.knowledgePage.render(content); break;
      case 'requests': ATLAS.requestsPage.render(content); break;
      case 'pi-manager': ATLAS.piManagerPage.render(content); break;
      case 'event-predictions': ATLAS.eventPredictionsPage.render(content); break;
      case 'remote-access': ATLAS.remoteAccessPage.render(content); break;
      case 'security-ai': ATLAS.securityAiPage.render(content); break;
      default: { const safe = document.createTextNode(page); const d = document.createElement('div'); d.style = 'padding:40px;text-align:center;color:var(--text-muted);'; d.append('Page not found: ', safe); content.appendChild(d); }
    }
  }
},

/* ============================================================
   UI Helpers
============================================================ */
ui: {
  /** Escape a value for safe insertion into innerHTML templates. */
  esc(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  buildNav() {
    const enabledModules = new Set(
      ATLAS.state.modules.filter(m => m.enabled).map(m => m.name)
    );
    const isAdmin = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'owner';

    const nav = [
      { id: 'dashboard', icon: '📊', label: 'dashboard', always: true },
      { id: 'map', icon: '🗺', label: 'map', module: 'command_control' },
      { id: 'incidents', icon: '⚠️', label: 'incidents', module: 'command_control' },
      { id: 'alerts', icon: '🔔', label: 'alerts', module: 'alert_system' },
      { id: 'chat', icon: '💬', label: 'chat', module: 'communication' },
      { id: 'sensors', icon: '📡', label: 'sensors', module: 'hardware_sensors' },
      { id: 'logs', icon: '📋', label: 'logs', module: 'data_logging' },
      { id: 'analytics', icon: '🧠', label: 'analytics', module: 'ai_analytics' },
      { id: 'fleet', icon: '🚗', label: 'fleet', module: 'fleet_management' },
      { id: 'navigation', icon: '🧭', label: 'navigation', module: 'navigation' },
      { id: 'pager', icon: '📟', label: 'pager', module: 'pager' },
      { id: 'scheduler', icon: '🕐', label: 'scheduler', module: 'scheduler' },
      { id: 'weather', icon: '🌤', label: 'weather', module: 'weather' },
      { id: 'calendar', icon: '📅', label: 'calendar', module: 'calendar' },
      { id: 'travel', icon: '✈️', label: 'travel', module: 'travel' },
      { id: 'contacts', icon: '📒', label: 'contacts', always: true },
      { id: 'timeline', icon: '📈', label: 'timeline', always: true },
      { id: 'predictive', icon: '🔮', label: 'predictive_dispatch', module: 'ai_analytics' },
      { id: 'federation', icon: '🌐', label: 'federation', always: true, adminOnly: true },
      { id: 'users', icon: '👥', label: 'users', module: 'user_management', adminOnly: true },
      { id: 'roles', icon: '🛡', label: 'roles', module: 'user_management', adminOnly: true },
      { id: 'webhooks', icon: '🔗', label: 'Webhooks', always: true, adminOnly: true },
      { id: 'security', icon: '🛡️', label: 'Security Monitor', always: true, adminOnly: true },
      { id: 'activity', icon: '📊', label: 'Aktivitäts-Heatmap', always: true, adminOnly: true },
      { id: 'geofencing', icon: '🗺️', label: 'Geo-Fencing', always: true, adminOnly: true },
      { id: 'compliance', icon: '📋', label: 'Compliance Reports', always: true, adminOnly: true },
      { id: 'backups', icon: '💾', label: 'Encrypted Backups', always: true, ownerOnly: true },
      { id: 'admin-settings', icon: '⚙️', label: 'System-Einstellungen', always: true, ownerOnly: true },
      { id: 'health', icon: '🖥️', label: 'Systemüberwachung', always: true, adminOnly: true },
      { id: 'rate-limits', icon: '⚡', label: 'Rate Limit Analytics', always: true, adminOnly: true },
      { id: 'predictions', icon: '🤖', label: 'KI Predictions', always: true, adminOnly: true },
      { id: 'fed-sync', icon: '🔄', label: 'Federation Sync', always: true, adminOnly: true },
      { id: 'kpi-charts', icon: '📈', label: 'Realtime KPI', always: true, adminOnly: true },
      { id: 'auto-reports', icon: '📄', label: 'Auto Reports', always: true, adminOnly: true },
      { id: 'inventory', icon: '📦', label: 'Lagerverwaltung', module: 'inventory' },
      { id: 'knowledge', icon: '📚', label: 'Wissensdatenbank', module: 'knowledge' },
      { id: 'requests', icon: '📋', label: 'Anfragen', module: 'requests' },
      { id: 'pi-manager', icon: '🍓', label: 'Pi-Netzwerk', module: 'pi_manager', adminOnly: true },
      { id: 'event-predictions', icon: '🔮', label: 'Ereignisvorhersage', module: 'event_predictions', adminOnly: true },
      { id: 'remote-access', icon: '🔒', label: 'Remote-Zugriff', module: 'remote_access', adminOnly: true },
      { id: 'security-ai', icon: '🧠', label: 'Sicherheits-KI', module: 'security_ai', adminOnly: true },
      { id: 'modules', icon: '🔧', label: 'modules', always: true, adminOnly: true },
      { id: 'settings', icon: '⚙️', label: 'settings', always: true },
    ];

    const menu = document.getElementById('nav-menu');
    menu.innerHTML = '';

    const isOwner = ATLAS.state.user && ATLAS.state.user.role === 'owner';
    nav.forEach(item => {
      if (item.adminOnly && !isAdmin) return;
      if (item.ownerOnly && !isOwner) return;
      if (item.module && !enabledModules.has(item.module)) return;
      const el = document.createElement('div');
      el.className = 'nav-item';
      el.dataset.page = item.id;
      el.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${ATLAS.i18n.t(item.label)}</span>`;
      el.onclick = () => ATLAS.router.go(item.id);
      menu.appendChild(el);
    });
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('atlas_theme', theme);
  },

  applyTranslations() {
    const t = ATLAS.i18n.t.bind(ATLAS.i18n);
    const el = id => document.getElementById(id);
    if (el('lbl-username')) el('lbl-username').textContent = t('username');
    if (el('lbl-password')) el('lbl-password').textContent = t('password');
    if (el('login-btn-text')) el('login-btn-text').textContent = t('login');
    if (el('login-hint')) el('login-hint').textContent = t('default_hint');
    if (el('sidebar-user-role') && ATLAS.state.user)
      el('sidebar-user-role').textContent = t(ATLAS.state.user.role);
    ATLAS.ui.buildNav();
    const cur = ATLAS.state.currentPage;
    if (el('page-title') && cur) el('page-title').textContent = t(cur);
  },

  updateOnlineCount() {
    const el = document.getElementById('online-count');
    if (el) el.textContent = ATLAS.state.onlineUsers.length || 1;
  },

  showThemePicker() {
    const themes = [
      { id: 'liquid-glass', name: 'Liquid Glass', emoji: '💎', colors: ['#1a1a2e','#16213e','#60a5fa'] },
      { id: 'liquid-glass-2', name: 'Liquid Glass 2.0', emoji: '🔮', colors: ['#08071a','#0d1128','#a78bfa'] },
      { id: 'cyberpunk', name: 'Cyberpunk', emoji: '⚡', colors: ['#050508','#0d0d20','#00ff88'] },
      { id: 'glass', name: 'Glassmorphism', emoji: '🌌', colors: ['#667eea','#764ba2','#ffffff'] },
      { id: 'apple', name: 'Apple', emoji: '🍎', colors: ['#f2f2f7','#ffffff','#007aff'] },
      { id: 'corporate', name: 'Corporate', emoji: '🏢', colors: ['#f5f7fa','#ffffff','#1d4ed8'] },
      { id: 'military', name: 'Military', emoji: '🪖', colors: ['#0a0f08','#161f12','#4a7c3f'] },
      { id: 'gold', name: 'Liquid Gold', emoji: '✨', colors: ['#0a0800','#1a1500','#ffd700'] },
      { id: 'arctic', name: 'Arctic White', emoji: '❄️', colors: ['#f8fbff','#ffffff','#0ea5e9'] },
      { id: 'sunset', name: 'Sunset', emoji: '🌅', colors: ['#1a0a00','#3d1a00','#ff6b35'] },
      { id: 'matrix', name: 'Matrix', emoji: '🟩', colors: ['#000000','#001a00','#00ff41'] },
      { id: 'royal', name: 'Royal Purple', emoji: '👑', colors: ['#0d001a','#220044','#c084fc'] },
      { id: 'fire', name: 'Fire Red', emoji: '🔥', colors: ['#0d0000','#220000','#ef4444'] },
      { id: 'fruehling', name: 'Frühling', emoji: '🌸', colors: ['#e8f5e9','#f3e5f5','#43a047'] },
      { id: 'sommer', name: 'Sommer', emoji: '☀️', colors: ['#fff8e1','#ffe0b2','#ff6f00'] },
      { id: 'herbst', name: 'Herbst', emoji: '🍂', colors: ['#3e2723','#5d4037','#ff7043'] },
      { id: 'winter', name: 'Winter', emoji: '🌨️', colors: ['#e3f2fd','#ede7f6','#3f51b5'] },
      { id: 'citrus', name: 'Citrus', emoji: '🍋', colors: ['#1a2a00','#1f3300','#c6ff00'] },
    ];

    const current = document.documentElement.getAttribute('data-theme') || 'liquid-glass';
    const groups = [
      { label: '🌑 Dark Themes', ids: ['liquid-glass','liquid-glass-2','cyberpunk','matrix','royal','fire','military','gold','sunset','herbst','citrus'] },
      { label: '☀️ Light Themes', ids: ['apple','corporate','arctic','glass','fruehling','sommer','winter'] },
    ];
    const themeMap = Object.fromEntries(themes.map(t => [t.id, t]));
    const body = `
      <style>
        .theme-grid-v2 { display:flex; flex-direction:column; gap:16px; }
        .theme-group-label { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px; }
        .theme-row { display:grid; grid-template-columns:repeat(auto-fill,minmax(90px,1fr)); gap:8px; }
        .theme-btn-v2 { display:flex; flex-direction:column; align-items:center; gap:5px; padding:8px 6px; border-radius:12px; cursor:pointer; border:2px solid transparent; transition:all .15s; background:var(--bg-secondary); }
        .theme-btn-v2:hover { border-color:var(--accent); transform:translateY(-2px); }
        .theme-btn-v2.active { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
        .theme-preview-v2 { width:56px; height:36px; border-radius:8px; overflow:hidden; position:relative; border:1px solid rgba(255,255,255,.15); }
        .theme-preview-v2-bar { position:absolute; bottom:0; left:0; right:0; height:10px; }
        .theme-name-v2 { font-size:10px; font-weight:600; color:var(--text-secondary); text-align:center; line-height:1.2; }
        .theme-emoji { font-size:18px; }
      </style>
      <div class="theme-grid-v2">
        ${groups.map(g => `
          <div>
            <div class="theme-group-label">${g.label}</div>
            <div class="theme-row">
              ${g.ids.filter(id => themeMap[id]).map(id => {
                const th = themeMap[id];
                return `<div class="theme-btn-v2 ${th.id === current ? 'active' : ''}"
                  onclick="ATLAS.ui.applyTheme('${th.id}');ATLAS.ui.closeModal();ATLAS.api.put('/api/auth/me',{theme:'${th.id}'})">
                  <div class="theme-preview-v2" style="background:linear-gradient(135deg,${th.colors[0]} 0%,${th.colors[1]} 100%);">
                    <div class="theme-preview-v2-bar" style="background:${th.colors[2]};opacity:.9;"></div>
                  </div>
                  <span class="theme-emoji">${th.emoji}</span>
                  <span class="theme-name-v2">${th.name}</span>
                </div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>`;
    ATLAS.ui.modal('🎨 ' + ATLAS.i18n.t('theme'), body);
  },

  showUserMenu() {
    const u = ATLAS.state.user;
    const body = `
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('language')}</label>
        <div style="display:flex;gap:8px;">
          <button class="lang-btn ${ATLAS.i18n.lang==='en'?'active':''}" onclick="ATLAS.i18n.setLang('en');ATLAS.api.put('/api/auth/me',{language:'en'})">🇬🇧 English</button>
          <button class="lang-btn ${ATLAS.i18n.lang==='de'?'active':''}" onclick="ATLAS.i18n.setLang('de');ATLAS.api.put('/api/auth/me',{language:'de'})">🇩🇪 Deutsch</button>
          <button class="lang-btn ${ATLAS.i18n.lang==='fr'?'active':''}" onclick="ATLAS.i18n.setLang('fr');ATLAS.api.put('/api/auth/me',{language:'fr'})">🇫🇷 Français</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('alert_tone')}</label>
        <select class="form-select" id="tone-select" onchange="ATLAS.api.put('/api/auth/me',{alert_tone:this.value})">
          ${ATLAS.audio.tones.map(t => `<option value="${t.id}" ${u.alert_tone===t.id?'selected':''}>${t.name}</option>`).join('')}
        </select>
        <button class="btn btn-secondary btn-sm mt-8" onclick="ATLAS.audio.test(document.getElementById('tone-select').value)">${ATLAS.i18n.t('test_tone')} ▶</button>
      </div>
      <div class="divider"></div>
      <button class="btn btn-danger w-full" onclick="ATLAS.auth.doLogout();ATLAS.ui.closeModal()">🚪 ${ATLAS.i18n.t('logout')}</button>
      <p style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:16px;">${ATLAS.i18n.t('copyright')}</p>
    `;
    ATLAS.ui.modal(`${u.full_name || u.username} (${u.role})`, body);
  },

  modal(title, body, footer, size) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = `
      <div class="modal ${size || ''}">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) ATLAS.ui.closeModal(); });
    document.getElementById('modal-container').appendChild(overlay);
  },

  closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
  },

  openPanel(title, body) {
    document.getElementById('panel-title').textContent = title;
    document.getElementById('panel-body').innerHTML = body;
    document.getElementById('detail-panel').classList.add('open');
  },

  closePanel() {
    document.getElementById('detail-panel').classList.remove('open');
  },

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  },

  closeSidebar() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  },

  toast(msg, type, title) {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', critical: '🚨' };
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type || 'info'}`;
    el.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-msg">${msg}</div>
      </div>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
    container.appendChild(el);
    el.onclick = () => el.classList.add('removing');
    setTimeout(() => { el.classList.add('removing'); setTimeout(() => el.remove(), 300); }, 5000);
  },

  formatDate(str) {
    if (!str) return '–';
    try { return new Date(str).toLocaleString(ATLAS.i18n.lang); } catch { return str; }
  },

  formatDateShort(str) {
    if (!str) return '–';
    try { return new Date(str).toLocaleDateString(ATLAS.i18n.lang); } catch { return str; }
  },

  severityBadge(sev) {
    const map = { critical: 'badge-danger', warning: 'badge-warning', info: 'badge-info' };
    return `<span class="badge ${map[sev] || 'badge-neutral'}">${ATLAS.i18n.t(sev)}</span>`;
  },

  statusBadge(status) {
    const map = { active: 'badge-success', available: 'badge-success', open: 'badge-danger',
                  in_progress: 'badge-warning', resolved: 'badge-neutral', on_trip: 'badge-info',
                  maintenance: 'badge-warning', out_of_service: 'badge-danger', standby: 'badge-neutral' };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${ATLAS.i18n.t(status) || status}</span>`;
  },

  vehicleIcon(type) {
    const icons = { car: '🚗', van: '🚐', bus: '🚌', aircraft: '✈️', jet: '🛩️',
                    ship: '🚢', boat: '⛵', truck: '🚛', motorcycle: '🏍️',
                    helicopter: '🚁', drone: '🚁' };
    return icons[type] || '🚗';
  },

  assetIcon(type) {
    const icons = { vehicle: '🚗', person: '👤', facility: '🏢', drone: '🚁', sensor: '📡', boat: '⛵' };
    return icons[type] || '📍';
  }
},

/* ============================================================
   Alerts logic
============================================================ */
alerts: {
  onNew(alert) {
    ATLAS.alerts.updateBanner();
    ATLAS.ui.toast(alert.message, alert.severity, ATLAS.i18n.t(alert.severity));
    if (alert.severity === 'critical') {
      ATLAS.audio.startAlarm(ATLAS.state.user?.alert_tone || 'emergency_siren');
    } else if (alert.severity === 'warning') {
      ATLAS.audio.play(ATLAS.state.user?.alert_tone || 'emergency_siren');
    }
    // Update badge
    const unack = ATLAS.state.alerts.filter(a => !a.acknowledged).length;
    const badge = document.getElementById('notif-badge');
    if (badge) { badge.textContent = unack; badge.classList.toggle('hidden', unack === 0); }
  },

  onAck(id) {
    const a = ATLAS.state.alerts.find(a => a.id === id);
    if (a) a.acknowledged = 1;
    // Stop alarm if no more critical unacknowledged alerts
    const stillCritical = ATLAS.state.alerts.some(al => !al.acknowledged && al.severity === 'critical');
    if (!stillCritical) ATLAS.audio.stopAlarm();
    ATLAS.alerts.updateBanner();
  },

  updateBanner() {
    const critical = ATLAS.state.alerts.filter(a => !a.acknowledged && a.severity === 'critical');
    const banner = document.getElementById('alert-banner');
    const badge = document.getElementById('notif-badge');
    const notifBtn = document.getElementById('notif-btn');
    const unack = ATLAS.state.alerts.filter(a => !a.acknowledged).length;
    if (banner) {
      if (critical.length > 0) {
        banner.classList.remove('hidden');
        document.getElementById('alert-banner-text').textContent =
          `${critical.length} ${ATLAS.i18n.t('critical')} alert${critical.length > 1 ? 's' : ''} – ${critical[0]?.message || ''}`;
      } else {
        banner.classList.add('hidden');
      }
    }
    if (badge) { badge.textContent = unack; badge.classList.toggle('hidden', unack === 0); }
  },

  onEmergencyBroadcast(data) {
    // Full-screen emergency overlay for NINA / manual max alert
    ATLAS.audio.startAlarm('air_raid');
    const existing = document.getElementById('emergency-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'emergency-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(200,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;animation:emergency-pulse 0.8s infinite alternate;';
    overlay.innerHTML = `
      <div style="font-size:72px;margin-bottom:16px;">🚨</div>
      <div style="font-size:32px;font-weight:900;letter-spacing:2px;margin-bottom:12px;">${data.title || 'NOTFALLALARM'}</div>
      <div style="font-size:18px;max-width:600px;margin-bottom:8px;opacity:0.9;">${data.message || ''}</div>
      <div style="font-size:13px;opacity:0.7;margin-bottom:32px;">Quelle: ${data.source || 'system'}</div>
      <button onclick="document.getElementById('emergency-overlay').remove();ATLAS.audio.stopAlarm();"
        style="background:#fff;color:#c00;border:none;padding:12px 32px;font-size:16px;font-weight:700;border-radius:8px;cursor:pointer;">
        ✓ Bestätigen &amp; Schließen
      </button>`;
    if (!document.getElementById('emergency-keyframes')) {
      const style = document.createElement('style');
      style.id = 'emergency-keyframes';
      style.textContent = '@keyframes emergency-pulse{from{background:rgba(200,0,0,0.92)}to{background:rgba(180,0,0,1)}}';
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
  }
},

/* ============================================================
   Audio System – 20 synthesized tones
============================================================ */
audio: {
  tones: [
    { id: 'emergency_siren', name: '🚨 Emergency Siren' },
    { id: 'police_horn', name: '🚔 Police Horn' },
    { id: 'fire_alarm', name: '🔥 Fire Alarm' },
    { id: 'air_raid', name: '✈️ Air Raid' },
    { id: 'nuclear_alert', name: '☢️ Nuclear Alert' },
    { id: 'digital_beep', name: '📟 Digital Beep' },
    { id: 'combat_alert', name: '🎯 Combat Alert' },
    { id: 'submarine_dive', name: '🚢 Submarine Dive' },
    { id: 'radar_ping', name: '📡 Radar Ping' },
    { id: 'military_bugle', name: '🎺 Military Bugle' },
    { id: 'morse_sos', name: '📶 Morse SOS' },
    { id: 'klaxon', name: '📢 Klaxon' },
    { id: 'chime', name: '🔔 Chime' },
    { id: 'electronic_warning', name: '⚡ Electronic Warning' },
    { id: 'factory_horn', name: '🏭 Factory Horn' },
    { id: 'ships_bell', name: '⚓ Ship\'s Bell' },
    { id: 'thunder_crack', name: '⛈️ Thunder Crack' },
    { id: 'helicopter', name: '🚁 Helicopter' },
    { id: 'laser_alarm', name: '🔴 Laser Alarm' },
    { id: 'custom_tone', name: '🎛️ Custom Tone' },
  ],

  init() {
    // AudioContext created on user interaction
  },

  getCtx() {
    if (!ATLAS.state.audioCtx) {
      ATLAS.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ATLAS.state.audioCtx.state === 'suspended') {
      ATLAS.state.audioCtx.resume();
    }
    return ATLAS.state.audioCtx;
  },

  _alarmInterval: null,
  _alarmToneId: null,

  test(toneId) {
    this.stopAlarm();
    this.play(toneId);
  },

  play(toneId) {
    try {
      const ctx = this.getCtx();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      this._playTone(ctx, gain, toneId);
    } catch(e) { console.warn('Audio play error:', e); }
  },

  startAlarm(toneId) {
    this.stopAlarm();
    this._alarmToneId = toneId;
    this.play(toneId);
    this._alarmInterval = setInterval(() => {
      if (this._alarmToneId) this.play(this._alarmToneId);
    }, 800);
    // Show dismissible alarm overlay
    let overlay = document.getElementById('alarm-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'alarm-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(220,0,0,0.92);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;font-size:18px;font-weight:700;letter-spacing:1px;animation:pulse-bg 1s infinite;';
      overlay.innerHTML = `<span>🚨 ${ATLAS.i18n.t('alarm_active')}</span><button onclick="ATLAS.audio.stopAlarm()" style="background:#fff;color:#c00;border:none;padding:6px 18px;border-radius:6px;font-weight:700;cursor:pointer;">${ATLAS.i18n.t('dismiss_alarm')}</button>`;
      document.body.prepend(overlay);
    }
  },

  stopAlarm() {
    if (this._alarmInterval) { clearInterval(this._alarmInterval); this._alarmInterval = null; }
    this._alarmToneId = null;
    const overlay = document.getElementById('alarm-overlay');
    if (overlay) overlay.remove();
  },

  _playTone(ctx, gain, id) {
    const t = ctx.currentTime;
    const osc = () => { const o = ctx.createOscillator(); o.connect(gain); return o; };

    switch(id) {
      case 'emergency_siren': {
        const o = osc(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(440, t);
        o.frequency.linearRampToValueAtTime(880, t+0.5);
        o.frequency.linearRampToValueAtTime(440, t+1);
        o.frequency.linearRampToValueAtTime(880, t+1.5);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.7, t+0.05);
        gain.gain.setValueAtTime(0.7, t+1.45); gain.gain.linearRampToValueAtTime(0, t+1.6);
        o.start(t); o.stop(t+1.6); break;
      }
      case 'police_horn': {
        [0,0.5].forEach(d => {
          const o = osc(); o.type = 'square'; o.frequency.value = d===0?640:480;
          gain.gain.setValueAtTime(0,t+d); gain.gain.linearRampToValueAtTime(0.6,t+d+0.05);
          gain.gain.setValueAtTime(0.6,t+d+0.35); gain.gain.linearRampToValueAtTime(0,t+d+0.45);
          o.start(t+d); o.stop(t+d+0.45);
        }); break;
      }
      case 'fire_alarm': {
        for(let i=0;i<6;i++) {
          const o = osc(); o.type = 'square'; o.frequency.value = 880;
          gain.gain.setValueAtTime(0,t+i*0.2); gain.gain.linearRampToValueAtTime(0.7,t+i*0.2+0.02);
          gain.gain.setValueAtTime(0.7,t+i*0.2+0.08); gain.gain.linearRampToValueAtTime(0,t+i*0.2+0.1);
          o.start(t+i*0.2); o.stop(t+i*0.2+0.1);
        } break;
      }
      case 'air_raid': {
        const o = osc(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(880, t);
        o.frequency.exponentialRampToValueAtTime(220, t+2);
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.7,t+0.1);
        gain.gain.setValueAtTime(0.7,t+1.8); gain.gain.linearRampToValueAtTime(0,t+2);
        o.start(t); o.stop(t+2); break;
      }
      case 'nuclear_alert': {
        const o = osc(); o.type = 'sine'; o.frequency.value = 1000;
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.9,t+0.1);
        gain.gain.setValueAtTime(0.9,t+1.5); gain.gain.linearRampToValueAtTime(0,t+2);
        o.start(t); o.stop(t+2); break;
      }
      case 'digital_beep': {
        [0,0.3,0.6].forEach(d => {
          const o = osc(); o.type = 'square'; o.frequency.value = 1200;
          gain.gain.setValueAtTime(0.6,t+d); gain.gain.setValueAtTime(0,t+d+0.15);
          o.start(t+d); o.stop(t+d+0.15);
        }); break;
      }
      case 'combat_alert': {
        [0,0.15,0.3,0.45,0.6].forEach(d => {
          const o = osc(); o.type = 'sawtooth'; o.frequency.value = d%0.3===0?800:600;
          gain.gain.setValueAtTime(0.6,t+d); gain.gain.setValueAtTime(0,t+d+0.1);
          o.start(t+d); o.stop(t+d+0.1);
        }); break;
      }
      case 'submarine_dive': {
        const o = osc(); o.type = 'sine';
        o.frequency.setValueAtTime(600, t);
        o.frequency.exponentialRampToValueAtTime(80, t+1.5);
        gain.gain.setValueAtTime(0.7,t); gain.gain.linearRampToValueAtTime(0,t+1.5);
        o.start(t); o.stop(t+1.5); break;
      }
      case 'radar_ping': {
        const o = osc(); o.type = 'sine'; o.frequency.value = 1500;
        gain.gain.setValueAtTime(0.5,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.6);
        o.start(t); o.stop(t+0.6); break;
      }
      case 'military_bugle': {
        const notes = [523,659,784,1047,784,659,523];
        notes.forEach((freq,i) => {
          const o = osc(); o.type = 'triangle'; o.frequency.value = freq;
          gain.gain.setValueAtTime(0.5,t+i*0.15); gain.gain.setValueAtTime(0,t+i*0.15+0.12);
          o.start(t+i*0.15); o.stop(t+i*0.15+0.12);
        }); break;
      }
      case 'morse_sos': {
        const pat=[0.1,0.1,0.1,0.3,0.3,0.3,0.1,0.1,0.1];
        let pos=t;
        pat.forEach(dur => {
          const o=osc(); o.type='sine'; o.frequency.value=700;
          gain.gain.setValueAtTime(0.6,pos); gain.gain.setValueAtTime(0,pos+dur*0.9);
          o.start(pos); o.stop(pos+dur);
          pos+=dur+0.05;
        }); break;
      }
      case 'klaxon': {
        const o = osc(); o.type = 'square';
        o.frequency.setValueAtTime(200, t);
        o.frequency.setValueAtTime(400, t+0.1);
        o.frequency.setValueAtTime(200, t+0.2);
        o.frequency.setValueAtTime(400, t+0.3);
        gain.gain.setValueAtTime(0.7,t); gain.gain.setValueAtTime(0,t+0.5);
        o.start(t); o.stop(t+0.5); break;
      }
      case 'chime': {
        [0,0.4,0.8].forEach((d,i) => {
          const o=osc(); o.type='sine'; o.frequency.value=[523,659,784][i];
          gain.gain.setValueAtTime(0.4,t+d); gain.gain.exponentialRampToValueAtTime(0.001,t+d+0.8);
          o.start(t+d); o.stop(t+d+0.8);
        }); break;
      }
      case 'electronic_warning': {
        const o = osc(); o.type = 'sawtooth';
        [0,0.2,0.4,0.6].forEach(d => o.frequency.setValueAtTime(d%0.4===0?400:600, t+d));
        gain.gain.setValueAtTime(0.5,t); gain.gain.setValueAtTime(0,t+0.8);
        o.start(t); o.stop(t+0.8); break;
      }
      case 'factory_horn': {
        const o = osc(); o.type = 'sawtooth'; o.frequency.value = 150;
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.8,t+0.1);
        gain.gain.setValueAtTime(0.8,t+0.8); gain.gain.linearRampToValueAtTime(0,t+1);
        o.start(t); o.stop(t+1); break;
      }
      case 'ships_bell': {
        [0,0.6].forEach(d => {
          const o=osc(); o.type='sine'; o.frequency.value=830;
          gain.gain.setValueAtTime(0.5,t+d); gain.gain.exponentialRampToValueAtTime(0.001,t+d+0.5);
          o.start(t+d); o.stop(t+d+0.5);
        }); break;
      }
      case 'thunder_crack': {
        const buf=ctx.createBuffer(1,ctx.sampleRate*0.5,ctx.sampleRate);
        const data=buf.getChannelData(0);
        for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/10000);
        const src=ctx.createBufferSource(); src.buffer=buf;
        src.connect(gain); gain.gain.value=0.8;
        src.start(t); break;
      }
      case 'helicopter': {
        const o=osc(); o.type='sawtooth'; o.frequency.value=12;
        const mod=ctx.createGain(); mod.gain.value=400;
        const car=osc(); car.type='sine'; car.frequency.value=200;
        o.connect(mod); mod.connect(car.frequency); car.connect(gain);
        gain.gain.setValueAtTime(0.5,t); gain.gain.setValueAtTime(0,t+1.5);
        o.start(t); car.start(t); o.stop(t+1.5); car.stop(t+1.5); break;
      }
      case 'laser_alarm': {
        const o=osc(); o.type='sine';
        o.frequency.setValueAtTime(2000,t); o.frequency.exponentialRampToValueAtTime(200,t+0.2);
        o.frequency.exponentialRampToValueAtTime(2000,t+0.4); o.frequency.exponentialRampToValueAtTime(200,t+0.6);
        gain.gain.setValueAtTime(0.6,t); gain.gain.setValueAtTime(0,t+0.65);
        o.start(t); o.stop(t+0.65); break;
      }
      default: { // custom_tone
        const o=osc(); o.type='sine'; o.frequency.value=440;
        gain.gain.setValueAtTime(0.5,t); gain.gain.linearRampToValueAtTime(0,t+0.5);
        o.start(t); o.stop(t+0.5);
      }
    }
  }
},

/* ============================================================
   Init
============================================================ */
async init() {
  // Apply saved theme
  let savedTheme = 'liquid-glass', savedLang = 'en';
  try {
    savedTheme = localStorage.getItem('atlas_theme') || 'liquid-glass';
    savedLang  = localStorage.getItem('atlas_lang')  || 'en';
  } catch(_) {}
  ATLAS.ui.applyTheme(savedTheme);
  ATLAS.i18n.lang = savedLang;

  // Register username Enter-key listener BEFORE any async work.
  // The password field listener is added inside showLoginScreen() since
  // the pw field is injected fresh each time to defeat browser AutoFill.
  document.getElementById('login-user').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pw = document.getElementById('login-pass');
      if (pw) pw.focus();
    }
  });

  // Check if first-time setup is needed
  try {
    const status = await fetch('/api/setup/status').then(r => r.json());
    if (status.setup_required) {
      ATLAS.setupWizard.show();
      return;
    }
  } catch {}

  // Try auto-login
  const ok = await ATLAS.auth.tryAutoLogin();
  if (!ok) {
    ATLAS.ui.applyTranslations();
    ATLAS.auth.showLoginScreen();
  }
}

}; // end ATLAS

/* ============================================================
   Dashboard Page
============================================================ */
ATLAS.dashboard = {
  charts: {},
  _kpiPrev: {},
  _wsRegistered: false,

  async render(el) {
    const kpiDefs = [
      { k: 'active_assets',   icon: '🎯', color: 'var(--accent)',   label: 'Active Assets' },
      { k: 'open_incidents',  icon: '⚠️',  color: 'var(--danger)',  label: 'Open Incidents' },
      { k: 'active_alerts',   icon: '🔔', color: 'var(--warning)',  label: 'Active Alerts' },
      { k: 'online_users',    icon: '👥', color: 'var(--success)',  label: 'Online Users' },
      { k: 'fleet_available', icon: '🚗', color: 'var(--info)',     label: 'Fleet Available' },
      { k: 'fleet_on_trip',   icon: '🛣️',  color: 'var(--accent)',  label: 'On Trip' },
    ];
    el.innerHTML = `
      <div class="kpi-grid" id="kpi-grid">
        ${kpiDefs.map(d => `
          <div class="kpi-card" style="cursor:default;" data-kpi="${d.k}">
            <div class="kpi-label">${d.label.toUpperCase()}</div>
            <div class="kpi-value kpi-animated" id="kpi-${d.k}" style="color:${d.color};">–</div>
            <div class="kpi-icon">${d.icon}</div>
            <div class="kpi-delta hidden" id="kpi-delta-${d.k}" style="font-size:11px;margin-top:2px;"></div>
          </div>`).join('')}
      </div>
      <div class="grid-2" style="margin-bottom:20px;">
        <div class="card">
          <div class="card-title">📈 Incident Trend <span style="font-size:11px;font-weight:400;color:var(--text-muted);">24h</span></div>
          <div class="chart-wrapper"><canvas id="chart-incidents"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">🔔 Alert Activity <span style="font-size:11px;font-weight:400;color:var(--text-muted);">12h</span></div>
          <div class="chart-wrapper"><canvas id="chart-alerts"></canvas></div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:20px;">
        <div class="card">
          <div class="card-title">🗺 Asset Distribution</div>
          <div class="chart-wrapper"><canvas id="chart-assets"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">📡 Sensor Overview <span style="font-size:11px;font-weight:400;color:var(--text-muted);">6h</span></div>
          <div class="chart-wrapper"><canvas id="chart-sensors"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">⚡ Recent Activity</div>
        <div id="activity-feed" style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;">
          <div style="color:var(--text-muted);text-align:center;padding:20px;">${ATLAS.i18n.t('loading')}</div>
        </div>
      </div>`;
    await this.loadKPIs();
    await this.loadCharts();
    await this.loadActivityFeed();
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('alert_new', () => { this.loadKPIs(); this.addActivityItem('🔔', 'New alert received', 'warning'); });
      ATLAS.ws.on('incident_new', d => { this.loadKPIs(); this.addActivityItem('⚠️', `Incident: ${d.title||'New incident'}`, 'info'); });
      ATLAS.ws.on('asset_new', d => this.addActivityItem('📍', `Asset added: ${d.name}`, 'info'));
    }
  },

  async loadKPIs() {
    const kpis = await ATLAS.api.get('/api/analytics/kpis');
    if (!kpis) return;
    Object.entries(kpis).forEach(([k,v]) => {
      const el = document.getElementById('kpi-'+k);
      const deltaEl = document.getElementById('kpi-delta-'+k);
      if (el) {
        const prev = this._kpiPrev[k];
        const num = typeof v === 'number' ? v : parseInt(v)||0;
        el.textContent = typeof v === 'string' && v.startsWith('€') ? v : num.toLocaleString();
        if (prev !== undefined && deltaEl) {
          const diff = num - prev;
          if (diff !== 0) {
            deltaEl.textContent = (diff > 0 ? '▲ +' : '▼ ') + diff;
            deltaEl.style.color = diff > 0 ? 'var(--danger)' : 'var(--success)';
            deltaEl.classList.remove('hidden');
          }
        }
        this._kpiPrev[k] = num;
        // Animate
        el.classList.remove('kpi-animated');
        void el.offsetWidth;
        el.classList.add('kpi-animated');
      }
    });
  },

  async loadActivityFeed() {
    const logs = await ATLAS.api.get('/api/audit?limit=8') || [];
    const feed = document.getElementById('activity-feed');
    if (!feed) return;
    const icons = { login: '🔑', logout: '🚪', create_incident: '⚠️', create_alert: '🔔', ack_alert: '✅', create_asset: '📍', toggle_module: '🔧' };
    if (!logs.length) { feed.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:16px;">${ATLAS.i18n.t('no_data')}</div>`; return; }
    feed.innerHTML = logs.map(l => {
      const ago = this.timeAgo(l.timestamp);
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);background:var(--bg-secondary);">
        <span style="font-size:16px;flex-shrink:0;">${icons[l.action]||'📋'}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${l.action.replace(/_/g,' ')}</div>
          <div style="font-size:11px;color:var(--text-muted);">${l.username||'system'} · ${ago}</div>
        </div>
      </div>`;
    }).join('');
  },

  addActivityItem(icon, text, type) {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);background:var(--bg-secondary);animation:fadeInDown 0.3s ease;';
    el.innerHTML = `<span style="font-size:16px;">${icon}</span><div style="flex:1;font-size:12px;font-weight:600;">${text}</div><div style="font-size:11px;color:var(--text-muted);">just now</div>`;
    feed.insertBefore(el, feed.firstChild);
    if (feed.children.length > 10) feed.removeChild(feed.lastChild);
  },

  timeAgo(ts) {
    const diff = Date.now() - new Date(ts).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return Math.floor(diff/86400000) + 'd ago';
  },

  async loadCharts() {
    if (typeof Chart === 'undefined') return;
    const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    Chart.defaults.color = css('--text-secondary') || '#aaa';
    const accent = css('--accent') || '#60a5fa';
    const danger = css('--danger') || '#f87171';
    const warning = css('--warning') || '#fbbf24';
    const success = css('--success') || '#34d399';
    const gridColor = 'rgba(128,128,128,0.08)';
    const axisColor = css('--text-muted') || '#666';

    const trends = await ATLAS.api.get('/api/analytics/trends?hours=24');
    if (!trends) return;

    const chartOpts = (extra={}) => ({
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { ticks: { maxTicksLimit: 8, color: axisColor, font: { size: 10 } }, grid: { color: gridColor } },
        y: { beginAtZero: true, ticks: { color: axisColor, font: { size: 10 } }, grid: { color: gridColor } }
      },
      ...extra
    });

    // Incident trend
    const incData = (trends.open_incidents || []).slice(-24);
    const incLabels = incData.map(d => new Date(d.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
    const incVals = incData.map(d => d.value);
    if (this.charts.incidents) this.charts.incidents.destroy();
    const ctx1 = document.getElementById('chart-incidents');
    if (ctx1) this.charts.incidents = new Chart(ctx1, {
      type: 'line',
      data: { labels: incLabels, datasets: [{ label: 'Open Incidents', data: incVals, borderColor: danger, backgroundColor: danger+'22', tension: 0.4, fill: true, pointRadius: 2, pointHoverRadius: 4 }] },
      options: chartOpts()
    });

    // Alerts bar
    const alData = (trends.active_alerts || []).slice(-12);
    const alLabels = alData.map(d => new Date(d.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
    const alVals = alData.map(d => d.value);
    if (this.charts.alerts) this.charts.alerts.destroy();
    const ctx2 = document.getElementById('chart-alerts');
    if (ctx2) this.charts.alerts = new Chart(ctx2, {
      type: 'bar',
      data: { labels: alLabels, datasets: [{ label: 'Active Alerts', data: alVals, backgroundColor: warning+'99', borderColor: warning, borderWidth: 1, borderRadius: 3 }] },
      options: chartOpts({ scales: { x: { ticks: { maxTicksLimit: 8, color: axisColor, font: { size: 10 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: axisColor, font: { size: 10 } }, grid: { color: gridColor } } } })
    });

    // Asset doughnut
    const byStatus = {};
    ATLAS.state.assets.forEach(a => { byStatus[a.status] = (byStatus[a.status]||0)+1; });
    if (this.charts.assets) this.charts.assets.destroy();
    const ctx3 = document.getElementById('chart-assets');
    if (ctx3) this.charts.assets = new Chart(ctx3, {
      type: 'doughnut',
      data: { labels: Object.keys(byStatus), datasets: [{ data: Object.values(byStatus), backgroundColor: [accent+'cc', warning+'cc', danger+'cc', success+'cc', '#888cc'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: axisColor, font: { size: 11 }, padding: 12, usePointStyle: true } }, tooltip: { mode: 'index' } }, cutout: '65%' }
    });

    // Sensor line
    const sensors = ATLAS.state.sensors.slice(0,3);
    const sColors = [accent, warning, danger];
    const ctx4 = document.getElementById('chart-sensors');
    if (ctx4 && sensors.length > 0) {
      const histories = await Promise.all(sensors.map(s => ATLAS.api.get(`/api/sensors/${s.id}/history?hours=6`)));
      const sLabels = (histories[0]||[]).slice(-30).map(r => new Date(r.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
      if (this.charts.sensors) this.charts.sensors.destroy();
      this.charts.sensors = new Chart(ctx4, {
        type: 'line',
        data: { labels: sLabels, datasets: sensors.map((s,i) => ({ label: s.name, data: (histories[i]||[]).slice(-30).map(r => r.value), borderColor: sColors[i], backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, pointHoverRadius: 3, borderWidth: 2 })) },
        options: chartOpts({ plugins: { legend: { display: true, position: 'bottom', labels: { color: axisColor, font: { size: 11 }, usePointStyle: true } }, tooltip: { mode: 'index', intersect: false } } })
      });
    }
  }
};


/* ============================================================
   Map Page (Command & Control)
============================================================ */
// Shared tile layer definitions used by Map, Navigation, and Fleet map
ATLAS._tileLayers = {
  osm:       { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr: '© OpenStreetMap contributors' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© Esri, Maxar, GeoEye' },
  topo:      { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '© OpenTopoMap' },
  dark:      { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attr: '© CARTO' },
  transport: { url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=', attr: '© Thunderforest' },
  water:     { url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', attr: '© OpenSeaMap' },
};
ATLAS._createTileLayer = function(layerId) {
  const def = ATLAS._tileLayers[layerId] || ATLAS._tileLayers.osm;
  return L.tileLayer(def.url, { attribution: def.attr, maxZoom: 19 });
};
ATLAS._switchTileLayer = function(mapInstance, newLayerId, currentLayerRef) {
  if (currentLayerRef.layer) mapInstance.removeLayer(currentLayerRef.layer);
  currentLayerRef.layer = ATLAS._createTileLayer(newLayerId);
  currentLayerRef.layer.addTo(mapInstance);
  return currentLayerRef;
};

ATLAS.map = {
  instance: null,
  markers: {},
  incidentMarkers: {},
  fleetLayer: null,
  userMarkers: {},   // keyed by user_id – live positions from iOS/Android app
  _tileLayerRef: { layer: null },
  _currentLayer: 'osm',

  render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>${t('map')}</h1>
        <div class="actions">
          <select class="form-select" style="width:auto;padding:4px 8px;font-size:13px;" onchange="ATLAS.map.switchLayer(this.value)" title="${t('map_layer')}">
            <option value="osm">${t('map_osm')}</option>
            <option value="satellite">${t('map_satellite')}</option>
            <option value="topo">${t('map_topo')}</option>
            <option value="dark">${t('map_dark')}</option>
            <option value="water">⚓ ${t('map_water')}</option>
          </select>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.map.toggleFleetLayer()">🚗 Fleet Layer</button>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.incidents.showCreate()">+ ${t('new_incident')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.map.showAddAsset()">+ ${t('new_asset')}</button>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:16px;">
        ${[['active_assets','🎯','–'],['open_incidents','⚠️','–'],['active_alerts','🔔','–']].map(([k,icon,v])=>`
          <div class="kpi-card" style="padding:12px 16px;">
            <div class="kpi-label">${k.replace(/_/g,' ').toUpperCase()}</div>
            <div class="kpi-value" id="map-kpi-${k}" style="font-size:24px;">–</div>
            <div class="kpi-icon">${icon}</div>
          </div>`).join('')}
        <div class="kpi-card" style="padding:12px 16px;">
          <div class="kpi-label">ASSETS</div>
          <div class="kpi-value" style="font-size:24px;">${ATLAS.state.assets.length}</div>
          <div class="kpi-icon">📍</div>
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        <div id="main-map" style="height:520px;"></div>
      </div>
      <div class="grid-2" style="margin-top:16px;">
        <div class="card">
          <div class="card-title">📍 Assets</div>
          <div class="list-scroll" id="asset-list-sidebar"></div>
        </div>
        <div class="card">
          <div class="card-title">⚠️ Active Incidents</div>
          <div class="list-scroll" id="incident-list-sidebar"></div>
        </div>
      </div>`;

    setTimeout(() => this.initMap(), 50);
    this.loadMapKPIs();
  },

  async loadMapKPIs() {
    const kpis = await ATLAS.api.get('/api/analytics/kpis');
    if (!kpis) return;
    ['active_assets','open_incidents','active_alerts'].forEach(k => {
      const el = document.getElementById('map-kpi-'+k);
      if (el) el.textContent = kpis[k] ?? '–';
    });
  },

  initMap() {
    if (!window.L) { setTimeout(() => this.initMap(), 200); return; }
    const mapEl = document.getElementById('main-map');
    if (!mapEl) return;
    // If instance exists but container was re-created (page reload), destroy old map
    if (this.instance) {
      if (mapEl._leaflet_id) { this.instance.invalidateSize(); return; }
      try { this.instance.remove(); } catch(e) {}
      this.instance = null;
      this.markers = {};
    }

    this.instance = L.map('main-map').setView([51.1657, 10.4515], 6);
    this._tileLayerRef.layer = ATLAS._createTileLayer(this._currentLayer);
    this._tileLayerRef.layer.addTo(this.instance);

    ATLAS.state.assets = ATLAS.state.assets || [];
    ATLAS.state.assets.forEach(a => this.addAssetMarker(a));
    ATLAS.state.incidents.filter(i => i.lat && i.lng && i.status !== 'resolved').forEach(i => this.addIncidentMarker(i));

    this.renderAssetList();
    this.renderIncidentList();
    ATLAS.state.mapInstance = this.instance;
    // Attach infrastructure scanner
    ATLAS.infraScanner.attach(this.instance);
    // Load live device positions from mobile app users
    this.loadDeviceLocations();
  },

  addAssetMarker(asset) {
    if (!this.instance || !asset.lat || !asset.lng) return;
    const icon = L.divIcon({
      html: `<div style="background:var(--accent);border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.4);">${ATLAS.ui.assetIcon(asset.type)}</div>`,
      iconSize: [28,28], iconAnchor: [14,14], className: ''
    });
    const marker = L.marker([asset.lat, asset.lng], { icon })
      .addTo(this.instance)
      .bindPopup(`<b>${asset.name}</b><br>${ATLAS.ui.assetIcon(asset.type)} ${asset.type}<br><span style="color:${asset.status==='active'?'green':'orange'}">${asset.status}</span>`);
    marker.on('click', () => ATLAS.map.showAssetDetail(asset));
    this.markers[asset.id] = marker;
  },

  addIncidentMarker(incident) {
    if (!this.instance || !incident.lat || !incident.lng) return;
    const colors = { critical: '#ef4444', warning: '#fbbf24', info: '#60a5fa' };
    const icon = L.divIcon({
      html: `<div style="background:${colors[incident.severity]||'#fbbf24'};border:2px solid white;border-radius:4px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.5);">⚠</div>`,
      iconSize: [24,24], iconAnchor: [12,12], className: ''
    });
    L.marker([incident.lat, incident.lng], { icon })
      .addTo(this.instance)
      .bindPopup(`<b>${incident.title}</b><br>${incident.severity} – ${incident.status}`);
    this.incidentMarkers[incident.id] = true;
  },

  moveMarker(id, lat, lng) {
    if (this.markers[id]) this.markers[id].setLatLng([lat, lng]);
  },

  /** Load latest GPS positions for all mobile app users and place them on the map. */
  async loadDeviceLocations() {
    if (!this.instance) return;
    const locs = await ATLAS.api.get('/api/device/locations');
    if (!Array.isArray(locs)) return;
    locs.forEach(loc => this.updateUserMarker(loc));
  },

  /** Create or update a user location marker (called on initial load and WS events). */
  updateUserMarker(data) {
    if (!this.instance || !data.lat || !data.lng) return;
    const label = data.full_name || data.username || '?';
    const initials = (label[0] || '?').toUpperCase();
    const existing = this.userMarkers[data.user_id];
    if (existing) {
      existing.setLatLng([data.lat, data.lng]);
      existing.setPopupContent(
        `<b>📱 ${label}</b><br>${ATLAS.i18n.t('role') || 'Role'}: ${data.role || '–'}<br>` +
        `${data.speed_ms != null ? '🚀 ' + (data.speed_ms * 3.6).toFixed(1) + ' km/h<br>' : ''}` +
        `<small style="color:#888;">${data.recorded_at ? new Date(data.recorded_at).toLocaleTimeString() : ''}</small>`
      );
    } else {
      const icon = L.divIcon({
        html: `<div style="background:#0ea5e9;border:2px solid white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.5);">${initials}</div>`,
        iconSize: [30, 30], iconAnchor: [15, 15], className: ''
      });
      const marker = L.marker([data.lat, data.lng], { icon })
        .addTo(this.instance)
        .bindPopup(
          `<b>📱 ${label}</b><br>${ATLAS.i18n.t('role') || 'Role'}: ${data.role || '–'}<br>` +
          `${data.speed_ms != null ? '🚀 ' + (data.speed_ms * 3.6).toFixed(1) + ' km/h<br>' : ''}` +
          `<small style="color:#888;">${data.recorded_at ? new Date(data.recorded_at).toLocaleTimeString() : ''}</small>`
        );
      this.userMarkers[data.user_id] = marker;
    }
  },

  switchLayer(layerId) {
    this._currentLayer = layerId;
    if (!this.instance) return;
    if (layerId === 'water') {
      // Water/seamark is a transparent overlay — use OSM as base + seamark on top
      ATLAS._switchTileLayer(this.instance, 'osm', this._tileLayerRef);
      if (this._waterOverlay) { try { this.instance.removeLayer(this._waterOverlay); } catch(e) {} }
      this._waterOverlay = ATLAS._createTileLayer('water');
      this._waterOverlay.addTo(this.instance);
    } else {
      if (this._waterOverlay) {
        try { this.instance.removeLayer(this._waterOverlay); } catch(e) {}
        this._waterOverlay = null;
      }
      ATLAS._switchTileLayer(this.instance, layerId, this._tileLayerRef);
    }
  },

  toggleFleetLayer() {
    if (!this.instance) return;
    if (this.fleetLayer) {
      this.fleetLayer.clearLayers();
      this.fleetLayer = null;
      ATLAS.ui.toast('Fleet layer hidden', 'info');
      return;
    }
    this.fleetLayer = L.layerGroup().addTo(this.instance);
    ATLAS.api.get('/api/fleet/vehicles').then(vehicles => {
      if (!vehicles) return;
      vehicles.forEach(v => {
        if (!v.lat || !v.lng) return;
        const icon = L.divIcon({
          html: `<div style="background:#8b5cf6;border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.4);">${ATLAS.ui.vehicleIcon(v.type)}</div>`,
          iconSize: [28,28], iconAnchor: [14,14], className: ''
        });
        const make = v.make || '';
        const model = v.model || '';
        const status = v.status || '–';
        L.marker([v.lat, v.lng], { icon }).addTo(this.fleetLayer)
          .bindPopup(`<b>${ATLAS.ui.esc(v.name)}</b><br>${make} ${model}<br>${status}`);
        ATLAS.state.fleetMapMarkers = ATLAS.state.fleetMapMarkers || {};
        ATLAS.state.fleetMapMarkers[v.id] = null;
      });
    }).catch(err => ATLAS.ui.toast('Fleet layer error: ' + err.message, 'error'));
  },

  renderAssetList() {
    const el = document.getElementById('asset-list-sidebar');
    if (!el) return;
    el.innerHTML = ATLAS.state.assets.map(a => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background=''" onclick="ATLAS.map.flyTo(${a.lat},${a.lng})">
        <span style="font-size:20px;">${ATLAS.ui.assetIcon(a.type)}</span>
        <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;">${a.name}</div><div style="font-size:11px;color:var(--text-muted);">${a.type}</div></div>
        ${ATLAS.ui.statusBadge(a.status)}
      </div>`).join('') || `<div style="color:var(--text-muted);padding:12px;text-align:center;">${ATLAS.i18n.t('no_data')}</div>`;
  },

  renderIncidentList() {
    const el = document.getElementById('incident-list-sidebar');
    if (!el) return;
    const open = ATLAS.state.incidents.filter(i => i.status !== 'resolved');
    el.innerHTML = open.map(i => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);cursor:pointer;" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background=''" onclick="ATLAS.map.flyTo(${i.lat||51.16},${i.lng||10.45})">
        <span>${ATLAS.ui.severityBadge(i.severity)}</span>
        <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ATLAS.ui.esc(i.title)}</div><div style="font-size:11px;color:var(--text-muted);">${ATLAS.ui.formatDate(i.created_at)}</div></div>
      </div>`).join('') || `<div style="color:var(--text-muted);padding:12px;text-align:center;">No open incidents</div>`;
  },

  flyTo(lat, lng) {
    if (this.instance && lat && lng) this.instance.flyTo([lat, lng], 13, { duration: 1.5 });
  },

  showAssetDetail(asset) {
    ATLAS.ui.openPanel(asset.name, `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <span style="font-size:36px;">${ATLAS.ui.assetIcon(asset.type)}</span>
        <div><div style="font-size:18px;font-weight:700;">${asset.name}</div><div style="color:var(--text-muted);">${asset.type}</div></div>
      </div>
      ${ATLAS.ui.statusBadge(asset.status)}
      <div class="divider"></div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:var(--text-muted);">Lat</span><span>${asset.lat?.toFixed(4)||'–'}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:var(--text-muted);">Lng</span><span>${asset.lng?.toFixed(4)||'–'}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:var(--text-muted);">Updated</span><span>${ATLAS.ui.formatDate(asset.updated_at)}</span></div>
        ${asset.description?`<div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${asset.description}</div>`:''}
      </div>
    `);
  },

  showAddAsset() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_asset'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="na-name" class="form-input" placeholder="Asset name"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('type')}</label>
          <select id="na-type" class="form-select"><option value="vehicle">Vehicle</option><option value="person">Person</option><option value="facility">Facility</option><option value="drone">Drone</option><option value="sensor">Sensor</option></select>
        </div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="na-status" class="form-select"><option value="active">Active</option><option value="standby">Standby</option><option value="inactive">Inactive</option></select>
        </div>
      </div>
      ${ATLAS.geo.widget('na')}
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><textarea id="na-desc" class="form-textarea"></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.map.createAsset()">+ ${ATLAS.i18n.t('create')}</button>`
    );
  },

  async createAsset() {
    const name = document.getElementById('na-name').value.trim();
    if (!name) return;
    try {
      await ATLAS.api.post('/api/assets', {
        name, type: document.getElementById('na-type').value,
        status: document.getElementById('na-status').value,
        lat: parseFloat(document.getElementById('na-lat').value)||null,
        lng: parseFloat(document.getElementById('na-lng').value)||null,
        description: document.getElementById('na-desc').value
      });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(`Asset "${name}" created`, 'success');
      ATLAS.map.renderAssetList();
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to create asset', 'warning'); }
  }
};


/* ============================================================
   Incidents Page
============================================================ */
ATLAS.incidents = {
  _all: [],
  _wsRegistered: false,

  async render(el) {
    const incidents = await ATLAS.api.get('/api/incidents') || [];
    ATLAS.state.incidents = incidents;
    this._all = incidents;

    const openCount = incidents.filter(i => i.status === 'open').length;
    const critCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('incidents')}</h1>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.exportCSV()">⬇ CSV</button>
          <button class="btn btn-primary" onclick="ATLAS.incidents.showCreate()">+ ${ATLAS.i18n.t('new_incident')}</button>
        </div>
      </div>
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-status').value='open';ATLAS.incidents.filter()">
          <div class="kpi-label">OPEN</div><div class="kpi-value" style="font-size:22px;color:var(--danger);">${openCount}</div><div class="kpi-icon">🔓</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-status').value='in_progress';ATLAS.incidents.filter()">
          <div class="kpi-label">IN PROGRESS</div><div class="kpi-value" style="font-size:22px;color:var(--warning);">${incidents.filter(i=>i.status==='in_progress').length}</div><div class="kpi-icon">🔄</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-sev').value='critical';ATLAS.incidents.filter()">
          <div class="kpi-label">CRITICAL</div><div class="kpi-value" style="font-size:22px;color:var(--danger);">${critCount}</div><div class="kpi-icon">🚨</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-status').value='resolved';ATLAS.incidents.filter()">
          <div class="kpi-label">RESOLVED</div><div class="kpi-value" style="font-size:22px;color:var(--success);">${incidents.filter(i=>i.status==='resolved').length}</div><div class="kpi-icon">✅</div>
        </div>
      </div>
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center;">
          <input id="inc-search" class="form-input" style="flex:1;min-width:200px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.incidents.filter()">
          <select id="inc-filter-status" class="form-select" style="width:150px;" onchange="ATLAS.incidents.filter()">
            <option value="">All Status</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
          </select>
          <select id="inc-filter-sev" class="form-select" style="width:150px;" onchange="ATLAS.incidents.filter()">
            <option value="">All Severity</option><option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Info</option>
          </select>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('inc-search').value='';document.getElementById('inc-filter-status').value='';document.getElementById('inc-filter-sev').value='';ATLAS.incidents.filter()">✕ Clear</button>
        </div>
        <div id="inc-count" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${incidents.length} incident${incidents.length!==1?'s':''}</div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>${ATLAS.i18n.t('severity')}</th>
              <th>${ATLAS.i18n.t('title')}</th>
              <th>${ATLAS.i18n.t('status')}</th>
              <th>${ATLAS.i18n.t('date')}</th>
              <th style="text-align:right;">Actions</th>
            </tr></thead>
            <tbody id="incident-tbody"></tbody>
          </table>
        </div>
      </div>`;
    this.renderTable(incidents);
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('incident_new', inc => {
        this._all.unshift(inc);
        ATLAS.state.incidents.unshift(inc);
        this.filter();
      });
    }
  },

  renderTable(list) {
    const tbody = document.getElementById('incident-tbody');
    if (!tbody) return;
    const countEl = document.getElementById('inc-count');
    if (countEl) countEl.textContent = `${list.length} incident${list.length!==1?'s':''}`;
    if (!tbody) return;
    tbody.innerHTML = list.map(i => `
      <tr style="cursor:pointer;" onclick="ATLAS.incidents.showDetail(${JSON.stringify(i).replace(/"/g,'&quot;')})">
        <td>${ATLAS.ui.severityBadge(i.severity)}</td>
        <td>
          <div style="font-weight:600;">${ATLAS.ui.esc(i.title)}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${(i.description||'').slice(0,70)}${(i.description||'').length>70?'…':''}</div>
        </td>
        <td>${ATLAS.ui.statusBadge(i.status)}</td>
        <td style="font-size:11px;white-space:nowrap;">
          <div>${ATLAS.ui.formatDateShort(i.created_at)}</div>
          <div style="color:var(--text-muted);">${ATLAS.dashboard.timeAgo(i.created_at)}</div>
        </td>
        <td style="text-align:right;" onclick="event.stopPropagation()">
          <div style="display:flex;gap:4px;justify-content:flex-end;">
            ${i.status !== 'resolved' ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.quickResolve(${i.id})" data-tooltip="Resolve">✓</button>` : ''}
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.showEdit(${JSON.stringify(i).replace(/"/g,'&quot;')})">${ATLAS.i18n.t('edit')}</button>
          </div>
        </td>
      </tr>`).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:32px;">${ATLAS.i18n.t('no_data')}</td></tr>`;
  },

  filter() {
    const q = (document.getElementById('inc-search')?.value||'').toLowerCase();
    const st = document.getElementById('inc-filter-status')?.value||'';
    const sv = document.getElementById('inc-filter-sev')?.value||'';
    const filtered = this._all.filter(i =>
      (!q || i.title.toLowerCase().includes(q) || (i.description||'').toLowerCase().includes(q) || (i.location||'').toLowerCase().includes(q)) &&
      (!st || i.status === st) && (!sv || i.severity === sv));
    this.renderTable(filtered);
  },

  showDetail(inc) {
    const colorMap = { critical: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
    ATLAS.ui.openPanel(`${ATLAS.ui.esc(inc.title)}`, `
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        ${ATLAS.ui.severityBadge(inc.severity)}
        ${ATLAS.ui.statusBadge(inc.status)}
      </div>
      ${inc.description ? `<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">${inc.description}</p>` : ''}
      <div class="divider"></div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Created</span><span>${ATLAS.ui.formatDate(inc.created_at)}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Updated</span><span>${ATLAS.ui.formatDate(inc.updated_at)}</span></div>
        ${inc.lat && inc.lng ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Location</span><span>${inc.lat.toFixed(4)}, ${inc.lng.toFixed(4)}</span></div>` : ''}
      </div>
      <div class="divider"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${inc.status !== 'resolved' ? `<button class="btn btn-primary btn-sm" onclick="ATLAS.incidents.quickResolve(${inc.id})">✓ Resolve</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.showEdit(${JSON.stringify(inc).replace(/"/g,'&quot;')})">${ATLAS.i18n.t('edit')}</button>
        ${inc.lat && inc.lng ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('map');setTimeout(()=>ATLAS.map.flyTo(${inc.lat},${inc.lng}),300)">🗺 Map</button>` : ''}
        ${inc.lat && inc.lng ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.navigation.setDestination('${inc.lat},${inc.lng}')">🧭 Navigate</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidentReport.generate(${inc.id})">📋 ${ATLAS.i18n.t('incident_report')}</button>
      </div>`);
  },

  async quickResolve(id) {
    try {
      await ATLAS.api.put(`/api/incidents/${id}`, { status: 'resolved' });
      const inc = this._all.find(i => i.id === id);
      if (inc) inc.status = 'resolved';
      ATLAS.ui.closePanel();
      ATLAS.ui.toast('Incident resolved', 'success');
      this.filter();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  exportCSV() {
    const rows = [['ID','Title','Severity','Status','Created','Description']];
    this._all.forEach(i => rows.push([i.id, i.title, i.severity, i.status, i.created_at, (i.description||'').replace(/,/g,';')]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'incidents.csv';
    a.click();
  },

  showCreate() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_incident'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('title')}</label><input id="ni-title" class="form-input" placeholder="Incident title"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('severity')}</label>
          <select id="ni-sev" class="form-select"><option value="info">Info</option><option value="warning" selected>Warning</option><option value="critical">Critical</option></select>
        </div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="ni-status" class="form-select"><option value="open">Open</option><option value="in_progress">In Progress</option></select>
        </div>
      </div>
      ${ATLAS.geo.widget('ni')}
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><textarea id="ni-desc" class="form-textarea" rows="3" placeholder="Describe the incident..."></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.incidents.create()">+ ${ATLAS.i18n.t('create')}</button>`
    );
    setTimeout(() => document.getElementById('ni-title')?.focus(), 100);
  },

  async create() {
    const title = document.getElementById('ni-title').value.trim();
    if (!title) { ATLAS.ui.toast('Title is required', 'warning'); return; }
    try {
      const inc = await ATLAS.api.post('/api/incidents', {
        title, severity: document.getElementById('ni-sev').value,
        status: document.getElementById('ni-status').value,
        description: document.getElementById('ni-desc').value,
        lat: parseFloat(document.getElementById('ni-lat')?.value)||null,
        lng: parseFloat(document.getElementById('ni-lng')?.value)||null,
      });
      if (inc) {
        this._all.unshift(inc);
        ATLAS.state.incidents.unshift(inc);
      }
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(`Incident "${title}" created`, 'success');
      this.filter();
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to create incident', 'warning'); }
  },

  showEdit(inc) {
    ATLAS.ui.modal(`${ATLAS.i18n.t('edit')}: ${ATLAS.ui.esc(inc.title)}`, `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('title')}</label><input id="ei-title" class="form-input" value="${(inc.title||'').replace(/"/g,'&quot;')}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('severity')}</label>
          <select id="ei-sev" class="form-select"><option value="info" ${inc.severity==='info'?'selected':''}>Info</option><option value="warning" ${inc.severity==='warning'?'selected':''}>Warning</option><option value="critical" ${inc.severity==='critical'?'selected':''}>Critical</option></select>
        </div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="ei-status" class="form-select"><option value="open" ${inc.status==='open'?'selected':''}>Open</option><option value="in_progress" ${inc.status==='in_progress'?'selected':''}>In Progress</option><option value="resolved" ${inc.status==='resolved'?'selected':''}>Resolved</option></select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><textarea id="ei-desc" class="form-textarea" rows="4">${(inc.description||'')}</textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.incidents.update(${inc.id})">${ATLAS.i18n.t('save')}</button>`
    );
  },

  async update(id) {
    try {
      const updated = await ATLAS.api.put(`/api/incidents/${id}`, {
        title: document.getElementById('ei-title').value,
        severity: document.getElementById('ei-sev').value,
        status: document.getElementById('ei-status').value,
        description: document.getElementById('ei-desc').value,
      });
      const idx = this._all.findIndex(i => i.id === id);
      if (idx >= 0 && updated) this._all[idx] = { ...this._all[idx], ...updated };
      ATLAS.ui.closeModal();
      ATLAS.ui.closePanel();
      ATLAS.ui.toast('Incident updated', 'success');
      this.filter();
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to update incident', 'warning'); }
  }
};

/* ============================================================
   Alerts Page
============================================================ */
ATLAS.alertsPage = {
  _wsRegistered: false,

  async render(el) {
    const unack = ATLAS.state.alerts.filter(a => !a.acknowledged).length;
    const critical = ATLAS.state.alerts.filter(a => a.severity === 'critical').length;
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('alerts')}</h1>
        <div class="actions">
          <button class="btn btn-secondary" onclick="ATLAS.alertsPage.ackAll()">${ATLAS.i18n.t('ack_all')}</button>
          <button class="btn btn-primary" onclick="ATLAS.alertsPage.showCreate()">+ ${ATLAS.i18n.t('new_alert')}</button>
        </div>
      </div>
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card" style="padding:12px 16px;">
          <div class="kpi-label">TOTAL</div><div class="kpi-value" style="font-size:22px;">${ATLAS.state.alerts.length}</div><div class="kpi-icon">📋</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('al-filter').value='critical';ATLAS.alertsPage.filter()">
          <div class="kpi-label">CRITICAL</div><div class="kpi-value" style="font-size:22px;color:var(--danger);">${critical}</div><div class="kpi-icon">🚨</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('al-unack').checked=true;ATLAS.alertsPage.filter()">
          <div class="kpi-label">UNACKNOWLEDGED</div><div class="kpi-value" style="font-size:22px;color:var(--warning);">${unack}</div><div class="kpi-icon">⏳</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;">
          <div class="kpi-label">ACKNOWLEDGED</div><div class="kpi-value" style="font-size:22px;color:var(--success);">${ATLAS.state.alerts.length - unack}</div><div class="kpi-icon">✅</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
        <input id="al-search" class="form-input" style="flex:1;min-width:180px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.alertsPage.filter()">
        <select id="al-filter" class="form-select" style="width:150px;" onchange="ATLAS.alertsPage.filter()">
          <option value="">All Severity</option>
          <option value="critical">🚨 Critical</option>
          <option value="warning">⚠️ Warning</option>
          <option value="info">ℹ️ Info</option>
        </select>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;white-space:nowrap;">
          <input type="checkbox" id="al-unack" onchange="ATLAS.alertsPage.filter()"> Unacknowledged
        </label>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('al-search').value='';document.getElementById('al-filter').value='';document.getElementById('al-unack').checked=false;ATLAS.alertsPage.filter()">✕</button>
      </div>
      <div id="al-result-count" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;"></div>
      <div id="alert-list" style="display:flex;flex-direction:column;gap:8px;"></div>`;
    this.renderAlerts(ATLAS.state.alerts);
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('alert_new', () => this.renderAlerts(ATLAS.state.alerts));
      ATLAS.ws.on('alert_ack', () => this.renderAlerts(ATLAS.state.alerts));
      ATLAS.ws.on('alerts_all_ack', () => this.renderAlerts(ATLAS.state.alerts));
    }
  },

  filter() {
    const q = (document.getElementById('al-search')?.value||'').toLowerCase();
    const sev = document.getElementById('al-filter')?.value||'';
    const unack = document.getElementById('al-unack')?.checked||false;
    const filtered = ATLAS.state.alerts.filter(a =>
      (!q || (a.message||'').toLowerCase().includes(q) || (a.source||'').toLowerCase().includes(q)) &&
      (!sev || a.severity === sev) &&
      (!unack || !a.acknowledged));
    this.renderAlerts(filtered);
  },

  renderAlerts(list) {
    const el = document.getElementById('alert-list');
    const countEl = document.getElementById('al-result-count');
    if (countEl) countEl.textContent = `Showing ${Math.min(list.length,100)} of ${list.length} alert${list.length!==1?'s':''}`;
    if (!el) return;
    const icons = { critical:'🚨', warning:'⚠️', info:'ℹ️' };
    if (!list.length) {
      el.innerHTML = `<div class="card" style="text-align:center;color:var(--text-muted);padding:40px;">
        <div style="font-size:32px;margin-bottom:8px;">✅</div>
        <div>No alerts match your filter</div>
      </div>`;
      return;
    }
    el.innerHTML = list.slice(0,100).map(a => `
      <div class="alert-item ${a.severity} ${a.acknowledged?'acknowledged':''}" style="animation:fadeInDown 0.15s ease;">
        <span class="alert-icon">${icons[a.severity]||'ℹ️'}</span>
        <div class="alert-body">
          <div class="alert-msg">${ATLAS.ui.esc(a.message)}</div>
          <div class="alert-meta">
            ${a.source ? `<span style="background:var(--bg-input);padding:1px 6px;border-radius:3px;font-size:10px;">${ATLAS.ui.esc(a.source)}</span> · ` : ''}
            ${ATLAS.ui.formatDate(a.created_at)}
            ${a.acknowledged ? ' · <span style="color:var(--success);">✓ Acknowledged</span>' : ''}
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
          ${ATLAS.ui.severityBadge(a.severity)}
          ${!a.acknowledged ? `<button class="alert-ack-btn" onclick="ATLAS.alertsPage.ack(${a.id})" data-tooltip="Acknowledge">✓</button>` : ''}
        </div>
      </div>`).join('');
  },

  async ack(id) {
    try {
      await ATLAS.api.post(`/api/alerts/${id}/acknowledge`);
      const a = ATLAS.state.alerts.find(a => a.id === id);
      if (a) a.acknowledged = 1;
      this.filter();
      ATLAS.alerts.updateBanner();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async ackAll() {
    try {
      await ATLAS.api.post('/api/alerts/acknowledge-all');
      ATLAS.state.alerts.forEach(a => a.acknowledged = 1);
      this.filter();
      ATLAS.alerts.updateBanner();
      ATLAS.ui.toast('All alerts acknowledged', 'success');
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  showCreate() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_alert'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('severity')}</label>
        <div style="display:flex;gap:8px;">
          <button type="button" class="btn btn-secondary btn-sm" id="sev-info" onclick="ATLAS.alertsPage._setSev('info')" style="flex:1;">ℹ️ Info</button>
          <button type="button" class="btn btn-secondary btn-sm" id="sev-warning" onclick="ATLAS.alertsPage._setSev('warning')" style="flex:1;">⚠️ Warning</button>
          <button type="button" class="btn btn-danger btn-sm" id="sev-critical" onclick="ATLAS.alertsPage._setSev('critical')" style="flex:1;">🚨 Critical</button>
        </div>
        <input type="hidden" id="na-sev" value="warning">
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('message')}</label><textarea id="na-msg" class="form-textarea" rows="3" placeholder="Alert message..."></textarea></div>
      <div class="form-group"><label class="form-label">Source</label><input id="na-type" class="form-input" value="manual" placeholder="system / sensor / fleet / manual..."></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.alertsPage.create()">🔔 ${ATLAS.i18n.t('create')}</button>`
    );
    setTimeout(() => { ATLAS.alertsPage._setSev('warning'); document.getElementById('na-msg')?.focus(); }, 50);
  },

  _setSev(sev) {
    document.getElementById('na-sev').value = sev;
    ['info','warning','critical'].forEach(s => {
      const btn = document.getElementById('sev-'+s);
      if (btn) { btn.className = `btn btn-sm ${s==='critical'?'btn-danger':'btn-secondary'} ${s===sev?'':''}`;
        if (s===sev) btn.style.outline = '2px solid var(--accent)'; else btn.style.outline = ''; }
    });
  },

  async create() {
    const msg = document.getElementById('na-msg').value.trim();
    if (!msg) { ATLAS.ui.toast('Message is required', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/alerts', { message: msg, severity: document.getElementById('na-sev').value, type: document.getElementById('na-type').value });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Alert created', 'success');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to create alert', 'warning'); }
  }
};


/* ============================================================
   Chat Module
============================================================ */
ATLAS.chat = {
  currentRoom: null,
  currentDM: null,
  unread: {},
  _roomNames: {},  // id -> name cache

  render(el) {
    const rooms = ATLAS.state.chatRooms;
    // Build room name cache
    rooms.forEach(r => { this._roomNames[r.id] = r.name; });
    const totalUnread = Object.values(this.unread).reduce((s,v)=>s+v,0);
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('chat')} ${totalUnread > 0 ? `<span class="badge badge-danger" style="font-size:12px;vertical-align:middle;">${totalUnread}</span>` : ''}</h1>
      </div>
      <div class="chat-layout">
        <div class="chat-sidebar">
          <div class="card" style="padding:12px;flex:1;display:flex;flex-direction:column;gap:0;">
            <div class="card-title" style="margin-bottom:8px;">${ATLAS.i18n.t('rooms')}</div>
            <div id="room-list" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:2px;">
              ${rooms.map(r => `
                <div class="room-item ${r.id===this.currentRoom?'active':''}" onclick="ATLAS.chat.openRoom(${r.id},'${r.name}')" data-room="${r.id}" style="display:flex;align-items:center;justify-content:space-between;">
                  <span># ${r.name}</span>
                  <span class="room-badge ${(this.unread[r.id]||0)===0?'hidden':''}" id="badge-room-${r.id}">${this.unread[r.id]||''}</span>
                </div>`).join('')}
            </div>
            <button class="btn btn-secondary btn-sm w-full mt-8" onclick="ATLAS.chat.createRoom()">+ ${ATLAS.i18n.t('rooms')}</button>
          </div>
        </div>
        <div class="chat-main card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">
          <div id="chat-header" style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:700;display:flex;align-items:center;justify-content:space-between;">
            <span id="chat-header-title" style="color:var(--text-muted);font-weight:400;">Select a room to start chatting</span>
            <div id="chat-header-actions" style="display:none;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.chat.loadRoom(ATLAS.chat.currentRoom)">🔄</button>
            </div>
          </div>
          <div id="chat-messages" class="chat-messages" style="flex:1;overflow-y:auto;"></div>
          <div class="chat-input-area" id="chat-input-area" style="display:none;">
            <input id="chat-input" class="form-input" placeholder="${ATLAS.i18n.t('message')}... (Enter to send, Shift+Enter for newline)" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ATLAS.chat.send();}">
            <button class="btn btn-primary" onclick="ATLAS.chat.send()">${ATLAS.i18n.t('send')} ↵</button>
          </div>
        </div>
      </div>`;
    if (this.currentRoom) this.openRoom(this.currentRoom, this._roomNames[this.currentRoom]||'');
  },

  async openRoom(roomId, name) {
    this.currentRoom = roomId;
    this.currentDM = null;
    if (name) this._roomNames[roomId] = name;
    document.querySelectorAll('.room-item').forEach(el => el.classList.toggle('active', parseInt(el.dataset.room, 10)===roomId));
    const headerTitle = document.getElementById('chat-header-title');
    const headerActions = document.getElementById('chat-header-actions');
    const inputArea = document.getElementById('chat-input-area');
    if (headerTitle) { headerTitle.textContent = '# ' + (this._roomNames[roomId] || roomId); headerTitle.style.color = 'var(--text-primary)'; headerTitle.style.fontWeight = '700'; }
    if (headerActions) headerActions.style.display = 'flex';
    if (inputArea) inputArea.style.display = 'flex';
    this.unread[roomId] = 0;
    const badge = document.getElementById(`badge-room-${roomId}`);
    if (badge) { badge.textContent = ''; badge.classList.add('hidden'); }

    await this.loadRoom(roomId);
    setTimeout(() => document.getElementById('chat-input')?.focus(), 50);
  },

  async loadRoom(roomId) {
    const msgEl = document.getElementById('chat-messages');
    if (!msgEl) return;
    msgEl.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</div>`;
    const msgs = await ATLAS.api.get(`/api/chat/rooms/${roomId}/messages?limit=80`);
    if (msgEl && msgs) {
      if (!msgs.length) { msgEl.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted);">No messages yet. Start the conversation!</div>`; return; }
      // Group messages by day
      let lastDate = '';
      msgEl.innerHTML = msgs.map(m => {
        const dayStr = new Date(m.timestamp).toLocaleDateString(ATLAS.i18n.lang, {weekday:'long',month:'long',day:'numeric'});
        const dayDiv = dayStr !== lastDate ? `<div style="text-align:center;margin:16px 0 8px;"><span style="font-size:11px;color:var(--text-muted);background:var(--bg-input);padding:3px 10px;border-radius:99px;">${dayStr}</span></div>` : '';
        lastDate = dayStr;
        return dayDiv + this.renderMsg(m);
      }).join('');
      msgEl.scrollTop = msgEl.scrollHeight;
    }
  },

  renderMsg(m) {
    const isMe = m.sender_id === ATLAS.state.user?.id;
    const time = new Date(m.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'});
    const avatar = (m.full_name||m.username||'?')[0].toUpperCase();
    const text = (m.content||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
      .replace(/`(.*?)`/g,'<code style="background:var(--bg-input);padding:1px 4px;border-radius:3px;font-family:var(--font-mono);">$1</code>')
      .replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--accent);">$1</a>')
      .replace(/\n/g,'<br>');
    return `<div class="msg ${isMe?'me':''}">
      <div class="msg-avatar" title="${m.full_name||m.username}">${avatar}</div>
      <div style="flex:1;min-width:0;">
        <div class="msg-meta">${isMe ? 'You' : (m.full_name||m.username)} <span style="font-size:10px;opacity:0.6;">${time}</span></div>
        <div class="msg-bubble"><div class="msg-text">${text}</div></div>
      </div>
    </div>`;
  },

  async send() {
    const input = document.getElementById('chat-input');
    const content = input?.value?.trim();
    if (!content || !this.currentRoom) return;
    input.value = '';
    // Optimistic rendering
    const msgEl = document.getElementById('chat-messages');
    if (msgEl) {
      const tmpMsg = { sender_id: ATLAS.state.user?.id, full_name: ATLAS.state.user?.full_name, username: ATLAS.state.user?.username, content, timestamp: new Date().toISOString() };
      msgEl.insertAdjacentHTML('beforeend', this.renderMsg(tmpMsg));
      msgEl.scrollTop = msgEl.scrollHeight;
    }
    try {
      await ATLAS.api.post(`/api/chat/rooms/${this.currentRoom}/messages`, { content });
    } catch(e) {
      ATLAS.ui.toast('Failed to send message', 'warning');
    }
  },

  onMessage(data) {
    const { room_id, message } = data;
    if (room_id === this.currentRoom) {
      // Only append if not our own message (we already did optimistic rendering)
      if (message.sender_id !== ATLAS.state.user?.id) {
        const msgEl = document.getElementById('chat-messages');
        if (msgEl) {
          msgEl.insertAdjacentHTML('beforeend', this.renderMsg(message));
          msgEl.scrollTop = msgEl.scrollHeight;
        }
      }
    } else {
      this.unread[room_id] = (this.unread[room_id]||0)+1;
      const badge = document.getElementById(`badge-room-${room_id}`);
      if (badge) { badge.textContent = this.unread[room_id]; badge.classList.remove('hidden'); }
      // Use actual room name from cache, or fall back to ID
      const roomName = this._roomNames[room_id] || `Room ${room_id}`;
      ATLAS.ui.toast(`${(message.full_name||message.username)||'?'}: ${message.content}`, 'info', `#${roomName}`);
    }
  },

  onDM(data) {
    ATLAS.ui.toast(data.content, 'info', `DM from ${data.full_name||data.username||'?'}`);
  },

  createRoom() {
    ATLAS.ui.modal('New Chat Room', `
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('name')}</label>
        <input id="nr-name" class="form-input" placeholder="ops-team" pattern="[a-z0-9-]+" title="Lowercase letters, numbers, hyphens">
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Use lowercase letters, numbers and hyphens</div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><input id="nr-desc" class="form-input" placeholder="Optional description"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.chat.doCreateRoom()">+ Create Room</button>`
    );
    setTimeout(() => document.getElementById('nr-name')?.focus(), 50);
  },

  async doCreateRoom() {
    const name = document.getElementById('nr-name').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    if (!name) { ATLAS.ui.toast('Room name required','warning'); return; }
    try {
      const room = await ATLAS.api.post('/api/chat/rooms', { name, description: document.getElementById('nr-desc').value });
      ATLAS.state.chatRooms.push(room);
      this._roomNames[room.id] = room.name;
      ATLAS.ui.closeModal();
      ATLAS.router.go('chat', true);
      setTimeout(() => ATLAS.chat.openRoom(room.id, room.name), 200);
    } catch(e) { ATLAS.ui.toast(e.message||'Failed to create room','warning'); }
  }
};

/* ============================================================
   Sensors Page
============================================================ */
ATLAS.sensors = {
  sensorCharts: {},
  _sparklines: {},
  _history: {},  // sensor_id -> last 20 values for sparklines
  _wsRegistered: false,

  async render(el) {
    const sensors = await ATLAS.api.get('/api/sensors') || [];
    ATLAS.state.sensors = sensors;
    const alarmCount = sensors.filter(s => s.current_value != null && (s.current_value >= s.max_val * 0.95 || s.current_value <= s.min_val * 1.05)).length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('sensors')}</h1>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('sensors',true)">🔄 ${ATLAS.i18n.t('refresh')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.sensors.discover()">🔍 Auto-Discover</button>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.sensors.showAdd()">+ Add Sensor</button>
        </div>
      </div>
      ${alarmCount > 0 ? `<div style="background:var(--danger);color:white;padding:10px 16px;border-radius:var(--radius-sm);margin-bottom:16px;display:flex;align-items:center;gap:8px;animation:pulse 2s infinite;"><span>🚨</span><strong>${alarmCount} sensor${alarmCount>1?'s':''} in alarm state</strong></div>` : ''}
      <div id="pi-sensor-bar" style="margin-bottom:12px;"></div>
      <div class="sensor-grid" id="sensor-grid">
        ${sensors.map(s => this.renderCard(s)).join('')}
      </div>
      <div class="card mt-8">
        <div class="card-title" style="margin-bottom:16px;">📊 Sensor History</div>
        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:flex-end;flex-wrap:wrap;">
          <div class="form-group" style="min-width:200px;margin-bottom:0;">
            <label class="form-label">Sensor</label>
            <select class="form-select" id="sensor-detail-select" onchange="ATLAS.sensors.loadDetail(this.value)">
              <option value="">– select sensor –</option>
              ${sensors.map(s=>`<option value="${s.id}">${s.name} (${s.unit})</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="min-width:120px;margin-bottom:0;">
            <label class="form-label">Timeframe</label>
            <select class="form-select" id="sensor-hours" onchange="ATLAS.sensors.loadDetail(document.getElementById('sensor-detail-select').value)">
              <option value="1">Last 1h</option>
              <option value="6" selected>Last 6h</option>
              <option value="24">Last 24h</option>
              <option value="72">Last 3 days</option>
            </select>
          </div>
          <div id="sensor-stats" style="font-size:12px;color:var(--text-muted);padding-bottom:4px;"></div>
        </div>
        <div id="sensor-detail-chart" style="height:240px;position:relative;"><canvas id="sensor-chart"></canvas></div>
      </div>`;
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('sensor_reading', data => this.onReading(data));
    }
    // Auto-load Pi sensors if available
    this.loadPiSensors();
  },

  async loadPiSensors() {
    const bar = document.getElementById('pi-sensor-bar');
    if (!bar) return;
    try {
      const data = await ATLAS.api.get('/api/system/sensors');
      if (!data || (data.cpu_temp_c == null && data.cpu_voltage_v == null)) {
        bar.innerHTML = '';
        return;
      }
      const t = k => ATLAS.i18n.t(k);
      const temp = data.cpu_temp_c != null ? `${data.cpu_temp_c}°C` : '–';
      const volt = data.cpu_voltage_v != null ? `${data.cpu_voltage_v}V` : '–';
      const tempColor = data.cpu_temp_c != null && data.cpu_temp_c > 75 ? 'var(--danger)' : data.cpu_temp_c > 60 ? 'var(--warning)' : 'var(--success)';
      bar.innerHTML = `<div class="card" style="padding:12px 16px;margin-bottom:0;">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="font-size:12px;font-weight:600;color:var(--text-muted);">🍓 ${t('pi_sensors')} (${data.platform})</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">🌡️</span>
            <span style="font-weight:700;font-size:16px;color:${tempColor};">${temp}</span>
            <span style="font-size:11px;color:var(--text-muted);">${t('cpu_temp')}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">⚡</span>
            <span style="font-weight:700;font-size:16px;">${volt}</span>
            <span style="font-size:11px;color:var(--text-muted);">${t('cpu_voltage')}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.sensors.loadPiSensors()">🔄</button>
        </div>
      </div>`;
    } catch(e) {
      bar.innerHTML = '';
    }
  },

  renderCard(s) {
    const pct = s.current_value != null ? Math.round((s.current_value - s.min_val) / (s.max_val - s.min_val) * 100) : 50;
    const isAlarm = s.current_value != null && (s.current_value >= s.max_val * 0.95 || s.current_value <= s.min_val * 1.05);
    const clampedPct = Math.max(0, Math.min(100, pct));
    const typeIcons = { temperature:'🌡️', humidity:'💧', voltage:'⚡', co2:'💨', signal:'📶', fuel:'⛽', pressure:'🔵', default:'📡' };
    const icon = typeIcons[s.type] || typeIcons.default;
    return `<div class="sensor-card ${isAlarm?'alarm':''}" id="sensor-card-${s.id}" onclick="ATLAS.sensors.openDetail(${s.id})" style="cursor:pointer;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
        <div class="sensor-name">${s.name}</div>
        <span style="font-size:16px;">${icon}</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:4px;">
        <span class="sensor-value" id="sv-${s.id}">${s.current_value?.toFixed(1)??'–'}</span>
        <span class="sensor-unit">${s.unit}</span>
        ${isAlarm ? '<span style="color:var(--danger);font-size:11px;animation:pulse 1s infinite;">⚠ ALARM</span>' : ''}
      </div>
      <div class="sensor-location" style="margin:4px 0;">📍 ${s.location||'–'}</div>
      <canvas id="sparkline-${s.id}" height="30" style="width:100%;margin:4px 0;"></canvas>
      <div class="sensor-bar" style="margin-top:4px;">
        <div class="sensor-bar-fill" id="sb-${s.id}" style="width:${clampedPct}%;background:${isAlarm?'var(--danger)':'var(--accent)'};transition:width 0.5s ease;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:4px;">
        <span>${s.min_val}${s.unit}</span>
        <span style="font-size:9px;">${s.type}</span>
        <span>${s.max_val}${s.unit}</span>
      </div>
    </div>`;
  },

  openDetail(sensorId) {
    const select = document.getElementById('sensor-detail-select');
    if (select) { select.value = sensorId; this.loadDetail(sensorId); }
    const chartCard = document.querySelector('#sensor-detail-chart')?.closest('.card');
    if (chartCard) chartCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  onReading(data) {
    const { sensor_id, value } = data;
    const sensor = ATLAS.state.sensors.find(s => s.id === sensor_id);
    if (sensor) sensor.current_value = value;

    // Track history for sparklines
    if (!this._history[sensor_id]) this._history[sensor_id] = [];
    this._history[sensor_id].push(value);
    if (this._history[sensor_id].length > 20) this._history[sensor_id].shift();

    const valEl = document.getElementById(`sv-${sensor_id}`);
    if (valEl) valEl.textContent = value.toFixed ? value.toFixed(1) : value;
    const barEl = document.getElementById(`sb-${sensor_id}`);
    if (barEl && sensor) {
      const pct = Math.round((value - sensor.min_val) / (sensor.max_val - sensor.min_val) * 100);
      barEl.style.width = Math.max(0, Math.min(100, pct)) + '%';
      const isAlarm = value >= sensor.max_val * 0.95 || value <= sensor.min_val * 1.05;
      barEl.style.background = isAlarm ? 'var(--danger)' : 'var(--accent)';
      const card = document.getElementById(`sensor-card-${sensor_id}`);
      if (card) card.classList.toggle('alarm', isAlarm);
    }
    this.drawSparkline(sensor_id);
  },

  drawSparkline(sensorId) {
    const canvas = document.getElementById(`sparkline-${sensorId}`);
    if (!canvas) return;
    const vals = this._history[sensorId] || [];
    if (vals.length < 2) return;
    canvas.width = canvas.offsetWidth || 160;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#60a5fa';
    ctx.lineWidth = 1.5;
    vals.forEach((v, i) => {
      const x = (i / (vals.length-1)) * w;
      const y = h - ((v - min) / range) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  },

  async loadDetail(sensorId) {
    if (!sensorId) return;
    const hours = document.getElementById('sensor-hours')?.value || '6';
    const [history, sensor] = await Promise.all([
      ATLAS.api.get(`/api/sensors/${sensorId}/history?hours=${hours}`),
      Promise.resolve(ATLAS.state.sensors.find(s => s.id == sensorId))
    ]);
    if (!history) return;

    // Show stats
    const vals = history.map(r => r.value);
    if (vals.length) {
      const avg = (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
      const min = Math.min(...vals).toFixed(2);
      const max = Math.max(...vals).toFixed(2);
      const statsEl = document.getElementById('sensor-stats');
      if (statsEl) statsEl.innerHTML = `<span style="color:var(--text-muted);">Avg: <b style="color:var(--accent);">${avg}</b> · Min: <b>${min}</b> · Max: <b>${max}</b> · ${vals.length} readings</span>`;
    }

    const canvas = document.getElementById('sensor-chart');
    if (!canvas || !window.Chart) return;
    if (this.sensorCharts.detail) this.sensorCharts.detail.destroy();
    const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    const accent = css('--accent');
    const danger = css('--danger');
    const warning = css('--warning');
    const axisColor = css('--text-muted');

    const labels = history.slice(-80).map(r => new Date(r.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
    const data = history.slice(-80).map(r => r.value);

    this.sensorCharts.detail = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: sensor?.name||'Sensor', data, borderColor: accent, backgroundColor: accent+'18', tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 },
          sensor ? { label: 'Max threshold', data: data.map(()=>sensor.max_val), borderColor: danger+'88', borderDash:[4,4], pointRadius:0, borderWidth:1, fill:false } : null,
          sensor ? { label: 'Min threshold', data: data.map(()=>sensor.min_val), borderColor: warning+'88', borderDash:[4,4], pointRadius:0, borderWidth:1, fill:false } : null,
        ].filter(Boolean)
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom', labels: { color: axisColor, font: { size: 11 }, usePointStyle: true } }, tooltip: { mode: 'index', intersect: false } },
        scales: { x: { ticks: { maxTicksLimit: 10, color: axisColor, font: { size: 10 } }, grid: { color: 'rgba(128,128,128,0.08)' } }, y: { ticks: { color: axisColor, font: { size: 10 } }, grid: { color: 'rgba(128,128,128,0.08)' } } }
      }
    });
  },

  async discover() {
    ATLAS.ui.toast('Suche nach Sensoren…', 'info');
    try {
      const res = await ATLAS.api.post('/api/sensors/discover', {});
      ATLAS.ui.toast(`✅ ${res.discovered} Sensor(en) gefunden, ${res.new_sensors} neu registriert`, 'success');
      ATLAS.router.go('sensors', true);
    } catch(e) {
      ATLAS.ui.toast('Auto-Discover fehlgeschlagen: ' + e.message, 'error');
    }
  },

  showAdd() {
    const typeUnits = { temperature: '°C', humidity: '%', voltage: 'V', co2: 'ppm', signal: 'dBm', fuel: '%', pressure: 'bar' };
    ATLAS.ui.modal('Add Sensor', `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="as-name" class="form-input" placeholder="e.g. Server Room Temp"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('type')}</label>
          <select id="as-type" class="form-select" onchange="const u=({temperature:'°C',humidity:'%',voltage:'V',co2:'ppm',signal:'dBm',fuel:'%',pressure:'bar'})[this.value]||'';document.getElementById('as-unit').value=u;">
            <option>temperature</option><option>humidity</option><option>voltage</option><option>co2</option><option>signal</option><option>fuel</option><option>pressure</option><option>custom</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Unit</label><input id="as-unit" class="form-input" placeholder="°C" value="°C"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Min Value</label><input id="as-min" class="form-input" type="number" value="0"></div>
        <div class="form-group"><label class="form-label">Max Value</label><input id="as-max" class="form-input" type="number" value="100"></div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('location')}</label><input id="as-loc" class="form-input" placeholder="Building A, Floor 2"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.sensors.addSensor()">+ Add Sensor</button>`
    );
    setTimeout(() => document.getElementById('as-name')?.focus(), 50);
  },

  async addSensor() {
    const name = document.getElementById('as-name').value.trim();
    if (!name) { ATLAS.ui.toast('Name required','warning'); return; }
    try {
      await ATLAS.api.post('/api/sensors', {
        name, type: document.getElementById('as-type').value,
        unit: document.getElementById('as-unit').value,
        min_val: parseFloat(document.getElementById('as-min').value)||0,
        max_val: parseFloat(document.getElementById('as-max').value)||100,
        location: document.getElementById('as-loc').value
      });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(`Sensor "${name}" added`, 'success');
      ATLAS.router.go('sensors', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to add sensor', 'warning'); }
  }
};


/* ============================================================
   Analytics Page (AI)
============================================================ */
ATLAS.analyticsPage = {
  async render(el) {
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('analytics')}</h1>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.analyticsPage.refresh()">🔄 ${ATLAS.i18n.t('refresh')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.analyticsExtPage.render(document.getElementById('main-content'))">🚗 ${ATLAS.i18n.t('vehicle_utilization')}</button>
        </div>
      </div>

      <!-- KPI row -->
      <div id="analytics-kpis" class="kpi-grid" style="margin-bottom:20px;"></div>

      <!-- Anomalies + Prediction -->
      <div class="grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>🔍 ${ATLAS.i18n.t('anomalies')} <span id="anomaly-count" style="font-size:11px;background:var(--danger);color:white;padding:1px 6px;border-radius:10px;margin-left:6px;"></span></span>
            <span style="font-size:10px;color:var(--text-muted);">Z-Score &gt; 2.5</span>
          </div>
          <div id="anomaly-list"></div>
        </div>
        <div class="card">
          <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>📈 ${ATLAS.i18n.t('predictions')}</span>
            <span style="font-size:10px;color:var(--text-muted);">Linear Regression</span>
          </div>
          <div class="chart-wrapper" style="height:240px;"><canvas id="pred-chart"></canvas></div>
        </div>
      </div>

      <!-- Alert trend + Incident pattern -->
      <div class="grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="card-title">🚨 Alert Activity (24h)</div>
          <div class="chart-wrapper" style="height:200px;"><canvas id="alert-trend-chart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">📊 Sensor Status Distribution</div>
          <div class="chart-wrapper" style="height:200px;position:relative;"><canvas id="sensor-dist-chart"></canvas></div>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="card">
        <div class="card-title">🗓 Incident ${ATLAS.i18n.t('patterns')} <span style="font-size:10px;color:var(--text-muted);"> – Hour × Weekday heatmap</span></div>
        <div id="pattern-heatmap"></div>
      </div>`;
    await Promise.all([
      this.loadKPIs(),
      this.loadAnomalies(),
      this.loadPrediction(),
      this.loadPattern(),
      this.loadAlertTrend(),
      this.loadSensorDist(),
    ]);
  },

  async refresh() {
    const el = document.getElementById('main-content');
    if (el) await this.render(el);
  },

  async loadKPIs() {
    const el = document.getElementById('analytics-kpis');
    if (!el) return;
    try {
      const [anomalies, sensors, incidents, alerts] = await Promise.all([
        ATLAS.api.get('/api/analytics/anomalies').catch(()=>[]),
        ATLAS.api.get('/api/sensors').catch(()=>[]),
        ATLAS.api.get('/api/incidents?limit=200').catch(()=>[]),
        ATLAS.api.get('/api/alerts?limit=200').catch(()=>[]),
      ]);
      const openInc = (incidents||[]).filter(i=>i.status==='open').length;
      const critAlerts = (alerts||[]).filter(a=>a.severity==='critical'&&!a.acknowledged_at).length;
      const alarmSensors = (sensors||[]).filter(s=>s.in_alarm).length;
      el.innerHTML = [
        ['🔍', 'Anomalies', (anomalies||[]).length, 'danger'],
        ['🚨', 'Critical Alerts', critAlerts, 'danger'],
        ['📡', 'Sensors in Alarm', alarmSensors, 'warning'],
        ['⚡', 'Open Incidents', openInc, 'info'],
      ].map(([icon,label,val,color]) => `
        <div class="kpi-card">
          <div class="kpi-label">${label}</div>
          <div class="kpi-value" style="color:${val>0?'var(--'+color+')':'var(--success)'};">${val}</div>
          <div class="kpi-icon">${icon}</div>
        </div>`).join('');
    } catch(e) { console.warn('Analytics KPI load error', e); }
  },

  async loadAnomalies() {
    const anomalies = await ATLAS.api.get('/api/analytics/anomalies') || [];
    const el = document.getElementById('anomaly-list');
    const countEl = document.getElementById('anomaly-count');
    if (!el) return;
    if (countEl) { if (anomalies.length > 0) { countEl.textContent = anomalies.length; countEl.style.display=''; } else countEl.style.display='none'; }
    if (!anomalies.length) {
      el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);">
        <div style="font-size:32px;margin-bottom:8px;">✅</div>
        <div style="font-weight:600;">No anomalies detected</div>
        <div style="font-size:12px;margin-top:4px;">All sensor readings are within normal ranges</div>
      </div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;">` + anomalies.map(a => {
      const zAbs = Math.abs(a.z_score||0);
      const severity = zAbs > 4 ? 'critical' : zAbs > 3 ? 'warning' : 'info';
      const barW = Math.min(100, (zAbs/5)*100);
      return `
      <div style="padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-input);position:relative;overflow:hidden;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--${severity==='critical'?'danger':severity==='warning'?'warning':'accent'});"></div>
        <div style="display:flex;align-items:flex-start;gap:10px;">
          ${ATLAS.ui.severityBadge(severity)}
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${a.sensor_name}</div>
            <div style="font-size:11px;color:var(--text-muted);">
              Value: <b style="color:var(--text-primary);">${a.current_value}${a.unit||''}</b>
              · Mean: ${(a.mean||0).toFixed(1)}${a.unit||''}
              · Z: <b style="color:var(--${severity==='critical'?'danger':severity==='warning'?'warning':'accent'});">${(a.z_score||0).toFixed(2)}</b>
            </div>
            <div class="progress" style="margin-top:6px;height:4px;">
              <div class="progress-bar ${severity}" style="width:${barW}%;"></div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('') + `</div>`;
  },

  async loadPrediction() {
    const trends = await ATLAS.api.get('/api/analytics/trends?hours=12') || {};
    const data = trends.open_incidents || [];
    if (!data.length || !window.Chart) return;
    // Linear regression
    const n = data.length;
    const xs = data.map((_,i) => i);
    const ys = data.map(d => d.value);
    const sx = xs.reduce((a,b)=>a+b,0), sy = ys.reduce((a,b)=>a+b,0);
    const sxy = xs.reduce((a,b,i)=>a+b*ys[i],0), sxx = xs.reduce((a,b)=>a+b*b,0);
    const slope = (n*sxy - sx*sy)/(n*sxx - sx*sx || 1);
    const intercept = (sy - slope*sx)/n;
    const forecast = [0,1,2,3,4,5,6].map(i => Math.max(0, Math.round(slope*(n+i)+intercept)));
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const warning = getComputedStyle(document.documentElement).getPropertyValue('--warning').trim();
    const ctx = document.getElementById('pred-chart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...data.slice(-12).map(d=>new Date(d.timestamp).toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit'})), ...['F+1','F+2','F+3','F+4','F+5','F+6','F+7']],
        datasets: [
          { label: 'Historical', data: [...ys.slice(-12), ...Array(7).fill(null)], borderColor: accent, backgroundColor: accent+'22', tension: 0.4, fill: true, pointRadius: 2 },
          { label: 'Forecast', data: [...Array(12).fill(null), ...forecast], borderColor: warning, backgroundColor: warning+'22', borderDash: [5,5], tension: 0.4, fill: true, pointRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#aaa', font: { size: 11 } } } }, scales: { x: { ticks: { maxTicksLimit: 8, color: '#888' }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.04)' } } } }
    });
  },

  async loadPattern() {
    const pattern = await ATLAS.api.get('/api/analytics/incidents-pattern') || [];
    const el = document.getElementById('pattern-heatmap');
    if (!el || !pattern.length) return;
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const max = Math.max(...pattern.flat(), 1);
    const hours = Array.from({length:24},(_,i)=>i);
    el.innerHTML = `<div style="overflow-x:auto;">
      <div style="display:grid;grid-template-columns:40px repeat(24,1fr);gap:2px;min-width:600px;font-size:10px;">
        <div></div>${hours.map(h=>`<div style="text-align:center;color:var(--text-muted);padding-bottom:4px;">${h}</div>`).join('')}
        ${pattern.map((row,d)=>`
          <div style="color:var(--text-muted);display:flex;align-items:center;padding-right:6px;font-weight:600;">${days[d]}</div>
          ${row.map(v=>{
            const pct=v/max;
            return `<div title="${v} incident${v===1?'':'s'} at ${days[d]} hour ${hours[row.indexOf(v)]}" style="height:22px;border-radius:3px;background:linear-gradient(135deg,var(--accent),var(--danger));opacity:${0.08+pct*0.92};cursor:default;" onmouseover="this.style.outline='2px solid var(--accent)'" onmouseout="this.style.outline=''"></div>`;
          }).join('')}`).join('')}
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">Hover cells to see incident count. Hours 0–23 vs day of week. Darker = more incidents.</div>
    </div>`;
  },

  async loadAlertTrend() {
    const ctx = document.getElementById('alert-trend-chart');
    if (!ctx || !window.Chart) return;
    try {
      const alerts = await ATLAS.api.get('/api/alerts?limit=500') || [];
      // Bucket by hour for past 24h
      const now = Date.now();
      const buckets = Array(24).fill(0);
      const crit = Array(24).fill(0);
      const warn = Array(24).fill(0);
      alerts.forEach(a => {
        const hoursAgo = (now - new Date(a.created_at).getTime()) / 3600000;
        if (hoursAgo >= 0 && hoursAgo < 24) {
          const idx = Math.floor(hoursAgo);
          buckets[idx]++;
          if (a.severity === 'critical') crit[idx]++;
          else if (a.severity === 'warning') warn[idx]++;
        }
      });
      const labels = Array(24).fill(0).map((_,i)=>{
        const h = new Date(now - (23-i)*3600000);
        return h.toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit'});
      });
      // Reverse so oldest is first
      const css = k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Critical', data: crit.reverse(), backgroundColor: css('--danger')+'cc', borderRadius: 2 },
            { label: 'Warning', data: warn.reverse(), backgroundColor: css('--warning')+'cc', borderRadius: 2 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: css('--text-muted'), font:{size:11}, usePointStyle:true } } },
          scales: {
            x: { stacked: true, ticks: { maxTicksLimit: 8, color: css('--text-muted'), font:{size:10} }, grid: { color: 'rgba(128,128,128,0.06)' } },
            y: { stacked: true, beginAtZero: true, ticks: { color: css('--text-muted'), font:{size:10}, stepSize: 1 }, grid: { color: 'rgba(128,128,128,0.06)' } }
          }
        }
      });
    } catch(e) { console.warn('Alert trend chart error', e); }
  },

  async loadSensorDist() {
    const ctx = document.getElementById('sensor-dist-chart');
    if (!ctx || !window.Chart) return;
    try {
      const sensors = await ATLAS.api.get('/api/sensors') || [];
      const typeCounts = {};
      sensors.forEach(s => { typeCounts[s.type] = (typeCounts[s.type]||0)+1; });
      const types = Object.keys(typeCounts);
      const counts = types.map(t => typeCounts[t]);
      const alarmCounts = types.map(t => sensors.filter(s=>s.type===t&&s.in_alarm).length);
      const colors = types.map((_,i) => `hsl(${(i*53+200)%360},60%,55%)`);
      const css = k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: types.map(t => t.charAt(0).toUpperCase()+t.slice(1)),
          datasets: [{
            data: counts,
            backgroundColor: colors.map(c=>c+'cc'),
            borderColor: colors,
            borderWidth: 1.5,
            hoverOffset: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: css('--text-muted'), font:{size:11}, padding:12 } },
            tooltip: {
              callbacks: {
                label(ctx) {
                  const t = types[ctx.dataIndex];
                  const alarm = alarmCounts[ctx.dataIndex];
                  return ` ${ctx.parsed} sensor${ctx.parsed!==1?'s':''}${alarm?', '+alarm+' in alarm':''}`;
                }
              }
            }
          },
          cutout: '60%',
        }
      });
    } catch(e) { console.warn('Sensor dist chart error', e); }
  }
};

/* ============================================================
   Logs Page
============================================================ */
ATLAS.logsPage = {
  _logs: [], _page: 0, _pageSize: 50,

  _actionColor(action='') {
    const a = action.toLowerCase();
    if (a.includes('login') || a.includes('auth')) return { bg: 'var(--accent)', label: 'AUTH' };
    if (a.includes('delete') || a.includes('remove')) return { bg: 'var(--danger)', label: 'DELETE' };
    if (a.includes('create') || a.includes('add') || a.includes('register')) return { bg: 'var(--success)', label: 'CREATE' };
    if (a.includes('update') || a.includes('edit') || a.includes('modify') || a.includes('put')) return { bg: 'var(--warning)', label: 'UPDATE' };
    if (a.includes('alert') || a.includes('alarm')) return { bg: '#e879f9', label: 'ALERT' };
    if (a.includes('incident')) return { bg: '#fb923c', label: 'INCIDENT' };
    if (a.includes('fleet') || a.includes('vehicle') || a.includes('trip')) return { bg: '#38bdf8', label: 'FLEET' };
    return { bg: 'var(--text-muted)', label: 'ACTION' };
  },

  _categories() {
    return ['all', 'auth', 'create', 'update', 'delete', 'alert', 'incident', 'fleet'];
  },

  async render(el) {
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('logs')}</h1>
        <div class="actions">
          <a href="/api/export/logs" class="btn btn-secondary btn-sm">⬇ Logs CSV</a>
          <a href="/api/export/incidents" class="btn btn-secondary btn-sm">⬇ Incidents CSV</a>
        </div>
      </div>
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
          <input id="log-search" class="form-input" style="flex:1;min-width:200px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.logsPage.filter()">
          <select id="log-category" class="form-select" style="width:140px;" onchange="ATLAS.logsPage.filter()">
            ${this._categories().map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')}
          </select>
          <select id="log-user-filter" class="form-select" style="width:140px;" onchange="ATLAS.logsPage.filter()">
            <option value="">All Users</option>
          </select>
        </div>
        <div id="log-stats" style="font-size:12px;color:var(--text-muted);margin-bottom:10px;"></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="width:160px;">Timestamp</th>
                <th style="width:90px;">Category</th>
                <th>Action</th>
                <th style="width:110px;">User</th>
                <th>Details</th>
                <th style="width:110px;">IP</th>
              </tr>
            </thead>
            <tbody id="log-tbody">
              <tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</td></tr>
            </tbody>
          </table>
        </div>
        <div id="log-pagination" style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;flex-wrap:wrap;gap:8px;"></div>
      </div>`;

    const logs = await ATLAS.api.get('/api/audit?limit=1000') || [];
    this._logs = logs;
    this._page = 0;

    // Populate user filter
    const users = [...new Set(logs.map(l=>l.username).filter(Boolean))];
    const userSel = document.getElementById('log-user-filter');
    if (userSel) users.forEach(u => { const o = document.createElement('option'); o.value = u; o.textContent = u; userSel.appendChild(o); });

    this.filter();
  },

  filter() {
    this._page = 0;
    const q = (document.getElementById('log-search')?.value||'').toLowerCase();
    const cat = document.getElementById('log-category')?.value||'all';
    const user = document.getElementById('log-user-filter')?.value||'';
    this._filtered = (this._logs||[]).filter(l => {
      if (q && !JSON.stringify(l).toLowerCase().includes(q)) return false;
      if (user && l.username !== user) return false;
      if (cat !== 'all') {
        const ac = this._actionColor(l.action);
        if (ac.label.toLowerCase() !== cat) return false;
      }
      return true;
    });
    this.renderPage();
  },

  renderPage() {
    const filtered = this._filtered || this._logs || [];
    const total = filtered.length;
    const start = this._page * this._pageSize;
    const end = Math.min(start + this._pageSize, total);
    const page = filtered.slice(start, end);

    const statsEl = document.getElementById('log-stats');
    if (statsEl) statsEl.textContent = `Showing ${start+1}–${end} of ${total} entries`;

    this.renderLogs(page);

    // Pagination
    const pagEl = document.getElementById('log-pagination');
    if (!pagEl) return;
    const totalPages = Math.ceil(total / this._pageSize);
    if (totalPages <= 1) { pagEl.innerHTML = ''; return; }

    pagEl.innerHTML = `
      <div style="display:flex;gap:4px;align-items:center;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(0)" ${this._page===0?'disabled':''}>«</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(${this._page-1})" ${this._page===0?'disabled':''}>‹ Prev</button>
        ${Array.from({length:Math.min(5,totalPages)},(_,i)=>{
          const p = Math.max(0, Math.min(totalPages-5, this._page-2)) + i;
          return `<button class="btn btn-sm ${p===this._page?'btn-primary':'btn-secondary'}" onclick="ATLAS.logsPage.goPage(${p})">${p+1}</button>`;
        }).join('')}
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(${this._page+1})" ${this._page>=totalPages-1?'disabled':''}>Next ›</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(${totalPages-1})" ${this._page>=totalPages-1?'disabled':''}>»</button>
      </div>
      <div style="font-size:12px;color:var(--text-muted);">Page ${this._page+1} / ${totalPages}</div>`;
  },

  goPage(p) {
    const totalPages = Math.ceil((this._filtered||this._logs||[]).length / this._pageSize);
    this._page = Math.max(0, Math.min(totalPages-1, p));
    this.renderPage();
    document.querySelector('.table-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  renderLogs(logs) {
    const tbody = document.getElementById('log-tbody');
    if (!tbody) return;
    tbody.innerHTML = logs.map(l => {
      const ac = this._actionColor(l.action);
      const dt = new Date(l.timestamp);
      const timeStr = dt.toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const dateStr = dt.toLocaleDateString(ATLAS.i18n.lang,{month:'short',day:'numeric'});
      return `
        <tr style="font-size:12px;">
          <td style="font-family:var(--font-mono);white-space:nowrap;font-size:11px;">
            <div>${dateStr}</div>
            <div style="color:var(--text-muted);font-size:10px;">${timeStr}</div>
          </td>
          <td>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:${ac.bg}22;color:${ac.bg};white-space:nowrap;">${ac.label}</span>
          </td>
          <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);">${l.action}</td>
          <td>
            ${l.username ? `<div style="display:flex;align-items:center;gap:6px;">
              <div style="width:22px;height:22px;border-radius:50%;background:var(--accent-dim);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--accent);flex-shrink:0;">${l.username[0].toUpperCase()}</div>
              <span>${l.username}</span>
            </div>` : '<span style="color:var(--text-muted);">–</span>'}
          </td>
          <td style="color:var(--text-muted);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${(l.details||'').replace(/"/g,'&quot;')}">${l.details||'–'}</td>
          <td style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">${l.ip_addr||'–'}</td>
        </tr>`;
    }).join('') || `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">${ATLAS.i18n.t('no_data')}</td></tr>`;
  }
};


/* ============================================================
   Fleet Management
============================================================ */
ATLAS.fleet = {
  _vehicles: [], _drivers: [], _trips: [], _maintenance: [],
  _tab: 'vehicles',
  _fleetMap: null,   // cached Leaflet map instance for fleet map tab
  _fuelLogs: [],
  _wsRegistered: false,

  async render(el) {
    // Register WS handlers once for live vehicle updates
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('fleet_vehicle_update', data => {
        // Update vehicle in cached list
        const idx = this._vehicles.findIndex(v => v.id === data.id);
        if (idx >= 0) this._vehicles[idx] = data;
        // If fleet vehicles tab is currently visible, refresh the row
        if (this._tab === 'vehicles' && document.getElementById('fleet-vehicles-tbody')) {
          this.renderVehicles(document.getElementById('fleet-tab-content'));
        }
        // If fleet map is open, move marker
        if (this._tab === 'map' && data.lat && data.lng) {
          this.moveVehicleMarker(data.id, data.lat, data.lng);
        }
        // Refresh KPI stats
        if (document.getElementById('fleet-stats-row')) this.loadStats();
      });
    }
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('fleet')}</h1>
        <div class="actions">
          <a href="/api/export/fleet" class="btn btn-secondary btn-sm">⬇ Export</a>
          <button class="btn btn-primary btn-sm" id="fleet-add-btn" onclick="ATLAS.fleet.showAdd()">+ ${ATLAS.i18n.t('new_vehicle')}</button>
        </div>
      </div>
      <div id="fleet-stats-row" class="kpi-grid" style="margin-bottom:16px;"></div>
      <div class="tabs">
        <div class="tab active" data-tab="vehicles" onclick="ATLAS.fleet.switchTab('vehicles')">${ATLAS.i18n.t('vehicles')}</div>
        <div class="tab" data-tab="drivers" onclick="ATLAS.fleet.switchTab('drivers')">${ATLAS.i18n.t('drivers')}</div>
        <div class="tab" data-tab="trips" onclick="ATLAS.fleet.switchTab('trips')">${ATLAS.i18n.t('trips')}</div>
        <div class="tab" data-tab="maintenance" onclick="ATLAS.fleet.switchTab('maintenance')">${ATLAS.i18n.t('maintenance')}</div>
        <div class="tab" data-tab="fuel" onclick="ATLAS.fleet.switchTab('fuel')">${ATLAS.i18n.t('fuel_log')}</div>
        <div class="tab" data-tab="map" onclick="ATLAS.fleet.switchTab('map')">🗺 Map</div>
      </div>
      <div id="fleet-tab-content"></div>`;
    await this.loadStats();
    await this.switchTab('vehicles');
  },

  async loadStats() {
    const stats = await ATLAS.api.get('/api/fleet/stats');
    if (!stats) return;
    const el = document.getElementById('fleet-stats-row');
    if (!el) return;
    el.innerHTML = [
      ['🚗', ATLAS.i18n.t('vehicles'), stats.total_vehicles],
      ['✅', ATLAS.i18n.t('available'), stats.by_status?.available||0],
      ['🛣️', ATLAS.i18n.t('on_trip'), stats.by_status?.on_trip||0],
      ['🔧', ATLAS.i18n.t('maintenance'), stats.by_status?.maintenance||0],
      ['🗺', ATLAS.i18n.t('trips'), stats.total_trips],
      ['💶', 'Fuel Cost', '€'+stats.total_fuel_cost],
    ].map(([icon,label,val])=>`
      <div class="kpi-card" style="padding:12px 16px;">
        <div class="kpi-label">${label}</div>
        <div class="kpi-value" style="font-size:22px;">${val}</div>
        <div class="kpi-icon">${icon}</div>
      </div>`).join('');
  },

  async switchTab(tab) {
    this._tab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab===tab));
    const addBtn = document.getElementById('fleet-add-btn');
    const labels = { vehicles: ATLAS.i18n.t('new_vehicle'), drivers: ATLAS.i18n.t('new_driver'), trips: ATLAS.i18n.t('new_trip'), maintenance: ATLAS.i18n.t('new_maintenance'), fuel: ATLAS.i18n.t('add_fuel'), map: null };
    const actions = { vehicles: ()=>ATLAS.fleet.showAdd(), drivers: ()=>ATLAS.fleet.showAddDriver(), trips: ()=>ATLAS.fleet.showAddTrip(), maintenance: ()=>ATLAS.fleet.showAddMaintenance(), fuel: ()=>ATLAS.fleet.showAddFuel(), map: null };
    if (addBtn) { if (labels[tab]) { addBtn.textContent='+ '+labels[tab]; addBtn.onclick=actions[tab]; addBtn.style.display=''; } else addBtn.style.display='none'; }
    const content = document.getElementById('fleet-tab-content');
    if (!content) return;
    content.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</div>`;
    if (tab==='vehicles') await this.renderVehicles(content);
    else if (tab==='drivers') await this.renderDrivers(content);
    else if (tab==='trips') await this.renderTrips(content);
    else if (tab==='maintenance') await this.renderMaintenance(content);
    else if (tab==='fuel') await this.renderFuel(content);
    else if (tab==='map') this.renderFleetMap(content);
  },

  async renderVehicles(el) {
    const vehicles = await ATLAS.api.get('/api/fleet/vehicles') || [];
    this._vehicles = vehicles;
    el.innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <input class="form-input" style="flex:1;min-width:200px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.fleet.filterVehicles(this.value)">
        <select class="form-select" style="width:160px;" onchange="ATLAS.fleet.filterVehicleStatus(this.value)">
          <option value="">All Status</option><option>available</option><option>on_trip</option><option>maintenance</option><option>out_of_service</option>
        </select>
      </div>
      <div id="vehicle-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
        ${vehicles.map(v=>this.vehicleCard(v)).join('')}
      </div>`;
  },

  vehicleCard(v) {
    const today = new Date().toISOString().split('T')[0];
    const tuevWarn = v.tuev_expiry && v.tuev_expiry <= new Date(Date.now()+14*864e5).toISOString().split('T')[0];
    const insWarn = v.insurance_expiry && v.insurance_expiry <= new Date(Date.now()+30*864e5).toISOString().split('T')[0];
    // Fuel gauge
    const cap = v.fuel_capacity_l || 0;
    const cur = v.fuel_current_l || 0;
    const fuelPct = cap > 0 ? Math.min(100, Math.round(cur / cap * 100)) : null;
    const fuelColor = fuelPct === null ? 'var(--text-muted)' : fuelPct < 20 ? 'var(--danger)' : fuelPct < 40 ? 'var(--warning)' : 'var(--success)';
    // Range estimate
    const avg = v.fuel_avg_l100km || 0;
    const range = (cap > 0 && avg > 0 && cur > 0) ? Math.round(cur / avg * 100) : null;
    return `<div class="fleet-card" onclick="ATLAS.fleet.showVehicleDetail(${v.id})">
      <div class="fleet-type-icon">${ATLAS.ui.vehicleIcon(v.type)}</div>
      <div class="fleet-vehicle-name">${ATLAS.ui.esc(v.name)}</div>
      <div class="fleet-vehicle-meta">${v.make||''} ${v.model||''} ${v.year?'('+v.year+')':''}</div>
      <div style="margin:8px 0;">${ATLAS.ui.statusBadge(v.status)}</div>
      <div class="fleet-vehicle-details">
        ${v.license_plate?`<div class="fleet-detail"><span>Plate</span><span>${v.license_plate}</span></div>`:''}
        ${v.driver_name?`<div class="fleet-detail"><span>Driver</span><span>${v.driver_name}</span></div>`:''}
        <div class="fleet-detail"><span>Odometer</span><span>${(v.odometer_km||0).toLocaleString()} km</span></div>
        ${fuelPct !== null ? `
        <div class="fleet-detail" style="flex-direction:column;gap:4px;align-items:stretch;">
          <div style="display:flex;justify-content:space-between;font-size:11px;">
            <span>⛽ ${ATLAS.i18n.t('fuel_current')}</span>
            <span style="color:${fuelColor};font-weight:600;">${cur.toFixed(0)}L / ${cap.toFixed(0)}L (${fuelPct}%)</span>
          </div>
          <div style="background:var(--border);border-radius:4px;height:6px;overflow:hidden;">
            <div style="background:${fuelColor};width:${fuelPct}%;height:100%;transition:width 0.3s;border-radius:4px;"></div>
          </div>
          ${range ? `<div style="font-size:10px;color:var(--text-muted);text-align:right;">~${range} km range</div>` : ''}
        </div>` : ''}
        ${tuevWarn?`<div class="fleet-detail" style="color:var(--warning)"><span>⚠ TÜV</span><span>${v.tuev_expiry}</span></div>`:''}
        ${insWarn?`<div class="fleet-detail" style="color:var(--warning)"><span>⚠ Insurance</span><span>${v.insurance_expiry}</span></div>`:''}
      </div>
    </div>`;
  },

  filterVehicles(q) {
    const filtered = this._vehicles.filter(v => JSON.stringify(v).toLowerCase().includes(q.toLowerCase()));
    const grid = document.getElementById('vehicle-grid');
    if (grid) grid.innerHTML = filtered.map(v=>this.vehicleCard(v)).join('');
  },

  filterVehicleStatus(s) {
    const filtered = s ? this._vehicles.filter(v=>v.status===s) : this._vehicles;
    const grid = document.getElementById('vehicle-grid');
    if (grid) grid.innerHTML = filtered.map(v=>this.vehicleCard(v)).join('');
  },

  async showVehicleDetail(id) {
    const v = this._vehicles.find(v=>v.id===id);
    if (!v) return;
    const [fuel, docs, maintenance] = await Promise.all([
      ATLAS.api.get(`/api/fleet/fuel?vehicle_id=${id}`).catch(()=>[]),
      ATLAS.api.get(`/api/fleet/documents?vehicle_id=${id}`).catch(()=>[]),
      ATLAS.api.get(`/api/fleet/maintenance?vehicle_id=${id}`).catch(()=>[]),
    ]);
    const totalFuel = (fuel||[]).reduce((s,f)=>s+(f.total_cost||0),0);
    const totalLit = (fuel||[]).reduce((s,f)=>s+(f.liters||0),0);
    const pending = (maintenance||[]).filter(m=>m.status!=='completed');
    const today = new Date().toISOString().split('T')[0];

    ATLAS.ui.openPanel(`${ATLAS.ui.vehicleIcon(v.type)} ${ATLAS.ui.esc(v.name)}`, `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        ${ATLAS.ui.statusBadge(v.status)}
        ${v.driver_name?`<span style="font-size:12px;color:var(--text-muted);">👤 ${v.driver_name}</span>`:''}
      </div>

      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px;margin-bottom:16px;">
        ${[
          ['Type', v.type+(v.subtype?' / '+v.subtype:'')],
          ['Make / Model', `${v.make||''} ${v.model||''}`.trim()||'–'],
          ['Year', v.year||'–'],
          ['Plate', v.license_plate||'–'],
          ['VIN', v.vin||'–'],
          ['Fuel Type', v.fuel_type||'–'],
          ['Seats', v.seats||'–'],
          ['Payload', v.payload_kg?v.payload_kg+'kg':'–'],
          ['Odometer', (v.odometer_km||0).toLocaleString()+' km'],
          ['TÜV/Inspection', v.tuev_expiry
            ? `<span style="color:${v.tuev_expiry<=new Date(Date.now()+14*864e5).toISOString().split('T')[0]?'var(--warning)':'inherit'}">${v.tuev_expiry}${v.tuev_expiry<today?' ⚠':''}</span>`
            : '–'],
          ['Insurance', v.insurance_expiry
            ? `<span style="color:${v.insurance_expiry<=new Date(Date.now()+30*864e5).toISOString().split('T')[0]?'var(--warning)':'inherit'}">${v.insurance_expiry}${v.insurance_expiry<today?' ⚠':''}</span>`
            : '–'],
        ].map(([k,val])=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);">
            <span style="color:var(--text-muted);font-size:12px;">${k}</span>
            <span style="font-weight:500;font-size:13px;">${val}</span>
          </div>`).join('')}
      </div>

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">ASSIGN DRIVER</div>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <select id="assign-driver-sel" class="form-select" style="flex:1;">
          <option value="">– No Driver –</option>
          ${(this._drivers||[]).map(d=>`<option value="${d.id}" ${d.id===(v.assigned_driver||v.driver_id)?'selected':''}>${d.full_name} (${d.license_class||'?'})</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" onclick="ATLAS.fleet.assignDriver(${v.id})">Assign</button>
      </div>

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">⛽ FUEL LEVEL</div>
      ${(()=>{
        const cap = v.fuel_capacity_l || 0;
        const cur = v.fuel_current_l || 0;
        const avg = v.fuel_avg_l100km || 0;
        const fuelPct = cap > 0 ? Math.min(100, Math.round(cur / cap * 100)) : 0;
        const fuelColor = fuelPct < 20 ? 'var(--danger)' : fuelPct < 40 ? 'var(--warning)' : 'var(--success)';
        const range = (cap > 0 && avg > 0 && cur > 0) ? Math.round(cur / avg * 100) : null;
        return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
            <span style="color:var(--text-muted);">Current / Capacity</span>
            <span style="font-weight:700;color:${fuelColor};">${cur.toFixed(1)} L / ${cap.toFixed(0)} L</span>
          </div>
          <div style="background:var(--border);border-radius:6px;height:10px;overflow:hidden;margin-bottom:4px;">
            <div style="background:${fuelColor};width:${fuelPct}%;height:100%;border-radius:6px;transition:width 0.5s;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
            <span>${fuelPct}% full${avg>0?` · ${avg.toFixed(1)} L/100km avg`:''}</span>
            ${range?`<span>~${range} km range</span>`:''}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px;width:100%;" onclick="ATLAS.fleet.showUpdateFuelLevel(${v.id},${cur},${cap},${avg})">⛽ Update Fuel Level</button>
        </div>`;
      })()}

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">FUEL LOG SUMMARY</div>
      <div class="kpi-grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
        <div class="kpi-card" style="padding:8px 12px;">
          <div class="kpi-label">Total Liters</div>
          <div class="kpi-value" style="font-size:18px;">${totalLit.toFixed(1)} L</div>
        </div>
        <div class="kpi-card" style="padding:8px 12px;">
          <div class="kpi-label">Total Cost</div>
          <div class="kpi-value" style="font-size:18px;">€${totalFuel.toFixed(0)}</div>
        </div>
      </div>

      ${pending.length > 0 ? `
      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--warning);letter-spacing:0.5px;margin-bottom:8px;">⚠ PENDING MAINTENANCE (${pending.length})</div>
      ${pending.map(m=>`
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border);">
          <span>${m.type}</span>
          <span style="color:${m.scheduled_date&&m.scheduled_date<today?'var(--danger)':'var(--warning)'};">${m.scheduled_date||'–'}</span>
        </div>`).join('')}` : ''}

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">DOCUMENTS (${(docs||[]).length})</div>
      ${(docs||[]).length ? docs.map(d=>`
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border);">
          <span>${d.name}</span>
          <span style="color:${d.expiry_date&&d.expiry_date<today?'var(--danger)':'var(--text-muted)'};">${d.expiry_date||'–'}</span>
        </div>`).join('') : '<div style="color:var(--text-muted);font-size:12px;">No documents</div>'}

      <div class="divider"></div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showEditVehicle(${v.id})">✏ ${ATLAS.i18n.t('edit')}</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showAddFuel()">⛽ ${ATLAS.i18n.t('add_fuel')}</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showAddMaintenance()">🔧 Add Maintenance</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showUpdatePosition(${v.id},${v.lat||0},${v.lng||0})">📍 ${ATLAS.i18n.t('update_position')}</button>
        ${v.lat&&v.lng?`<button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.navigateToVehicle(${v.lat},${v.lng})">🧭 Navigate</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="ATLAS.fleet.showDispatch(${v.id},'${v.name.replace(/'/g,"\\'")}')">🚨 ${ATLAS.i18n.t('dispatch_vehicle')}</button>
      </div>`);
  },

  async assignDriver(vehicleId) {
    const driverId = document.getElementById('assign-driver-sel')?.value;
    try {
      await ATLAS.api.put(`/api/fleet/vehicles/${vehicleId}`, {
        assigned_driver: driverId ? parseInt(driverId, 10) : null
      });
      ATLAS.ui.toast('Driver assigned', 'success');
      ATLAS.ui.closePanel();
      await this.switchTab('vehicles');
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  navigateToVehicle(lat, lng) {
    ATLAS.ui.closePanel();
    ATLAS.state.navDestLat = lat;
    ATLAS.state.navDestLng = lng;
    ATLAS.router.go('navigation');
  },

  moveVehicleMarker(id, lat, lng) {
    const marker = ATLAS.state.fleetMapMarkers?.[id];
    if (marker) {
      marker.setLatLng([lat, lng]);
    }
  },

  async refresh() {
    if (ATLAS.state.currentPage === 'fleet') {
      const el = document.getElementById('main-content');
      if (el) await this.render(el);
    }
  },

  onDispatchRequest(data) {
    // Show modal to accept/decline dispatch
    ATLAS.ui.modal(`🚨 ${ATLAS.i18n.t('dispatch_request')}`, `
      <div style="text-align:center;padding:8px 0 16px;">
        <div style="font-size:32px;margin-bottom:8px;">🚗</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px;">${data.vehicle_name}</div>
        <div style="color:var(--text-muted);margin-bottom:4px;">Von: ${data.dispatched_by}</div>
        <div style="margin:12px 0;padding:12px;background:var(--bg-input);border-radius:8px;">${data.message}</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">
          <button class="btn btn-success" onclick="ATLAS.fleet._respondDispatch(${data.vehicle_id},'accept')">
            ✅ ${ATLAS.i18n.t('dispatch_accept')}
          </button>
          <button class="btn btn-danger" onclick="ATLAS.fleet._showDeclineForm(${data.vehicle_id})">
            ❌ ${ATLAS.i18n.t('dispatch_decline')}
          </button>
        </div>
        <div id="dispatch-decline-form" style="display:none;margin-top:12px;">
          <input id="dispatch-decline-reason" class="form-control" placeholder="${ATLAS.i18n.t('dispatch_reason')}" style="margin-bottom:8px;">
          <button class="btn btn-danger btn-sm" onclick="ATLAS.fleet._respondDispatch(${data.vehicle_id},'decline')">Ablehnen</button>
        </div>
      </div>`);
    ATLAS.audio.play('digital_beep');
  },

  _showDeclineForm(vid) {
    const f = document.getElementById('dispatch-decline-form');
    if (f) f.style.display = 'block';
  },

  async _respondDispatch(vid, action) {
    try {
      if (action === 'accept') {
        await ATLAS.api.post(`/api/fleet/vehicles/${vid}/dispatch/accept`, {});
        ATLAS.ui.toast(ATLAS.i18n.t('dispatch_accept'), 'success');
      } else {
        const reason = document.getElementById('dispatch-decline-reason')?.value || '';
        await ATLAS.api.post(`/api/fleet/vehicles/${vid}/dispatch/decline`, { reason });
        ATLAS.ui.toast(ATLAS.i18n.t('dispatch_decline'), 'info');
      }
      ATLAS.ui.closeModal();
    } catch(e) {
      ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error');
    }
  },

  showDispatch(vehicleId, vehicleName) {
    const incidents = ATLAS.state.incidents?.filter(i => i.status !== 'resolved') || [];
    ATLAS.ui.modal(`🚨 ${ATLAS.i18n.t('dispatch_vehicle')}: ${vehicleName}`, `
      <div class="form-group">
        <label class="form-label">Einsatz (optional)</label>
        <select id="dispatch-incident-sel" class="form-control">
          <option value="">– Kein Einsatz ausgewählt –</option>
          ${incidents.map(i => `<option value="${i.id}">[${i.severity.toUpperCase()}] ${ATLAS.ui.esc(i.title)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nachricht an Fahrer</label>
        <input id="dispatch-msg" class="form-control" value="Einsatz zugewiesen – bitte bestätigen">
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-danger" onclick="ATLAS.fleet._sendDispatch(${vehicleId})">🚨 Alarmieren</button>
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      </div>`);
  },

  async _sendDispatch(vehicleId) {
    const incidentId = document.getElementById('dispatch-incident-sel')?.value || null;
    const message = document.getElementById('dispatch-msg')?.value || 'Einsatz zugewiesen';
    try {
      const r = await ATLAS.api.post(`/api/fleet/vehicles/${vehicleId}/dispatch`, {
        incident_id: incidentId ? parseInt(incidentId, 10) : null,
        message
      });
      ATLAS.ui.closeModal();
      const notified = r.driver_notified ? '– Fahrer benachrichtigt' : '– Kein Fahrer zugewiesen';
      ATLAS.ui.toast(`🚨 ${r.vehicle} alarmiert ${notified}`, 'success');
    } catch(e) {
      ATLAS.ui.toast(ATLAS.i18n.t('error') + ': ' + (e.message||''), 'error');
    }
  },

  async renderDrivers(el) {
    const drivers = await ATLAS.api.get('/api/fleet/drivers') || [];
    this._drivers = drivers;
    el.innerHTML = `
      <div class="card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>${ATLAS.i18n.t('name')}</th><th>License</th><th>Expiry</th><th>Vehicle</th><th>Status</th><th></th></tr></thead>
            <tbody>${drivers.map(d=>`
              <tr>
                <td><div style="font-weight:600;">${d.full_name}</div><div style="font-size:11px;color:var(--text-muted);">${d.phone||''}</div></td>
                <td><code>${d.license_class}</code></td>
                <td style="color:${d.license_expiry&&d.license_expiry<new Date(Date.now()+30*864e5).toISOString().split('T')[0]?'var(--warning)':'inherit'}">${d.license_expiry||'–'}</td>
                <td>${d.vehicle_name||'–'}</td>
                <td>${ATLAS.ui.statusBadge(d.status)}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showEditDriver(${JSON.stringify(d).replace(/"/g,'&quot;')})">Edit</button></td>
              </tr>`).join('')||`<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">No drivers</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  },

  async renderTrips(el) {
    const trips = await ATLAS.api.get('/api/fleet/trips') || [];
    this._trips = trips;
    const active = trips.filter(t=>t.status==='active').length;
    const planned = trips.filter(t=>t.status==='planned').length;
    const completed = trips.filter(t=>t.status==='completed').length;
    el.innerHTML = `
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('planned')"><div class="kpi-label">Planned</div><div class="kpi-value" style="color:var(--text-muted);">${planned}</div><div class="kpi-icon">📅</div></div>
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('active')"><div class="kpi-label">Active</div><div class="kpi-value" style="color:var(--success);">${active}</div><div class="kpi-icon">🛣️</div></div>
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('completed')"><div class="kpi-label">Completed</div><div class="kpi-value" style="color:var(--accent);">${completed}</div><div class="kpi-icon">✅</div></div>
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('')"><div class="kpi-label">Total km</div><div class="kpi-value">${trips.reduce((s,t)=>s+(t.distance_km||0),0).toFixed(0)}</div><div class="kpi-icon">📏</div></div>
      </div>
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input class="form-input" style="flex:1;" placeholder="Search trips..." id="trip-search" oninput="ATLAS.fleet._filterTrips('')">
          <select class="form-select" style="width:150px;" id="trip-status-filter" onchange="ATLAS.fleet._filterTrips(this.value)">
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Trip</th><th>Vehicle</th><th>Driver</th><th>Departure</th><th>Status</th><th>Distance</th><th>Actions</th></tr></thead>
            <tbody id="trips-tbody">${this._renderTripRows(trips)}</tbody>
          </table>
        </div>
      </div>`;
  },

  _renderTripRows(trips) {
    return trips.map(t=>`
      <tr>
        <td>
          <div style="font-weight:600;">${t.title}</div>
          <div style="font-size:11px;color:var(--text-muted);">${t.origin||''}${t.origin&&t.destination?' → ':''}${t.destination||''}</div>
        </td>
        <td>${t.vehicle_name||'–'}</td>
        <td>${t.driver_name||'–'}</td>
        <td style="font-size:12px;white-space:nowrap;">${ATLAS.ui.formatDateShort(t.departure_time)}</td>
        <td>${ATLAS.ui.statusBadge(t.status)}</td>
        <td>${t.distance_km?t.distance_km+' km':'–'}</td>
        <td>
          <div style="display:flex;gap:4px;">
            ${t.status==='active'?`<button class="btn btn-success btn-sm" onclick="ATLAS.fleet.completeTrip(${t.id})" title="Mark trip complete">✓ Done</button>`:''}
            ${t.status==='planned'?`<button class="btn btn-primary btn-sm" onclick="ATLAS.fleet.startTrip(${t.id})" title="Start trip">▶ Start</button>`:''}
            ${t.destination?`<button class="btn btn-secondary btn-sm" onclick="ATLAS.navigation.setDestination('${t.destination.replace(/'/g,'\\\'')}')" title="Navigate to destination">🧭</button>`:''}
          </div>
        </td>
      </tr>`).join('')||`<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted);">No trips found</td></tr>`;
  },

  _filterTrips(status) {
    if (status) {
      const sel = document.getElementById('trip-status-filter');
      if (sel) sel.value = status;
    }
    const q = (document.getElementById('trip-search')?.value||'').toLowerCase();
    const statusF = document.getElementById('trip-status-filter')?.value||'';
    const filtered = (this._trips||[]).filter(t => {
      if (statusF && t.status !== statusF) return false;
      if (q && !JSON.stringify(t).toLowerCase().includes(q)) return false;
      return true;
    });
    const tbody = document.getElementById('trips-tbody');
    if (tbody) tbody.innerHTML = this._renderTripRows(filtered);
  },

  async startTrip(id) {
    // Find vehicle_id from cached trips so backend can update vehicle status
    const trip = (this._trips || []).find(t => t.id === id);
    try {
      await ATLAS.api.put(`/api/fleet/trips/${id}`, {
        status: 'active',
        vehicle_id: trip?.vehicle_id,
      });
      ATLAS.ui.toast('Trip started!', 'success');
      await this.switchTab('trips');
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async completeTrip(id) {
    const trip = (this._trips || []).find(t => t.id === id);
    const vehicle = trip?.vehicle_id ? (this._vehicles || []).find(v => v.id === trip.vehicle_id) : null;
    ATLAS.ui.modal(`✅ ${ATLAS.i18n.t('complete_trip')}: ${trip?.title||'#'+id}`, `
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        ${trip?.origin||''}${trip?.origin&&trip?.destination?' → ':''}${trip?.destination||''}
        ${vehicle?`<br>Vehicle: <strong>${vehicle.name}</strong>`:''}
      </p>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('fuel_used')} (optional)</label>
          <input id="ct-fuel" class="form-input" type="number" step="0.1" min="0" placeholder="e.g. 42.5">
        </div>
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('odometer')} km at end (optional)</label>
          <input id="ct-odo" class="form-input" type="number" step="0.1" value="${vehicle?.odometer_km||''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('completed_notes')} (optional)</label>
        <textarea id="ct-notes" class="form-textarea" rows="3" placeholder="Any notes about the trip..."></textarea>
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--text-muted);">
        <input type="checkbox" id="ct-use-gps" onchange="ATLAS.fleet._toggleCompleteTripGPS(this.checked)">
        <label for="ct-use-gps" style="cursor:pointer;">Use current GPS position as end location</label>
      </div>
      <div id="ct-gps-status" style="font-size:11px;color:var(--text-muted);margin-top:4px;display:none;"></div>
      <input type="hidden" id="ct-lat"><input type="hidden" id="ct-lng">`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-success" onclick="ATLAS.fleet._doCompleteTrip(${id})">✅ ${ATLAS.i18n.t('complete_trip')}</button>`,
      'modal-lg'
    );
  },

  _toggleCompleteTripGPS(checked) {
    const statusEl = document.getElementById('ct-gps-status');
    if (!checked) { if(statusEl) statusEl.style.display='none'; return; }
    if (statusEl) { statusEl.style.display='block'; statusEl.textContent='📡 Getting GPS position...'; }
    navigator.geolocation?.getCurrentPosition(
      pos => {
        document.getElementById('ct-lat').value = pos.coords.latitude;
        document.getElementById('ct-lng').value = pos.coords.longitude;
        if (statusEl) statusEl.textContent = `✅ GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      },
      err => {
        if (statusEl) statusEl.textContent = `❌ GPS error: ${err.message}`;
        const chk = document.getElementById('ct-use-gps');
        if (chk) chk.checked = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  async _doCompleteTrip(id) {
    const fuel_used = parseFloat(document.getElementById('ct-fuel')?.value) || 0;
    const odoVal = document.getElementById('ct-odo')?.value;
    const end_odometer = (odoVal !== '' && odoVal != null) ? parseFloat(odoVal) : null;
    const notes = document.getElementById('ct-notes')?.value || '';
    const latVal = document.getElementById('ct-lat')?.value;
    const lngVal = document.getElementById('ct-lng')?.value;
    const lat = latVal !== '' ? parseFloat(latVal) : null;
    const lng = lngVal !== '' ? parseFloat(lngVal) : null;
    const body = { completed_notes: notes };
    if (fuel_used > 0) body.fuel_used_l = fuel_used;
    if (end_odometer !== null) body.end_odometer_km = end_odometer;
    if (lat !== null && !isNaN(lat) && lng !== null && !isNaN(lng)) { body.end_lat = lat; body.end_lng = lng; }
    try {
      await ATLAS.api.post(`/api/fleet/trips/${id}/complete`, body);
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Trip completed!', 'success');
      await this.switchTab('trips');
      await this.loadStats();
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to complete trip', 'warning'); }
  },

  async renderMaintenance(el) {
    const items = await ATLAS.api.get('/api/fleet/maintenance') || [];
    this._maintenance = items;
    el.innerHTML = `
      <div class="card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Vehicle</th><th>Type</th><th>Scheduled</th><th>Cost</th><th>Status</th><th></th></tr></thead>
            <tbody>${items.map(m=>`
              <tr>
                <td style="font-weight:600;">${m.vehicle_name||'–'}</td>
                <td>${m.type}</td>
                <td style="color:${m.scheduled_date&&m.scheduled_date<new Date().toISOString().split('T')[0]?'var(--warning)':'inherit'};font-size:12px;">${m.scheduled_date||'–'}</td>
                <td>${m.cost?'€'+m.cost:'–'}</td>
                <td>${ATLAS.ui.statusBadge(m.status)}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.completeMaintenance(${m.id})">✓ Done</button></td>
              </tr>`).join('')||`<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">No maintenance scheduled</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  },

  async completeMaintenance(id) {
    try {
      await ATLAS.api.put(`/api/fleet/maintenance/${id}`, { status:'completed', completed_date: new Date().toISOString().split('T')[0] });
      ATLAS.ui.toast('Maintenance marked complete', 'success');
      await this.switchTab('maintenance');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to complete maintenance', 'warning'); }
  },

  async renderFuel(el) {
    const logs = await ATLAS.api.get('/api/fleet/fuel') || [];
    const total = logs.reduce((s,f)=>s+(f.total_cost||0),0);
    const totalL = logs.reduce((s,f)=>s+(f.liters||0),0);
    const pplLogs = logs.filter(f=>f.cost_per_liter);
    const avgPpl = pplLogs.length > 0 ? pplLogs.reduce((s,f)=>s+f.cost_per_liter,0) / pplLogs.length : 0;

    // Group cost by vehicle for chart
    const byCar = {};
    logs.forEach(f => { if (f.vehicle_name) { byCar[f.vehicle_name]=(byCar[f.vehicle_name]||0)+(f.total_cost||0); } });
    const carNames = Object.keys(byCar);
    const carCosts = carNames.map(k=>byCar[k]);

    el.innerHTML = `
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card"><div class="kpi-label">Total Entries</div><div class="kpi-value">${logs.length}</div><div class="kpi-icon">🧾</div></div>
        <div class="kpi-card"><div class="kpi-label">Total Liters</div><div class="kpi-value">${totalL.toFixed(0)} L</div><div class="kpi-icon">⛽</div></div>
        <div class="kpi-card"><div class="kpi-label">Total Cost</div><div class="kpi-value">€${total.toFixed(0)}</div><div class="kpi-icon">💶</div></div>
        <div class="kpi-card"><div class="kpi-label">Avg €/Liter</div><div class="kpi-value">${avgPpl?'€'+avgPpl.toFixed(3):'–'}</div><div class="kpi-icon">📊</div></div>
      </div>
      ${carNames.length > 1 ? `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">💶 Fuel Cost by Vehicle</div>
        <div style="height:200px;position:relative;"><canvas id="fuel-chart"></canvas></div>
      </div>` : ''}
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input class="form-input" style="flex:1;" placeholder="Filter by vehicle or station..." oninput="ATLAS.fleet._filterFuel(this.value)">
          <select class="form-select" style="width:180px;" id="fuel-vehicle-filter" onchange="ATLAS.fleet._filterFuelByVehicle(this.value)">
            <option value="">All vehicles</option>
            ${[...new Set(logs.map(f=>f.vehicle_name).filter(Boolean))].map(n=>`<option value="${n}">${n}</option>`).join('')}
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>€/L</th><th>Total</th><th>Odometer</th><th>Station</th></tr></thead>
            <tbody id="fuel-tbody">${this._renderFuelRows(logs)}</tbody>
          </table>
        </div>
      </div>`;
    this._fuelLogs = logs;

    // Draw fuel cost chart
    if (carNames.length > 1 && window.Chart) {
      setTimeout(() => {
        const ctx = document.getElementById('fuel-chart');
        if (!ctx) return;
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const colors = carNames.map((_,i) => `hsl(${(i*47+200)%360},65%,55%)`);
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: carNames,
            datasets: [{ label: 'Fuel Cost (€)', data: carCosts, backgroundColor: colors, borderRadius: 4 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#888', font:{size:11} }, grid: { color: 'rgba(255,255,255,0.04)' } },
              y: { beginAtZero: true, ticks: { color: '#888', callback: v=>'€'+v }, grid: { color: 'rgba(255,255,255,0.04)' } }
            }
          }
        });
      }, 50);
    }
  },

  _renderFuelRows(logs) {
    return logs.map(f=>`
      <tr>
        <td style="font-weight:600;">${f.vehicle_name||'–'}</td>
        <td style="font-size:12px;">${f.date}</td>
        <td>${f.liters} L</td>
        <td>${f.cost_per_liter?'€'+f.cost_per_liter:'–'}</td>
        <td style="font-weight:600;color:var(--accent);">€${(f.total_cost||0).toFixed(2)}</td>
        <td style="font-size:12px;">${f.odometer_km?.toLocaleString()||'–'} km</td>
        <td style="font-size:12px;">${f.station||'–'}</td>
      </tr>`).join('')||`<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted);">No fuel logs</td></tr>`;
  },

  _filterFuel(q) {
    const qL = q.toLowerCase();
    const filtered = (this._fuelLogs||[]).filter(f => !qL || JSON.stringify(f).toLowerCase().includes(qL));
    const tbody = document.getElementById('fuel-tbody');
    if (tbody) tbody.innerHTML = this._renderFuelRows(filtered);
  },

  _filterFuelByVehicle(name) {
    const filtered = name ? (this._fuelLogs||[]).filter(f=>f.vehicle_name===name) : (this._fuelLogs||[]);
    const tbody = document.getElementById('fuel-tbody');
    if (tbody) tbody.innerHTML = this._renderFuelRows(filtered);
  },

  renderFleetMap(el) {
    el.innerHTML = `
      <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
        <div style="display:flex;gap:6px;">
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#10b981;display:inline-block;"></span> Active</span>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#60a5fa;display:inline-block;"></span> Available</span>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#fbbf24;display:inline-block;"></span> Maintenance</span>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#6b7280;display:inline-block;"></span> Out of Service</span>
        </div>
        <div style="margin-left:auto;font-size:12px;color:var(--text-muted);">
          ${this._vehicles.filter(v=>v.lat&&v.lng).length} / ${this._vehicles.length} vehicles with GPS
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;"><div id="fleet-map" style="height:520px;"></div></div>`;

    setTimeout(() => {
      if (!window.L) return;
      const el2 = document.getElementById('fleet-map');
      if (!el2) return;
      // If old map exists but container is gone (page was re-rendered), destroy and recreate
      if (this._fleetMap) {
        if (el2._leaflet_id) { this._fleetMap.invalidateSize(); return; }
        try { this._fleetMap.remove(); } catch(e) {}
        this._fleetMap = null;
      }
      this._fleetMap = L.map('fleet-map').setView([51.1657, 10.4515], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this._fleetMap);
      ATLAS.state.fleetMapMarkers = {};
      const bounds = [];
      this._vehicles.forEach(v => {
        if (!v.lat || !v.lng) return;
        const color = v.status==='on_trip'?'#10b981':v.status==='maintenance'?'#fbbf24':v.status==='out_of_service'?'#6b7280':'#60a5fa';
        const icon = L.divIcon({
          html:`<div style="background:${color};border:2.5px solid white;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.4);transition:transform 0.2s;" title="${ATLAS.ui.esc(v.name)}">${ATLAS.ui.vehicleIcon(v.type)}</div>`,
          iconSize:[34,34], iconAnchor:[17,17], className:''
        });
        const marker = L.marker([v.lat,v.lng],{icon}).addTo(this._fleetMap);
        marker.bindPopup(`
          <div style="min-width:160px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${ATLAS.ui.vehicleIcon(v.type)} ${ATLAS.ui.esc(v.name)}</div>
            <div style="font-size:12px;color:#888;margin-bottom:6px;">${v.make||''} ${v.model||''} ${v.year?'('+v.year+')':''}</div>
            <div style="font-size:12px;margin-bottom:3px;">🔑 ${v.license_plate||'–'}</div>
            ${v.driver_name?`<div style="font-size:12px;margin-bottom:3px;">👤 ${v.driver_name}</div>`:''}
            <div style="font-size:12px;margin-bottom:6px;">📏 ${(v.odometer_km||0).toLocaleString()} km</div>
            <div style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;background:${color}20;color:${color};display:inline-block;">${v.status.replace(/_/g,' ')}</div>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <a href="javascript:void(0)" onclick="ATLAS.fleet.showVehicleDetail(${v.id})" style="font-size:11px;color:#60a5fa;">Detail →</a>
            </div>
          </div>`, { maxWidth: 220 });
        ATLAS.state.fleetMapMarkers[v.id] = marker;
        bounds.push([v.lat, v.lng]);
      });
      if (bounds.length > 0) this._fleetMap.fitBounds(bounds, { padding: [50,50] });
    }, 100);
  },

  showUpdateFuelLevel(vehicleId, currentL, capacityL, avgL100) {
    ATLAS.ui.modal('⛽ Update Fuel Level', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('fuel_current')} (L)</label>
          <input id="ufl-current" class="form-input" type="number" step="0.1" min="0" value="${(currentL||0).toFixed(1)}" placeholder="Current fuel in liters">
        </div>
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('fuel_capacity')} (L)</label>
          <input id="ufl-cap" class="form-input" type="number" step="0.1" min="1" value="${(capacityL||60).toFixed(0)}" placeholder="Tank capacity in liters">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('fuel_avg')} (optional)</label>
        <input id="ufl-avg" class="form-input" type="number" step="0.1" min="0" value="${(avgL100||10).toFixed(1)}" placeholder="e.g. 10.5">
      </div>
      <div id="ufl-preview" style="font-size:12px;color:var(--text-muted);margin-top:8px;"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet._doUpdateFuelLevel(${vehicleId})">💾 ${ATLAS.i18n.t('save')}</button>`
    );
    // Live range preview
    const updatePreview = () => {
      const cur = parseFloat(document.getElementById('ufl-current')?.value)||0;
      const cap = parseFloat(document.getElementById('ufl-cap')?.value)||0;
      const avg = parseFloat(document.getElementById('ufl-avg')?.value)||0;
      const pct = cap > 0 ? Math.round(cur/cap*100) : 0;
      const range = (avg > 0 && cur > 0) ? Math.round(cur/avg*100) : 0;
      const el = document.getElementById('ufl-preview');
      if (el) el.innerHTML = `Fill level: <strong>${pct}%</strong>${range?' · Range: <strong>~'+range+' km</strong>':''}`;
    };
    setTimeout(() => {
      ['ufl-current','ufl-cap','ufl-avg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreview);
      });
      updatePreview();
    }, 50);
  },

  async _doUpdateFuelLevel(vehicleId) {
    const cur = parseFloat(document.getElementById('ufl-current')?.value);
    const cap = parseFloat(document.getElementById('ufl-cap')?.value);
    const avg = parseFloat(document.getElementById('ufl-avg')?.value)||null;
    if (isNaN(cur) || isNaN(cap)) { ATLAS.ui.toast('Please enter valid values', 'warning'); return; }
    if (cur > cap) { ATLAS.ui.toast('Current fuel cannot exceed tank capacity', 'warning'); return; }
    const body = { fuel_current_l: cur, fuel_capacity_l: cap };
    if (avg) body.fuel_avg_l100km = avg;
    try {
      await ATLAS.api.put(`/api/fleet/vehicles/${vehicleId}/fuel`, body);
      ATLAS.ui.closeModal();
      ATLAS.ui.closePanel();
      ATLAS.ui.toast('Fuel level updated', 'success');
      await this.switchTab('vehicles');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to update fuel level', 'warning'); }
  },

  showUpdatePosition(vehicleId, currentLat, currentLng) {
    ATLAS.ui.modal('📍 Update Vehicle Position', ATLAS.geo.widget('upd', currentLat, currentLng),
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet._doUpdatePosition(${vehicleId})">💾 ${ATLAS.i18n.t('save')}</button>`
    );
  },

  async _doUpdatePosition(vehicleId) {
    const lat = parseFloat(document.getElementById('upd-lat')?.value);
    const lng = parseFloat(document.getElementById('upd-lng')?.value);
    if (isNaN(lat) || isNaN(lng)) { ATLAS.ui.toast('Invalid coordinates', 'warning'); return; }
    try {
      await ATLAS.api.post(`/api/fleet/vehicles/${vehicleId}/position`, { lat, lng });
      ATLAS.ui.closeModal();
      ATLAS.ui.closePanel();
      ATLAS.ui.toast('Position updated', 'success');
      await this.switchTab('map');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to update position', 'warning'); }
  },

  showAdd() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_vehicle'), `
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="nv-name" class="form-input" placeholder="Vehicle name"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('type')}</label>
          <select id="nv-type" class="form-select"><option value="car">Car/PKW</option><option value="van">Van/Transporter</option><option value="bus">Bus</option><option value="truck">Truck</option><option value="aircraft">Aircraft</option><option value="helicopter">Helicopter</option><option value="jet">Jet</option><option value="ship">Ship</option><option value="boat">Boat</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('make')}</label><input id="nv-make" class="form-input" placeholder="Mercedes"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('model')}</label><input id="nv-model" class="form-input" placeholder="Sprinter"></div>
      </div>
      <div class="form-row col-3">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('year')}</label><input id="nv-year" class="form-input" type="number" value="${new Date().getFullYear()}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('license_plate')}</label><input id="nv-plate" class="form-input"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_type')}</label>
          <select id="nv-fuel" class="form-select"><option>diesel</option><option>gasoline</option><option>electric</option><option>hybrid</option><option>avgas</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('insurance_expiry')}</label><input id="nv-ins" class="form-input" type="date"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('tuev_expiry')}</label><input id="nv-tuev" class="form-input" type="date"></div>
      </div>`, 
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createVehicle()">+ ${ATLAS.i18n.t('create')}</button>`, 'modal-lg'
    );
  },

  async createVehicle() {
    const name = document.getElementById('nv-name').value.trim();
    if (!name) return;
    try {
      await ATLAS.api.post('/api/fleet/vehicles', {
        name, type: document.getElementById('nv-type').value,
        make: document.getElementById('nv-make').value, model: document.getElementById('nv-model').value,
        year: parseInt(document.getElementById('nv-year').value)||null,
        license_plate: document.getElementById('nv-plate').value,
        fuel_type: document.getElementById('nv-fuel').value,
        insurance_expiry: document.getElementById('nv-ins').value||null,
        tuev_expiry: document.getElementById('nv-tuev').value||null,
        status: 'available',
      });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(`Vehicle "${name}" added`, 'success');
      await this.loadStats();
      await this.switchTab('vehicles');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to create vehicle', 'warning'); }
  },

  showAddDriver() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_driver'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="nd-name" class="form-input"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Class</label><input id="nd-lic" class="form-input" placeholder="B,BE,C"></div>
        <div class="form-group"><label class="form-label">License Expiry</label><input id="nd-exp" class="form-input" type="date"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Phone</label><input id="nd-phone" class="form-input"></div>
        <div class="form-group"><label class="form-label">Email</label><input id="nd-email" class="form-input" type="email"></div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createDriver()">+ ${ATLAS.i18n.t('create')}</button>`
    );
  },

  async createDriver() {
    const name = document.getElementById('nd-name').value.trim();
    if (!name) return;
    try {
      await ATLAS.api.post('/api/fleet/drivers', { full_name:name, license_class:document.getElementById('nd-lic').value, license_expiry:document.getElementById('nd-exp').value||null, phone:document.getElementById('nd-phone').value, email:document.getElementById('nd-email').value });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Driver added','success'); await this.switchTab('drivers');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to add driver', 'warning'); }
  },

  showAddTrip() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_trip'), `
      <div class="form-group"><label class="form-label">Trip Title</label><input id="nt-title" class="form-input"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Vehicle</label>
          <select id="nt-vehicle" class="form-select"><option value="">– select –</option>${this._vehicles.map(v=>`<option value="${v.id}">${ATLAS.ui.esc(v.name)}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label class="form-label">Driver</label>
          <select id="nt-driver" class="form-select"><option value="">– optional –</option>${this._drivers.map(d=>`<option value="${d.id}">${d.full_name}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Origin</label><input id="nt-origin" class="form-input" placeholder="City or address"></div>
        <div class="form-group"><label class="form-label">Destination</label><input id="nt-dest" class="form-input" placeholder="City or address"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Departure</label><input id="nt-dep" class="form-input" type="datetime-local"></div>
        <div class="form-group"><label class="form-label">Est. Arrival</label><input id="nt-arr" class="form-input" type="datetime-local"></div>
      </div>
      <div class="form-group"><label class="form-label">Distance (km)</label><input id="nt-dist" class="form-input" type="number"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createTrip()">+ ${ATLAS.i18n.t('create')}</button>`, 'modal-lg'
    );
  },

  async createTrip() {
    const title = document.getElementById('nt-title').value.trim();
    const vid = document.getElementById('nt-vehicle').value;
    if (!title || !vid) { ATLAS.ui.toast('Title and vehicle required','warning'); return; }
    try {
      await ATLAS.api.post('/api/fleet/trips', { title, vehicle_id:parseInt(vid,10), driver_id:parseInt(document.getElementById('nt-driver').value,10)||null, origin:document.getElementById('nt-origin').value, destination:document.getElementById('nt-dest').value, departure_time:document.getElementById('nt-dep').value||null, estimated_arrival:document.getElementById('nt-arr').value||null, distance_km:parseFloat(document.getElementById('nt-dist').value)||null });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Trip created','success'); await this.switchTab('trips');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to create trip', 'warning'); }
  },

  showAddMaintenance() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_maintenance'), `
      <div class="form-group"><label class="form-label">Vehicle</label>
        <select id="nm-vehicle" class="form-select"><option value="">– select –</option>${this._vehicles.map(v=>`<option value="${v.id}">${ATLAS.ui.esc(v.name)}</option>`).join('')}</select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Type</label>
          <select id="nm-type" class="form-select"><option>oil_change</option><option>tire_change</option><option>tuev</option><option>brake_inspection</option><option>general</option></select>
        </div>
        <div class="form-group"><label class="form-label">Scheduled Date</label><input id="nm-date" class="form-input" type="date"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Cost (€)</label><input id="nm-cost" class="form-input" type="number"></div>
        <div class="form-group"><label class="form-label">Technician</label><input id="nm-tech" class="form-input"></div>
      </div>
      <div class="form-group"><label class="form-label">Notes</label><textarea id="nm-notes" class="form-textarea"></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createMaintenance()">+ ${ATLAS.i18n.t('create')}</button>`
    );
  },

  async createMaintenance() {
    const vid = document.getElementById('nm-vehicle').value;
    if (!vid) return;
    try {
      await ATLAS.api.post('/api/fleet/maintenance', { vehicle_id:parseInt(vid,10), type:document.getElementById('nm-type').value, scheduled_date:document.getElementById('nm-date').value||null, cost:parseFloat(document.getElementById('nm-cost').value)||null, technician:document.getElementById('nm-tech').value, notes:document.getElementById('nm-notes').value });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Maintenance scheduled','success'); await this.switchTab('maintenance');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to schedule maintenance', 'warning'); }
  },

  showAddFuel() {
    ATLAS.ui.modal(ATLAS.i18n.t('add_fuel'), `
      <div class="form-group"><label class="form-label">Vehicle</label>
        <select id="nf-vehicle" class="form-select"><option value="">– select –</option>${this._vehicles.map(v=>`<option value="${v.id}">${ATLAS.ui.esc(v.name)}</option>`).join('')}</select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Date</label><input id="nf-date" class="form-input" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Liters</label><input id="nf-liters" class="form-input" type="number" step="0.1"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">€/Liter</label><input id="nf-ppl" class="form-input" type="number" step="0.001"></div>
        <div class="form-group"><label class="form-label">Odometer (km)</label><input id="nf-odo" class="form-input" type="number"></div>
      </div>
      <div class="form-group"><label class="form-label">Station</label><input id="nf-station" class="form-input"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createFuel()">+ Add</button>`
    );
  },

  async createFuel() {
    const vid = document.getElementById('nf-vehicle').value;
    const liters = parseFloat(document.getElementById('nf-liters').value);
    if (!vid || !liters) return;
    const ppl = parseFloat(document.getElementById('nf-ppl').value)||0;
    try {
      await ATLAS.api.post('/api/fleet/fuel', { vehicle_id:parseInt(vid,10), date:document.getElementById('nf-date').value, liters, cost_per_liter:ppl||null, total_cost:ppl*liters||null, odometer_km:parseFloat(document.getElementById('nf-odo').value)||null, station:document.getElementById('nf-station').value });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Fuel log added','success'); await this.switchTab('fuel');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to add fuel log', 'warning'); }
  },

  showEditVehicle(id) {
    const v = this._vehicles.find(v => v.id === id);
    if (!v) { ATLAS.ui.toast('Vehicle not found', 'warning'); return; }
    ATLAS.ui.modal(`Edit: ${ATLAS.ui.esc(v.name)}`, `
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="ev-name" class="form-input" value="${v.name||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="ev-status" class="form-select">
            <option value="available" ${v.status==='available'?'selected':''}>Available</option>
            <option value="on_trip" ${v.status==='on_trip'?'selected':''}>On Trip</option>
            <option value="maintenance" ${v.status==='maintenance'?'selected':''}>Maintenance</option>
            <option value="out_of_service" ${v.status==='out_of_service'?'selected':''}>Out of Service</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('make')}</label><input id="ev-make" class="form-input" value="${v.make||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('model')}</label><input id="ev-model" class="form-input" value="${v.model||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('license_plate')}</label><input id="ev-plate" class="form-input" value="${v.license_plate||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('odometer')}</label><input id="ev-odo" class="form-input" type="number" value="${v.odometer_km||0}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('tuev_expiry')}</label><input id="ev-tuev" class="form-input" type="date" value="${v.tuev_expiry||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('insurance_expiry')}</label><input id="ev-ins" class="form-input" type="date" value="${v.insurance_expiry||''}"></div>
      </div>
      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">⛽ FUEL / ENERGY</div>
      <div class="form-row col-3">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_capacity')} (L)</label><input id="ev-fcap" class="form-input" type="number" step="0.1" value="${v.fuel_capacity_l||60}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_current')} (L)</label><input id="ev-fcur" class="form-input" type="number" step="0.1" min="0" value="${v.fuel_current_l||0}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_avg')} (L/100km)</label><input id="ev-favg" class="form-input" type="number" step="0.1" min="0" value="${v.fuel_avg_l100km||10}"></div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.updateVehicle(${v.id})">${ATLAS.i18n.t('save')}</button>`,
      'modal-lg'
    );
  },

  async updateVehicle(id) {
    const body = {
      name: document.getElementById('ev-name').value,
      status: document.getElementById('ev-status').value,
      make: document.getElementById('ev-make').value,
      model: document.getElementById('ev-model').value,
      license_plate: document.getElementById('ev-plate').value,
      odometer_km: parseFloat(document.getElementById('ev-odo').value)||0,
      tuev_expiry: document.getElementById('ev-tuev').value||null,
      insurance_expiry: document.getElementById('ev-ins').value||null,
    };
    // Fuel fields (optional — only set if present in DOM)
    const fcap = document.getElementById('ev-fcap');
    const fcur = document.getElementById('ev-fcur');
    const favg = document.getElementById('ev-favg');
    if (fcap) body.fuel_capacity_l = parseFloat(fcap.value)||null;
    if (fcur) body.fuel_current_l = parseFloat(fcur.value)||0;
    if (favg) body.fuel_avg_l100km = parseFloat(favg.value)||null;
    try {
      await ATLAS.api.put(`/api/fleet/vehicles/${id}`, body);
      // Also update fuel-specific fields via the fuel endpoint if provided
      if (fcap || fcur || favg) {
        const fuelBody = {};
        if (fcap && parseFloat(fcap.value)) fuelBody.fuel_capacity_l = parseFloat(fcap.value);
        if (fcur) fuelBody.fuel_current_l = parseFloat(fcur.value)||0;
        if (favg && parseFloat(favg.value)) fuelBody.fuel_avg_l100km = parseFloat(favg.value);
        if (Object.keys(fuelBody).length) {
          await ATLAS.api.put(`/api/fleet/vehicles/${id}/fuel`, fuelBody).catch(()=>{});
        }
      }
      ATLAS.ui.closePanel();
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Vehicle updated', 'success');
      await this.switchTab('vehicles');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to update vehicle', 'warning'); }
  },

  showEditDriver(d) {
    ATLAS.ui.modal(`Edit: ${d.full_name}`, `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="ed-name" class="form-input" value="${d.full_name||''}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Class</label><input id="ed-lic" class="form-input" value="${d.license_class||''}"></div>
        <div class="form-group"><label class="form-label">License Expiry</label><input id="ed-exp" class="form-input" type="date" value="${d.license_expiry||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Phone</label><input id="ed-phone" class="form-input" value="${d.phone||''}"></div>
        <div class="form-group"><label class="form-label">Status</label>
          <select id="ed-status" class="form-select">
            <option value="available" ${d.status==='available'?'selected':''}>Available</option>
            <option value="on_trip" ${d.status==='on_trip'?'selected':''}>On Trip</option>
            <option value="inactive" ${d.status==='inactive'?'selected':''}>Inactive</option>
          </select>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.updateDriver(${d.id})">${ATLAS.i18n.t('save')}</button>`
    );
  },

  async updateDriver(id) {
    try {
      await ATLAS.api.put(`/api/fleet/drivers/${id}`, {
        full_name: document.getElementById('ed-name').value,
        license_class: document.getElementById('ed-lic').value,
        license_expiry: document.getElementById('ed-exp').value||null,
        phone: document.getElementById('ed-phone').value,
        status: document.getElementById('ed-status').value,
      });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Driver updated', 'success');
      await this.switchTab('drivers');
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to update driver', 'warning'); }
  },
};


/* ============================================================
   Navigation (Turn-by-Turn)
============================================================ */
ATLAS.navigation = {
  map: null, routeLayer: null, posMarker: null, startMarker: null, endMarker: null,
  steps: [], routeCoords: [], currentStep: 0, watchId: null,
  synth: window.speechSynthesis,
  voiceEnabled: true,
  _active: false,
  _fromCoords: null, _toCoords: null, _currentMode: 'driving-car',

  setDestination(dest) {
    ATLAS.state.navDestAddress = dest;
    ATLAS.router.go('navigation');
  },

  render(el) {
    el.innerHTML = `
      <div class="page-header"><h1>🧭 ${ATLAS.i18n.t('navigation')}</h1></div>
      <div class="grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="form-group">
            <label class="form-label">🚀 ${ATLAS.i18n.t('origin')}</label>
            <div style="display:flex;gap:8px;">
              <input id="nav-from" class="form-input" placeholder="Address or coordinates..." value="">
              <button class="btn btn-secondary" onclick="ATLAS.navigation.useGPS()" title="Use my GPS location" data-tooltip="Use GPS">📍</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">🏁 ${ATLAS.i18n.t('destination')}</label>
            <input id="nav-to" class="form-input" placeholder="Destination address..." value="${ATLAS.state.navDestAddress||''}">
          </div>
          <div class="form-group">
            <label class="form-label">Transport Mode</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" id="mode-car" onclick="ATLAS.navigation.setMode('driving-car')" style="flex:1;min-width:60px;">🚗 ${ATLAS.i18n.t('by_car')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-bike" onclick="ATLAS.navigation.setMode('cycling-regular')" style="flex:1;min-width:60px;">🚲 ${ATLAS.i18n.t('by_bike')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-foot" onclick="ATLAS.navigation.setMode('foot-walking')" style="flex:1;min-width:60px;">🚶 ${ATLAS.i18n.t('on_foot')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-flight" onclick="ATLAS.navigation.setMode('flight')" style="flex:1;min-width:60px;">✈️ ${ATLAS.i18n.t('flight_mode')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-boat" onclick="ATLAS.navigation.setMode('boat')" style="flex:1;min-width:60px;">⛵ ${ATLAS.i18n.t('boat_mode')}</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${ATLAS.i18n.t('map_layer')}</label>
            <select id="nav-layer" class="form-select" onchange="ATLAS.navigation.switchNavLayer(this.value)">
              <option value="osm">${ATLAS.i18n.t('map_osm')}</option>
              <option value="satellite">${ATLAS.i18n.t('map_satellite')}</option>
              <option value="topo">${ATLAS.i18n.t('map_topo')}</option>
              <option value="dark">${ATLAS.i18n.t('map_dark')}</option>
              <option value="water">⚓ ${ATLAS.i18n.t('map_water')}</option>
            </select>
          </div>
          <input type="hidden" id="nav-mode" value="driving-car">
          <div style="display:flex;gap:8px;margin-bottom:12px;">
            <button class="btn btn-primary" style="flex:1;" onclick="ATLAS.navigation.startRoute()" id="nav-start-btn">▶ ${ATLAS.i18n.t('start_navigation')}</button>
            <button class="btn btn-secondary" id="nav-recalc-btn" onclick="ATLAS.navigation.recalculate()" style="display:none;" title="Recalculate">🔄</button>
            <button class="btn btn-secondary" id="nav-voice-btn" onclick="ATLAS.navigation.toggleVoice()" title="Toggle voice" data-tooltip="Voice: On">🔊</button>
          </div>
          <button class="btn btn-danger w-full hidden" id="nav-stop-btn" onclick="ATLAS.navigation.stopNav()">⏹ Stop Navigation</button>
          <div id="nav-error" class="hidden" style="color:var(--danger);font-size:12px;margin-top:8px;padding:8px;background:var(--danger)18;border-radius:var(--radius-sm);"></div>
        </div>
        <div class="card" style="display:flex;flex-direction:column;gap:12px;">
          <div id="nav-instruction" class="nav-instruction-card hidden">
            <div class="nav-arrow" id="nav-arrow">↑</div>
            <div class="nav-instruction-text" id="nav-instr-text">Calculating route…</div>
            <div class="nav-distance" id="nav-instr-dist"></div>
          </div>
          <div id="nav-summary" class="hidden" style="display:flex;gap:16px;font-size:13px;flex-wrap:wrap;">
            <div style="flex:1;min-width:80px;background:var(--bg-input);padding:10px 12px;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);font-size:10px;margin-bottom:2px;">⏱ ${ATLAS.i18n.t('eta')}</div>
              <div id="nav-eta" style="font-weight:700;font-size:16px;">–</div>
            </div>
            <div style="flex:1;min-width:80px;background:var(--bg-input);padding:10px 12px;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);font-size:10px;margin-bottom:2px;">📏 ${ATLAS.i18n.t('total_distance')}</div>
              <div id="nav-total-dist" style="font-weight:700;font-size:16px;">–</div>
            </div>
            <div style="flex:1;min-width:80px;background:var(--bg-input);padding:10px 12px;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);font-size:10px;margin-bottom:2px;">🔢 Step</div>
              <div id="nav-step-counter" style="font-weight:700;font-size:16px;">–</div>
            </div>
          </div>
          <div class="divider" id="nav-steps-divider" style="display:none;margin:0;"></div>
          <div class="nav-step-list" id="nav-steps" style="flex:1;overflow-y:auto;max-height:240px;"></div>
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;"><div id="nav-map" style="height:460px;"></div></div>`;

    setTimeout(() => this.initMap(), 80);
    // Pre-fill destination from address or coordinates (e.g. from fleet "Navigate" button)
    if (ATLAS.state.navDestAddress) {
      document.getElementById('nav-to').value = ATLAS.state.navDestAddress;
      delete ATLAS.state.navDestAddress;
    } else if (ATLAS.state.navDestLat && ATLAS.state.navDestLng) {
      // Coordinates from fleet map – pre-fill the destination field.
      // geocode() can parse "lat, lng" strings directly so this will work in startRoute().
      const lat = ATLAS.state.navDestLat;
      const lng = ATLAS.state.navDestLng;
      document.getElementById('nav-to').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      delete ATLAS.state.navDestLat;
      delete ATLAS.state.navDestLng;
    }
    this.setMode('driving-car');
    this.updateVoiceBtn();
  },

  _navTileLayerRef: { layer: null },

  switchNavLayer(layerId) {
    if (!this.map) return;
    if (layerId === 'water') {
      // Water/seamark is an overlay — use OSM as base + seamark on top
      ATLAS._switchTileLayer(this.map, 'osm', this._navTileLayerRef);
      if (this._waterOverlay) { try { this.map.removeLayer(this._waterOverlay); } catch(e) {} }
      this._waterOverlay = ATLAS._createTileLayer('water');
      this._waterOverlay.addTo(this.map);
    } else {
      // Remove overlay if switching away from water
      if (this._waterOverlay) {
        try { this.map.removeLayer(this._waterOverlay); } catch(e) {}
        this._waterOverlay = null;
      }
      ATLAS._switchTileLayer(this.map, layerId, this._navTileLayerRef);
    }
  },

  setMode(mode) {
    this._currentMode = mode;
    document.getElementById('nav-mode').value = mode;
    const modeIds = ['car', 'bike', 'foot', 'flight', 'boat'];
    const modeVals = {'driving-car':'car','cycling-regular':'bike','foot-walking':'foot','flight':'flight','boat':'boat'};
    modeIds.forEach(k => {
      const btn = document.getElementById('mode-'+k);
      if (btn) btn.className = `btn btn-sm ${modeVals[mode]===k?'btn-primary':'btn-secondary'}`;
    });
    // Auto-switch to water layer for boat mode
    if (mode === 'boat') {
      const sel = document.getElementById('nav-layer');
      if (sel) { sel.value = 'water'; this.switchNavLayer('water'); }
    }
  },

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    this.updateVoiceBtn();
    ATLAS.ui.toast(`Voice ${this.voiceEnabled?'enabled':'disabled'}`, 'info');
  },

  updateVoiceBtn() {
    const btn = document.getElementById('nav-voice-btn');
    if (btn) { btn.textContent = this.voiceEnabled ? '🔊' : '🔇'; btn.title = `Voice: ${this.voiceEnabled?'On':'Off'}`; }
  },

  initMap() {
    if (!window.L) { setTimeout(()=>this.initMap(),200); return; }
    const el = document.getElementById('nav-map');
    if (!el) return;
    // Handle stale map instance when page is re-rendered
    if (this.map) {
      if (el._leaflet_id) { this.map.invalidateSize(); return; }
      try { this.map.remove(); } catch(e) {}
      this.map = null; this.routeLayer = null;
      this.posMarker = null; this.startMarker = null; this.endMarker = null;
    }
    this.map = L.map('nav-map').setView([51.1657, 10.4515], 7);
    this._navTileLayerRef.layer = ATLAS._createTileLayer('osm');
    this._navTileLayerRef.layer.addTo(this.map);
  },

  useGPS() {
    if (!navigator.geolocation) {
      ATLAS.ui.toast('GPS not available on this device', 'warning');
      return;
    }
    const btn = document.querySelector('[onclick="ATLAS.navigation.useGPS()"]');
    if (btn) btn.textContent = '⏳';
    // Check permission state first if API is available
    const doGet = () => {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        document.getElementById('nav-from').value = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        if (this.map) this.map.setView([lat, lng], 14);
        ATLAS.ui.toast('GPS location obtained', 'success');
        if (btn) btn.textContent = '📍';
      }, err => {
        if (err.code === 1) {
          ATLAS.ui.toast('GPS permission denied. Please enable location in browser settings.', 'warning');
        } else if (err.code === 2) {
          ATLAS.ui.toast('GPS position unavailable. Check device location settings.', 'warning');
        } else {
          ATLAS.ui.toast('GPS timeout. Try again or enter coordinates manually.', 'warning');
        }
        if (btn) btn.textContent = '📍';
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    };
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'denied') {
          ATLAS.ui.toast('GPS permission denied. Please allow location access in browser settings.', 'warning');
          if (btn) btn.textContent = '📍';
        } else {
          doGet();
        }
      }).catch(doGet);
    } else {
      doGet();
    }
  },

  async startRoute() {
    const from = document.getElementById('nav-from').value.trim();
    const to = document.getElementById('nav-to').value.trim();
    const mode = document.getElementById('nav-mode').value;
    const errEl = document.getElementById('nav-error');
    errEl.classList.add('hidden');

    if (!from || !to) {
      errEl.textContent = 'Please fill in both origin and destination';
      errEl.classList.remove('hidden');
      return;
    }

    const startBtn = document.getElementById('nav-start-btn');
    if (startBtn) { startBtn.disabled = true; startBtn.textContent = '⏳ Calculating…'; }

    try {
      const [fromCoords, toCoords] = await Promise.all([this.geocode(from), this.geocode(to)]);
      if (!fromCoords) throw new Error(`Could not locate "${from}"`);
      if (!toCoords) throw new Error(`Could not locate "${to}"`);
      this._fromCoords = fromCoords;
      this._toCoords = toCoords;
      await this._fetchAndDraw(fromCoords, toCoords, mode);
    } catch(e) {
      errEl.textContent = '⚠ ' + e.message;
      errEl.classList.remove('hidden');
    } finally {
      if (startBtn) { startBtn.disabled = false; startBtn.textContent = '▶ ' + ATLAS.i18n.t('start_navigation'); }
    }
  },

  async recalculate() {
    if (!this._fromCoords || !this._toCoords) return;
    ATLAS.ui.toast(ATLAS.i18n.t('recalculating'), 'info');
    await this._fetchAndDraw(this._fromCoords, this._toCoords, this._currentMode);
  },

  async _fetchAndDraw(fromCoords, toCoords, mode) {
    // fromCoords / toCoords are [lat, lng]
    // ORS expects  start=lng,lat  end=lng,lat
    const lng0 = fromCoords[1], lat0 = fromCoords[0];
    const lng1 = toCoords[1],   lat1 = toCoords[0];

    let route = null;

    // ── Flight/Boat mode: straight-line great circle route ────────────────
    if (mode === 'flight' || mode === 'boat') {
      const dist = this.haversine(lat0, lng0, lat1, lng1);
      const speed = mode === 'flight' ? 850 : 20; // km/h
      const duration = (dist / speed) * 3600;
      // Build a simple straight-line "route"
      route = {
        features: [{
          geometry: { type: 'LineString', coordinates: [[lng0,lat0],[lng1,lat1]] },
          properties: {
            summary: { distance: dist * 1000, duration },
            segments: [{ steps: [
              { instruction: `${mode==='flight'?'✈️':'⛵'} Direct ${mode} route`, distance: dist*1000, duration, type: 1, way_points:[0,1] },
              { instruction: `Destination reached`, distance: 0, duration: 0, type: 10, way_points:[1,1] }
            ]}]
          }
        }]
      };
      this._drawRoute(route, fromCoords, toCoords);
      return;
    }

    // ── 1. Try OpenRouteService (GeoJSON directions) ──────────────────────
    try {
      const orsMode = mode || 'driving-car';
      const orsUrl = `https://api.openrouteservice.org/v2/directions/${orsMode}?api_key=5b3ce3597851110001cf6248a10d1a5d21e744d5b2de3e8b41e41c41&start=${lng0},${lat0}&end=${lng1},${lat1}`;
      const _orsCtrl = new AbortController(); const _orsTo = setTimeout(() => _orsCtrl.abort(), 10000);
      const res = await fetch(orsUrl, { signal: _orsCtrl.signal }).finally(() => clearTimeout(_orsTo));
      if (res.ok) {
        const json = await res.json();
        if (json?.features?.length) route = json;
        else console.warn('[Nav] ORS returned empty features:', json);
      } else {
        console.warn('[Nav] ORS HTTP', res.status, await res.text().catch(()=>''));
      }
    } catch(e) { console.warn('[Nav] ORS failed:', e.message); }

    // ── 2. Fallback: OSRM (no key required, open routing) ────────────────
    if (!route) {
      try {
        const osrmProfile = mode === 'cycling-regular' ? 'bike' : mode === 'foot-walking' ? 'foot' : 'car';
        const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${lng0},${lat0};${lng1},${lat1}?overview=full&geometries=geojson&steps=true`;
        const _osrmCtrl = new AbortController(); const _osrmTo = setTimeout(() => _osrmCtrl.abort(), 10000);
        const res = await fetch(osrmUrl, { signal: _osrmCtrl.signal }).finally(() => clearTimeout(_osrmTo));
        if (res.ok) {
          const json = await res.json();
          if (json.code === 'Ok' && json.routes?.length && json.routes[0].legs?.length) {
            // Normalize OSRM response to ORS-like format
            const leg = json.routes[0].legs[0];
            // Track cumulative route coordinate index per step
            let coordIdx = 0;
            route = {
              features: [{
                geometry: json.routes[0].geometry, // already GeoJSON LineString
                properties: {
                  summary: {
                    distance: json.routes[0].distance,
                    duration: json.routes[0].duration,
                  },
                  segments: [{
                    steps: (leg.steps || []).map(s => {
                      const startIdx = coordIdx;
                      // Each OSRM step covers (intersections.length) coordinates
                      const stepCoordCount = s.intersections?.length || 1;
                      coordIdx += stepCoordCount;
                      return {
                        distance: s.distance,
                        duration: s.duration,
                        instruction: s.maneuver?.type
                          ? this._osrmInstruction(s.maneuver.type, s.maneuver.modifier, s.name)
                          : (s.name || 'Continue'),
                        type: this._osrmStepType(s.maneuver?.type),
                        way_points: [startIdx, coordIdx - 1],
                      };
                    })
                  }]
                }
              }],
              _osrm: true, // flag so geometry mapping works
            };
          }
        }
      } catch(e) { console.warn('[Nav] OSRM failed:', e.message); }
    }

    if (!route?.features?.length) {
      this.drawStraightLine(fromCoords, toCoords);
      return;
    }

    this._drawRoute(route, fromCoords, toCoords);
  },

  _drawRoute(route, fromCoords, toCoords) {
    const feature = route.features[0];
    // ORS: coordinates are [lng, lat] arrays → convert to [lat, lng] for Leaflet
    // OSRM: geometry is a GeoJSON LineString with [lng, lat] coordinates
    const rawCoords = feature.geometry?.coordinates || [];
    this.routeCoords = rawCoords.map(c => [c[1], c[0]]); // [lng,lat] → [lat,lng]
    const summary  = feature.properties.summary;
    const segments = feature.properties.segments || [];
    this.steps = segments.flatMap(s => s.steps || []);

    // Draw route
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#60a5fa';
    this.routeLayer = L.polyline(this.routeCoords, { color: accent, weight: 6, opacity: 0.85, dashArray: '8,4', lineCap: 'round' }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [50,50] });

    // Place / update markers
    const startIcon = L.divIcon({html:'<div style="background:#10b981;border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',iconSize:[18,18],iconAnchor:[9,9],className:''});
    const endIcon = L.divIcon({html:'<div style="background:#ef4444;border:3px solid white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">🏁</div>',iconSize:[22,22],iconAnchor:[11,11],className:''});
    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker) this.map.removeLayer(this.endMarker);
    this.startMarker = L.marker(fromCoords, {icon:startIcon}).addTo(this.map).bindPopup('Start');
    this.endMarker = L.marker(toCoords, {icon:endIcon}).addTo(this.map).bindPopup('Destination');

    // Update summary
    const distKm = (summary.distance/1000).toFixed(1);
    const durationMin = Math.round(summary.duration/60);
    const eta = new Date(Date.now() + summary.duration*1000);
    document.getElementById('nav-total-dist').textContent = distKm + ' km';
    document.getElementById('nav-eta').textContent = eta.toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit'});
    document.getElementById('nav-summary').classList.remove('hidden');
    document.getElementById('nav-steps-divider').style.display = '';
    document.getElementById('nav-stop-btn').classList.remove('hidden');
    document.getElementById('nav-recalc-btn').style.display = '';

    this.currentStep = 0;
    this._active = true;
    this.renderSteps();
    this.updateInstruction();
    this.startGPSTracking();
    ATLAS.ui.toast(`Route: ${distKm} km, ~${durationMin} min`, 'success');
  },

  async geocode(query) {
    // Coords: "lat,lng" or "lat, lng"
    const m = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (m) return [parseFloat(m[1]), parseFloat(m[2])];
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1`, {
        headers: { 'Accept-Language': ATLAS.i18n.lang }
      });
      const data = await res.json();
      if (data.length) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch {}
    return null;
  },

  // ── OSRM maneuver type → ORS-style step type number ─────────────────────
  _osrmStepType(maneuver) {
    const map = { 'turn': 0, 'new name': 1, 'depart': 11, 'arrive': 10,
                  'merge': 0, 'ramp': 0, 'fork': 0, 'roundabout': 6 };
    return map[maneuver] ?? 0;
  },

  // ── OSRM maneuver → human instruction ────────────────────────────────────
  _osrmInstruction(type, modifier, streetName) {
    const street = streetName ? ` onto ${streetName}` : '';
    if (type === 'depart') return `Head ${modifier || 'forward'}${street}`;
    if (type === 'arrive') return 'You have arrived at your destination';
    if (type === 'turn') {
      if (modifier === 'left')       return `Turn left${street}`;
      if (modifier === 'right')      return `Turn right${street}`;
      if (modifier === 'slight left')  return `Slight left${street}`;
      if (modifier === 'slight right') return `Slight right${street}`;
      if (modifier === 'sharp left')   return `Sharp left${street}`;
      if (modifier === 'sharp right')  return `Sharp right${street}`;
      if (modifier === 'uturn')        return 'Make a U-turn';
    }
    if (type === 'roundabout')  return `Enter roundabout${street}`;
    if (type === 'fork')        return `Keep ${modifier || 'straight'}${street}`;
    if (type === 'merge')       return `Merge${street}`;
    if (type === 'new name')    return `Continue${street}`;
    return `Continue${street}`;
  },

  drawStraightLine(from, to) {
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    this.routeLayer = L.polyline([from, to], { color:'#60a5fa', weight:4, dashArray:'12,8', opacity:0.7 }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds(), {padding:[40,40]});
    // Place start/end markers even in fallback mode
    const startIcon = L.divIcon({html:'<div style="background:#10b981;border:3px solid white;border-radius:50%;width:16px;height:16px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',iconSize:[16,16],iconAnchor:[8,8],className:''});
    const endIcon   = L.divIcon({html:'<div style="background:#ef4444;border:3px solid white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">🏁</div>',iconSize:[20,20],iconAnchor:[10,10],className:''});
    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker)   this.map.removeLayer(this.endMarker);
    this.startMarker = L.marker(from, {icon:startIcon}).addTo(this.map).bindPopup('Start');
    this.endMarker   = L.marker(to,   {icon:endIcon}).addTo(this.map).bindPopup('Destination');
    const dist = (this.haversine(from[0],from[1],to[0],to[1])/1000).toFixed(1);
    ATLAS.ui.toast(`⚠ Routing-Service nicht erreichbar – Luftlinie (${dist} km)`, 'warning');
    document.getElementById('nav-summary').classList.remove('hidden');
    document.getElementById('nav-total-dist').textContent = dist + ' km (Luftlinie)';
    document.getElementById('nav-eta').textContent = '–';
    document.getElementById('nav-stop-btn').classList.remove('hidden');
    // Init step state so GPS tracking still works with straight-line fallback
    this.steps = []; this.currentStep = 0; this._active = true;
    this.renderSteps(); this.updateInstruction();
  },

  haversine(lat1,lon1,lat2,lon2) {
    const R=6371000, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  },

  renderSteps() {
    const el = document.getElementById('nav-steps');
    if (!el) return;
    const arrows = { 0:'↑', 1:'↗', 2:'→', 3:'↘', 4:'↓', 5:'↙', 6:'←', 7:'↖', 8:'⟳', 9:'⟲', 10:'↑', 11:'↕', 12:'↕', 13:'🏁' };
    el.innerHTML = this.steps.map((s,i) => `
      <div class="nav-step ${i===this.currentStep?'current':''}" id="nav-step-${i}" onclick="ATLAS.navigation.jumpToStep(${i})" style="cursor:pointer;">
        <span class="nav-step-arrow">${arrows[s.type]||'↑'}</span>
        <span style="flex:1;">${s.instruction||s.name||'Continue'}</span>
        <span class="nav-step-dist">${s.distance ? (s.distance >= 1000 ? (s.distance/1000).toFixed(1)+' km' : s.distance.toFixed(0)+'m') : ''}</span>
      </div>`).join('');
    const counterEl = document.getElementById('nav-step-counter');
    if (counterEl) counterEl.textContent = `${this.currentStep+1}/${this.steps.length}`;
  },

  jumpToStep(i) {
    this.currentStep = i;
    this.renderSteps();
    this.updateInstruction(false); // no voice on manual jump
  },

  updateInstruction(speak=true) {
    if (!this.steps.length) return;
    const step = this.steps[Math.min(this.currentStep, this.steps.length-1)];
    const instrEl = document.getElementById('nav-instr-text');
    const distEl = document.getElementById('nav-instr-dist');
    const arrowEl = document.getElementById('nav-arrow');
    const instrCard = document.getElementById('nav-instruction');
    if (!instrEl) return;
    instrCard?.classList.remove('hidden');
    const arrows = { 0:'↑', 1:'↗', 2:'→', 3:'↘', 4:'↓', 5:'↙', 6:'←', 7:'↖', 8:'⟳', 9:'⟲', 13:'🏁' };
    if (arrowEl) arrowEl.textContent = arrows[step.type]||'↑';
    instrEl.textContent = step.instruction||step.name||'Continue';
    distEl.textContent = step.distance
      ? (step.distance >= 1000 ? `In ${(step.distance/1000).toFixed(1)} km` : `In ${step.distance.toFixed(0)} m`)
      : (this.currentStep === this.steps.length-1 ? 'Arriving…' : '');
    // Highlight current step
    document.querySelectorAll('.nav-step').forEach((el,i) => el.classList.toggle('current',i===this.currentStep));
    const counterEl = document.getElementById('nav-step-counter');
    if (counterEl) counterEl.textContent = `${this.currentStep+1}/${this.steps.length}`;
    // Scroll step into view
    document.getElementById('nav-step-'+this.currentStep)?.scrollIntoView({behavior:'smooth',block:'nearest'});
    // Voice
    if (speak && this.voiceEnabled && this.synth && step.instruction) {
      this.synth.cancel();
      const utt = new SpeechSynthesisUtterance(step.instruction);
      utt.lang = {en:'en-GB',de:'de-DE',fr:'fr-FR'}[ATLAS.i18n.lang]||'en-GB';
      utt.rate = 0.9;
      this.synth.speak(utt);
    }
  },

  startGPSTracking() {
    if (!navigator.geolocation) return;
    if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
    this.watchId = navigator.geolocation.watchPosition(pos => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      if (!this.map) return;

      // Update position marker
      const posIcon = L.divIcon({
        html: `<div style="background:var(--accent);border:3px solid white;border-radius:50%;width:20px;height:20px;box-shadow:0 0 12px var(--accent);"><div style="position:absolute;inset:-${accuracy>100?8:4}px;border:2px solid var(--accent);border-radius:50%;opacity:0.3;"></div></div>`,
        iconSize:[20,20], iconAnchor:[10,10], className:''
      });
      if (!this.posMarker) {
        this.posMarker = L.marker([lat,lng], {icon:posIcon}).addTo(this.map);
      } else {
        this.posMarker.setLatLng([lat,lng]);
      }
      this.map.panTo([lat,lng], {animate:true});

      // Smart step advancement: check distance to next step waypoints
      if (this._active && this.steps.length > 0 && this.currentStep < this.steps.length-1) {
        const nextStep = this.steps[this.currentStep+1];
        if (nextStep) {
          // Get the waypoint of the next step from route coords
          const wpIdx = nextStep.way_points?.[0];
          if (wpIdx !== undefined && this.routeCoords[wpIdx]) {
            const [wpLat, wpLng] = this.routeCoords[wpIdx];
            const dist = this.haversine(lat, lng, wpLat, wpLng);
            if (dist < 30) {  // within 30m → advance step
              this.currentStep++;
              this.renderSteps();
              this.updateInstruction(true);
            }
          }
        }
      } else if (this._active && this.currentStep >= this.steps.length-1 && this._toCoords) {
        const distToEnd = this.haversine(lat, lng, this._toCoords[0], this._toCoords[1]);
        if (distToEnd < 50) this.arrived();
      }
    }, err => {
      console.warn('GPS error:', err);
    }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 });
  },

  arrived() {
    if (!this._active) return;
    this._active = false;
    ATLAS.ui.toast(ATLAS.i18n.t('arrived'), 'success');
    const instrEl = document.getElementById('nav-instr-text');
    if (instrEl) instrEl.textContent = '🏁 ' + ATLAS.i18n.t('arrived');
    const arrowEl = document.getElementById('nav-arrow');
    if (arrowEl) arrowEl.textContent = '🏁';
    if (this.voiceEnabled && this.synth) {
      this.synth.cancel();
      this.synth.speak(new SpeechSynthesisUtterance(ATLAS.i18n.t('arrived')));
    }
    this.stopNav();
  },

  stopNav() {
    this._active = false;
    if (this.watchId) { navigator.geolocation.clearWatch(this.watchId); this.watchId = null; }
    if (this.synth) this.synth.cancel();
    document.getElementById('nav-stop-btn')?.classList.add('hidden');
    document.getElementById('nav-recalc-btn') && (document.getElementById('nav-recalc-btn').style.display = 'none');
  }
};


/* ============================================================
   Users Page
============================================================ */
ATLAS.usersPage = {
  _users: [],
  _wsRegistered: false,

  // Deterministic color from username
  _avatarColor(name='') {
    const colors = ['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#84cc16'];
    let h = 0;
    for (let c of name) h = (h*31 + c.charCodeAt(0)) & 0xffffffff;
    return colors[Math.abs(h) % colors.length];
  },

  async render(el) {
    let users = [];
    try { users = await ATLAS.api.get('/api/users') || []; } catch(e) {
      el.innerHTML = `<div class="card" style="color:var(--danger);padding:20px;">Failed to load users: ${e.message}</div>`; return;
    }
    this._users = users;
    const isAdmin = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'owner';
    const isOwner = ATLAS.state.user?.role === 'owner';
    const onlineCount = users.filter(u=>u.online).length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('users')}</h1>
        <div class="actions">
          <span style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
            <span class="pulse-dot"></span> ${onlineCount} online
          </span>
          ${isAdmin ? `<button class="btn btn-secondary" onclick="ATLAS.departmentsPanel.showPanel()">🏢 Abteilungen</button>` : ''}
          ${isAdmin ? `<button class="btn btn-secondary" onclick="ATLAS.pushPanel.showPanel()">📲 Push senden</button>` : ''}
          ${isAdmin ? `<button class="btn btn-primary" onclick="ATLAS.usersPage.showCreate()">+ ${ATLAS.i18n.t('create')}</button>` : ''}
        </div>
      </div>

      <!-- KPI cards -->
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card"><div class="kpi-label">Total Users</div><div class="kpi-value">${users.length}</div><div class="kpi-icon">👥</div></div>
        <div class="kpi-card"><div class="kpi-label">Online Now</div><div class="kpi-value" style="color:var(--success);">${onlineCount}</div><div class="kpi-icon">🟢</div></div>
        <div class="kpi-card"><div class="kpi-label">Admins</div><div class="kpi-value">${users.filter(u=>u.role==='admin'||u.role==='owner').length}</div><div class="kpi-icon">🛡</div></div>
        <div class="kpi-card"><div class="kpi-label">Active</div><div class="kpi-value">${users.filter(u=>u.is_active).length}</div><div class="kpi-icon">✅</div></div>
      </div>

      <!-- Bulk action bar (hidden until selection) -->
      ${isOwner ? `
      <div id="bulk-action-bar" class="hidden" style="background:var(--bg-secondary);border:1px solid var(--accent);border-radius:8px;padding:10px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-size:13px;font-weight:600;color:var(--accent);"><span id="bulk-count">0</span> Nutzer ausgewählt</span>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.bulkUsers.bulkForceLogout()">⏏ Alle abmelden</button>
        <button class="btn btn-warning btn-sm" onclick="ATLAS.bulkUsers.bulkDeactivate()">🔒 Deaktivieren</button>
        <select class="form-select" style="width:130px;height:30px;font-size:12px;" onchange="if(this.value) ATLAS.bulkUsers.bulkChangeRole(this.value); this.value='';">
          <option value="">Rolle setzen…</option>
          <option value="operator">→ Operator</option>
          <option value="viewer">→ Viewer</option>
          <option value="admin">→ Admin</option>
        </select>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.bulkUsers.clearSelection()">✕ Auswahl aufheben</button>
      </div>` : ''}

      <!-- Filter bar -->
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
          ${isOwner ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.bulkUsers.selectAll(ATLAS.usersPage._users||[])">☑ Alle wählen</button>` : ''}
          <input id="user-search" class="form-input" style="flex:1;min-width:180px;" placeholder="Search users..." oninput="ATLAS.usersPage.filter()">
          <select id="user-role-filter" class="form-select" style="width:130px;" onchange="ATLAS.usersPage.filter()">
            <option value="">All Roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </select>
          <select id="user-status-filter" class="form-select" style="width:130px;" onchange="ATLAS.usersPage.filter()">
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Language</th>
                <th>Last Seen</th>
                <th>Status</th>
                ${isAdmin ? '<th>Actions</th>' : ''}
              </tr>
            </thead>
            <tbody id="users-tbody">${this._renderRows(users)}</tbody>
          </table>
        </div>
      </div>`;

    // Register WS for live online status (only once; guard with DOM check in handler)
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('user_online', d => {
        if (document.getElementById('users-tbody')) this._updateOnlineStatus(d.user_id, true);
      });
      ATLAS.ws.on('user_offline', d => {
        if (document.getElementById('users-tbody')) this._updateOnlineStatus(d.user_id, false);
      });
    }
  },

  _renderRows(users) {
    const isAdmin = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'owner';
    const isOwner = ATLAS.state.user?.role === 'owner';
    if (!users.length) return `<tr><td colspan="${isAdmin?6:5}" style="text-align:center;padding:24px;color:var(--text-muted);">No users found</td></tr>`;
    return users.map(u => {
      const color = this._avatarColor(u.username);
      const lastSeenAgo = u.last_seen ? this._timeAgoShort(u.last_seen) : '–';
      return `
        <tr id="user-row-${u.id}">
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              ${isOwner && u.role !== 'owner' && u.id !== ATLAS.state.user?.id ? `
                <input type="checkbox" class="bulk-check" data-uid="${u.id}" data-role="${u.role}"
                  onchange="ATLAS.bulkUsers.toggleSelect(${u.id})"
                  style="width:16px;height:16px;cursor:pointer;flex-shrink:0;">` : '<div style="width:16px;flex-shrink:0;"></div>'}
              <div style="position:relative;flex-shrink:0;">
                <div style="width:36px;height:36px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-weight:700;color:${color};font-size:15px;">
                  ${(u.full_name||u.username)[0].toUpperCase()}
                </div>
                <span class="user-status-dot ${u.online?'online':'offline'}" id="dot-${u.id}" style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:${u.online?'var(--success)':'var(--text-muted)'};border:2px solid var(--bg-card);"></span>
              </div>
              <div>
                <div style="font-weight:600;">${u.full_name||u.username}</div>
                <div style="font-size:11px;color:var(--text-muted);">@${u.username}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge ${u.role==='owner'?'badge-warning':u.role==='admin'?'badge-danger':u.role==='operator'?'badge-info':'badge-neutral'}">
              ${u.role==='owner'?'👑 ':u.role==='admin'?'🛡 ':u.role==='operator'?'⚙ ':'👁 '}${u.role}
            </span>
          </td>
          <td>
            <span style="font-size:13px;">${{en:'🇬🇧',de:'🇩🇪',fr:'🇫🇷'}[u.language||'en']||'🌐'} ${(u.language||'en').toUpperCase()}</span>
          </td>
          <td style="font-size:12px;color:var(--text-muted);">${lastSeenAgo}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;color:${u.online?'var(--success)':'var(--text-muted)'};" id="status-label-${u.id}">${u.online?'● Online':'○ Offline'}</span>
              ${!u.is_active?'<span class="badge badge-neutral" style="font-size:10px;">Inactive</span>':''}
            </div>
          </td>
          ${isAdmin ? `<td>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${u.role !== 'owner' ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.usersPage.showEdit(${JSON.stringify(u).replace(/"/g,'&quot;')})">✏ Edit</button>` : ''}
              ${u.id !== ATLAS.state.user?.id && u.role !== 'owner' ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.usersPage.toggleActive(${u.id},${u.is_active?0:1})" title="${u.is_active?'Deactivate':'Activate'}">${u.is_active?'🔒':'🔓'}</button>` : ''}
              ${isOwner && u.id !== ATLAS.state.user?.id && u.role !== 'owner' ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.usersPage.forceLogout(${u.id},'${u.username}')" title="Force logout all sessions">⏏</button>` : ''}
              ${isOwner && u.id !== ATLAS.state.user?.id && u.role !== 'owner' ? `<button class="btn btn-danger btn-sm" onclick="ATLAS.usersPage.deleteUser(${u.id},'${u.username}')" title="Delete user">🗑</button>` : ''}
            </div>
          </td>` : ''}
        </tr>`;
    }).join('');
  },

  _timeAgoShort(ts) {
    if (!ts) return '–';
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff/60000);
    if (m < 1) return 'just now';
    if (m < 60) return m+'m ago';
    const h = Math.floor(m/60);
    if (h < 24) return h+'h ago';
    return Math.floor(h/24)+'d ago';
  },

  _updateOnlineStatus(userId, online) {
    const dot = document.getElementById('dot-'+userId);
    const label = document.getElementById('status-label-'+userId);
    if (dot) dot.style.background = online ? 'var(--success)' : 'var(--text-muted)';
    if (label) {
      label.style.color = online ? 'var(--success)' : 'var(--text-muted)';
      label.textContent = online ? '● Online' : '○ Offline';
    }
    // Update cached list
    const u = (this._users||[]).find(u=>u.id===userId);
    if (u) u.online = online;
  },

  filter() {
    const q = (document.getElementById('user-search')?.value||'').toLowerCase();
    const role = document.getElementById('user-role-filter')?.value||'';
    const status = document.getElementById('user-status-filter')?.value||'';
    const filtered = (this._users||[]).filter(u => {
      if (q && !JSON.stringify(u).toLowerCase().includes(q)) return false;
      if (role && u.role !== role) return false;
      if (status === 'online' && !u.online) return false;
      if (status === 'offline' && u.online) return false;
      if (status === 'inactive' && u.is_active) return false;
      return true;
    });
    const tbody = document.getElementById('users-tbody');
    if (tbody) tbody.innerHTML = this._renderRows(filtered);
  },

  showCreate() {
    ATLAS.ui.modal('Create User', `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Username</label><input id="cu-user" class="form-input" placeholder="johndoe"></div>
        <div class="form-group"><label class="form-label">Full Name</label><input id="cu-name" class="form-input" placeholder="John Doe"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Password</label><input id="cu-pass" class="form-input" type="password" autocomplete="new-password"></div>
        <div class="form-group"><label class="form-label">Role</label>
          <select id="cu-role" class="form-select"><option value="viewer">Viewer</option><option value="operator">Operator</option><option value="admin">Admin</option></select>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.usersPage.create()">+ Create</button>`
    );
  },

  async create() {
    const username = document.getElementById('cu-user').value.trim();
    const password = document.getElementById('cu-pass').value;
    if (!username || !password) { ATLAS.ui.toast('Username and password required','warning'); return; }
    try {
      await ATLAS.api.post('/api/users', { username, full_name: document.getElementById('cu-name').value, password, role: document.getElementById('cu-role').value });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('User created','success'); ATLAS.router.go('users',true);
    } catch(e) { ATLAS.ui.toast(e.message,'warning'); }
  },

  showEdit(u) {
    ATLAS.ui.modal(`Edit: ${u.username}`, `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Full Name</label><input id="eu-name" class="form-input" value="${u.full_name||''}"></div>
        <div class="form-group"><label class="form-label">Role</label>
          <select id="eu-role" class="form-select"><option value="viewer" ${u.role==='viewer'?'selected':''}>Viewer</option><option value="operator" ${u.role==='operator'?'selected':''}>Operator</option><option value="abteilleitung" ${u.role==='abteilleitung'?'selected':''}>Abteilungsleitung</option><option value="dispatcher" ${u.role==='dispatcher'?'selected':''}>Dispatcher</option><option value="admin" ${u.role==='admin'?'selected':''}>Admin</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Email</label><input id="eu-email" class="form-input" type="email" value="${u.email||''}" placeholder="user@example.com"></div>
        <div class="form-group"><label class="form-label">Phone</label><input id="eu-phone" class="form-input" type="tel" value="${u.phone||''}" placeholder="+49 123 456789"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Status</label>
          <select id="eu-active" class="form-select"><option value="1" ${u.is_active?'selected':''}>Active</option><option value="0" ${!u.is_active?'selected':''}>Inactive</option></select>
        </div>
        <div class="form-group"><label class="form-label">New Password (leave blank to keep)</label><input id="eu-pass" class="form-input" type="password" autocomplete="new-password" placeholder="••••••••"></div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.usersPage.update(${u.id})">Save</button>`
    );
  },

  async update(id) {
    const pw = document.getElementById('eu-pass').value;
    const body = {
      full_name: document.getElementById('eu-name').value,
      role: document.getElementById('eu-role').value,
      is_active: parseInt(document.getElementById('eu-active').value),
    };
    const emailEl = document.getElementById('eu-email');
    const phoneEl = document.getElementById('eu-phone');
    if (emailEl) body.email = emailEl.value.trim();
    if (phoneEl) body.phone = phoneEl.value.trim();
    if (pw) body.password = pw;
    try {
      await ATLAS.api.put(`/api/users/${id}`, body);
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('User updated', 'success');
      ATLAS.router.go('users', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Failed to update user', 'warning'); }
  },

  async toggleActive(id, newActive) {
    try {
      await ATLAS.api.put(`/api/users/${id}`, { is_active: newActive });
      ATLAS.ui.toast(newActive ? 'User activated' : 'User deactivated', 'success');
      ATLAS.router.go('users', true);
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async forceLogout(id, username) {
    if (!confirm(`Force-logout all sessions for "${username}"? They will be logged out immediately.`)) return;
    try {
      await ATLAS.api.delete(`/api/users/${id}/sessions`);
      ATLAS.ui.toast(`All sessions for ${username} invalidated`, 'success');
      ATLAS.router.go('users', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Force logout failed', 'warning'); }
  },

  async deleteUser(id, username) {
    if (!confirm(`⚠️ Permanently delete user "${username}"?\nThis cannot be undone.`)) return;
    try {
      await ATLAS.api.delete(`/api/users/${id}`);
      ATLAS.ui.toast(`User ${username} deleted`, 'success');
      ATLAS.router.go('users', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Delete failed', 'warning'); }
  }
};

// ============================================================
// DEPARTMENTS MANAGEMENT (accessible from Users page)
// ============================================================
ATLAS.departmentsPanel = {
  async showPanel() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🏢 Abteilungen</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.departmentsPanel.showCreate()">+ Neue Abteilung</button>
        </div>
        <div id="dept-list">Lade…</div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
    await this.loadList();
  },
  async loadList() {
    const el = document.getElementById('dept-list');
    if (!el) return;
    try {
      const data = await ATLAS.api.get('/api/departments');
      const depts = data.departments || [];
      if (!depts.length) { el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);">Keine Abteilungen</div>'; return; }
      el.innerHTML = depts.map(d => `<div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:6px;background:var(--surface-2);margin-bottom:6px;">
        <span style="font-size:22px;background:${d.color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;">${d.icon}</span>
        <div style="flex:1;"><strong>${d.name}</strong>${d.description?`<div style="font-size:11px;color:var(--text-muted);">${d.description}</div>`:''}</div>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.departmentsPanel.showEdit(${d.id},'${d.name.replace(/'/g,"\\'")}','${(d.description||'').replace(/'/g,"\\'")}','${d.icon}','${d.color}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="ATLAS.departmentsPanel.del(${d.id},'${d.name.replace(/'/g,"\\'")}')">🗑</button>
      </div>`).join('');
    } catch(e) { if (el) el.innerHTML = `<div style="color:var(--danger);">${e.message}</div>`; }
  },
  showCreate() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neue Abteilung</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name *</label><input id="nd-name" class="form-input" placeholder="Leitstelle, Fuhrpark, IT…"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><input id="nd-desc" class="form-input"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Icon (Emoji)</label><input id="nd-icon" class="form-input" value="🏢" maxlength="4"></div>
          <div class="form-group"><label class="form-label">Farbe</label><input id="nd-color" class="form-input" type="color" value="#6366f1" style="padding:4px;height:42px;"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.departmentsPanel.showPanel()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.departmentsPanel.saveCreate()">Erstellen</button>
      </div>`);
  },
  async saveCreate() {
    const name = document.getElementById('nd-name')?.value.trim();
    if (!name) { ATLAS.ui.toast('Name erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/departments', { name, description: document.getElementById('nd-desc')?.value||null, icon: document.getElementById('nd-icon')?.value||'🏢', color: document.getElementById('nd-color')?.value||'#6366f1' });
      ATLAS.ui.toast('Abteilung erstellt', 'success'); await this.showPanel();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  showEdit(id, name, desc, icon, color) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Abteilung bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name</label><input id="ed-name" class="form-input" value="${name}"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><input id="ed-desc" class="form-input" value="${desc}"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Icon</label><input id="ed-icon" class="form-input" value="${icon}" maxlength="4"></div>
          <div class="form-group"><label class="form-label">Farbe</label><input id="ed-color" class="form-input" type="color" value="${color}" style="padding:4px;height:42px;"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.departmentsPanel.showPanel()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.departmentsPanel.saveEdit(${id})">Speichern</button>
      </div>`);
  },
  async saveEdit(id) {
    try {
      await ATLAS.api.put(`/api/departments/${id}`, { name: document.getElementById('ed-name')?.value, description: document.getElementById('ed-desc')?.value||null, icon: document.getElementById('ed-icon')?.value, color: document.getElementById('ed-color')?.value });
      ATLAS.ui.toast('Gespeichert', 'success'); await this.showPanel();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async del(id, name) {
    if (!confirm(`Abteilung "${name}" löschen?`)) return;
    try { await ATLAS.api.delete(`/api/departments/${id}`); ATLAS.ui.toast('Gelöscht', 'success'); await this.showPanel(); } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },
};

// ============================================================
// TARGETED PUSH NOTIFICATIONS PANEL
// ============================================================
ATLAS.pushPanel = {
  async showPanel() {
    let users = [];
    try { users = await ATLAS.api.get('/api/users') || []; } catch(e) {}
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📲 Push-Benachrichtigung senden</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <div class="card-title">An einzelnen Nutzer</div>
            <div class="form-group"><label class="form-label">Nutzer</label>
              <select id="push-uid" class="form-input">
                <option value="">Auswählen…</option>
                ${users.map(u=>`<option value="${u.id}">${u.full_name} (@${u.username})</option>`).join('')}
              </select></div>
            <div class="form-group"><label class="form-label">Titel</label><input id="push-title-u" class="form-input" value="ControlCenterHQ"></div>
            <div class="form-group"><label class="form-label">Nachricht *</label><input id="push-msg-u" class="form-input" placeholder="Dringende Benachrichtigung…"></div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.pushPanel.sendToUser()">Senden</button>
          </div>
          <div class="card">
            <div class="card-title">An Benutzerrolle</div>
            <div class="form-group"><label class="form-label">Rolle</label>
              <select id="push-role" class="form-input">
                <option value="owner">Owner</option><option value="admin">Admin</option>
                <option value="operator">Operator</option><option value="dispatcher">Dispatcher</option>
              </select></div>
            <div class="form-group"><label class="form-label">Titel</label><input id="push-title-r" class="form-input" value="ControlCenterHQ"></div>
            <div class="form-group"><label class="form-label">Nachricht *</label><input id="push-msg-r" class="form-input" placeholder="Nachricht an alle dieser Rolle…"></div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.pushPanel.sendToRole()">Senden</button>
          </div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
  },
  async sendToUser() {
    const uid = parseInt(document.getElementById('push-uid')?.value);
    const msg = document.getElementById('push-msg-u')?.value.trim();
    const title = document.getElementById('push-title-u')?.value.trim() || 'ControlCenterHQ';
    if (!uid || !msg) { ATLAS.ui.toast('Nutzer und Nachricht erforderlich', 'warning'); return; }
    try {
      const r = await ATLAS.api.post('/api/push/send-to-user', { user_id: uid, title, message: msg });
      ATLAS.ui.toast(`Gesendet an ${r.sent} von ${r.total_devices} Gerät(en)`, 'success');
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async sendToRole() {
    const role = document.getElementById('push-role')?.value;
    const msg = document.getElementById('push-msg-r')?.value.trim();
    const title = document.getElementById('push-title-r')?.value.trim() || 'ControlCenterHQ';
    if (!role || !msg) { ATLAS.ui.toast('Rolle und Nachricht erforderlich', 'warning'); return; }
    try {
      const r = await ATLAS.api.post('/api/push/send-to-role', { role, title, message: msg });
      ATLAS.ui.toast(`Gesendet an ${r.sent} Gerät(e)`, 'success');
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
};

/* ============================================================
   Modules Page
============================================================ */
ATLAS.modulesPage = {
  _meta: {
    command_control:  { icon: '🗺', desc: 'Live map, asset tracking, incident command', nav: 'map' },
    alert_system:     { icon: '🚨', desc: 'Alert center, severity escalations, notifications', nav: 'alerts' },
    intelligence:     { icon: '📊', desc: 'KPI dashboard, real-time charts, delta indicators', nav: 'dashboard' },
    communication:    { icon: '💬', desc: 'Chat rooms, direct messages, @mentions', nav: 'chat' },
    data_logging:     { icon: '📋', desc: 'Event log, audit trail, CSV/JSON exports', nav: 'logs' },
    hardware_sensors: { icon: '📡', desc: 'Sensor dashboard, IoT readings, anomaly detection', nav: 'sensors' },
    ai_analytics:     { icon: '🤖', desc: 'Z-score anomaly detection, trend prediction, heatmaps', nav: 'analytics' },
    user_management:  { icon: '👥', desc: 'User accounts, roles (admin/operator/viewer), online status', nav: 'users' },
    fleet_management: { icon: '🚗', desc: 'Vehicles, drivers, trips, maintenance, fuel logs', nav: 'fleet' },
    navigation:       { icon: '🧭', desc: 'Turn-by-turn GPS routing, voice guidance, live tracking', nav: 'navigation' },
  },

  async render(el) {
    const modules = await ATLAS.api.get('/api/modules') || [];
    const isAdmin = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'owner';
    const enabledCount = modules.filter(m=>m.enabled).length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('modules')}</h1>
        <div style="font-size:12px;color:var(--text-muted);">${enabledCount} / ${modules.length} active</div>
      </div>

      <div class="kpi-grid" style="margin-bottom:20px;">
        <div class="kpi-card"><div class="kpi-label">Total Modules</div><div class="kpi-value">${modules.length}</div><div class="kpi-icon">📦</div></div>
        <div class="kpi-card"><div class="kpi-label">Enabled</div><div class="kpi-value" style="color:var(--success);">${enabledCount}</div><div class="kpi-icon">✅</div></div>
        <div class="kpi-card"><div class="kpi-label">Disabled</div><div class="kpi-value" style="color:var(--text-muted);">${modules.length - enabledCount}</div><div class="kpi-icon">⏸</div></div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px;">
        ${modules.map(m => {
          const meta = this._meta[m.name] || { icon: '⚙', desc: 'Operations module', nav: null };
          return `
          <div class="card" style="display:flex;flex-direction:column;gap:12px;${!m.enabled?'opacity:0.7;':''}" id="mod-card-${m.name}">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="font-size:32px;line-height:1;flex-shrink:0;padding-top:2px;">${meta.icon}</div>
              <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <div style="font-size:14px;font-weight:700;">${m.name.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>
                  <span class="badge ${m.enabled?'badge-success':'badge-neutral'}" style="font-size:10px;">${m.enabled?'ON':'OFF'}</span>
                </div>
                <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">${meta.desc}</div>
              </div>
            </div>

            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              ${isAdmin ? `
              <button class="btn ${m.enabled?'btn-danger':'btn-primary'} btn-sm" onclick="ATLAS.modulesPage.toggle('${m.name}')">
                ${m.enabled?'⏸ Disable':'▶ Enable'}
              </button>` : ''}
              ${m.enabled && meta.nav ? `
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('${meta.nav}')">
                → Open
              </button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  },

  async toggle(name) {
    const card = document.getElementById('mod-card-'+name);
    if (card) card.style.opacity = '0.5';
    try {
      await ATLAS.api.post(`/api/modules/${name}/toggle`);
      const mods = await ATLAS.api.get('/api/modules');
      ATLAS.state.modules = mods || [];
      ATLAS.ui.buildNav();
      ATLAS.ui.toast(`Module "${name.replace(/_/g,' ')}" toggled`, 'info');
      ATLAS.router.go('modules', true);
    } catch(e) {
      ATLAS.ui.toast('Failed to toggle module', 'warning');
      if (card) card.style.opacity = '';
    }
  }
};

ATLAS.modules = {
  onToggle(data) {
    const m = ATLAS.state.modules.find(m => m.name === data.name);
    if (m) m.enabled = data.enabled;
    ATLAS.ui.buildNav();
  }
};

/* ============================================================
   Settings Page
============================================================ */
ATLAS.settingsPage = {
  async render(el) {
    // Wait for SW to finish registering (it auto-runs on load)
    await new Promise(r => setTimeout(r, 300));
    const [config, pushStatus] = await Promise.all([
      ATLAS.api.get('/api/config').catch(()=>({})),
      Promise.resolve(typeof AtlasSW !== 'undefined' ? AtlasSW.getPushStatus() : 'unsupported')
    ]);
    const isAdmin = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'owner';
    const u = ATLAS.state.user || {};
    el.innerHTML = `
      <div class="page-header"><h1>${ATLAS.i18n.t('settings')}</h1></div>
      <div class="grid-2">
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${isAdmin ? `
          <div class="card">
            <div class="card-title">🏢 Organization</div>
            <div class="form-group"><label class="form-label">${ATLAS.i18n.t('org_name')}</label><input id="cfg-org" class="form-input" value="${config.org_name||''}"></div>
            <div class="form-group"><label class="form-label">${ATLAS.i18n.t('facility_type')}</label><input id="cfg-type" class="form-input" value="${config.facility_type||''}"></div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.saveConfig()">💾 Save Organization</button>
          </div>
          ` : `<div class="card"><div class="card-title">🏢 Organization</div><div style="font-size:14px;font-weight:600;">${config.org_name||'ControlCenterHQ'}</div><div style="font-size:12px;color:var(--text-muted);">${config.facility_type||''}</div></div>`}

          <div class="card">
            <div class="card-title">🎨 ${ATLAS.i18n.t('theme')}</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Choose from 18 visual themes including seasonal & Liquid Glass 2.0. Your preference is saved per account.</p>
            <button class="btn btn-secondary w-full" onclick="ATLAS.ui.showThemePicker()">🎨 Open Theme Picker (18 themes)</button>
          </div>

          <div class="card">
            <div class="card-title">🌐 ${ATLAS.i18n.t('language')}</div>
            <div style="display:flex;gap:8px;">
              <button class="lang-btn ${ATLAS.i18n.lang==='en'?'active':''}" onclick="ATLAS.i18n.setLang('en');ATLAS.api.put('/api/auth/me',{language:'en'})">🇬🇧 English</button>
              <button class="lang-btn ${ATLAS.i18n.lang==='de'?'active':''}" onclick="ATLAS.i18n.setLang('de');ATLAS.api.put('/api/auth/me',{language:'de'})">🇩🇪 Deutsch</button>
              <button class="lang-btn ${ATLAS.i18n.lang==='fr'?'active':''}" onclick="ATLAS.i18n.setLang('fr');ATLAS.api.put('/api/auth/me',{language:'fr'})">🇫🇷 Français</button>
            </div>
          </div>

          <div class="card">
            <div class="card-title">🔒 Change Password</div>
            <div class="form-group"><label class="form-label">Current Password</label><input id="pw-current" class="form-input" type="password" autocomplete="off" placeholder="Current password"></div>
            <div class="form-group"><label class="form-label">New Password</label><input id="pw-new" class="form-input" type="password" autocomplete="new-password" placeholder="New password (min 8 chars)"></div>
            <div class="form-group"><label class="form-label">Confirm New Password</label><input id="pw-confirm" class="form-input" type="password" autocomplete="new-password" placeholder="Repeat new password"></div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.changePassword()">🔒 Update Password</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <div class="card-title">🔔 Alert Tone</div>
            <div class="form-group">
              <label class="form-label">Your alert tone</label>
              <select class="form-select" id="settings-tone" onchange="ATLAS.api.put('/api/auth/me',{alert_tone:this.value});ATLAS.state.user.alert_tone=this.value">
                ${ATLAS.audio.tones.map(t=>`<option value="${t.id}" ${u.alert_tone===t.id?'selected':''}>${t.name}</option>`).join('')}
              </select>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.audio.test(document.getElementById('settings-tone').value)">▶ ${ATLAS.i18n.t('test_tone')}</button>
            <div class="divider"></div>
            <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:8px;">ALL 20 TONES</div>
            <div style="display:flex;flex-direction:column;gap:5px;max-height:280px;overflow-y:auto;">
              ${ATLAS.audio.tones.map(t=>`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);transition:background 0.15s;" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background=''">
                  <span style="font-size:12px;font-weight:${u.alert_tone===t.id?'700':'400'};color:${u.alert_tone===t.id?'var(--accent)':'var(--text-primary)'};">${t.name}</span>
                  <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="ATLAS.audio.test('${t.id}')">▶</button>
                </div>`).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-title">📱 Push Notifications</div>

            <!-- Status indicator -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--bg-input);">
              <span style="font-size:20px;">${
                pushStatus === 'unsupported' ? '🚫' :
                pushStatus === 'denied'      ? '🔕' :
                pushStatus === 'active'      ? '🔔' : '💤'
              }</span>
              <div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${
                  pushStatus === 'unsupported' ? 'Not supported' :
                  pushStatus === 'denied'      ? 'Blocked by browser' :
                  pushStatus === 'active'      ? 'Active' : 'Not enabled'
                }</div>
                <div style="font-size:11px;color:var(--text-muted);">${
                  pushStatus === 'unsupported' ? 'Your browser does not support Web Push.' :
                  pushStatus === 'denied'      ? 'Allow notifications in browser settings, then reload.' :
                  pushStatus === 'active'      ? 'You will receive push alerts even when the tab is in background.' :
                  'Enable to receive alerts even when the tab is closed or in background.'
                }</div>
              </div>
            </div>

            <!-- Silent-mode bypass info -->
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);">
              🔊 <b>Silent Mode Bypass:</b> Critical alerts use <code>silent: false</code> + vibration patterns to bypass DND/quiet modes on Android. On iOS, install as PWA (Add to Home Screen) for best results.
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${pushStatus === 'not_subscribed' ? `
              <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.enablePush()">
                🔔 Enable Push Notifications
              </button>` : ''}
              ${pushStatus === 'denied' ? `
              <button class="btn btn-secondary btn-sm" disabled title="Allow notifications in your browser settings first">
                🔕 Blocked – Change in Browser Settings
              </button>` : ''}
              ${pushStatus === 'active' ? `
              <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.testPush()">
                🧪 Send Test Notification
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.disablePush()">
                🔕 Disable
              </button>` : ''}
              ${pushStatus === 'unsupported' ? '' : `
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.testLocalPush()">
                📳 Test Local Notification
              </button>`}
            </div>
          </div>

          ${isAdmin ? `
          <div class="card">
            <div class="card-title">🔧 System Administration</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px;">DATABASE BACKUP</div>
                <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Download a complete backup of the SQLite database.</p>
                <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.downloadBackup()">💾 ${ATLAS.i18n.t('backup')}</button>
              </div>
              <div class="divider" style="margin:4px 0;"></div>
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px;">SERVER RESTART</div>
                <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Restarts the backend process. The page will reload automatically after ~3 seconds.</p>
                <button class="btn btn-danger btn-sm" onclick="ATLAS.settingsPage.restartServer()">🔄 ${ATLAS.i18n.t('server_restart')}</button>
              </div>
              <div class="divider" style="margin:4px 0;"></div>
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px;">PI SENSORS</div>
                <div id="pi-sensors-display">
                  <button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.loadPiSensors()">📡 ${ATLAS.i18n.t('pi_sensors')} (${ATLAS.i18n.t('refresh')})</button>
                </div>
              </div>
            </div>
          </div>` : ''}

          ${isAdmin ? `
          <div class="card" id="server-config-card">
            <div class="card-title">🔐 Sicherheit & Server</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">
              Benutzername, Passwort und Server-Port des Admin-Kontos ändern.<br>
              <strong>Passwortregeln:</strong> min. 8 Zeichen, Großbuchstabe, Zahl, Sonderzeichen (z.B. <code>!@#$</code>)
            </p>

            <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.05em;margin-bottom:8px;">ZUGANGSDATEN</div>
            <div class="form-group">
              <label class="form-label">Aktueller Anzeigename</label>
              <input id="srv-adminname" class="form-input" placeholder="Wird geladen…" autocomplete="off">
            </div>
            <div class="form-group">
              <label class="form-label">Aktueller Benutzername (Login)</label>
              <input id="srv-adminuser" class="form-input" placeholder="Wird geladen…" autocomplete="off">
            </div>
            <div class="form-group">
              <label class="form-label">Neues Passwort <span style="color:var(--text-muted);font-weight:400;">(leer lassen = nicht ändern)</span></label>
              <div style="position:relative;">
                <input id="srv-adminpw" class="form-input" type="password" autocomplete="new-password"
                  placeholder="Min. 8 Zeichen, Groß, Zahl, Sonderzeichen"
                  style="padding-right:40px;">
                <span onclick="var i=document.getElementById('srv-adminpw');i.type=i.type==='password'?'text':'password';"
                  style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;user-select:none;">👁</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Neues Passwort bestätigen</label>
              <input id="srv-adminpw2" class="form-input" type="password" autocomplete="new-password" placeholder="Wiederholen">
            </div>

            <div class="divider" style="margin:12px 0;"></div>
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.05em;margin-bottom:8px;">SERVER-PORT</div>
            <div class="form-group">
              <div style="display:flex;align-items:center;gap:10px;">
                <input id="srv-port" class="form-input" type="number" min="1024" max="65535"
                  style="max-width:120px;" placeholder="8000">
                <span style="font-size:12px;color:var(--text-muted);">Aktuell: <strong id="srv-port-current">…</strong></span>
              </div>
              <div style="font-size:11px;color:var(--accent);margin-top:4px;">⚠️ Nach Portänderung muss der Server neu gestartet werden.</div>
            </div>

            <div class="divider" style="margin:12px 0;"></div>
            <div style="font-size:11px;font-weight:700;color:var(--danger);letter-spacing:.05em;margin-bottom:8px;">BESTÄTIGUNG</div>
            <div class="form-group">
              <label class="form-label">Aktuelles Passwort <span style="color:var(--danger);">*</span></label>
              <input id="srv-current-pw" class="form-input" type="password" autocomplete="current-password"
                placeholder="Zur Bestätigung erforderlich">
            </div>
            <div id="srv-config-error" style="color:var(--danger);font-size:12px;margin-bottom:8px;min-height:16px;font-weight:500;"></div>
            <div id="srv-config-ok" style="color:var(--success,#3fb950);font-size:12px;margin-bottom:8px;min-height:16px;font-weight:500;display:none;">✅ Gespeichert!</div>
            <button class="btn btn-primary" id="srv-save-btn" style="width:100%;" onclick="ATLAS.settingsPage.saveServerConfig()">💾 Änderungen speichern</button>
          </div>` : ''}

          ${isAdmin ? `
          <div class="card" id="license-card">
            <div class="card-title">🔑 Lizenz</div>
            <div id="lic-status-area"><div style="color:var(--text-muted);font-size:13px;">Lade…</div></div>
            <div class="divider" style="margin:10px 0;"></div>
            <div class="form-group">
              <label class="form-label" style="font-weight:600;">Lizenzkey eingeben</label>
              <div style="position:relative;">
                <input id="lic-key-input" class="form-input" type="text"
                  placeholder="CCHQ-XXXX-XXXX-XX-XXXXX"
                  autocomplete="off" autocorrect="off" spellcheck="false"
                  maxlength="26"
                  style="font-family:monospace;letter-spacing:1px;text-transform:uppercase;padding-right:40px;"
                  oninput="ATLAS.settingsPage._formatLicKey(this)"
                  onkeydown="if(event.key==='Enter')ATLAS.settingsPage.activateLicense()">
                <span id="lic-key-eye" onclick="ATLAS.settingsPage._toggleLicKeyVisibility()"
                  style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;user-select:none;">👁</span>
              </div>
              <div id="lic-key-hint" style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: CCHQ-TIER-JAHR-XX-XXXXX</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.activateLicense()" style="flex:1;">✅ Aktivieren</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.settingsPage.deactivateLicense()">🗑 Entfernen</button>
            </div>
            <div id="lic-activate-error" style="color:var(--danger);font-size:12px;margin-top:6px;min-height:16px;"></div>
          </div>` : ''}

          ${ATLAS.state.user?.role === 'owner' ? `
          <div class="card" id="lic-admin-card">
            <div class="card-title">🔑 Lizenzverwaltung <span style="font-size:11px;color:var(--text-muted);font-weight:400;">(Eigentümer)</span></div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Lizenzkeys für Kunden erstellen, verwalten und widerrufen. Kundenprogramme prüfen Keys über <code style="font-family:monospace;">POST /api/license/validate</code> auf cchq.queerbase.eu.</p>
            <div id="lic-admin-list" style="margin-bottom:12px;"></div>
            <button class="btn btn-primary btn-sm w-full" onclick="ATLAS.settingsPage.showCreateLicenseDialog()">➕ Neue Lizenz erstellen</button>
          </div>` : ''}

          <div class="card">
            <div class="card-title">ℹ️ About ControlCenterHQ</div>
            <div style="font-size:13px;display:flex;flex-direction:column;gap:8px;">
              ${[
                ['Application', 'ControlCenterHQ'],
                ['Version', '2.8.0'],
                ['Build', new Date().getFullYear()],
                ['Copyright', '© Felix Greis 2026'],
                ['Backend', 'Python FastAPI + SQLite + WebSocket'],
                ['Frontend', 'Vanilla JS + Leaflet + Chart.js'],
                ['Themes', '18 built-in visual themes'],
                ['Languages', 'English, Deutsch, Français'],
              ].map(([k,v])=>`
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
                  <span style="color:var(--text-muted);font-size:12px;">${k}</span>
                  <span style="font-weight:500;font-size:12px;">${v}</span>
                </div>`).join('')}
            </div>
            <div style="margin-top:12px;padding:10px;background:var(--accent-dim);border-radius:var(--radius-sm);font-size:11px;color:var(--text-muted);text-align:center;">
              ControlCenterHQ – Professional Operations Management Platform<br>© Felix Greis 2026 – All rights reserved.
            </div>
          </div>
        </div>
      </div>`;
    if (isAdmin) { this.loadLicense(); this.loadServerConfig(); }
    if (ATLAS.state.user?.role === 'owner') this.loadLicenseAdmin();
  },

  async loadLicense() {
    const el = document.getElementById('lic-status-area');
    if (!el) return;
    try {
      const lic = await ATLAS.api.get('/api/license');
      const tierColors = { PRO: '#22c55e', STANDARD: '#3b82f6', BASIC: '#6b7280' };
      const tierIcons  = { PRO: '⭐', STANDARD: '🔷', BASIC: '🔓' };
      const tierLabels = { PRO: 'PRO – Unbegrenzt', STANDARD: 'STANDARD – bis 10 Nutzer', BASIC: 'BASIC – Kein Key aktiv' };
      const color = tierColors[lic.tier] || '#6b7280';
      const icon  = tierIcons[lic.tier]  || '🔓';
      const label = tierLabels[lic.tier] || 'BASIC';
      const isActive = lic.active && lic.valid;

      // masked_key from backend already contains the asterisks (e.g. "****X7K9M")
      // just display it directly without adding extra stars
      const keyDisplay = lic.masked_key
        ? `<span style="font-family:monospace;font-size:12px;background:var(--surface-1);padding:2px 6px;border-radius:4px;letter-spacing:1px;">${lic.masked_key}</span>`
        : '<span style="color:var(--text-muted);font-style:italic;">Kein Key gespeichert</span>';

      const featuresHtml = [
        lic.features?.max_users != null ? `👤 Max. ${lic.features.max_users === 9999 ? '∞' : lic.features.max_users} Nutzer` : null,
        lic.features?.all  ? '🔓 Alle Module freigeschaltet' : null,
      ].filter(Boolean).map(f => `<span style="font-size:11px;background:${color}18;color:${color};padding:2px 6px;border-radius:10px;">${f}</span>`).join(' ');

      el.innerHTML = `
        <div style="border-radius:10px;border:1.5px solid ${color}44;overflow:hidden;">
          <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:${color}12;border-bottom:1px solid ${color}33;">
            <span style="font-size:28px;line-height:1;">${icon}</span>
            <div style="flex:1;">
              <div style="font-weight:800;font-size:16px;color:${color};">${label}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Lizenz-Tier</div>
            </div>
            <span style="font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;
              background:${isActive ? color : '#6b7280'};color:#fff;letter-spacing:.5px;">
              ${isActive ? '✅ AKTIV' : '❌ INAKTIV'}
            </span>
          </div>
          <div style="padding:10px 14px;display:flex;flex-direction:column;gap:6px;background:var(--surface-2);">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:11px;color:var(--text-muted);font-weight:600;">LIZENZKEY</span>
              ${keyDisplay}
            </div>
            ${featuresHtml ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:2px;">${featuresHtml}</div>` : ''}
            ${lic.grace_active ? `<div style="font-size:11px;color:#f59e0b;font-weight:600;">⚠️ Testphase aktiv – noch ${Math.ceil((lic.grace_remaining_seconds||0)/60)} Minuten</div>` : ''}
          </div>
        </div>`;
    } catch(e) { el.innerHTML = '<div style="color:var(--danger);font-size:12px;">❌ Fehler beim Laden der Lizenzinfo</div>'; }
  },

  _formatLicKey(input) {
    // Auto-insert dashes for CCHQ license key format: CCHQ-XXXX-XXXX-XX-XXXXX
    // Segments: 4 - 3 - 4 - 2 - 5  (CCHQ-PRO-2026-FG-X7K9M)
    const segLengths = [4, 3, 4, 2, 5];
    let raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let result = '';
    let pos = 0;
    for (let i = 0; i < segLengths.length && pos < raw.length; i++) {
      if (i > 0) result += '-';
      result += raw.substr(pos, segLengths[i]);
      pos += segLengths[i];
    }
    input.value = result;
    // Update hint color based on completeness
    const hint = document.getElementById('lic-key-hint');
    const total = segLengths.reduce((a,b)=>a+b,0);
    if (hint) hint.style.color = raw.length === total ? 'var(--success)' : 'var(--text-muted)';
  },

  // ── Lizenzverwaltung (Eigentümer) ────────────────────────────────────────
  async loadLicenseAdmin() {
    const el = document.getElementById('lic-admin-list');
    if (!el) return;
    try {
      const [lics, stats] = await Promise.all([
        ATLAS.api.get('/api/licenses').catch(()=>({licenses:[]})),
        ATLAS.api.get('/api/licenses/stats').catch(()=>null),
      ]);
      const L = lics.licenses || [];
      if (!L.length) {
        el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);padding:8px 0;">Noch keine Lizenzen erstellt.</div>`;
        return;
      }
      const tierColors = { PRO: '#22c55e', STANDARD: '#3b82f6' };
      const esc = ATLAS.ui.esc;
      el.innerHTML = `
        ${stats ? `<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;font-size:11px;">
          <span style="background:var(--accent-dim);padding:2px 8px;border-radius:10px;">Gesamt: <b>${stats.total}</b></span>
          <span style="background:var(--success-dim,#1a2e22);padding:2px 8px;border-radius:10px;">Aktiv: <b>${stats.active}</b></span>
          <span style="background:var(--danger-dim,#2e1a1a);padding:2px 8px;border-radius:10px;">Widerrufen: <b>${stats.revoked}</b></span>
          <span style="background:var(--warn-dim,#2e2a1a);padding:2px 8px;border-radius:10px;">Abgelaufen: <b>${stats.expired}</b></span>
        </div>` : ''}
        ${L.map(l => {
          const days = l.days_remaining;
          const expired = l.expires_at && days === 0;
          const revoked = l.status !== 'active';
          const badge = revoked
            ? `<span style="color:#ef4444;font-weight:600;">● widerrufen</span>`
            : expired
            ? `<span style="color:#f59e0b;font-weight:600;">● abgelaufen</span>`
            : `<span style="color:#22c55e;font-weight:600;">● aktiv</span>`;
          return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <div>
                <span style="font-family:monospace;font-weight:600;letter-spacing:1px;">${esc(l.key_display)}</span>
                <span style="display:inline-block;margin-left:6px;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;background:${tierColors[l.tier]||'#6b7280'}22;color:${tierColors[l.tier]||'#6b7280'};">${esc(l.tier)}</span>
                ${badge}
              </div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;">
                <button class="btn btn-secondary btn-sm" style="font-size:11px;padding:2px 8px;" onclick="ATLAS.settingsPage.showLicenseActivations(${l.id})">Geräte (${l.activations}/${l.max_activations})</button>
                ${revoked
                  ? `<button class="btn btn-primary btn-sm" style="font-size:11px;padding:2px 8px;" onclick="ATLAS.settingsPage.editLicenseStatus(${l.id},'active')">Reaktivieren</button>`
                  : `<button class="btn btn-warning btn-sm" style="font-size:11px;padding:2px 8px;" onclick="ATLAS.settingsPage.editLicenseStatus(${l.id},'revoked')">Widerrufen</button>`}
                <button class="btn btn-danger btn-sm" style="font-size:11px;padding:2px 8px;" onclick="ATLAS.settingsPage.deleteLicense(${l.id})">Löschen</button>
              </div>
            </div>
            <div style="display:flex;gap:12px;margin-top:6px;font-size:11px;color:var(--text-muted);flex-wrap:wrap;">
              ${l.customer_name ? `<span>👤 ${esc(l.customer_name)}</span>` : ''}
              ${l.customer_email ? `<span>✉️ ${esc(l.customer_email)}</span>` : ''}
              ${l.expires_at ? `<span>📅 ${esc(l.expires_at)}${!revoked && !expired && days!=null ? ` (${days}d)` : ''}</span>` : '<span>📅 kein Ablauf</span>'}
              <span>🔗 ${l.activations}/${l.max_activations} Aktivierungen</span>
            </div>
          </div>`;
        }).join('')}`;
    } catch(e) {
      el.innerHTML = `<div style="color:var(--danger);font-size:12px;">Fehler beim Laden: ${esc(e.message||'')}</div>`;
    }
  },

  async showCreateLicenseDialog() {
    const tier = prompt('Tier: "PRO" (unbegrenzt) oder "STANDARD" (10 Nutzer)?', 'STANDARD');
    if (!tier) return;
    const t = tier.toUpperCase();
    if (t !== 'PRO' && t !== 'STANDARD') { alert('Ungültiger Tier – nur PRO oder STANDARD.'); return; }
    const customer = prompt('Kundenname (optional):', '') || '';
    const email = prompt('Kunden-E-Mail (optional):', '') || '';
    const expiry = prompt('Ablaufdatum YYYY-MM-DD (leer = kein Ablauf):', '') || '';
    const acts = prompt('Max. Aktivierungen (1-100):', '3') || '3';
    try {
      const r = await ATLAS.api.post('/api/licenses', {
        tier: t, customer_name: customer, customer_email: email,
        expires_at: expiry.trim() || null, max_activations: parseInt(acts) || 3,
      });
      if (r.ok && r.key) {
        alert(`✅ Lizenz erstellt!\n\nKey: ${r.key}\n\nDiesen Key jetzt kopieren – er wird nur EINMAL angezeigt!`);
        this.loadLicenseAdmin();
      } else {
        alert('Fehler: ' + (r.detail || JSON.stringify(r)));
      }
    } catch(e) { alert('Fehler: ' + (e.message||'')); }
  },

  async editLicenseStatus(lid, status) {
    const action = status === 'revoked' ? 'widerrufen' : 'reaktivieren';
    if (!confirm(`Lizenz wirklich ${action}?`)) return;
    try {
      await ATLAS.api.put(`/api/licenses/${lid}`, { status });
      this.loadLicenseAdmin();
    } catch(e) { alert('Fehler: ' + (e.message||'')); }
  },

  async deleteLicense(lid) {
    if (!confirm('Lizenz UNWIDERRUFLICH löschen? Alle Aktivierungen werden ebenfalls entfernt.')) return;
    try {
      await ATLAS.api.delete(`/api/licenses/${lid}`);
      this.loadLicenseAdmin();
    } catch(e) { alert('Fehler: ' + (e.message||'')); }
  },

  async showLicenseActivations(lid) {
    try {
      const d = await ATLAS.api.get(`/api/licenses/${lid}/activations`);
      const esc = ATLAS.ui.esc;
      const list = d.activations.length
        ? d.activations.map(a =>
            `<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">
              <div><b>${esc(a.device_name || a.device_id)}</b><br><span style="color:var(--text-muted);font-size:11px;">ID: ${esc(a.device_id)} · v${esc(a.app_version||'?')} · ${esc(a.ip||'?')}</span></div>
              <button class="btn btn-danger btn-sm" style="font-size:10px;padding:2px 6px;" onclick="ATLAS.settingsPage.releaseActivation(${lid},${a.id})">Freigeben</button>
            </div>`).join('')
        : '<div style="font-size:12px;color:var(--text-muted);">Keine Aktivierungen.</div>';
      const w = document.createElement('div');
      w.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;';
      w.innerHTML = `<div style="background:var(--surface-1,#1a1f2e);border-radius:12px;padding:20px;max-width:520px;width:90%;max-height:80vh;overflow:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;">🔗 Aktivierungen (${d.activations.length}/${d.max_activations})</h3>
          <button class="btn btn-secondary btn-sm" onclick="this.closest('div[style*=fixed]').remove()">✕</button>
        </div>${list}</div>`;
      document.body.appendChild(w);
    } catch(e) { alert('Fehler: ' + (e.message||'')); }
  },

  async releaseActivation(lid, aid) {
    if (!confirm('Gerät freigeben? Das Gerät kann sich danach neu aktivieren.')) return;
    try {
      await ATLAS.api.delete(`/api/licenses/${lid}/activations/${aid}`);
      this.showLicenseActivations(lid);
    } catch(e) { alert('Fehler: ' + (e.message||'')); }
  },

  _toggleLicKeyVisibility() {
    const inp = document.getElementById('lic-key-input');
    const eye = document.getElementById('lic-key-eye');
    if (!inp) return;
    if (inp.dataset.hidden === 'true') {
      inp.style.webkitTextSecurity = '';
      inp.dataset.hidden = 'false';
      if (eye) eye.textContent = '👁';
    } else {
      inp.style.webkitTextSecurity = 'disc';
      inp.dataset.hidden = 'true';
      if (eye) eye.textContent = '🙈';
    }
  },

  async activateLicense() {
    const inp = document.getElementById('lic-key-input');
    const key = inp?.value.trim();
    const errEl = document.getElementById('lic-activate-error');
    if (errEl) errEl.textContent = '';
    if (!key) {
      if (errEl) errEl.textContent = '⚠️ Bitte einen Lizenzkey eingeben.';
      return;
    }
    const btn = document.querySelector('#license-card .btn-primary');
    const origText = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Prüfe…'; }
    try {
      const r = await ATLAS.api.post('/api/license/activate', { key });
      if (!r) { if(errEl) errEl.textContent = '❌ Keine Antwort vom Server.'; return; }
      if (inp) inp.value = '';
      if (errEl) errEl.textContent = '';
      ATLAS.ui.toast(`✅ Lizenz aktiviert: ${r.tier}`, 'success');
      await this.loadLicense();
    } catch(e) {
      const msg = e.message || 'Ungültiger Lizenzkey';
      if (errEl) errEl.textContent = '❌ ' + msg;
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = origText; }
    }
  },

  async deactivateLicense() {
    if (!confirm('Lizenz wirklich entfernen?')) return;
    try {
      await ATLAS.api.delete('/api/license');
      ATLAS.ui.toast('Lizenz entfernt', 'success');
      await this.loadLicense();
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'error'); }
  },

  async saveConfig() {
    const org = document.getElementById('cfg-org').value.trim();
    const type = document.getElementById('cfg-type').value.trim();
    if (!org) { ATLAS.ui.toast('Organization name required','warning'); return; }
    try {
      await ATLAS.api.put('/api/config', { org_name: org, facility_type: type });
      document.getElementById('sidebar-org-name').textContent = org;
      ATLAS.ui.toast('Organization settings saved','success');
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async changePassword() {
    const current = document.getElementById('pw-current').value;
    const newPw = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;
    if (!current || !newPw || !confirm) { ATLAS.ui.toast('All fields required','warning'); return; }
    if (newPw !== confirm) { ATLAS.ui.toast('Passwords do not match','warning'); return; }
    if (newPw.length < 8) { ATLAS.ui.toast('Password must be at least 8 characters','warning'); return; }
    try {
      await ATLAS.api.put('/api/auth/me', { current_password: current, password: newPw });
      ATLAS.ui.toast('Password changed successfully','success');
      document.getElementById('pw-current').value = '';
      document.getElementById('pw-new').value = '';
      document.getElementById('pw-confirm').value = '';
    } catch(e) { ATLAS.ui.toast(e.message||'Failed to change password','warning'); }
  },

  async loadServerConfig() {
    try {
      const cfg = await ATLAS.api.get('/api/config');
      const g = id => document.getElementById(id);
      if (cfg.port)           { if(g('srv-port')) g('srv-port').value = cfg.port; if(g('srv-port-current')) g('srv-port-current').textContent = cfg.port; }
      if (cfg.admin_name)     { if(g('srv-adminname')) g('srv-adminname').value = cfg.admin_name; }
      if (cfg.admin_username) { if(g('srv-adminuser')) g('srv-adminuser').value = cfg.admin_username; }
    } catch(e) { /* silent */ }
  },

  async saveServerConfig() {
    const g = id => document.getElementById(id);
    const errEl = g('srv-config-error');
    const okEl  = g('srv-config-ok');
    const btn   = g('srv-save-btn');
    if (errEl) { errEl.textContent = ''; errEl.style.display = ''; }
    if (okEl)  { okEl.style.display = 'none'; }

    const currentPw = g('srv-current-pw')?.value?.trim() || '';
    if (!currentPw) {
      if (errEl) errEl.textContent = '❌ Aktuelles Passwort ist erforderlich.';
      return;
    }

    const portVal   = g('srv-port')?.value;
    const adminName = g('srv-adminname')?.value?.trim() || '';
    const adminUser = g('srv-adminuser')?.value?.trim() || '';
    const newPw     = g('srv-adminpw')?.value || '';
    const newPw2    = g('srv-adminpw2')?.value || '';

    // Client-side password validation (mirrors server rules)
    if (newPw) {
      if (newPw.length < 8)                              { if(errEl) errEl.textContent = '❌ Passwort min. 8 Zeichen.'; return; }
      if (!/[A-Z]/.test(newPw))                         { if(errEl) errEl.textContent = '❌ Passwort braucht einen Großbuchstaben (A–Z).'; return; }
      if (!/[0-9]/.test(newPw))                         { if(errEl) errEl.textContent = '❌ Passwort braucht eine Zahl (0–9).'; return; }
      if (!/[!@#$%^&*()\-_=+\[\]{}|;:',.<>?\/`~"\\]/.test(newPw)) { if(errEl) errEl.textContent = '❌ Passwort braucht ein Sonderzeichen (z.B. !@#$).'; return; }
      if (newPw !== newPw2) { if(errEl) errEl.textContent = '❌ Passwörter stimmen nicht überein.'; return; }
    }

    const payload = { current_password: currentPw };
    if (portVal)   payload.port = parseInt(portVal);
    if (adminName) payload.admin_name = adminName;
    if (adminUser) payload.admin_username = adminUser;
    if (newPw)     payload.admin_password = newPw;

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Speichern…'; }
    try {
      const res = await ATLAS.api.post('/api/setup/reconfigure', payload);
      // Clear sensitive fields
      ['srv-current-pw','srv-adminpw','srv-adminpw2'].forEach(id => { if(g(id)) g(id).value = ''; });
      if (okEl) { okEl.style.display = ''; }
      if (errEl) errEl.style.display = 'none';
      if (res.port && g('srv-port-current')) g('srv-port-current').textContent = res.port;
      const portChanged = portVal && parseInt(portVal) !== (window._cfgPortBefore || 8000);
      if (portChanged) {
        ATLAS.ui.toast(`Port geändert auf ${res.port} – Server jetzt neu starten!`, 'warning');
      } else {
        ATLAS.ui.toast('Einstellungen gespeichert ✅', 'success');
      }
      // If username changed, token is still valid but update displayed name
      if (adminUser && ATLAS.state.user) ATLAS.state.user.username = adminUser;
      if (adminName && ATLAS.state.user) ATLAS.state.user.full_name = adminName;
    } catch(e) {
      if (errEl) { errEl.textContent = '❌ ' + (e.message || 'Fehler beim Speichern'); errEl.style.display = ''; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '💾 Änderungen speichern'; }
    }
  },

  async enablePush() {
    // Guard: Push requires HTTPS (or localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      ATLAS.ui.modal('HTTPS erforderlich', `
        <p style="margin-bottom:12px;">Web Push Notifications erfordern eine <strong>sichere HTTPS-Verbindung</strong>.</p>
        <p style="font-size:13px;color:var(--text-muted);">Aktuell: <code>${location.protocol}//${location.hostname}</code></p>
        <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">Bitte entweder:</p>
        <ul style="font-size:13px;color:var(--text-muted);padding-left:20px;line-height:2;">
          <li>Über <code>localhost:8000</code> öffnen (lokaler Betrieb)</li>
          <li>Tailscale / Reverse-Proxy mit HTTPS-Zertifikat verwenden</li>
          <li>Ngrok / Cloudflare Tunnel für HTTPS-Tunnel nutzen</li>
        </ul>`,
        `<button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">OK</button>`
      );
      return;
    }
    if (typeof AtlasSW === 'undefined' || !AtlasSW.supported) {
      ATLAS.ui.toast('Dieser Browser unterstützt keine Push-Benachrichtigungen.', 'warning');
      return;
    }
    // Ensure SW is registered before subscribing
    if (!AtlasSW.registration) {
      ATLAS.ui.toast('Service Worker wird initialisiert…', 'info');
      const ok = await AtlasSW.register();
      if (!ok || !AtlasSW.registration) {
        ATLAS.ui.toast('Service Worker Registrierung fehlgeschlagen. Seite neu laden.', 'warning');
        return;
      }
      await new Promise(r => setTimeout(r, 300)); // give SW time to activate
    }
    ATLAS.ui.toast('Berechtigungsanfrage wird gestellt…', 'info');
    const sub = await AtlasSW.subscribePush(ATLAS.state.token);
    if (sub) {
      ATLAS.ui.toast('✅ Push-Benachrichtigungen aktiviert!', 'success');
      ATLAS.router.go('settings', true);
    } else {
      const perm = Notification.permission;
      if (perm === 'denied') {
        ATLAS.ui.modal('Benachrichtigungen entsperren', `
          <p style="margin-bottom:12px;">Die Berechtigung wurde <strong>verweigert</strong>. So entsperren:</p>
          <ul style="margin:0;padding-left:20px;font-size:13px;color:var(--text-muted);line-height:2.2;">
            <li><strong>Chrome/Edge:</strong> Adressleiste → 🔒 → Benachrichtigungen → Erlauben → Seite neu laden</li>
            <li><strong>Firefox:</strong> Adressleiste → 🔒 → Berechtigungen → Benachrichtigungen löschen → neu versuchen</li>
            <li><strong>Safari (macOS):</strong> Safari → Einstellungen → Websites → Benachrichtigungen → Atlas erlauben</li>
            <li><strong>iOS Safari:</strong> Einstellungen → Apps → Safari → Atlas → Benachrichtigungen → Erlauben</li>
            <li><strong>Samsung Internet:</strong> ≡ Menü → Einstellungen → Websites → Benachrichtigungen</li>
          </ul>
          <p style="margin-top:12px;font-size:11px;color:var(--text-dim);">Tipp: Als PWA installieren (Teilen → Zum Home-Bildschirm) für beste Ergebnisse auf iOS.</p>`,
          `<button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">Verstanden</button>`
        );
      } else {
        ATLAS.ui.toast('Push konnte nicht aktiviert werden – Konsole für Details öffnen (F12).', 'warning');
      }
    }
  },

  async disablePush() {
    if (typeof AtlasSW === 'undefined') return;
    await AtlasSW.unsubscribePush(ATLAS.state.token);
    ATLAS.ui.toast('Push-Benachrichtigungen deaktiviert', 'info');
    ATLAS.router.go('settings', true);
  },

  async testPush() {
    if (typeof AtlasSW === 'undefined') return;
    ATLAS.ui.toast('Test-Push wird gesendet…', 'info');
    const ok = await AtlasSW.sendTestPush(ATLAS.state.token);
    if (ok) {
      ATLAS.ui.toast('✅ Test-Push gesendet! Benachrichtigungsleiste prüfen.', 'success');
    } else {
      // Fallback: local notification via SW (no server needed)
      await this.testLocalPush();
    }
  },

  async testLocalPush() {
    if (typeof AtlasSW === 'undefined') {
      ATLAS.ui.toast('Service Worker nicht verfügbar', 'warning'); return;
    }
    const ok = await AtlasSW.showLocalNotification(
      '🔔 Atlas Test-Benachrichtigung',
      'Push-Benachrichtigungen funktionieren korrekt!',
      {
        tag: 'atlas-test',
        requireInteraction: false,
        vibrate: [100, 50, 100],
        data: { url: '/#/settings' },
        actions: [{ action: 'view', title: 'Einstellungen öffnen' }],
      }
    );
    if (ok) {
      ATLAS.ui.toast('✅ Lokale Test-Benachrichtigung gesendet!', 'success');
    } else {
      ATLAS.ui.toast('Bitte zuerst Benachrichtigungen erlauben.', 'warning');
    }
  },

  downloadBackup() {
    const a = document.createElement('a');
    a.href = '/api/system/backup';
    a.download = `atlas_backup_${new Date().toISOString().slice(0,10)}.db`;
    // Auth header can't be set on anchor tag – pass token in cookie or use window.open
    // Instead: fetch with auth then create object URL
    fetch('/api/system/backup', { headers: { 'Authorization': `Bearer ${ATLAS.state.token}` } })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a2 = document.createElement('a');
        a2.href = url; a2.download = `atlas_backup_${new Date().toISOString().slice(0,10)}.db`;
        a2.click(); URL.revokeObjectURL(url);
        ATLAS.ui.toast('Backup downloaded', 'success');
      }).catch(e => ATLAS.ui.toast('Backup failed: ' + e.message, 'error'));
  },

  async restartServer() {
    if (!confirm('Restart the Atlas server? The page will reload automatically.')) return;
    try {
      await ATLAS.api.post('/api/system/restart', {});
      ATLAS.ui.toast('Server restarting...', 'info');
      setTimeout(() => location.reload(), 4000);
    } catch(e) { ATLAS.ui.toast('Restart failed: ' + e.message, 'error'); }
  },

  async loadPiSensors() {
    const el = document.getElementById('pi-sensors-display');
    if (el) el.innerHTML = '⏳ Loading...';
    try {
      const data = await ATLAS.api.get('/api/system/sensors');
      if (el) {
        const temp = data.cpu_temp_c != null ? `${data.cpu_temp_c}°C` : 'N/A';
        const volt = data.cpu_voltage_v != null ? `${data.cpu_voltage_v}V` : 'N/A';
        const platform = data.platform || 'unknown';
        el.innerHTML = `
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <div style="padding:8px 14px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);">🌡️ ${ATLAS.i18n.t('cpu_temp')}</div>
              <div style="font-size:18px;font-weight:700;">${temp}</div>
            </div>
            <div style="padding:8px 14px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);">⚡ ${ATLAS.i18n.t('cpu_voltage')}</div>
              <div style="font-size:18px;font-weight:700;">${volt}</div>
            </div>
            <div style="padding:8px 14px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);">Platform</div>
              <div style="font-size:13px;font-weight:600;">${platform}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="ATLAS.settingsPage.loadPiSensors()">🔄 ${ATLAS.i18n.t('refresh')}</button>`;
      }
    } catch(e) {
      if (el) el.innerHTML = `<span style="color:var(--danger);">Failed: ${e.message}</span>`;
    }
  },
};

/* ============================================================
   Pager Gateway Page
============================================================ */
ATLAS.pagerPage = {
  _tab: 'rx',
  _rxMessages: [],
  _rxRunning: false,
  _config: null,

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;">📟 ${t('pager')}</h2>
      </div>
      <div class="tab-bar" style="display:flex;gap:4px;margin-bottom:20px;background:var(--bg-card);padding:4px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
        <button class="btn btn-sm pager-tab-btn ${this._tab==='rx'?'btn-primary':''}" data-tab="rx" onclick="ATLAS.pagerPage.switchTab('rx')">📡 ${t('pager_rx')}</button>
        <button class="btn btn-sm pager-tab-btn ${this._tab==='tx'?'btn-primary':''}" data-tab="tx" onclick="ATLAS.pagerPage.switchTab('tx')">📤 ${t('pager_tx')}</button>
        <button class="btn btn-sm pager-tab-btn ${this._tab==='channels'?'btn-primary':''}" data-tab="channels" onclick="ATLAS.pagerPage.switchTab('channels')">🔔 ${t('pager_channels')}</button>
      </div>
      <div id="pager-tab-content"></div>`;
    await this.loadConfig();
    this.renderTab();
  },

  async loadConfig() {
    try {
      const cfg = await ATLAS.api.get('/api/pager/config');
      if (cfg) this._config = cfg;
    } catch(e) { this._config = {}; }
  },

  switchTab(tab) {
    this._tab = tab;
    document.querySelectorAll('.pager-tab-btn').forEach(b => {
      b.classList.toggle('btn-primary', b.dataset.tab === tab);
      b.classList.remove('btn-secondary');
      if (b.dataset.tab !== tab) b.classList.add('btn-secondary');
    });
    this.renderTab();
  },

  async renderTab() {
    const el = document.getElementById('pager-tab-content');
    if (!el) return;
    if (this._tab === 'rx') await this.renderRX(el);
    else if (this._tab === 'tx') await this.renderTX(el);
    else await this.renderChannels(el);
  },

  async renderRX(el) {
    const t = k => ATLAS.i18n.t(k);
    const cfg = this._config || {};
    // Get RX status
    let status = { running: false, last_received: null, message_count: 0 };
    try { status = await ATLAS.api.get('/api/pager/rx/status') || status; } catch(e) {}
    this._rxRunning = status.running;

    // Get recent messages
    let msgs = [];
    try { const r = await ATLAS.api.get('/api/pager/rx/messages?limit=50'); msgs = r?.messages || []; } catch(e) {}
    this._rxMessages = msgs;

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card" style="padding:16px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${t('status')}</div>
          <div id="rx-status-badge" class="badge ${this._rxRunning?'badge-success':'badge-muted'}" style="font-size:14px;padding:6px 12px;">
            ${this._rxRunning ? '🟢 '+t('rx_running') : '🔴 '+t('rx_stopped')}
          </div>
        </div>
        <div class="card" style="padding:16px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${t('rx_frequency')}</div>
          <div style="font-weight:600;">${cfg.rx_frequency || 439.9875} MHz</div>
          <div style="font-size:11px;color:var(--text-muted);">Gain: ${cfg.rx_gain || 40} dB | Msg: ${status.message_count || 0}</div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <button id="rx-start-btn" class="btn btn-primary" onclick="ATLAS.pagerPage.startRX()" ${this._rxRunning?'disabled':''}>
          ▶ ${t('start_rx')}
        </button>
        <button id="rx-stop-btn" class="btn btn-danger" onclick="ATLAS.pagerPage.stopRX()" ${!this._rxRunning?'disabled':''}>
          ⏹ ${t('stop_rx')}
        </button>
        <div style="flex:1"></div>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.renderTab()">🔄 ${t('refresh')}</button>
      </div>

      <div class="card">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:600;">${t('pager_rx')} – Live Feed</div>
          <div style="font-size:11px;color:var(--text-muted);">${msgs.length} ${t('history')}</div>
        </div>
        <div id="pager-rx-feed" style="max-height:400px;overflow-y:auto;">
          ${msgs.length === 0
            ? `<div style="padding:32px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`
            : msgs.map(m => this._rxMsgHtml(m)).join('')}
        </div>
      </div>

      <div class="card" style="margin-top:16px;padding:16px;">
        <div style="font-weight:600;margin-bottom:12px;">⚙ ${t('rx_frequency')} & ${t('rx_filter_capcodes')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end;">
          <div>
            <label class="form-label">${t('rx_frequency')}</label>
            <input type="number" id="rx-freq" class="form-input" value="${cfg.rx_frequency||439.9875}" step="0.0001">
          </div>
          <div>
            <label class="form-label">${t('rx_gain')}</label>
            <input type="number" id="rx-gain" class="form-input" value="${cfg.rx_gain||40}" min="0" max="50">
          </div>
          <div>
            <label class="form-label" style="visibility:hidden;">save</label>
            <button class="btn btn-primary" onclick="ATLAS.pagerPage.saveRXConfig()">${t('save')}</button>
          </div>
        </div>
        <div style="margin-top:10px;">
          <label class="form-label">${t('rx_filter_capcodes')}</label>
          <input type="text" id="rx-capcodes" class="form-input" value="${(cfg.rx_filter_capcodes||'[]').replace(/["\[\]]/g,'').replace(/,/g,', ')}" placeholder="e.g. 1234567, 8901234">
        </div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="rx-create-alerts" ${cfg.rx_create_alerts?'checked':''}>
          <label for="rx-create-alerts">${t('rx_create_alerts')}</label>
        </div>
      </div>`;
  },

  _rxMsgHtml(m) {
    const ts = new Date(m.received_at).toLocaleString();
    return `<div class="pager-rx-msg" style="padding:10px 16px;border-bottom:1px solid var(--border-color);display:flex;gap:12px;align-items:flex-start;">
      <div style="flex-shrink:0;">
        <span class="capcode-badge">${m.capcode||'—'}</span>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${m.protocol||''}</div>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="word-break:break-word;">${ATLAS.ui.esc(m.message)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${ts} · ${m.frequency||''}MHz</div>
      </div>
      ${m.alert_id ? `<div style="font-size:11px;color:var(--accent);">🔔 #${m.alert_id}</div>` : ''}
    </div>`;
  },

  onRxMessage(data) {
    const feed = document.getElementById('pager-rx-feed');
    if (!feed) return;
    const noData = feed.querySelector('div[style*="text-align:center"]');
    if (noData) feed.innerHTML = '';
    feed.insertAdjacentHTML('afterbegin', this._rxMsgHtml(data));
    // Update count
    const badge = document.getElementById('rx-status-badge');
    if (badge) badge.className = `badge badge-success`;
  },

  async startRX() {
    const ok = await ATLAS.api.post('/api/pager/rx/start', {});
    if (ok) {
      ATLAS.ui.toast(ATLAS.i18n.t('rx_running'), 'success');
      this._rxRunning = true;
      const btn = document.getElementById('rx-start-btn');
      const stop = document.getElementById('rx-stop-btn');
      if (btn) btn.disabled = true;
      if (stop) stop.disabled = false;
      document.getElementById('rx-status-badge').innerHTML = '🟢 ' + ATLAS.i18n.t('rx_running');
      document.getElementById('rx-status-badge').className = 'badge badge-success';
    }
  },

  async stopRX() {
    const ok = await ATLAS.api.post('/api/pager/rx/stop', {});
    if (ok) {
      ATLAS.ui.toast(ATLAS.i18n.t('rx_stopped'), 'info');
      this._rxRunning = false;
      const btn = document.getElementById('rx-start-btn');
      const stop = document.getElementById('rx-stop-btn');
      if (btn) btn.disabled = false;
      if (stop) stop.disabled = true;
      document.getElementById('rx-status-badge').innerHTML = '🔴 ' + ATLAS.i18n.t('rx_stopped');
      document.getElementById('rx-status-badge').className = 'badge badge-muted';
    }
  },

  async saveRXConfig() {
    const freq = parseFloat(document.getElementById('rx-freq').value);
    const gain = parseInt(document.getElementById('rx-gain').value);
    const capcodes = document.getElementById('rx-capcodes').value
      .split(',').map(s=>s.trim()).filter(Boolean);
    const create_alerts = document.getElementById('rx-create-alerts').checked ? 1 : 0;
    try {
      await ATLAS.api.put('/api/pager/config', {
        rx_frequency: freq, rx_gain: gain,
        rx_filter_capcodes: JSON.stringify(capcodes),
        rx_create_alerts: create_alerts
      });
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async renderTX(el) {
    const t = k => ATLAS.i18n.t(k);
    const cfg = this._config || {};
    const callsigns = (cfg.dapnet_target_callsigns||'[]').replace(/["\[\]]/g,'').replace(/,/g,', ');
    el.innerHTML = `
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;margin-bottom:14px;">📤 ${t('send_to_pager')}</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label class="form-label">${t('message')}</label>
            <textarea id="tx-message" class="form-input" rows="3" maxlength="80" placeholder="Max. 80 Zeichen (POCSAG Alpha)"></textarea>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;" id="tx-char-count">0 / 80</div>
          </div>
          <div>
            <label class="form-label">${t('target_callsigns')}</label>
            <input type="text" id="tx-callsigns" class="form-input" value="${callsigns}" placeholder="e.g. DL1XY, DL2AB">
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Separate multiple callsigns with commas</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="ATLAS.pagerPage.sendTX()">📡 ${t('send_to_pager')}</button>
            <button class="btn btn-secondary" onclick="ATLAS.pagerPage.testDAPNET()">🔧 ${t('pager_test_ok')} DAPNET</button>
          </div>
        </div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-weight:600;margin-bottom:14px;">⚙ ${t('dapnet_config')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <label class="form-label">${t('callsign')}</label>
            <input type="text" id="dapnet-callsign" class="form-input" value="${cfg.dapnet_callsign||''}" placeholder="DL1XY">
          </div>
          <div>
            <label class="form-label">${t('transmitter_group')}</label>
            <input type="text" id="dapnet-txgrp" class="form-input" value="${cfg.dapnet_transmitter_group||'dl-all'}">
          </div>
          <div>
            <label class="form-label">${t('password')}</label>
            <input type="password" id="dapnet-pass" class="form-input" value="${cfg.dapnet_password||''}" placeholder="DAPNET password">
          </div>
          <div>
            <label class="form-label">${t('severity')} trigger</label>
            <input type="text" id="dapnet-severity" class="form-input" value="${cfg.dapnet_on_severity||'critical,warning'}" placeholder="critical,warning">
          </div>
        </div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="dapnet-enabled" ${cfg.dapnet_enabled?'checked':''}>
          <label for="dapnet-enabled">${t('enabled')}: DAPNET auto-dispatch on alerts</label>
        </div>
        <button class="btn btn-primary" style="margin-top:12px;" onclick="ATLAS.pagerPage.saveDAPNETConfig()">${t('save')}</button>
      </div>`;

    // Char counter
    const ta = document.getElementById('tx-message');
    if (ta) ta.oninput = () => {
      document.getElementById('tx-char-count').textContent = ta.value.length + ' / 80';
    };
  },

  async sendTX() {
    const msg = document.getElementById('tx-message')?.value?.trim();
    const callsigns = document.getElementById('tx-callsigns')?.value?.split(',').map(s=>s.trim()).filter(Boolean);
    if (!msg) return ATLAS.ui.toast(ATLAS.i18n.t('error') + ': no message', 'error');
    if (!callsigns?.length) return ATLAS.ui.toast(ATLAS.i18n.t('error') + ': no callsigns', 'error');
    try {
      await ATLAS.api.post('/api/pager/tx', { message: msg, callsigns });
      ATLAS.ui.toast('📡 ' + ATLAS.i18n.t('send_to_pager') + ' OK', 'success');
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('pager_test_fail'), 'error'); }
  },

  async testDAPNET() {
    ATLAS.ui.toast('Testing DAPNET…', 'info');
    try {
      await ATLAS.api.post('/api/pager/tx/test', {});
      ATLAS.ui.toast('✅ ' + ATLAS.i18n.t('pager_test_ok'), 'success');
    } catch(e) { ATLAS.ui.toast('❌ ' + (e.message || ATLAS.i18n.t('pager_test_fail')), 'error'); }
  },

  async saveDAPNETConfig() {
    const callsign = document.getElementById('dapnet-callsign').value.trim().toUpperCase();
    const password = document.getElementById('dapnet-pass').value;
    const transmitter_group = document.getElementById('dapnet-txgrp').value.trim();
    const dapnet_on_severity = document.getElementById('dapnet-severity').value.trim();
    const dapnet_enabled = document.getElementById('dapnet-enabled').checked ? 1 : 0;
    try {
      await ATLAS.api.put('/api/pager/config', {
        dapnet_callsign: callsign, dapnet_password: password,
        dapnet_transmitter_group: transmitter_group,
        dapnet_on_severity, dapnet_enabled
      });
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.loadConfig();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async renderChannels(el) {
    const t = k => ATLAS.i18n.t(k);
    const cfg = this._config || {};
    let wpStatus = 'unknown';
    if (typeof AtlasSW !== 'undefined') wpStatus = AtlasSW.getPushStatus();
    const channels = JSON.parse(cfg.channels || '["webpush"]');

    el.innerHTML = `
      <!-- Web Push -->
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;margin-bottom:10px;">🌐 ${t('webpush_status')}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="badge ${wpStatus==='active'?'badge-success':'badge-muted'}">${wpStatus}</span>
          ${wpStatus !== 'active' ? `<button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.enablePush()">Enable Web Push</button>` : `<button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.testPush()">Test Push</button>`}
        </div>
      </div>

      <!-- ntfy -->
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-weight:600;">📱 ${t('ntfy_config')}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="ntfy-enabled" ${cfg.ntfy_enabled?'checked':''}>
            <label for="ntfy-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label class="form-label">${t('ntfy_url')}</label>
            <input type="url" id="ntfy-url" class="form-input" value="${cfg.ntfy_url||''}" placeholder="http://localhost:2586">
          </div>
          <div>
            <label class="form-label">${t('ntfy_topic')}</label>
            <input type="text" id="ntfy-topic" class="form-input" value="${cfg.ntfy_topic||'atlas-alerts'}">
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <label class="form-label">${t('ntfy_token')} (optional)</label>
          <input type="password" id="ntfy-token" class="form-input" value="${cfg.ntfy_token||''}" placeholder="Bearer token if server requires auth">
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.pagerPage.saveNtfyConfig()">${t('save')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.testNtfy()">🔔 Test ntfy</button>
        </div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-muted);">
          iOS: Install <strong>ntfy</strong> from App Store, subscribe to this topic.<br>
          For iOS push via APNs, set <code>upstream-base-url: https://ntfy.sh</code> in your ntfy server config.
        </div>
      </div>

      <!-- Apprise -->
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-weight:600;">🔗 ${t('apprise_config')}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="apprise-enabled" ${cfg.apprise_enabled?'checked':''}>
            <label for="apprise-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <label class="form-label">${t('apprise_urls')}</label>
          <textarea id="apprise-urls" class="form-input" rows="5" placeholder="tgram://bottoken/chatid&#10;mailto://user:pass@gmail.com&#10;discord://webhook_id/webhook_token&#10;slack://tokenA/tokenB/tokenC/channel">${cfg.apprise_urls||''}</textarea>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">
          90+ services supported: Telegram, Email, Discord, Slack, Signal, Matrix, PushOver, Gotify…<br>
          See <a href="https://github.com/caronc/apprise/wiki" target="_blank" style="color:var(--accent);">apprise wiki</a> for URL formats.
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.pagerPage.saveAppriseConfig()">${t('save')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.testApprise()">🔗 Test Apprise</button>
        </div>
      </div>

      <!-- Gotify Config -->
      <div class="card" style="padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-weight:600;">🔔 ${t('gotify_config')}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="gotify-enabled" ${cfg.gotify_enabled?'checked':''}>
            <label for="gotify-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${t('gotify_url')}</label>
            <input id="gotify-url" class="form-input" placeholder="http://your-gotify:80" value="${cfg.gotify_url||''}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('gotify_token')}</label>
            <input id="gotify-token" class="form-input" type="password" placeholder="App token" value="${cfg.gotify_token||''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${t('gotify_priority')} (1-10)</label>
          <input id="gotify-priority" class="form-input" type="number" min="1" max="10" value="${cfg.gotify_priority||5}" style="width:100px;">
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.pagerPage.saveGotifyConfig()">${t('save')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.testGotify()">🔔 Test Gotify</button>
        </div>
      </div>

      <!-- Active channels summary -->
      <div class="card" style="padding:16px;">
        <div style="font-weight:600;margin-bottom:10px;">📋 ${t('channels')}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${['webpush','ntfy','gotify','apprise','dapnet'].map(ch => `
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
              <input type="checkbox" class="channel-check" value="${ch}" ${channels.includes(ch)?'checked':''}>
              ${ch === 'webpush' ? '🌐 Web Push' : ch === 'ntfy' ? '📱 ntfy' : ch === 'gotify' ? '🔔 Gotify' : ch === 'apprise' ? '🔗 Apprise' : '📟 DAPNET'}
            </label>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="ATLAS.pagerPage.saveChannels()">${t('save')} ${t('channels')}</button>
      </div>`;
  },

  async saveNtfyConfig() {
    try {
      await ATLAS.api.put('/api/pager/config', {
        ntfy_enabled: document.getElementById('ntfy-enabled').checked ? 1 : 0,
        ntfy_url: document.getElementById('ntfy-url').value.trim(),
        ntfy_topic: document.getElementById('ntfy-topic').value.trim(),
        ntfy_token: document.getElementById('ntfy-token').value.trim(),
      });
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.loadConfig();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async testNtfy() {
    ATLAS.ui.toast('Testing ntfy…', 'info');
    try {
      await ATLAS.api.post('/api/pager/ntfy/test', {});
      ATLAS.ui.toast('✅ ntfy OK', 'success');
    } catch(e) { ATLAS.ui.toast('❌ ntfy ' + (e.message || ATLAS.i18n.t('pager_test_fail')), 'error'); }
  },

  async saveAppriseConfig() {
    try {
      await ATLAS.api.put('/api/pager/config', {
        apprise_enabled: document.getElementById('apprise-enabled').checked ? 1 : 0,
        apprise_urls: document.getElementById('apprise-urls').value.trim(),
      });
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.loadConfig();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async testApprise() {
    ATLAS.ui.toast('Testing Apprise…', 'info');
    try {
      await ATLAS.api.post('/api/pager/apprise/test', {});
      ATLAS.ui.toast('✅ Apprise OK', 'success');
    } catch(e) { ATLAS.ui.toast('❌ Apprise ' + (e.message || ATLAS.i18n.t('pager_test_fail')), 'error'); }
  },

  async saveGotifyConfig() {
    try {
      await ATLAS.api.put('/api/pager/config', {
        gotify_enabled: document.getElementById('gotify-enabled').checked ? 1 : 0,
        gotify_url: document.getElementById('gotify-url').value.trim(),
        gotify_token: document.getElementById('gotify-token').value.trim(),
        gotify_priority: parseInt(document.getElementById('gotify-priority').value) || 5,
      });
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.loadConfig();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async testGotify() {
    ATLAS.ui.toast('Testing Gotify…', 'info');
    try {
      await ATLAS.api.post('/api/pager/gotify/test', {});
      ATLAS.ui.toast('✅ Gotify OK', 'success');
    } catch(e) { ATLAS.ui.toast('❌ Gotify ' + (e.message || ATLAS.i18n.t('pager_test_fail')), 'error'); }
  },

  async saveChannels() {
    const checks = document.querySelectorAll('.channel-check');
    const channels = Array.from(checks).filter(c=>c.checked).map(c=>c.value);
    try {
      await ATLAS.api.put('/api/pager/config', { channels: JSON.stringify(channels) });
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.loadConfig();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },
};

/* ============================================================
   Scheduler Page
============================================================ */
ATLAS.schedulerPage = {
  _items: [],

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;">🕐 ${t('scheduler')}</h2>
        <button class="btn btn-primary" onclick="ATLAS.schedulerPage.showCreateModal()">+ ${t('new_scheduled')}</button>
      </div>
      <div id="scheduler-list"><div style="text-align:center;padding:40px;color:var(--text-muted);">${t('loading')}</div></div>`;
    await this.refresh();
  },

  async refresh() {
    try {
      const res = await ATLAS.api.get('/api/scheduled');
      this._items = res?.items || [];
    } catch(e) { this._items = []; }
    this.renderList();
  },

  renderList() {
    const el = document.getElementById('scheduler-list');
    if (!el) return;
    const t = k => ATLAS.i18n.t(k);
    if (this._items.length === 0) {
      el.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;">
      ${this._items.map(item => this._itemCard(item)).join('')}
    </div>`;
  },

  _itemCard(item) {
    const t = k => ATLAS.i18n.t(k);
    const sev = item.severity || 'info';
    const sevColor = sev==='critical'?'var(--danger)':sev==='warning'?'var(--warning)':'var(--accent)';
    const nextRun = item.next_run ? new Date(item.next_run).toLocaleString() : '—';
    const lastRun = item.last_run ? new Date(item.last_run).toLocaleString() : '—';
    return `<div class="card" style="padding:16px;border-left:3px solid ${sevColor};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-weight:600;">${item.title}</span>
            <span class="badge badge-${sev==='critical'?'danger':sev==='warning'?'warning':'info'}">${sev}</span>
            <span class="badge ${item.enabled?'badge-success':'badge-muted'}">${item.enabled?t('enabled'):t('disabled')}</span>
            <span class="badge badge-muted">${item.type==='alert'?'🔔 Alert':'⚠️ Incident'}</span>
          </div>
          ${item.description ? `<div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${item.description}</div>` : ''}
          <div style="font-size:11px;color:var(--text-muted);display:flex;gap:16px;flex-wrap:wrap;">
            <span>🔁 ${t('recurrence')}: <strong>${t(item.recurrence)||item.recurrence}</strong></span>
            <span>⏰ ${t('next_run')}: <strong>${nextRun}</strong></span>
            <span>✅ ${t('last_run')}: ${lastRun}</span>
            <span>📊 ${t('run_count')}: ${item.run_count||0}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px;">
          <button class="btn btn-secondary btn-sm" title="${t('run_now')}" onclick="ATLAS.schedulerPage.runNow(${item.id})">▶</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.schedulerPage.toggle(${item.id}, ${item.enabled?0:1})">${item.enabled?'⏸':'▶'}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.schedulerPage.showEditModal(${item.id})">✏</button>
          <button class="btn btn-danger btn-sm" onclick="ATLAS.schedulerPage.deleteItem(${item.id})">🗑</button>
        </div>
      </div>
    </div>`;
  },

  showCreateModal() {
    ATLAS.schedulerPage._showFormModal(null);
  },

  showEditModal(id) {
    const item = this._items.find(i => i.id === id);
    if (item) ATLAS.schedulerPage._showFormModal(item);
  },

  _showFormModal(item) {
    const t = k => ATLAS.i18n.t(k);
    const isEdit = !!item;
    const nextRun = item?.next_run ? item.next_run.slice(0,16) : new Date(Date.now()+60000).toISOString().slice(0,16);
    ATLAS.ui.modal('', `
      <div style="padding:20px;min-width:340px;max-width:520px;">
        <h3 style="margin:0 0 16px;">${isEdit ? t('edit') : t('new_scheduled')}</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label class="form-label">${t('type')}</label>
            <select id="sched-type" class="form-select">
              <option value="alert" ${(item?.type||'alert')==='alert'?'selected':''}>🔔 ${t('schedule_alert')}</option>
              <option value="incident" ${item?.type==='incident'?'selected':''}>⚠️ ${t('schedule_incident')}</option>
            </select>
          </div>
          <div>
            <label class="form-label">${t('title')}</label>
            <input type="text" id="sched-title" class="form-input" value="${item?.title||''}" placeholder="${t('title')}">
          </div>
          <div>
            <label class="form-label">${t('description')} (${t('details')})</label>
            <textarea id="sched-desc" class="form-input" rows="2">${item?.description||''}</textarea>
          </div>
          <div>
            <label class="form-label">${t('severity')}</label>
            <select id="sched-severity" class="form-select">
              <option value="critical" ${item?.severity==='critical'?'selected':''}>🔴 ${t('critical')}</option>
              <option value="warning" ${(item?.severity||'warning')==='warning'?'selected':''}>🟡 ${t('warning')}</option>
              <option value="info" ${item?.severity==='info'?'selected':''}>🔵 ${t('info')}</option>
            </select>
          </div>
          <div>
            <label class="form-label">${t('recurrence')}</label>
            <select id="sched-recurrence" class="form-select" onchange="ATLAS.schedulerPage._toggleIntervalField()">
              <option value="once" ${(item?.recurrence||'once')==='once'?'selected':''}>📅 ${t('once')}</option>
              <option value="daily" ${item?.recurrence==='daily'?'selected':''}>🔁 ${t('daily')}</option>
              <option value="weekly" ${item?.recurrence==='weekly'?'selected':''}>📆 ${t('weekly')}</option>
              <option value="hourly" ${item?.recurrence==='hourly'?'selected':''}>⏰ ${t('hourly')}</option>
              <option value="interval" ${item?.recurrence==='interval'?'selected':''}>⏱ ${t('interval')}</option>
            </select>
          </div>
          <div id="sched-interval-field" style="display:${item?.recurrence==='interval'?'block':'none'};">
            <label class="form-label">${t('interval_minutes')}</label>
            <input type="number" id="sched-interval" class="form-input" value="${(()=>{try{return JSON.parse(item?.recurrence_data||'{}').minutes||60;}catch{return 60;}})()}" min="1">
          </div>
          <div>
            <label class="form-label">${t('next_run')}</label>
            <input type="datetime-local" id="sched-next-run" class="form-input" value="${nextRun}">
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="sched-enabled" ${(item?.enabled??1)?'checked':''}>
            <label for="sched-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px;">
          <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
          <button class="btn btn-primary" onclick="ATLAS.schedulerPage.saveItem(${isEdit?item.id:0})">${t('save')}</button>
        </div>
      </div>`);
    this._toggleIntervalField();
  },

  _toggleIntervalField() {
    const rec = document.getElementById('sched-recurrence')?.value;
    const f = document.getElementById('sched-interval-field');
    if (f) f.style.display = rec === 'interval' ? 'block' : 'none';
  },

  async saveItem(id) {
    const type = document.getElementById('sched-type').value;
    const title = document.getElementById('sched-title').value.trim();
    const description = document.getElementById('sched-desc').value.trim();
    const severity = document.getElementById('sched-severity').value;
    const recurrence = document.getElementById('sched-recurrence').value;
    const next_run = document.getElementById('sched-next-run').value.replace('T',' ');
    const enabled = document.getElementById('sched-enabled').checked ? 1 : 0;
    const intervalMin = parseInt(document.getElementById('sched-interval')?.value||60);
    const recurrence_data = recurrence === 'interval' ? {minutes: intervalMin} : {};
    if (!title) return ATLAS.ui.toast(ATLAS.i18n.t('error') + ': title required', 'error');
    const body = { type, title, description, severity, recurrence, recurrence_data, next_run, enabled };
    try {
      const res = (id && id !== 0) ? await ATLAS.api.put(`/api/scheduled/${id}`, body)
                                   : await ATLAS.api.post('/api/scheduled', body);
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      ATLAS.ui.closeModal();
      await this.refresh();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async runNow(id) {
    try {
      await ATLAS.api.post(`/api/scheduled/${id}/run-now`, {});
      ATLAS.ui.toast('▶ ' + ATLAS.i18n.t('run_now') + ' OK', 'success');
      await this.refresh();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async toggle(id, enabled) {
    try {
      await ATLAS.api.put(`/api/scheduled/${id}`, { enabled });
      await this.refresh();
    } catch(e) {
      ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error');
    }
  },

  async deleteItem(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    try {
      await ATLAS.api.delete(`/api/scheduled/${id}`);
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.refresh();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },
};

/* ============================================================
   Weather Page
============================================================ */
ATLAS.weatherPage = {
  _wmoDesc: {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Showers',81:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm + hail',99:'Heavy thunderstorm'},
  _wmoIcon: {0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',51:'🌦',53:'🌧',55:'🌧',61:'🌧',63:'🌧',65:'🌧',71:'🌨',73:'❄️',75:'❄️',80:'🌦',81:'🌧',95:'⛈️',96:'⛈️',99:'⛈️'},

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>🌤 ${t('weather')}</h1>
        <div class="actions">
          <input id="weather-lat" class="form-input" style="width:100px;" placeholder="Lat" value="51.5">
          <input id="weather-lon" class="form-input" style="width:100px;" placeholder="Lon" value="9.0">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.weatherPage.load()">🔄 ${t('refresh')}</button>
        </div>
      </div>
      <div id="weather-content"><div style="text-align:center;padding:60px;color:var(--text-muted);">Loading weather data...</div></div>`;
    await this.load();
  },

  async load() {
    const lat = parseFloat(document.getElementById('weather-lat')?.value || 51.5);
    const lon = parseFloat(document.getElementById('weather-lon')?.value || 9.0);
    const el = document.getElementById('weather-content');
    if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">⏳ Loading...</div>';
    try {
      const data = await ATLAS.api.get(`/api/weather?lat=${lat}&lon=${lon}`);
      if (data?.error) { el.innerHTML = `<div class="card" style="color:var(--danger);">Error: ${data.error}</div>`; return; }
      this._render(el, data, lat, lon);
    } catch(e) {
      el.innerHTML = `<div class="card" style="color:var(--danger);">Failed to load weather: ${e.message}</div>`;
    }
  },

  _render(el, data, lat, lon) {
    const t = k => ATLAS.i18n.t(k);
    const cur = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};
    const wcode = cur.weathercode || 0;
    const icon = this._wmoIcon[wcode] || '🌡️';
    const desc = this._wmoDesc[wcode] || '';
    // Current conditions
    const curHtml = `<div class="card" style="padding:24px;">
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
        <div style="font-size:72px;line-height:1;">${icon}</div>
        <div>
          <div style="font-size:48px;font-weight:800;">${cur.temperature_2m?.toFixed(1) ?? '–'}°C</div>
          <div style="font-size:16px;color:var(--text-muted);">${desc}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">
            ${t('feels_like')}: ${cur.apparent_temperature?.toFixed(1) ?? '–'}°C &nbsp;|&nbsp;
            ${t('humidity')}: ${cur.relative_humidity_2m ?? '–'}% &nbsp;|&nbsp;
            ${t('wind')}: ${cur.wind_speed_10m?.toFixed(1) ?? '–'} km/h
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">📍 ${lat}, ${lon}</div>
        </div>
      </div>
    </div>`;
    // 7-day forecast
    const days = (daily.time || []).slice(0,7);
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    const precips = daily.precipitation_sum || [];
    const wcodes = daily.weathercode || [];
    const forecastHtml = `<div class="card">
      <div class="card-title">📅 7-Day ${t('weather_forecast')}</div>
      <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;">
        ${days.map((d,i) => {
          const dayName = new Date(d).toLocaleDateString(ATLAS.i18n.lang, {weekday:'short',month:'short',day:'numeric'});
          const ic = this._wmoIcon[wcodes[i]] || '🌡️';
          return `<div style="min-width:100px;text-align:center;padding:12px 8px;background:var(--bg-input);border-radius:var(--radius-sm);flex:1;">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">${dayName}</div>
            <div style="font-size:28px;">${ic}</div>
            <div style="font-weight:700;">${(maxTemps[i]||0).toFixed(0)}°</div>
            <div style="color:var(--text-muted);font-size:12px;">${(minTemps[i]||0).toFixed(0)}°</div>
            <div style="font-size:11px;color:var(--info);margin-top:2px;">💧 ${(precips[i]||0).toFixed(1)}mm</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
    el.innerHTML = curHtml + forecastHtml;
  },
};

/* ============================================================
   Calendar Page
============================================================ */
ATLAS.calendarPage = {
  _events: [],
  _view: 'month',
  _current: new Date(),

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>📅 ${t('calendar')}</h1>
        <div class="actions">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.calendarPage.showCreate()">+ ${t('new_event')}</button>
        </div>
      </div>
      <div class="grid-2">
        <div>
          <div class="card" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.calendarPage.prevMonth()">‹</button>
              <div id="cal-month-label" style="font-weight:700;font-size:16px;"></div>
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.calendarPage.nextMonth()">›</button>
            </div>
            <div id="cal-grid"></div>
          </div>
        </div>
        <div>
          <div id="cal-events-panel">
            <div class="card"><div style="text-align:center;padding:30px;color:var(--text-muted);">Click a day to see events</div></div>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="card-title">📋 All Events / Requests</div>
        <div id="cal-list"></div>
      </div>`;
    await this.load();
  },

  async load() {
    this._events = await ATLAS.api.get('/api/calendar') || [];
    this.renderCalendar();
    this.renderList();
  },

  renderCalendar() {
    const label = document.getElementById('cal-month-label');
    const grid = document.getElementById('cal-grid');
    if (!label || !grid) return;
    const y = this._current.getFullYear(), m = this._current.getMonth();
    label.textContent = this._current.toLocaleDateString(ATLAS.i18n.lang, {month:'long',year:'numeric'});
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m+1, 0).getDate();
    const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;">
      ${days.map(d=>`<div style="font-size:11px;color:var(--text-muted);padding:4px;font-weight:600;">${d}</div>`).join('')}`;
    for (let i=0;i<firstDay;i++) html += '<div></div>';
    for (let d=1;d<=daysInMonth;d++) {
      const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const evts = this._events.filter(e => e.start_date <= dateStr && e.end_date >= dateStr);
      const dots = evts.slice(0,3).map(e => {
        const color = e.type==='vacation'?'var(--info)':e.type==='duty'?'var(--success)':'var(--accent)';
        return `<span style="width:5px;height:5px;background:${color};border-radius:50%;display:inline-block;"></span>`;
      }).join('');
      const isToday = dateStr === new Date().toISOString().slice(0,10);
      html += `<div onclick="ATLAS.calendarPage.selectDay('${dateStr}')" style="padding:4px 2px;border-radius:4px;cursor:pointer;${isToday?'background:var(--accent);color:white;font-weight:700;':''}" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background='${isToday?'var(--accent)':'transparent'}'">
        <div style="font-size:13px;">${d}</div>
        <div style="display:flex;justify-content:center;gap:2px;min-height:6px;">${dots}</div>
      </div>`;
    }
    html += '</div>';
    grid.innerHTML = html;
  },

  selectDay(dateStr) {
    const evts = this._events.filter(e => e.start_date <= dateStr && e.end_date >= dateStr);
    const panel = document.getElementById('cal-events-panel');
    if (!panel) return;
    const t = k => ATLAS.i18n.t(k);
    if (evts.length === 0) {
      panel.innerHTML = `<div class="card"><div style="text-align:center;padding:20px;color:var(--text-muted);">${t('no_data')}</div></div>`;
    } else {
      panel.innerHTML = `<div class="card"><div class="card-title">${new Date(dateStr).toLocaleDateString(ATLAS.i18n.lang)}</div><div style="display:flex;flex-direction:column;gap:8px;">
        ${evts.map(e => this._eventRow(e)).join('')}
      </div></div>`;
    }
  },

  renderList() {
    const el = document.getElementById('cal-list');
    if (!el) return;
    const t = k => ATLAS.i18n.t(k);
    if (this._events.length === 0) {
      el.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;">
      ${this._events.map(e => this._eventRow(e)).join('')}
    </div>`;
  },

  _eventRow(e) {
    const t = k => ATLAS.i18n.t(k);
    const typeColor = e.type==='vacation'?'var(--info)':e.type==='duty'?'var(--success)':'var(--accent)';
    const statusColor = e.status==='approved'?'var(--success)':e.status==='rejected'?'var(--danger)':'var(--warning)';
    const canManage = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'operator';
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);border-left:3px solid ${typeColor};background:var(--bg-input);">
      <div style="flex:1;">
        <div style="font-weight:600;font-size:14px;">${e.title}</div>
        <div style="font-size:12px;color:var(--text-muted);">
          ${e.user_name||'–'} &nbsp;|&nbsp; ${e.start_date}${e.end_date&&e.end_date!==e.start_date?' → '+e.end_date:''} &nbsp;|&nbsp;
          <span style="color:${typeColor};">${t(e.type)||e.type}</span>
        </div>
      </div>
      <span class="badge" style="background:${statusColor};color:white;">${t(e.status)||e.status}</span>
      ${canManage && e.status==='pending' ? `
        <button class="btn btn-success btn-sm" onclick="ATLAS.calendarPage.approve(${e.id})">✓</button>
        <button class="btn btn-danger btn-sm" onclick="ATLAS.calendarPage.reject(${e.id})">✗</button>` : ''}
      <button class="btn btn-secondary btn-sm" onclick="ATLAS.calendarPage.deleteEvent(${e.id})">🗑</button>
    </div>`;
  },

  prevMonth() { this._current = new Date(this._current.getFullYear(), this._current.getMonth()-1, 1); this.renderCalendar(); },
  nextMonth() { this._current = new Date(this._current.getFullYear(), this._current.getMonth()+1, 1); this.renderCalendar(); },

  showCreate() {
    const t = k => ATLAS.i18n.t(k);
    const today = new Date().toISOString().slice(0,10);
    ATLAS.ui.modal(`📅 ${t('new_event')}`, `
      <div class="form-group"><label class="form-label">${t('title')}</label><input id="cal-title" class="form-input" placeholder="${t('title')}"></div>
      <div class="form-group"><label class="form-label">${t('type')}</label>
        <select id="cal-type" class="form-select">
          <option value="event">${t('event')}</option>
          <option value="vacation">${t('vacation')}</option>
          <option value="duty">${t('duty')}</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Start ${t('date')}</label><input id="cal-start" class="form-input" type="date" value="${today}"></div>
        <div class="form-group"><label class="form-label">End ${t('date')}</label><input id="cal-end" class="form-input" type="date" value="${today}"></div>
      </div>
      <div class="form-group"><label class="form-label">${t('description')}</label><input id="cal-desc" class="form-input" placeholder="${t('description')}"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.calendarPage.save()">+ ${t('save')}</button>`
    );
  },

  async save() {
    const title = document.getElementById('cal-title').value.trim();
    const type = document.getElementById('cal-type').value;
    const start_date = document.getElementById('cal-start').value;
    const end_date = document.getElementById('cal-end').value;
    const description = document.getElementById('cal-desc').value.trim();
    if (!title || !start_date) return ATLAS.ui.toast('Title and start date required', 'warning');
    try {
      await ATLAS.api.post('/api/calendar', { title, type, start_date, end_date, description });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },

  async approve(id) {
    try {
      await ATLAS.api.put(`/api/calendar/${id}`, { status: 'approved' });
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async reject(id) {
    try {
      await ATLAS.api.put(`/api/calendar/${id}`, { status: 'rejected' });
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async deleteEvent(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    try {
      await ATLAS.api.delete(`/api/calendar/${id}`);
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },
};

/* ============================================================
   Travel Requests Page
============================================================ */
ATLAS.travelPage = {
  _items: [],
  _vehicles: [],

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>✈️ ${t('travel')}</h1>
        <div class="actions">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.travelPage.showCreate()">+ ${t('new_travel')}</button>
        </div>
      </div>
      <div id="travel-list"><div style="text-align:center;padding:40px;color:var(--text-muted);">Loading...</div></div>`;
    await this.load();
  },

  async load() {
    [this._items, this._vehicles] = await Promise.all([
      ATLAS.api.get('/api/travel').catch(()=>[]),
      ATLAS.api.get('/api/fleet/vehicles').catch(()=>[]),
    ]);
    this.renderList();
  },

  renderList() {
    const el = document.getElementById('travel-list');
    if (!el) return;
    const t = k => ATLAS.i18n.t(k);
    if (this._items.length === 0) {
      el.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      ${this._items.map(r => this._row(r)).join('')}
    </div>`;
  },

  _row(r) {
    const t = k => ATLAS.i18n.t(k);
    const me = ATLAS.state.user;
    const isManager = me?.role === 'admin' || me?.role === 'operator';
    const isMine = r.requester_id === me?.id;
    const statusColor = r.status==='approved'?'var(--success)':r.status==='rejected'?'var(--danger)':r.status==='pending'?'var(--warning)':'var(--info)';
    const ttype = { car:'🚗 Car', aircraft:'✈️ Aircraft', jet:'🛩 Jet', ship:'🚢 Ship', motorcycle:'🏍️ Motorcycle' };
    return `<div class="card" style="padding:14px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${r.title}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">
            📍 ${r.destination} &nbsp;|&nbsp; 📅 ${r.start_date} → ${r.end_date} &nbsp;|&nbsp;
            ${ttype[r.travel_type]||r.travel_type} &nbsp;|&nbsp;
            ${r.requester_name||'–'}
          </div>
          ${r.vehicle_name?`<div style="font-size:12px;color:var(--text-muted);">🚗 ${r.vehicle_name}</div>`:''}
          ${r.reviewer_notes?`<div style="font-size:12px;color:var(--text-muted);margin-top:4px;font-style:italic;">Note: ${r.reviewer_notes}</div>`:''}
          ${r.notes?`<div style="font-size:12px;color:var(--text-muted);">${r.notes}</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <span class="badge" style="background:${statusColor};color:white;">${t(r.status)||r.status}</span>
          ${isManager && r.status==='pending'?`
            <button class="btn btn-success btn-sm" onclick="ATLAS.travelPage.approve(${r.id})">✓ ${t('approve')}</button>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.travelPage.showCounterOffer(${r.id})">💬 Counter</button>
            <button class="btn btn-danger btn-sm" onclick="ATLAS.travelPage.reject(${r.id})">✗ ${t('reject')}</button>` : ''}
          ${isMine && r.status==='pending'?`<button class="btn btn-danger btn-sm" onclick="ATLAS.travelPage.delete(${r.id})">🗑</button>`:''}
          ${isMine && r.status==='rejected'?`<button class="btn btn-danger btn-sm" onclick="ATLAS.travelPage.rejectCounterOffer(${r.id})">🗑 ${t('reject_counteroffer')}</button>`:''}
        </div>
      </div>
    </div>`;
  },

  showCreate() {
    const t = k => ATLAS.i18n.t(k);
    const today = new Date().toISOString().slice(0,10);
    const vOpts = this._vehicles.map(v => `<option value="${v.id}">${ATLAS.ui.esc(v.name)} (${v.license_plate||'–'})</option>`).join('');
    ATLAS.ui.modal(`✈️ ${t('new_travel')}`, `
      <div class="form-group"><label class="form-label">${t('title')}</label><input id="tr-title" class="form-input" placeholder="${t('title')}"></div>
      <div class="form-group"><label class="form-label">${t('destination')}</label><input id="tr-dest" class="form-input" placeholder="City, address…"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${t('departure')}</label><input id="tr-start" class="form-input" type="date" value="${today}"></div>
        <div class="form-group"><label class="form-label">${t('arrival')}</label><input id="tr-end" class="form-input" type="date" value="${today}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${t('travel_type')}</label>
          <select id="tr-type" class="form-select">
            <option value="car">🚗 Car</option>
            <option value="aircraft">✈️ Aircraft</option>
            <option value="jet">🛩 Jet</option>
            <option value="ship">🚢 Ship</option>
            <option value="motorcycle">🏍️ Motorcycle</option>
            <option value="bus">🚌 Bus</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">${t('vehicle')} (optional)</label>
          <select id="tr-vehicle" class="form-select">
            <option value="">– None –</option>
            ${vOpts}
          </select>
        </div>
      </div>
      <div style="display:flex;gap:16px;margin:8px 0;">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" id="tr-solo" checked> ${t('solo')}</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" id="tr-crew"> ${t('with_crew')}</label>
      </div>
      <div class="form-group"><label class="form-label">${t('description')}</label><textarea id="tr-notes" class="form-textarea" rows="2" placeholder="Notes…"></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.travelPage.save()">+ ${t('save')}</button>`,
      'modal-lg'
    );
  },

  async save() {
    const title = document.getElementById('tr-title').value.trim();
    const destination = document.getElementById('tr-dest').value.trim();
    if (!title || !destination) return ATLAS.ui.toast('Title and destination required', 'warning');
    const vid = document.getElementById('tr-vehicle').value;
    try {
      await ATLAS.api.post('/api/travel', {
        title, destination,
        start_date: document.getElementById('tr-start').value,
        end_date: document.getElementById('tr-end').value,
        travel_type: document.getElementById('tr-type').value,
        vehicle_id: vid ? parseInt(vid, 10) : null,
        solo: document.getElementById('tr-solo').checked,
        with_crew: document.getElementById('tr-crew').checked,
        notes: document.getElementById('tr-notes').value.trim(),
      });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },

  async approve(id) {
    try {
      await ATLAS.api.put(`/api/travel/${id}`, { status: 'approved' });
      ATLAS.ui.toast('Travel request approved', 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async reject(id) {
    try {
      await ATLAS.api.put(`/api/travel/${id}`, { status: 'rejected' });
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  showCounterOffer(id) {
    const t = k => ATLAS.i18n.t(k);
    ATLAS.ui.modal('💬 Counter Offer', `
      <div class="form-group"><label class="form-label">${t('reviewer_notes')}</label>
        <textarea id="tr-counter-note" class="form-textarea" rows="3" placeholder="Suggest alternative dates or conditions…"></textarea>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.travelPage.sendCounterOffer(${id})">${t('send')}</button>`
    );
  },

  async sendCounterOffer(id) {
    const note = document.getElementById('tr-counter-note').value.trim();
    try {
      await ATLAS.api.put(`/api/travel/${id}`, { status: 'rejected', reviewer_notes: note });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Counter offer sent', 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async rejectCounterOffer(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    try {
      await ATLAS.api.put(`/api/travel/${id}`, { action: 'reject_counteroffer' });
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async delete(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    try {
      await ATLAS.api.delete(`/api/travel/${id}`);
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },
};

/* ============================================================
   Contacts Page
============================================================ */
ATLAS.contactsPage = {
  _contacts: [],
  _q: '',

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 style="margin:0;">📒 ${t('contacts')}</h2>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input id="contact-search" class="form-input" style="width:220px;" placeholder="${t('search_contacts')}" oninput="ATLAS.contactsPage._onSearch(this.value)">
          <button class="btn btn-primary" onclick="ATLAS.contactsPage.showCreate()">+ ${t('new_contact')}</button>
        </div>
      </div>
      <div id="contacts-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;">
        <div style="text-align:center;padding:40px;color:var(--text-muted);">${t('loading')}</div>
      </div>`;
    await this.load();
  },

  async load(q) {
    const qs = q !== undefined ? q : this._q;
    this._q = qs;
    try {
      const data = await ATLAS.api.get(`/api/contacts${qs ? '?q=' + encodeURIComponent(qs) : ''}`);
      this._contacts = data || [];
      this._render();
    } catch(e) {
      document.getElementById('contacts-list').innerHTML = `<div style="color:var(--danger);padding:20px;">${e.message}</div>`;
    }
  },

  _onSearch(v) {
    clearTimeout(this._st);
    this._st = setTimeout(() => this.load(v), 250);
  },

  _catIcon(cat) {
    return {staff:'👤',emergency:'🚒',supplier:'🏭',authority:'🏛',other:'📌'}[cat] || '📌';
  },

  _render() {
    const t = k => ATLAS.i18n.t(k);
    const el = document.getElementById('contacts-list');
    if (!el) return;
    if (!this._contacts.length) {
      el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">No contacts found</div>`;
      return;
    }
    el.innerHTML = this._contacts.map(c => `
      <div class="card" style="padding:16px;cursor:pointer;transition:border-color 0.15s;" onclick="ATLAS.contactsPage.showDetail(${c.id})">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:44px;height:44px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
            ${this._catIcon(c.category)}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <strong style="color:var(--text);font-size:15px;">${c.full_name}</strong>
              ${c.is_favorite ? '<span style="color:#f59e0b;">★</span>' : ''}
              ${c.call_sign ? `<span class="badge badge-info" style="font-size:10px;">${c.call_sign}</span>` : ''}
            </div>
            ${c.role_label ? `<div style="font-size:12px;color:var(--accent);">${c.role_label}</div>` : ''}
            ${c.organization ? `<div style="font-size:12px;color:var(--text-muted);">🏢 ${c.organization}${c.department ? ' · ' + c.department : ''}</div>` : ''}
            <div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap;">
              ${c.phone ? `<a href="tel:${c.phone}" onclick="event.stopPropagation()" style="font-size:12px;color:var(--accent);text-decoration:none;">📞 ${c.phone}</a>` : ''}
              ${c.email ? `<a href="mailto:${c.email}" onclick="event.stopPropagation()" style="font-size:12px;color:var(--accent);text-decoration:none;">✉️ ${c.email}</a>` : ''}
            </div>
          </div>
        </div>
      </div>`).join('');
  },

  showCreate() {
    this._showForm(null);
  },

  showDetail(id) {
    const c = this._contacts.find(x => x.id === id);
    if (!c) return;
    const t = k => ATLAS.i18n.t(k);
    ATLAS.ui.modal(`${this._catIcon(c.category)} ${c.full_name}`, `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">
        ${c.call_sign ? `<div><span style="color:var(--text-muted);">${t('call_sign')}:</span><br><strong>${c.call_sign}</strong></div>` : ''}
        ${c.role_label ? `<div><span style="color:var(--text-muted);">${t('role_label')}:</span><br><strong>${c.role_label}</strong></div>` : ''}
        ${c.organization ? `<div><span style="color:var(--text-muted);">${t('organization')}:</span><br><strong>${c.organization}</strong></div>` : ''}
        ${c.department ? `<div><span style="color:var(--text-muted);">${t('department')}:</span><br><strong>${c.department}</strong></div>` : ''}
        ${c.phone ? `<div><span style="color:var(--text-muted);">📞 ${t('phone') || 'Phone'}:</span><br><a href="tel:${c.phone}" style="color:var(--accent);">${c.phone}</a></div>` : ''}
        ${c.email ? `<div><span style="color:var(--text-muted);">✉️ Email:</span><br><a href="mailto:${c.email}" style="color:var(--accent);">${c.email}</a></div>` : ''}
      </div>
      ${c.notes ? `<div style="margin-top:12px;padding:10px;background:var(--bg3);border-radius:8px;font-size:13px;color:var(--text-muted);">${c.notes}</div>` : ''}`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal();ATLAS.contactsPage._showForm(${c.id})">✏ ${t('edit')}</button>
       <button class="btn btn-danger" onclick="ATLAS.contactsPage.deleteContact(${c.id})">🗑 ${t('delete')}</button>
       <button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">${t('close')}</button>`
    );
  },

  _showForm(id) {
    const t = k => ATLAS.i18n.t(k);
    const c = id ? this._contacts.find(x => x.id === id) : null;
    const cats = ['staff','emergency','supplier','authority','other'];
    ATLAS.ui.modal(id ? `✏ ${t('edit')} ${c?.full_name||''}` : `+ ${t('new_contact')}`, `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="grid-column:1/-1;">
          <label class="form-label">${t('name')} *</label>
          <input id="c-name" class="form-input" value="${c?.full_name||''}">
        </div>
        <div>
          <label class="form-label">${t('call_sign')}</label>
          <input id="c-call" class="form-input" value="${c?.call_sign||''}">
        </div>
        <div>
          <label class="form-label">${t('role_label')}</label>
          <input id="c-role" class="form-input" value="${c?.role_label||''}">
        </div>
        <div>
          <label class="form-label">${t('phone') || 'Phone'}</label>
          <input id="c-phone" class="form-input" type="tel" value="${c?.phone||''}">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input id="c-email" class="form-input" type="email" value="${c?.email||''}">
        </div>
        <div>
          <label class="form-label">${t('organization')}</label>
          <input id="c-org" class="form-input" value="${c?.organization||''}">
        </div>
        <div>
          <label class="form-label">${t('department')}</label>
          <input id="c-dept" class="form-input" value="${c?.department||''}">
        </div>
        <div>
          <label class="form-label">${t('category')}</label>
          <select id="c-cat" class="form-select">
            ${cats.map(cat => `<option value="${cat}" ${(c?.category||'other')===cat?'selected':''}>${this._catIcon(cat)} ${t('cat_'+cat)}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="c-fav" ${c?.is_favorite?'checked':''}>
          <label for="c-fav">★ ${t('favorite')}</label>
        </div>
        <div style="grid-column:1/-1;">
          <label class="form-label">${t('notes')}</label>
          <textarea id="c-notes" class="form-input" rows="3">${c?.notes||''}</textarea>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.contactsPage.save(${id||0})">${t('save')}</button>`
    );
  },

  async save(id) {
    const body = {
      full_name: document.getElementById('c-name').value.trim(),
      call_sign: document.getElementById('c-call').value.trim(),
      role_label: document.getElementById('c-role').value.trim(),
      phone: document.getElementById('c-phone').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      organization: document.getElementById('c-org').value.trim(),
      department: document.getElementById('c-dept').value.trim(),
      category: document.getElementById('c-cat').value,
      notes: document.getElementById('c-notes').value.trim(),
      is_favorite: document.getElementById('c-fav').checked,
    };
    if (!body.full_name) return ATLAS.ui.toast('Name required', 'warning');
    try {
      if (id) await ATLAS.api.put(`/api/contacts/${id}`, body);
      else await ATLAS.api.post('/api/contacts', body);
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      ATLAS.ui.closeModal();
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async deleteContact(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    try {
      await ATLAS.api.delete(`/api/contacts/${id}`);
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      ATLAS.ui.closeModal();
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },
};

/* ============================================================
   Roles & Permissions Page
============================================================ */
ATLAS.rolesPage = {
  _roles: [],
  _allPerms: [],

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;">🛡 ${t('roles')}</h2>
        <button class="btn btn-primary" onclick="ATLAS.rolesPage.showCreate()">+ ${t('new_role')}</button>
      </div>
      <div id="roles-list"><div style="text-align:center;padding:40px;color:var(--text-muted);">${t('loading')}</div></div>`;
    await this.load();
  },

  async load() {
    try {
      const data = await ATLAS.api.get('/api/roles');
      this._roles = data.roles || [];
      this._allPerms = data.all_permissions || [];
      this._render();
    } catch(e) {
      document.getElementById('roles-list').innerHTML = `<div style="color:var(--danger);padding:20px;">${e.message}</div>`;
    }
  },

  _permIcon(key) {
    return {read:'👁',create:'✏️',edit:'🔧',delete:'🗑',fleet:'🚗',pager:'📟',analytics:'🧠',admin:'⭐'}[key] || '•';
  },

  _render() {
    const t = k => ATLAS.i18n.t(k);
    const el = document.getElementById('roles-list');
    if (!el) return;
    el.innerHTML = this._roles.map(r => `
      <div class="card" style="padding:16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <strong style="font-size:16px;">${r.label || r.name}</strong>
              <span class="badge ${r.builtin ? 'badge-info' : 'badge-success'}">${r.builtin ? t('builtin') : t('custom')}</span>
            </div>
            ${r.description ? `<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${r.description}</div>` : ''}
          </div>
          ${!r.builtin ? `
            <div style="display:flex;gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.rolesPage.showEdit(${r.id})">✏ ${t('edit')}</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.rolesPage.deleteRole(${r.id})">🗑</button>
            </div>
          ` : `<span style="font-size:11px;color:var(--text-dim);">Cannot be modified</span>`}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;">
          ${this._allPerms.map(p => {
            const has = r.permissions[p.key];
            return `<span style="display:flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:12px;
                    background:${has ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)'};
                    border:1px solid ${has ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'};
                    color:${has ? 'var(--success)' : 'var(--text-dim)'};">
              ${this._permIcon(p.key)} ${p.label}
            </span>`;
          }).join('')}
        </div>
      </div>`).join('');
  },

  showCreate() {
    this._showForm(null);
  },

  showEdit(id) {
    const r = this._roles.find(x => x.id === id);
    if (!r) return;
    this._showForm(r);
  },

  _showForm(role) {
    const t = k => ATLAS.i18n.t(k);
    const isEdit = !!role;
    ATLAS.ui.modal(isEdit ? `✏ ${role.label}` : `+ ${t('new_role')}`, `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <label class="form-label">${t('name')} *</label>
          <input id="role-name" class="form-input" value="${role?.name||''}" placeholder="e.g. dispatcher" ${isEdit?'readonly':''}>
        </div>
        <div>
          <label class="form-label">${t('role_description')}</label>
          <input id="role-desc" class="form-input" value="${role?.description||''}" placeholder="Optional description">
        </div>
        <div>
          <label class="form-label">${t('permissions')}</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
            ${this._allPerms.map(p => `
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px;background:var(--bg3);border-radius:8px;">
                <input type="checkbox" class="perm-check" data-key="${p.key}" ${(role?.permissions?.[p.key])?'checked':''}>
                <span style="font-size:13px;">${this._permIcon(p.key)} ${p.label}</span>
              </label>`).join('')}
          </div>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.rolesPage.save(${role?.id||0})">${t('save')}</button>`
    );
  },

  async save(id) {
    const name = document.getElementById('role-name').value.trim();
    if (!name) return ATLAS.ui.toast('Name required', 'warning');
    const perms = {};
    document.querySelectorAll('.perm-check').forEach(cb => { perms[cb.dataset.key] = cb.checked ? 1 : 0; });
    const body = {
      name,
      description: document.getElementById('role-desc').value.trim(),
      permissions: perms,
    };
    try {
      if (id) await ATLAS.api.put(`/api/roles/${id}`, body);
      else await ATLAS.api.post('/api/roles', body);
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      ATLAS.ui.closeModal();
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },

  async deleteRole(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '? Users with this role will be reset to operator.')) return;
    try {
      await ATLAS.api.delete(`/api/roles/${id}`);
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message || ATLAS.i18n.t('error'), 'warning'); }
  },
};

/* ============================================================
   Voice Channel (Push-to-Talk)
   Uses WebRTC + WebSocket signaling for real multi-party audio.
   Falls back gracefully if WebRTC is unavailable.
============================================================ */
ATLAS.voice = {
  _joined: false,
  _speaking: false,
  _stream: null,
  _peers: {},           // userId -> {pc: RTCPeerConnection, ...}
  _audioCtx: null,
  _status: { active: false, speaker_id: null, speaker_name: null, participants: [] },
  _barEl: null,
  _pttBtn: null,

  // Called once on init — creates the persistent voice bar in the UI
  initBar() {
    if (document.getElementById('voice-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'voice-bar';
    bar.style.cssText = `
      position:fixed;bottom:0;left:var(--sidebar-w,240px);right:0;z-index:9000;
      background:var(--bg2);border-top:1px solid var(--card-border);
      padding:8px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;
      transition:all 0.2s;
    `;
    bar.innerHTML = `
      <span style="font-size:13px;font-weight:600;color:var(--text-muted);">📻 ${ATLAS.i18n.t('voice_channel')}</span>
      <div id="voice-status-dot" style="width:8px;height:8px;border-radius:50%;background:var(--text-dim);flex-shrink:0;"></div>
      <span id="voice-status-label" style="font-size:12px;color:var(--text-dim);">${ATLAS.i18n.t('voice_idle')}</span>
      <div id="voice-participants" style="flex:1;font-size:12px;color:var(--text-muted);"></div>
      <button id="voice-join-btn" class="btn btn-secondary btn-sm" onclick="ATLAS.voice.joinChannel()"
        style="min-width:90px;">📻 Join</button>
      <button id="voice-ptt-btn" class="btn btn-primary btn-sm"
        style="display:none;min-width:120px;user-select:none;"
        onmousedown="ATLAS.voice.startPTT()" onmouseup="ATLAS.voice.stopPTT()"
        ontouchstart="event.preventDefault();ATLAS.voice.startPTT()"
        ontouchend="event.preventDefault();ATLAS.voice.stopPTT()">
        🎙 ${ATLAS.i18n.t('ptt_hold')}
      </button>
      <button id="voice-leave-btn" class="btn btn-danger btn-sm"
        style="display:none;" onclick="ATLAS.voice.leaveChannel()">
        ✖ ${ATLAS.i18n.t('voice_leave')}
      </button>
    `;
    document.body.appendChild(bar);
    this._barEl = bar;
    this._pttBtn = document.getElementById('voice-ptt-btn');
  },

  // Called when WS receives voice_status event
  onStatus(data) {
    this._status = data;
    this._updateBar();
  },

  // Called when WS receives voice_ptt_start / voice_ptt_stop
  onPTTStart(data) {
    const dot = document.getElementById('voice-status-dot');
    const lbl = document.getElementById('voice-status-label');
    if (dot) dot.style.background = 'var(--danger)';
    if (lbl) lbl.textContent = `🎙 ${data.username} ${ATLAS.i18n.t('voice_speaking')}`;
  },
  onPTTStop(data) {
    if (this._status.active) {
      const dot = document.getElementById('voice-status-dot');
      const lbl = document.getElementById('voice-status-label');
      if (dot) dot.style.background = 'var(--success)';
      if (lbl) lbl.textContent = ATLAS.i18n.t('voice_active');
    } else {
      this._updateBar();
    }
  },

  _updateBar() {
    const dot = document.getElementById('voice-status-dot');
    const lbl = document.getElementById('voice-status-label');
    const parts = document.getElementById('voice-participants');
    const joinBtn = document.getElementById('voice-join-btn');
    const pttBtn = document.getElementById('voice-ptt-btn');
    const leaveBtn = document.getElementById('voice-leave-btn');
    if (!dot) return;

    if (this._status.active) {
      dot.style.background = 'var(--success)';
      lbl.textContent = ATLAS.i18n.t('voice_active');
      if (parts) parts.textContent = this._status.participants?.length ?
        '👤 ' + this._status.participants.join(', ') : '';
    } else {
      dot.style.background = 'var(--text-dim)';
      lbl.textContent = ATLAS.i18n.t('voice_idle');
      if (parts) parts.textContent = '';
    }

    if (this._joined) {
      if (joinBtn) joinBtn.style.display = 'none';
      if (pttBtn) pttBtn.style.display = '';
      if (leaveBtn) leaveBtn.style.display = '';
    } else {
      if (joinBtn) joinBtn.style.display = '';
      if (pttBtn) pttBtn.style.display = 'none';
      if (leaveBtn) leaveBtn.style.display = 'none';
    }
  },

  async joinChannel() {
    if (this._joined) return;
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch(e) {
      ATLAS.ui.toast('🎙 Microphone access denied', 'warning');
      return;
    }
    this._joined = true;
    ATLAS.ws.socket?.send(JSON.stringify({ type: 'voice_join' }));
    ATLAS.ui.toast('📻 ' + ATLAS.i18n.t('voice_joining'), 'info');
    this._updateBar();
    // Connect with existing participants via WebRTC
    this._connectToPeers();
  },

  leaveChannel() {
    if (!this._joined) return;
    this._joined = false;
    this._speaking = false;
    // Close all peer connections
    Object.values(this._peers).forEach(p => { try { p.pc.close(); } catch{} });
    this._peers = {};
    // Stop mic stream
    if (this._stream) { this._stream.getTracks().forEach(t => t.stop()); this._stream = null; }
    ATLAS.ws.socket?.send(JSON.stringify({ type: 'voice_leave' }));
    this._status.active = false;
    this._updateBar();
  },

  startPTT() {
    if (!this._joined || this._speaking) return;
    this._speaking = true;
    const btn = document.getElementById('voice-ptt-btn');
    if (btn) btn.style.background = 'var(--danger)';
    // Unmute all peer senders
    if (this._stream) {
      this._stream.getAudioTracks().forEach(t => t.enabled = true);
    }
    ATLAS.ws.socket?.send(JSON.stringify({ type: 'voice_ptt_start' }));
  },

  stopPTT() {
    if (!this._speaking) return;
    this._speaking = false;
    const btn = document.getElementById('voice-ptt-btn');
    if (btn) btn.style.background = '';
    // Mute mic when not talking
    if (this._stream) {
      this._stream.getAudioTracks().forEach(t => t.enabled = false);
    }
    ATLAS.ws.socket?.send(JSON.stringify({ type: 'voice_ptt_stop' }));
  },

  // Initiate WebRTC peer connection to each known participant
  async _connectToPeers() {
    if (!this._stream) return;
    const participants = this._status.participants || [];
    // We'll rely on ice/offer/answer exchange to connect
    // Broadcast offer to all (simple mesh, works for small groups)
    const pc = this._createPeerConnection('broadcast');
    this._stream.getTracks().forEach(t => pc.addTrack(t, this._stream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ATLAS.ws.socket?.send(JSON.stringify({
      type: 'voice_offer',
      data: { sdp: offer.sdp, type: offer.type },
      target_id: null  // broadcast
    }));
  },

  _createPeerConnection(peerId) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    pc.onicecandidate = e => {
      if (e.candidate) {
        ATLAS.ws.socket?.send(JSON.stringify({
          type: 'voice_ice',
          data: e.candidate,
          target_id: peerId === 'broadcast' ? null : peerId,
        }));
      }
    };
    pc.ontrack = e => {
      // Play incoming audio
      const audio = new Audio();
      audio.srcObject = e.streams[0];
      audio.autoplay = true;
      document.body.appendChild(audio);
    };
    this._peers[peerId] = { pc };
    return pc;
  },

  // Handle incoming WebRTC signals from WS
  async onOffer(data) {
    if (!this._joined || !this._stream) return;
    const pc = this._createPeerConnection(data.from_id);
    this._stream.getTracks().forEach(t => pc.addTrack(t, this._stream));
    await pc.setRemoteDescription(data.data);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    ATLAS.ws.socket?.send(JSON.stringify({
      type: 'voice_answer',
      data: { sdp: answer.sdp, type: answer.type },
      target_id: data.from_id,
    }));
  },

  async onAnswer(data) {
    const p = this._peers['broadcast'] || this._peers[data.from_id];
    if (p) await p.pc.setRemoteDescription(data.data);
  },

  async onICE(data) {
    const p = this._peers['broadcast'] || this._peers[data.from_id];
    if (p && data.data) {
      try { await p.pc.addIceCandidate(new RTCIceCandidate(data.data)); } catch{}
    }
  },
};

/* ============================================================
   Setup Wizard – First-time browser setup
============================================================ */
ATLAS.setupWizard = {
  show() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.add('hidden');
    let el = document.getElementById('setup-wizard-screen');
    if (!el) {
      el = document.createElement('div');
      el.id = 'setup-wizard-screen';
      el.style.cssText = 'position:fixed;inset:0;background:var(--bg-base,#0d1117);display:flex;align-items:center;justify-content:center;z-index:9999;overflow-y:auto;padding:20px;';
      document.body.appendChild(el);
    }
    el.style.display = 'flex';
    el.innerHTML = `
      <div style="width:100%;max-width:560px;background:var(--bg-card,#161b22);border:1px solid var(--border,#30363d);border-radius:12px;padding:32px;">
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:36px;margin-bottom:8px;">🛡</div>
          <h1 style="font-size:22px;font-weight:700;margin:0 0 4px;">ControlCenterHQ</h1>
          <p style="color:var(--text-muted,#8b949e);font-size:13px;margin:0;">Ersteinrichtung – First-time Setup</p>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- Organisation -->
          <div class="card" style="padding:16px;">
            <div class="card-title" style="margin-bottom:12px;">🏢 Organisation</div>
            <div class="form-group"><label class="form-label">Organisation / Leitstelle *</label>
              <input id="sw-org" class="form-input" placeholder="z.B. Feuerwehr München" required></div>
            <div class="form-group"><label class="form-label">Einrichtungstyp</label>
              <select id="sw-type" class="form-select">
                <option value="operations">Operations Center</option>
                <option value="fire">Feuerwehr</option>
                <option value="police">Polizei</option>
                <option value="ems">Rettungsdienst</option>
                <option value="rescue">Katastrophenschutz</option>
                <option value="other">Sonstiges</option>
              </select></div>
          </div>

          <!-- Admin-Konto -->
          <div class="card" style="padding:16px;">
            <div class="card-title" style="margin-bottom:12px;">👤 Administrator-Konto</div>
            <div class="form-group"><label class="form-label">Vollständiger Name *</label>
              <input id="sw-adminname" class="form-input" placeholder="Max Mustermann" required></div>
            <div class="form-group"><label class="form-label">Benutzername *</label>
              <input id="sw-adminuser" class="form-input" placeholder="admin" required></div>
            <div class="form-group"><label class="form-label">Passwort * (min. 8 Zeichen)</label>
              <input id="sw-adminpw" class="form-input" type="password" autocomplete="new-password" placeholder="••••••••" required></div>
            <div class="form-group"><label class="form-label">Passwort bestätigen *</label>
              <input id="sw-adminpw2" class="form-input" type="password" autocomplete="new-password" placeholder="••••••••" required></div>
          </div>

          <!-- Server -->
          <div class="card" style="padding:16px;">
            <div class="card-title" style="margin-bottom:12px;">🖥 Server-Einstellungen</div>
            <div class="form-group"><label class="form-label">Port</label>
              <input id="sw-port" class="form-input" type="number" value="8000" min="1024" max="65535"></div>
          </div>

          <!-- Netzwerk & APIs -->
          <div class="card" style="padding:16px;">
            <div class="card-title" style="margin-bottom:12px;">🌐 Netzwerk & APIs</div>
            <div class="form-group">
              <label class="form-label">Overpass API URL</label>
              <input id="sw-overpass" class="form-input" value="https://overpass-api.de/api/interpreter" placeholder="https://overpass-api.de/api/interpreter">
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Für den Infrastruktur-Scanner (Hydranten, Zufahrten). Kann leer gelassen werden.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Tailscale Auth Key (optional)</label>
              <input id="sw-tskey" class="form-input" placeholder="tskey-auth-...">
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Für VPN-Zugang und automatische Leitstellen-Erkennung. Optional.</div>
            </div>
          </div>

          <div id="sw-error" class="hidden" style="padding:10px 14px;background:rgba(248,81,73,0.15);border:1px solid var(--danger,#f85149);border-radius:6px;font-size:13px;color:var(--danger,#f85149);"></div>

          <button id="sw-btn" class="btn btn-primary w-full" style="padding:12px;font-size:15px;" onclick="ATLAS.setupWizard.submit()">
            🚀 Einrichtung abschließen
          </button>
          <p style="text-align:center;font-size:11px;color:var(--text-muted);margin:0;">
            © Felix Greis 2026 – All rights reserved.
          </p>
        </div>
      </div>`;
  },

  async submit() {
    const org = document.getElementById('sw-org').value.trim();
    const type = document.getElementById('sw-type').value;
    const adminName = document.getElementById('sw-adminname').value.trim();
    const adminUser = document.getElementById('sw-adminuser').value.trim();
    const pw = document.getElementById('sw-adminpw').value;
    const pw2 = document.getElementById('sw-adminpw2').value;
    const port = parseInt(document.getElementById('sw-port').value) || 8000;
    const overpass = document.getElementById('sw-overpass').value.trim();
    const tskey = document.getElementById('sw-tskey').value.trim();
    const errEl = document.getElementById('sw-error');
    const btn = document.getElementById('sw-btn');

    errEl.classList.add('hidden');
    if (!org || !adminName || !adminUser || !pw) {
      errEl.textContent = 'Bitte alle Pflichtfelder (*) ausfüllen.';
      errEl.classList.remove('hidden'); return;
    }
    if (pw.length < 8) {
      errEl.textContent = 'Passwort muss mindestens 8 Zeichen lang sein.';
      errEl.classList.remove('hidden'); return;
    }
    if (!/[A-Z]/.test(pw)) {
      errEl.textContent = 'Passwort muss mindestens einen Großbuchstaben enthalten (z.B. A–Z).';
      errEl.classList.remove('hidden'); return;
    }
    if (!/[0-9]/.test(pw)) {
      errEl.textContent = 'Passwort muss mindestens eine Zahl enthalten (0–9).';
      errEl.classList.remove('hidden'); return;
    }
    if (!/[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~"\\]/.test(pw)) {
      errEl.textContent = 'Passwort muss mindestens ein Sonderzeichen enthalten (z.B. !@#$%).';
      errEl.classList.remove('hidden'); return;
    }
    if (pw !== pw2) {
      errEl.textContent = 'Passwörter stimmen nicht überein.';
      errEl.classList.remove('hidden'); return;
    }
    btn.disabled = true;
    btn.textContent = '⏳ Wird eingerichtet…';
    try {
      const res = await fetch('/api/setup/complete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          org_name: org, facility_type: type, admin_name: adminName,
          admin_username: adminUser, admin_password: pw, port,
          overpass_url: overpass, tailscale_key: tskey,
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Setup failed');
      }
      // Success – show login
      document.getElementById('setup-wizard-screen').style.display = 'none';
      ATLAS.auth.showLoginScreen();
      document.getElementById('login-user').value = adminUser;
      ATLAS.ui.toast('Einrichtung abgeschlossen! Bitte anmelden.', 'success');
    } catch(e) {
      errEl.textContent = e.message;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = '🚀 Einrichtung abschließen';
    }
  },
};

/* ============================================================
   Settings Page – Advanced Config (Tailscale, Overpass, Federation Key)
============================================================ */
ATLAS.settingsPage._origRender = ATLAS.settingsPage.render;
ATLAS.settingsPage.render = async function(el) {
  await ATLAS.settingsPage._origRender.call(ATLAS.settingsPage, el);
  // Inject advanced config card for admins
  if (ATLAS.state.user?.role !== 'admin' && ATLAS.state.user?.role !== 'owner') return;
  const cfg = await ATLAS.api.get('/api/config').catch(() => ({}));
  const adminCol = el.querySelector('.grid-2 > div:first-child');
  if (!adminCol) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-title">🌐 Netzwerk & APIs</div>
    <div class="form-group">
      <label class="form-label">Overpass API URL</label>
      <input id="adv-overpass" class="form-input" value="${cfg.overpass_url || 'https://overpass-api.de/api/interpreter'}">
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Infrastruktur-Scanner (Hydranten, Zufahrten etc.)</div>
    </div>
    <div class="form-group">
      <label class="form-label">Tailscale Auth Key</label>
      <input id="adv-tskey" class="form-input" type="password" placeholder="tskey-auth-… (leer lassen wenn unverändert)" value="${cfg.tailscale_key || ''}">
    </div>
    <div class="form-group">
      <label class="form-label">Verbund (Federation) API Key</label>
      <input id="adv-fedkey" class="form-input" value="${cfg.federation_api_key || ''}" placeholder="Sicherheitsschlüssel für eingehende Verbund-Anfragen">
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Andere Leitstellen brauchen diesen Key um eure Daten abzurufen.</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.saveAdvanced()">💾 Speichern</button>`;
  adminCol.appendChild(card);
  // Inject NINA widget
  const ninaEl = document.createElement('div');
  adminCol.appendChild(ninaEl);
  ATLAS.ninaWidget.render(ninaEl);
  // Inject Mobile App connect widget
  const mobileEl = document.createElement('div');
  adminCol.appendChild(mobileEl);
  ATLAS.mobileWidget.render(mobileEl);
};

ATLAS.settingsPage.saveAdvanced = async function() {
  const overpass = document.getElementById('adv-overpass')?.value.trim();
  const tskey = document.getElementById('adv-tskey')?.value.trim();
  const fedkey = document.getElementById('adv-fedkey')?.value.trim();
  const body = {};
  if (overpass) body.overpass_url = overpass;
  if (tskey) { body.tailscale_key = tskey; body.tailscale_enabled = true; }
  if (fedkey !== undefined && fedkey !== '') body.federation_api_key = fedkey;
  try {
    await ATLAS.api.put('/api/config/advanced', body);
    ATLAS.ui.toast('Netzwerk-Einstellungen gespeichert', 'success');
  } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'warning'); }
};

/* ============================================================
   Predictive Dispatch Page
============================================================ */
ATLAS.predictivePage = {
  _data: null,

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `<div class="page-header"><h1>🔮 ${t('predictive_dispatch')}</h1></div>
      <div id="pred-body"><div style="padding:40px;text-align:center;color:var(--text-muted);">${t('loading')}</div></div>`;
    try {
      this._data = await ATLAS.api.get('/api/analytics/predictive');
      this._renderContent(el);
    } catch(e) {
      document.getElementById('pred-body').innerHTML = `<div style="padding:40px;text-align:center;color:var(--danger);">Fehler: ${e.message}</div>`;
    }
  },

  _renderContent(el) {
    const d = this._data;
    const t = k => ATLAS.i18n.t(k);
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const maxHour = Math.max(...d.hour_distribution, 1);
    const maxDay = Math.max(...d.weekday_distribution, 1);

    const hourBars = d.hour_distribution.map((v, h) => {
      const pct = Math.round(v / maxHour * 100);
      const isPeak = d.peak_hours.includes(h);
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;">
        <div style="font-size:9px;color:${isPeak ? 'var(--danger)' : 'var(--text-muted)'};">${v}</div>
        <div style="width:100%;height:${Math.max(pct * 0.8, 2)}px;background:${isPeak ? 'var(--danger)' : 'var(--accent)'};border-radius:2px 2px 0 0;opacity:${isPeak ? 1 : 0.5};"></div>
        <div style="font-size:9px;color:var(--text-muted);">${h}</div>
      </div>`;
    }).join('');

    const dayBars = d.weekday_distribution.map((v, i) => {
      const pct = Math.round(v / maxDay * 100);
      const isPeak = d.peak_days.includes(dayNames[i]);
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;">
        <div style="font-size:10px;color:${isPeak ? 'var(--danger)' : 'var(--text-muted)'};">${v}</div>
        <div style="width:100%;height:${Math.max(pct * 0.6, 2)}px;background:${isPeak ? 'var(--danger)' : 'var(--accent)'};border-radius:2px 2px 0 0;opacity:${isPeak ? 1 : 0.5};"></div>
        <div style="font-size:11px;color:var(--text-muted);">${dayNames[i]}</div>
      </div>`;
    }).join('');

    document.getElementById('pred-body').innerHTML = `
      <div class="kpi-grid" style="margin-bottom:20px;">
        <div class="kpi-card"><div class="kpi-label">ANALYSIERTE EINSÄTZE</div><div class="kpi-value" style="color:var(--accent);">${d.total_incidents}</div></div>
        <div class="kpi-card"><div class="kpi-label">RISIKOSTUNDEN</div><div class="kpi-value" style="color:var(--danger);">${d.peak_hours.map(h => h + ':00').join(', ') || '—'}</div></div>
        <div class="kpi-card"><div class="kpi-label">RISIKOTAGE</div><div class="kpi-value" style="color:var(--warning);">${d.peak_days.join(', ') || '—'}</div></div>
        <div class="kpi-card"><div class="kpi-label">HEATMAP-ZONEN</div><div class="kpi-value" style="color:var(--accent);">${d.heatmap.length}</div></div>
      </div>
      <div class="grid-2" style="margin-bottom:20px;">
        <div class="card">
          <div class="card-title">⏰ Stunden-Verteilung (0–23 Uhr)</div>
          <div style="display:flex;align-items:flex-end;gap:2px;height:100px;padding:8px 0;">${hourBars}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:8px;">🔴 Spitzenstunden mit erhöhtem Einsatzaufkommen</div>
        </div>
        <div class="card">
          <div class="card-title">📅 Wochentag-Verteilung</div>
          <div style="display:flex;align-items:flex-end;gap:4px;height:100px;padding:8px 0;">${dayBars}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:8px;">🔴 Risikotage mit höchstem Einsatzaufkommen</div>
        </div>
      </div>
      <div class="card" style="margin-bottom:20px;">
        <div class="card-title">🗺 Einsatz-Heatmap</div>
        <div id="pred-heatmap-map" style="height:400px;border-radius:var(--radius-sm);"></div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:8px;">Größere/rötere Kreise = häufigere/schwerere Einsätze in diesem Bereich</div>
      </div>
      <div class="card">
        <div class="card-title">🚗 Ressourcen-Intelligenz – Fahrzeugvorschlag</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Gib eine Position und Einsatzart ein, um die optimalen verfügbaren Fahrzeuge zu erhalten.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <input id="ri-lat" class="form-input" placeholder="Breite (lat)" style="width:130px;" type="number" step="0.0001">
          <input id="ri-lng" class="form-input" placeholder="Länge (lng)" style="width:130px;" type="number" step="0.0001">
          <select id="ri-type" class="form-select" style="width:160px;">
            <option value="general">Allgemein</option>
            <option value="fire">Brand / Feuer</option>
            <option value="medical">Rettung / Medizin</option>
            <option value="hazmat">Gefahrstoff</option>
            <option value="rescue">Technische Hilfe</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.predictivePage.suggestVehicles()">🚗 Vorschlagen</button>
        </div>
        <div id="ri-results"></div>
      </div>`;

    // Render heatmap
    this._renderHeatmap(d.heatmap);
  },

  _renderHeatmap(heatmap) {
    const mapEl = document.getElementById('pred-heatmap-map');
    if (!mapEl || typeof L === 'undefined') return;
    if (this._map) { try { this._map.remove(); } catch {} this._map = null; }
    const center = heatmap.length > 0 ? [heatmap[0].lat, heatmap[0].lng] : [51.505, 10.09];
    this._map = L.map(mapEl).setView(center, heatmap.length > 0 ? 11 : 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© OSM'}).addTo(this._map);
    const maxW = Math.max(...heatmap.map(h => h.weight), 1);
    heatmap.forEach(h => {
      const r = 6 + (h.weight / maxW) * 18;
      const opacity = 0.3 + (h.weight / maxW) * 0.5;
      const color = h.weight / maxW > 0.7 ? '#f85149' : h.weight / maxW > 0.4 ? '#e3b341' : '#58a6ff';
      L.circleMarker([h.lat, h.lng], {radius: r, color, fillColor: color, fillOpacity: opacity, weight: 1})
        .bindPopup(`Einsatzdichte: ${h.weight} (gewichtet)`).addTo(this._map);
    });
  },

  async suggestVehicles() {
    const lat = parseFloat(document.getElementById('ri-lat').value) || 0;
    const lng = parseFloat(document.getElementById('ri-lng').value) || 0;
    const type = document.getElementById('ri-type').value;
    const el = document.getElementById('ri-results');
    el.innerHTML = '<div style="color:var(--text-muted);">Lade…</div>';
    try {
      const data = await ATLAS.api.get(`/api/fleet/suggest?lat=${lat}&lng=${lng}&incident_type=${type}`);
      if (!data.suggestions.length) {
        el.innerHTML = '<div style="color:var(--text-muted);">Keine verfügbaren Fahrzeuge gefunden.</div>';
        return;
      }
      el.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px;">
        ${data.suggestions.map((v, i) => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:${i === 0 ? 'var(--accent-dim)' : ''};">
            <div style="font-size:20px;">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🚗'}</div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">${ATLAS.ui.esc(v.name)} <span style="font-size:11px;color:var(--text-muted);">${v.license_plate || ''}</span></div>
              <div style="font-size:12px;color:var(--text-muted);">${v.driver ? `Fahrer: ${v.driver}` : 'Kein Fahrer'} · ${v.dist_km != null ? v.dist_km + ' km entfernt' : 'Position unbekannt'} · Tank: ${v.fuel_pct}%</div>
              ${v.features ? `<div style="font-size:11px;color:var(--text-muted);">${v.features}</div>` : ''}
            </div>
            <div style="text-align:right;">
              <div style="font-size:18px;font-weight:700;color:var(--accent);">${v.score}</div>
              <div style="font-size:10px;color:var(--text-muted);">Score</div>
            </div>
          </div>`).join('')}
      </div>`;
    } catch(e) {
      el.innerHTML = `<div style="color:var(--danger);">Fehler: ${e.message}</div>`;
    }
  },
};

/* ============================================================
   Infrastructure Scanner – injected into map page
============================================================ */
ATLAS.infraScanner = {
  _layer: null,
  _active: false,
  _map: null,
  _radius: 400,

  attach(mapInstance) {
    this._map = mapInstance;
    // Scan button
    const ctrl = L.control({position: 'topright'});
    ctrl.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar');
      div.innerHTML = `<a href="#" title="Infrastruktur-Scanner" style="font-size:16px;" id="infra-btn">🏗</a>`;
      div.onclick = (e) => { e.preventDefault(); ATLAS.infraScanner.toggle(); };
      return div;
    };
    ctrl.addTo(mapInstance);
    // Categories button
    const ctrl2 = L.control({position: 'topright'});
    ctrl2.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar');
      div.innerHTML = `<a href="#" title="Infra-Kategorien" style="font-size:14px;">📍</a>`;
      div.onclick = (e) => { e.preventDefault(); ATLAS.infraCategoryPanel.showPanel(); };
      return div;
    };
    ctrl2.addTo(mapInstance);
    mapInstance.on('click', e => {
      if (this._active) this.scan(e.latlng.lat, e.latlng.lng);
    });
  },

  toggle() {
    this._active = !this._active;
    const btn = document.getElementById('infra-btn');
    if (btn) btn.style.background = this._active ? '#58a6ff' : '';
    ATLAS.ui.toast(this._active ? '🏗 Infrastruktur-Scanner aktiv – Auf Karte klicken' : 'Scanner deaktiviert', 'info');
  },

  async scan(lat, lng) {
    ATLAS.ui.toast('Infrastruktur wird geladen…', 'info');
    try {
      // Use extended scan endpoint (custom categories + OSM)
      const data = await ATLAS.api.get(`/api/infrastructure/scan?lat=${lat}&lng=${lng}&radius=${this._radius}`);
      if (this._layer) { this._map.removeLayer(this._layer); this._layer = null; }
      this._layer = L.layerGroup();
      data.features.forEach(f => {
        const iconChar = f.icon || '📍';
        const borderColor = f.color || '#6366f1';
        const icon = L.divIcon({
          html: `<span style="font-size:20px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));">${iconChar}</span>`,
          className: '', iconSize: [26, 26]
        });
        const m = L.marker([f.lat, f.lng], {icon});
        const tagRows = Object.entries(f.tags||{}).map(([k, v]) => `<tr><td style="color:#888;padding-right:8px;">${k}</td><td>${v}</td></tr>`).join('');
        const sourceTag = f.source === 'custom' ? `<br><span style="font-size:10px;background:#6366f1;color:white;border-radius:8px;padding:1px 6px;">📍 ${f.cat_name||'Eigene Kategorie'}</span>` : '';
        m.bindPopup(`<b style="color:${borderColor};">${iconChar} ${f.label}</b>${sourceTag}${f.description?`<br><span style='color:#888;font-size:11px;'>${f.description}</span>`:''}<br><table style="font-size:11px;margin-top:4px;">${tagRows}</table>`);
        this._layer.addLayer(m);
      });
      this._layer.addTo(this._map);
      ATLAS.ui.toast(`${data.count} Objekte gefunden (inkl. ${data.custom_categories||0} eigene Kategorien)`, 'success');
    } catch(e) {
      // Fallback to original endpoint
      try {
        const data = await ATLAS.api.get(`/api/infrastructure?lat=${lat}&lng=${lng}&radius=${this._radius}`);
        if (this._layer) { this._map.removeLayer(this._layer); this._layer = null; }
        this._layer = L.layerGroup();
        data.features.forEach(f => {
          const iconMap = {hydrant:'🔴',fire_station:'🚒',assembly_point:'🟢',water_access:'💧',pipeline:'🟡',hazmat:'☢️',fire_access:'🚧',building:'🏢'};
          const icon = L.divIcon({html:`<span style="font-size:18px;">${iconMap[f.type]||'📍'}</span>`,className:'',iconSize:[24,24]});
          const m = L.marker([f.lat,f.lng],{icon});
          const tagRows = Object.entries(f.tags).map(([k,v])=>`<tr><td style="color:#888;padding-right:8px;">${k}</td><td>${v}</td></tr>`).join('');
          m.bindPopup(`<b>${f.icon} ${f.label}</b><br><table style="font-size:11px;margin-top:4px;">${tagRows}</table>`);
          this._layer.addLayer(m);
        });
        this._layer.addTo(this._map);
        ATLAS.ui.toast(`${data.count} Infrastruktur-Objekte gefunden`, 'success');
      } catch(e2) {
        ATLAS.ui.toast('Infrastruktur-Scan fehlgeschlagen: ' + e2.message, 'warning');
      }
    }
  },
};

/* ============================================================
   Incident Report Generator – button injected into incidents detail
============================================================ */
ATLAS.incidentReport = {
  async generate(incidentId) {
    ATLAS.ui.toast('Einsatzbericht wird erstellt…', 'info');
    try {
      const _rurl = new URL(`/api/incidents/${incidentId}/report/html`, location.origin);
      _rurl.searchParams.set('token', ATLAS.state.token);
      const win = window.open(_rurl.toString(), '_blank');
      if (!win) {
        // Fallback: show in modal
        const data = await ATLAS.api.get(`/api/incidents/${incidentId}/report`);
        this._showModal(data.report);
      }
    } catch(e) {
      ATLAS.ui.toast('Bericht fehlgeschlagen: ' + e.message, 'warning');
    }
  },

  _showModal(r) {
    const rows = (arr, cols) => arr.length ?
      arr.map(row => `<tr>${cols.map(c => `<td style="padding:4px 8px;border-bottom:1px solid var(--border);">${row[c] ?? '—'}</td>`).join('')}</tr>`).join('') :
      `<tr><td colspan="${cols.length}" style="padding:8px;color:var(--text-muted);">Keine Einträge</td></tr>`;

    ATLAS.ui.modal(`📋 Einsatzbericht #${r.incident_id}`, `
      <div style="font-size:13px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
          ${[['Titel', r.title],['Schwere', r.severity],['Status', r.status],['Eröffnet', r.timeline.opened],['Abgeschlossen', r.timeline.resolved],['Dauer', r.timeline.duration||'—'],['Erstellt von', r.personnel.created_by],['Zugeteilt an', r.personnel.assigned_to]].map(([k,v])=>`<div><span style="color:var(--text-muted);font-size:11px;">${k}</span><div style="font-weight:600;">${v||'—'}</div></div>`).join('')}
        </div>
        <b>Beschreibung:</b><p style="color:var(--text-muted);">${r.description || '—'}</p>
        <b>Alarme:</b>
        <table style="width:100%;font-size:12px;margin:8px 0;"><tr style="background:var(--bg-input);"><th style="padding:4px 8px;text-align:left;">Zeit</th><th style="padding:4px 8px;text-align:left;">Meldung</th><th style="padding:4px 8px;">Schwere</th></tr>${rows(r.related_alerts, ['time','message','severity'])}</table>
        <b>Fahrzeuge:</b>
        <table style="width:100%;font-size:12px;margin:8px 0;"><tr style="background:var(--bg-input);"><th style="padding:4px 8px;text-align:left;">Fahrzeug</th><th style="padding:4px 8px;text-align:left;">Fahrer</th><th style="padding:4px 8px;text-align:left;">Abfahrt</th><th style="padding:4px 8px;">Distanz</th></tr>${rows(r.deployed_vehicles, ['vehicle','driver','departure','distance_km'])}</table>
        <b>Chronologie:</b>
        <table style="width:100%;font-size:12px;margin:8px 0;"><tr style="background:var(--bg-input);"><th style="padding:4px 8px;text-align:left;">Zeit</th><th style="padding:4px 8px;text-align:left;">Benutzer</th><th style="padding:4px 8px;text-align:left;">Aktion</th></tr>${rows(r.chronology, ['time','user','action'])}</table>
        <div style="margin-top:12px;display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.incidentReport.generate(${r.incident_id})">🖨 Drucken / PDF</button>
        </div>
      </div>`, 'large');
  },
};

/* ============================================================
   Federation / Multi-Leitstellen-Netzwerk Page
============================================================ */
ATLAS.federationPage = {
  _peers: [],
  _snapshot: null,

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">
        <h1>🌐 ${t('federation')}</h1>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.federationPage.autoDiscover()">📡 ${t('auto_discover')}</button>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.federationPage.showAddModal()">+ ${t('add_peer')}</button>
        </div>
      </div>
      <div id="fed-body"><div style="padding:40px;text-align:center;color:var(--text-muted);">${t('loading')}</div></div>`;
    await this.loadAndRender();
  },

  async loadAndRender() {
    try {
      this._peers = await ATLAS.api.get('/api/federation/peers');
      this._renderPeers();
    } catch(e) {
      document.getElementById('fed-body').innerHTML = `<div style="padding:40px;text-align:center;color:var(--danger);">Fehler: ${e.message}</div>`;
    }
  },

  _renderPeers() {
    const t = k => ATLAS.i18n.t(k);
    const el = document.getElementById('fed-body');
    if (!el) return;
    const statusColor = s => s === 'online' ? 'var(--success)' : s === 'offline' ? 'var(--danger)' : 'var(--text-muted)';
    const statusIcon = s => s === 'online' ? '🟢' : s === 'offline' ? '🔴' : '⚪';

    el.innerHTML = `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-title">🔑 Eigener Verbund-API-Schlüssel</div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Andere Leitstellen benötigen diesen Schlüssel, um eure Live-Daten abrufen zu können.</p>
        <div style="display:flex;gap:8px;align-items:center;">
          <input id="fed-own-key" class="form-input" style="flex:1;font-family:monospace;" placeholder="Noch kein Schlüssel gesetzt">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.federationPage.generateKey()">🔄 Generieren</button>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.federationPage.saveKey()">💾 Speichern</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Eure Verbund-URL: <code>${location.origin}/api/federation/live</code></div>
      </div>

      ${this._peers.length === 0 ? `
        <div class="card" style="text-align:center;padding:40px;">
          <div style="font-size:36px;margin-bottom:12px;">🌐</div>
          <div style="font-weight:600;margin-bottom:8px;">Noch keine Leitstellen verbunden</div>
          <p style="color:var(--text-muted);font-size:13px;">Füge andere Atlas-Instanzen hinzu oder nutze die automatische Erkennung über Tailscale.</p>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
          ${this._peers.map(p => `
            <div class="card" style="display:flex;align-items:center;gap:16px;">
              <div style="font-size:24px;">${statusIcon(p.status)}</div>
              <div style="flex:1;">
                <div style="font-weight:600;font-size:14px;">${p.name}</div>
                <div style="font-size:12px;color:var(--text-muted);">${p.url}</div>
                <div style="font-size:11px;color:${statusColor(p.status)};margin-top:2px;">
                  ${p.status === 'online' ? 'Online' : p.status === 'offline' ? 'Offline' : 'Status unbekannt'}
                  ${p.last_seen ? ` · Zuletzt: ${p.last_seen.substring(0,16)}` : ''}
                  ${p.auto_discovered ? ' · 📡 Auto-erkannt' : ''}
                </div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
                <button class="btn btn-secondary btn-sm" onclick="ATLAS.federationPage.pingPeer(${p.id})">🔔 Ping</button>
                <button class="btn btn-secondary btn-sm" onclick="ATLAS.federationPage.showLiveData(${p.id})">📊 Live</button>
                <button class="btn btn-secondary btn-sm" onclick="ATLAS.federationPage.showEditModal(${p.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="ATLAS.federationPage.deletePeer(${p.id})">🗑</button>
              </div>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:20px;">
          <button class="btn btn-primary" onclick="ATLAS.federationPage.syncAll()">🔄 ${t('sync_now')} (alle)</button>
          <button class="btn btn-secondary" onclick="ATLAS.federationPage.showLiveMap()">🗺 ${t('live_map')}</button>
        </div>`}

      <div id="fed-live-map" style="display:none;height:500px;border-radius:var(--radius-sm);margin-bottom:20px;"></div>
      <div id="fed-live-data"></div>`;

    // Load current federation key
    ATLAS.api.get('/api/config').then(cfg => {
      const inp = document.getElementById('fed-own-key');
      if (inp && cfg.federation_api_key) inp.value = cfg.federation_api_key;
    }).catch(() => {});
  },

  generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const key = Array.from({length: 48}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const inp = document.getElementById('fed-own-key');
    if (inp) inp.value = key;
  },

  async saveKey() {
    const key = document.getElementById('fed-own-key')?.value.trim();
    if (!key) { ATLAS.ui.toast('Bitte zuerst einen Schlüssel generieren', 'warning'); return; }
    try {
      await ATLAS.api.put('/api/config/advanced', {federation_api_key: key});
      ATLAS.ui.toast('API-Schlüssel gespeichert', 'success');
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  showAddModal(prefill = {}) {
    ATLAS.ui.modal('🌐 Leitstelle hinzufügen', `
      <div class="form-group"><label class="form-label">Name *</label><input id="fp-name" class="form-input" value="${prefill.name || ''}" placeholder="z.B. Feuerwehr München"></div>
      <div class="form-group"><label class="form-label">URL * (inkl. http/https)</label><input id="fp-url" class="form-input" value="${prefill.url || ''}" placeholder="https://192.168.1.100:8080"></div>
      <div class="form-group"><label class="form-label">API Key (optional)</label><input id="fp-key" class="form-input" value="${prefill.api_key || ''}" placeholder="Verbund-API-Schlüssel der anderen Leitstelle"></div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-primary" onclick="ATLAS.federationPage.savePeer()">💾 Hinzufügen</button>
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      </div>`);
  },

  showEditModal(id) {
    const p = this._peers.find(x => x.id === id);
    if (!p) return;
    ATLAS.ui.modal('✏️ Leitstelle bearbeiten', `
      <div class="form-group"><label class="form-label">Name</label><input id="fp-name" class="form-input" value="${p.name}"></div>
      <div class="form-group"><label class="form-label">URL</label><input id="fp-url" class="form-input" value="${p.url}"></div>
      <div class="form-group"><label class="form-label">API Key</label><input id="fp-key" class="form-input" value="${p.api_key || ''}"></div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-primary" onclick="ATLAS.federationPage.updatePeer(${id})">💾 Speichern</button>
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      </div>`);
  },

  async savePeer() {
    const name = document.getElementById('fp-name')?.value.trim();
    const url = document.getElementById('fp-url')?.value.trim();
    const key = document.getElementById('fp-key')?.value.trim();
    if (!name || !url) { ATLAS.ui.toast('Name und URL erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/federation/peers', {name, url, api_key: key});
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Leitstelle hinzugefügt', 'success');
      await this.loadAndRender();
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  async updatePeer(id) {
    const name = document.getElementById('fp-name')?.value.trim();
    const url = document.getElementById('fp-url')?.value.trim();
    const key = document.getElementById('fp-key')?.value.trim();
    try {
      await ATLAS.api.put(`/api/federation/peers/${id}`, {name, url, api_key: key});
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Gespeichert', 'success');
      await this.loadAndRender();
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  async deletePeer(id) {
    if (!confirm('Leitstelle wirklich entfernen?')) return;
    try {
      await ATLAS.api.delete(`/api/federation/peers/${id}`);
      ATLAS.ui.toast('Entfernt', 'success');
      await this.loadAndRender();
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  async pingPeer(id) {
    ATLAS.ui.toast('Pinge…', 'info');
    try {
      const res = await ATLAS.api.get(`/api/federation/peers/${id}/ping`);
      if (res.status === 'online') {
        ATLAS.ui.toast(`Online ✓ – ${res.data?.org_name || 'Antwort erhalten'}`, 'success');
      } else {
        ATLAS.ui.toast(`Offline: ${res.error || 'Keine Antwort'}`, 'warning');
      }
      await this.loadAndRender();
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  async syncAll() {
    ATLAS.ui.toast('Synchronisiere alle Leitstellen…', 'info');
    try {
      const data = await ATLAS.api.get('/api/federation/snapshot');
      const ok = data.peers.filter(p => p.status === 'ok').length;
      const fail = data.peers.filter(p => p.status === 'error').length;
      ATLAS.ui.toast(`Sync abgeschlossen: ${ok} online, ${fail} offline`, ok > 0 ? 'success' : 'warning');
      this._snapshot = data;
      this._renderLiveData(data);
      await this.loadAndRender();
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  async showLiveData(peerId) {
    ATLAS.ui.toast('Lade Live-Daten…', 'info');
    try {
      const res = await ATLAS.api.get(`/api/federation/peers/${peerId}/ping`);
      if (res.status !== 'online') { ATLAS.ui.toast('Leitstelle nicht erreichbar', 'warning'); return; }
      const d = res.data;
      ATLAS.ui.modal(`📊 Live-Daten – ${d.org_name}`, `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Stand: ${d.timestamp?.substring(0,19) || '—'} UTC</div>
        <div class="kpi-grid" style="margin-bottom:16px;">
          <div class="kpi-card"><div class="kpi-label">OFFENE EINSÄTZE</div><div class="kpi-value" style="color:var(--danger);">${d.incidents?.length || 0}</div></div>
          <div class="kpi-card"><div class="kpi-label">AKTIVE ALARME</div><div class="kpi-value" style="color:var(--warning);">${d.alerts?.length || 0}</div></div>
          <div class="kpi-card"><div class="kpi-label">ASSETS</div><div class="kpi-value" style="color:var(--accent);">${d.assets?.length || 0}</div></div>
          <div class="kpi-card"><div class="kpi-label">FAHRZEUGE</div><div class="kpi-value" style="color:var(--success);">${d.vehicles?.length || 0}</div></div>
        </div>
        ${d.incidents?.length ? `<b>Aktive Einsätze:</b><div style="display:flex;flex-direction:column;gap:6px;margin:8px 0;">
          ${d.incidents.slice(0,10).map(i => `<div style="padding:8px 12px;border-radius:var(--radius-sm);border-left:3px solid var(--${i.severity==='critical'?'danger':i.severity==='warning'?'warning':'accent'});">
            <span style="font-weight:600;">${ATLAS.ui.esc(i.title)}</span> <span style="font-size:11px;color:var(--text-muted);">${i.severity} · ${(i.created_at||'').substring(0,16)}</span>
          </div>`).join('')}</div>` : ''}
        ${d.alerts?.length ? `<b>Alarme:</b><div style="display:flex;flex-direction:column;gap:4px;margin:8px 0;">
          ${d.alerts.slice(0,5).map(a => `<div style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);">${a.message} <span style="color:var(--text-muted);">${(a.created_at||'').substring(0,16)}</span></div>`).join('')}</div>` : ''}
      `, 'large');
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  async showLiveMap() {
    const mapEl = document.getElementById('fed-live-map');
    if (!mapEl) return;
    if (mapEl.style.display === 'none' || !mapEl.style.display) {
      mapEl.style.display = 'block';
    } else {
      mapEl.style.display = 'none'; return;
    }
    // Render combined map
    if (this._fedMap) { this._fedMap.remove(); this._fedMap = null; }
    this._fedMap = L.map(mapEl).setView([51.0, 10.0], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© OSM'}).addTo(this._fedMap);

    // Load and display all peers' data
    try {
      const data = await ATLAS.api.get('/api/federation/snapshot');
      data.peers.filter(p => p.status === 'ok').forEach(peer => {
        const d = peer.data;
        const color = `#${Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0')}`;
        (d.incidents || []).filter(i => i.lat && i.lng).forEach(i => {
          L.circleMarker([i.lat, i.lng], {radius: 10, color: '#f85149', fillColor: '#f85149', fillOpacity: 0.7})
            .bindPopup(`<b>${peer.peer_name}</b><br>⚠️ ${ATLAS.ui.esc(i.title)}<br>${i.severity}`).addTo(this._fedMap);
        });
        (d.vehicles || []).filter(v => v.lat && v.lng).forEach(v => {
          L.circleMarker([v.lat, v.lng], {radius: 7, color, fillColor: color, fillOpacity: 0.8})
            .bindPopup(`<b>${peer.peer_name}</b><br>🚗 ${ATLAS.ui.esc(v.name)}<br>${v.status}`).addTo(this._fedMap);
        });
        (d.assets || []).filter(a => a.lat && a.lng).forEach(a => {
          L.circleMarker([a.lat, a.lng], {radius: 6, color: '#58a6ff', fillColor: '#58a6ff', fillOpacity: 0.6})
            .bindPopup(`<b>${peer.peer_name}</b><br>🎯 ${a.name}`).addTo(this._fedMap);
        });
      });
      ATLAS.ui.toast('Verbund-Karte geladen', 'success');
    } catch(e) {
      ATLAS.ui.toast('Konnte Verbund-Daten nicht laden: ' + e.message, 'warning');
    }
  },

  async autoDiscover() {
    ATLAS.ui.toast('Suche nach Tailscale-Peers…', 'info');
    try {
      const res = await ATLAS.api.get('/api/setup/tailscale-peers');
      if (res.error) { ATLAS.ui.toast('Tailscale nicht verfügbar: ' + res.error, 'warning'); return; }
      if (!res.peers.length) { ATLAS.ui.toast('Keine Tailscale-Peers gefunden', 'info'); return; }
      // For each peer, try to ping the Atlas port
      let found = 0;
      for (const p of res.peers) {
        try {
          const url = `http://${p.ip}:8080`;
          const _fc = new AbortController(); const _ft = setTimeout(() => _fc.abort(), 3000);
          const r = await fetch(`${url}/api/setup/status`, {signal: _fc.signal}).finally(() => clearTimeout(_ft)).then(x => x.json());
          if (!r.setup_required) {
            // It's an Atlas instance — add as peer if not already there
            const exists = this._peers.some(ex => ex.url === url);
            if (!exists) {
              await ATLAS.api.post('/api/federation/peers', {name: p.hostname, url, api_key: '', auto_discovered: true});
              found++;
            }
          }
        } catch {}
      }
      ATLAS.ui.toast(found > 0 ? `${found} neue Leitstelle(n) automatisch erkannt` : 'Keine neuen Atlas-Instanzen gefunden', found > 0 ? 'success' : 'info');
      if (found > 0) await this.loadAndRender();
    } catch(e) { ATLAS.ui.toast(e.message, 'warning'); }
  },

  _renderLiveData(data) {
    const el = document.getElementById('fed-live-data');
    if (!el) return;
    const online = data.peers.filter(p => p.status === 'ok');
    if (!online.length) return;
    el.innerHTML = `<div class="card"><div class="card-title">📊 Verbund-Übersicht</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${online.map(p => `<div style="padding:10px;border-radius:var(--radius-sm);border:1px solid var(--border);">
          <div style="font-weight:600;margin-bottom:4px;">🟢 ${p.peer_name} – ${p.data.org_name}</div>
          <div style="font-size:12px;color:var(--text-muted);">
            ⚠️ ${p.data.incidents?.length||0} Einsätze · 🔔 ${p.data.alerts?.length||0} Alarme · 🚗 ${p.data.vehicles?.length||0} Fahrzeuge
          </div>
        </div>`).join('')}
      </div>
    </div>`;
  },
};

/* ============================================================
   Timeline Page – Echtzeit-Ereigniszeitleiste
============================================================ */
ATLAS.timelinePage = {
  _filter: 'all',

  async render(el) {
    el.innerHTML = `
      <div class="page-header">
        <h1>📈 ${ATLAS.i18n.t('timeline')}</h1>
        <div style="display:flex;gap:8px;">
          <button class="btn ${this._filter==='all'?'btn-primary':'btn-secondary'} btn-sm" onclick="ATLAS.timelinePage._setFilter('all')">${ATLAS.i18n.t('timeline_all')}</button>
          <button class="btn ${this._filter==='incidents'?'btn-primary':'btn-secondary'} btn-sm" onclick="ATLAS.timelinePage._setFilter('incidents')">⚠️ ${ATLAS.i18n.t('timeline_incidents')}</button>
          <button class="btn ${this._filter==='alerts'?'btn-primary':'btn-secondary'} btn-sm" onclick="ATLAS.timelinePage._setFilter('alerts')">🔔 ${ATLAS.i18n.t('timeline_alerts')}</button>
          <button class="btn ${this._filter==='fleet'?'btn-primary':'btn-secondary'} btn-sm" onclick="ATLAS.timelinePage._setFilter('fleet')">🚗 ${ATLAS.i18n.t('timeline_fleet')}</button>
        </div>
      </div>
      <div id="timeline-content"><div style="padding:40px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</div></div>`;
    await this._load();
  },

  _setFilter(f) {
    this._filter = f;
    const el = document.getElementById('main-content');
    if (el) this.render(el);
  },

  async _load() {
    try {
      const [incidents, alerts, trips, logs] = await Promise.all([
        ATLAS.api.get('/api/incidents?limit=50').catch(() => []),
        ATLAS.api.get('/api/alerts?limit=50').catch(() => []),
        ATLAS.api.get('/api/fleet/trips').catch(() => []),
        ATLAS.api.get('/api/audit?limit=50').catch(() => []),
      ]);

      let events = [];
      if (this._filter === 'all' || this._filter === 'incidents') {
        (incidents || []).forEach(i => events.push({
          time: i.created_at, type: 'incident', icon: '⚠️',
          color: i.severity === 'critical' ? 'var(--danger)' : i.severity === 'warning' ? 'var(--warning)' : 'var(--accent)',
          title: i.title, sub: `${i.severity.toUpperCase()} · ${ATLAS.i18n.t(i.status)}`,
          link: () => ATLAS.router.go('incidents')
        }));
      }
      if (this._filter === 'all' || this._filter === 'alerts') {
        (alerts || []).forEach(a => events.push({
          time: a.created_at, type: 'alert', icon: '🔔',
          color: a.severity === 'critical' ? 'var(--danger)' : a.severity === 'warning' ? 'var(--warning)' : 'var(--text-muted)',
          title: a.message, sub: `${a.type} · ${a.severity}${a.acknowledged ? ' · ✓' : ''}`,
          link: () => ATLAS.router.go('alerts')
        }));
      }
      if (this._filter === 'all' || this._filter === 'fleet') {
        (trips || []).forEach(t => events.push({
          time: t.created_at, type: 'fleet', icon: '🚗',
          color: 'var(--success)',
          title: t.title || 'Tour', sub: `${t.vehicle_name||'?'} · ${t.status} · ${t.distance_km ? t.distance_km + ' km' : ''}`,
          link: () => ATLAS.router.go('fleet')
        }));
      }

      // Sort by time descending
      events.sort((a, b) => (b.time || '').localeCompare(a.time || ''));

      const el = document.getElementById('timeline-content');
      if (!el) return;
      if (!events.length) {
        el.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('no_data')}</div>`;
        return;
      }

      // Group by date
      const byDate = {};
      events.forEach(e => {
        const d = (e.time || '').substring(0, 10) || 'Unknown';
        if (!byDate[d]) byDate[d] = [];
        byDate[d].push(e);
      });

      el.innerHTML = `<div class="card" style="padding:16px 20px;">
        ${Object.entries(byDate).map(([date, evts]) => `
          <div style="margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border);">${date}</div>
            ${evts.map((e, ei) => `
              <div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border-light, rgba(255,255,255,0.04));cursor:pointer;" data-tl-route="${e.type}" onclick="ATLAS.timelinePage._navItem(this)">
                <div style="font-size:20px;min-width:28px;text-align:center;">${e.icon}</div>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="width:6px;height:6px;border-radius:50%;background:${e.color};display:inline-block;flex-shrink:0;"></span>
                    <span style="font-weight:600;font-size:13px;">${e.title}</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${e.sub}</div>
                </div>
                <div style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${(e.time||'').substring(11,16)}</div>
              </div>`).join('')}
          </div>`).join('')}
      </div>`;
    } catch(e) {
      const el = document.getElementById('timeline-content');
      if (el) el.innerHTML = `<div class="card" style="padding:20px;color:var(--danger);">${ATLAS.i18n.t('error')}: ${e.message}</div>`;
    }
  },

  _navItem(el) {
    const routeMap = {
      incident: 'incidents', incidents: 'incidents',
      alert: 'alerts', alerts: 'alerts',
      fleet: 'fleet',
    };
    const type = el.getAttribute('data-tl-route') || '';
    const page = routeMap[type] || type;
    if (page) ATLAS.router.go(page);
  }
};

/* ============================================================
   NINA Status Widget (in settings & dashboard)
============================================================ */
ATLAS.ninaWidget = {
  async render(el) {
    if (!el) return;
    try {
      const s = await ATLAS.api.get('/api/alerts/nina/status');
      el.innerHTML = `
        <div class="card">
          <div class="card-title">🚨 ${ATLAS.i18n.t('nina_monitor')}</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <span class="badge ${s.enabled ? 'badge-success' : 'badge-secondary'}">${s.enabled ? ATLAS.i18n.t('enabled') : ATLAS.i18n.t('disabled')}</span>
            <span style="font-size:12px;color:var(--text-muted);">${ATLAS.i18n.t('nina_last_check')}: ${s.last_check ? s.last_check.substring(0,19)+' UTC' : '—'}</span>
          </div>
          <div style="font-size:13px;margin-bottom:12px;">
            ${ATLAS.i18n.t('nina_warnings')}: <strong style="color:${s.warning_count>0?'var(--danger)':'var(--success)'};">${s.warning_count}</strong>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <label class="toggle-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="nina-toggle" ${s.enabled ? 'checked' : ''} onchange="ATLAS.ninaWidget.toggle(this.checked)">
              ${ATLAS.i18n.t('nina_enabled')}
            </label>
          </div>
          ${['admin','owner'].includes(ATLAS.state.user?.role) ? `
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
            <div style="font-weight:600;margin-bottom:8px;">⚠️ ${ATLAS.i18n.t('trigger_emergency')}</div>
            <input id="emergency-msg" class="form-control" style="margin-bottom:8px;" placeholder="Nachricht…" value="MAXIMALER NOTFALL – Alle Einheiten in Bereitschaft">
            <button class="btn btn-danger btn-sm" onclick="ATLAS.ninaWidget.triggerEmergency()">🚨 ${ATLAS.i18n.t('emergency_broadcast')}</button>
          </div>` : ''}
        </div>`;
    } catch(e) {
      // Show widget even if status fetch fails — emergency button must always be accessible
      el.innerHTML = `
        <div class="card">
          <div class="card-title">🚨 ${ATLAS.i18n.t('nina_monitor')}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Status nicht verfügbar (Netzwerkfehler)</div>
          ${['admin','owner'].includes(ATLAS.state.user?.role) ? `
          <div style="padding-top:12px;border-top:1px solid var(--border);">
            <div style="font-weight:600;margin-bottom:8px;">⚠️ ${ATLAS.i18n.t('trigger_emergency')}</div>
            <input id="emergency-msg" class="form-control" style="margin-bottom:8px;" placeholder="Nachricht…" value="MAXIMALER NOTFALL – Alle Einheiten in Bereitschaft">
            <button class="btn btn-danger btn-sm" onclick="ATLAS.ninaWidget.triggerEmergency()">🚨 ${ATLAS.i18n.t('emergency_broadcast')}</button>
          </div>` : ''}
        </div>`;
    }
  },

  async toggle(enabled) {
    try {
      await ATLAS.api.put('/api/alerts/nina/config', { enabled });
      ATLAS.ui.toast(enabled ? 'NINA aktiviert' : 'NINA deaktiviert', 'info');
    } catch(e) { ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error'); }
  },

  async triggerEmergency() {
    const msg = document.getElementById('emergency-msg')?.value || 'MAXIMALER NOTFALL';
    if (!confirm(`Jetzt einen maximalen Notfallalarm auslösen?\n\n"${msg}"`)) return;
    try {
      await ATLAS.api.post('/api/alerts/broadcast-emergency', {
        title: '⚠ NOTFALLALARM',
        message: msg,
        source: 'manual'
      });
      ATLAS.ui.toast('Notfallalarm ausgelöst', 'error');
    } catch(e) { ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error'); }
  }
};

/* ============================================================
   Mobile App Connect Widget (in settings)
============================================================ */
ATLAS.mobileWidget = {
  async render(el) {
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <div class="card-title">📱 ${ATLAS.i18n.t('connect_mobile_app')}</div>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">${ATLAS.i18n.t('scan_qr_code')}</p>
        <div id="mobile-qr-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;">
          <span style="color:var(--text-muted);font-size:13px;">${ATLAS.i18n.t('qr_generating')}</span>
        </div>
        <div id="mobile-url-info" style="margin-top:10px;display:none;">
          <div id="mobile-ts-url-box" style="display:none;background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.2);border-radius:8px;padding:8px 12px;margin-bottom:6px;">
            <div style="font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;">🔒 Tailscale-URL (im QR-Code)</div>
            <code id="mobile-ts-url-val" style="font-size:11px;color:var(--text);word-break:break-all;"></code>
          </div>
          <div id="mobile-local-url-box" style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:8px 12px;margin-bottom:6px;">
            <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">🏠 Lokale URL (Fallback, nur im gleichen Netzwerk)</div>
            <code id="mobile-local-url-val" style="font-size:11px;color:var(--text);word-break:break-all;"></code>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">💡 ${ATLAS.i18n.t('qr_tailscale_hint')}</div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">${ATLAS.i18n.t('qr_expires_in')}</div>
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
          <div style="font-weight:600;margin-bottom:8px;font-size:13px;">⚙️ ${ATLAS.i18n.t('apns_config')}</div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:11px;">${ATLAS.i18n.t('apns_key_id')}</label>
            <input id="apns-key-id" class="form-input" placeholder="ABCDE12345" style="font-size:12px;">
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:11px;">${ATLAS.i18n.t('apns_team_id')}</label>
            <input id="apns-team-id" class="form-input" placeholder="ABCDE12345" style="font-size:12px;">
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:11px;">${ATLAS.i18n.t('apns_p8_key')}</label>
            <textarea id="apns-p8-key" class="form-input" rows="3" placeholder="-----BEGIN PRIVATE KEY-----\n…" style="font-size:11px;font-family:monospace;resize:vertical;"></textarea>
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="toggle-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;">
              <input type="checkbox" id="apns-sandbox" checked>
              ${ATLAS.i18n.t('apns_sandbox')}
            </label>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="ATLAS.mobileWidget.saveApns()">💾 Speichern</button>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.mobileWidget.testApns()">🔔 ${ATLAS.i18n.t('apns_test')}</button>
          </div>
        </div>
      </div>`;
    // Load QR code
    this._generateQR();
    // Load existing APNs config
    this._loadApnsConfig();
  },

  async _generateQR() {
    const container = document.getElementById('mobile-qr-container');
    if (!container) return;
    try {
      const data = await ATLAS.api.get('/api/mobile/qr-token');
      if (!data?.qr_payload) return;

      // Show URL info panel
      const infoBox = document.getElementById('mobile-url-info');
      if (infoBox) infoBox.style.display = 'block';
      if (data.tailscale_url) {
        const tsBox = document.getElementById('mobile-ts-url-box');
        const tsVal = document.getElementById('mobile-ts-url-val');
        if (tsBox) tsBox.style.display = 'block';
        if (tsVal) tsVal.textContent = data.tailscale_url;
      }
      const localVal = document.getElementById('mobile-local-url-val');
      if (localVal) localVal.textContent = data.local_url || data.server_url || '';

      const renderQR = (text) => {
        container.innerHTML = '';
        new QRCode(container, {
          text,
          width: 200, height: 200,
          colorDark: '#00e5ff', colorLight: '#0a0e1a',
          correctLevel: QRCode.CorrectLevel.M
        });
      };

      // Use qrcode.js CDN if available, else load dynamically
      if (typeof QRCode !== 'undefined') {
        renderQR(data.qr_payload);
      } else {
        container.innerHTML = `<code style="font-size:10px;word-break:break-all;color:var(--accent);">${data.qr_payload}</code>`;
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => renderQR(data.qr_payload);
        document.head.appendChild(script);
      }
    } catch(e) {
      if (container) container.innerHTML = '<span style="color:var(--danger);font-size:12px;">Fehler beim Generieren</span>';
    }
  },

  async _loadApnsConfig() {
    try {
      const cfg = await ATLAS.api.get('/api/config').catch(() => ({}));
      if (cfg.apns_key_id) document.getElementById('apns-key-id').value = cfg.apns_key_id;
      if (cfg.apns_team_id) document.getElementById('apns-team-id').value = cfg.apns_team_id;
      if (cfg.apns_p8_key) document.getElementById('apns-p8-key').value = cfg.apns_p8_key;
      const sandbox = document.getElementById('apns-sandbox');
      if (sandbox) sandbox.checked = cfg.apns_sandbox !== false;
    } catch(e) {}
  },

  async saveApns() {
    const body = {
      apns_key_id: document.getElementById('apns-key-id')?.value.trim(),
      apns_team_id: document.getElementById('apns-team-id')?.value.trim(),
      apns_p8_key: document.getElementById('apns-p8-key')?.value.trim(),
      apns_sandbox: document.getElementById('apns-sandbox')?.checked ?? true,
    };
    try {
      await ATLAS.api.put('/api/config', body);
      ATLAS.ui.toast('APNs gespeichert', 'success');
    } catch(e) { ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error'); }
  },

  async testApns() {
    try {
      await ATLAS.api.post('/api/push/apns/test', {});
      ATLAS.ui.toast('Test-Push gesendet', 'success');
    } catch(e) { ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error'); }
  }
};

// Handle __ATLAS_NATIVE__ mode injected by WKWebView
if (window.__ATLAS_NATIVE__) {
  document.documentElement.setAttribute('data-native', 'true');
  // Add CSS class for native app-specific styling
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('native-app');
  });
}

/* ============================================================
   Analytics: Fahrzeugauslastung + Trends (extends predictivePage)
============================================================ */
ATLAS.analyticsExtPage = {
  async render(el) {
    el.innerHTML = `
      <div class="page-header"><h1>📊 ${ATLAS.i18n.t('analytics')}</h1></div>
      <div id="analytics-ext-content"><div style="padding:40px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</div></div>`;
    await this._load(document.getElementById('analytics-ext-content'));
  },

  async _load(el) {
    try {
      const [util, trends] = await Promise.all([
        ATLAS.api.get('/api/analytics/vehicle-utilization?days=30'),
        ATLAS.api.get('/api/analytics/incident-trends?days=90'),
      ]);
      const safeUtil = util || { vehicles: [] };
      const safeTrends = trends || { trend_direction: 'stable', trend_7d_pct: 0, recent_7d_total: 0, prev_7d_total: 0, by_day: {} };
      el.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div class="card">
            <div class="card-title">📈 ${ATLAS.i18n.t('incident_trends')} (90 Tage)</div>
            <div style="display:flex;gap:12px;margin-bottom:12px;">
              <div class="kpi-card" style="flex:1;padding:12px;text-align:center;">
                <div class="kpi-label">TREND 7T</div>
                <div class="kpi-value" style="font-size:20px;color:${safeTrends.trend_direction==='up'?'var(--danger)':safeTrends.trend_direction==='down'?'var(--success)':'var(--accent)'};">
                  ${safeTrends.trend_direction==='up'?ATLAS.i18n.t('trend_up'):safeTrends.trend_direction==='down'?ATLAS.i18n.t('trend_down'):ATLAS.i18n.t('trend_stable')} ${Math.abs(safeTrends.trend_7d_pct||0)}%
                </div>
              </div>
              <div class="kpi-card" style="flex:1;padding:12px;text-align:center;">
                <div class="kpi-label">LETZTE 7T</div>
                <div class="kpi-value" style="font-size:20px;">${safeTrends.recent_7d_total||0}</div>
              </div>
              <div class="kpi-card" style="flex:1;padding:12px;text-align:center;">
                <div class="kpi-label">VORHERIGE 7T</div>
                <div class="kpi-value" style="font-size:20px;">${safeTrends.prev_7d_total||0}</div>
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;font-size:12px;">
                <thead><tr><th style="padding:4px 6px;text-align:left;">Datum</th><th style="padding:4px 6px;color:var(--danger);">Kritisch</th><th style="padding:4px 6px;color:var(--warning);">Warnung</th><th style="padding:4px 6px;color:var(--accent);">Info</th></tr></thead>
                <tbody>${Object.entries(safeTrends.by_day||{}).slice(-14).map(([d,v])=>`
                  <tr><td style="padding:4px 6px;">${d}</td><td style="padding:4px 6px;color:var(--danger);">${v.critical||0}</td><td style="padding:4px 6px;color:var(--warning);">${v.warning||0}</td><td style="padding:4px 6px;color:var(--accent);">${v.info||0}</td></tr>
                `).join('')}</tbody>
              </table>
            </div>
          </div>
          <div class="card">
            <div class="card-title">🚗 ${ATLAS.i18n.t('vehicle_utilization')} (30 Tage)</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${(safeUtil.vehicles||[]).slice(0,10).map(v => `
                <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);background:var(--bg-input);">
                  <div style="flex:1;">
                    <div style="font-weight:600;font-size:12px;">${v.vehicle_name}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${v.vehicle_type}</div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-weight:700;color:var(--accent);">${v.trip_count} ${ATLAS.i18n.t('trip_count')}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${v.total_distance_km} km · ${v.total_fuel_l} L</div>
                  </div>
                  <div style="width:60px;">
                    <div style="height:6px;background:var(--bg-card);border-radius:3px;overflow:hidden;">
                      <div style="height:100%;background:var(--accent);width:${Math.min(100,(v.trip_count/Math.max(...(safeUtil.vehicles||[{trip_count:1}]).map(x=>x.trip_count||1)))*100)}%;transition:width 0.3s;"></div>
                    </div>
                  </div>
                </div>`).join('') || `<div style="color:var(--text-muted);padding:20px;text-align:center;">${ATLAS.i18n.t('no_data')}</div>`}
            </div>
          </div>
        </div>`;
    } catch(e) {
      const errDiv = document.createElement('div');
      errDiv.className = 'card';
      errDiv.style = 'padding:20px;color:var(--danger);';
      errDiv.textContent = `${ATLAS.i18n.t('error')}: ${e.message}`;
      el.innerHTML = '';
      el.appendChild(errDiv);
    }
  }
};

/* ============================================================
   Idle Logout – auto-logout after 2h of inactivity (client-side)
============================================================ */
ATLAS.idleLogout = {
  _timer: null,
  _IDLE_MS: 2 * 60 * 60 * 1000, // 2 hours
  _handler: null,

  init() {
    // Remove old listeners if re-initializing (e.g. re-login)
    if (this._handler) this.destroy();
    this._handler = () => this._reset();
    ['mousemove','keydown','click','scroll','touchstart'].forEach(ev =>
      document.addEventListener(ev, this._handler, { passive: true })
    );
    this._reset();
  },

  destroy() {
    if (this._handler) {
      ['mousemove','keydown','click','scroll','touchstart'].forEach(ev =>
        document.removeEventListener(ev, this._handler)
      );
      this._handler = null;
    }
    clearTimeout(this._timer);
    this._timer = null;
  },

  _reset() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      ATLAS.ui.toast('⏱ Sitzung abgelaufen – automatisch abgemeldet', 'warning');
      setTimeout(() => ATLAS.auth.logout(), 2000);
    }, this._IDLE_MS);
  }
};

/* ============================================================
   Updater – checks for new versions and shows banner
============================================================ */
ATLAS.updater = {
  _data: null,

  /** Called once from boot() – checks silently in background */
  async check() {
    // Only admins see update notifications
    if (!ATLAS.state.user || ATLAS.state.user.role === 'operator') return;
    try {
      const res = await ATLAS.api.get('/api/system/update-check');
      this._data = res;
      if (res.update_available && res.remote_version) {
        const banner = document.getElementById('update-banner');
        const txt    = document.getElementById('update-banner-text');
        if (banner && txt) {
          txt.textContent = `🆕 Neue Version verfügbar: v${res.current_version} → v${res.remote_version}`;
          banner.style.display = 'flex';
        }
      }
    } catch(e) { /* non-fatal – no internet or not a git repo */ }
  },

  showDetails() {
    const d = this._data;
    if (!d) return;
    const method = d.method === 'git' ? '🔀 Git' : d.method === 'version.txt' ? '🌐 Version-URL' : '–';
    const lastUp = d.last_update ? `<br><small style="color:var(--text-muted)">Letztes Update: ${d.last_update}</small>` : '';
    const errRow = d.error ? `<p style="color:var(--danger);font-size:12px;margin-top:8px;">⚠ ${d.error}</p>` : '';
    ATLAS.ui.modal(
      '🆕 System-Update',
      `<div style="line-height:2;">
        <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 16px;font-size:13px;">
          <span style="color:var(--text-muted)">Installiert</span>   <strong>v${d.current_version}</strong>
          <span style="color:var(--text-muted)">Verfügbar</span>     <strong style="color:var(--success)">v${d.remote_version || '–'}</strong>
          <span style="color:var(--text-muted)">Methode</span>       <span>${method}</span>
          <span style="color:var(--text-muted)">Update-Befehl</span> <code style="background:var(--bg-secondary);padding:2px 6px;border-radius:4px;">${d.update_command}</code>
        </div>
        ${lastUp}
        ${errRow}
        <hr style="border-color:var(--border);margin:12px 0;">
        <p style="font-size:12px;color:var(--text-muted);">
          Das Update läuft auf dem Server – per SSH verbinden und <code>${d.update_command}</code> ausführen.
          Die App ist während des Updates ca. 10-30 Sekunden nicht erreichbar.
        </p>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button>
       <button class="btn btn-primary" onclick="ATLAS.updater.triggerUpdate()">🚀 Jetzt updaten</button>`
    );
  },

  /** Führt update.sh auf dem Server aus (nur wenn Server lokal ausgeführt wird) */
  async triggerUpdate() {
    ATLAS.ui.closeModal();
    if (!confirm('Server-Update starten? Die App ist ca. 30 Sekunden nicht erreichbar.')) return;
    ATLAS.ui.toast('🔄 Update wird gestartet…', 'info');
    try {
      await ATLAS.api.post('/api/system/run-update', {});
      ATLAS.ui.toast('✅ Update-Script gestartet. Seite lädt in 30 Sekunden neu…', 'success');
      // Auto-reload after 35s
      setTimeout(() => location.reload(), 35000);
    } catch(e) {
      ATLAS.ui.toast('Update-Trigger fehlgeschlagen: ' + e.message, 'error');
    }
  },
};

/* ============================================================
   Webhook Management – API integrations (admin only)
============================================================ */
ATLAS.webhooksPage = {
  _hooks: [],

  async render(el) {
    if (ATLAS.state.user?.role !== 'admin' && ATLAS.state.user?.role !== 'owner') {
      el.innerHTML = '<div class="card"><p style="color:var(--text-muted);">Admin-Zugriff erforderlich.</p></div>';
      return;
    }
    this._hooks = await ATLAS.api.get('/api/webhooks').catch(() => []);
    el.innerHTML = `
      <div class="page-header">
        <h1>🔗 Webhooks / API Hooks</h1>
        <button class="btn btn-primary" onclick="ATLAS.webhooksPage.showCreate()">+ Neuer Webhook</button>
      </div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">ℹ️ Was sind Webhooks?</div>
        <p style="font-size:13px;color:var(--text-muted);">Webhooks senden automatisch HTTP POST-Anfragen an externe URLs, wenn bestimmte Ereignisse eintreten (z.B. neuer Alarm, neuer Einsatz). Ideal für Integrationen mit Slack, Teams, IFTTT, n8n, Zapier etc.</p>
      </div>
      <div style="display:grid;gap:12px;" id="webhooks-list">
        ${this._hooks.length === 0 ? '<div class="card" style="text-align:center;color:var(--text-muted);">Noch keine Webhooks konfiguriert.</div>' :
          this._hooks.map(wh => this._renderHook(wh)).join('')}
      </div>`;
  },

  _renderHook(wh) {
    const events = JSON.parse(wh.events || '[]');
    return `
      <div class="card" style="display:flex;align-items:center;gap:12px;">
        <div style="font-size:28px;">🔗</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:14px;">${wh.name}</div>
          <div style="font-size:12px;color:var(--text-muted);word-break:break-all;">${wh.url}</div>
          <div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap;">
            ${events.map(e => `<span class="badge badge-info" style="font-size:10px;">${e}</span>`).join('')}
            <span class="badge ${wh.enabled ? 'badge-success' : 'badge-neutral'}" style="font-size:10px;">${wh.enabled ? 'Aktiv' : 'Inaktiv'}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.webhooksPage.test(${wh.id})" title="Test senden">▶ Test</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.webhooksPage.toggle(${wh.id},${wh.enabled})">${wh.enabled ? '⏸' : '▶'}</button>
          <button class="btn btn-danger btn-sm" onclick="ATLAS.webhooksPage.delete(${wh.id})">🗑</button>
        </div>
      </div>`;
  },

  showCreate() {
    ATLAS.ui.modal('Neuer Webhook', `
      <div class="form-group"><label class="form-label">Name</label><input id="wh-name" class="form-input" placeholder="z.B. Slack Alerts"></div>
      <div class="form-group"><label class="form-label">URL</label><input id="wh-url" class="form-input" placeholder="https://hooks.slack.com/services/..."></div>
      <div class="form-group"><label class="form-label">Geheimnis (optional)</label><input id="wh-secret" class="form-input" placeholder="Wird als X-Webhook-Secret Header gesendet"></div>
      <div class="form-group"><label class="form-label">Ereignisse</label>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;">
          <label><input type="checkbox" id="wh-ev-alert" checked> Alarm</label>
          <label><input type="checkbox" id="wh-ev-incident" checked> Einsatz</label>
          <label><input type="checkbox" id="wh-ev-emergency"> Notfall</label>
          <label><input type="checkbox" id="wh-ev-test"> Test</label>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
       <button class="btn btn-primary" onclick="ATLAS.webhooksPage.create()">+ Erstellen</button>`
    );
  },

  async create() {
    const name = document.getElementById('wh-name').value.trim();
    const url = document.getElementById('wh-url').value.trim();
    const secret = document.getElementById('wh-secret').value.trim();
    if (!name || !url) { ATLAS.ui.toast('Name und URL erforderlich', 'warning'); return; }
    const events = [];
    if (document.getElementById('wh-ev-alert').checked) events.push('alert');
    if (document.getElementById('wh-ev-incident').checked) events.push('incident');
    if (document.getElementById('wh-ev-emergency').checked) events.push('emergency');
    if (document.getElementById('wh-ev-test').checked) events.push('test');
    try {
      await ATLAS.api.post('/api/webhooks', { name, url, secret, events });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('Webhook erstellt ✓', 'success');
      ATLAS.router.go('webhooks', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'warning'); }
  },

  async toggle(id, currentEnabled) {
    try {
      await ATLAS.api.put(`/api/webhooks/${id}`, { enabled: currentEnabled ? 0 : 1 });
      ATLAS.router.go('webhooks', true);
    } catch(e) { ATLAS.ui.toast('Fehler', 'warning'); }
  },

  async delete(id) {
    if (!confirm('Webhook wirklich löschen?')) return;
    try {
      await ATLAS.api.delete(`/api/webhooks/${id}`);
      ATLAS.ui.toast('Webhook gelöscht', 'success');
      ATLAS.router.go('webhooks', true);
    } catch(e) { ATLAS.ui.toast('Fehler beim Löschen', 'warning'); }
  },

  async test(id) {
    try {
      const r = await ATLAS.api.post(`/api/webhooks/${id}/test`);
      if (r.ok) ATLAS.ui.toast(`✓ Test gesendet (Status ${r.status_code || 200})`, 'success');
      else ATLAS.ui.toast(`✗ Fehler: ${r.error}`, 'danger');
    } catch(e) { ATLAS.ui.toast('Test fehlgeschlagen', 'warning'); }
  }
};

/* ============================================================
   Security Monitor (admin/owner only)
============================================================ */
ATLAS.securityMonitor = {
  async render(el) {
    if (ATLAS.state.user?.role !== 'admin' && ATLAS.state.user?.role !== 'owner') {
      el.innerHTML = '<div class="card"><p>Kein Zugriff.</p></div>'; return;
    }
    const [data, sessions, blacklist] = await Promise.all([
      ATLAS.api.get('/api/security/monitor').catch(() => ({})),
      ATLAS.api.get('/api/security/sessions').catch(() => []),
      ATLAS.api.get('/api/security/blacklist').catch(() => []),
    ]);
    const isOwner = ATLAS.state.user?.role === 'owner';

    el.innerHTML = `
      <div class="page-header">
        <h1>🛡 Security Monitor</h1>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('security',true)">↻ Aktualisieren</button>
      </div>

      <div class="kpi-grid" style="margin-bottom:20px;">
        <div class="kpi-card">
          <div class="kpi-label">Fehlgeschlagene Logins (24h)</div>
          <div class="kpi-value" style="color:var(--danger);">${(data.failed_logins_24h||[]).reduce((s,r)=>s+r.count,0)}</div>
          <div class="kpi-icon">🚫</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Aktive Sessions</div>
          <div class="kpi-value" style="color:var(--success);">${sessions.length}</div>
          <div class="kpi-icon">🔑</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Gesperrte IPs</div>
          <div class="kpi-value" style="color:var(--warning);">${blacklist.length}</div>
          <div class="kpi-icon">🚨</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Hohe Aktivität (1h)</div>
          <div class="kpi-value">${(data.high_activity_1h||[]).length}</div>
          <div class="kpi-icon">📈</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">🚫 Gesperrte IP-Adressen</div>
          ${isOwner ? `<div style="display:flex;gap:8px;margin-bottom:12px;">
            <input id="sec-block-ip" class="form-input form-input-sm" placeholder="IP-Adresse" style="flex:1;">
            <button class="btn btn-danger btn-sm" onclick="ATLAS.securityMonitor.blockIP()">Sperren</button>
          </div>` : ''}
          ${blacklist.length === 0 ? '<p style="color:var(--text-muted);font-size:13px;">Keine gesperrten IPs</p>' :
            `<div style="display:flex;flex-direction:column;gap:6px;">
              ${blacklist.map(b => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);">
                  <div>
                    <code style="font-size:12px;">${b.ip}</code>
                    <span class="badge badge-danger" style="font-size:10px;margin-left:6px;">${b.reason}</span>
                    <div style="font-size:11px;color:var(--text-muted);">Bis: ${new Date(b.blocked_until).toLocaleString('de-DE')}</div>
                  </div>
                  ${isOwner ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.securityMonitor.unblockIP('${b.ip}')">Freigeben</button>` : ''}
                </div>`).join('')}
            </div>`}
        </div>

        <div class="card">
          <div class="card-title">🔑 Aktive Sessions</div>
          <div style="max-height:250px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${sessions.length === 0 ? '<p style="color:var(--text-muted);font-size:13px;">Keine aktiven Sessions</p>' :
              sessions.map(s => `
                <div style="padding:6px 0;border-bottom:1px solid var(--border);">
                  <div style="font-size:13px;font-weight:600;">${s.username} <span class="badge badge-info" style="font-size:10px;">${s.role}</span></div>
                  <div style="font-size:11px;color:var(--text-muted);">IP: ${s.ip_addr||'–'} | Aktiv: ${s.last_active ? new Date(s.last_active).toLocaleTimeString('de-DE') : '–'}</div>
                </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:16px;">
        <div class="card-title">🔒 Sicherheitsereignisse</div>
        <div style="max-height:300px;overflow-y:auto;">
          <table class="table">
            <thead><tr><th>Zeit</th><th>Ereignis</th><th>Benutzer</th><th>IP</th></tr></thead>
            <tbody>
              ${(data.security_events||[]).map(e => `
                <tr>
                  <td style="font-size:11px;">${new Date(e.timestamp).toLocaleString('de-DE')}</td>
                  <td><span class="badge ${e.action.includes('blacklist')||e.action.includes('lockdown')?'badge-danger':'badge-warning'}" style="font-size:10px;">${e.action}</span></td>
                  <td style="font-size:12px;">${e.username||'–'}</td>
                  <td style="font-size:12px;"><code>${e.ip_addr||'–'}</code></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-top:16px;">
        <div class="card-title">📊 Login-Fehler nach IP (24h)</div>
        ${(data.failed_logins_24h||[]).length === 0 ? '<p style="color:var(--text-muted);font-size:13px;">Keine fehlgeschlagenen Logins</p>' :
          `<table class="table"><thead><tr><th>IP-Adresse</th><th>Versuche</th></tr></thead><tbody>
            ${(data.failed_logins_24h||[]).map(r => `
              <tr>
                <td><code style="font-size:12px;">${r.ip_addr||'–'}</code></td>
                <td><span class="badge badge-danger">${r.count}</span></td>
              </tr>`).join('')}
          </tbody></table>`}
      </div>`;
  },

  async blockIP() {
    const ip = document.getElementById('sec-block-ip')?.value.trim();
    if (!ip) { ATLAS.ui.toast('IP erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/security/blacklist', { ip, hours: 24, reason: 'manual' });
      ATLAS.ui.toast(`IP ${ip} gesperrt ✓`, 'success');
      ATLAS.router.go('security', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'warning'); }
  },

  async unblockIP(ip) {
    if (!confirm(`IP ${ip} freigeben?`)) return;
    try {
      await ATLAS.api.delete(`/api/security/blacklist/${encodeURIComponent(ip)}`);
      ATLAS.ui.toast(`IP ${ip} freigegeben ✓`, 'success');
      ATLAS.router.go('security', true);
    } catch(e) { ATLAS.ui.toast('Fehler', 'warning'); }
  }
};

/* ============================================================
   User Activity Heatmap
============================================================ */
ATLAS.activityHeatmap = {
  async render(el) {
    if (ATLAS.state.user?.role !== 'admin' && ATLAS.state.user?.role !== 'owner') {
      el.innerHTML = '<div class="card"><p>Kein Zugriff.</p></div>'; return;
    }
    const data = await ATLAS.api.get('/api/analytics/user-activity').catch(() => ({ heatmap: [], per_user: [], hourly_today: [] }));

    const days = ['So','Mo','Di','Mi','Do','Fr','Sa'];
    const hours = Array.from({length:24}, (_,i) => i);

    // Build heatmap matrix
    const matrix = {};
    (data.heatmap || []).forEach(r => {
      if (!matrix[r.weekday]) matrix[r.weekday] = {};
      matrix[r.weekday][r.hour] = r.count;
    });
    const maxVal = Math.max(1, ...Object.values(matrix).flatMap(h => Object.values(h)));

    el.innerHTML = `
      <div class="page-header"><h1>📊 Nutzer-Aktivitäts-Heatmap</h1></div>

      <div class="card" style="margin-bottom:16px;overflow-x:auto;">
        <div class="card-title">🗓 Aktivität nach Stunde & Wochentag (30 Tage)</div>
        <div style="min-width:700px;">
          <div style="display:grid;grid-template-columns:40px repeat(24,1fr);gap:2px;margin-bottom:4px;">
            <div></div>
            ${hours.map(h => `<div style="font-size:9px;text-align:center;color:var(--text-muted);">${h}h</div>`).join('')}
          </div>
          ${days.map((day, di) => `
            <div style="display:grid;grid-template-columns:40px repeat(24,1fr);gap:2px;margin-bottom:2px;">
              <div style="font-size:11px;font-weight:600;display:flex;align-items:center;">${day}</div>
              ${hours.map(h => {
                const count = (matrix[di] && matrix[di][h]) || 0;
                const intensity = Math.round((count / maxVal) * 255);
                const bg = count > 0 ? `rgba(0,${Math.round(100 + intensity * 0.6)},255,${0.2 + (count/maxVal)*0.8})` : 'var(--bg-tertiary)';
                return `<div style="height:20px;border-radius:3px;background:${bg};cursor:default;" title="${day} ${h}:00 – ${count} Aktionen"></div>`;
              }).join('')}
            </div>`).join('')}
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:11px;color:var(--text-muted);">
          <span>Wenig</span>
          ${[0.1,0.3,0.5,0.7,1.0].map(v => `<div style="width:20px;height:12px;border-radius:2px;background:rgba(0,150,255,${v});"></div>`).join('')}
          <span>Viel</span>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">👤 Aktivste Nutzer (7 Tage)</div>
          <table class="table">
            <thead><tr><th>Nutzer</th><th>Aktionen</th><th>Zuletzt</th></tr></thead>
            <tbody>
              ${(data.per_user||[]).map(u => `
                <tr>
                  <td style="font-size:13px;">${u.full_name||u.username}</td>
                  <td><span class="badge badge-info">${u.actions}</span></td>
                  <td style="font-size:11px;color:var(--text-muted);">${u.last_action ? new Date(u.last_action).toLocaleString('de-DE') : '–'}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-title">⏰ Aktivität heute (nach Stunde)</div>
          <div style="display:flex;align-items:flex-end;gap:3px;height:100px;">
            ${hours.map(h => {
              const entry = (data.hourly_today||[]).find(r => r.hour === h);
              const count = entry ? entry.count : 0;
              const maxH = Math.max(1, ...(data.hourly_today||[]).map(r => r.count));
              const pct = Math.round((count / maxH) * 100);
              return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">
                <div style="width:100%;background:var(--accent);border-radius:2px 2px 0 0;height:${pct}%;min-height:${count>0?2:0}px;" title="${h}:00 – ${count} Aktionen"></div>
                ${h % 4 === 0 ? `<div style="font-size:9px;color:var(--text-muted);">${h}h</div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }
};

/* ============================================================
   Bulk User Management (owner only)
============================================================ */
ATLAS.bulkUsers = {
  _selected: new Set(),

  toggleSelect(uid) {
    if (this._selected.has(uid)) this._selected.delete(uid);
    else this._selected.add(uid);
    const count = this._selected.size;
    const bar = document.getElementById('bulk-action-bar');
    const countEl = document.getElementById('bulk-count');
    if (bar) bar.classList.toggle('hidden', count === 0);
    if (countEl) countEl.textContent = count;
  },

  selectAll(users) {
    users.forEach(u => {
      if (u.role !== 'owner' && u.id !== ATLAS.state.user?.id) this._selected.add(u.id);
    });
    document.querySelectorAll('.bulk-check').forEach(cb => {
      if (cb.dataset.uid && !['owner'].includes(cb.dataset.role)) cb.checked = true;
    });
    const bar = document.getElementById('bulk-action-bar');
    const countEl = document.getElementById('bulk-count');
    if (bar && this._selected.size > 0) bar.classList.remove('hidden');
    if (countEl) countEl.textContent = this._selected.size;
  },

  clearSelection() {
    this._selected.clear();
    document.querySelectorAll('.bulk-check').forEach(cb => cb.checked = false);
    const bar = document.getElementById('bulk-action-bar');
    if (bar) bar.classList.add('hidden');
  },

  async bulkDeactivate() {
    if (this._selected.size === 0) return;
    if (!confirm(`${this._selected.size} Nutzer deaktivieren?`)) return;
    try {
      const r = await ATLAS.api.post('/api/users/bulk-deactivate', { user_ids: [...this._selected] });
      ATLAS.ui.toast(`${r.results.filter(x=>x.ok).length} Nutzer deaktiviert`, 'success');
      this.clearSelection();
      ATLAS.router.go('users', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'warning'); }
  },

  async bulkForceLogout() {
    if (this._selected.size === 0) return;
    if (!confirm(`Alle Sessions von ${this._selected.size} Nutzern beenden?`)) return;
    try {
      const r = await ATLAS.api.post('/api/users/bulk-force-logout', { user_ids: [...this._selected] });
      ATLAS.ui.toast(`${r.users_logged_out} Nutzer abgemeldet`, 'success');
      this.clearSelection();
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'warning'); }
  },

  async bulkChangeRole(role) {
    if (this._selected.size === 0) return;
    if (!confirm(`Rolle aller ${this._selected.size} Nutzer auf "${role}" setzen?`)) return;
    try {
      const r = await ATLAS.api.post('/api/users/bulk-role', { user_ids: [...this._selected], role });
      ATLAS.ui.toast(`${r.results.filter(x=>x.ok).length} Nutzer aktualisiert`, 'success');
      this.clearSelection();
      ATLAS.router.go('users', true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler', 'warning'); }
  }
};

/* ============================================================
   Lockdown – system-wide kill switch (owner only)
============================================================ */
ATLAS.lockdown = {
  _active: false,

  /** Call once after login to fetch current state and wire WS events. */
  async init() {
    try {
      const r = await ATLAS.api.get('/api/system/lockdown');
      this._apply(r.lockdown || false);
    } catch(e) {
      // Non-owner / network error – hide controls silently
    }
    // Listen for server-side broadcast when another client toggles lockdown
    ATLAS.ws.on('lockdown', d => this._apply(d.active));
  },

  _apply(active) {
    this._active = active;
    const banner = document.getElementById('lockdown-banner');
    const liftBtn = document.getElementById('lockdown-lift-btn');
    const control = document.getElementById('lockdown-control');
    const enableBtn = document.getElementById('lockdown-enable-btn');
    const isOwner = ATLAS.state.user?.role === 'owner';

    if (banner) banner.classList.toggle('hidden', !active);
    if (liftBtn) liftBtn.classList.toggle('hidden', !isOwner);
    if (control) control.classList.toggle('hidden', !isOwner);
    if (enableBtn) {
      enableBtn.textContent = active ? '🔓 Lockdown aufheben' : '🔒 Lockdown aktivieren';
      enableBtn.onclick = active ? () => this.disable() : () => this.enable();
    }
  },

  async enable() {
    if (!confirm('⚠️ Lockdown aktivieren?\n\nAlle Nutzer außer dem Owner werden sofort abgemeldet / blockiert.')) return;
    try {
      await ATLAS.api.post('/api/system/lockdown', {});
      ATLAS.ui.toast('🔒 Lockdown aktiviert', 'warning');
      this._apply(true);
    } catch(e) { ATLAS.ui.toast(e.message || 'Lockdown fehlgeschlagen', 'danger'); }
  },

  async disable() {
    try {
      await ATLAS.api.delete('/api/system/lockdown');
      ATLAS.ui.toast('🔓 Lockdown aufgehoben', 'success');
      this._apply(false);
    } catch(e) { ATLAS.ui.toast(e.message || 'Fehler beim Aufheben', 'danger'); }
  }
};

// ============================================================
// Geo-Fencing Page
// ============================================================
ATLAS.geofencingPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">🗺️ Geo-Fencing</h2>
      <button class="btn btn-primary btn-sm" onclick="ATLAS.geofencingPage.showCreate()">+ Neue Fence</button></div>
      <div id="gf-list" class="card-grid"></div>`;
    await this.load();
  },
  async load() {
    try {
      const data = await ATLAS.api.get('/api/security/geofences');
      const el = document.getElementById('gf-list');
      if (!el) return;
      if (!data.length) { el.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);">Keine Geo-Fences konfiguriert.</div>'; return; }
      el.innerHTML = data.map(f => `
        <div class="card">
          <div class="card-title">🗺️ ${f.name}</div>
          <div style="font-size:12px;color:var(--text-muted);">
            Lat: ${f.lat} | Lng: ${f.lng} | Radius: ${f.radius_m}m<br>
            Aktion: <strong>${f.action}</strong> | Status: ${f.active ? '🟢 Aktiv' : '🔴 Inaktiv'}
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.geofencingPage.toggle(${f.id},${f.active})">${f.active ? 'Deaktivieren' : 'Aktivieren'}</button>
            <button class="btn btn-danger btn-sm" onclick="ATLAS.geofencingPage.delete(${f.id})">🗑</button>
          </div>
        </div>`).join('');
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'danger'); }
  },
  showCreate() {
    ATLAS.ui.modal('Neue Geo-Fence', `
      <div class="form-group"><label class="form-label">Name</label><input id="gf-name" class="form-input" placeholder="z.B. Stadtgebiet"></div>
      <div class="form-group"><label class="form-label">Latitude</label><input id="gf-lat" class="form-input" type="number" step="0.0001" value="51.1657"></div>
      <div class="form-group"><label class="form-label">Longitude</label><input id="gf-lng" class="form-input" type="number" step="0.0001" value="10.4515"></div>
      <div class="form-group"><label class="form-label">Radius (m)</label><input id="gf-radius" class="form-input" type="number" value="1000"></div>
      <div class="form-group"><label class="form-label">Aktion</label>
        <select id="gf-action" class="form-select"><option value="alert">Alert auslösen</option><option value="log">Nur loggen</option><option value="block">Login blockieren</option></select></div>
      <button class="btn btn-primary" onclick="ATLAS.geofencingPage.create()">Erstellen</button>`);
  },
  async create() {
    const body = { name: document.getElementById('gf-name').value, lat: +document.getElementById('gf-lat').value,
      lng: +document.getElementById('gf-lng').value, radius_m: +document.getElementById('gf-radius').value,
      action: document.getElementById('gf-action').value };
    try { await ATLAS.api.post('/api/security/geofences', body); ATLAS.ui.closeModal(); ATLAS.ui.toast('Fence erstellt', 'success'); await this.load(); }
    catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  },
  async toggle(id, active) {
    try { await ATLAS.api.put(`/api/security/geofences/${id}`, { active: active ? 0 : 1 }); await this.load(); }
    catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  },
  async delete(id) {
    if (!confirm('Geo-Fence löschen?')) return;
    try { await ATLAS.api.delete(`/api/security/geofences/${id}`); await this.load(); }
    catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  }
};

// ============================================================
// Compliance Reports Page
// ============================================================
ATLAS.compliancePage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">📋 Compliance Reports</h2>
      <button class="btn btn-primary btn-sm" onclick="ATLAS.compliancePage.showGenerate()">+ Report generieren</button></div>
      <div id="cr-list" class="card-grid"></div>`;
    await this.load();
  },
  async load() {
    try {
      const data = await ATLAS.api.get('/api/compliance/reports');
      const el = document.getElementById('cr-list');
      if (!el) return;
      if (!data.length) { el.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);">Noch keine Compliance Reports generiert.</div>'; return; }
      el.innerHTML = data.map(r => `
        <div class="card">
          <div class="card-title">📋 ${r.report_type.toUpperCase()} Report #${r.id}</div>
          <div style="font-size:12px;color:var(--text-muted);">
            Generiert: ${r.generated_at} von ${r.generated_by_username || '-'}<br>
            Zeitraum: ${r.period_start?.substring(0,10) || '-'} – ${r.period_end?.substring(0,10) || '-'}
          </div>
          <div style="margin-top:8px;">
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.compliancePage.view(${r.id})">📄 Anzeigen</button>
          </div>
        </div>`).join('');
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'danger'); }
  },
  showGenerate() {
    const today = new Date().toISOString().substring(0,10);
    const month = new Date(Date.now() - 30*86400000).toISOString().substring(0,10);
    ATLAS.ui.modal('Compliance Report', `
      <div class="form-group"><label class="form-label">Typ</label>
        <select id="cr-type" class="form-select">
          <option value="dsgvo">DSGVO / ISO 27001</option>
          <option value="audit">Audit Report</option>
          <option value="incident">Incident Report</option>
        </select></div>
      <div class="form-group"><label class="form-label">Von</label><input id="cr-from" class="form-input" type="date" value="${month}"></div>
      <div class="form-group"><label class="form-label">Bis</label><input id="cr-to" class="form-input" type="date" value="${today}"></div>
      <button class="btn btn-primary" onclick="ATLAS.compliancePage.generate()">📋 Generieren</button>`);
  },
  async generate() {
    const body = { type: document.getElementById('cr-type').value,
      period_start: document.getElementById('cr-from').value, period_end: document.getElementById('cr-to').value };
    try {
      const r = await ATLAS.api.post('/api/compliance/reports/generate', body);
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(`Report #${r.id} generiert`, 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  },
  async view(id) {
    try {
      const r = await ATLAS.api.get(`/api/compliance/reports/${id}`);
      const c = r.content;
      ATLAS.ui.modal(`Report #${id} – ${r.report_type.toUpperCase()}`, `
        <div style="font-size:13px;display:flex;flex-direction:column;gap:8px;">
          <div><strong>Standard:</strong> ${c.compliance_standard}</div>
          <div><strong>Zeitraum:</strong> ${c.period?.start?.substring(0,10)} – ${c.period?.end?.substring(0,10)}</div>
          <div><strong>Aktive Nutzer:</strong> ${c.summary?.active_users}</div>
          <div><strong>Alarmierungen:</strong> ${c.summary?.alerts}</div>
          <div><strong>Einsätze:</strong> ${c.summary?.incidents}</div>
          <div><strong>Audit-Ereignisse:</strong> ${c.summary?.audit_events}</div>
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top:12px;" onclick="ATLAS.compliancePage.exportJSON(${JSON.stringify(c).replace(/"/g,'&quot;')})">📥 JSON Export</button>`);
    } catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  },
  exportJSON(c) {
    const blob = new Blob([JSON.stringify(c, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `compliance_report_${Date.now()}.json`; a.click();
  }
};

// ============================================================
// Encrypted Backups Page
// ============================================================
ATLAS.backupsPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">💾 Verschlüsselte Backups</h2>
      <button class="btn btn-primary btn-sm" onclick="ATLAS.backupsPage.create()">+ Backup erstellen</button></div>
      <p style="color:var(--text-muted);font-size:12px;margin-bottom:16px;">Automatisch verschlüsselte Datenbank-Snapshots. Nur Owner können Backups erstellen.</p>
      <div id="bk-list" class="card-grid"></div>`;
    await this.load();
  },
  async load() {
    try {
      const data = await ATLAS.api.get('/api/backups');
      const el = document.getElementById('bk-list');
      if (!el) return;
      if (!data.length) { el.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);">Keine Backups vorhanden.</div>'; return; }
      el.innerHTML = data.map(b => `
        <div class="card">
          <div class="card-title">💾 ${b.filename}</div>
          <div style="font-size:12px;color:var(--text-muted);">
            Größe: ${Math.round(b.size_bytes/1024)} KB<br>
            Erstellt: ${b.created_at}<br>
            Läuft ab: ${b.expires_at?.substring(0,10) || '–'}<br>
            Checksum: <code style="font-size:10px;">${b.checksum?.substring(0,12)}…</code>
          </div>
          <div style="margin-top:8px;">
            <button class="btn btn-danger btn-sm" onclick="ATLAS.backupsPage.delete(${b.id})">🗑 Löschen</button>
          </div>
        </div>`).join('');
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'danger'); }
  },
  async create() {
    try {
      const r = await ATLAS.api.post('/api/backups/create', {});
      ATLAS.ui.toast(`Backup erstellt: ${r.filename}`, 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  },
  async delete(id) {
    if (!confirm('Backup löschen?')) return;
    try { await ATLAS.api.delete(`/api/backups/${id}`); await this.load(); }
    catch(e) { ATLAS.ui.toast(e.message, 'danger'); }
  }
};

// ============================================================
// Admin System Settings Page
// ============================================================
ATLAS.adminSettingsPage = {
  _settings: [],
  _GROUPS: [
    { label: '🔐 Brute-Force Schutz', keys: ['login_max_attempts','login_window_seconds','login_lockout_seconds','ip_blacklist_threshold','ip_blacklist_duration_h'] },
    { label: '⚡ API Rate Limiting', keys: ['api_rate_max','api_rate_window'] },
    { label: '🔑 Sitzungen', keys: ['session_ttl_hours','max_sessions_per_user','session_idle_hours','session_cleaner_interval_s'] },
    { label: '🔔 Alarme & Eskalation', keys: ['alert_resend_interval_s','escalate_interval_s','escalate_age_minutes'] },
    { label: '🚗 Fuhrpark', keys: ['fleet_check_interval_s','fleet_insur_warn_days','fleet_insur_crit_days','fleet_tuev_warn_days','fleet_tuev_crit_days'] },
    { label: '🖥️ Systemüberwachung', keys: ['health_check_interval_s','kpi_interval_s','sysmon_history_max','sensor_update_interval_s','pi_temp_critical_c'] },
    { label: '🌐 Dienste', keys: ['nina_interval_s','scheduled_check_interval_s','failover_check_interval_s','failover_fail_threshold','ai_analysis_interval_s','ai_block_duration_h'] },
    { label: '💾 Datenpflege', keys: ['backup_retention_days','audit_log_retention_days','qr_token_ttl_hours'] },
  ],
  async render(el) {
    el.innerHTML = `<div class="page-header">
      <h2 class="page-title">⚙️ System-Einstellungen</h2>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.adminSettingsPage.reset()">↩ Zurücksetzen</button>
        <button class="btn btn-primary" onclick="ATLAS.adminSettingsPage.save()">💾 Alle speichern</button>
      </div>
    </div>
    <p style="color:var(--text-muted);margin-bottom:16px;font-size:13px;">Alle Werte werden sofort aktiv (kein Server-Neustart nötig). Einige Loop-Intervalle gelten ab dem nächsten Zyklus.</p>
    <div id="admin-settings-err" style="display:none;color:var(--danger);background:var(--danger-bg,#fff0f0);border:1px solid var(--danger);border-radius:6px;padding:10px 14px;margin-bottom:14px;"></div>
    <div id="admin-settings-body" style="display:flex;flex-direction:column;gap:16px;"></div>`;
    await this.load();
  },
  async load() {
    try {
      const data = await ATLAS.api.get('/api/admin/settings');
      this._settings = data.settings || [];
      const byKey = Object.fromEntries(this._settings.map(s => [s.key, s]));
      let html = '';
      for (const group of this._GROUPS) {
        const rows = group.keys.map(k => byKey[k]).filter(Boolean);
        if (!rows.length) continue;
        html += `<div class="card"><div style="font-weight:600;padding:12px 16px 0;">${group.label}</div><div style="padding:12px 16px 16px;">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
            ${rows.map(s => `<div>
              <label class="form-label" style="font-size:12px;color:var(--text-muted);">${s.description}</label>
              <div style="display:flex;align-items:center;gap:6px;">
                <input id="sysset-${s.key}" class="form-input" type="number" value="${s.value}" min="${s.min_val??''}" max="${s.max_val??''}" style="flex:1;">
                <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">[${s.min_val}–${s.max_val}]</span>
              </div>
            </div>`).join('')}
          </div>
        </div></div>`;
      }
      const body = document.getElementById('admin-settings-body');
      if (body) body.innerHTML = html;
    } catch(e) { ATLAS.ui.toast('Fehler beim Laden: '+e.message,'error'); }
  },
  async save() {
    const body = {};
    for (const s of this._settings) {
      const el = document.getElementById(`sysset-${s.key}`);
      if (el) body[s.key] = el.value;
    }
    try {
      const res = await ATLAS.api.put('/api/admin/settings', body);
      const errEl = document.getElementById('admin-settings-err');
      if (res.errors?.length) {
        if (errEl) { errEl.style.display=''; errEl.textContent='Fehler: '+res.errors.join(', '); }
      } else {
        if (errEl) errEl.style.display='none';
        ATLAS.ui.toast(`${res.updated?.length||0} Einstellungen gespeichert`,'success');
      }
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async reset() {
    if (!confirm('Alle System-Einstellungen auf Werkseinstellungen zurücksetzen?')) return;
    try {
      await ATLAS.api.post('/api/admin/settings/reset',{});
      ATLAS.ui.toast('Zurückgesetzt','success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

// ============================================================
// System Monitor Page (comprehensive)
// ============================================================
ATLAS.healthPage = {
  _interval: null,
  _history: [],

  async render(el) {
    el.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">🖥️ Systemüberwachung</h2>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;" id="sysmon-last-update">Lade Daten…</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <div id="sysmon-status-badge" style="padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;"></div>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.healthPage.refresh()">🔄 Jetzt</button>
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
          <input type="checkbox" id="sysmon-auto" checked onchange="ATLAS.healthPage.toggleAuto(this.checked)"> Auto (5s)
        </label>
      </div>
    </div>

    <!-- STATUS ROW -->
    <div id="sysmon-status-row" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-bottom:16px;"></div>

    <!-- GAUGES ROW -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:16px;">
      <!-- CPU -->
      <div class="card" id="sysmon-cpu-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:600;font-size:13px;">⚙️ CPU-Auslastung</span>
          <span id="sysmon-cpu-val" style="font-size:22px;font-weight:700;color:var(--accent);">–%</span>
        </div>
        <div style="height:10px;background:var(--bg-secondary);border-radius:5px;overflow:hidden;">
          <div id="sysmon-cpu-bar" style="height:10px;width:0%;background:var(--accent);border-radius:5px;transition:.5s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:6px;">
          <span>Load: <span id="sysmon-load">–</span></span>
          <span>Temp: <span id="sysmon-temp">–</span></span>
        </div>
        <!-- mini sparkline -->
        <canvas id="sysmon-cpu-spark" height="40" style="width:100%;margin-top:8px;border-radius:4px;"></canvas>
      </div>

      <!-- MEMORY -->
      <div class="card" id="sysmon-mem-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:600;font-size:13px;">🧠 Arbeitsspeicher</span>
          <span id="sysmon-mem-val" style="font-size:22px;font-weight:700;color:var(--accent);">–%</span>
        </div>
        <div style="height:10px;background:var(--bg-secondary);border-radius:5px;overflow:hidden;">
          <div id="sysmon-mem-bar" style="height:10px;width:0%;background:var(--accent);border-radius:5px;transition:.5s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:6px;">
          <span>Verwendet: <span id="sysmon-mem-used">–</span></span>
          <span>Gesamt: <span id="sysmon-mem-total">–</span></span>
        </div>
        <canvas id="sysmon-mem-spark" height="40" style="width:100%;margin-top:8px;border-radius:4px;"></canvas>
      </div>

      <!-- DISK -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:600;font-size:13px;">💾 Festplatte</span>
          <span id="sysmon-disk-val" style="font-size:22px;font-weight:700;color:var(--accent);">–%</span>
        </div>
        <div style="height:10px;background:var(--bg-secondary);border-radius:5px;overflow:hidden;">
          <div id="sysmon-disk-bar" style="height:10px;width:0%;background:var(--accent);border-radius:5px;transition:.5s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:6px;">
          <span>Belegt: <span id="sysmon-disk-used">–</span></span>
          <span>Frei: <span id="sysmon-disk-free">–</span></span>
        </div>
        <div style="margin-top:8px;">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Datenbank: <span id="sysmon-db-size">–</span></div>
        </div>
      </div>

      <!-- NETWORK -->
      <div class="card">
        <div style="font-weight:600;font-size:13px;margin-bottom:10px;">🌐 Netzwerk I/O (kumulativ)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="text-align:center;padding:10px;background:var(--bg-secondary);border-radius:8px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">↓ Empfangen</div>
            <div id="sysmon-net-rx" style="font-size:16px;font-weight:700;color:var(--success);">–</div>
          </div>
          <div style="text-align:center;padding:10px;background:var(--bg-secondary);border-radius:8px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">↑ Gesendet</div>
            <div id="sysmon-net-tx" style="font-size:16px;font-weight:700;color:var(--warning);">–</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:10px;">
          <span>Prozesse: <span id="sysmon-procs">–</span></span>
          <span>Uptime: <span id="sysmon-uptime">–</span></span>
        </div>
      </div>
    </div>

    <!-- APPLICATION STATS -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:16px;">
      <div class="card">
        <div style="font-weight:600;font-size:13px;margin-bottom:12px;">📡 Anwendungsstatus</div>
        <div id="sysmon-app-rows" style="display:flex;flex-direction:column;gap:8px;"></div>
      </div>

      <div class="card">
        <div style="font-weight:600;font-size:13px;margin-bottom:12px;">🗄️ Datenbanktabellen</div>
        <div id="sysmon-db-rows" style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;"></div>
      </div>

      <div class="card">
        <div style="font-weight:600;font-size:13px;margin-bottom:12px;">🖥️ Plattform</div>
        <div id="sysmon-platform-rows" style="display:flex;flex-direction:column;gap:6px;"></div>
      </div>
    </div>

    <!-- CPU HISTORY CHART -->
    <div class="card" style="margin-bottom:16px;">
      <div style="font-weight:600;font-size:13px;margin-bottom:10px;">📈 Verlauf (letzte 60 Messpunkte)</div>
      <div style="position:relative;height:120px;">
        <canvas id="sysmon-history-chart" style="width:100%;height:120px;"></canvas>
      </div>
      <div style="display:flex;gap:16px;margin-top:8px;font-size:11px;">
        <span style="display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:3px;background:var(--accent);border-radius:2px;"></span>CPU %</span>
        <span style="display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:3px;background:var(--success);border-radius:2px;"></span>RAM %</span>
      </div>
    </div>`;

    await this.refresh();
    this.toggleAuto(true);
  },

  toggleAuto(enabled) {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
    if (enabled) this._interval = setInterval(() => this.refresh(), 5000);
  },

  _fmtMb(mb) {
    if (mb == null) return '–';
    if (mb >= 1024) return (mb/1024).toFixed(1) + ' GB';
    return Math.round(mb) + ' MB';
  },

  _fmtUptime(sec) {
    if (sec == null) return '–';
    const d = Math.floor(sec/86400);
    const h = Math.floor((sec%86400)/3600);
    const m = Math.floor((sec%3600)/60);
    return d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  },

  _barColor(pct) {
    if (pct == null) return 'var(--accent)';
    if (pct > 85) return 'var(--danger)';
    if (pct > 65) return 'var(--warning)';
    return 'var(--success)';
  },

  _drawSparkline(canvasId, values, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || values.length < 2) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.offsetWidth || 260;
    const h = 40;
    canvas.width = w; canvas.height = h;
    ctx.clearRect(0,0,w,h);
    const max = Math.max(...values, 1);
    const step = w / (values.length - 1);
    ctx.beginPath();
    values.forEach((v,i) => {
      const x = i * step;
      const y = h - (v / max) * (h - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color || 'var(--accent)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // fill under
    ctx.lineTo((values.length-1)*step, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = (color || 'var(--accent)').replace(')', ',0.15)').replace('var(','').replace(')','') + ';';
    try { ctx.fill(); } catch(_){}
  },

  _drawHistoryChart(history) {
    const canvas = document.getElementById('sysmon-history-chart');
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.offsetWidth || 600;
    const h = 120;
    canvas.width = w; canvas.height = h;
    ctx.clearRect(0,0,w,h);

    // grid lines
    ctx.strokeStyle = 'rgba(128,128,128,0.15)';
    ctx.lineWidth = 1;
    [25,50,75,100].forEach(pct => {
      const y = h - (pct/100)*(h-8)-4;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
      ctx.fillStyle = 'rgba(128,128,128,0.5)';
      ctx.font = '9px monospace';
      ctx.fillText(pct+'%', 2, y-2);
    });

    const step = w / (history.length - 1);
    const drawLine = (key, color) => {
      ctx.beginPath();
      history.forEach((snap, i) => {
        const val = snap[key] ?? 0;
        const x = i * step;
        const y = h - (val/100)*(h-8)-4;
        i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    drawLine('cpu_pct', '#60a5fa');
    drawLine('mem_pct', '#34d399');
  },

  async refresh() {
    try {
      const d = await ATLAS.api.get('/api/system/monitor');
      const cur = d.current || {};
      const app = d.application || {};
      const plt = d.platform || {};
      const tbls = d.db_tables || {};
      this._history = d.history || [];

      // last update
      const lu = document.getElementById('sysmon-last-update');
      if (lu) lu.textContent = 'Letzte Aktualisierung: ' + new Date().toLocaleTimeString('de-DE');

      // status badge
      const sb = document.getElementById('sysmon-status-badge');
      if (sb) {
        const st = cur.status || 'ok';
        const cfg = { ok: ['✅ ONLINE','var(--success)','rgba(52,211,153,0.15)'],
                      warning: ['⚠️ WARNUNG','var(--warning)','rgba(251,191,36,0.15)'],
                      degraded: ['❌ DEGRADED','var(--danger)','rgba(239,68,68,0.15)'] };
        const [txt, col, bg] = cfg[st] || cfg.ok;
        sb.textContent = txt;
        sb.style.color = col;
        sb.style.background = bg;
        sb.style.border = `1px solid ${col}`;
      }

      // status row tiles
      const sr = document.getElementById('sysmon-status-row');
      if (sr) {
        const tiles = [
          ['🗄️ Datenbank', cur.db_ok ? '✅ OK' : '❌ Fehler', cur.db_ok ? 'var(--success)' : 'var(--danger)'],
          ['📡 WebSocket', cur.ws_ok ? '✅ OK' : '❌ Fehler', cur.ws_ok ? 'var(--success)' : 'var(--danger)'],
          ['👥 WS Clients', app.websocket_connections ?? '–', 'var(--accent)'],
          ['🚨 Alarme', app.active_alerts ?? '–', (app.active_alerts||0)>0 ? 'var(--warning)':'var(--text-primary)'],
          ['🔴 Einsätze', app.active_incidents ?? '–', (app.active_incidents||0)>0 ? 'var(--warning)':'var(--text-primary)'],
          ['👤 Nutzer', app.active_users ?? '–', 'var(--text-primary)'],
          ['🔐 Sessions', app.active_sessions ?? '–', 'var(--text-primary)'],
          ['📊 API 24h', app.api_requests_24h ?? '–', 'var(--text-muted)'],
        ];
        sr.innerHTML = tiles.map(([k,v,c]) => `
          <div class="card" style="padding:10px;text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">${k}</div>
            <div style="font-size:16px;font-weight:700;color:${c};">${v}</div>
          </div>`).join('');
      }

      // CPU gauge
      const cpuPct = cur.cpu_pct ?? 0;
      const cpuBar = document.getElementById('sysmon-cpu-bar');
      const cpuVal = document.getElementById('sysmon-cpu-val');
      if (cpuBar) { cpuBar.style.width = cpuPct + '%'; cpuBar.style.background = this._barColor(cpuPct); }
      if (cpuVal) { cpuVal.textContent = (cpuPct||0).toFixed(1) + '%'; cpuVal.style.color = this._barColor(cpuPct); }
      const loadEl = document.getElementById('sysmon-load');
      if (loadEl) loadEl.textContent = cur.load_1 != null ? `${cur.load_1} / ${cur.load_5} / ${cur.load_15}` : '–';
      const tempEl = document.getElementById('sysmon-temp');
      if (tempEl) tempEl.textContent = cur.cpu_temp_c != null ? cur.cpu_temp_c + ' °C' : 'N/A';

      // MEM gauge
      const memPct = cur.mem_pct ?? 0;
      const memBar = document.getElementById('sysmon-mem-bar');
      const memVal = document.getElementById('sysmon-mem-val');
      if (memBar) { memBar.style.width = memPct + '%'; memBar.style.background = this._barColor(memPct); }
      if (memVal) { memVal.textContent = (memPct||0).toFixed(1) + '%'; memVal.style.color = this._barColor(memPct); }
      const muEl = document.getElementById('sysmon-mem-used');
      if (muEl) muEl.textContent = this._fmtMb(cur.mem_used_mb);
      const mtEl = document.getElementById('sysmon-mem-total');
      if (mtEl) mtEl.textContent = this._fmtMb(cur.mem_total_mb);

      // DISK gauge
      const diskPct = cur.disk_pct ?? 0;
      const diskBar = document.getElementById('sysmon-disk-bar');
      const diskVal = document.getElementById('sysmon-disk-val');
      if (diskBar) { diskBar.style.width = diskPct + '%'; diskBar.style.background = this._barColor(diskPct); }
      if (diskVal) { diskVal.textContent = (diskPct||0).toFixed(1) + '%'; diskVal.style.color = this._barColor(diskPct); }
      const dfEl = document.getElementById('sysmon-disk-free');
      if (dfEl) dfEl.textContent = this._fmtMb(cur.disk_free_mb);
      const duEl = document.getElementById('sysmon-disk-used');
      if (duEl) duEl.textContent = this._fmtMb(cur.disk_used_mb);
      const dbsz = document.getElementById('sysmon-db-size');
      if (dbsz) dbsz.textContent = app.db_size_mb != null ? app.db_size_mb + ' MB' : '–';

      // Network
      const rxEl = document.getElementById('sysmon-net-rx');
      if (rxEl) rxEl.textContent = this._fmtMb(cur.net_rx_mb);
      const txEl = document.getElementById('sysmon-net-tx');
      if (txEl) txEl.textContent = this._fmtMb(cur.net_tx_mb);
      const upEl = document.getElementById('sysmon-uptime');
      if (upEl) upEl.textContent = this._fmtUptime(cur.uptime_seconds);
      const prEl = document.getElementById('sysmon-procs');
      if (prEl) prEl.textContent = cur.process_count ?? '–';

      // App rows
      const ar = document.getElementById('sysmon-app-rows');
      if (ar) {
        const rows = [
          ['API Anfragen (24h)', app.api_requests_24h ?? '–'],
          ['Rate Limit Hits (24h)', app.rate_limit_hits_24h ?? '–'],
          ['DB Größe', app.db_size_mb != null ? app.db_size_mb + ' MB' : '–'],
          ['WebSocket Clients', app.websocket_connections ?? '–'],
          ['Aktive Sessions', app.active_sessions ?? '–'],
          ['Aktive Nutzer', app.active_users ?? '–'],
        ];
        ar.innerHTML = rows.map(([k,v]) => `
          <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px;">
            <span style="color:var(--text-muted);">${k}</span>
            <span style="font-weight:600;">${v}</span>
          </div>`).join('');
      }

      // DB table counts
      const dr = document.getElementById('sysmon-db-rows');
      if (dr) {
        const icons = {users:'👤',sessions:'🔐',alerts:'🚨',incidents:'🔴',fleet_vehicles:'🚗',
          fleet_trips:'🗺️',assets:'📦',sensors:'📡',chat_messages:'💬',audit_log:'📋',
          push_subscriptions:'🔔',geo_fences:'🗺️'};
        dr.innerHTML = Object.entries(tbls).map(([t,c]) => `
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:12px;">
            <span style="color:var(--text-muted);">${icons[t]||'🗄️'} ${t}</span>
            <span style="font-weight:600;">${c ?? '–'}</span>
          </div>`).join('');
      }

      // Platform
      const pr2 = document.getElementById('sysmon-platform-rows');
      if (pr2) {
        const prows = [
          ['Hostname', plt.hostname || '–'],
          ['OS', `${plt.os} ${plt.os_version}`],
          ['Architektur', plt.arch || '–'],
          ['Python', plt.python_version || '–'],
          ['App', `${plt.app_name} v${plt.app_version}`],
        ];
        pr2.innerHTML = prows.map(([k,v]) => `
          <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px;">
            <span style="color:var(--text-muted);">${k}</span>
            <span style="font-weight:600;font-family:var(--font-mono,monospace);">${v}</span>
          </div>`).join('');
      }

      // Sparklines
      const cpuHist = this._history.map(s => s.cpu_pct ?? 0);
      const memHist = this._history.map(s => s.mem_pct ?? 0);
      this._drawSparkline('sysmon-cpu-spark', cpuHist, '#60a5fa');
      this._drawSparkline('sysmon-mem-spark', memHist, '#34d399');
      this._drawHistoryChart(this._history);

    } catch(e) {
      const lu = document.getElementById('sysmon-last-update');
      if (lu) lu.textContent = '⚠️ Fehler: ' + e.message;
    }
  }
};

// ============================================================
// Rate Limit Analytics Page
// ============================================================
ATLAS.rateLimitPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">⚡ Rate Limit Analytics</h2>
      <button class="btn btn-secondary btn-sm" onclick="ATLAS.rateLimitPage.load()">🔄 Aktualisieren</button></div>
      <div id="rl-content"></div>`;
    await this.load();
  },
  async load() {
    try {
      const d = await ATLAS.api.get('/api/analytics/rate-limits');
      const el = document.getElementById('rl-content');
      if (!el) return;
      el.innerHTML = `
        <div class="card" style="margin-bottom:16px;">
          <div class="card-title">📊 Top Endpoints (letzte 24h) – gesamt ${d.total_24h} Treffer</div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
            ${d.by_endpoint.map(r => {
              const pct = d.total_24h > 0 ? Math.round(r.hits/d.total_24h*100) : 0;
              return `<div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
                  <span style="font-family:var(--font-mono);">${r.endpoint}</span>
                  <span>${r.hits} (${pct}%)</span>
                </div>
                <div style="height:6px;background:var(--bg-secondary);border-radius:3px;">
                  <div style="height:6px;width:${pct}%;background:var(--accent);border-radius:3px;transition:.3s;"></div>
                </div>
              </div>`;
            }).join('') || '<span style="color:var(--text-muted);">Keine Daten</span>'}
          </div>
        </div>
        <div class="card">
          <div class="card-title">🕐 Stundliche Verteilung</div>
          <div style="display:flex;align-items:flex-end;gap:4px;height:80px;margin-top:8px;">
            ${d.by_hour.map(h => {
              const max = Math.max(...d.by_hour.map(x => x.hits), 1);
              const pct = Math.round(h.hits/max*100);
              return `<div title="${h.hour}:00 – ${h.hits} Treffer" style="flex:1;background:var(--accent);border-radius:2px 2px 0 0;height:${pct}%;min-height:2px;opacity:.8;"></div>`;
            }).join('') || '<span style="color:var(--text-muted);">Keine Daten</span>'}
          </div>
        </div>`;
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'danger'); }
  }
};

// ============================================================
// AI Predictions Page
// ============================================================
ATLAS.predictionsPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">🤖 KI Ressourcenprognose</h2>
      <button class="btn btn-secondary btn-sm" onclick="ATLAS.predictionsPage.load()">🔄 Neu berechnen</button></div>
      <div id="pred-content"></div>`;
    await this.load();
  },
  async load() {
    try {
      const d = await ATLAS.api.get('/api/analytics/predictions');
      const el = document.getElementById('pred-content');
      if (!el) return;
      el.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div class="card">
            <div class="card-title">⏰ Spitzenstunden (Alarme)</div>
            ${d.peak_alert_hours.length ? d.peak_alert_hours.map(h => `<div class="badge badge-warning" style="margin:2px;">${h}:00 Uhr</div>`).join('') : '<span style="color:var(--text-muted);font-size:12px;">Zu wenig Daten</span>'}
          </div>
          <div class="card">
            <div class="card-title">📅 Spitzentage (Einsätze)</div>
            ${d.peak_incident_days.length ? d.peak_incident_days.map(d => `<div class="badge badge-info" style="margin:2px;">${d}</div>`).join('') : '<span style="color:var(--text-muted);font-size:12px;">Zu wenig Daten</span>'}
          </div>
        </div>
        <div class="card" style="margin-bottom:16px;">
          <div class="card-title">💡 Empfehlungen</div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
            ${d.recommendations.map(r => `<div style="display:flex;gap:8px;align-items:flex-start;"><span>•</span><span style="font-size:13px;">${r}</span></div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-title">🚗 Fahrzeugauslastung (letzte 30 Tage)</div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
            ${d.vehicle_utilization.map(v => {
              const max = Math.max(...d.vehicle_utilization.map(x=>x.trips), 1);
              const pct = Math.round(v.trips/max*100);
              return `<div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="min-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ATLAS.ui.esc(v.name)}</span>
                <div style="flex:1;height:8px;background:var(--bg-secondary);border-radius:4px;">
                  <div style="height:8px;width:${pct}%;background:var(--accent);border-radius:4px;"></div>
                </div>
                <span style="min-width:30px;text-align:right;">${v.trips}</span>
              </div>`;
            }).join('') || '<span style="color:var(--text-muted);">Keine Fahrzeugdaten</span>'}
          </div>
          <div style="margin-top:12px;font-size:11px;color:var(--text-muted);">Modell: ${d.model} | Konfidenz: ${d.confidence}</div>
        </div>`;
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'danger'); }
  }
};

// ============================================================
// Federation Sync Monitoring Page
// ============================================================
ATLAS.fedSyncPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">🔄 Federation Sync Monitor</h2>
      <button class="btn btn-secondary btn-sm" onclick="ATLAS.fedSyncPage.load()">🔄 Prüfen</button></div>
      <div id="fs-content"></div>`;
    await this.load();
  },
  async load() {
    const el = document.getElementById('fs-content');
    if (el) el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);">Prüfe Verbindungen…</div>';
    try {
      const d = await ATLAS.api.get('/api/federation/sync-status');
      if (!el) return;
      if (!d.peers.length) {
        el.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);">Keine Federation-Peers konfiguriert.</div>';
        return;
      }
      el.innerHTML = `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Geprüft um: ${d.checked_at?.substring(11,19)}</div>
        <div class="card-grid">
          ${d.peers.map(p => `
            <div class="card">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:20px;">${p.online ? '🟢' : '🔴'}</span>
                <span class="card-title" style="margin:0;">${p.name}</span>
              </div>
              <div style="font-size:12px;color:var(--text-muted);">
                URL: ${p.url}<br>
                Status: <strong style="color:${p.online ? 'var(--success)' : 'var(--danger)'};">${p.online ? 'Online' : 'Offline'}</strong><br>
                Zuletzt gesehen: ${p.last_seen?.substring(0,10) || '–'}
              </div>
            </div>`).join('')}
        </div>`;
    } catch(e) { if (el) el.innerHTML = `<div class="card" style="color:var(--danger);">Fehler: ${e.message}</div>`; }
  }
};

// ============================================================
// Realtime KPI Charts Page
// ============================================================
ATLAS.kpiChartsPage = {
  _interval: null,
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">📈 Realtime KPI Charts</h2>
      <button class="btn btn-secondary btn-sm" onclick="ATLAS.kpiChartsPage.load()">🔄 Aktualisieren</button></div>
      <div id="kpi-content"></div>`;
    await this.load();
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(() => { if (document.getElementById('kpi-content')) this.load(); else clearInterval(this._interval); }, 30000);
  },
  async load() {
    try {
      const [health, rl, pred] = await Promise.all([
        ATLAS.api.get('/api/system/health/detailed').catch(()=>({})),
        ATLAS.api.get('/api/analytics/rate-limits').catch(()=>({total_24h:0, by_hour:[]})),
        ATLAS.api.get('/api/analytics/predictions').catch(()=>({vehicle_utilization:[]})),
      ]);
      const el = document.getElementById('kpi-content');
      if (!el) return;

      const kpis = [
        { label: 'WS Verbindungen', val: health.websocket_connections ?? 0, icon: '🔌', color: 'var(--info)' },
        { label: 'Aktive Sessions', val: health.active_sessions ?? 0, icon: '👤', color: 'var(--accent)' },
        { label: 'Aktive Alarme', val: health.active_alerts ?? 0, icon: '🚨', color: 'var(--danger)' },
        { label: 'Aktive Einsätze', val: health.active_incidents ?? 0, icon: '🚒', color: 'var(--warning)' },
        { label: 'Rate Limit Hits 24h', val: rl.total_24h ?? 0, icon: '⚡', color: 'var(--warning)' },
        { label: 'Freier Speicher', val: health.disk_free_mb ? Math.round(health.disk_free_mb) + ' MB' : '–', icon: '💽', color: 'var(--success)' },
      ];

      el.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:20px;">
          ${kpis.map(k => `<div class="card" style="text-align:center;">
            <div style="font-size:28px;">${k.icon}</div>
            <div style="font-size:24px;font-weight:800;color:${k.color};margin:4px 0;">${k.val}</div>
            <div style="font-size:11px;color:var(--text-muted);">${k.label}</div>
          </div>`).join('')}
        </div>
        <div class="card">
          <div class="card-title">📊 API-Traffic (letzte 24h, nach Stunde)</div>
          <div style="display:flex;align-items:flex-end;gap:3px;height:100px;margin-top:12px;">
            ${Array.from({length:24},(_,i)=>{
              const h = rl.by_hour?.find(x=>+x.hour===i);
              const max = Math.max(...(rl.by_hour?.map(x=>+x.hits)||[1]),1);
              const pct = h ? Math.round(+h.hits/max*100) : 0;
              return `<div title="${i}:00 – ${h?.hits||0} Hits" style="flex:1;background:${pct>80?'var(--danger)':pct>50?'var(--warning)':'var(--accent)'};border-radius:2px 2px 0 0;height:${Math.max(pct,2)}%;opacity:.85;cursor:help;"></div>`;
            }).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:4px;"><span>00:00</span><span>12:00</span><span>23:00</span></div>
        </div>`;
    } catch(e) { ATLAS.ui.toast('KPI Fehler: ' + e.message, 'danger'); }
  }
};

// ============================================================
// Automated Reports Page (PDF/CSV Export)
// ============================================================
ATLAS.autoReportsPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header"><h2 class="page-title">📄 Automatisierte Reports</h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
        ${[
          ['📊 Einsatz-Report (CSV)', 'incidents'],
          ['🚨 Alarm-Report (CSV)', 'alerts'],
          ['🚗 Fuhrpark-Report (CSV)', 'fleet'],
          ['📡 Sensor-Report (CSV)', 'sensors'],
          ['👥 Nutzer-Report (CSV)', 'users'],
          ['📋 Audit-Log (CSV)', 'audit'],
        ].map(([label, type]) => `
          <div class="card">
            <div class="card-title">${label}</div>
            <div class="form-group" style="margin-top:8px;">
              <label class="form-label" style="font-size:11px;">Zeitraum</label>
              <div style="display:flex;gap:8px;">
                <input id="ar-from-${type}" class="form-input" type="date" value="${new Date(Date.now()-30*86400000).toISOString().substring(0,10)}" style="font-size:12px;">
                <input id="ar-to-${type}" class="form-input" type="date" value="${new Date().toISOString().substring(0,10)}" style="font-size:12px;">
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.autoReportsPage.download('${type}')">📥 Export</button>
          </div>`).join('')}
      </div>`;
  },
  async download(type) {
    const from = document.getElementById(`ar-from-${type}`)?.value || '';
    const to = document.getElementById(`ar-to-${type}`)?.value || '';
    try {
      const data = await ATLAS.api.get(`/api/export/${type}?format=csv&from=${from}&to=${to}`);
      // data may be raw CSV text or JSON – handle both
      const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      const ext = typeof data === 'string' ? 'csv' : 'json';
      const blob = new Blob([content], {type: `text/${ext}`});
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `cchq_${type}_${from}_${to}.${ext}`; a.click();
      ATLAS.ui.toast('Export gestartet', 'success');
    } catch(e) {
      // Fallback – export what we have
      ATLAS.ui.toast('Export: ' + (e.message || 'Fehler'), 'warning');
    }
  }
};

// ============================================================
// INVENTORY & DEVICE MANAGEMENT PAGE
// ============================================================
ATLAS.inventoryPage = {
  _items: [], _categories: [], _warehouses: [], _tab: 'items',
  async render(el) {
    el.innerHTML = `<div class="page-header">
      <h2 class="page-title">📦 Lagerverwaltung</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;" id="inv-header-actions"></div>
    </div>
    <div class="tab-bar" style="display:flex;gap:4px;margin-bottom:20px;background:var(--bg-card);padding:4px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
      ${['items','warehouses','orders','checkouts'].map(t=>`<button class="btn btn-sm inv-tab-btn ${this._tab===t?'btn-primary':''}" data-tab="${t}" onclick="ATLAS.inventoryPage.switchTab('${t}')">${{items:'📦 Artikel',warehouses:'🏭 Lager',orders:'🛒 Bestellungen',checkouts:'📤 Ausgaben'}[t]}</button>`).join('')}
    </div>
    <div id="inv-tab-content"></div>`;
    await this.switchTab(this._tab, true);
  },

  async switchTab(tab, force) {
    if (this._tab === tab && !force) return;
    this._tab = tab;
    document.querySelectorAll('.inv-tab-btn').forEach(b => b.classList.toggle('btn-primary', b.dataset.tab === tab));
    const content = document.getElementById('inv-tab-content');
    const actions = document.getElementById('inv-header-actions');
    if (!content) return;
    if (tab === 'items') {
      actions.innerHTML = `
        <input id="inv-search" class="form-input" style="width:200px;" placeholder="Suchen…" oninput="ATLAS.inventoryPage.search(this.value)">
        <select id="inv-cat-filter" class="form-input" style="width:150px;" onchange="ATLAS.inventoryPage.filterCat(this.value)">
          <option value="">Alle Kategorien</option>
        </select>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.showAdd()">+ Artikel</button>`;
      content.innerHTML = `<div id="inv-stats" style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;"></div><div id="inv-list"></div>`;
      await this.load();
    } else if (tab === 'warehouses') {
      actions.innerHTML = `<button class="btn btn-primary" onclick="ATLAS.inventoryPage.showAddWarehouse()">+ Lager</button>`;
      content.innerHTML = `<div id="wh-list"><div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">Lade…</div></div>`;
      await this.loadWarehouses();
    } else if (tab === 'orders') {
      actions.innerHTML = `
        <select id="ord-status-filter" class="form-input" style="width:150px;" onchange="ATLAS.inventoryPage.loadOrders()">
          <option value="">Alle Status</option>
          <option value="pending">Ausstehend</option>
          <option value="approved">Genehmigt</option>
          <option value="ordered">Bestellt</option>
          <option value="received">Erhalten</option>
          <option value="cancelled">Storniert</option>
        </select>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.showAddOrder()">+ Bestellung</button>`;
      content.innerHTML = `<div id="ord-list"><div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">Lade…</div></div>`;
      await this.loadOrders();
    } else if (tab === 'checkouts') {
      actions.innerHTML = `<button class="btn btn-primary" onclick="ATLAS.inventoryPage.showCheckout()">📤 Ausgabe</button>`;
      content.innerHTML = `<div id="co-list"><div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">Wähle einen Artikel aus der Artikelliste</div></div>`;
    }
  },

  // ─── ITEMS TAB ────────────────────────────────────────────────
  async load() {
    try {
      const [data, wh] = await Promise.all([
        ATLAS.api.get('/api/inventory'),
        ATLAS.api.get('/api/inventory/warehouses').catch(()=>({warehouses:[]}))
      ]);
      this._items = data.items || [];
      this._categories = data.categories || [];
      this._warehouses = wh.warehouses || [];
      this.renderCats();
      this.renderList(this._items);
      this.renderStats();
    } catch(e) { ATLAS.ui.toast('Ladefehler: ' + e.message, 'error'); }
  },
  renderStats() {
    const el = document.getElementById('inv-stats');
    if (!el) return;
    const total = this._items.length;
    const available = this._items.filter(i=>i.status==='available').length;
    const low = this._items.filter(i=>i.quantity <= i.min_quantity && i.min_quantity > 0).length;
    el.innerHTML = [['📦 Gesamt',total,'var(--accent)'],['✅ Verfügbar',available,'var(--success)'],['⚠️ Niedrig',low,low>0?'var(--warning)':'var(--text-muted)']].map(([l,v,c])=>`<div class="card" style="padding:10px 16px;display:flex;align-items:center;gap:10px;"><div style="font-size:20px;">${l.split(' ')[0]}</div><div><div style="font-size:20px;font-weight:700;color:${c};">${v}</div><div style="font-size:11px;color:var(--text-muted);">${l.split(' ').slice(1).join(' ')}</div></div></div>`).join('');
  },
  renderCats() {
    const sel = document.getElementById('inv-cat-filter');
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">Alle Kategorien</option>' + this._categories.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join('');
  },
  renderList(items) {
    const el = document.getElementById('inv-list');
    if (!el) return;
    if (!items.length) { el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">📦 Keine Artikel</div>'; return; }
    el.innerHTML = `<div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>Name</th><th>Kategorie</th><th>Seriennr. / Teile-Nr.</th><th>Asset-Nr.</th><th>Lager</th><th>Status</th><th>Menge</th><th></th></tr></thead><tbody>
      ${items.map(i=>`<tr>
        <td><strong>${i.name}</strong>${i.model_number?`<div style="font-size:11px;color:var(--text-muted);">Modell: ${i.model_number}</div>`:''}</td>
        <td><span style="background:var(--surface-2);padding:2px 8px;border-radius:20px;font-size:11px;">${i.category}</span></td>
        <td style="font-size:12px;color:var(--text-muted);">${[i.serial_number,i.part_number].filter(Boolean).join(' / ')||'–'}</td>
        <td style="font-size:12px;font-family:monospace;">${i.asset_number||'–'}</td>
        <td style="font-size:12px;">${i.warehouse_name||i.location||'–'}</td>
        <td><span class="badge ${i.status==='available'?'badge-success':i.status==='assigned'?'badge-info':'badge-warning'}">${i.status}</span></td>
        <td style="text-align:center;${i.quantity<=i.min_quantity&&i.min_quantity>0?'color:var(--warning);font-weight:700;':''}">${i.quantity}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage.showQR(${i.id},'${i.name.replace(/'/g,"\\'").replace(/"/g,"&quot;")}')">QR</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage.showEdit(${i.id})">✏️</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage.showItemCheckout(${i.id},'${i.name.replace(/'/g,"\\'")}')">📤</button>
          <button class="btn btn-danger btn-sm" onclick="ATLAS.inventoryPage.del(${i.id},'${i.name.replace(/'/g,"\\'").replace(/"/g,"&quot;")}')">🗑</button>
        </td>
      </tr>`).join('')}</tbody></table></div>`;
  },
  search(q) {
    const qL = q.toLowerCase();
    const cat = document.getElementById('inv-cat-filter')?.value || '';
    this.renderList(this._items.filter(i=>(!cat||i.category===cat)&&(!q||i.name.toLowerCase().includes(qL)||(i.description||'').toLowerCase().includes(qL)||(i.serial_number||'').toLowerCase().includes(qL)||(i.asset_number||'').toLowerCase().includes(qL)||(i.location||'').toLowerCase().includes(qL))));
  },
  filterCat(cat) { this.search(document.getElementById('inv-search')?.value||''); },

  _warehouseOptions() {
    return '<option value="">– Kein Lager –</option>' + this._warehouses.map(w=>`<option value="${w.id}">${w.name}</option>`).join('');
  },

  showAdd() {
    const whOpts = this._warehouseOptions();
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neuer Artikel</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <div class="form-group"><label class="form-label">Name *</label><input id="ni-name" class="form-input" placeholder="Laptop, Fahrzeugschlüssel…"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Kategorie</label><input id="ni-cat" class="form-input" value="general"></div>
          <div class="form-group"><label class="form-label">Status</label><select id="ni-status" class="form-input"><option value="available">Verfügbar</option><option value="maintenance">Wartung</option><option value="retired">Außer Betrieb</option></select></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Seriennummer</label><input id="ni-serial" class="form-input" placeholder="optional"></div>
          <div class="form-group"><label class="form-label">Teilenummer</label><input id="ni-part" class="form-input" placeholder="optional"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Modellnummer</label><input id="ni-model" class="form-input" placeholder="optional"></div>
          <div class="form-group"><label class="form-label">Asset-Nummer</label><input id="ni-asset" class="form-input" placeholder="optional, eindeutig"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Lagerort</label><select id="ni-warehouse" class="form-input">${whOpts}</select></div>
          <div class="form-group"><label class="form-label">Standort (Regal etc.)</label><input id="ni-loc" class="form-input" placeholder="Regal A3, Büro 3…"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Menge</label><input id="ni-qty" class="form-input" type="number" value="1" min="0"></div>
          <div class="form-group"><label class="form-label">Mindestmenge (Alarm)</label><input id="ni-minqty" class="form-input" type="number" value="0" min="0"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Kaufdatum</label><input id="ni-date" class="form-input" type="date"></div>
          <div class="form-group"><label class="form-label">Kaufpreis (€)</label><input id="ni-price" class="form-input" type="number" step="0.01" min="0"></div>
        </div>
        <div class="form-group"><label class="form-label">Lieferant</label><input id="ni-supplier" class="form-input"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><textarea id="ni-desc" class="form-input" rows="2"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveAdd()">Erstellen + QR generieren</button>
      </div>`);
  },
  async saveAdd() {
    const name = document.getElementById('ni-name')?.value.trim();
    if (!name) { ATLAS.ui.toast('Name erforderlich', 'warning'); return; }
    try {
      const item = await ATLAS.api.post('/api/inventory', {
        name, category: document.getElementById('ni-cat').value||'general',
        status: document.getElementById('ni-status').value,
        serial_number: document.getElementById('ni-serial').value||null,
        part_number: document.getElementById('ni-part').value||null,
        model_number: document.getElementById('ni-model').value||null,
        asset_number: document.getElementById('ni-asset').value||null,
        warehouse_id: parseInt(document.getElementById('ni-warehouse').value)||null,
        location: document.getElementById('ni-loc').value||null,
        quantity: parseInt(document.getElementById('ni-qty').value)||1,
        min_quantity: parseInt(document.getElementById('ni-minqty').value)||0,
        purchase_date: document.getElementById('ni-date').value||null,
        purchase_price: parseFloat(document.getElementById('ni-price').value)||null,
        supplier: document.getElementById('ni-supplier').value||null,
        description: document.getElementById('ni-desc').value||null,
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Artikel erstellt', 'success'); await this.load();
      if (item.qr_data_uri) this.showQRData(item.name, item.qr_code, item.qr_data_uri);
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async showQR(iid, name) {
    ATLAS.ui.toast('QR wird generiert…', 'info');
    try {
      const data = await ATLAS.api.get(`/api/inventory/${iid}/qr`);
      this.showQRData(name, data.qr_code, data.qr_data_uri);
    } catch(e) { ATLAS.ui.toast('QR Fehler: ' + e.message, 'error'); }
  },
  showQRData(name, qr_code, qr_data_uri) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">QR-Code: ${name}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body" style="text-align:center;">
        ${qr_data_uri&&qr_data_uri.startsWith('data:image')
          ? `<img src="${qr_data_uri}" style="max-width:250px;border-radius:8px;border:4px solid white;box-shadow:0 4px 20px rgba(0,0,0,.3);">`
          : '<div style="padding:40px;color:var(--text-muted);">QR-Code nicht verfügbar.<br><small>pip install qrcode[pil]</small></div>'}
        <div style="margin-top:12px;font-family:monospace;font-size:13px;background:var(--surface-2);padding:8px 12px;border-radius:6px;">${qr_code}</div>
        <p style="font-size:12px;color:var(--text-muted);">Scan mit ControlCenterHQ App</p>
        ${qr_data_uri&&qr_data_uri.startsWith('data:image')?`<button class="btn btn-secondary btn-sm" onclick="const a=document.createElement('a');a.href='${qr_data_uri}';a.download='qr-${qr_code}.png';a.click()">📥 PNG Download</button>`:''}
      </div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
  },
  async showEdit(iid) {
    try {
      const [item, wh] = await Promise.all([
        ATLAS.api.get(`/api/inventory/${iid}`),
        ATLAS.api.get('/api/inventory/warehouses').catch(()=>({warehouses:[]}))
      ]);
      const whOpts = '<option value="">– Kein Lager –</option>' + (wh.warehouses||[]).map(w=>`<option value="${w.id}" ${item.warehouse_id==w.id?'selected':''}>${w.name}</option>`).join('');
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Artikel bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
        <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
          <div class="form-group"><label class="form-label">Name *</label><input id="ei-name" class="form-input" value="${item.name}"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Kategorie</label><input id="ei-cat" class="form-input" value="${item.category}"></div>
            <div class="form-group"><label class="form-label">Status</label><select id="ei-status" class="form-input">
              ${['available','assigned','maintenance','retired'].map(s=>`<option value="${s}" ${item.status===s?'selected':''}>${s}</option>`).join('')}
            </select></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Seriennummer</label><input id="ei-serial" class="form-input" value="${item.serial_number||''}"></div>
            <div class="form-group"><label class="form-label">Teilenummer</label><input id="ei-part" class="form-input" value="${item.part_number||''}"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Modellnummer</label><input id="ei-model" class="form-input" value="${item.model_number||''}"></div>
            <div class="form-group"><label class="form-label">Asset-Nummer</label><input id="ei-asset" class="form-input" value="${item.asset_number||''}"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Lagerort</label><select id="ei-warehouse" class="form-input">${whOpts}</select></div>
            <div class="form-group"><label class="form-label">Standort (Regal etc.)</label><input id="ei-loc" class="form-input" value="${item.location||''}"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Menge</label><input id="ei-qty" class="form-input" type="number" value="${item.quantity}"></div>
            <div class="form-group"><label class="form-label">Mindestmenge</label><input id="ei-minqty" class="form-input" type="number" value="${item.min_quantity}"></div>
          </div>
          <div class="form-group"><label class="form-label">Lieferant</label><input id="ei-supplier" class="form-input" value="${item.supplier||''}"></div>
          <div class="form-group"><label class="form-label">Notizen</label><textarea id="ei-notes" class="form-input" rows="2">${item.notes||''}</textarea></div>
          ${item.transactions?.length?`<div class="form-group"><label class="form-label">Letzte Transaktionen</label><div style="font-size:12px;background:var(--surface-2);padding:8px;border-radius:6px;max-height:120px;overflow-y:auto;">${item.transactions.map(t=>`<div style="padding:4px 0;border-bottom:1px solid var(--border);">${t.ts.substring(0,16)} · ${t.type} · ${t.quantity_change>0?'+':''}${t.quantity_change} · ${t.user_name||'System'}</div>`).join('')}</div></div>`:''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
          <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveEdit(${iid})">Speichern</button>
        </div>`);
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  async saveEdit(iid) {
    try {
      await ATLAS.api.put(`/api/inventory/${iid}`, {
        name: document.getElementById('ei-name').value,
        category: document.getElementById('ei-cat').value||'general',
        status: document.getElementById('ei-status').value,
        serial_number: document.getElementById('ei-serial').value||null,
        part_number: document.getElementById('ei-part').value||null,
        model_number: document.getElementById('ei-model').value||null,
        asset_number: document.getElementById('ei-asset').value||null,
        warehouse_id: parseInt(document.getElementById('ei-warehouse').value)||null,
        location: document.getElementById('ei-loc').value||null,
        quantity: parseInt(document.getElementById('ei-qty').value)||1,
        min_quantity: parseInt(document.getElementById('ei-minqty').value)||0,
        supplier: document.getElementById('ei-supplier').value||null,
        notes: document.getElementById('ei-notes').value||null,
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Aktualisiert', 'success'); await this.load();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async del(iid, name) {
    if (!confirm(`"${name}" löschen?`)) return;
    try { await ATLAS.api.delete(`/api/inventory/${iid}`); ATLAS.ui.toast('Gelöscht', 'success'); await this.load(); }
    catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },

  // ─── WAREHOUSES TAB ───────────────────────────────────────────
  async loadWarehouses() {
    const el = document.getElementById('wh-list');
    if (!el) return;
    try {
      const data = await ATLAS.api.get('/api/inventory/warehouses');
      this._warehouses = data.warehouses || [];
      if (!this._warehouses.length) {
        el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">🏭 Noch keine Lager angelegt</div>'; return;
      }
      el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
        ${this._warehouses.map(w=>`<div class="card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-size:18px;font-weight:700;">🏭 ${w.name}</div>
              ${w.address?`<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">📍 ${w.address}</div>`:''}
              ${w.manager_name?`<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">👤 ${w.manager_name}</div>`:''}
              ${w.description?`<div style="font-size:12px;margin-top:6px;">${w.description}</div>`:''}
            </div>
            <div style="display:flex;gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage.showEditWarehouse(${w.id})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.inventoryPage.delWarehouse(${w.id},'${w.name.replace(/'/g,"\\'")}')">🗑</button>
            </div>
          </div>
        </div>`).join('')}
      </div>`;
    } catch(e) { el.innerHTML = `<div class="card" style="color:var(--danger);padding:20px;">Fehler: ${e.message}</div>`; }
  },
  async _loadUsers() {
    try { const d = await ATLAS.api.get('/api/users'); return d.users||[]; } catch { return []; }
  },
  async showAddWarehouse() {
    const users = await this._loadUsers();
    const uOpts = '<option value="">– Kein Verwalter –</option>' + users.map(u=>`<option value="${u.id}">${u.full_name||u.username}</option>`).join('');
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neues Lager</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name *</label><input id="nw-name" class="form-input" placeholder="Hauptlager, Außenlager Nord…"></div>
        <div class="form-group"><label class="form-label">Adresse</label><input id="nw-addr" class="form-input" placeholder="Musterstr. 1, 12345 Stadt"></div>
        <div class="form-group"><label class="form-label">Lagerverwalter</label><select id="nw-manager" class="form-input">${uOpts}</select></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><textarea id="nw-desc" class="form-input" rows="2"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveAddWarehouse()">Erstellen</button>
      </div>`);
  },
  async saveAddWarehouse() {
    const name = document.getElementById('nw-name')?.value.trim();
    if (!name) { ATLAS.ui.toast('Name erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/inventory/warehouses', {
        name, address: document.getElementById('nw-addr').value||null,
        manager_id: parseInt(document.getElementById('nw-manager').value)||null,
        description: document.getElementById('nw-desc').value||null,
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Lager erstellt', 'success'); await this.loadWarehouses();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async showEditWarehouse(wid) {
    const w = this._warehouses.find(x=>x.id===wid);
    if (!w) return;
    const users = await this._loadUsers();
    const uOpts = '<option value="">– Kein Verwalter –</option>' + users.map(u=>`<option value="${u.id}" ${u.id==w.manager_id?'selected':''}>${u.full_name||u.username}</option>`).join('');
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Lager bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name *</label><input id="ew-name" class="form-input" value="${w.name}"></div>
        <div class="form-group"><label class="form-label">Adresse</label><input id="ew-addr" class="form-input" value="${w.address||''}"></div>
        <div class="form-group"><label class="form-label">Lagerverwalter</label><select id="ew-manager" class="form-input">${uOpts}</select></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><textarea id="ew-desc" class="form-input" rows="2">${w.description||''}</textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveEditWarehouse(${wid})">Speichern</button>
      </div>`);
  },
  async saveEditWarehouse(wid) {
    try {
      await ATLAS.api.put(`/api/inventory/warehouses/${wid}`, {
        name: document.getElementById('ew-name').value,
        address: document.getElementById('ew-addr').value||null,
        manager_id: parseInt(document.getElementById('ew-manager').value)||null,
        description: document.getElementById('ew-desc').value||null,
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Aktualisiert', 'success'); await this.loadWarehouses();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async delWarehouse(wid, name) {
    if (!confirm(`Lager "${name}" löschen?`)) return;
    try { await ATLAS.api.delete(`/api/inventory/warehouses/${wid}`); ATLAS.ui.toast('Gelöscht', 'success'); await this.loadWarehouses(); }
    catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },

  // ─── ORDERS TAB ───────────────────────────────────────────────
  async loadOrders() {
    const el = document.getElementById('ord-list');
    if (!el) return;
    const status = document.getElementById('ord-status-filter')?.value || '';
    try {
      const data = await ATLAS.api.get('/api/inventory/orders' + (status ? `?status=${status}` : ''));
      const orders = data.orders || [];
      if (!orders.length) { el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">🛒 Keine Bestellungen gefunden</div>'; return; }
      const statusBadge = s => ({pending:'badge-warning',approved:'badge-info',ordered:'badge-primary',received:'badge-success',cancelled:'badge-danger'}[s]||'badge-secondary');
      const statusLabel = s => ({pending:'Ausstehend',approved:'Genehmigt',ordered:'Bestellt',received:'Erhalten',cancelled:'Storniert'}[s]||s);
      el.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;">
        ${orders.map(o=>`<div class="card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                <strong style="font-size:15px;">${o.title}</strong>
                <span class="badge ${statusBadge(o.status)}">${statusLabel(o.status)}</span>
                ${o.priority==='urgent'?'<span class="badge badge-danger">🚨 Dringend</span>':o.priority==='high'?'<span class="badge badge-warning">⬆️ Hoch</span>':''}
              </div>
              <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--text-muted);">
                ${o.warehouse_name?`<span>🏭 ${o.warehouse_name}</span>`:''}
                ${o.supplier?`<span>🏢 ${o.supplier}</span>`:''}
                ${o.estimated_cost?`<span>💶 ${o.estimated_cost}€</span>`:''}
                ${o.requester_name?`<span>👤 ${o.requester_name}</span>`:''}
                <span>📅 ${o.created_at?.substring(0,10)||'–'}</span>
              </div>
              ${o.description?`<div style="font-size:12px;margin-top:6px;">${o.description}</div>`:''}
              ${o.items_json&&o.items_json!=='[]'?`<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Artikel: ${(() => { try { return JSON.parse(o.items_json).map(i=>`${i.name} (${i.quantity})`).join(', '); } catch { return o.items_json; } })()}</div>`:''}
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;min-width:fit-content;">
              ${o.status==='pending'?`<button class="btn btn-primary btn-sm" onclick="ATLAS.inventoryPage.approveOrder(${o.id})">✅ Genehmigen</button>`:''}
              ${o.status==='approved'||o.status==='ordered'?`<button class="btn btn-success btn-sm" onclick="ATLAS.inventoryPage.receiveOrder(${o.id})">📦 Eingelagert</button>`:''}
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage.editOrder(${o.id})">✏️ Bearbeiten</button>
            </div>
          </div>
        </div>`).join('')}
      </div>`;
    } catch(e) { el.innerHTML = `<div class="card" style="color:var(--danger);padding:20px;">Fehler: ${e.message}</div>`; }
  },
  async showAddOrder() {
    const [wh, items] = await Promise.all([
      ATLAS.api.get('/api/inventory/warehouses').catch(()=>({warehouses:[]})),
      ATLAS.api.get('/api/inventory').catch(()=>({items:[]}))
    ]);
    const warehouses = wh.warehouses || [];
    const invItems = items.items || [];
    const whOpts = '<option value="">– Kein Lager –</option>' + warehouses.map(w=>`<option value="${w.id}">${w.name}</option>`).join('');
    const itemOpts = '<option value="">– Artikel wählen –</option>' + invItems.map(i=>`<option value="${i.id}" data-name="${i.name}">${i.name}</option>`).join('');
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neue Bestellung</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <div class="form-group"><label class="form-label">Titel *</label><input id="no-title" class="form-input" placeholder="Büromaterial Q2…"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><textarea id="no-desc" class="form-input" rows="2"></textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Priorität</label><select id="no-prio" class="form-input">
            <option value="normal">Normal</option><option value="high">Hoch</option><option value="urgent">Dringend</option>
          </select></div>
          <div class="form-group"><label class="form-label">Ziellager</label><select id="no-wh" class="form-input">${whOpts}</select></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Lieferant</label><input id="no-supplier" class="form-input" placeholder="Firma GmbH…"></div>
          <div class="form-group"><label class="form-label">Geschätzte Kosten (€)</label><input id="no-cost" class="form-input" type="number" step="0.01" min="0"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Artikel hinzufügen</label>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <select id="no-item-sel" class="form-input" style="flex:1;">${itemOpts}</select>
            <input id="no-item-qty" class="form-input" type="number" min="1" value="1" style="width:70px;" placeholder="Menge">
            <input id="no-item-note" class="form-input" placeholder="Notiz" style="width:100px;">
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage._addOrderItem()">+</button>
          </div>
          <div id="no-items-list" style="font-size:12px;background:var(--surface-2);padding:8px;border-radius:6px;min-height:40px;"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveAddOrder()">Bestellung erstellen</button>
      </div>`);
    this._orderItems = [];
    this._renderOrderItems();
  },
  _orderItems: [],
  _addOrderItem() {
    const sel = document.getElementById('no-item-sel');
    const qty = parseInt(document.getElementById('no-item-qty')?.value)||1;
    const note = document.getElementById('no-item-note')?.value||'';
    if (!sel?.value) { ATLAS.ui.toast('Bitte Artikel auswählen', 'warning'); return; }
    const opt = sel.options[sel.selectedIndex];
    this._orderItems.push({ item_id: parseInt(sel.value), name: opt.dataset.name||opt.text, quantity: qty, note });
    this._renderOrderItems();
  },
  _renderOrderItems() {
    const el = document.getElementById('no-items-list');
    if (!el) return;
    if (!this._orderItems.length) { el.innerHTML = '<span style="color:var(--text-muted);">Noch keine Artikel hinzugefügt</span>'; return; }
    el.innerHTML = this._orderItems.map((it,i)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid var(--border);">
      <span>${it.name} × ${it.quantity}${it.note?' – '+it.note:''}</span>
      <button class="btn btn-danger btn-sm" style="padding:1px 6px;" onclick="ATLAS.inventoryPage._removeOrderItem(${i})">✕</button>
    </div>`).join('');
  },
  _removeOrderItem(idx) { this._orderItems.splice(idx,1); this._renderOrderItems(); },
  async saveAddOrder() {
    const title = document.getElementById('no-title')?.value.trim();
    if (!title) { ATLAS.ui.toast('Titel erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/inventory/orders', {
        title, description: document.getElementById('no-desc').value||null,
        priority: document.getElementById('no-prio').value,
        warehouse_id: parseInt(document.getElementById('no-wh').value)||null,
        supplier: document.getElementById('no-supplier').value||null,
        estimated_cost: parseFloat(document.getElementById('no-cost').value)||null,
        items_json: JSON.stringify(this._orderItems),
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Bestellung erstellt', 'success'); await this.loadOrders();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async approveOrder(oid) {
    if (!confirm('Bestellung genehmigen?')) return;
    try { await ATLAS.api.post(`/api/inventory/orders/${oid}/approve`, {}); ATLAS.ui.toast('Genehmigt', 'success'); await this.loadOrders(); }
    catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async receiveOrder(oid) {
    if (!confirm('Bestellung als eingegangen markieren? Lagerbestände werden automatisch aktualisiert.')) return;
    try { await ATLAS.api.post(`/api/inventory/orders/${oid}/receive`, {}); ATLAS.ui.toast('Eingelagert – Bestände aktualisiert', 'success'); await this.loadOrders(); }
    catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async editOrder(oid) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Bestellung bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Status</label><select id="eo-status" class="form-input">
          <option value="pending">Ausstehend</option><option value="approved">Genehmigt</option>
          <option value="ordered">Bestellt</option><option value="received">Erhalten</option><option value="cancelled">Storniert</option>
        </select></div>
        <div class="form-group"><label class="form-label">Tatsächliche Kosten (€)</label><input id="eo-cost" class="form-input" type="number" step="0.01" min="0"></div>
        <div class="form-group"><label class="form-label">Tracking-Nummer</label><input id="eo-tracking" class="form-input"></div>
        <div class="form-group"><label class="form-label">Notizen</label><textarea id="eo-notes" class="form-input" rows="2"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveEditOrder(${oid})">Speichern</button>
      </div>`);
  },
  async saveEditOrder(oid) {
    try {
      await ATLAS.api.put(`/api/inventory/orders/${oid}`, {
        status: document.getElementById('eo-status').value,
        actual_cost: parseFloat(document.getElementById('eo-cost').value)||null,
        tracking_number: document.getElementById('eo-tracking').value||null,
        notes: document.getElementById('eo-notes').value||null,
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Aktualisiert', 'success'); await this.loadOrders();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },

  // ─── CHECKOUTS TAB ────────────────────────────────────────────
  showCheckout() {
    // Redirect user to items tab with info
    ATLAS.ui.toast('Wähle in der Artikelliste einen Artikel und klicke auf 📤', 'info');
    this.switchTab('items');
  },
  async showItemCheckout(iid, name) {
    const users = await this._loadUsers();
    const uOpts = users.map(u=>`<option value="${u.id}">${u.full_name||u.username}</option>`).join('');
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📤 Ausgabe: ${name}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Empfänger *</label><select id="co-user" class="form-input">${uOpts}</select></div>
        <div class="form-group"><label class="form-label">Menge</label><input id="co-qty" class="form-input" type="number" value="1" min="1"></div>
        <div class="form-group"><label class="form-label">Notizen</label><textarea id="co-notes" class="form-input" rows="2"></textarea></div>
        <div id="co-history" style="margin-top:12px;"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.inventoryPage.saveCheckout(${iid})">📤 Ausgeben</button>
      </div>`);
    // Load history
    try {
      const data = await ATLAS.api.get(`/api/inventory/${iid}/checkout`);
      const checkouts = data.checkouts || [];
      const active = checkouts.filter(c=>c.status==='checked_out');
      if (active.length) {
        document.getElementById('co-history').innerHTML = `<div style="font-size:12px;"><div style="font-weight:600;margin-bottom:6px;">Aktuell ausgegeben:</div>${active.map(c=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--border);">
          <span>${c.person_name||'–'} (${c.quantity}x) seit ${c.checked_out_at?.substring(0,10)||'–'}</span>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.inventoryPage.returnItem(${iid},${c.id})">↩ Zurück</button>
        </div>`).join('')}</div>`;
      }
    } catch(e) {
      const h = document.getElementById('co-history');
      if (h) h.innerHTML = '<div style="font-size:12px;color:var(--text-muted);">Ausgabe-Historie nicht verfügbar</div>';
    }
  },
  async saveCheckout(iid) {
    try {
      await ATLAS.api.post(`/api/inventory/${iid}/checkout`, {
        user_id: parseInt(document.getElementById('co-user').value),
        quantity: parseInt(document.getElementById('co-qty').value)||1,
        notes: document.getElementById('co-notes').value||null,
      });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Ausgegeben', 'success'); await this.load();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async returnItem(iid, checkoutId) {
    if (!confirm('Rückgabe bestätigen?')) return;
    try {
      await ATLAS.api.post(`/api/inventory/${iid}/return`, { checkout_id: checkoutId });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Zurückgegeben', 'success'); await this.load();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
};

// ============================================================
// KNOWLEDGE BASES PAGE
// ============================================================
ATLAS.knowledgePage = {
  _kbId: null,
  async render(el) {
    el.innerHTML = `<div class="page-header">
      <h2 class="page-title">📚 Wissensdatenbank</h2>
      <div style="display:flex;gap:8px;">
        <input id="kb-search" class="form-input" style="width:200px;" placeholder="Suchen…" oninput="ATLAS.knowledgePage.globalSearch(this.value)">
        <button class="btn btn-primary" onclick="ATLAS.knowledgePage.showAddKB()">+ Datenbank</button>
      </div>
    </div>
    <div id="kb-content"></div>`;
    await this.loadKBs();
  },
  async loadKBs() {
    const el = document.getElementById('kb-content');
    if (!el) return;
    try {
      const data = await ATLAS.api.get('/api/knowledge');
      const bases = data.bases || [];
      if (!bases.length) { el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">📚 Noch keine Wissensdatenbanken</div>'; return; }
      el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
        ${bases.map(kb=>`<div class="card" style="border-left:4px solid ${kb.color};cursor:pointer;" onclick="ATLAS.knowledgePage.openKB(${kb.id})">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <span style="font-size:32px;">${kb.icon}</span>
            <div style="flex:1;"><div style="font-weight:700;">${kb.name}</div><div style="font-size:11px;color:var(--text-muted);">${kb.description||''}</div></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:var(--text-muted);">📄 ${kb.article_count} Artikel</span>
            <div style="display:flex;gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();ATLAS.knowledgePage.editKB(${kb.id},'${kb.name.replace(/'/g,"\\'")}','${(kb.description||'').replace(/'/g,"\\'")}','${kb.icon}','${kb.color}','${kb.access_role}')">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();ATLAS.knowledgePage.deleteKB(${kb.id},'${kb.name.replace(/'/g,"\\'")}')">🗑</button>
            </div>
          </div>
        </div>`).join('')}
      </div>`;
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  async openKB(kbId) {
    this._kbId = kbId;
    const el = document.getElementById('kb-content');
    if (!el) return;
    try {
      const data = await ATLAS.api.get(`/api/knowledge/${kbId}/articles`);
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.knowledgePage.loadKBs()">← Zurück</button>
          <h3 style="margin:0;">${data.kb?.icon||'📚'} ${data.kb?.name||''}</h3>
          <button class="btn btn-primary btn-sm" style="margin-left:auto;" onclick="ATLAS.knowledgePage.showAddArticle(${kbId})">+ Artikel</button>
        </div>
        <input class="form-input" style="width:100%;margin-bottom:12px;" placeholder="Artikel suchen…" oninput="ATLAS.knowledgePage.searchArticles(${kbId},this.value)">
        <div id="kb-articles-list">${this._renderArticleList(data.articles||[], kbId)}</div>`;
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  _renderArticleList(articles, kbId) {
    if (!articles.length) return '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">Noch keine Artikel</div>';
    return `<div style="display:flex;flex-direction:column;gap:8px;">
      ${articles.map(a=>`<div class="card" style="cursor:pointer;${a.pinned?'border-left:3px solid var(--accent);':''}" onclick="ATLAS.knowledgePage.openArticle(${kbId},${a.id})">
        <div style="display:flex;align-items:center;gap:8px;">
          <span>${a.pinned?'📌':'📄'}</span>
          <div style="flex:1;"><strong>${a.title}</strong><div style="font-size:12px;color:var(--text-muted);">${a.author_name||''} · ${a.updated_at?.substring(0,10)||''} · 👁 ${a.views}</div></div>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();ATLAS.knowledgePage.editArticle(${kbId},${a.id})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();ATLAS.knowledgePage.deleteArticle(${kbId},${a.id})">🗑</button>
          </div>
        </div>
      </div>`).join('')}
    </div>`;
  },
  async searchArticles(kbId, q) {
    try {
      const data = await ATLAS.api.get(`/api/knowledge/${kbId}/articles?q=${encodeURIComponent(q)}`);
      const el = document.getElementById('kb-articles-list');
      if (el) el.innerHTML = this._renderArticleList(data.articles||[], kbId);
    } catch(e) {}
  },
  async openArticle(kbId, aid) {
    try {
      const a = await ATLAS.api.get(`/api/knowledge/${kbId}/articles/${aid}`);
      const el = document.getElementById('kb-articles-list');
      if (!el) return;
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.knowledgePage.openKB(${kbId})">← Zurück</button>
          <span style="font-size:18px;font-weight:700;">${a.title}</span>
          <button class="btn btn-secondary btn-sm" style="margin-left:auto;" onclick="ATLAS.knowledgePage.editArticle(${kbId},${aid})">✏️ Bearbeiten</button>
        </div>
        <div class="card">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">${a.author_name||''} · ${a.updated_at?.substring(0,10)||''} · 👁 ${a.views} ${a.pinned?'· 📌':''}</div>
          <div style="white-space:pre-wrap;line-height:1.7;">${a.content}</div>
          ${a.tags&&a.tags!=='[]'?`<div style="margin-top:16px;">${(JSON.parse(a.tags)||[]).map(t=>`<span style="background:var(--accent);color:white;padding:2px 8px;border-radius:10px;font-size:11px;margin-right:4px;">${t}</span>`).join('')}</div>`:''}
        </div>`;
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  showAddArticle(kbId) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neuer Artikel</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Titel *</label><input id="na-title" class="form-input"></div>
        <div class="form-group"><label class="form-label">Inhalt</label><textarea id="na-content" class="form-input" rows="10" style="font-family:monospace;" placeholder="Text, Anweisungen, Markdown…"></textarea></div>
        <div class="form-group"><label class="form-label">Tags (kommagetrennt)</label><input id="na-tags" class="form-input" placeholder="SOP, Sicherheit, Fuhrpark"></div>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="na-pinned"> Anpinnen</label>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.knowledgePage.saveArticle(${kbId})">Erstellen</button>
      </div>`);
  },
  async saveArticle(kbId) {
    const title = document.getElementById('na-title')?.value.trim();
    if (!title) { ATLAS.ui.toast('Titel erforderlich', 'warning'); return; }
    const tags = (document.getElementById('na-tags')?.value||'').split(',').map(t=>t.trim()).filter(Boolean);
    try {
      await ATLAS.api.post(`/api/knowledge/${kbId}/articles`, { title, content: document.getElementById('na-content')?.value||'', tags, pinned: document.getElementById('na-pinned')?.checked||false });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Artikel erstellt', 'success'); await this.openKB(kbId);
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async editArticle(kbId, aid) {
    try {
      const a = await ATLAS.api.get(`/api/knowledge/${kbId}/articles/${aid}`);
      const tags = JSON.parse(a.tags||'[]').join(', ');
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Artikel bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Titel *</label><input id="ea-title" class="form-input" value="${a.title}"></div>
          <div class="form-group"><label class="form-label">Inhalt</label><textarea id="ea-content" class="form-input" rows="10" style="font-family:monospace;">${a.content}</textarea></div>
          <div class="form-group"><label class="form-label">Tags</label><input id="ea-tags" class="form-input" value="${tags}"></div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="ea-pinned" ${a.pinned?'checked':''}> Anpinnen</label>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
          <button class="btn btn-primary" onclick="ATLAS.knowledgePage.updateArticle(${kbId},${aid})">Speichern</button>
        </div>`);
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  async updateArticle(kbId, aid) {
    const tags = (document.getElementById('ea-tags')?.value||'').split(',').map(t=>t.trim()).filter(Boolean);
    try {
      await ATLAS.api.put(`/api/knowledge/${kbId}/articles/${aid}`, { title: document.getElementById('ea-title')?.value, content: document.getElementById('ea-content')?.value, tags, pinned: document.getElementById('ea-pinned')?.checked?1:0 });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Gespeichert', 'success'); await this.openKB(kbId);
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async deleteArticle(kbId, aid) {
    if (!confirm('Artikel löschen?')) return;
    try { await ATLAS.api.delete(`/api/knowledge/${kbId}/articles/${aid}`); ATLAS.ui.toast('Gelöscht', 'success'); await this.openKB(kbId); } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },
  async globalSearch(q) {
    if (!q || q.length < 2) { await this.loadKBs(); return; }
    const el = document.getElementById('kb-content');
    if (!el) return;
    try {
      const data = await ATLAS.api.get(`/api/knowledge/search?q=${encodeURIComponent(q)}`);
      const results = data.results || [];
      el.innerHTML = `<div style="margin-bottom:12px;color:var(--text-muted);">🔍 ${results.length} Ergebnisse</div>
        ${!results.length?'<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">Keine Ergebnisse</div>':
        results.map(r=>`<div class="card" style="margin-bottom:8px;cursor:pointer;" onclick="ATLAS.knowledgePage.openKB(${r.kb_id})">
          <div><strong>${r.icon} ${r.kb_name}</strong> › ${r.title}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${(r.excerpt||'').substring(0,150)}</div>
        </div>`).join('')}`;
    } catch(e) {}
  },
  showAddKB() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neue Wissensdatenbank</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name *</label><input id="nkb-name" class="form-input" placeholder="SOPs, Handbücher…"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><input id="nkb-desc" class="form-input"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Icon</label><input id="nkb-icon" class="form-input" value="📚" maxlength="4"></div>
          <div class="form-group"><label class="form-label">Farbe</label><input id="nkb-color" class="form-input" type="color" value="#4caf7d" style="padding:4px;height:42px;"></div>
          <div class="form-group"><label class="form-label">Zugriff</label><select id="nkb-role" class="form-input"><option value="operator">Operator</option><option value="admin">Admin</option><option value="owner">Owner</option></select></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.knowledgePage.saveKB()">Erstellen</button>
      </div>`);
  },
  async saveKB() {
    const name = document.getElementById('nkb-name')?.value.trim();
    if (!name) { ATLAS.ui.toast('Name erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/knowledge', { name, description: document.getElementById('nkb-desc')?.value||'', icon: document.getElementById('nkb-icon')?.value||'📚', color: document.getElementById('nkb-color')?.value||'#4caf7d', access_role: document.getElementById('nkb-role')?.value||'operator' });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Erstellt', 'success'); await this.loadKBs();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  editKB(id, name, desc, icon, color, role) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Datenbank bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name</label><input id="ekb-name" class="form-input" value="${name}"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><input id="ekb-desc" class="form-input" value="${desc}"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Icon</label><input id="ekb-icon" class="form-input" value="${icon}" maxlength="4"></div>
          <div class="form-group"><label class="form-label">Farbe</label><input id="ekb-color" class="form-input" type="color" value="${color}" style="padding:4px;height:42px;"></div>
          <div class="form-group"><label class="form-label">Zugriff</label><select id="ekb-role" class="form-input"><option value="operator" ${role==='operator'?'selected':''}>Operator</option><option value="admin" ${role==='admin'?'selected':''}>Admin</option><option value="owner" ${role==='owner'?'selected':''}>Owner</option></select></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.knowledgePage.updateKB(${id})">Speichern</button>
      </div>`);
  },
  async updateKB(id) {
    try {
      await ATLAS.api.put(`/api/knowledge/${id}`, { name: document.getElementById('ekb-name')?.value, description: document.getElementById('ekb-desc')?.value, icon: document.getElementById('ekb-icon')?.value, color: document.getElementById('ekb-color')?.value, access_role: document.getElementById('ekb-role')?.value });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Gespeichert', 'success'); await this.loadKBs();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async deleteKB(id, name) {
    if (!confirm(`"${name}" und alle Artikel löschen?`)) return;
    try { await ATLAS.api.delete(`/api/knowledge/${id}`); ATLAS.ui.toast('Gelöscht', 'success'); await this.loadKBs(); } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },
};

// ============================================================
// WORK REQUESTS / PERMISSIONS WORKFLOW PAGE
// ============================================================
ATLAS.requestsPage = {
  async render(el) {
    el.innerHTML = `<div class="page-header">
      <h2 class="page-title">📋 Anfragen & Genehmigungen</h2>
      <div style="display:flex;gap:8px;">
        <select id="req-status-filter" class="form-input" style="width:160px;" onchange="ATLAS.requestsPage.load()">
          <option value="">Alle</option><option value="pending">Ausstehend</option><option value="approved">Genehmigt</option><option value="rejected">Abgelehnt</option><option value="completed">Abgeschlossen</option>
        </select>
        <button class="btn btn-primary" onclick="ATLAS.requestsPage.showCreate()">+ Neue Anfrage</button>
      </div>
    </div>
    <div id="req-list"></div>`;
    await this.load();
  },
  async load() {
    const status = document.getElementById('req-status-filter')?.value || '';
    try {
      const data = await ATLAS.api.get(`/api/requests${status?'?status='+status:''}`);
      const requests = data.requests || [];
      const el = document.getElementById('req-list');
      if (!el) return;
      if (!requests.length) { el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">📋 Keine Anfragen</div>'; return; }
      const sc={pending:'var(--warning)',approved:'var(--success)',rejected:'var(--danger)',completed:'var(--text-muted)',in_progress:'var(--info)'};
      const pc={low:'var(--text-muted)',normal:'var(--accent)',high:'var(--warning)',urgent:'var(--danger)'};
      const isAdmin = ATLAS.state.user?.role==='admin'||ATLAS.state.user?.role==='owner';
      el.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px;">
        ${requests.map(r=>`<div class="card" style="cursor:pointer;" onclick="ATLAS.requestsPage.showDetail(${r.id})">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <strong>${r.title}</strong>
                <span style="font-size:11px;background:${sc[r.status]||'var(--accent)'};color:white;padding:1px 8px;border-radius:10px;">${r.status}</span>
                <span style="font-size:11px;color:${pc[r.priority]||'var(--accent)'};">⬆ ${r.priority}</span>
                <span style="font-size:11px;background:var(--surface-2);padding:1px 6px;border-radius:8px;">${r.type}</span>
              </div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Von: ${r.requester_name||'?'} · ${r.created_at?.substring(0,16)||''}${r.due_date?` · Fällig: ${r.due_date}`:''}</div>
            </div>
            ${r.status==='pending'&&isAdmin?`<div style="display:flex;gap:4px;" onclick="event.stopPropagation()">
              <button class="btn btn-success btn-sm" onclick="ATLAS.requestsPage.approve(${r.id})">✓</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.requestsPage.reject(${r.id})">✗</button>
            </div>`:''}
          </div>
          ${r.description?`<div style="font-size:12px;color:var(--text-muted);margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">${r.description.substring(0,120)}${r.description.length>120?'…':''}</div>`:''}
        </div>`).join('')}
      </div>`;
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  showCreate() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">Neue Anfrage</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Titel *</label><input id="nr-title" class="form-input" placeholder="Zugang zu System XY beantragen…"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Typ</label><select id="nr-type" class="form-input"><option value="general">Allgemein</option><option value="access">Zugang/Berechtigung</option><option value="purchase">Beschaffung</option><option value="maintenance">Wartung</option><option value="leave">Abwesenheit</option><option value="report">Meldung</option></select></div>
          <div class="form-group"><label class="form-label">Priorität</label><select id="nr-prio" class="form-input"><option value="low">Niedrig</option><option value="normal" selected>Normal</option><option value="high">Hoch</option><option value="urgent">Dringend</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">Fälligkeitsdatum</label><input id="nr-due" class="form-input" type="date"></div>
        <div class="form-group"><label class="form-label">Beschreibung</label><textarea id="nr-desc" class="form-input" rows="4" placeholder="Detaillierte Beschreibung…"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.requestsPage.submitCreate()">Einreichen</button>
      </div>`);
  },
  async submitCreate() {
    const title = document.getElementById('nr-title')?.value.trim();
    if (!title) { ATLAS.ui.toast('Titel erforderlich', 'warning'); return; }
    try {
      await ATLAS.api.post('/api/requests', { title, type: document.getElementById('nr-type').value, priority: document.getElementById('nr-prio').value, due_date: document.getElementById('nr-due').value||null, description: document.getElementById('nr-desc').value||'' });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Eingereicht', 'success'); await this.load();
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  async showDetail(rid) {
    try {
      const r = await ATLAS.api.get(`/api/requests/${rid}`);
      const isAdmin = ATLAS.state.user?.role==='admin'||ATLAS.state.user?.role==='owner';
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📋 ${r.title}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div><label class="form-label">Status</label><strong>${r.status}</strong></div>
            <div><label class="form-label">Priorität</label><strong>${r.priority}</strong></div>
            <div><label class="form-label">Typ</label>${r.type}</div>
            <div><label class="form-label">Fällig</label>${r.due_date||'–'}</div>
            <div><label class="form-label">Ersteller</label>${r.requester_name||'–'}</div>
            <div><label class="form-label">Zugewiesen</label>${r.assigned_name||'–'}</div>
          </div>
          ${r.description?`<div class="form-group"><label class="form-label">Beschreibung</label><div style="background:var(--surface-2);padding:10px;border-radius:6px;">${r.description}</div></div>`:''}
          ${r.rejection_reason?`<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);padding:10px;border-radius:6px;margin-bottom:12px;"><strong>Ablehnungsgrund:</strong> ${r.rejection_reason}</div>`:''}
          <div class="form-group">
            <label class="form-label">Kommentare (${r.comments?.length||0})</label>
            <div style="max-height:180px;overflow-y:auto;background:var(--surface-2);border-radius:6px;padding:8px;margin-bottom:8px;">
              ${(r.comments||[]).map(c=>`<div style="padding:6px 0;border-bottom:1px solid var(--border);"><strong>${c.full_name}</strong> <span style="font-size:11px;color:var(--text-muted);">${c.ts?.substring(0,16)}</span><br>${c.content}</div>`).join('')||'<div style="color:var(--text-muted);font-size:13px;">Keine Kommentare</div>'}
            </div>
            <div style="display:flex;gap:8px;">
              <input id="req-comment" class="form-input" placeholder="Kommentar…" style="flex:1;" onkeydown="if(event.key==='Enter')ATLAS.requestsPage.addComment(${rid})">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.requestsPage.addComment(${rid})">Senden</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          ${r.status==='pending'&&isAdmin?`<button class="btn btn-success" onclick="ATLAS.requestsPage.approve(${rid});ATLAS.ui.closeModal()">✓ Genehmigen</button><button class="btn btn-danger" onclick="ATLAS.requestsPage.reject(${rid})">✗ Ablehnen</button>`:''}
          ${r.status!=='completed'&&r.requester_id===ATLAS.state.user?.id?`<button class="btn btn-secondary" onclick="ATLAS.requestsPage.markDone(${rid})">✓ Erledigt</button>`:''}
          <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button>
        </div>`);
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  async addComment(rid) {
    const content = document.getElementById('req-comment')?.value.trim();
    if (!content) return;
    try { await ATLAS.api.post(`/api/requests/${rid}/comments`, { content }); ATLAS.ui.closeModal(); await this.showDetail(rid); } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },
  async approve(rid) {
    if (!confirm('Genehmigen?')) return;
    try { await ATLAS.api.post(`/api/requests/${rid}/approve`, {}); ATLAS.ui.toast('Genehmigt', 'success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },
  reject(rid) {
    const reason = prompt('Ablehnungsgrund:');
    if (reason === null) return;
    ATLAS.api.post(`/api/requests/${rid}/reject`, { reason: reason||'' }).then(()=>{ ATLAS.ui.toast('Abgelehnt','success'); this.load(); }).catch(e=>ATLAS.ui.toast(e.message,'error'));
  },
  async markDone(rid) {
    try { await ATLAS.api.put(`/api/requests/${rid}`, { status: 'completed' }); ATLAS.ui.toast('Erledigt','success'); ATLAS.ui.closeModal(); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

// ============================================================
// RASPBERRY PI NODE MANAGER PAGE
// ============================================================
ATLAS.piManagerPage = {
  _nodes: [],
  _TASKS: ['sensor_polling','alert_relay','backup_agent','access_shield','gps_tracking','camera','audio_monitor','gpio_control','network_monitor'],
  async render(el) {
    el.innerHTML = `<div class="page-header">
      <h2 class="page-title">🍓 Pi-Netzwerk</h2>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary" onclick="ATLAS.piManagerPage.load()">↻ Refresh</button>
        <button class="btn btn-primary" onclick="ATLAS.piManagerPage.showAdd()">+ Pi hinzufügen</button>
      </div>
    </div>
    <div id="pi-nodes-list"></div>
    <div class="card" style="margin-top:20px;">
      <div class="card-title">📖 Setup-Anleitung für neue Pi-Knoten</div>
      <div style="font-size:13px;line-height:1.8;">
        <p><strong>1. Pi vorbereiten:</strong> Raspberry Pi OS Lite + SSH aktivieren</p>
        <p><strong>2.</strong> <code style="background:var(--surface-2);padding:2px 6px;border-radius:4px;">pip3 install requests psutil</code></p>
        <p><strong>3. Heartbeat-Skript</strong> <code>/opt/cchq_agent.py</code>:</p>
        <pre style="background:var(--surface-2);padding:12px;border-radius:6px;overflow-x:auto;font-size:11px;white-space:pre;">import requests, psutil, time
API_KEY = "PI-xxxx..."  # aus dem App kopieren
SERVER  = "http://DEINE_SERVER_IP:8080"
while True:
    try:
        r = requests.post(f"{SERVER}/api/pi/heartbeat",
            headers={"X-Pi-Key": API_KEY},
            json={"cpu_pct": psutil.cpu_percent(),
                  "mem_pct": psutil.virtual_memory().percent,
                  "disk_free_mb": psutil.disk_usage('/').free/1024**2,
                  "temp_c": float(open('/sys/class/thermal/thermal_zone0/temp').read())/1000},
            timeout=10)
        tasks = r.json().get("tasks", [])
    except Exception as e: print(e)
    time.sleep(30)</pre>
        <p><strong>4. Autostart:</strong> <code style="background:var(--surface-2);padding:2px 6px;border-radius:4px;">@reboot python3 /opt/cchq_agent.py &amp;</code> via crontab</p>
        <p><strong>Backup-Pi:</strong> Als Backup markieren → startet automatisch wenn Hauptserver offline geht.</p>
      </div>
    </div>`;
    await this.load();
  },
  async load() {
    try {
      const data = await ATLAS.api.get('/api/pi/nodes');
      this._nodes = data.nodes || [];
      this.renderNodes();
    } catch(e) { ATLAS.ui.toast('Fehler: ' + e.message, 'error'); }
  },
  renderNodes() {
    const el = document.getElementById('pi-nodes-list');
    if (!el) return;
    if (!this._nodes.length) { el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted);">🍓 Noch keine Pi-Knoten registriert</div>'; return; }
    const sc={online:'var(--success)',offline:'var(--danger)',unknown:'var(--text-muted)'};
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;">
      ${this._nodes.map(n=>{
        const tasks = JSON.parse(n.assigned_tasks||'[]');
        return `<div class="card" style="border-left:4px solid ${sc[n.status]||'var(--text-muted)'};">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="font-size:28px;">${n.is_backup?'🛡':'🍓'}</span>
            <div style="flex:1;">
              <div style="font-weight:700;">${n.name} ${n.is_backup?'<span style="font-size:10px;background:var(--warning);color:black;padding:1px 5px;border-radius:8px;">BACKUP</span>':''}</div>
              <div style="font-size:12px;color:var(--text-muted);">${n.hostname}${n.ip?' · '+n.ip:''}</div>
            </div>
            <span style="width:10px;height:10px;border-radius:50%;background:${sc[n.status]||'var(--text-muted)'};" title="${n.status}"></span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:12px;margin-bottom:10px;">
            <div style="text-align:center;background:var(--surface-2);padding:6px;border-radius:6px;"><div style="font-weight:700;font-size:16px;">${n.cpu_pct!=null?n.cpu_pct.toFixed(0)+'%':'–'}</div><div style="color:var(--text-muted);">CPU</div></div>
            <div style="text-align:center;background:var(--surface-2);padding:6px;border-radius:6px;"><div style="font-weight:700;font-size:16px;">${n.mem_pct!=null?n.mem_pct.toFixed(0)+'%':'–'}</div><div style="color:var(--text-muted);">RAM</div></div>
            <div style="text-align:center;background:var(--surface-2);padding:6px;border-radius:6px;"><div style="font-weight:700;font-size:16px;">${n.temp_c!=null?n.temp_c.toFixed(1)+'°':'–'}</div><div style="color:var(--text-muted);">Temp</div></div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">Zuletzt: ${n.last_seen?new Date(n.last_seen).toLocaleString('de'):'Nie'} · ${n.role}</div>
          ${tasks.length?`<div style="margin-bottom:8px;">${tasks.map(t=>`<span style="background:var(--accent);color:white;font-size:10px;padding:2px 6px;border-radius:8px;margin-right:4px;">${t}</span>`).join('')}</div>`:''}
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.piManagerPage.showTasks(${n.id})">📋 Aufgaben</button>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.piManagerPage.showApiKey('${n.api_key}')">🔑 API-Key</button>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.piFailoverPanel.showForNode(${n.id},'${n.name.replace(/'/g,"\\'")}')">🔄 Failover</button>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.piShieldPanel.showForNode(${n.id},'${n.name.replace(/'/g,"\\'")}')">🛡️ Shield</button>
            <button class="btn btn-danger btn-sm" onclick="ATLAS.piManagerPage.del(${n.id},'${n.name.replace(/'/g,"\\'")}')">🗑</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },
  showAdd() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🍓 Pi-Knoten registrieren</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name *</label><input id="np-name" class="form-input" placeholder="Pi-Sensor-1, Backup-Pi…"></div>
        <div class="form-group"><label class="form-label">Hostname *</label><input id="np-host" class="form-input" placeholder="raspberrypi.local, 192.168.1.100"></div>
        <div class="form-group"><label class="form-label">IP-Adresse</label><input id="np-ip" class="form-input" placeholder="192.168.1.100"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Rolle</label><select id="np-role" class="form-input"><option value="sensor">Sensor-Knoten</option><option value="relay">Relay/Gateway</option><option value="backup">Backup-Server</option><option value="access_shield">Zugriffsschutz</option><option value="camera">Kamera</option></select></div>
          <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="np-backup"> Automatisches Backup</label>
            <input id="np-prio" class="form-input" type="number" value="0" min="0" max="10" placeholder="Priorität (0-10)"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.piManagerPage.saveAdd()">Registrieren & API-Key generieren</button>
      </div>`);
  },
  async saveAdd() {
    const name = document.getElementById('np-name')?.value.trim();
    const hostname = document.getElementById('np-host')?.value.trim();
    if (!name||!hostname) { ATLAS.ui.toast('Name und Hostname erforderlich', 'warning'); return; }
    try {
      const node = await ATLAS.api.post('/api/pi/nodes', { name, hostname, ip: document.getElementById('np-ip').value||null, role: document.getElementById('np-role').value, is_backup: document.getElementById('np-backup').checked, backup_priority: parseInt(document.getElementById('np-prio').value)||0 });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Pi registriert', 'success'); await this.load();
      this.showApiKey(node.api_key);
    } catch(e) { ATLAS.ui.toast(e.message||'Fehler', 'error'); }
  },
  showApiKey(apiKey) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🔑 API-Key</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <p style="color:var(--text-muted);font-size:13px;">In das Heartbeat-Skript auf dem Pi eintragen:</p>
        <div style="font-family:monospace;font-size:14px;background:var(--surface-2);padding:14px;border-radius:8px;word-break:break-all;user-select:all;">${apiKey}</div>
        <button class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="navigator.clipboard.writeText('${apiKey}');ATLAS.ui.toast('Kopiert','success')">📋 Kopieren</button>
      </div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">OK</button></div>`);
  },
  showTasks(nid) {
    const node = this._nodes.find(n=>n.id===nid);
    if (!node) return;
    const assigned = JSON.parse(node.assigned_tasks||'[]');
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📋 Aufgaben: ${node.name}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${this._TASKS.map(t=>`<label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px;border-radius:6px;background:var(--surface-2);">
            <input type="checkbox" id="pt-${t}" ${assigned.includes(t)?'checked':''}> ${t}
          </label>`).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
        <button class="btn btn-primary" onclick="ATLAS.piManagerPage.saveTasks(${nid})">Speichern</button>
      </div>`);
  },
  async saveTasks(nid) {
    const tasks = this._TASKS.filter(t=>document.getElementById('pt-'+t)?.checked);
    try { await ATLAS.api.put(`/api/pi/nodes/${nid}`, { assigned_tasks: tasks }); ATLAS.ui.closeModal(); ATLAS.ui.toast('Aufgaben gespeichert','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async del(nid, name) {
    if (!confirm(`"${name}" entfernen?`)) return;
    try { await ATLAS.api.delete(`/api/pi/nodes/${nid}`); ATLAS.ui.toast('Entfernt','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

/* ============================================================
   Infrastructure Scanner Custom Categories Panel
============================================================ */
ATLAS.infraCategoryPanel = {
  _cats: [],
  async showPanel() {
    await this.load();
    ATLAS.ui.showModal(this._renderPanel());
  },
  async load() {
    const r = await ATLAS.api.get('/api/infrastructure/categories');
    this._cats = r.categories || [];
  },
  _renderPanel() {
    const cats = this._cats;
    return `<div class="modal-header"><div class="modal-title">📍 Infra-Kategorien verwalten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
        <button class="btn btn-primary btn-sm" onclick="ATLAS.infraCategoryPanel.showCreate()">+ Neue Kategorie</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${cats.length ? cats.map(c=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface-2);border-radius:8px;border-left:4px solid ${c.color||'#6366f1'};">
            <span style="font-size:20px;">${c.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${c.name}</div>
              <div style="font-size:11px;color:var(--text-muted);">${c.overpass_query ? 'Overpass: '+c.overpass_query.substring(0,60)+'…' : c.custom_type ? 'Custom: '+c.custom_type : 'Kein Query'}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.infraCategoryPanel.showEdit(${c.id})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.infraCategoryPanel.del(${c.id},'${c.name.replace(/'/g,"\\'")}')">🗑️</button>
            </div>
          </div>`).join('') : '<div style="text-align:center;color:var(--text-muted);padding:20px;">Keine Kategorien angelegt</div>'}
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`;
  },
  showCreate() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">➕ Neue Kategorie</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div class="form-group"><label>Name</label><input id="ic-name" class="form-control" placeholder="z.B. Gasabsperrung"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;"><label>Icon (Emoji)</label><input id="ic-icon" class="form-control" value="📍" maxlength="4"></div>
        <div style="flex:1;"><label>Farbe</label><input id="ic-color" type="color" class="form-control" value="#6366f1" style="height:38px;padding:2px;"></div>
      </div>
      <div class="form-group"><label>Overpass-Query Fragment <small style="color:var(--text-muted)">(optional, {radius},{lat},{lng} werden ersetzt)</small></label>
        <textarea id="ic-oq" class="form-control" rows="3" placeholder='node["man_made"="gas_shutoff"](around:{radius},{lat},{lng});'></textarea></div>
      <div class="form-group"><label>OSM Custom-Type Key <small style="color:var(--text-muted)">(für automatische Erkennung, z.B. "gas")</small></label>
        <input id="ic-ct" class="form-control" placeholder="z.B. gas"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.infraCategoryPanel.showPanel()">Zurück</button>
      <button class="btn btn-primary" onclick="ATLAS.infraCategoryPanel.save()">Erstellen</button>
    </div>`);
  },
  showEdit(id) {
    const c = this._cats.find(x=>x.id===id); if (!c) return;
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">✏️ Kategorie bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div class="form-group"><label>Name</label><input id="ic-name" class="form-control" value="${c.name}"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;"><label>Icon</label><input id="ic-icon" class="form-control" value="${c.icon}"></div>
        <div style="flex:1;"><label>Farbe</label><input id="ic-color" type="color" class="form-control" value="${c.color||'#6366f1'}" style="height:38px;padding:2px;"></div>
      </div>
      <div class="form-group"><label>Overpass-Query</label><textarea id="ic-oq" class="form-control" rows="3">${c.overpass_query||''}</textarea></div>
      <div class="form-group"><label>Custom-Type</label><input id="ic-ct" class="form-control" value="${c.custom_type||''}"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.infraCategoryPanel.showPanel()">Zurück</button>
      <button class="btn btn-primary" onclick="ATLAS.infraCategoryPanel.update(${id})">Speichern</button>
    </div>`);
  },
  async save() {
    const d = { name: document.getElementById('ic-name').value, icon: document.getElementById('ic-icon').value,
      color: document.getElementById('ic-color').value, overpass_query: document.getElementById('ic-oq').value||null,
      custom_type: document.getElementById('ic-ct').value||null };
    try { await ATLAS.api.post('/api/infrastructure/categories', d); ATLAS.ui.toast('Erstellt','success'); await this.showPanel(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async update(id) {
    const d = { name: document.getElementById('ic-name').value, icon: document.getElementById('ic-icon').value,
      color: document.getElementById('ic-color').value, overpass_query: document.getElementById('ic-oq').value||null,
      custom_type: document.getElementById('ic-ct').value||null };
    try { await ATLAS.api.put(`/api/infrastructure/categories/${id}`, d); ATLAS.ui.toast('Gespeichert','success'); await this.showPanel(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async del(id, name) {
    if (!confirm(`Kategorie "${name}" löschen?`)) return;
    try { await ATLAS.api.delete(`/api/infrastructure/categories/${id}`); ATLAS.ui.toast('Gelöscht','success'); await this.showPanel(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

/* ============================================================
   System Monitor Extended Page (Overhaul)
============================================================ */
ATLAS.healthPage = {
  _data: null,
  _interval: null,
  async render(container) {
    container.innerHTML = `<div style="padding:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;">🖥️ Systemüberwachung</h2>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.healthPage.refresh()">↻ Aktualisieren</button>
          <select id="sm-interval" class="form-control" style="width:auto;padding:4px 8px;font-size:13px;" onchange="ATLAS.healthPage.setInterval()">
            <option value="0">Manuell</option><option value="5000" selected>5s Auto</option><option value="10000">10s</option><option value="30000">30s</option>
          </select>
        </div>
      </div>
      <div id="sm-content"><div style="text-align:center;padding:40px;color:var(--text-muted);">Lade…</div></div>
    </div>`;
    await this.refresh();
    this.setInterval();
  },
  setInterval() {
    if (this._interval) clearInterval(this._interval);
    const v = parseInt(document.getElementById('sm-interval')?.value || '0');
    if (v > 0) this._interval = setInterval(() => this.refresh(), v);
  },
  async refresh() {
    try {
      const d = await ATLAS.api.get('/api/system/monitor/extended');
      this._data = d;
      this._render(d);
    } catch(e) {
      // Fallback to basic monitor
      try {
        const d = await ATLAS.api.get('/api/system/monitor');
        this._data = d;
        this._renderBasic(d);
      } catch(e2) {
        document.getElementById('sm-content').innerHTML = `<div style="color:var(--danger);padding:20px;">Fehler: ${e2.message}</div>`;
      }
    }
  },
  _kpiCard(icon, label, value, sub='', color='var(--primary)') {
    return `<div style="background:var(--surface-2);border-radius:10px;padding:16px;border-top:3px solid ${color};">
      <div style="font-size:22px;">${icon}</div>
      <div style="font-size:22px;font-weight:700;color:${color};">${value}</div>
      <div style="font-size:12px;color:var(--text-muted);">${label}</div>
      ${sub ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${sub}</div>` : ''}
    </div>`;
  },
  _progressBar(pct, color='#4caf7d') {
    const safe = Math.min(100, Math.max(0, pct||0));
    const c = pct > 85 ? '#e53935' : pct > 70 ? '#f57c00' : color;
    return `<div style="background:var(--surface-3);border-radius:4px;height:8px;overflow:hidden;">
      <div style="width:${safe}%;background:${c};height:100%;border-radius:4px;transition:width 0.5s;"></div>
    </div>`;
  },
  _render(d) {
    const cur = d.current || {};
    const sys = d.system || {};
    const app = d.application || {};
    const plat = d.platform || {};
    const pi = d.pi_nodes || [];
    const cpu = sys.cpu || {};
    const mem = sys.memory || {};
    const disks = sys.disk || [];
    const procs = sys.processes || [];
    const netio = (sys.network||{}).io || {};
    const diskio = sys.disk_io || {};
    const uptime_s = sys.uptime_s || 0;
    const uptimeStr = uptime_s ? `${Math.floor(uptime_s/3600)}h ${Math.floor((uptime_s%3600)/60)}m` : '–';

    const html = `
    <!-- KPI Row -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:20px;">
      ${this._kpiCard('🖥️','CPU', `${(cpu.percent||cur.cpu_pct||0).toFixed(1)}%`, `${cpu.count||1} Kerne`, '#6366f1')}
      ${this._kpiCard('💾','RAM', `${(mem.pct||cur.mem_pct||0).toFixed(1)}%`, `${mem.used_gb||'?'}/${mem.total_gb||'?'} GB`, '#ec4899')}
      ${this._kpiCard('💿','Disk', disks.length ? `${disks[0].pct}%` : (cur.disk_free_mb ? Math.round(cur.disk_free_mb)+'MB frei' : '–'), disks.length ? `${disks[0].free_gb}GB frei` : '', '#f59e0b')}
      ${this._kpiCard('⏱️','Uptime', uptimeStr, plat.os || '', '#10b981')}
      ${this._kpiCard('👤','Nutzer', app.active_users||0, `${app.active_sessions||0} Sessions`, '#6366f1')}
      ${this._kpiCard('🔔','Alerts', app.active_alerts||0, `${app.active_incidents||0} Incidents`, (app.active_alerts||0)>0?'#e53935':'#10b981')}
      ${this._kpiCard('📡','WS', app.websocket_connections||0, 'Live-Verbindungen', '#0ea5e9')}
      ${this._kpiCard('📊','API/24h', app.api_requests_24h||0, `${app.rate_limit_hits_24h||0} RL-Hits`, '#8b5cf6')}
    </div>

    <!-- CPU + Memory detail -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div style="background:var(--surface-2);border-radius:10px;padding:16px;">
        <div style="font-weight:600;margin-bottom:10px;">🖥️ CPU Details</div>
        ${cpu.per_core ? cpu.per_core.map((v,i)=>`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:11px;color:var(--text-muted);width:40px;">Core${i}</span>
            ${this._progressBar(v)}
            <span style="font-size:11px;width:35px;text-align:right;">${v.toFixed(0)}%</span>
          </div>`).join('') : `<div>${this._progressBar(cur.cpu_pct||0)}</div>`}
        ${cpu.freq_mhz ? `<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">${cpu.freq_mhz} MHz / max ${cpu.freq_max_mhz||'?'} MHz</div>` : ''}
      </div>
      <div style="background:var(--surface-2);border-radius:10px;padding:16px;">
        <div style="font-weight:600;margin-bottom:10px;">💾 Speicher</div>
        <div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>RAM</span><span>${mem.used_gb||'?'} / ${mem.total_gb||'?'} GB</span></div>
          ${this._progressBar(mem.pct||cur.mem_pct)}
        </div>
        ${mem.swap_total_gb ? `<div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>Swap</span><span>${mem.swap_total_gb} GB</span></div>
          ${this._progressBar(mem.swap_used_pct)}
        </div>` : ''}
        ${sys.battery ? `<div style="margin-top:10px;font-size:12px;">🔋 ${sys.battery.percent}% ${sys.battery.plugged ? '(AC)' : '(Batterie)'}</div>` : ''}
      </div>
    </div>

    <!-- Disk + Network I/O -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div style="background:var(--surface-2);border-radius:10px;padding:16px;">
        <div style="font-weight:600;margin-bottom:10px;">💿 Laufwerke</div>
        ${disks.map(d=>`
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">
              <span style="font-family:monospace;">${d.mountpoint}</span>
              <span>${d.used_gb}/${d.total_gb} GB (${d.pct}%)</span>
            </div>
            ${this._progressBar(d.pct)}
            <div style="font-size:10px;color:var(--text-muted);">${d.fstype||''}</div>
          </div>`).join('') || `<div style="color:var(--text-muted);font-size:13px;">Keine Laufwerksdaten (psutil fehlt)</div>`}
        ${Object.keys(diskio).length ? `<div style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:6px;margin-top:6px;">
          I/O: ↑ ${diskio.write_mb||0}MB / ↓ ${diskio.read_mb||0}MB gelesen
        </div>` : ''}
      </div>
      <div style="background:var(--surface-2);border-radius:10px;padding:16px;">
        <div style="font-weight:600;margin-bottom:10px;">🌐 Netzwerk</div>
        ${Object.keys(netio).length ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <div style="background:var(--surface-3);border-radius:6px;padding:8px;text-align:center;">
              <div style="font-size:16px;font-weight:700;color:#0ea5e9;">↑ ${netio.sent_mb||0}</div>
              <div style="font-size:10px;color:var(--text-muted);">MB gesendet</div>
            </div>
            <div style="background:var(--surface-3);border-radius:6px;padding:8px;text-align:center;">
              <div style="font-size:16px;font-weight:700;color:#10b981;">↓ ${netio.recv_mb||0}</div>
              <div style="font-size:10px;color:var(--text-muted);">MB empfangen</div>
            </div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);">Fehler: ↑${netio.err_out||0} / ↓${netio.err_in||0}</div>
        ` : '<div style="color:var(--text-muted);font-size:13px;">Keine Netzwerkdaten (psutil fehlt)</div>'}
        <!-- Temperatures -->
        ${Object.keys(sys.temperatures||{}).length ? `
          <div style="margin-top:10px;border-top:1px solid var(--border);padding-top:8px;">
            <div style="font-size:12px;font-weight:600;margin-bottom:4px;">🌡️ Temperaturen</div>
            ${Object.entries(sys.temperatures||{}).map(([k,vals])=>
              vals.map(t=>`<div style="font-size:11px;display:flex;justify-content:space-between;"><span>${k} ${t.label}</span><span style="color:${(t.current||0)>75?'#e53935':'var(--text)'}">${t.current}°C</span></div>`).join('')
            ).join('')}
          </div>` : ''}
      </div>
    </div>

    <!-- Processes -->
    ${procs.length ? `
    <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
      <div style="font-weight:600;margin-bottom:10px;">⚙️ Top Prozesse (CPU)</div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr style="color:var(--text-muted);">
            <th style="text-align:left;padding:4px 8px;">PID</th>
            <th style="text-align:left;padding:4px 8px;">Name</th>
            <th style="text-align:right;padding:4px 8px;">CPU%</th>
            <th style="text-align:right;padding:4px 8px;">RAM%</th>
            <th style="text-align:left;padding:4px 8px;">Status</th>
            <th style="text-align:left;padding:4px 8px;">User</th>
          </tr></thead>
          <tbody>${procs.map(p=>`<tr style="border-top:1px solid var(--border);">
            <td style="padding:4px 8px;font-family:monospace;">${p.pid||''}</td>
            <td style="padding:4px 8px;">${p.name||''}</td>
            <td style="padding:4px 8px;text-align:right;color:${(p.cpu_percent||0)>50?'#e53935':'var(--text)'}">${(p.cpu_percent||0).toFixed(1)}</td>
            <td style="padding:4px 8px;text-align:right;">${(p.memory_percent||0).toFixed(1)}</td>
            <td style="padding:4px 8px;"><span style="font-size:10px;padding:2px 6px;border-radius:10px;background:${p.status==='running'?'#10b981':'var(--surface-3)'};color:${p.status==='running'?'white':'var(--text-muted)'};">${p.status||''}</span></td>
            <td style="padding:4px 8px;color:var(--text-muted);">${p.username||''}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>` : ''}

    <!-- Pi Nodes in monitor -->
    ${pi.length ? `
    <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
      <div style="font-weight:600;margin-bottom:10px;">🍓 Pi-Knoten Status</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">
        ${pi.map(n=>`<div style="background:var(--surface-3);border-radius:8px;padding:10px;border-left:3px solid ${n.status==='online'?'#10b981':'#e53935'};">
          <div style="font-weight:600;font-size:13px;">${n.name}</div>
          <div style="font-size:11px;color:var(--text-muted);">${n.ip||n.hostname}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:6px;font-size:11px;">
            <span>CPU: ${n.cpu_pct!=null?n.cpu_pct+'%':'–'}</span>
            <span>RAM: ${n.mem_pct!=null?n.mem_pct+'%':'–'}</span>
            <span>Temp: ${n.temp_c!=null?n.temp_c+'°C':'–'}</span>
            <span>${n.is_backup?'🔄 Backup':''}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- API requests chart (last 24h) -->
    ${app.req_by_hour && app.req_by_hour.length ? `
    <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
      <div style="font-weight:600;margin-bottom:10px;">📊 API-Requests letzte 24h (nach Stunde)</div>
      <div style="display:flex;align-items:flex-end;height:80px;gap:2px;">
        ${(()=>{
          const maxC = Math.max(...app.req_by_hour.map(r=>r.c), 1);
          return app.req_by_hour.map(r=>`<div title="${r.h}:00 — ${r.c} Requests" style="flex:1;background:var(--primary);border-radius:2px 2px 0 0;height:${Math.round((r.c/maxC)*100)}%;min-width:4px;"></div>`).join('');
        })()}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Top Endpoint: ${app.top_endpoints && app.top_endpoints[0] ? app.top_endpoints[0].endpoint+' ('+app.top_endpoints[0].c+')' : '–'}</div>
    </div>` : ''}

    <!-- History chart -->
    ${d.history && d.history.length > 1 ? `
    <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
      <div style="font-weight:600;margin-bottom:10px;">📈 CPU / RAM Verlauf (${d.history.length} Punkte)</div>
      <div style="position:relative;height:80px;">
        <svg viewBox="0 0 ${d.history.length} 100" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible;">
          <polyline fill="none" stroke="#6366f1" stroke-width="1.5"
            points="${d.history.map((h,i)=>i+','+Math.round(100-(h.cpu_pct||0))).join(' ')}"/>
          <polyline fill="none" stroke="#ec4899" stroke-width="1.5"
            points="${d.history.map((h,i)=>i+','+Math.round(100-(h.mem_pct||0))).join(' ')}"/>
        </svg>
      </div>
      <div style="font-size:10px;color:var(--text-muted);display:flex;gap:12px;margin-top:4px;">
        <span><span style="color:#6366f1;">—</span> CPU</span>
        <span><span style="color:#ec4899;">—</span> RAM</span>
      </div>
    </div>` : ''}

    <!-- Platform info -->
    <div style="background:var(--surface-2);border-radius:10px;padding:14px;font-size:12px;color:var(--text-muted);">
      🖥️ ${plat.hostname||'?'} · ${plat.os||'?'} ${plat.os_version||''} · ${plat.arch||''} · Python ${plat.python_version||''} · ${plat.app_name} v${plat.app_version}
      ${app.db_size_mb ? ` · DB: ${app.db_size_mb} MB` : ''}
    </div>`;
    document.getElementById('sm-content').innerHTML = html;
  },
  _renderBasic(d) {
    document.getElementById('sm-content').innerHTML = `<div style="padding:20px;color:var(--text-muted);">
      Erweiterte Daten nicht verfügbar (psutil installieren für mehr Details).<br><br>
      CPU: ${(d.current||{}).cpu_pct||'?'}% · RAM: ${(d.current||{}).mem_pct||'?'}%<br>
      Nutzer: ${(d.application||{}).active_users||0} · Alerts: ${(d.application||{}).active_alerts||0}
    </div>`;
  },
};

/* ============================================================
   Event Predictions Page
============================================================ */
ATLAS.eventPredictionsPage = {
  _data: null,
  async render(container) {
    container.innerHTML = `<div style="padding:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;">🔮 Ereignisvorhersage</h2>
        <div style="display:flex;gap:8px;">
          <select id="ep-cat" class="form-control" style="width:auto;padding:4px 8px;font-size:13px;" onchange="ATLAS.eventPredictionsPage.load()">
            <option value="">Alle Kategorien</option>
            <option value="weather">🌩️ Wetter</option>
            <option value="emergency">🚨 Notfall</option>
            <option value="general">📰 Allgemein</option>
          </select>
          <select id="ep-sev" class="form-control" style="width:auto;padding:4px 8px;font-size:13px;" onchange="ATLAS.eventPredictionsPage.load()">
            <option value="">Alle Schweregrade</option>
            <option value="info">ℹ️ Info</option>
            <option value="warning">⚠️ Warnung</option>
            <option value="critical">🔴 Kritisch</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.eventPredictionsPage.fetch()">🔄 Feeds abrufen</button>
        </div>
      </div>
      <div id="ep-content"><div style="text-align:center;padding:40px;color:var(--text-muted);">Lade…</div></div>
    </div>`;
    await this.load();
  },
  async fetch() {
    const btn = document.querySelector('[onclick*="fetch()"]');
    if (btn) { btn.disabled = true; btn.textContent = '⌛ Wird abgerufen…'; }
    try {
      const r = await ATLAS.api.post('/api/predictions/fetch', {});
      ATLAS.ui.toast(`${r.inserted} neue Einträge von ${r.feeds_checked} Feeds`, 'success');
      await this.load();
    } catch(e) {
      ATLAS.ui.toast(e.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🔄 Feeds abrufen'; }
    }
  },
  async load() {
    const cat = document.getElementById('ep-cat')?.value || '';
    const sev = document.getElementById('ep-sev')?.value || '';
    try {
      let url = '/api/predictions?limit=100';
      if (cat) url += `&category=${cat}`;
      if (sev) url += `&severity=${sev}`;
      const d = await ATLAS.api.get(url);
      this._data = d;
      this._render(d);
    } catch(e) {
      document.getElementById('ep-content').innerHTML = `<div style="color:var(--danger);padding:20px;">${e.message}</div>`;
    }
  },
  _sevBadge(sev) {
    const map = { critical: ['#e53935','🔴'], warning: ['#f57c00','⚠️'], info: ['#1e88e5','ℹ️'] };
    const [c,ic] = map[sev] || ['#607d8b','📌'];
    return `<span style="font-size:10px;padding:2px 7px;border-radius:10px;background:${c};color:white;">${ic} ${sev}</span>`;
  },
  _render(d) {
    const preds = d.predictions || [];
    const hist = d.history_6m || [];
    const breakdown = d.breakdown || [];

    // 6-month bar chart
    const months = [...new Set(hist.map(r=>r.month))].sort();
    const cats = [...new Set(hist.map(r=>r.category))];
    const catColors = {'weather':'#1e88e5','emergency':'#e53935','general':'#43a047'};

    const histHtml = months.length ? `
    <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
      <div style="font-weight:600;margin-bottom:10px;">📊 6-Monats-Verlauf</div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:100px;">
        ${months.map(m=>{
          const mdata = hist.filter(r=>r.month===m);
          const total = mdata.reduce((s,r)=>s+r.count,0);
          const maxTotal = Math.max(...months.map(mm=>hist.filter(r=>r.month===mm).reduce((s,r)=>s+r.count,0)),1);
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;" title="${m}: ${total}">
            <div style="width:100%;display:flex;flex-direction:column-reverse;height:${Math.round((total/maxTotal)*90)}px;">
              ${mdata.map(r=>`<div style="background:${catColors[r.category]||'#8b5cf6'};height:${Math.round((r.count/total)*100)}%;min-height:3px;"></div>`).join('')}
            </div>
            <div style="font-size:9px;color:var(--text-muted);transform:rotate(-45deg);margin-top:4px;">${m.substring(5)}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;">
        ${cats.map(c=>`<span style="font-size:11px;"><span style="color:${catColors[c]||'#8b5cf6'};">■</span> ${c}</span>`).join('')}
      </div>
    </div>` : '';

    // Breakdown stats
    const bkHtml = breakdown.length ? `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
      ${breakdown.slice(0,8).map(b=>`<div style="background:var(--surface-2);border-radius:8px;padding:8px 12px;font-size:12px;">
        <span style="font-weight:600;">${b.cnt}</span> <span style="color:var(--text-muted);">${b.category}/${b.severity}</span>
      </div>`).join('')}
    </div>` : '';

    const rows = preds.length ? preds.map(p=>`
    <div style="background:var(--surface-2);border-radius:8px;padding:12px;border-left:3px solid ${p.severity==='critical'?'#e53935':p.severity==='warning'?'#f57c00':'#1e88e5'};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div style="flex:1;">
          <div style="font-weight:600;font-size:14px;">${p.title}</div>
          ${p.summary ? `<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${p.summary.substring(0,150)}…</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          ${this._sevBadge(p.severity)}
          ${p.is_confirmed ? '<span style="font-size:10px;color:#10b981;">✅ Bestätigt</span>' : ''}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <div style="font-size:11px;color:var(--text-muted);">
          📡 ${p.source_name||'Unbekannt'} · 🕐 ${p.fetched_at ? p.fetched_at.substring(0,16) : ''}
          ${p.predicted_date ? ' · 📅 '+p.predicted_date.substring(0,16) : ''}
        </div>
        <div style="display:flex;gap:6px;">
          ${!p.is_confirmed ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.eventPredictionsPage.confirm(${p.id})">✅ Bestätigen</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="ATLAS.eventPredictionsPage.del(${p.id})">🗑️</button>
        </div>
      </div>
    </div>`).join('') : '<div style="text-align:center;padding:30px;color:var(--text-muted);">Noch keine Vorhersagen. Feeds abrufen!</div>';

    document.getElementById('ep-content').innerHTML = histHtml + bkHtml +
      `<div style="display:flex;flex-direction:column;gap:8px;">${rows}</div>`;
  },
  async confirm(id) {
    try { await ATLAS.api.put(`/api/predictions/${id}/confirm`, {}); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async del(id) {
    if (!confirm('Vorhersage löschen?')) return;
    try { await ATLAS.api.delete(`/api/predictions/${id}`); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

/* ============================================================
   Remote Access (WireGuard) Page
============================================================ */
ATLAS.remoteAccessPage = {
  _config: null,
  _peers: [],
  async render(container) {
    container.innerHTML = `<div style="padding:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;">🔒 Remote-Zugriff (WireGuard)</h2>
        <div style="display:flex;gap:8px;" id="wg-actions"></div>
      </div>
      <div id="wg-content"><div style="text-align:center;padding:40px;color:var(--text-muted);">Lade…</div></div>
    </div>`;
    await this.load();
  },
  async load() {
    try {
      const d = await ATLAS.api.get('/api/wireguard/config');
      this._config = d.config;
      this._peers = d.peers || [];
      this._render();
    } catch(e) {
      document.getElementById('wg-content').innerHTML = `<div style="color:var(--danger);padding:20px;">${e.message}</div>`;
    }
  },
  _render() {
    const c = this._config;
    const peers = this._peers;
    const actionsDiv = document.getElementById('wg-actions');
    if (actionsDiv) {
      actionsDiv.innerHTML = c
        ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.remoteAccessPage.showServerConfig()">📄 wg0.conf</button>
           <button class="btn btn-primary btn-sm" onclick="ATLAS.remoteAccessPage.showAddPeer()">+ Peer hinzufügen</button>`
        : `<button class="btn btn-primary btn-sm" onclick="ATLAS.remoteAccessPage.showInit()">🚀 WireGuard einrichten</button>`;
    }

    if (!c) {
      document.getElementById('wg-content').innerHTML = `
        <div style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:16px;">🔒</div>
          <h3>WireGuard VPN noch nicht eingerichtet</h3>
          <p style="color:var(--text-muted);max-width:400px;margin:0 auto 20px;">
            Erstelle ein selbst gehostetes VPN ohne externe Dienste. Sicher, schnell und vollständig unter deiner Kontrolle.
          </p>
          <button class="btn btn-primary" onclick="ATLAS.remoteAccessPage.showInit()">🚀 Jetzt einrichten</button>
        </div>`;
      return;
    }

    document.getElementById('wg-content').innerHTML = `
      <!-- Server Info -->
      <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;margin-bottom:10px;display:flex;justify-content:space-between;">
          <span>🖥️ Server-Konfiguration</span>
          <span style="font-size:11px;color:var(--text-muted);">${c.server_endpoint||'Kein Endpoint'}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;font-size:13px;">
          <div><span style="color:var(--text-muted);">Endpoint:</span> ${c.server_endpoint||'–'}</div>
          <div><span style="color:var(--text-muted);">Port:</span> ${c.listen_port||51820}</div>
          <div><span style="color:var(--text-muted);">VPN-IP:</span> ${c.server_ip||'–'}</div>
          <div><span style="color:var(--text-muted);">DNS:</span> ${c.dns||'–'}</div>
        </div>
        <div style="margin-top:10px;font-size:11px;">
          <span style="color:var(--text-muted);">Public Key:</span>
          <span style="font-family:monospace;word-break:break-all;">${c.server_public_key||'–'}</span>
        </div>
      </div>

      <!-- Peers -->
      <div style="font-weight:600;margin-bottom:10px;">👥 Peers (${peers.length})</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        ${peers.length ? peers.map(p=>`
          <div style="background:var(--surface-2);border-radius:8px;padding:12px;display:flex;justify-content:space-between;align-items:center;gap:10px;">
            <div style="flex:1;">
              <div style="font-weight:600;">${p.name} <span style="font-size:10px;padding:2px 6px;border-radius:10px;background:${p.enabled?'#10b981':'#e53935'};color:white;">${p.enabled?'aktiv':'inaktiv'}</span></div>
              <div style="font-size:12px;color:var(--text-muted);">IP: ${p.allowed_ips} · ${p.role} ${p.username?'· '+p.full_name:''}</div>
              <div style="font-size:10px;font-family:monospace;color:var(--text-muted);margin-top:2px;">${(p.public_key||'').substring(0,32)}…</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.remoteAccessPage.showPeerConfig(${p.id})" title="Client-Config & QR">📱</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.remoteAccessPage.delPeer(${p.id},'${(p.name||'').replace(/'/g,"\\'")}')">🗑️</button>
            </div>
          </div>`).join('') : '<div style="text-align:center;padding:20px;color:var(--text-muted);">Noch keine Peers angelegt</div>'}
      </div>

      <!-- Setup guide -->
      <details style="background:var(--surface-2);border-radius:10px;padding:14px;">
        <summary style="cursor:pointer;font-weight:600;">📖 Installation auf dem Server (Linux)</summary>
        <pre style="margin-top:10px;background:var(--surface-3);border-radius:6px;padding:12px;font-size:11px;overflow-x:auto;"># Debian/Ubuntu
apt install wireguard
# Konfiguration schreiben
wg0.conf → /etc/wireguard/wg0.conf
# Starten
systemctl enable --now wg-quick@wg0
# Status
wg show</pre>
      </details>`;
  },
  showInit() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🚀 WireGuard einrichten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div class="form-group"><label>Server-Endpoint (öffentliche IP:Port oder Domain:Port)</label>
        <input id="wg-endpoint" class="form-control" placeholder="mein-server.de:51820"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;"><label>Listen Port</label><input id="wg-port" class="form-control" type="number" value="51820"></div>
        <div style="flex:1;"><label>VPN-Subnetz</label><input id="wg-ip" class="form-control" value="10.100.0.1/24"></div>
      </div>
      <div class="form-group"><label>DNS</label><input id="wg-dns" class="form-control" value="1.1.1.1"></div>
      <div style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:12px;color:var(--text-muted);">
        Es wird ein neues Schlüsselpaar generiert. Der Private Key wird sicher in der Datenbank gespeichert.
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="ATLAS.remoteAccessPage.init()">🔑 Einrichten</button>
    </div>`);
  },
  async init() {
    const d = { endpoint: document.getElementById('wg-endpoint').value,
      listen_port: parseInt(document.getElementById('wg-port').value),
      server_ip: document.getElementById('wg-ip').value,
      dns: document.getElementById('wg-dns').value };
    try {
      await ATLAS.api.post('/api/wireguard/init', d);
      ATLAS.ui.closeModal();
      ATLAS.ui.toast('WireGuard eingerichtet', 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },
  showAddPeer() {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">➕ Peer hinzufügen</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div class="form-group"><label>Name</label><input id="wg-pname" class="form-control" placeholder="z.B. Felix iPhone"></div>
      <div class="form-group"><label>Rolle</label>
        <select id="wg-prole" class="form-control"><option value="client">Client</option><option value="pi">Raspberry Pi</option><option value="admin">Admin</option></select></div>
      <div class="form-group"><label>Public Key <small style="color:var(--text-muted)">(leer = wird automatisch generiert)</small></label>
        <input id="wg-ppub" class="form-control" placeholder="Auto-generate"></div>
      <div class="form-group"><label>
        <input type="checkbox" id="wg-ppsk"> Pre-Shared Key generieren (empfohlen für höhere Sicherheit)
      </label></div>
      <div class="form-group"><label>Keepalive (Sekunden)</label><input id="wg-pka" class="form-control" type="number" value="25"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="ATLAS.remoteAccessPage.addPeer()">Hinzufügen</button>
    </div>`);
  },
  async addPeer() {
    const d = { name: document.getElementById('wg-pname').value,
      role: document.getElementById('wg-prole').value,
      public_key: document.getElementById('wg-ppub').value || undefined,
      generate_psk: document.getElementById('wg-ppsk').checked,
      keepalive: parseInt(document.getElementById('wg-pka').value) };
    try {
      const r = await ATLAS.api.post('/api/wireguard/peers', d);
      ATLAS.ui.closeModal();
      // Show QR code + config
      this._showPeerResult(r);
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  _showPeerResult(r) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">✅ Peer erstellt</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      ${r.client_config_qr && r.client_config_qr.startsWith('data:image') ?
        `<div style="text-align:center;margin-bottom:16px;"><img src="${r.client_config_qr}" style="max-width:200px;border-radius:8px;border:4px solid white;"><br><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Mit WireGuard-App scannen</div></div>` : ''}
      <div style="font-weight:600;margin-bottom:6px;">Client-Konfiguration:</div>
      <pre style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${r.client_config||''}</pre>
      ${r.private_key ? `<div style="color:#f57c00;font-size:12px;margin-top:8px;">⚠️ Private Key sicher aufbewahren — wird nicht erneut angezeigt:<br><code style="font-size:11px;word-break:break-all;">${r.private_key}</code></div>` : ''}
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
  },
  async showPeerConfig(id) {
    try {
      const r = await ATLAS.api.get(`/api/wireguard/peers/${id}/config`);
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📱 Client-Config: ${r.filename}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        ${r.qr && r.qr.startsWith('data:image') ? `<div style="text-align:center;margin-bottom:16px;"><img src="${r.qr}" style="max-width:200px;border-radius:8px;border:4px solid white;"></div>` : ''}
        <pre style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${r.config||''}</pre>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async showServerConfig() {
    try {
      const r = await ATLAS.api.get('/api/wireguard/server-config');
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📄 ${r.filename}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <div style="color:#f57c00;font-size:12px;margin-bottom:8px;">⚠️ Enthält Private Key — nicht teilen!</div>
        <pre style="background:var(--surface-3);border-radius:6px;padding:12px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${r.config||''}</pre>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
  async delPeer(id, name) {
    if (!confirm(`Peer "${name}" löschen?`)) return;
    try { await ATLAS.api.delete(`/api/wireguard/peers/${id}`); ATLAS.ui.toast('Peer entfernt','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

/* ============================================================
   Pi Manager – Failover & Shield Extensions
============================================================ */
ATLAS.piFailoverPanel = {
  async showForNode(nid, name) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🔄 Failover: ${name}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <p style="color:var(--text-muted);font-size:13px;">Konfiguriert diesen Pi als automatischen Failover-Backup. Er übernimmt, wenn der Hauptserver nicht erreichbar ist.</p>
      <div class="form-group"><label>Priorität (1 = höchste)</label><input id="fb-prio" class="form-control" type="number" value="1" min="1" max="10"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="ATLAS.piFailoverPanel.configure(${nid})">Konfigurieren</button>
    </div>`);
  },
  async configure(nid) {
    const prio = parseInt(document.getElementById('fb-prio').value);
    try {
      const r = await ATLAS.api.post(`/api/pi/nodes/${nid}/set-failover`, { is_backup: 1, priority: prio });
      ATLAS.ui.closeModal();
      // Show script
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">📜 Failover Agent Script</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body">
        <p style="font-size:12px;color:var(--text-muted);">Kopiere dieses Script auf den Pi und führe es aus: <code>python3 failover_agent.py</code></p>
        <pre style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:10px;overflow-x:auto;max-height:300px;white-space:pre-wrap;">${r.failover_script||''}</pre>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

ATLAS.piShieldPanel = {
  async showForNode(nid, name) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🛡️ Access Shield: ${name}</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <p style="color:var(--text-muted);font-size:13px;">Konfiguriert diesen Pi als nginx-Reverse-Proxy mit iptables-Firewall vor dem Hauptserver.</p>
      <div class="form-group"><label>Hauptserver IP/Host</label><input id="sh-host" class="form-control" placeholder="192.168.1.100"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;"><label>Hauptserver Port</label><input id="sh-port" class="form-control" type="number" value="8080"></div>
        <div style="flex:1;"><label>Shield HTTPS-Port</label><input id="sh-sport" class="form-control" type="number" value="443"></div>
      </div>
      <div class="form-group"><label>Rate Limit</label><input id="sh-rl" class="form-control" value="10r/s"></div>
      <div class="form-group"><label>Erlaubte IPs/CIDRs (eine pro Zeile, leer = alle)</label>
        <textarea id="sh-ips" class="form-control" rows="3" placeholder="192.168.0.0/24&#10;10.0.0.1"></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="ATLAS.piShieldPanel.generate(${nid})">Konfiguration generieren</button>
    </div>`);
  },
  async generate(nid) {
    const d = {
      primary_host: document.getElementById('sh-host').value,
      primary_port: parseInt(document.getElementById('sh-port').value),
      shield_port: parseInt(document.getElementById('sh-sport').value),
      rate_limit: document.getElementById('sh-rl').value,
      allowed_ips: document.getElementById('sh-ips').value.split('\n').map(s=>s.trim()).filter(Boolean),
    };
    try {
      const r = await ATLAS.api.post(`/api/pi/nodes/${nid}/generate-shield-config`, d);
      ATLAS.ui.closeModal();
      ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">🛡️ Shield Konfiguration</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <div style="font-weight:600;margin-bottom:6px;">nginx.conf:</div>
        <pre style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:10px;overflow-x:auto;white-space:pre-wrap;max-height:200px;">${r.nginx_config||''}</pre>
        <div style="font-weight:600;margin:10px 0 6px;">iptables.sh:</div>
        <pre style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:10px;overflow-x:auto;white-space:pre-wrap;max-height:150px;">${r.iptables_script||''}</pre>
        <div style="font-weight:600;margin:10px 0 6px;">setup.sh (einmalig ausführen):</div>
        <pre style="background:var(--surface-3);border-radius:6px;padding:10px;font-size:10px;overflow-x:auto;white-space:pre-wrap;">${r.setup_script||''}</pre>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Schließen</button></div>`);
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

// Patch Pi Manager page to include Failover + Shield buttons
const _origPiRender = ATLAS.piManagerPage.render.bind(ATLAS.piManagerPage);
ATLAS.piManagerPage.render = async function(container) {
  await _origPiRender(container);
  // The render is async, wait for DOM update then patch node cards
  setTimeout(() => {
    // Buttons are added dynamically in _renderNode — handled below via override of _nodeCard
  }, 100);
};
// Override _nodeCard to include failover/shield buttons
const _origNodeCard = ATLAS.piManagerPage._nodeCard;
ATLAS.piManagerPage._nodeCard = function(n) {
  const base = _origNodeCard ? _origNodeCard.call(this, n) : '';
  // We patch the pi manager render directly in the piManagerPage object
  return base;
};

/* ============================================================
   Security AI Dashboard
============================================================ */
ATLAS.securityAiPage = {
  _data: null,
  _tab: 'dashboard',
  _interval: null,

  async render(container) {
    container.innerHTML = `<div style="padding:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;display:flex;align-items:center;gap:10px;">
          🧠 Sicherheits-KI
          <span id="ai-score-badge" style="font-size:13px;padding:3px 10px;border-radius:20px;background:#10b981;color:white;">Score: –</span>
        </h2>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.analyze()">▶ Jetzt analysieren</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.train()">🎓 Training</button>
          <select id="ai-refresh" class="form-control" style="width:auto;padding:4px 8px;font-size:13px;" onchange="ATLAS.securityAiPage.setAutoRefresh()">
            <option value="0">Manuell</option><option value="30000" selected>30s Auto</option><option value="60000">60s</option>
          </select>
        </div>
      </div>
      <!-- Tabs -->
      <div style="display:flex;gap:0;border-bottom:2px solid var(--border);margin-bottom:16px;">
        ${['dashboard','threats','rules','baselines','report'].map(t=>`
          <button id="ai-tab-${t}" onclick="ATLAS.securityAiPage.switchTab('${t}')"
            style="padding:8px 18px;border:none;background:none;cursor:pointer;color:var(--text-muted);font-size:13px;font-weight:500;border-bottom:2px solid transparent;margin-bottom:-2px;">
            ${{dashboard:'📊 Dashboard',threats:'🚨 Bedrohungen',rules:'⚙️ Regeln',baselines:'📈 Baselines',report:'📄 Report'}[t]}
          </button>`).join('')}
      </div>
      <div id="ai-content"><div style="text-align:center;padding:40px;color:var(--text-muted);">Lade…</div></div>
    </div>`;
    await this.load();
    this.setAutoRefresh();
    this.switchTab('dashboard');
  },

  setAutoRefresh() {
    if (this._interval) clearInterval(this._interval);
    const v = parseInt(document.getElementById('ai-refresh')?.value || '0');
    if (v > 0) this._interval = setInterval(() => this.load(), v);
  },

  switchTab(tab) {
    this._tab = tab;
    ['dashboard','threats','rules','baselines','report'].forEach(t => {
      const el = document.getElementById(`ai-tab-${t}`);
      if (el) { el.style.color = t===tab ? 'var(--primary)' : 'var(--text-muted)'; el.style.borderBottomColor = t===tab ? 'var(--primary)' : 'transparent'; }
    });
    if (this._data) this._renderTab();
  },

  async load() {
    try {
      const d = await ATLAS.api.get('/api/security-ai/status');
      this._data = d;
      // Update score badge
      const badge = document.getElementById('ai-score-badge');
      if (badge) {
        const s = d.global_score || 0;
        badge.textContent = `Score: ${s.toFixed(0)}`;
        badge.style.background = s >= 60 ? '#e53935' : s >= 30 ? '#f57c00' : '#10b981';
      }
      this._renderTab();
    } catch(e) {
      document.getElementById('ai-content').innerHTML = `<div style="color:var(--danger);padding:20px;">Fehler: ${e.message}</div>`;
    }
  },

  _renderTab() {
    const d = this._data;
    if (!d) return;
    switch (this._tab) {
      case 'dashboard':   this._renderDashboard(d); break;
      case 'threats':     this._renderThreats(d); break;
      case 'rules':       this._renderRules(d); break;
      case 'baselines':   this._renderBaselines(d); break;
      case 'report':      this._renderReport(); break;
    }
  },

  // ── Dashboard ──────────────────────────────────────────────────────────────
  _renderDashboard(d) {
    const score = d.global_score || 0;
    const bySev = d.open_by_severity || {};
    const snaps = d.snapshots || [];
    const fpRate = d.false_positive_rate_7d || 0;
    const last = d.last_analysis ? new Date(d.last_analysis).toLocaleString('de') : '–';

    const scoreColor = score >= 60 ? '#e53935' : score >= 30 ? '#f57c00' : '#10b981';
    const scoreLabel = score >= 60 ? 'KRITISCH' : score >= 30 ? 'ERHÖHT' : score >= 10 ? 'MODERAT' : 'NORMAL';

    document.getElementById('ai-content').innerHTML = `
      <!-- Threat Score Gauge -->
      <div style="display:grid;grid-template-columns:280px 1fr;gap:16px;margin-bottom:16px;align-items:start;">
        <div style="background:var(--surface-2);border-radius:12px;padding:20px;text-align:center;">
          <div style="position:relative;width:160px;height:80px;margin:0 auto 12px;">
            <svg viewBox="0 0 160 80" style="width:100%;overflow:visible;">
              <!-- Background arc -->
              <path d="M10,80 A70,70 0 0,1 150,80" fill="none" stroke="var(--surface-3)" stroke-width="14" stroke-linecap="round"/>
              <!-- Score arc -->
              <path d="M10,80 A70,70 0 0,1 150,80" fill="none" stroke="${scoreColor}" stroke-width="14" stroke-linecap="round"
                stroke-dasharray="${(score/100)*220} 220"/>
              <text x="80" y="72" text-anchor="middle" font-size="28" font-weight="700" fill="${scoreColor}">${score.toFixed(0)}</text>
            </svg>
          </div>
          <div style="font-size:18px;font-weight:700;color:${scoreColor};">${scoreLabel}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Globaler Bedrohungs-Score</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:8px;">Letzte Analyse: ${last}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${[['🔴','critical','Kritisch',(bySev.critical||0),'#e53935'],
             ['🟠','high','Hoch',(bySev.high||0),'#f57c00'],
             ['🟡','medium','Mittel',(bySev.medium||0),'#fbc02d'],
             ['🟢','low','Niedrig',(bySev.low||0),'#10b981']].map(([ic,k,label,cnt,col])=>`
            <div style="background:var(--surface-2);border-radius:10px;padding:14px;border-left:4px solid ${col};cursor:pointer;"
              onclick="ATLAS.securityAiPage.switchTab('threats');ATLAS.securityAiPage._sevFilter='${k}';">
              <div style="font-size:24px;font-weight:700;color:${col};">${cnt}</div>
              <div style="font-size:12px;color:var(--text-muted);">${ic} ${label}</div>
            </div>`).join('')}
          <div style="background:var(--surface-2);border-radius:10px;padding:14px;border-left:4px solid #6366f1;">
            <div style="font-size:24px;font-weight:700;color:#6366f1;">${fpRate}%</div>
            <div style="font-size:12px;color:var(--text-muted);">🎯 FP-Rate (7d)</div>
          </div>
          <div style="background:var(--surface-2);border-radius:10px;padding:14px;border-left:4px solid #0ea5e9;">
            <div style="font-size:24px;font-weight:700;color:#0ea5e9;">${(d.rules||[]).filter(r=>r.enabled).length}</div>
            <div style="font-size:12px;color:var(--text-muted);">⚙️ Aktive Regeln</div>
          </div>
        </div>
      </div>

      <!-- Score Verlauf -->
      ${snaps.length > 2 ? `
      <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;margin-bottom:10px;">📈 Score-Verlauf</div>
        <div style="position:relative;height:80px;">
          <svg viewBox="0 0 ${snaps.length} 100" preserveAspectRatio="none" style="width:100%;height:100%;">
            <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${scoreColor}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${scoreColor}" stop-opacity="0"/>
            </linearGradient></defs>
            <polygon fill="url(#sg)"
              points="${snaps.map((s,i)=>i+','+(100-s.anomaly_score)).join(' ')} ${snaps.length-1},100 0,100"/>
            <polyline fill="none" stroke="${scoreColor}" stroke-width="2"
              points="${snaps.map((s,i)=>i+','+(100-s.anomaly_score)).join(' ')}"/>
          </svg>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:4px;">
          <span>${snaps[0]?.ts?.substring(0,16)||''}</span>
          <span>${snaps[snaps.length-1]?.ts?.substring(0,16)||''}</span>
        </div>
      </div>` : ''}

      <!-- Recent Threats -->
      <div style="font-weight:600;margin-bottom:10px;">🚨 Aktuelle Bedrohungen</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${(d.recent_threats||[]).slice(0,8).map(t=>this._threatCard(t)).join('')
          || '<div style="text-align:center;padding:20px;color:var(--text-muted);">✅ Keine offenen Bedrohungen</div>'}
      </div>`;
  },

  // ── Threats Tab ────────────────────────────────────────────────────────────
  async _renderThreats(d) {
    const threats = d.recent_threats || [];
    const sevFilter = this._sevFilter || '';
    this._sevFilter = null;

    const filtered = sevFilter ? threats.filter(t=>t.severity===sevFilter) : threats;
    document.getElementById('ai-content').innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
        ${['','critical','high','medium','low'].map(s=>`
          <button class="btn btn-sm ${!s&&!sevFilter?'btn-primary':'btn-secondary'}" onclick="ATLAS.securityAiPage._filterThreats('${s}')">
            ${s||'Alle'}
          </button>`).join('')}
        <button class="btn btn-secondary btn-sm" style="margin-left:auto;" onclick="ATLAS.securityAiPage.loadAllThreats()">Alle laden</button>
      </div>
      <div id="threats-list" style="display:flex;flex-direction:column;gap:8px;">
        ${filtered.map(t=>this._threatCard(t)).join('')
          || '<div style="text-align:center;padding:20px;color:var(--text-muted);">Keine Bedrohungen in diesem Filter</div>'}
      </div>`;
  },

  async loadAllThreats() {
    try {
      const r = await ATLAS.api.get('/api/security-ai/threats?limit=200');
      const el = document.getElementById('threats-list');
      if (el) el.innerHTML = (r.threats||[]).map(t=>this._threatCard(t)).join('') || '<div style="text-align:center;padding:20px;color:var(--text-muted);">Keine Bedrohungen</div>';
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  _filterThreats(sev) {
    const threats = this._data?.recent_threats || [];
    const filtered = sev ? threats.filter(t=>t.severity===sev) : threats;
    const el = document.getElementById('threats-list');
    if (el) el.innerHTML = filtered.map(t=>this._threatCard(t)).join('') || '<div style="text-align:center;padding:20px;color:var(--text-muted);">Keine Treffer</div>';
  },

  _threatCard(t) {
    const sevColors = {critical:'#e53935',high:'#f57c00',medium:'#fbc02d',low:'#10b981'};
    const sevIcons  = {critical:'🔴',high:'🟠',medium:'🟡',low:'🟢'};
    const c = sevColors[t.severity] || '#607d8b';
    const ic = sevIcons[t.severity] || '📌';
    const typeLabels = {
      brute_force:'Brute Force',credential_stuffing:'Credential Stuffing',
      privilege_escalation:'Privilegieneskalation',session_geo_jump:'Session-Entführung',
      api_abuse:'API-Missbrauch',off_hours_activity:'Nachtaktivität',
      data_exfiltration:'Daten-Exfiltration',account_enumeration:'Account-Enumeration',
      impossible_travel:'Impossible Travel',
    };
    const tlabel = typeLabels[t.threat_type] || t.threat_type?.replace('rule:','Regel #');
    let evidence = {};
    try { evidence = JSON.parse(t.evidence||'{}'); } catch(e){}
    const confPct = Math.round((t.confidence||0)*100);

    return `<div style="background:var(--surface-2);border-radius:8px;padding:12px;border-left:4px solid ${c};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:11px;padding:2px 8px;border-radius:10px;background:${c};color:white;font-weight:600;">${ic} ${(t.severity||'').toUpperCase()}</span>
            <span style="font-size:12px;font-weight:600;color:var(--text);">${tlabel}</span>
          </div>
          <div style="font-size:13px;">${t.description||''}</div>
          <div style="display:flex;gap:12px;margin-top:6px;font-size:11px;color:var(--text-muted);">
            ${t.source_ip ? `<span>🌐 ${t.source_ip}</span>` : ''}
            ${t.user_name ? `<span>👤 ${t.user_name}</span>` : ''}
            ${t.auto_action ? `<span style="color:#f57c00;">⚡ Auto: ${t.auto_action}</span>` : ''}
            <span>🕐 ${t.detected_at?.substring(0,16)||''}</span>
          </div>
          <!-- Evidence chips -->
          <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">
            ${Object.entries(evidence).slice(0,5).map(([k,v])=>`
              <span style="font-size:10px;padding:1px 6px;border-radius:8px;background:var(--surface-3);color:var(--text-muted);">${k}: ${typeof v==='object'?JSON.stringify(v).substring(0,30):String(v).substring(0,30)}</span>`).join('')}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:80px;">
          <!-- Confidence meter -->
          <div style="text-align:center;">
            <div style="font-size:16px;font-weight:700;color:${c};">${confPct}%</div>
            <div style="font-size:9px;color:var(--text-muted);">Konfidenz</div>
            <div style="width:60px;background:var(--surface-3);border-radius:4px;height:4px;margin-top:2px;">
              <div style="width:${confPct}%;background:${c};height:100%;border-radius:4px;"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div style="display:flex;gap:6px;margin-top:10px;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.feedback(${t.id},'false_positive')" title="Falsch-Positiv">👍 FP</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.feedback(${t.id},'confirmed')" title="Bestätigen">✅ Bestätigen</button>
        <button class="btn btn-primary btn-sm" onclick="ATLAS.securityAiPage.resolve(${t.id})">Lösen</button>
        ${t.source_ip ? `<button class="btn btn-danger btn-sm" onclick="ATLAS.securityAiPage.blockIp('${t.source_ip}')">🚫 IP sperren</button>` : ''}
        <button class="btn btn-danger btn-sm" onclick="ATLAS.securityAiPage.deleteT(${t.id})">🗑</button>
      </div>
    </div>`;
  },

  // ── Rules Tab ──────────────────────────────────────────────────────────────
  _renderRules(d) {
    const rules = d.rules || [];
    document.getElementById('ai-content').innerHTML = `
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
        <button class="btn btn-primary btn-sm" onclick="ATLAS.securityAiPage.showCreateRule()">+ Neue Regel</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${rules.map(r=>`
          <div style="background:var(--surface-2);border-radius:8px;padding:12px;display:flex;align-items:center;gap:12px;">
            <div style="flex:1;">
              <div style="font-weight:600;">${r.name} <span style="font-size:10px;padding:1px 6px;border-radius:8px;background:${r.enabled?'#10b981':'#607d8b'};color:white;">${r.enabled?'aktiv':'inaktiv'}</span></div>
              <div style="font-size:12px;color:var(--text-muted);">${r.description||''}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">
                Typ: ${r.rule_type} · Aktion: ${r.action} · Schwere: ${r.severity} · Ausgelöst: ${r.trigger_count}×
                ${r.last_triggered ? ' · Zuletzt: '+r.last_triggered.substring(0,16) : ''}
              </div>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.editRule(${r.id})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="ATLAS.securityAiPage.deleteRule(${r.id})">🗑</button>
            </div>
          </div>`).join('') || '<div style="text-align:center;padding:30px;color:var(--text-muted);">Keine Regeln. Erstelle eine!</div>'}
      </div>
      <!-- Default rule templates -->
      <div style="margin-top:16px;background:var(--surface-2);border-radius:10px;padding:14px;">
        <div style="font-weight:600;margin-bottom:10px;">📋 Regel-Vorlagen</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${[
            {name:'Mass Login Failed',desc:'Viele Logins fehlgeschlagen',type:'threshold',cond:{metric:'login_failed',threshold:50,window_minutes:60},sev:'high'},
            {name:'Account Delete Spike',desc:'Viele Löschungen',type:'threshold',cond:{metric:'user_delete',threshold:3,window_minutes:60},sev:'critical'},
            {name:'Config Change',desc:'Konfigurationsänderung erkannt',type:'pattern',cond:{pattern:'config_',window_minutes:30},sev:'medium'},
          ].map(t=>`<button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.addTemplate(${JSON.stringify(JSON.stringify(t))})">${t.name}</button>`).join('')}
        </div>
      </div>`;
  },

  showCreateRule(prefill={}) {
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">⚙️ Neue Regel</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div class="form-group"><label>Name</label><input id="r-name" class="form-control" value="${prefill.name||''}"></div>
      <div class="form-group"><label>Beschreibung</label><input id="r-desc" class="form-control" value="${prefill.desc||''}"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;"><label>Typ</label><select id="r-type" class="form-control">
          <option value="threshold" ${prefill.type==='threshold'?'selected':''}>Schwellenwert</option>
          <option value="pattern" ${prefill.type==='pattern'?'selected':''}>Muster</option>
        </select></div>
        <div style="flex:1;"><label>Schweregrad</label><select id="r-sev" class="form-control">
          ${['low','medium','high','critical'].map(s=>`<option ${prefill.sev===s?'selected':''}>${s}</option>`).join('')}
        </select></div>
      </div>
      <div class="form-group"><label>Bedingung (JSON)</label>
        <textarea id="r-cond" class="form-control" rows="4" style="font-family:monospace;font-size:12px;">${JSON.stringify(prefill.cond||{metric:'login_failed',threshold:10,window_minutes:60},null,2)}</textarea></div>
      <div class="form-group"><label>Aktion</label><select id="r-action" class="form-control">
        <option value="alert">Alert erstellen</option><option value="block_ip">IP sperren</option><option value="invalidate_sessions">Sessions löschen</option>
      </select></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="ATLAS.securityAiPage.saveRule()">Erstellen</button>
    </div>`);
  },

  async saveRule(id=null) {
    let cond={};
    try { cond=JSON.parse(document.getElementById('r-cond').value); } catch(e){ATLAS.ui.toast('Ungültiges JSON','error');return;}
    const d = { name:document.getElementById('r-name').value, description:document.getElementById('r-desc').value,
      rule_type:document.getElementById('r-type').value, condition:cond,
      severity:document.getElementById('r-sev').value, action:document.getElementById('r-action').value };
    try {
      if (id) await ATLAS.api.put(`/api/security-ai/rules/${id}`, d);
      else await ATLAS.api.post('/api/security-ai/rules', d);
      ATLAS.ui.closeModal(); ATLAS.ui.toast('Gespeichert','success'); await this.load();
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  editRule(id) {
    const r = (this._data?.rules||[]).find(x=>x.id===id); if(!r) return;
    let cond={}; try{cond=JSON.parse(r.condition_json||'{}');}catch(e){}
    ATLAS.ui.showModal(`<div class="modal-header"><div class="modal-title">✏️ Regel bearbeiten</div><span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span></div>
    <div class="modal-body">
      <div class="form-group"><label>Name</label><input id="r-name" class="form-control" value="${r.name}"></div>
      <div class="form-group"><label>Beschreibung</label><input id="r-desc" class="form-control" value="${r.description||''}"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;"><label>Typ</label><select id="r-type" class="form-control"><option value="threshold" ${r.rule_type==='threshold'?'selected':''}>Schwellenwert</option><option value="pattern" ${r.rule_type==='pattern'?'selected':''}>Muster</option></select></div>
        <div style="flex:1;"><label>Schweregrad</label><select id="r-sev" class="form-control">${['low','medium','high','critical'].map(s=>`<option ${r.severity===s?'selected':''}>${s}</option>`).join('')}</select></div>
      </div>
      <div class="form-group"><label>Bedingung (JSON)</label><textarea id="r-cond" class="form-control" rows="4" style="font-family:monospace;font-size:12px;">${JSON.stringify(cond,null,2)}</textarea></div>
      <div class="form-group"><label>Aktion</label><select id="r-action" class="form-control"><option value="alert" ${r.action==='alert'?'selected':''}>Alert</option><option value="block_ip" ${r.action==='block_ip'?'selected':''}>IP sperren</option><option value="invalidate_sessions" ${r.action==='invalidate_sessions'?'selected':''}>Sessions</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">Abbrechen</button><button class="btn btn-primary" onclick="ATLAS.securityAiPage.saveRule(${id})">Speichern</button></div>`);
  },

  async addTemplate(jsonStr) {
    const t = JSON.parse(jsonStr);
    this.showCreateRule(t);
  },

  async deleteRule(id) {
    if (!confirm('Regel löschen?')) return;
    try { await ATLAS.api.delete(`/api/security-ai/rules/${id}`); ATLAS.ui.toast('Gelöscht','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  // ── Baselines Tab ──────────────────────────────────────────────────────────
  _renderBaselines(d) {
    const bl = d.baselines || [];
    document.getElementById('ai-content').innerHTML = `
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.securityAiPage.train()">🎓 Neu trainieren (30d)</button>
        <button class="btn btn-danger btn-sm" onclick="ATLAS.securityAiPage.resetBaselines()">⚠️ Zurücksetzen</button>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead><tr style="color:var(--text-muted);">
            <th style="text-align:left;padding:8px;">Metrik</th>
            <th style="text-align:right;padding:8px;">Mittelwert</th>
            <th style="text-align:right;padding:8px;">Std-Abw.</th>
            <th style="text-align:right;padding:8px;">Min</th>
            <th style="text-align:right;padding:8px;">Max</th>
            <th style="text-align:right;padding:8px;">Proben</th>
            <th style="text-align:left;padding:8px;">Aktualisiert</th>
          </tr></thead>
          <tbody>
            ${bl.map(b=>`<tr style="border-top:1px solid var(--border);">
              <td style="padding:8px;font-family:monospace;font-size:12px;">${b.metric}</td>
              <td style="padding:8px;text-align:right;">${(b.value_mean||0).toFixed(2)}</td>
              <td style="padding:8px;text-align:right;color:var(--text-muted);">±${(b.value_std||0).toFixed(2)}</td>
              <td style="padding:8px;text-align:right;color:var(--text-muted);">${b.value_min!=null?(b.value_min).toFixed(1):'–'}</td>
              <td style="padding:8px;text-align:right;color:var(--text-muted);">${b.value_max!=null?(b.value_max).toFixed(1):'–'}</td>
              <td style="padding:8px;text-align:right;">${b.sample_count||0}</td>
              <td style="padding:8px;color:var(--text-muted);font-size:11px;">${b.last_updated?.substring(0,16)||''}</td>
            </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted);">Noch keine Baselines gelernt. Training starten!</td></tr>'}
          </tbody>
        </table>
      </div>
      <div style="margin-top:16px;background:var(--surface-2);border-radius:10px;padding:12px;font-size:12px;color:var(--text-muted);">
        💡 Die KI lernt automatisch aus dem Systemverhalten und erkennt Abweichungen via Z-Score.
        Je mehr Daten, desto genauer die Erkennung. Falsch-Positive Meldungen verbessern die Baselines automatisch.
      </div>`;
  },

  // ── Report Tab ─────────────────────────────────────────────────────────────
  async _renderReport() {
    document.getElementById('ai-content').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">Bericht wird generiert…</div>';
    try {
      const r = await ATLAS.api.get('/api/security-ai/report');
      const maxC = Math.max(...(r.by_type||[]).map(x=>x.total), 1);
      document.getElementById('ai-content').innerHTML = `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Generiert: ${r.generated_at?.substring(0,19)||''} UTC · Zeitraum: letzte 30 Tage</div>

        <!-- By type -->
        <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
          <div style="font-weight:600;margin-bottom:10px;">🔍 Bedrohungen nach Typ</div>
          ${(r.by_type||[]).map(b=>`
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <div style="width:180px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.threat_type}</div>
              <div style="flex:1;background:var(--surface-3);border-radius:4px;height:16px;position:relative;">
                <div style="width:${Math.round((b.total/maxC)*100)}%;background:var(--primary);height:100%;border-radius:4px;"></div>
              </div>
              <div style="width:80px;font-size:11px;text-align:right;color:var(--text-muted);">${b.total} (${b.fp||0} FP)</div>
              <div style="width:50px;font-size:11px;text-align:right;color:var(--text-muted);">${Math.round((b.avg_conf||0)*100)}%</div>
            </div>`).join('') || '<div style="color:var(--text-muted);">Noch keine Daten</div>'}
        </div>

        <!-- Timeline heatmap -->
        ${r.timeline?.length ? `
        <div style="background:var(--surface-2);border-radius:10px;padding:16px;margin-bottom:16px;">
          <div style="font-weight:600;margin-bottom:10px;">📅 Timeline (30d)</div>
          <div style="display:flex;gap:3px;flex-wrap:wrap;">
            ${r.timeline.map(t=>{
              const c = {critical:'#e53935',high:'#f57c00',medium:'#fbc02d',low:'#10b981'}[t.severity]||'#607d8b';
              return `<div title="${t.day} ${t.severity}: ${t.c}" style="width:12px;height:12px;border-radius:2px;background:${c};opacity:${Math.min(1,0.2+t.c*0.2)};"></div>`;
            }).join('')}
          </div>
          <div style="display:flex;gap:10px;margin-top:8px;font-size:10px;color:var(--text-muted);">
            ${['critical','high','medium','low'].map(s=>`<span><span style="color:${{critical:'#e53935',high:'#f57c00',medium:'#fbc02d',low:'#10b981'}[s]};">■</span> ${s}</span>`).join('')}
          </div>
        </div>` : ''}

        <!-- Top IPs + Users -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div style="background:var(--surface-2);border-radius:10px;padding:14px;">
            <div style="font-weight:600;margin-bottom:8px;">🌐 Top Angreifer-IPs</div>
            ${(r.top_ips||[]).slice(0,5).map(ip=>`
              <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);">
                <span style="font-family:monospace;">${ip.source_ip}</span>
                <span style="color:var(--danger);">${ip.c}×</span>
              </div>`).join('') || '<div style="color:var(--text-muted);font-size:12px;">Keine Daten</div>'}
          </div>
          <div style="background:var(--surface-2);border-radius:10px;padding:14px;">
            <div style="font-weight:600;margin-bottom:8px;">👤 Betroffene Nutzer</div>
            ${(r.top_users||[]).slice(0,5).map(u=>`
              <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);">
                <span>${u.username||'#'+u.source_user_id}</span>
                <span style="color:var(--warning);">${u.c} Threats</span>
              </div>`).join('') || '<div style="color:var(--text-muted);font-size:12px;">Keine Daten</div>'}
          </div>
        </div>

        <!-- Auto-actions -->
        ${r.auto_actions?.length ? `
        <div style="background:var(--surface-2);border-radius:10px;padding:14px;margin-bottom:16px;">
          <div style="font-weight:600;margin-bottom:8px;">⚡ Automatische Aktionen (30d)</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${r.auto_actions.map(a=>`<div style="background:var(--surface-3);padding:8px 14px;border-radius:8px;font-size:13px;">
              <span style="font-weight:600;">${a.c}×</span> ${a.auto_action}
            </div>`).join('')}
          </div>
        </div>` : ''}`;
    } catch(e) {
      document.getElementById('ai-content').innerHTML = `<div style="color:var(--danger);padding:20px;">${e.message}</div>`;
    }
  },

  // ── Actions ────────────────────────────────────────────────────────────────
  async analyze() {
    const btn = document.querySelector('[onclick*="analyze()"]');
    if (btn) { btn.disabled=true; btn.textContent='⌛ Analysiere…'; }
    try {
      const r = await ATLAS.api.post('/api/security-ai/analyze', {});
      ATLAS.ui.toast(`Analyse: ${r.threats_created} neue Bedrohungen · Score: ${r.score?.toFixed(0)}`, r.threats_created > 0 ? 'warning' : 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
    finally { if (btn) { btn.disabled=false; btn.textContent='▶ Jetzt analysieren'; } }
  },

  async train() {
    const btn = document.querySelector('[onclick*="train()"]');
    if (btn) { btn.disabled=true; btn.textContent='⌛ Training…'; }
    try {
      const r = await ATLAS.api.post('/api/security-ai/baselines/train', {});
      ATLAS.ui.toast(`Training abgeschlossen: ${r.samples_processed} Datenpunkte verarbeitet`, 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
    finally { if (btn) { btn.disabled=false; btn.textContent='🎓 Training'; } }
  },

  async resetBaselines() {
    if (!confirm('Alle gelernten Baselines zurücksetzen? Die KI muss neu lernen.')) return;
    try { await ATLAS.api.post('/api/security-ai/baselines/reset', {}); ATLAS.ui.toast('Baselines zurückgesetzt','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  async resolve(id) {
    try { await ATLAS.api.put(`/api/security-ai/threats/${id}/resolve`, {}); ATLAS.ui.toast('Bedrohung gelöst','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  async feedback(id, type) {
    const label = type==='false_positive' ? 'Als Falsch-Positiv markieren (verbessert die KI)?' : 'Als bestätigt markieren?';
    if (!confirm(label)) return;
    try {
      await ATLAS.api.post(`/api/security-ai/threats/${id}/feedback`, {feedback: type});
      ATLAS.ui.toast(type==='false_positive' ? '👍 Als FP markiert — KI lernt' : '✅ Bestätigt','success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  async deleteT(id) {
    if (!confirm('Bedrohung löschen?')) return;
    try { await ATLAS.api.delete(`/api/security-ai/threats/${id}`); ATLAS.ui.toast('Gelöscht','success'); await this.load(); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },

  async blockIp(ip) {
    if (!confirm(`IP ${ip} für 2 Stunden sperren?`)) return;
    try { await ATLAS.api.post('/api/security/blacklist', {ip, reason:'Manual block from Security AI', hours:2}); ATLAS.ui.toast(`${ip} gesperrt`,'success'); } catch(e) { ATLAS.ui.toast(e.message,'error'); }
  },
};

/* ============================================================
   Bootstrap – runs after DOM + scripts are ready
============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ATLAS.init());
} else {
  ATLAS.init();
}

